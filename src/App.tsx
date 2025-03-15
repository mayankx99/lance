
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { useAuth } from "./contexts/AuthContext";
import Index from "./pages/Index";
import Projects from "./pages/Projects";
import PostProject from "./pages/PostProject";
import NotFound from "./pages/NotFound";
import { useEffect } from "react";

const queryClient = new QueryClient();

// Role-based route protection component
const ProtectedRoute = ({ 
  children, 
  allowedRoles,
  redirectPath = "/"
}: { 
  children: JSX.Element, 
  allowedRoles: string[],
  redirectPath?: string 
}) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }
  
  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to={redirectPath} replace />;
  }
  
  return children;
};

// Navigation guard for authenticated users
const AuthenticatedRoute = ({
  children
}: {
  children: JSX.Element
}) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

// Wrap the Routes component with AuthProvider for the ProtectedRoute to work
const AppRoutes = () => {
  const { user, loading } = useAuth();

  // Debug helper
  useEffect(() => {
    if (!loading) {
      console.log("Current auth state:", user ? `Logged in as ${user.role}` : "Not logged in");
    }
  }, [user, loading]);

  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route 
        path="/projects" 
        element={
          <AuthenticatedRoute>
            <Projects />
          </AuthenticatedRoute>
        } 
      />
      <Route 
        path="/post-project" 
        element={
          <ProtectedRoute allowedRoles={['client']}>
            <PostProject />
          </ProtectedRoute>
        } 
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
