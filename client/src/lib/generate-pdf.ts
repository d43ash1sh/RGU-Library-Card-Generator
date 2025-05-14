import { jsPDF } from "jspdf";
import JsBarcode from "jsbarcode";
import { StudentCardFormData } from "@shared/schema";
import { formatDate, calculateValidityDate, generateRandomBarcode } from "./utils";
import rguLogo from "@assets/rgu_logo.png";

// Create an SVG element for barcode generation
function createSVGElement(): SVGSVGElement {
  return document.createElementNS("http://www.w3.org/2000/svg", "svg");
}

// Generate barcode as data URL
function generateBarcodeDataURL(text?: string): string {
  // Generate random barcode if text is not provided
  const barcodeValue = text || generateRandomBarcode();
  
  const svg = createSVGElement();
  JsBarcode(svg, barcodeValue, {
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
  // Create a new PDF document - card size in landscape orientation
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: [85, 55]  // Standard ID card size
  });
  
  // FRONT SIDE OF THE CARD
  // Set background color (white)
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, 55, 85, "F");
  
  // Add university logo
  try {
    const logoDataUrl = await getRGULogoDataURL();
    doc.addImage(logoDataUrl, "PNG", 3, 3, 12, 12);
  } catch (error) {
    console.error("Error loading university logo:", error);
  }
  
  // Add heading
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("Rajiv Gandhi University", 17, 7);
  
  doc.setFontSize(6);
  doc.setFont("helvetica", "normal");
  doc.text("Rono-Hills, Doimukh", 17, 10);
  
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text("Library", 17, 14);
  
  // Add "Membership Smart Card" title
  doc.setFontSize(8);
  doc.setTextColor(231, 76, 60); // Red color
  doc.text("Membership Smart Card", 17, 18);
  
  // Reset text color to black
  doc.setTextColor(0, 0, 0);
  
  // Add student photo
  if (photoUrl) {
    try {
      doc.addImage(photoUrl, "JPEG", 3, 20, 15, 20);
    } catch (error) {
      console.error("Error loading student photo:", error);
      
      // Add a placeholder if photo fails to load
      doc.setFillColor(220, 220, 220);
      doc.rect(3, 20, 15, 20, "F");
      doc.setFontSize(6);
      doc.setTextColor(150, 150, 150);
      doc.text("No Photo", 7, 30);
      doc.setTextColor(0, 0, 0);
    }
  } else {
    // Add a placeholder if no photo
    doc.setFillColor(220, 220, 220);
    doc.rect(3, 20, 15, 20, "F");
    doc.setFontSize(6);
    doc.setTextColor(150, 150, 150);
    doc.text("No Photo", 7, 30);
    doc.setTextColor(0, 0, 0);
  }
  
  // Add enrollment number below photo
  doc.setFontSize(5);
  doc.setTextColor(0, 0, 0);
  doc.text(cardData.enrollmentNumber, 3, 42);
  
  // Add student details
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text(`${cardData.fullName}`, 20, 24);
  
  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.text(`${cardData.course} Student`, 20, 28);
  
  doc.setFontSize(6);
  doc.text(`Dept. of ${cardData.department}`, 20, 32);
  
  // Add barcode
  try {
    // Use enrollment number or generate a random barcode
    const barcodeValue = cardData.enrollmentNumber || generateRandomBarcode();
    const barcodeDataUrl = generateBarcodeDataURL(barcodeValue);
    doc.addImage(barcodeDataUrl, "PNG", 20, 34, 30, 8);
    
    // Add barcode text below
    doc.setFontSize(6);
    doc.setFont("courier", "normal");
    doc.text(barcodeValue, 35, 43, { align: "center" });
    doc.setFont("helvetica", "normal");
  } catch (error) {
    console.error("Error generating barcode:", error);
    // Try to generate a random barcode as fallback
    try {
      const randomBarcode = generateRandomBarcode();
      const barcodeDataUrl = generateBarcodeDataURL(randomBarcode);
      doc.addImage(barcodeDataUrl, "PNG", 20, 34, 30, 8);
      
      // Add barcode text below
      doc.setFontSize(6);
      doc.setFont("courier", "normal");
      doc.text(randomBarcode, 35, 43, { align: "center" });
      doc.setFont("helvetica", "normal");
    } catch (fallbackError) {
      console.error("Failed to generate fallback barcode:", fallbackError);
    }
  }
  
  // Add dates
  const issueDate = new Date();
  const validityDate = calculateValidityDate(issueDate, cardData.validityYears);
  
  doc.setFontSize(6);
  doc.setTextColor(231, 76, 60); // Red color for headings
  doc.text("Date of issue", 5, 48);
  doc.text("Validity", 38, 48);
  
  doc.setTextColor(0, 0, 0); // Reset color
  doc.setFontSize(7);
  doc.text(formatDate(issueDate), 5, 52);
  doc.text(formatDate(validityDate), 38, 52);
  
  // BACK SIDE OF THE CARD (add a new page)
  doc.addPage([85, 55], 'landscape');
  
  // Add title for instructions
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text("Instruction:", 5, 7);
  
  // Add university logo watermark
  try {
    const logoDataUrl = await getRGULogoDataURL();
    
    // Create a transparent version of the logo
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.src = logoDataUrl;
    
    await new Promise<void>((resolve) => {
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        // Draw with transparency directly on the canvas
        if (ctx) {
          ctx.globalAlpha = 0.1;
          ctx.drawImage(img, 0, 0);
        }
        resolve();
      };
    });
    
    const transparentLogoDataUrl = canvas.toDataURL('image/png');
    
    // Add the already transparent image
    doc.addImage(transparentLogoDataUrl, "PNG", 17, 15, 20, 20);
  } catch (error) {
    console.error("Error loading university logo for watermark:", error);
  }
  
  // Add instructions
  doc.setFontSize(5);
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
  
  let yPos = 12;
  instructions.forEach(instruction => {
    doc.text(instruction, 5, yPos);
    yPos += 4;
  });
  
  // Add librarian signature
  doc.setFontSize(6);
  doc.text("Librarian", 45, 45);
  
  // Return the PDF as a data URL
  return doc.output("dataurlstring");
}

// Helper function to convert imported image to base64
async function imageToDataURL(imgSrc: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0);
      resolve(canvas.toDataURL('image/png'));
    };
    img.onerror = (e) => reject(e);
    img.src = imgSrc;
  });
}

// Convert the imported logo to a data URL for the PDF
async function getRGULogoDataURL(): Promise<string> {
  try {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.src = rguLogo;
    
    return new Promise((resolve, reject) => {
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);
        resolve(canvas.toDataURL('image/png'));
      };
      img.onerror = reject;
    });
  } catch (error) {
    console.error("Error converting RGU logo:", error);
    throw error;
  }
}
