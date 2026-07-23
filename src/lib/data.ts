import { Project } from '@/types/database'

export const DEFAULT_PROJECTS: Project[] = [
  {
    id: '1',
    title: 'SaaS Analytics Dashboard',
    slug: 'saas-analytics-dashboard',
    category: 'Web Development',
    description: 'Real-time analytics dashboard with high-throughput event processing, customizable widgets, and automated reporting system for high-growth SaaS platforms.',
    content: `An end-to-end SaaS analytics platform designed to aggregate metrics across multiple user touchpoints.

### Key Highlights
- **Real-time Event Ingestion**: Processed over 100k events/sec using custom webhooks and worker threads.
- **Customizable Widgets**: Built drag-and-drop dashboard components using React and D3.js.
- **Dark/Light Mode Aesthetics**: Designed with modern glassmorphism principles and accessible contrast ratios.

### Tech Stack
- Frontend: Next.js 14 (App Router), React, Tailwind CSS, Framer Motion
- Backend & DB: Supabase (PostgreSQL, Realtime Subscriptions), Node.js Services`,
    image_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop',
    tags: ['Next.js', 'TypeScript', 'Tailwind', 'Supabase'],
    demo_url: 'https://example.com',
    github_url: 'https://github.com',
    is_featured: true,
  },
  {
    id: '2',
    title: 'Minimalist Brand & UI Design System',
    slug: 'minimalist-brand-ui-design-system',
    category: 'Design',
    description: 'Generative AI brand identity and comprehensive UI design system tailored for modern tech startups and creative agencies.',
    content: `A complete design system and brand identity guidelines built for digital products.

### Scope of Work
- **Brand Identity**: Logo design, typography hierarchy, and color system (RGB & HSL tokens).
- **Component Library**: 50+ Figma variants including buttons, inputs, modals, and navigation bars.
- **Accessibility Audit**: Passed WCAG AAA compliance for text contrast and focus indicators.`,
    image_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop',
    tags: ['UI/UX Design', 'Figma', 'Design System', 'Branding'],
    demo_url: 'https://example.com',
    github_url: 'https://github.com',
    is_featured: true,
  },
  {
    id: '3',
    title: 'Fintech Mobile Banking App',
    slug: 'fintech-mobile-banking-app',
    category: 'Web Development',
    description: 'Cross-platform mobile application for smart budgeting, automated crypto portfolio tracking, and instant peer-to-peer payments.',
    content: `A modern mobile banking experience focused on security, speed, and clean typography.

### Features
- Biometric authentication (FaceID / Fingerprint).
- Real-time transaction notifications and categorized spending analytics.
- Multi-currency wallet with instant exchange capability.`,
    image_url: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=1000&auto=format&fit=crop',
    tags: ['React Native', 'TypeScript', 'Node.js', 'PostgreSQL'],
    demo_url: 'https://example.com',
    github_url: 'https://github.com',
    is_featured: false,
  },
]
