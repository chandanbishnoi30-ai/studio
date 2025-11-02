'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

const teachers = [
  {
    name: 'Arvind Khilery',
    subject: 'Maths',
    avatar: 'https://i.pravatar.cc/150?u=arvind',
    fallback: 'AK',
  },
];

export function TeacherInfoView() {
  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Teacher Information</CardTitle>
          <CardDescription>Information about your teachers.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {teachers.map((teacher, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={teacher.avatar} alt={teacher.name} />
                  <AvatarFallback>{teacher.fallback}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold">{teacher.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {teacher.subject}
                  </p>
                </div>
              </CardHeader>
            </Card>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
