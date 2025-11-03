import type { Course } from '@/lib/types';
import { BookOpen, Calculator, Dna, FlaskConical, Globe, History, BrainCircuit } from 'lucide-react';
import { addDays, formatISO } from 'date-fns';

export const MOCK_COURSES: Course[] = [
  {
    id: 'course-1',
    name: 'Calculus II',
    icon: Calculator,
    assignments: [
      { id: 'c1-a1', name: 'Problem Set 1', dueDate: formatISO(addDays(new Date(), 2)), isCompleted: true },
      { id: 'c1-a2', name: 'Midterm Exam', dueDate: formatISO(addDays(new Date(), 14)), isCompleted: false },
      { id: 'c1-a3', name: 'Final Project', dueDate: formatISO(addDays(new Date(), 35)), isCompleted: false },
    ],
  },
  {
    id: 'course-2',
    name: 'Organic Chemistry',
    icon: FlaskConical,
    assignments: [
      { id: 'c2-a1', name: 'Lab Report 1', dueDate: formatISO(addDays(new Date(), 5)), isCompleted: true },
      { id: 'c2-a2', name: 'Lab Report 2', dueDate: formatISO(addDays(new Date(), 12)), isCompleted: true },
      { id: 'c2-a3', name: 'Quiz 1', dueDate: formatISO(addDays(new Date(), 8)), isCompleted: false },
    ],
  },
  {
    id: 'course-3',
    name: 'World History',
    icon: Globe,
    assignments: [
      { id: 'c3-a1', name: 'Reading Response', dueDate: formatISO(addDays(new Date(), 3)), isCompleted: true },
      { id: 'c3-a2', name: 'Essay Outline', dueDate: formatISO(addDays(new Date(), 9)), isCompleted: true },
      { id: 'c3-a3', name: 'Research Paper', dueDate: formatISO(addDays(new Date(), 25)), isCompleted: false },
    ],
  },
  {
    id: 'course-4',
    name: 'Introduction to Genetics',
    icon: Dna,
    assignments: [
      { id: 'c4-a1', name: 'Chapter 1-3 Quiz', dueDate: formatISO(addDays(new Date(), 6)), isCompleted: true },
      { id: 'c4-a2', name: 'Punnett Square Practice', dueDate: formatISO(addDays(new Date(), 10)), isCompleted: false },
    ],
  },
   {
    id: 'course-5',
    name: 'English Literature',
    icon: BookOpen,
    assignments: [
      { id: 'c5-a1', name: 'Shakespeare Analysis', dueDate: formatISO(addDays(new Date(), 18)), isCompleted: true },
      { id: 'c5-a2', name: 'Poetry Portfolio', dueDate: formatISO(addDays(new Date(), 40)), isCompleted: false },
    ],
  },
  {
    id: 'course-6',
    name: 'Psychology 101',
    icon: BrainCircuit,
    assignments: [
      { id: 'c6-a1', name: 'Case Study 1', dueDate: formatISO(addDays(new Date(), 7)), isCompleted: true },
      { id: 'c6-a2', name: 'Midterm Paper', dueDate: formatISO(addDays(new Date(), 30)), isCompleted: false },
    ],
  },
  {
    id: 'course-7',
    name: 'Art History',
    icon: History,
    assignments: [
      { id: 'c7-a1', name: 'Museum Visit Report', dueDate: formatISO(addDays(new Date(), 15)), isCompleted: false },
      { id: 'c7-a2', name: 'Final Presentation', dueDate: formatISO(addDays(new Date(), 45)), isCompleted: false },
    ],
  },
];
