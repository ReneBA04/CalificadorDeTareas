
import { GoogleGenAI, Type } from "@google/genai";
import { type EvaluationResult } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const evaluationSchema = {
  type: Type.OBJECT,
  properties: {
    overallScore: {
      type: Type.NUMBER,
      description: "The final average score from 0 to 10, rounded to one decimal place.",
    },
    summary: {
      type: Type.STRING,
      description: "A final summary of the overall evaluation, highlighting strengths and key areas for improvement.",
    },
    criteriaFeedback: {
      type: Type.ARRAY,
      description: "An array of feedback objects for each criterion in the rubric.",
      items: {
        type: Type.OBJECT,
        properties: {
          criterion: {
            type: Type.STRING,
            description: "The name of the evaluation criterion from the rubric.",
          },
          score: {
            type: Type.NUMBER,
            description: "The numerical score assigned for this criterion, from 0 to 10.",
          },
          feedback: {
            type: Type.STRING,
            description: "Detailed, objective, and constructive feedback for this specific criterion, explaining the reasoning for the score.",
          },
        },
        required: ["criterion", "score", "feedback"],
      },
    },
  },
  required: ["overallScore", "summary", "criteriaFeedback"],
};


export const analyzeDocument = async (paperText: string, rubricText: string): Promise<EvaluationResult> => {
  const model = "gemini-2.5-pro";

  const prompt = `
    ROLE: You are an expert academic evaluator specializing in writing, grammar, and content analysis. Your task is to read and grade an academic document based on a provided rubric.

    INSTRUCTIONS:
    1.  Carefully read the entire academic paper provided.
    2.  Carefully read the evaluation rubric provided.
    3.  Analyze and evaluate the paper against EACH criterion listed in the rubric.
    4.  Assign a numerical score from 0 to 10 for each criterion.
    5.  Provide clear, objective, and constructive feedback for each criterion, justifying the score.
    6.  Calculate a final overall score by averaging the scores of all criteria.
    7.  Write a final summary of the paper's evaluation, highlighting strengths and major areas for improvement.
    8.  Return the entire evaluation in the specified JSON format.

    ACADEMIC PAPER TEXT:
    ---
    ${paperText}
    ---

    EVALUATION RUBRIC TEXT:
    ---
    ${rubricText}
    ---
    `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: evaluationSchema,
        temperature: 0.2,
      },
    });
    
    const jsonString = response.text.trim();
    const result: EvaluationResult = JSON.parse(jsonString);

    if (!result.criteriaFeedback || !result.hasOwnProperty('overallScore')) {
        throw new Error("AI response is missing required fields. Please try again.");
    }
    
    return result;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to get a valid response from the AI model.");
  }
};
