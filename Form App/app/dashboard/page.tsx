import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { UserTemplates } from "@/components/user-templates"
import { UserForms } from "@/components/user-forms"

export default function DashboardPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Dashboard</h1>
        <Button asChild>
          <Link href="/templates/create">Create New Template</Link>
        </Button>
      </div>

      <Tabs defaultValue="templates" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="templates">My Templates</TabsTrigger>
          <TabsTrigger value="forms">My Forms</TabsTrigger>
        </TabsList>
        <TabsContent value="templates">
          <UserTemplates />
        </TabsContent>
        <TabsContent value="forms">
          <UserForms />
        </TabsContent>
      </Tabs>
    </div>
  )
}

