
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useAuth } from '@/contexts/Auth0Context';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal = ({ isOpen, onClose }: AuthModalProps) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const { signIn, signUp, loading } = useAuth();

  const handleAuth = () => {
    if (isSignUp) {
      signUp();
    } else {
      signIn();
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isSignUp ? 'Create an account' : 'Sign in'}</DialogTitle>
          <DialogDescription>
            {isSignUp
              ? 'Create your account to start using our platform.'
              : 'Sign in to your account to continue.'}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-center text-sm text-muted-foreground">
            {isSignUp ? 'Ready to join?' : 'Welcome back!'}
          </p>
          
          <Button 
            className="w-full" 
            onClick={handleAuth}
            disabled={loading}
          >
            {loading ? 'Processing...' : isSignUp ? 'Sign up with Auth0' : 'Sign in with Auth0'}
          </Button>
          
          <Button
            type="button"
            variant="link"
            className="w-full"
            onClick={() => setIsSignUp(!isSignUp)}
            disabled={loading}
          >
            {isSignUp
              ? 'Already have an account? Sign in'
              : "Don't have an account? Sign up"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
