'use client';

import { useState } from 'react';
import type { Course, Assignment } from '@/lib/types';
import { MOCK_COURSES } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { BarChart as BarChartIcon, BookOpen, Calendar, Clock, PlusCircle, Target } from 'lucide-react';
import { format, formatDistanceToNow, parseISO } from 'date-fns';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, BarChart } from 'recharts';
import { generateStudyPlan } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

const addAssignmentSchema = z.object({
  name: z.string().min(1, 'Assignment name is required.'),
  dueDate: z.string().min(1, 'Due date is required.'),
});

export function DashboardClient() {
  const [courses, setCourses] = useState<Course[]>(MOCK_COURSES);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isAssignmentDialogOpen, setIsAssignmentDialogOpen] = useState(false);

  const form = useForm<z.infer<typeof addAssignmentSchema>>({
    resolver: zodResolver(addAssignmentSchema),
    defaultValues: { name: '', dueDate: '' },
  });

  const handleToggleAssignment = (courseId: string, assignmentId: string) => {
    setCourses(
      courses.map((course) =>
        course.id === courseId
          ? {
              ...course,
              assignments: course.assignments.map((assignment) =>
                assignment.id === assignmentId
                  ? { ...assignment, isCompleted: !assignment.isCompleted }
                  : assignment
              ),
            }
          : course
      )
    );
  };

  const handleAddAssignment = (values: z.infer<typeof addAssignmentSchema>) => {
    if (!selectedCourse) return;
    const newAssignment: Assignment = {
      id: `a-${Date.now()}`,
      name: values.name,
      dueDate: parseISO(values.dueDate).toISOString(),
      isCompleted: false,
    };
    setCourses(
      courses.map((course) =>
        course.id === selectedCourse.id
          ? { ...course, assignments: [...course.assignments, newAssignment] }
          : course
      )
    );
    form.reset();
    setIsAssignmentDialogOpen(false);
  };

  const allAssignments = courses.flatMap((c) => c.assignments);
  const completedAssignments = allAssignments.filter((a) => a.isCompleted);
  const overallProgress = allAssignments.length > 0 ? (completedAssignments.length / allAssignments.length) * 100 : 0;
  
  const upcomingAssignments = allAssignments
    .filter(a => !a.isCompleted && parseISO(a.dueDate) > new Date())
    .sort((a, b) => parseISO(a.dueDate).getTime() - parseISO(b.dueDate).getTime())
    .slice(0, 5);
  
  const chartData = courses.map(course => {
    const total = course.assignments.length;
    const completed = course.assignments.filter(a => a.isCompleted).length;
    const progress = total > 0 ? (completed / total) * 100 : 0;
    return { name: course.name, progress };
  });

  return (
    <div className="grid gap-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{courses.length}</div>
            <p className="text-xs text-muted-foreground">You are enrolled in {courses.length} courses.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assignments Due</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{allAssignments.filter(a => !a.isCompleted).length}</div>
            <p className="text-xs text-muted-foreground">{completedAssignments.length} completed</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Progress</CardTitle>
            <BarChartIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(overallProgress)}%</div>
            <Progress value={overallProgress} className="mt-2 h-2" />
          </CardContent>
        </Card>
        <StudyPlanGenerator courses={courses} />
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>My Courses</CardTitle>
            <CardDescription>Click on a course to view assignments.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <Dialog key={course.id} onOpenChange={(isOpen) => isOpen && setSelectedCourse(course)}>
                <DialogTrigger asChild>
                  <Card className="cursor-pointer hover:border-primary transition-colors">
                    <CardHeader className="flex-row items-center gap-4 space-y-0">
                      <course.icon className="h-8 w-8 text-primary" />
                      <CardTitle>{course.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{course.assignments.length} assignments</p>
                    </CardContent>
                  </Card>
                </DialogTrigger>
              </Dialog>
            ))}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Deadlines</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingAssignments.length > 0 ? upcomingAssignments.map(assignment => {
              const course = courses.find(c => c.assignments.some(a => a.id === assignment.id));
              return (
              <div key={assignment.id} className="flex items-start gap-4">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold">{assignment.name}</p>
                  <p className="text-sm text-muted-foreground">{course?.name}</p>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Due {formatDistanceToNow(parseISO(assignment.dueDate), { addSuffix: true })}
                  </p>
                </div>
              </div>
            )}) : (
              <div className="text-center text-muted-foreground py-8">
                <p>No upcoming deadlines.</p>
                <p className="text-sm">Enjoy your break!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Progress by Course</CardTitle>
          <CardDescription>Percentage of assignments completed in each course.</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={{ progress: { label: 'Progress', color: 'hsl(var(--primary))' } }} className="h-64">
            <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="name" tickLine={false} axisLine={false} tickMargin={8} />
              <YAxis unit="%" />
              <RechartsTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="progress" fill="hsl(var(--primary))" radius={4} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {selectedCourse && (
        <Dialog open={!!selectedCourse} onOpenChange={(isOpen) => !isOpen && setSelectedCourse(null)}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2"><selectedCourse.icon className="h-6 w-6 text-primary" /> {selectedCourse.name}</DialogTitle>
              <DialogDescription>
                Manage your assignments for this course.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 max-h-[60vh] overflow-y-auto p-1">
              {selectedCourse.assignments.sort((a, b) => parseISO(a.dueDate).getTime() - parseISO(b.dueDate).getTime()).map((assignment) => (
                <div key={assignment.id} className="flex items-center space-x-4 rounded-md border p-4">
                  <Checkbox
                    id={`assignment-${assignment.id}`}
                    checked={assignment.isCompleted}
                    onCheckedChange={() => handleToggleAssignment(selectedCourse.id, assignment.id)}
                  />
                  <div className="flex-1">
                    <label
                      htmlFor={`assignment-${assignment.id}`}
                      className={`font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${
                        assignment.isCompleted ? 'line-through text-muted-foreground' : ''
                      }`}
                    >
                      {assignment.name}
                    </label>
                    <p className="text-sm text-muted-foreground">
                      Due: {format(parseISO(assignment.dueDate), 'PPP')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
             <DialogFooter className="pt-4">
               <Dialog open={isAssignmentDialogOpen} onOpenChange={setIsAssignmentDialogOpen}>
                 <DialogTrigger asChild>
                    <Button><PlusCircle className="mr-2 h-4 w-4" /> Add Assignment</Button>
                 </DialogTrigger>
                 <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Assignment</DialogTitle>
                    </DialogHeader>
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(handleAddAssignment)} className="space-y-4">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Assignment Name</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., Chapter 5 Problem Set" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="dueDate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Due Date</FormLabel>
                              <FormControl>
                                <Input type="date" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <DialogFooter>
                          <Button type="submit">Save Assignment</Button>
                        </DialogFooter>
                      </form>
                    </Form>
                 </DialogContent>
               </Dialog>
             </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

function StudyPlanGenerator({ courses }: { courses: Course[] }) {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [studyPlan, setStudyPlan] = useState('');
  const [hours, setHours] = useState('4');

  const handleGenerate = async () => {
    setIsLoading(true);
    setStudyPlan('');
    const today = new Date();
    today.setHours(0,0,0,0);

    const formattedCourses = courses.map(c => ({
      name: c.name,
      assignments: c.assignments
        .filter(a => !a.isCompleted)
        .map(a => ({ name: a.name, dueDate: a.dueDate }))
    }));

    try {
      const result = await generateStudyPlan({
        courses: formattedCourses,
        availableStudyHours: parseInt(hours, 10),
        startDate: today.toISOString(),
      });
      setStudyPlan(result.studyPlan);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error generating study plan',
        description: 'Something went wrong. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Card className="flex flex-col cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">AI Study Plan</CardTitle>
              <Calendar className="h-4 w-4" />
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-center items-center text-center">
              <div className="text-2xl font-bold">Generate Plan</div>
              <p className="text-xs">Let AI create your schedule.</p>
            </CardContent>
        </Card>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Generate Your Personalized Study Plan</DialogTitle>
          <DialogDescription>
            Tell the AI how many hours you can study per day, and it will create a schedule based on your upcoming assignments.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="study-hours" className="text-right">
              Study Hours/Day
            </Label>
            <Input
              id="study-hours"
              type="number"
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        {isLoading && (
            <div className="flex items-center justify-center p-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        )}
        {studyPlan && (
          <div className="mt-4 p-4 border rounded-md max-h-[40vh] overflow-y-auto">
            <h3 className="font-semibold mb-2">Your Study Plan:</h3>
            <pre className="whitespace-pre-wrap text-sm font-sans">{studyPlan}</pre>
          </div>
        )}
        <DialogFooter>
          <Button onClick={handleGenerate} disabled={isLoading}>
            {isLoading ? 'Generating...' : 'Generate Plan'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
