
import { useForm } from "react-hook-form";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

interface ProjectForm {
  title: string;
  description: string;
  budget: number;
  skills_required: string;
}

export default function PostProject() {
  const { register, handleSubmit, formState: { errors } } = useForm<ProjectForm>();
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const onSubmit = async (data: ProjectForm) => {
    try {
      const { error } = await supabase
        .from('projects')
        .insert({
          title: data.title,
          description: data.description,
          budget: data.budget,
          client_id: user?.id,
          skills_required: data.skills_required.split(',').map(skill => skill.trim())
        });

      if (error) throw error;

      toast({
        title: "Project posted",
        description: "Your project has been posted successfully.",
      });
      
      // Invalidate the projects query to refresh the data
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      navigate('/projects');
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
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Post a New Project</h1>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <Label htmlFor="title">Project Title</Label>
              <Input
                id="title"
                {...register("title", { required: "Title is required" })}
                placeholder="Enter project title"
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                {...register("description", { required: "Description is required" })}
                placeholder="Describe your project requirements"
                className="h-32"
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="budget">Budget ($)</Label>
              <Input
                id="budget"
                type="number"
                {...register("budget", { 
                  required: "Budget is required",
                  min: { value: 0, message: "Budget must be positive" }
                })}
                placeholder="Enter project budget"
              />
              {errors.budget && (
                <p className="text-red-500 text-sm mt-1">{errors.budget.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="skills_required">Required Skills</Label>
              <Input
                id="skills_required"
                {...register("skills_required", { required: "Required skills are required" })}
                placeholder="Enter skills (comma-separated)"
              />
              {errors.skills_required && (
                <p className="text-red-500 text-sm mt-1">{errors.skills_required.message}</p>
              )}
            </div>

            <Button type="submit" className="w-full">
              Post Project
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
}
