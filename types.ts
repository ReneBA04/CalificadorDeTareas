
export interface CriterionFeedback {
  criterion: string;
  score: number;
  feedback: string;
}

export interface EvaluationResult {
  overallScore: number;
  summary: string;
  criteriaFeedback: CriterionFeedback[];
}
