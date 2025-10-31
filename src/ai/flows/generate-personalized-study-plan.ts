'use server';

/**
 * @fileOverview Generates a personalized study plan based on user inputs.
 *
 * - generatePersonalizedStudyPlan - A function that generates a personalized study plan.
 * - StudyPlanInput - The input type for the generatePersonalizedStudyPlan function.
 * - StudyPlanOutput - The return type for the generatePersonalizedStudyPlan function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const StudyPlanInputSchema = z.object({
  courses: z
    .array(
      z.object({
        name: z.string().describe('The name of the course.'),
        assignments: z.array(
          z.object({
            name: z.string().describe('The name of the assignment.'),
            dueDate: z.string().describe('The due date of the assignment (ISO format).'),
          })
        ).describe('A list of assignments for the course.'),
      })
    )
    .describe('A list of courses with their respective assignments and due dates.'),
  availableStudyHours: z
    .number()
    .describe('The number of hours available to study each day.'),
  startDate: z.string().describe('The desired start date for the study plan (ISO format).'),
});
export type StudyPlanInput = z.infer<typeof StudyPlanInputSchema>;

const StudyPlanOutputSchema = z.object({
  studyPlan: z
    .string()
    .describe('A personalized study plan outlining what to study each day.'),
});
export type StudyPlanOutput = z.infer<typeof StudyPlanOutputSchema>;

export async function generatePersonalizedStudyPlan(
  input: StudyPlanInput
): Promise<StudyPlanOutput> {
  return generatePersonalizedStudyPlanFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generatePersonalizedStudyPlanPrompt',
  input: {schema: StudyPlanInputSchema},
  output: {schema: StudyPlanOutputSchema},
  prompt: `You are an AI study plan generator. Your task is to create a personalized study plan for a student, given their courses, assignment deadlines, available study hours, and desired start date.

Here are the courses and assignments:
{{#each courses}}
Course: {{name}}
Assignments:
{{#each assignments}}
- {{name}} (Due: {{dueDate}})
{{/each}}
{{/each}}

Available Study Hours: {{availableStudyHours}}
Start Date: {{startDate}}

Study Plan:
`, // Ensure the prompt ends with 'Study Plan:' to guide the output.
});

const generatePersonalizedStudyPlanFlow = ai.defineFlow(
  {
    name: 'generatePersonalizedStudyPlanFlow',
    inputSchema: StudyPlanInputSchema,
    outputSchema: StudyPlanOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
