
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Navigation } from "@/components/Navigation";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { StudentProjectList } from "./components/StudentProjectList";
import { StudentApplicationList } from "./components/StudentApplicationList";
import { ClientProjectList } from "./components/ClientProjectList";
import { ClientApplicationList } from "./components/ClientApplicationList";
import { Button } from "@/components/ui/button";

export default function Projects() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("projects");

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
              <ClientProjectList />
            </TabsContent>
            
            <TabsContent value="applications">
              <ClientApplicationList />
            </TabsContent>
          </Tabs>
        )}
        
        {user?.role === 'student' && (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
            <TabsList className="mb-6">
              <TabsTrigger value="projects">Available Projects</TabsTrigger>
              <TabsTrigger value="applications">My Applications</TabsTrigger>
            </TabsList>
            
            <TabsContent value="projects">
              <StudentProjectList />
            </TabsContent>
            
            <TabsContent value="applications">
              <StudentApplicationList />
            </TabsContent>
          </Tabs>
        )}
      </main>
    </div>
  );
}
