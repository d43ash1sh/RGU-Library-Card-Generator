import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { X, Bot } from "lucide-react";
import { useAiSuggestions } from "@/hooks/use-ai-suggestions";
import { CourseRecommendation } from "../../server/ai";

interface AISuggestionProps {
  department: string | null;
  onAccept?: (course: string) => void;
}

export default function AISuggestion({ department, onAccept }: AISuggestionProps) {
  const {
    suggestions,
    message,
    isLoading,
    isError,
    isVisible,
    dismiss
  } = useAiSuggestions(department);
  
  if (!isVisible || !suggestions.length) return null;
  
  return (
    <div className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 w-80 z-50 transform transition-all duration-300 scale-100 opacity-100">
      <div className="flex items-start">
        <div className="flex-shrink-0 pt-0.5">
          <Bot className="h-5 w-5 text-primary-600 dark:text-primary-400" />
        </div>
        <div className="ml-3 w-0 flex-1">
          <p className="text-sm font-medium text-gray-900 dark:text-white">AI Suggestion</p>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {message}
          </p>
          
          {suggestions.map((suggestion: CourseRecommendation, index: number) => (
            <div key={index} className="mt-2 mb-2 text-sm">
              <p className="font-medium text-gray-700 dark:text-gray-300">{suggestion.course}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{suggestion.reason}</p>
              
              {suggestion.semester && (
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Recommended semester: {suggestion.semester}
                </p>
              )}
              
              {onAccept && (
                <Button
                  variant="secondary"
                  size="sm"
                  className="mt-1 text-xs"
                  onClick={() => {
                    onAccept(suggestion.course);
                    dismiss();
                  }}
                >
                  Select this course
                </Button>
              )}
            </div>
          ))}
        </div>
        <div className="ml-4 flex-shrink-0 flex">
          <Button
            variant="ghost"
            size="icon"
            onClick={dismiss}
            className="h-5 w-5 text-gray-400 hover:text-gray-500"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
