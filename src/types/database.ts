export interface Profile {
  id: string;
  name: string;
  title: string;
  bio: string;
  status_text: string;
  is_available: boolean;
  avatar_url?: string;
  github_url?: string;
  linkedin_url?: string;
  twitter_url?: string;
  dribbble_url?: string;
  email?: string;
  updated_at?: string;
}

export interface CaseStudySection {
  id: string;
  title: string;
  content: string;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  category: 'Web Development' | 'Design' | 'Mobile App' | string;
  description: string;
  content?: string;
  sections?: CaseStudySection[];
  image_url: string;
  tags: string[];
  demo_url?: string;
  github_url?: string;
  is_featured: boolean;
  order_index?: number;
  created_at?: string;
}

export interface Message {
  id: string;
  sender_name: string;
  sender_email: string;
  message: string;
  is_read: boolean;
  created_at: string;
}
