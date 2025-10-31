'use server';
/**
 * @fileOverview An AI agent to summarize learning materials from various sources.
 *
 * - summarizeLearningMaterial - A function that summarizes learning materials.
 * - SummarizeLearningMaterialInput - The input type for the summarizeLearningMaterial function.
 * - SummarizeLearningMaterialOutput - The return type for the summarizeLearningMaterial function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeLearningMaterialInputSchema = z.object({
  material: z.string().describe('The learning material to summarize. This could be text content, a link to a webpage, or the content of a PDF.'),
});
export type SummarizeLearningMaterialInput = z.infer<typeof SummarizeLearningMaterialInputSchema>;

const SummarizeLearningMaterialOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the learning material.'),
  progress: z.string().describe('Short summary of what has been generated.'),
});
export type SummarizeLearningMaterialOutput = z.infer<typeof SummarizeLearningMaterialOutputSchema>;

export async function summarizeLearningMaterial(input: SummarizeLearningMaterialInput): Promise<SummarizeLearningMaterialOutput> {
  return summarizeLearningMaterialFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeLearningMaterialPrompt',
  input: {schema: SummarizeLearningMaterialInputSchema},
  output: {schema: SummarizeLearningMaterialOutputSchema},
  prompt: `You are an expert summarizer of learning materials. Please provide a concise and informative summary of the following material:\n\n{{material}}`,
});

const summarizeLearningMaterialFlow = ai.defineFlow(
  {
    name: 'summarizeLearningMaterialFlow',
    inputSchema: SummarizeLearningMaterialInputSchema,
    outputSchema: SummarizeLearningMaterialOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    // Add a short summary of what has been generated to the progress field
    output!.progress = 'Generated a concise summary of the learning material.';
    return output!;
  }
);
