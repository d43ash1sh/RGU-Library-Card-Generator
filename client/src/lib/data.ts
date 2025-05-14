// University departments data
export const DEPARTMENTS = [
  "Anthropology",
  "Botany",
  "Chemistry",
  "Commerce",
  "Computer Science & Engineering",
  "Economics",
  "Education",
  "English",
  "Geography",
  "Hindi",
  "History",
  "Law",
  "Management",
  "Mass Communication",
  "Mathematics & Computing",
  "Physics",
  "Political Science",
  "Psychology",
  "Sociology",
  "Tribal Studies",
  "Zoology"
];

// University courses data
export const COURSES = [
  "BA in Anthropology",
  "BA in Economics",
  "BA in English",
  "BA in Hindi",
  "BA in History",
  "BA in Political Science",
  "BA in Sociology",
  "BSc in Botany",
  "BSc in Chemistry",
  "BSc in Physics",
  "BSc in Zoology",
  "BSc in Geography",
  "BSc in Mathematics",
  "BCom",
  "BCA",
  "BEd",
  "MA in Economics",
  "MA in English",
  "MA in History",
  "MA in Hindi",
  "MA in Political Science",
  "MA in Sociology",
  "MSc in Botany",
  "MSc in Chemistry",
  "MSc in Physics",
  "MSc in Zoology",
  "MSc in Geography",
  "MSc in Mathematics",
  "MCom",
  "MCA",
  "MTech in Computer Science & Engineering",
  "MTech in Electronics & Communication",
  "LLB",
  "LLM",
  "Diploma in Computerized Accounting (DCA)",
  "PG Diploma in Yoga Therapy Education (PGDYTE)",
  "Certificate Course in Communicative English (CCCE)",
  "Certificate in Strength Training & Conditioning (CCSTC)"
];

// Semester options
export const SEMESTERS = [
  "1st",
  "2nd",
  "3rd",
  "4th",
  "5th",
  "6th",
  "7th",
  "8th"
];

// Map departments to appropriate courses
export const DEPARTMENT_TO_COURSES: Record<string, string[]> = {
  "Anthropology": ["BA in Anthropology", "MA in Anthropology"],
  "Botany": ["BSc in Botany", "MSc in Botany"],
  "Chemistry": ["BSc in Chemistry", "MSc in Chemistry"],
  "Commerce": ["BCom", "MCom", "Diploma in Computerized Accounting (DCA)"],
  "Computer Science & Engineering": [
    "BCA", 
    "MCA", 
    "MTech in Computer Science & Engineering"
  ],
  "Economics": ["BA in Economics", "MA in Economics"],
  "Education": ["BEd", "Certificate in Strength Training & Conditioning (CCSTC)"],
  "English": [
    "BA in English", 
    "MA in English", 
    "Certificate Course in Communicative English (CCCE)"
  ],
  "Geography": ["BSc in Geography", "MSc in Geography"],
  "Hindi": ["BA in Hindi", "MA in Hindi"],
  "History": ["BA in History", "MA in History"],
  "Law": ["LLB", "LLM"],
  "Management": ["BCom", "MCom"],
  "Mass Communication": ["BA in Sociology", "MA in Sociology"],
  "Mathematics & Computing": ["BSc in Mathematics", "MSc in Mathematics"],
  "Physics": ["BSc in Physics", "MSc in Physics"],
  "Political Science": ["BA in Political Science", "MA in Political Science"],
  "Psychology": ["BA in Sociology", "MA in Sociology"],
  "Sociology": ["BA in Sociology", "MA in Sociology"],
  "Tribal Studies": ["BA in Sociology", "MA in Sociology"],
  "Zoology": ["BSc in Zoology", "MSc in Zoology"]
};

// Helper function to get courses for a given department
export function getCoursesForDepartment(department: string): string[] {
  return DEPARTMENT_TO_COURSES[department] || COURSES;
}
