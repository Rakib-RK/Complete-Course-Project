import { Suspense } from "react"
import { notFound } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import DashboardHeader from "@/components/dashboard-header"
import TemplateDetails from "@/components/template-details"
import TemplateForm from "@/components/template-form"
import TemplateResults from "@/components/template-results"
import TemplateComments from "@/components/template-comments"

interface TemplatePageProps {
  params: {
    id: string
  }
}

export default function TemplatePage({ params }: TemplatePageProps) {
  // In a real app, we would fetch the template data here
  // For now, we'll just check if the ID is valid
  if (params.id !== "1" && params.id !== "2" && params.id !== "3" && params.id !== "4" && params.id !== "5") {
    notFound()
  }

  return (
    <div>
      <DashboardHeader />
      <main className="container py-10">
        <Suspense fallback={<div>Loading template...</div>}>
          <TemplateDetails id={params.id} />
        </Suspense>

        <Tabs defaultValue="form" className="mt-8">
          <TabsList className="mb-6">
            <TabsTrigger value="form">Form</TabsTrigger>
            <TabsTrigger value="results">Results</TabsTrigger>
            <TabsTrigger value="comments">Comments</TabsTrigger>
          </TabsList>

          <TabsContent value="form">
            <Suspense fallback={<div>Loading form...</div>}>
              <TemplateForm id={params.id} />
            </Suspense>
          </TabsContent>

          <TabsContent value="results">
            <Suspense fallback={<div>Loading results...</div>}>
              <TemplateResults id={params.id} />
            </Suspense>
          </TabsContent>

          <TabsContent value="comments">
            <Suspense fallback={<div>Loading comments...</div>}>
              <TemplateComments id={params.id} />
            </Suspense>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

