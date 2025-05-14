import { useEffect, useRef } from "react";
import JsBarcode from "jsbarcode";
import { Button } from "@/components/ui/button";
import { RefreshCw, Download } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate, calculateValidityDate } from "@/lib/utils";
import { generateLibraryCardPDF } from "@/lib/generate-pdf";
import { StudentCardFormData } from "@shared/schema";

interface CardPreviewProps {
  student: {
    fullName: string;
    enrollmentNumber: string;
    department: string;
    course: string;
    semester: string;
    validityYears: number;
  };
  photo: File | null;
  onRefresh: () => void;
  disabled?: boolean;
}

export default function CardPreview({ 
  student, 
  photo,
  onRefresh,
  disabled = true 
}: CardPreviewProps) {
  const barcodeRef = useRef<SVGSVGElement>(null);
  const photoPreviewRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Update the photo preview
    if (photo && photoPreviewRef.current) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (photoPreviewRef.current && e.target?.result) {
          photoPreviewRef.current.innerHTML = '';
          const img = document.createElement('img');
          img.src = e.target.result as string;
          img.className = 'w-full h-full object-cover';
          photoPreviewRef.current.appendChild(img);
        }
      };
      reader.readAsDataURL(photo);
    }
    
    // Generate barcode with the enrollment number
    if (barcodeRef.current && student.enrollmentNumber) {
      try {
        JsBarcode(barcodeRef.current, student.enrollmentNumber || "1446RGUST23", {
          format: "CODE128",
          lineColor: "#000",
          width: 2,
          height: 30,
          displayValue: false
        });
      } catch (e) {
        console.error("Error generating barcode:", e);
      }
    }
  }, [student.enrollmentNumber, photo]);
  
  const handleDownload = async () => {
    try {
      // Convert the photo to a data URL if it exists
      let photoUrl = '';
      if (photo) {
        const reader = new FileReader();
        photoUrl = await new Promise((resolve) => {
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(photo);
        });
      }
      
      // Generate the PDF
      const pdfDataUrl = await generateLibraryCardPDF(
        student as StudentCardFormData,
        photoUrl
      );
      
      // Create a link and trigger download
      const link = document.createElement('a');
      link.href = pdfDataUrl;
      link.download = `${student.fullName.replace(/\s+/g, '_')}_library_card.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    }
  };
  
  // Calculate dates
  const currentDate = new Date();
  const validityDate = calculateValidityDate(
    currentDate,
    student.validityYears || 1
  );
  
  return (
    <div>
      <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-md mb-4">
        <h3 className="text-md font-medium text-gray-900 dark:text-white mb-4">Card Preview</h3>
        
        <Card className="bg-white dark:bg-gray-800 overflow-hidden mx-auto max-w-md">
          <CardContent className="relative p-4">
            <div className="flex items-center">
              {/* University Logo */}
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/e/e3/RGU_logo.png" 
                alt="RGU Logo" 
                className="h-16 w-16 object-contain" 
              />
              <div className="ml-4 text-center">
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Rajiv Gandhi University</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">Rono-Hills, Doimukh</p>
                <p className="text-lg font-semibold text-gray-800 dark:text-gray-200 mt-1">Library</p>
              </div>
            </div>
            
            <div className="mt-6">
              <h3 className="text-lg font-bold text-red-500 text-center">Membership Smart Card</h3>
              
              <div className="mt-4 flex">
                {/* Student Photo */}
                <div className="w-1/3">
                  <div 
                    ref={photoPreviewRef}
                    id="photoPreview" 
                    className="w-24 h-32 bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 flex items-center justify-center text-gray-500 dark:text-gray-400 text-xs"
                  >
                    <span>Photo</span>
                  </div>
                  <p className="text-sm mt-2 text-gray-800 dark:text-gray-300">
                    {student.enrollmentNumber || "1446RGUST23"}
                  </p>
                </div>
                
                {/* Student Details */}
                <div className="w-2/3 pl-4">
                  <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                    {student.fullName || "Mr/Ms. Student Name"}
                  </p>
                  <p className="text-md text-gray-800 dark:text-gray-300">
                    {student.course || "Course Name"}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    Dept. of {student.department || "XYZ"}
                  </p>
                  
                  {/* Barcode */}
                  <div className="mt-4">
                    <svg ref={barcodeRef} className="w-full"></svg>
                  </div>
                </div>
              </div>
              
              {/* Dates */}
              <div className="mt-4 flex justify-between text-sm">
                <div>
                  <p className="text-red-500 font-semibold">Date of issue</p>
                  <p className="text-gray-800 dark:text-gray-300">{formatDate(currentDate)}</p>
                </div>
                <div className="text-right">
                  <p className="text-red-500 font-semibold">Validity</p>
                  <p className="text-gray-800 dark:text-gray-300">{formatDate(validityDate)}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Instructions Panel */}
        <Card className="mt-4 bg-white dark:bg-gray-800 overflow-hidden mx-auto max-w-md">
          <CardContent className="p-4 max-h-48 overflow-y-auto">
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 border-b pb-2 mb-2">Instruction:</h3>
            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
              <li>- No Library books will be issued without this card</li>
              <li>- Check the book before borrowing whether it is mutilated or damaged</li>
              <li>- Return books on time</li>
              <li>- Library books & membership ID transferable</li>
              <li>- Holder of this card will be responsible for the book</li>
              <li>- This card must deposited while leaving the university</li>
              <li>- Report the loss of borrowing card and books</li>
              <li>- If you lose this card please report to - 0360-2277573, 0360-2277094</li>
            </ul>
            <p className="text-right mt-2 text-sm text-gray-900 dark:text-gray-100">Librarian</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Action Buttons */}
      <div className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={onRefresh}
          className="flex items-center"
        >
          <RefreshCw className="mr-2 h-4 w-4" /> Refresh
        </Button>
        <Button
          variant="default"
          disabled={disabled}
          onClick={handleDownload}
          className="bg-amber-500 hover:bg-amber-600 flex items-center"
        >
          <Download className="mr-2 h-4 w-4" /> Download PDF
        </Button>
      </div>
    </div>
  );
}
