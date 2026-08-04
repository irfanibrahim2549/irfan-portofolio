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

        // Fetch Featured Projects for Landing Page
        const { data: featuredData } = await supabase
          .from('projects')
          .select('*')
          .eq('is_featured', true)
          .order('order_index', { ascending: true })

        if (Array.isArray(featuredData) && featuredData.length > 0) {
          projects = featuredData
        } else {
          // Fallback to all projects if no featured flag set
          const { data: allData } = await supabase
            .from('projects')
            .select('*')
            .order('order_index', { ascending: true })

          if (Array.isArray(allData) && allData.length > 0) {
            projects = allData
          }
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
      <div className="w-full bg-gradient-to-b from-transparent via-blue-500/10 to-blue-600/20 dark:via-blue-500/10 dark:to-blue-500/30">
        <ContactForm />
        <Footer />
      </div>
    </main>
  )
}
