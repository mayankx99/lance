
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Navigation } from "@/components/Navigation";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { Project } from "@/types/user";
import { Check, FileText, Send, Upload, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Projects() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isApplyDialogOpen, setIsApplyDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("projects");

  const { data: projects, isLoading: isProjectsLoading } = useQuery({
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

  const { data: applications, isLoading: isApplicationsLoading } = useQuery({
    queryKey: ['applications', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      // If student, get their applications
      if (user.role === 'student') {
        const { data, error } = await supabase
          .from('applications')
          .select(`
            *,
            projects:project_id (*)
          `)
          .eq('student_id', user.id);
        
        if (error) throw error;
        return data;
      } 
      // If client, get applications for their projects
      else if (user.role === 'client') {
        const { data, error } = await supabase
          .from('applications')
          .select(`
            *,
            projects:project_id (*),
            profiles:student_id (*)
          `)
          .eq('projects.client_id', user.id);
        
        if (error) throw error;
        return data;
      }
      
      return [];
    },
    enabled: !!user
  });

  const openApplyDialog = (project: Project) => {
    setSelectedProject(project);
    setIsApplyDialogOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setResumeFile(e.target.files[0]);
    }
  };

  const handleApply = async () => {
    if (!resumeFile || !selectedProject || !user) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select a resume file to upload.",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Upload the resume file to Supabase Storage
      const fileName = `${user.id}/${selectedProject.id}_${Date.now()}.pdf`;
      const { error: uploadError, data } = await supabase.storage
        .from('resumes')
        .upload(fileName, resumeFile);

      if (uploadError) throw uploadError;

      // Create the application record
      const { error } = await supabase
        .from('applications')
        .insert({
          project_id: selectedProject.id,
          student_id: user.id,
          resume_url: data?.path || fileName
        });

      if (error) throw error;

      toast({
        title: "Application submitted",
        description: "Your application has been submitted successfully.",
      });

      // Close the dialog and reset state
      setIsApplyDialogOpen(false);
      setResumeFile(null);
      
      // Refresh applications data
      await queryClient.invalidateQueries({ queryKey: ['applications', user.id] });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleApplicationStatus = async (applicationId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('applications')
        .update({ status: newStatus })
        .eq('id', applicationId);
        
      if (error) throw error;
      
      toast({
        title: "Status updated",
        description: `Application status updated to ${newStatus}.`,
      });
      
      // Refresh applications data
      queryClient.invalidateQueries({ queryKey: ['applications', user.id] });
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
        <h1 className="text-3xl font-bold mb-8">
          {user?.role === 'client' ? "Manage Projects" : "Available Projects"}
        </h1>
        
        {user?.role === 'client' && (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
            <TabsList className="mb-6">
              <TabsTrigger value="projects">My Projects</TabsTrigger>
              <TabsTrigger value="applications">Applications</TabsTrigger>
            </TabsList>
            
            <TabsContent value="projects">
              <div className="mb-6 flex justify-end">
                <Button onClick={() => window.location.href = '/post-project'}>
                  Post New Project
                </Button>
              </div>
              
              {isProjectsLoading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-pulse text-primary">Loading projects...</div>
                </div>
              ) : projects && projects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {projects
                    .filter(project => project.client_id === user.id)
                    .map((project) => (
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
                      </Card>
                    ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500">You haven't posted any projects yet.</p>
                  <Button 
                    className="mt-4"
                    onClick={() => window.location.href = '/post-project'}
                  >
                    Post Your First Project
                  </Button>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="applications">
              {isApplicationsLoading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-pulse text-primary">Loading applications...</div>
                </div>
              ) : applications && applications.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {applications.map((application) => (
                    <Card key={application.id}>
                      <CardHeader>
                        <CardTitle>{application.projects.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="mb-2"><strong>Applicant:</strong> {application.profiles.email}</p>
                        <p className="mb-2"><strong>Status:</strong> {application.status}</p>
                        <p className="mb-4"><strong>Applied:</strong> {new Date(application.created_at).toLocaleDateString()}</p>
                        
                        <div className="space-y-2">
                          <a 
                            href={`${supabase.storage.from('resumes').getPublicUrl(application.resume_url).data.publicUrl}`}
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center text-primary hover:underline"
                          >
                            <FileText className="mr-2 h-4 w-4" />
                            View Resume
                          </a>
                        </div>
                      </CardContent>
                      {application.status === 'pending' && (
                        <CardFooter className="flex gap-2">
                          <Button 
                            onClick={() => handleApplicationStatus(application.id, 'accepted')}
                            className="flex-1 bg-green-600 hover:bg-green-700"
                          >
                            <Check className="mr-2 h-4 w-4" />
                            Accept
                          </Button>
                          <Button 
                            onClick={() => handleApplicationStatus(application.id, 'rejected')}
                            className="flex-1 bg-red-600 hover:bg-red-700"
                          >
                            <X className="mr-2 h-4 w-4" />
                            Reject
                          </Button>
                        </CardFooter>
                      )}
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500">No applications received yet.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
        
        {/* Student view - all projects */}
        {user?.role === 'student' && (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
            <TabsList className="mb-6">
              <TabsTrigger value="projects">Available Projects</TabsTrigger>
              <TabsTrigger value="applications">My Applications</TabsTrigger>
            </TabsList>
            
            <TabsContent value="projects">
              {isProjectsLoading ? (
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
                        {project.status === 'open' && (
                          <Button 
                            className="w-full"
                            onClick={() => openApplyDialog(project)}
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
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="applications">
              {isApplicationsLoading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-pulse text-primary">Loading applications...</div>
                </div>
              ) : applications && applications.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {applications.map((application) => (
                    <Card key={application.id}>
                      <CardHeader>
                        <CardTitle>{application.projects.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p><strong>Status:</strong> <span className={
                          application.status === 'accepted' ? 'text-green-600 font-medium' : 
                          application.status === 'rejected' ? 'text-red-600 font-medium' : 'font-medium'
                        }>{application.status}</span></p>
                        <p><strong>Applied:</strong> {new Date(application.created_at).toLocaleDateString()}</p>
                      </CardContent>
                      <CardFooter>
                        <a 
                          href={`${supabase.storage.from('resumes').getPublicUrl(application.resume_url).data.publicUrl}`}
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary hover:underline flex items-center"
                        >
                          <FileText className="mr-2 h-4 w-4" />
                          View Resume
                        </a>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500">You haven't applied to any projects yet.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}

        {/* Application Dialog */}
        <Dialog open={isApplyDialogOpen} onOpenChange={setIsApplyDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Apply for {selectedProject?.title}</DialogTitle>
              <DialogDescription>
                Upload your resume to apply for this project.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="resume">Resume (PDF)</Label>
                <Input
                  id="resume"
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                />
                <p className="text-sm text-muted-foreground">
                  Please upload your resume in PDF format.
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsApplyDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleApply} 
                disabled={!resumeFile || isSubmitting}
              >
                {isSubmitting ? (
                  <>Submitting...</>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Submit Application
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
