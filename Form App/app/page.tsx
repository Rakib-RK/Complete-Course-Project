import { Button } from "@/components/ui/button"
import Link from "next/link"
import LatestTemplates from "@/components/latest-templates"
import PopularTemplates from "@/components/popular-templates"
import TagCloud from "@/components/tag-cloud"
import { SearchBar } from "@/components/search-bar"

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">FormCraft</h1>

      <div className="mb-8 max-w-2xl mx-auto">
        <SearchBar />
      </div>

      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6">Fresh Off the Press</h2>
        <LatestTemplates />
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6">Community Favorites</h2>
        <PopularTemplates />
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6">Explore Topics</h2>
        <TagCloud />
      </section>

      <section className="text-center py-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
        <h2 className="text-3xl font-bold mb-4">Create Your Perfect Form</h2>
        <p className="text-lg mb-6 max-w-2xl mx-auto">
          From quick surveys to complex questionnaires, bring your ideas to life with our intuitive form builder.
        </p>
        <div className="flex justify-center gap-4">
          <Button asChild size="lg">
            <Link href="/templates/create">Start Creating</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/templates">Explore Templates</Link>
          </Button>
        </div>
      </section>
    </main>
  )
}

