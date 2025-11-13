
import React, { useState, useCallback } from 'react';
import { extractTextFromPdf } from './services/pdfService';
import { analyzeDocument } from './services/geminiService';
import { type EvaluationResult } from './types';
import Header from './components/Header';
import FileUpload from './components/FileUpload';
import EvaluationResultDisplay from './components/EvaluationResultDisplay';
import Loader from './components/Loader';
import { FileIcon, AlertTriangleIcon } from './components/Icons';

const App: React.FC = () => {
  const [paperFile, setPaperFile] = useState<File | null>(null);
  const [rubricFile, setRubricFile] = useState<File | null>(null);
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = useCallback(async () => {
    if (!paperFile || !rubricFile) {
      setError('Please upload both the academic paper and the rubric PDF files.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setEvaluation(null);

    try {
      const [paperText, rubricText] = await Promise.all([
        extractTextFromPdf(paperFile),
        extractTextFromPdf(rubricFile),
      ]);
      
      if (!paperText.trim() || !rubricText.trim()) {
        throw new Error("Could not extract text from one or both PDFs. Please ensure they are text-based.");
      }

      const result = await analyzeDocument(paperText, rubricText);
      setEvaluation(result);
    } catch (err) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred during analysis.';
      setError(`Analysis Failed: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  }, [paperFile, rubricFile]);

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg border border-gray-200 p-6 md:p-10">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Get AI-Powered Feedback</h2>
            <p className="text-gray-500 mt-2 max-w-2xl mx-auto">
              Upload an academic paper and its evaluation rubric. Our AI will analyze the document and provide detailed, criteria-based feedback and scores.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <FileUpload
              id="paper-upload"
              label="Academic Paper"
              onFileSelect={setPaperFile}
              file={paperFile}
            />
            <FileUpload
              id="rubric-upload"
              label="Evaluation Rubric"
              onFileSelect={setRubricFile}
              file={rubricFile}
            />
          </div>
          
          <div className="text-center">
            <button
              onClick={handleAnalyze}
              disabled={!paperFile || !rubricFile || isLoading}
              className="w-full md:w-auto inline-flex items-center justify-center px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {isLoading ? (
                <>
                  <Loader />
                  Analyzing...
                </>
              ) : (
                'Analyze Document'
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="max-w-4xl mx-auto mt-8 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded-md flex items-start">
             <AlertTriangleIcon className="h-6 w-6 mr-3 flex-shrink-0" />
            <div>
              <p className="font-bold">Error</p>
              <p>{error}</p>
            </div>
          </div>
        )}
        
        {evaluation && !isLoading && (
          <div className="max-w-4xl mx-auto mt-8">
            <EvaluationResultDisplay result={evaluation} />
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
