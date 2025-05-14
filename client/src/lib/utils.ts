import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format date as DD/MM/YYYY
export function formatDate(date: Date): string {
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

// Calculate validity date based on issue date and years
export function calculateValidityDate(issueDate: Date, years: number): Date {
  const validityDate = new Date(issueDate);
  validityDate.setFullYear(validityDate.getFullYear() + years);
  return validityDate;
}

// Convert file to base64
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result === "string") {
        // Remove the data URL prefix (e.g. "data:image/jpeg;base64,")
        const base64 = reader.result.split(",")[1];
        resolve(base64);
      } else {
        reject(new Error("Failed to convert file to base64"));
      }
    };
    reader.onerror = error => reject(error);
  });
}

// Convert data URL to blob for download
export function dataURLtoBlob(dataURL: string): Blob {
  const arr = dataURL.split(",");
  const mime = arr[0].match(/:(.*?);/)?.[1] || "image/png";
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  
  return new Blob([u8arr], { type: mime });
}

// Generate student ID if not provided
export function generateStudentId(name: string, department: string): string {
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  const deptCode = department.substring(0, 3).toUpperCase();
  const currentYear = new Date().getFullYear().toString().slice(-2);
  
  return `${randomNum}${deptCode}${currentYear}`;
}

// Extract department code from full department name
export function getDepartmentCode(department: string): string {
  // Handle special case for Computer Science & Engineering
  if (department === "Computer Science & Engineering") return "CSE";
  
  const words = department.split(" ");
  if (words.length === 1) {
    return department.substring(0, 3).toUpperCase();
  }
  
  // Take first letter of each word
  return words.map(word => word[0]).join("").toUpperCase();
}
