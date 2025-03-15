
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { ApplicationCard } from "./ApplicationCard";
import { useAuth } from "@/contexts/AuthContext";

export function StudentApplicationList() {
  const { user } = useAuth();

  const { data: applications, isLoading: isApplicationsLoading } = useQuery({
    queryKey: ['applications', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('applications')
        .select(`
          *,
          projects:project_id (*)
        `)
        .eq('student_id', user.id);
      
      if (error) throw error;
      return data;
    },
    enabled: !!user
  });

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
        <p className="text-gray-500">You haven't applied to any projects yet.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {applications.map((application) => (
        <ApplicationCard key={application.id} application={application} />
      ))}
    </div>
  );
}
