import { useState } from "react";
import { StudentCardFormData } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LibraryCardForm from "@/components/LibraryCardForm";
import CardPreview from "@/components/CardPreview";
import AISuggestion from "@/components/AISuggestion";
import { apiRequest } from "@/lib/queryClient";
import { useForm } from "react-hook-form";

export default function Home() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentDepartment, setCurrentDepartment] = useState<string | null>(null);
  const [cardGenerated, setCardGenerated] = useState(false);
  const [photo, setPhoto] = useState<File | null>(null);
  
  // State for student data
  const [studentData, setStudentData] = useState<StudentCardFormData>({
    fullName: "",
    enrollmentNumber: "",
    department: "",
    course: "",
    semester: "",
    validityYears: 1
  });
  
  // Handle form submission
  const handleFormSubmit = async (data: StudentCardFormData, uploadedPhoto: File | null) => {
    setIsSubmitting(true);
    
    try {
      // Save to backend (optional based on requirements)
      await apiRequest("POST", "/api/student-cards", data);
      
      // Update local state for preview
      setStudentData(data);
      setPhoto(uploadedPhoto);
      setCardGenerated(true);
      
      toast({
        title: "Card Generated Successfully",
        description: "Your library card has been generated. You can now download it as PDF.",
        variant: "default"
      });
    } catch (error) {
      console.error("Error generating card:", error);
      toast({
        title: "Error",
        description: "Failed to generate your library card. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle AI suggestion acceptance
  const handleSuggestionAccept = (course: string) => {
    // Update student data with the suggested course
    setStudentData(prev => ({
      ...prev,
      course
    }));
    
    toast({
      title: "Course Selected",
      description: `Selected course: ${course}`,
      variant: "default"
    });
  };
  
  // Watch for department changes to provide AI suggestions
  const handleDepartmentChange = (department: string) => {
    setCurrentDepartment(department);
  };
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Header />
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden">
            <div className="p-6">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
                Generate Your Digital Library Card
              </h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Form Section */}
                <LibraryCardForm 
                  onSubmit={handleFormSubmit}
                  loading={isSubmitting}
                />
                
                {/* Card Preview Section */}
                <CardPreview 
                  student={studentData}
                  photo={photo}
                  onRefresh={() => setCardGenerated(false)}
                  disabled={!cardGenerated}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
      
      {/* AI Suggestion Component */}
      <AISuggestion 
        department={currentDepartment} 
        onAccept={handleSuggestionAccept}
      />
    </div>
  );
}
