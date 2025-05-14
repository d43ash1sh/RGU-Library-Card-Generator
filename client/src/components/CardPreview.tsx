import { useState, useEffect, useRef } from "react";
import JsBarcode from "jsbarcode";
import { Button } from "@/components/ui/button";
import { RefreshCw, Download, FlipHorizontal, Maximize2, X, RotateCw } from "lucide-react";
import { formatDate, calculateValidityDate, generateRandomBarcode } from "@/lib/utils";
import { generateLibraryCardPDF } from "@/lib/generate-pdf";
import { StudentCardFormData } from "@shared/schema";
import rguLogo from "@assets/rgu_logo.png";
import { motion, AnimatePresence } from "framer-motion";

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
  const [isFlipped, setIsFlipped] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [barcodeLoaded, setBarcodeLoaded] = useState(false);
  const barcodeRef = useRef<SVGSVGElement>(null);
  const photoPreviewRef = useRef<HTMLDivElement>(null);
  
  // Store the barcode value
  const [barcodeValue, setBarcodeValue] = useState<string>(() => {
    // Use the enrollment number or generate a random barcode
    return student.enrollmentNumber || generateRandomBarcode();
  });
  
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
    
    // Update barcode value when enrollment number changes
    if (student.enrollmentNumber) {
      setBarcodeValue(student.enrollmentNumber);
    }
  }, [student.enrollmentNumber, photo]);
  
  // Generate barcode with the current value
  useEffect(() => {
    if (barcodeRef.current && barcodeValue) {
      try {
        // Reset loading state
        setBarcodeLoaded(false);
        
        setTimeout(() => {
          if (barcodeRef.current) {
            JsBarcode(barcodeRef.current, barcodeValue, {
              format: "CODE128",
              lineColor: "#000",
              width: 2,
              height: 30,
              displayValue: false
            });
            
            // Set loaded state for animation
            setBarcodeLoaded(true);
          }
        }, 300); // Slight delay for animation effect
      } catch (e) {
        console.error("Error generating barcode:", e);
        
        // If error occurs, try to generate with a random barcode instead
        if (barcodeRef.current) {
          const randomBarcode = generateRandomBarcode();
          setBarcodeValue(randomBarcode);
          
          JsBarcode(barcodeRef.current, randomBarcode, {
            format: "CODE128",
            lineColor: "#000",
            width: 2,
            height: 30,
            displayValue: false
          });
        }
        
        setBarcodeLoaded(true); // Ensure UI is not stuck
      }
    }
  }, [barcodeValue]);
  
  // Handle escape key for fullscreen mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);
  
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
  
  const toggleFlip = () => {
    setIsFlipped(!isFlipped);
  };
  
  const toggleFullscreen = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent flip toggle
    setIsFullscreen(!isFullscreen);
  };
  
  // Calculate dates
  const currentDate = new Date();
  const validityDate = calculateValidityDate(
    currentDate,
    student.validityYears || 1
  );
  
  // Content for the front of the card
  const frontContent = (
    <div className="relative z-10 flex flex-col h-full p-4">
      <div className="flex items-center justify-center">
        {/* University Logo */}
        <motion.img 
          src={rguLogo} 
          alt="RGU Logo" 
          className="h-20 w-20 object-contain" 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        />
        <div className="ml-4 text-center">
          <motion.h2 
            className="text-xl font-bold text-gray-900 dark:text-gray-100"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Rajiv Gandhi University
          </motion.h2>
          <motion.p 
            className="text-sm text-gray-600 dark:text-gray-400"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Rono-Hills, Doimukh
          </motion.p>
          <motion.p 
            className="text-lg font-semibold text-gray-800 dark:text-gray-200 mt-1"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            Library
          </motion.p>
        </div>
      </div>
      
      <div className="flex-1">
        <motion.h3 
          className="text-lg font-bold text-[#e74c3c] text-center mt-3"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          Membership Smart Card
        </motion.h3>
        
        <div className="mt-3 flex">
          {/* Student Photo */}
          <div className="w-1/3">
            <motion.div 
              ref={photoPreviewRef}
              id="photoPreview" 
              className="w-28 h-36 bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 flex items-center justify-center text-gray-500 dark:text-gray-400 text-xs overflow-hidden"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              style={{ boxShadow: "0 2px 5px rgba(0,0,0,0.1)" }}
            >
              <span>Photo</span>
            </motion.div>
            <motion.p 
              className="text-xs mt-2 text-gray-800 dark:text-gray-300 text-center font-mono"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              {student.enrollmentNumber || barcodeValue}
            </motion.p>
          </div>
          
          {/* Student Details */}
          <div className="w-2/3 pl-4">
            <motion.p 
              className="text-xl font-bold text-gray-900 dark:text-gray-100"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              {student.fullName || "Mr/Ms. Student Name"}
            </motion.p>
            <motion.p 
              className="text-md text-gray-800 dark:text-gray-300"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              {student.course || "Course Name"} Student
            </motion.p>
            <motion.p 
              className="text-sm text-gray-600 dark:text-gray-400 mt-1"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              Dept. of {student.department || "Computer Science & Engineering"}
            </motion.p>
            
            {/* Barcode with animation */}
            <motion.div 
              className="barcode-container mt-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ 
                opacity: barcodeLoaded ? 1 : 0,
                y: barcodeLoaded ? 0 : 10
              }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <svg ref={barcodeRef} className="w-full"></svg>
              {!barcodeLoaded && (
                <motion.div 
                  className="flex items-center justify-center mt-2"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <RotateCw className="w-4 h-4 text-gray-400" />
                </motion.div>
              )}
              {barcodeLoaded && (
                <motion.p
                  className="text-xs text-center mt-1 text-gray-700 dark:text-gray-300 font-mono"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  {barcodeValue}
                </motion.p>
              )}
            </motion.div>
          </div>
        </div>
        
        {/* Dates */}
        <motion.div 
          className="mt-3 flex justify-between text-sm"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.9 }}
        >
          <div>
            <p className="text-[#e74c3c] font-semibold">Date of issue</p>
            <p className="text-gray-800 dark:text-gray-300">{formatDate(currentDate)}</p>
          </div>
          <div className="text-right">
            <p className="text-[#e74c3c] font-semibold">Validity</p>
            <p className="text-gray-800 dark:text-gray-300">{formatDate(validityDate)}</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
  
  // Content for the back of the card
  const backContent = (
    <div className="relative h-full p-4">
      {/* Watermark logo */}
      <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
        <img 
          src={rguLogo} 
          alt="RGU Logo Watermark" 
          className="w-32 h-32 object-contain" 
        />
      </div>
      
      <div className="relative z-10 h-full flex flex-col">
        <motion.h3 
          className="text-lg font-bold text-gray-900 dark:text-gray-100 border-b border-gray-300 dark:border-gray-700 pb-2 mb-3"
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Instruction:
        </motion.h3>
        
        <motion.ul 
          className="text-xs text-gray-700 dark:text-gray-300 space-y-1 text-left flex-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <li>- No Library books will be issued without this card</li>
          <li>- Check the book before borrowing whether it is mutilated or damaged</li>
          <li>- Return books on time</li>
          <li>- Library books & membership ID transferable</li>
          <li>- Holder of this card will be responsible for the book</li>
          <li>- This card must deposited while leaving the university</li>
          <li>- Report the loss of borrowing card and books</li>
          <li>- If you lose this card please report to -</li>
          <li>&nbsp;&nbsp;0360-2277573, 0360-2277094</li>
        </motion.ul>
        
        <motion.p 
          className="text-right mt-2 text-sm text-gray-900 dark:text-gray-100"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          Librarian
        </motion.p>
      </div>
    </div>
  );
  
  return (
    <div>
      <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-md mb-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-md font-medium text-gray-900 dark:text-white">Card Preview</h3>
          <div className="flex items-center space-x-2">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={(e) => toggleFullscreen(e)}
              className="flex items-center text-xs"
              title="View in fullscreen"
            >
              <Maximize2 className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={toggleFlip}
              className="flex items-center text-xs"
            >
              <FlipHorizontal className="mr-1 h-4 w-4" /> 
              {isFlipped ? "Show Front" : "Show Back"}
            </Button>
          </div>
        </div>
        
        {/* Flip Card Container */}
        <motion.div 
          className={`flip-card ${isFlipped ? 'flipped' : ''}`} 
          onClick={toggleFlip}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div 
            className="flip-card-inner"
            whileHover={{ 
              boxShadow: "0 15px 35px -5px rgba(0,0,0,0.3), 0 10px 20px -5px rgba(0,0,0,0.2)"
            }}
            transition={{ duration: 0.3 }}
          >
            {/* Front of the Card */}
            <div className="flip-card-front">
              {frontContent}
            </div>
            
            {/* Back of the Card */}
            <div className="flip-card-back">
              {backContent}
            </div>
          </motion.div>
        </motion.div>
        
        <motion.div 
          className="mt-2 text-center text-xs text-gray-500 dark:text-gray-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.8 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          Click on the card to flip it or use the button above
        </motion.div>
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
      
      {/* Fullscreen Modal */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div 
            className="card-zoom-container active"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsFullscreen(false)}
          >
            <div className="relative">
              <Button 
                variant="secondary" 
                size="sm" 
                className="absolute -top-10 right-0 bg-white text-black dark:bg-gray-800 dark:text-white"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsFullscreen(false);
                }}
              >
                <X className="h-4 w-4" />
              </Button>
              
              <motion.div 
                className={`flip-card ${isFlipped ? 'flipped' : ''}`} 
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFlip();
                }}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flip-card-inner">
                  <div className="flip-card-front">
                    {frontContent}
                  </div>
                  <div className="flip-card-back">
                    {backContent}
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
