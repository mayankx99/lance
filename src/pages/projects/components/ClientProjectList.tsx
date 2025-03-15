
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Project } from "@/types/user";
import { ProjectCard } from "./ProjectCard";
import { useAuth } from "@/contexts/AuthContext";

export function ClientProjectList() {
  const { user } = useAuth();

  const { data: projects, isLoading: isProjectsLoading } = useQuery({
    queryKey: ['projects', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('client_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Project[];
    },
    enabled: !!user
  });

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
        <p className="text-gray-500">You haven't posted any projects yet.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => (
        <ProjectCard 
          key={project.id} 
          project={project}
          isClient={true}
        />
      ))}
    </div>
  );
}
