import { Navbar } from '@/components/Navbar'
import { Hero } from '@/components/Hero'
import { Projects } from '@/components/Projects'
import { TechStack } from '@/components/TechStack'
import { ContactForm } from '@/components/ContactForm'
import { Footer } from '@/components/Footer'
import { createPublicClient, isSupabaseConfigured } from '@/lib/supabase/server'
import { Profile, Project } from '@/types/database'

export const revalidate = 60

export default async function HomePage() {
  let profile: Profile | null = null
  let projects: Project[] = []

  if (isSupabaseConfigured()) {
    try {
      const supabase = createPublicClient()
      if (supabase) {
        // Fetch Profile
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .limit(1)
          .single()

        if (profileData) profile = profileData

        // Fetch Projects
        const { data: projectsData } = await supabase
          .from('projects')
          .select('*')
          .order('order_index', { ascending: true })

        if (Array.isArray(projectsData) && projectsData.length > 0) {
          projects = projectsData
        }
      }
    } catch (err) {
      console.warn('Supabase fetch fallback mode:', err)
    }
  }

  return (
    <main className="min-h-screen relative">
      <Navbar />
      <Hero profile={profile} />
      <Projects projects={projects} />
      <TechStack />
      <ContactForm />
      <Footer />
    </main>
  )
}
