
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { toast } from '@/components/ui/use-toast';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'signin' | 'signup';
}

interface AuthFormValues {
  email: string;
  password: string;
}

export const AuthModal = ({ isOpen, onClose, initialMode = 'signin' }: AuthModalProps) => {
  const [isSignUp, setIsSignUp] = useState(initialMode === 'signup');
  const [role, setRole] = useState<'student' | 'client'>('student');
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const { signIn, signUp, loading } = useAuth();
  const { register, handleSubmit, formState: { errors }, reset } = useForm<AuthFormValues>({
    defaultValues: {
      email: '',
      password: ''
    }
  });

  // Update mode when initialMode prop changes
  useEffect(() => {
    if (initialMode) {
      setIsSignUp(initialMode === 'signup');
    }
  }, [initialMode]);

  // Reset form when modal opens/closes or mode changes
  useEffect(() => {
    if (isOpen) {
      reset({ email: '', password: '' });
      setError(null);
      setProcessing(false);
    }
  }, [isOpen, isSignUp, reset]);

  const onSubmit = async (data: AuthFormValues) => {
    setError(null);
    setProcessing(true);
    
    try {
      if (isSignUp) {
        await signUp(data.email, data.password, role);
        toast({
          title: "Account created",
          description: "Your account has been created successfully. Please check your email for verification if needed.",
        });
      } else {
        await signIn(data.email, data.password);
        toast({
          title: "Welcome back!",
          description: "You've successfully signed in.",
        });
        onClose();
      }
    } catch (error: any) {
      console.error('Authentication error:', error);
      setError(error.message || "An error occurred during authentication");
    } finally {
      setProcessing(false);
    }
  };

  const toggleAuthMode = () => {
    setIsSignUp(!isSignUp);
    setError(null);
    reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        onClose();
        reset();
        setError(null);
      }
    }}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isSignUp ? 'Create an account' : 'Sign in'}</DialogTitle>
          <DialogDescription>
            {isSignUp
              ? 'Create your account to start using our platform.'
              : 'Sign in to your account to continue.'}
          </DialogDescription>
        </DialogHeader>
        
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="Enter your email"
              autoComplete="email"
              {...register("email", { 
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address"
                } 
              })}
            />
            {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input 
              id="password" 
              type="password" 
              placeholder="Enter your password"
              autoComplete={isSignUp ? "new-password" : "current-password"}
              {...register("password", { 
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters"
                }
              })}
            />
            {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
          </div>
          
          {isSignUp && (
            <div className="space-y-2">
              <Label>Account Type</Label>
              <div className="flex space-x-4">
                <Button
                  type="button"
                  variant={role === 'student' ? 'default' : 'outline'}
                  onClick={() => setRole('student')}
                  className="flex-1"
                >
                  Student
                </Button>
                <Button
                  type="button"
                  variant={role === 'client' ? 'default' : 'outline'}
                  onClick={() => setRole('client')}
                  className="flex-1"
                >
                  Client
                </Button>
              </div>
            </div>
          )}

          <Button 
            type="submit" 
            className="w-full" 
            disabled={processing || loading}
          >
            {processing || loading ? 'Processing...' : isSignUp ? 'Sign up' : 'Sign in'}
          </Button>
          
          <Button
            type="button"
            variant="link"
            className="w-full"
            onClick={toggleAuthMode}
            disabled={processing || loading}
          >
            {isSignUp
              ? 'Already have an account? Sign in'
              : "Don't have an account? Sign up"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
