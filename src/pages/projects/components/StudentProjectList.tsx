
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Project } from "@/types/user";
import { ProjectCard } from "./ProjectCard";
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useQueryClient } from "@tanstack/react-query";

export function StudentProjectList() {
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  const [isApplyDialogOpen, setIsApplyDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  if (isProjectsLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-pulse text-primary">Loading projects...</div>
      </div>
    );
  }

  if (!projects || projects.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No projects available yet.</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <ProjectCard 
            key={project.id} 
            project={project} 
            onApply={openApplyDialog}
          />
        ))}
      </div>

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
    </>
  );
}
