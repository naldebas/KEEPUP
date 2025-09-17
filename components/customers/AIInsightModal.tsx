
import React, { useState } from 'react';
import { api } from '../../sdk';
import type { Customer } from '../../types';
import Modal from '../ui/Modal';
import { Button } from '../ui/Button';
import { Textarea } from '../ui/Textarea';
import { SparkleIcon } from '../shared/icons';
import { useToasts } from '../../context/ToastContext';

interface AIInsightModalProps {
  isOpen: boolean;
  onClose: () => void;
  customers: Customer[];
}

const AIInsightModal: React.FC<AIInsightModalProps> = ({ isOpen, onClose, customers }) => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { addToast } = useToasts();
  
  const examplePrompts = [
      "Which loyalty tier has the most customers?",
      "Identify customers who haven't been seen in the last 30 days.",
      "Are there any customers with duplicate names?",
      "Summarize the distribution of my customers across different tiers."
  ]

  const handleGenerate = async () => {
    if (!prompt) return;
    setIsLoading(true);
    setResponse('');
    try {
      const stream = api.customers.generateInsightsStream(customers, prompt);
      for await (const text of stream) {
        setResponse(prev => prev + text);
      }
    } catch (error: any) {
      addToast(error.message || 'Failed to generate insights.', 'error');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handlePromptSuggestion = (suggestion: string) => {
    setPrompt(suggestion);
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Customer AI Insights">
      <div className="space-y-4">
        <div className="p-4 bg-gray-50 border rounded-lg min-h-[200px] max-h-[40vh] overflow-y-auto">
          {isLoading && !response && (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500 animate-pulse">Thinking...</p>
            </div>
          )}
          {response ? (
            <p className="text-sm text-gray-800 whitespace-pre-wrap">{response}</p>
          ) : !isLoading ? (
            <div className="text-center text-gray-500">
                <p className="mb-4">Ask a question about your customers to get started.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {examplePrompts.map(p => (
                        <button key={p} onClick={() => handlePromptSuggestion(p)} className="p-2 bg-gray-200 rounded-md hover:bg-gray-300 text-left">
                           "{p}"
                        </button>
                    ))}
                </div>
            </div>
          ) : null}
        </div>
        <div>
          <label htmlFor="ai-prompt" className="block text-sm font-medium text-gray-700 sr-only">
            Your Question
          </label>
          <Textarea
            id="ai-prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., How many customers are in the Gold tier?"
            rows={3}
            disabled={isLoading}
          />
        </div>
        <div className="flex justify-end">
          <Button onClick={handleGenerate} disabled={isLoading || !prompt} variant="primary">
            <SparkleIcon className="h-4 w-4 mr-2" />
            {isLoading ? 'Generating...' : 'Generate Insight'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default AIInsightModal;
