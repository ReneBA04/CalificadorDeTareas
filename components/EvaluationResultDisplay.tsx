
import React from 'react';
import { type EvaluationResult, type CriterionFeedback } from '../types';

const getScoreColor = (score: number): string => {
  if (score >= 8) return 'bg-green-100 text-green-800 border-green-400';
  if (score >= 5) return 'bg-yellow-100 text-yellow-800 border-yellow-400';
  return 'bg-red-100 text-red-800 border-red-400';
};

const CriterionCard: React.FC<{ item: CriterionFeedback }> = ({ item }) => (
  <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 transition-shadow hover:shadow-md">
    <div className="flex justify-between items-start">
      <h4 className="text-lg font-semibold text-gray-800 pr-4">{item.criterion}</h4>
      <div className={`flex-shrink-0 font-bold text-lg px-3 py-1 rounded-full text-center ${getScoreColor(item.score)}`}>
        {item.score.toFixed(1)}
      </div>
    </div>
    <p className="mt-3 text-gray-600">{item.feedback}</p>
  </div>
);

const EvaluationResultDisplay: React.FC<{ result: EvaluationResult }> = ({ result }) => {
  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold text-center text-gray-900">Evaluation Complete</h2>
      </div>
      
      {/* Overall Score and Summary */}
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 grid md:grid-cols-3 gap-6 items-center">
        <div className="text-center">
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Overall Score</p>
          <div className={`mt-2 text-6xl font-extrabold ${getScoreColor(result.overallScore).split(' ')[1]}`}>
            {result.overallScore.toFixed(1)}
          </div>
          <p className="text-lg font-medium text-gray-600">/ 10.0</p>
        </div>
        <div className="md:col-span-2">
            <h3 className="text-xl font-semibold text-gray-800">Summary</h3>
            <p className="mt-2 text-gray-600">{result.summary}</p>
        </div>
      </div>
      
      {/* Criteria Breakdown */}
      <div>
        <h3 className="text-2xl font-bold text-gray-800 mb-4">Criteria Breakdown</h3>
        <div className="space-y-4">
          {result.criteriaFeedback.map((item, index) => (
            <CriterionCard key={index} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default EvaluationResultDisplay;
