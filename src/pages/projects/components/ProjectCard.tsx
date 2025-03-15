
import { Project } from "@/types/user";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

interface ProjectCardProps {
  project: Project;
  onApply?: (project: Project) => void;
  isClient?: boolean;
}

export function ProjectCard({ project, onApply, isClient = false }: ProjectCardProps) {
  return (
    <Card>
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
      {!isClient && project.status === 'open' && onApply && (
        <CardFooter>
          <Button 
            className="w-full"
            onClick={() => onApply(project)}
          >
            <FileText className="mr-2" />
            Apply Now
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
