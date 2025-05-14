import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || '' });

const departmentCourseMappings = {
  "Anthropology": ["BA in Anthropology", "MA in Anthropology"],
  "Botany": ["BSc in Botany", "MSc in Botany"],
  "Chemistry": ["BSc in Chemistry", "MSc in Chemistry"],
  "Commerce": ["BCom", "MCom"],
  "Computer Science & Engineering": ["BCA", "MCA", "MTech in Computer Science & Engineering"],
  "Economics": ["BA in Economics", "MA in Economics"],
  "Education": ["BEd", "MEd"],
  "English": ["BA in English", "MA in English"],
  "Geography": ["BSc in Geography", "MSc in Geography"],
  "Hindi": ["BA in Hindi", "MA in Hindi"],
  "History": ["BA in History", "MA in History"],
  "Law": ["LLB", "LLM"],
  "Management": ["MBA"],
  "Mass Communication": ["BA in Mass Communication", "MA in Mass Communication"],
  "Mathematics & Computing": ["BSc in Mathematics", "MSc in Mathematics"],
  "Physics": ["BSc in Physics", "MSc in Physics"],
  "Political Science": ["BA in Political Science", "MA in Political Science"],
  "Psychology": ["BA in Psychology", "MA in Psychology"],
  "Sociology": ["BA in Sociology", "MA in Sociology"],
  "Tribal Studies": ["BA in Tribal Studies", "MA in Tribal Studies"],
  "Zoology": ["BSc in Zoology", "MSc in Zoology"]
};

export type CourseRecommendation = {
  course: string;
  reason: string;
  semester?: string;
};

export type AISuggestionResponse = {
  recommendations: CourseRecommendation[];
  message: string;
};

export async function getAISuggestions(department: string): Promise<AISuggestionResponse> {
  try {
    // First try to use pre-defined mappings for quick response and to reduce API calls
    if (department in departmentCourseMappings) {
      const courses = departmentCourseMappings[department as keyof typeof departmentCourseMappings];
      
      // Generate a simple response for mapped departments
      const recommendations: CourseRecommendation[] = courses.map(course => ({
        course,
        reason: `${course} is a popular choice in the ${department} department.`,
        semester: ["1st", "3rd"].includes(course.startsWith("B") ? "1st" : "3rd") ? 
          (course.startsWith("B") ? "1st" : "3rd") : undefined
      }));
      
      return {
        recommendations,
        message: `Here are some recommended courses for ${department}`
      };
    }
    
    // For departments not in our mapping or to get more intelligent suggestions
    // use the OpenAI API
    if (process.env.OPENAI_API_KEY) {
      const prompt = `
        I am a student at Rajiv Gandhi University, Arunachal Pradesh, interested in the ${department} department.
        Please suggest a course and semester that would be appropriate for me based on this department.
        Respond with JSON in this format: 
        { 
          "recommendations": [
            { "course": "course name", "reason": "reason for recommendation", "semester": "recommended semester" }
          ],
          "message": "A short message explaining the recommendations"
        }
      `;

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" }
      });

      const result = JSON.parse(response.choices[0].message.content) as AISuggestionResponse;
      return result;
    } else {
      // Fallback if no OpenAI API key is available
      return {
        recommendations: [{
          course: "Course related to " + department,
          reason: "This is a general recommendation as we couldn't access the AI service."
        }],
        message: "AI suggestions are limited without the OpenAI API key."
      };
    }
  } catch (error) {
    console.error("Error getting AI suggestions:", error);
    
    // Return a fallback suggestion
    return {
      recommendations: [{
        course: "General course in " + department,
        reason: "This is a fallback recommendation."
      }],
      message: "We encountered an issue generating personalized recommendations."
    };
  }
}
