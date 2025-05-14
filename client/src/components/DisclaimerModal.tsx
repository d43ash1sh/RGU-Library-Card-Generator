import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { Info } from "lucide-react";

// Local storage key to track if user has acknowledged the disclaimer
const DISCLAIMER_ACKNOWLEDGED_KEY = "rgu_card_disclaimer_acknowledged";

export function DisclaimerModal() {
  // State to control visibility of the disclaimer modal
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  
  useEffect(() => {
    // Check if user has already acknowledged the disclaimer
    const hasAcknowledged = localStorage.getItem(DISCLAIMER_ACKNOWLEDGED_KEY) === "true";
    
    // If not acknowledged, show the disclaimer
    if (!hasAcknowledged) {
      setShowDisclaimer(true);
    }
  }, []);
  
  // Handle acknowledging the disclaimer
  const handleAcknowledge = () => {
    // Save acknowledgement to localStorage
    localStorage.setItem(DISCLAIMER_ACKNOWLEDGED_KEY, "true");
    // Close the modal
    setShowDisclaimer(false);
  };
  
  // Handle manually showing the disclaimer again
  const handleShowDisclaimer = () => {
    setShowDisclaimer(true);
  };
  
  return (
    <>
      {/* Info button to manually open the disclaimer */}
      <div className="fixed top-4 right-4 z-50">
        <Button 
          variant="outline" 
          size="sm" 
          className="rounded-full w-8 h-8 p-0 bg-white/90 backdrop-blur-sm border-gray-200 hover:bg-gray-100"
          onClick={handleShowDisclaimer}
          title="Disclaimer Information"
        >
          <Info className="h-4 w-4 text-gray-700" />
        </Button>
      </div>
      
      {/* Disclaimer Modal */}
      <Dialog open={showDisclaimer} onOpenChange={setShowDisclaimer}>
        <DialogContent className="max-w-md mx-auto backdrop-blur-sm">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-center">Disclaimer</DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <p className="text-center text-gray-800 dark:text-gray-200 font-medium">
            This project, RGU Library Card Generator, is developed by Debashish Bordoloi as part of an educational and personal learning initiative.
It is not affiliated with or officially approved by Rajiv Gandhi University.
The generated library card is for demonstration and educational purposes only and does not hold any official validity.
            </p>
          </div>
          
          <DialogFooter className="sm:justify-center">
            <Button 
              onClick={handleAcknowledge}
              className="bg-primary hover:bg-primary/90 w-full sm:w-auto"
            >
              OK, Got It!
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}