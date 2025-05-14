export default function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-800 shadow-inner mt-12">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between md:flex-row">
          <div className="flex items-center space-x-2">
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/e/e3/RGU_logo.png" 
              alt="RGU Logo" 
              className="h-8 w-8 rounded-full object-contain"
            />
            <div>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                © {new Date().getFullYear()} Rajiv Gandhi University Library
              </p>
            </div>
          </div>
          <div className="mt-4 md:mt-0">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Powered by <span className="text-primary-600 dark:text-primary-400">RGU Digital Services</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
