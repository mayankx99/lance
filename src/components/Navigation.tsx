
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0 flex items-center">
            <h1 className="text-xl font-bold text-gray-900">StudentCollab</h1>
          </div>
          
          <div className="hidden md:flex md:items-center md:space-x-8">
            <a href="#how-it-works" className="text-gray-700 hover:text-gray-900 transition-colors">
              How it Works
            </a>
            <a href="#projects" className="text-gray-700 hover:text-gray-900 transition-colors">
              Projects
            </a>
            <a href="#for-clients" className="text-gray-700 hover:text-gray-900 transition-colors">
              For Clients
            </a>
            <Button variant="outline" className="ml-4">Sign In</Button>
            <Button className="bg-primary hover:bg-primary/90">Get Started</Button>
          </div>

          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-b">
            <a
              href="#how-it-works"
              className="block px-3 py-2 text-gray-700 hover:text-gray-900 transition-colors"
            >
              How it Works
            </a>
            <a
              href="#projects"
              className="block px-3 py-2 text-gray-700 hover:text-gray-900 transition-colors"
            >
              Projects
            </a>
            <a
              href="#for-clients"
              className="block px-3 py-2 text-gray-700 hover:text-gray-900 transition-colors"
            >
              For Clients
            </a>
            <div className="px-3 py-2 space-y-2">
              <Button variant="outline" className="w-full">Sign In</Button>
              <Button className="w-full bg-primary hover:bg-primary/90">Get Started</Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
