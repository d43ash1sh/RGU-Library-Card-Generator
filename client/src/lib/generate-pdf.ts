import { jsPDF } from "jspdf";
import JsBarcode from "jsbarcode";
import { StudentCardFormData } from "@shared/schema";
import { formatDate, calculateValidityDate } from "./utils";

// Create an SVG element for barcode generation
function createSVGElement(): SVGSVGElement {
  return document.createElementNS("http://www.w3.org/2000/svg", "svg");
}

// Generate barcode as data URL
function generateBarcodeDataURL(text: string): string {
  const svg = createSVGElement();
  JsBarcode(svg, text, {
    format: "CODE128",
    lineColor: "#000",
    width: 2,
    height: 50,
    displayValue: false
  });
  
  const svgStr = new XMLSerializer().serializeToString(svg);
  return "data:image/svg+xml;base64," + btoa(svgStr);
}

// Generate a digital library card PDF
export async function generateLibraryCardPDF(
  cardData: StudentCardFormData,
  photoUrl?: string
): Promise<string> {
  // Create a new PDF document
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: [210, 297]
  });
  
  // Set background color (white)
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, 297, 210, "F");
  
  // Add university logo (using a base64 encoded logo)
  const logoUrl = "https://upload.wikimedia.org/wikipedia/commons/e/e3/RGU_logo.png";
  try {
    const logoImg = await fetchImageAsBase64(logoUrl);
    doc.addImage(logoImg, "PNG", 20, 15, 40, 40);
  } catch (error) {
    console.error("Error loading university logo:", error);
  }
  
  // Add heading
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text("Rajiv Gandhi University", 70, 25);
  
  doc.setFontSize(16);
  doc.setFont("helvetica", "normal");
  doc.text("Rono-Hills, Doimukh", 70, 35);
  
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("Library", 70, 45);
  
  // Add "Membership Smart Card" title
  doc.setFontSize(18);
  doc.setTextColor(231, 76, 60); // Red color similar to accent-500
  doc.text("Membership Smart Card", 70, 60);
  
  // Reset text color to black
  doc.setTextColor(0, 0, 0);
  
  // Add student photo
  if (photoUrl) {
    try {
      doc.addImage(photoUrl, "JPEG", 20, 70, 40, 50);
    } catch (error) {
      console.error("Error loading student photo:", error);
      
      // Add a placeholder if photo fails to load
      doc.setFillColor(220, 220, 220);
      doc.rect(20, 70, 40, 50, "F");
      doc.setFontSize(10);
      doc.setTextColor(150, 150, 150);
      doc.text("No Photo", 30, 95);
      doc.setTextColor(0, 0, 0);
    }
  } else {
    // Add a placeholder if no photo
    doc.setFillColor(220, 220, 220);
    doc.rect(20, 70, 40, 50, "F");
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text("No Photo", 30, 95);
    doc.setTextColor(0, 0, 0);
  }
  
  // Add enrollment number below photo
  doc.setFontSize(10);
  doc.text(cardData.enrollmentNumber, 20, 130);
  
  // Add student details
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text(`${cardData.fullName}`, 70, 80);
  
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text(`${cardData.course} Student`, 70, 90);
  
  doc.setFontSize(10);
  doc.text(`Dept. of ${cardData.department}`, 70, 100);
  
  // Add barcode
  try {
    const barcodeDataUrl = generateBarcodeDataURL(cardData.enrollmentNumber);
    doc.addImage(barcodeDataUrl, "PNG", 70, 110, 120, 20);
  } catch (error) {
    console.error("Error generating barcode:", error);
  }
  
  // Add dates
  const issueDate = new Date();
  const validityDate = calculateValidityDate(issueDate, cardData.validityYears);
  
  doc.setFontSize(12);
  doc.setTextColor(231, 76, 60); // Red color for headings
  doc.text("Date of issue", 70, 150);
  doc.text("Validity", 170, 150);
  
  doc.setTextColor(0, 0, 0); // Reset color
  doc.setFontSize(14);
  doc.text(formatDate(issueDate), 70, 160);
  doc.text(formatDate(validityDate), 170, 160);
  
  // Add instructions (back of card)
  doc.addPage();
  
  // Add title for instructions
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("Instruction:", 20, 20);
  
  // Add university logo watermark
  try {
    const logoImg = await fetchImageAsBase64(logoUrl);
    // Set transparency
    doc.saveGraphicsState();
    doc.setGState(doc.addGState({ opacity: 0.1 }));
    doc.addImage(logoImg, "PNG", 80, 60, 100, 100);
    doc.restoreGraphicsState();
  } catch (error) {
    console.error("Error loading university logo for watermark:", error);
  }
  
  // Add instructions
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  
  const instructions = [
    "- No Library books will be issued without this card",
    "- Check the book before borrowing whether it is mutilated or damaged",
    "- Return books on time",
    "- Library books & membership ID transferable",
    "- Holder of this card will be responsible for the book",
    "- This card must deposited while leaving the university",
    "- Report the loss of borrowing card and books",
    "- If you lose this card please report to - 0360-2277573, 0360-2277094"
  ];
  
  let yPos = 30;
  instructions.forEach(instruction => {
    doc.text(instruction, 20, yPos);
    yPos += 8;
  });
  
  // Add librarian signature
  doc.setFontSize(10);
  doc.text("Librarian", 250, 150);
  
  // Return the PDF as a data URL
  return doc.output("dataurlstring");
}

// Helper function to fetch an image and convert it to base64
async function fetchImageAsBase64(url: string): Promise<string> {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    throw new Error(`Failed to fetch image: ${error}`);
  }
}
