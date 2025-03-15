
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, FileText, X } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface ApplicationCardProps {
  application: any;
  isClient?: boolean;
  onStatusChange?: (id: string, status: string) => Promise<void>;
}

export function ApplicationCard({ application, isClient = false, onStatusChange }: ApplicationCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{application.projects.title}</CardTitle>
      </CardHeader>
      <CardContent>
        {isClient && (
          <p className="mb-2"><strong>Applicant:</strong> {application.profiles.email}</p>
        )}
        <p className="mb-2">
          <strong>Status:</strong> 
          <span className={
            application.status === 'accepted' ? 'text-green-600 font-medium' : 
            application.status === 'rejected' ? 'text-red-600 font-medium' : 'font-medium'
          }>
            {' ' + application.status}
          </span>
        </p>
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
      {isClient && application.status === 'pending' && onStatusChange && (
        <CardFooter className="flex gap-2">
          <Button 
            onClick={() => onStatusChange(application.id, 'accepted')}
            className="flex-1 bg-green-600 hover:bg-green-700"
          >
            <Check className="mr-2 h-4 w-4" />
            Accept
          </Button>
          <Button 
            onClick={() => onStatusChange(application.id, 'rejected')}
            className="flex-1 bg-red-600 hover:bg-red-700"
          >
            <X className="mr-2 h-4 w-4" />
            Reject
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
