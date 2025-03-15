import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { AuthModal } from "./auth/AuthModal";
import { useNavigate } from "react-router-dom";
export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const {
    user,
    signOut
  } = useAuth();
  const navigate = useNavigate();
  const handleNavigate = (path: string) => {
    navigate(path);
    setIsOpen(false); // Close mobile menu when navigating
  };
  const handleOpenAuthModal = (mode: 'signin' | 'signup') => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };
  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/'); // Navigate to home after sign out
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };
  return <>
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0 flex items-center">
              <h1 onClick={() => handleNavigate('/')} className="text-xl font-bold cursor-pointer text-teal-500">Sneaky</h1>
            </div>
            
            <div className="hidden md:flex md:items-center md:space-x-8">
              <a href="#how-it-works" className="text-gray-700 hover:text-gray-900 transition-colors">
                How it Works
              </a>
              {user?.role === 'student' && <Button onClick={() => handleNavigate('/projects')} className="bg-primary hover:bg-primary/90">
                  Find Projects
                </Button>}
              {user?.role === 'client' && <>
                  <Button onClick={() => handleNavigate('/post-project')} className="bg-primary hover:bg-primary/90">
                    Post Project
                  </Button>
                  <Button onClick={() => handleNavigate('/projects')} variant="outline">
                    View Projects
                  </Button>
                </>}
              {!user && <a href="#for-clients" className="text-gray-700 hover:text-gray-900 transition-colors">
                  For Clients
                </a>}
              {user ? <Button variant="outline" onClick={handleSignOut}>Sign Out</Button> : <>
                  <Button variant="outline" onClick={() => handleOpenAuthModal('signin')}>
                    Sign In
                  </Button>
                  
                </>}
            </div>

            <div className="md:hidden">
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-b">
              <a href="#how-it-works" className="block px-3 py-2 text-gray-700 hover:text-gray-900 transition-colors">
                How it Works
              </a>
              {user?.role === 'student' && <Button onClick={() => handleNavigate('/projects')} className="w-full justify-start">
                  Find Projects
                </Button>}
              {user?.role === 'client' && <>
                  <Button onClick={() => handleNavigate('/post-project')} className="w-full justify-start">
                    Post Project
                  </Button>
                  <Button onClick={() => handleNavigate('/projects')} variant="outline" className="w-full justify-start">
                    View Projects
                  </Button>
                </>}
              {!user && <a href="#for-clients" className="block px-3 py-2 text-gray-700 hover:text-gray-900 transition-colors">
                  For Clients
                </a>}
              <div className="px-3 py-2 space-y-2">
                {user ? <Button variant="outline" className="w-full" onClick={handleSignOut}>
                    Sign Out
                  </Button> : <>
                    <Button variant="outline" className="w-full" onClick={() => handleOpenAuthModal('signin')}>
                      Sign In
                    </Button>
                    <Button className="w-full bg-primary hover:bg-primary/90" onClick={() => handleOpenAuthModal('signup')}>
                      Get Started
                    </Button>
                  </>}
              </div>
            </div>
          </div>}
      </nav>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} initialMode={authMode} />
    </>;
};