'use server';

import { generatePersonalizedStudyPlan as generatePlan, StudyPlanInput } from '@/ai/flows/generate-personalized-study-plan';
import { summarizeLearningMaterial as summarize, SummarizeLearningMaterialInput } from '@/ai/flows/summarize-learning-material';

export async function generateStudyPlan(input: StudyPlanInput) {
  try {
    const result = await generatePlan(input);
    return result;
  } catch (error) {
    console.error('Error in generateStudyPlan action:', error);
    throw new Error('Failed to generate study plan.');
  }
}

export async function summarizeLearningMaterial(input: SummarizeLearningMaterialInput) {
  try {
    const result = await summarize(input);
    return result;
  } catch (error) {
    console.error('Error in summarizeLearningMaterial action:', error);
    throw new Error('Failed to summarize material.');
  }
}
