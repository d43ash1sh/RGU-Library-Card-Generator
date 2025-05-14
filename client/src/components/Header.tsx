import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { MoonIcon, SunIcon } from "lucide-react";
import rguLogo from "@assets/rgu_logo.png";

export default function Header() {
  const { theme, setTheme } = useTheme();
  
  return (
    <header className="bg-white dark:bg-gray-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            {/* University Logo */}
            <img 
              src={rguLogo} 
              alt="RGU Logo" 
              className="h-10 w-10 rounded-full object-contain"
            />
            <div className="ml-3">
              <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                RGU Library Card Generator
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Rajiv Gandhi University, Arunachal Pradesh
              </p>
            </div>
          </div>
          
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Toggle theme"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <SunIcon className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <MoonIcon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
