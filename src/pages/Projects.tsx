
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Navigation } from "@/components/Navigation";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { Project } from "@/types/user";
import { FileText, Send } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function Projects() {
  const { toast } = useToast();
  const { user } = useAuth();

  const { data: projects, isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Project[];
    }
  });

  const handleApply = async (projectId: string) => {
    try {
      const { error: uploadError, data } = await supabase.storage
        .from('resumes')
        .upload(`${user?.id}/${projectId}.pdf`, new File([], 'dummy.pdf')); // You'll need to implement file upload UI

      if (uploadError) throw uploadError;

      const { error } = await supabase
        .from('applications')
        .insert({
          project_id: projectId,
          student_id: user?.id,
          resume_url: data?.path
        });

      if (error) throw error;

      toast({
        title: "Application submitted",
        description: "Your application has been submitted successfully.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="container mx-auto px-4 py-8 pt-24">
        <h1 className="text-3xl font-bold mb-8">Available Projects</h1>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-pulse text-primary">Loading projects...</div>
          </div>
        ) : projects && projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Card key={project.id}>
                <CardHeader>
                  <CardTitle>{project.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{project.description}</p>
                  <div className="space-y-2">
                    <p><strong>Budget:</strong> ${project.budget}</p>
                    <p><strong>Status:</strong> {project.status}</p>
                    <div>
                      <strong>Skills required:</strong>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {project.skills_required.map((skill) => (
                          <span
                            key={skill}
                            className="bg-primary/10 text-primary px-2 py-1 rounded-full text-sm"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  {user?.role === 'student' && project.status === 'open' && (
                    <Button 
                      className="w-full"
                      onClick={() => handleApply(project.id)}
                    >
                      <FileText className="mr-2" />
                      Apply Now
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No projects available yet.</p>
            {user?.role === 'client' && (
              <Button 
                className="mt-4"
                onClick={() => window.location.href = '/post-project'}
              >
                Post Your First Project
              </Button>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
