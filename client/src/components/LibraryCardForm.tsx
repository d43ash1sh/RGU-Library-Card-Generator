import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";
import { studentCardFormSchema, StudentCardFormData } from "@shared/schema";
import { DEPARTMENTS, COURSES, SEMESTERS, getCoursesForDepartment } from "@/lib/data";
import UploadPhoto from "./UploadPhoto";

interface LibraryCardFormProps {
  onSubmit: (data: StudentCardFormData, photo: File | null) => void;
  loading?: boolean;
}

export default function LibraryCardForm({ onSubmit, loading = false }: LibraryCardFormProps) {
  const [photo, setPhoto] = useState<File | null>(null);
  const [filteredCourses, setFilteredCourses] = useState<string[]>(COURSES);
  
  // Initialize form with default values
  const form = useForm<StudentCardFormData>({
    resolver: zodResolver(studentCardFormSchema),
    defaultValues: {
      fullName: "",
      enrollmentNumber: "",
      department: "",
      course: "",
      semester: "",
      validityYears: 1
    }
  });
  
  // Watch for department changes to filter courses
  const department = form.watch("department");
  
  useEffect(() => {
    if (department) {
      setFilteredCourses(getCoursesForDepartment(department));
      
      // Clear course if it's not in the filtered list
      const currentCourse = form.getValues("course");
      if (currentCourse && !getCoursesForDepartment(department).includes(currentCourse)) {
        form.setValue("course", "");
      }
    } else {
      setFilteredCourses(COURSES);
    }
  }, [department, form]);
  
  // Handle form submission
  const handleSubmit = (data: StudentCardFormData) => {
    onSubmit(data, photo);
  };
  
  return (
    <div className="space-y-6">
      <Alert className="mb-6 bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800">
        <InfoIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
        <AlertDescription className="text-sm text-blue-700 dark:text-blue-300">
          Complete the form below to generate your personalized digital library card. All fields are required.
        </AlertDescription>
      </Alert>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {/* Personal Details Section */}
          <div className="rounded-md bg-gray-50 dark:bg-gray-700/30 p-4">
            <h3 className="text-md font-medium text-gray-900 dark:text-white mb-4">Personal Details</h3>
            
            <div className="space-y-4">
              {/* Full Name */}
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter your full name" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Enrollment Number */}
              <FormField
                control={form.control}
                name="enrollmentNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Enrollment Number</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g., 1446RGUST23" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          
          {/* Academic Details Section */}
          <div className="rounded-md bg-gray-50 dark:bg-gray-700/30 p-4">
            <h3 className="text-md font-medium text-gray-900 dark:text-white mb-4">Academic Details</h3>
            
            <div className="space-y-4">
              {/* Department */}
              <FormField
                control={form.control}
                name="department"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your department" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {DEPARTMENTS.map((dept) => (
                          <SelectItem key={dept} value={dept}>
                            {dept}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Course */}
              <FormField
                control={form.control}
                name="course"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Course</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your course" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {filteredCourses.map((course) => (
                          <SelectItem key={course} value={course}>
                            {course}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Semester */}
              <FormField
                control={form.control}
                name="semester"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Semester</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your semester" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {SEMESTERS.map((semester) => (
                          <SelectItem key={semester} value={semester}>
                            {semester} Semester
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Validity Years */}
              <FormField
                control={form.control}
                name="validityYears"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Validity Year</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="1" 
                        max="5" 
                        placeholder="Number of years (1-5)" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          
          {/* Photo Upload */}
          <UploadPhoto onPhotoChange={setPhoto} />
          
          <div className="flex justify-end space-x-3">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => {
                form.reset();
                setPhoto(null);
              }}
            >
              Reset Form
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Generating..." : "Generate Card"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
