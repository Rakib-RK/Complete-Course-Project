"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { QuestionEditor } from "@/components/question-editor"
import { AccessSettings } from "@/components/access-settings"
import { TagInput } from "@/components/tag-input"

const topics = [
  { value: "education", label: "Education" },
  { value: "business", label: "Business" },
  { value: "feedback", label: "Feedback" },
  { value: "quiz", label: "Quiz" },
  { value: "hr", label: "HR" },
  { value: "other", label: "Other" },
]

export default function CreateTemplatePage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("general")
  const [isPublic, setIsPublic] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [tags, setTags] = useState<string[]>([])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // In a real app, this would call an API endpoint to save the template
    setTimeout(() => {
      setIsLoading(false)
      router.push("/dashboard")
    }, 1000)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Create New Template</h1>
        <Button onClick={() => router.back()} variant="outline">
          Cancel
        </Button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-8">
          <Card>
            <CardContent className="p-4">
              <nav className="space-y-2">
                <Button
                  variant={activeTab === "general" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("general")}
                  type="button"
                >
                  General Settings
                </Button>
                <Button
                  variant={activeTab === "questions" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("questions")}
                  type="button"
                >
                  Questions
                </Button>
                <Button
                  variant={activeTab === "access" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("access")}
                  type="button"
                >
                  Access Settings
                </Button>
              </nav>
            </CardContent>
          </Card>

          <div className="space-y-6">
            {activeTab === "general" && (
              <Card>
                <CardHeader>
                  <CardTitle>General Settings</CardTitle>
                  <CardDescription>Configure the basic information for your template</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input id="title" placeholder="Enter template title" required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Enter template description (supports markdown)"
                      className="min-h-[120px]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="topic">Topic</Label>
                    <Select>
                      <SelectTrigger id="topic">
                        <SelectValue placeholder="Select a topic" />
                      </SelectTrigger>
                      <SelectContent>
                        {topics.map((topic) => (
                          <SelectItem key={topic.value} value={topic.value}>
                            {topic.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="image">Cover Image (optional)</Label>
                    <div className="border-2 border-dashed rounded-md p-6 text-center">
                      <p className="text-sm text-muted-foreground mb-2">Drag and drop an image, or click to browse</p>
                      <Button type="button" variant="outline" size="sm">
                        Upload Image
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Tags</Label>
                    <TagInput tags={tags} setTags={setTags} />
                    <p className="text-sm text-muted-foreground">Enter tags separated by comma or press Enter</p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch id="public" checked={isPublic} onCheckedChange={setIsPublic} />
                    <Label htmlFor="public">Make this template public</Label>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "questions" && (
              <Card>
                <CardHeader>
                  <CardTitle>Questions</CardTitle>
                  <CardDescription>Add and configure questions for your template</CardDescription>
                </CardHeader>
                <CardContent>
                  <QuestionEditor />
                </CardContent>
              </Card>
            )}

            {activeTab === "access" && (
              <Card>
                <CardHeader>
                  <CardTitle>Access Settings</CardTitle>
                  <CardDescription>Control who can access and fill out this template</CardDescription>
                </CardHeader>
                <CardContent>
                  <AccessSettings isPublic={isPublic} setIsPublic={setIsPublic} />
                </CardContent>
              </Card>
            )}

            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Template"}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

