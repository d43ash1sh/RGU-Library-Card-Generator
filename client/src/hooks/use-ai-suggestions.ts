import { useState, useEffect } from "react";
import { apiRequest } from "@/lib/queryClient";
import { useQuery } from "@tanstack/react-query";
import { type CourseRecommendation, type AISuggestionResponse } from "../../server/ai";

export function useAiSuggestions(department: string | null) {
  const [isVisible, setIsVisible] = useState(false);
  
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["/api/suggestions", department],
    queryFn: async () => {
      if (!department) return null;
      
      const response = await fetch(`/api/suggestions?department=${encodeURIComponent(department)}`);
      if (!response.ok) {
        throw new Error("Failed to fetch AI suggestions");
      }
      return response.json() as Promise<AISuggestionResponse>;
    },
    enabled: !!department,
  });
  
  // When recommendations change and are available, show the toast
  useEffect(() => {
    if (data?.recommendations && data.recommendations.length > 0) {
      setIsVisible(true);
      
      // Auto-hide after 10 seconds
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 10000);
      
      return () => clearTimeout(timer);
    }
  }, [data?.recommendations]);
  
  const dismiss = () => setIsVisible(false);
  
  return {
    suggestions: data?.recommendations || [],
    message: data?.message || "",
    isLoading,
    isError,
    error,
    isVisible,
    dismiss
  };
}
