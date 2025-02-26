
export type UserRole = 'student' | 'client';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  full_name?: string;
  avatar_url?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  budget: number;
  client_id: string;
  status: 'open' | 'in_progress' | 'completed';
  created_at: string;
  skills_required: string[];
}
