
import { createContext, useContext } from 'react';
import { useAuth0, Auth0Provider, User as Auth0User } from '@auth0/auth0-react';
import { useToast } from '@/components/ui/use-toast';
import { User, UserRole } from '@/types/user';

interface Auth0ContextType {
  user: User | null;
  loading: boolean;
  signIn: () => void;
  signUp: () => void;
  signOut: () => void;
}

const Auth0Context = createContext<Auth0ContextType | undefined>(undefined);

// Domain and clientId should come from your Auth0 dashboard
// Make sure to set them in your Auth0 dashboard and update these values
const domain = 'YOUR_AUTH0_DOMAIN';
const clientId = 'YOUR_AUTH0_CLIENT_ID';

// This component maps Auth0 user data to our application's User type
export const Auth0ProviderWithNavigate = ({ children }: { children: React.ReactNode }) => {
  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: window.location.origin
      }}
    >
      <Auth0ContextProvider>{children}</Auth0ContextProvider>
    </Auth0Provider>
  );
};

export const Auth0ContextProvider = ({ children }: { children: React.ReactNode }) => {
  const { 
    isLoading, 
    isAuthenticated, 
    user: auth0User, 
    loginWithRedirect, 
    logout 
  } = useAuth0();
  const { toast } = useToast();

  // Convert Auth0 user to our app's User format
  const mapAuth0UserToAppUser = (auth0User: Auth0User | undefined): User | null => {
    if (!auth0User || !isAuthenticated) return null;
    
    // Extract role from Auth0 metadata
    const role = auth0User['http://your-namespace/roles'] as UserRole || 'student';
    
    return {
      id: auth0User.sub || '',
      email: auth0User.email || '',
      role: role,
      full_name: auth0User.name,
      avatar_url: auth0User.picture
    };
  };

  const user = mapAuth0UserToAppUser(auth0User);

  const signIn = () => {
    loginWithRedirect();
  };

  const signUp = () => {
    loginWithRedirect({
      authorizationParams: {
        screen_hint: 'signup'
      }
    });
  };

  const handleSignOut = () => {
    logout({ 
      logoutParams: {
        returnTo: window.location.origin
      }
    });
    toast({
      title: "Signed out",
      description: "You've been successfully signed out.",
    });
  };

  return (
    <Auth0Context.Provider 
      value={{ 
        user, 
        loading: isLoading, 
        signIn, 
        signUp, 
        signOut: handleSignOut
      }}
    >
      {children}
    </Auth0Context.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(Auth0Context);
  if (context === undefined) {
    throw new Error('useAuth must be used within an Auth0ContextProvider');
  }
  return context;
};
