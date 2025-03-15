
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { ApplicationCard } from "./ApplicationCard";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";

export function ClientApplicationList() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: applications, isLoading: isApplicationsLoading } = useQuery({
    queryKey: ['applications', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
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
    },
    enabled: !!user
  });

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
      queryClient.invalidateQueries({ queryKey: ['applications', user?.id] });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  if (isApplicationsLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-pulse text-primary">Loading applications...</div>
      </div>
    );
  }

  if (!applications || applications.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No applications received yet.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {applications.map((application) => (
        <ApplicationCard
          key={application.id}
          application={application}
          isClient={true}
          onStatusChange={handleApplicationStatus}
        />
      ))}
    </div>
  );
}
