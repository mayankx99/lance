
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-8">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 fade-in">
              Where Student Talent Meets
              <span className="text-primary"> Real Projects</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto fade-in">
              Join a community of students working on real-world projects. Build your portfolio, earn money, and gain valuable experience.
            </p>
            <div className="flex justify-center gap-4 fade-in">
              {!loading && (
                user ? (
                  user.role === 'student' ? (
                    // Student action button
                    <Button 
                      size="lg" 
                      className="bg-primary hover:bg-primary/90"
                      onClick={() => navigate('/projects')}
                    >
                      Find Projects
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  ) : (
                    // Client action button
                    <Button 
                      size="lg" 
                      className="bg-primary hover:bg-primary/90"
                      onClick={() => navigate('/post-project')}
                    >
                      Post Project
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  )
                ) : (
                  // Not logged in - show get started button
                  <Button 
                    size="lg" 
                    className="bg-primary hover:bg-primary/90"
                    onClick={() => navigate('/projects')}
                  >
                    Get Started
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                )
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6 rounded-2xl bg-white shadow-sm">
              <p className="text-4xl font-bold text-primary">500+</p>
              <p className="text-gray-600 mt-2">Active Projects</p>
            </div>
            <div className="p-6 rounded-2xl bg-white shadow-sm">
              <p className="text-4xl font-bold text-primary">1,000+</p>
              <p className="text-gray-600 mt-2">Student Freelancers</p>
            </div>
            <div className="p-6 rounded-2xl bg-white shadow-sm">
              <p className="text-4xl font-bold text-primary">95%</p>
              <p className="text-gray-600 mt-2">Project Success Rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-16">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-primary">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Create Your Profile</h3>
              <p className="text-gray-600">Showcase your skills, experience, and portfolio to stand out.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-primary">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Find Projects</h3>
              <p className="text-gray-600">Browse and apply to projects that match your skills and interests.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-primary">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Get Paid</h3>
              <p className="text-gray-600">Complete projects and receive secure payments through our platform.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-8">Ready to Start Your Journey?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of students who are building their careers through real-world projects.
          </p>
          <Button 
            size="lg" 
            className="bg-primary hover:bg-primary/90"
            onClick={() => navigate(user ? (user.role === 'student' ? '/projects' : '/post-project') : '/projects')}
          >
            Get Started Now
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Index;
