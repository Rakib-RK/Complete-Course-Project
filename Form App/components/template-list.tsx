"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Edit, MoreHorizontal, Trash, Eye } from "lucide-react"
import type { Template } from "@/lib/data"

export default function TemplateList() {
  const [templates, setTemplates] = useState<Template[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchTemplates = async () => {
      // In a real app, this would fetch from an API
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500))

        // Mock data
        const mockTemplates = [
          {
            id: "1",
            title: "Job Application Form",
            description: "A form for collecting job applications",
            topic: "Business",
            imageUrl: null,
            isPublic: true,
            createdAt: "2023-05-15T10:00:00Z",
            author: { id: "1", name: "John Doe", email: "john@example.com", image: null, isAdmin: true },
            responseCount: 42,
            tags: [
              { id: "1", name: "job" },
              { id: "2", name: "application" },
            ],
          },
          {
            id: "2",
            title: "Customer Feedback",
            description: "Collect feedback from your customers",
            topic: "Business",
            imageUrl: null,
            isPublic: true,
            createdAt: "2023-06-20T14:30:00Z",
            author: { id: "1", name: "John Doe", email: "john@example.com", image: null, isAdmin: true },
            responseCount: 15,
            tags: [
              { id: "3", name: "feedback" },
              { id: "4", name: "customer" },
            ],
          },
        ]

        setTemplates(mockTemplates)
      } catch (error) {
        console.error("Failed to fetch templates:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTemplates()
  }, [])

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this template?")) {
      // In a real app, this would call an API
      setTemplates(templates.filter((template) => template.id !== id))
    }
  }

  if (isLoading) {
    return <div>Loading templates...</div>
  }

  if (templates.length === 0) {
    return (
      <div className="text-center py-10">
        <h3 className="text-lg font-medium mb-2">No templates yet</h3>
        <p className="text-muted-foreground mb-4">Create your first template to get started</p>
        <Button onClick={() => router.push("/templates/create")}>Create Template</Button>
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Topic</TableHead>
          <TableHead>Visibility</TableHead>
          <TableHead>Created</TableHead>
          <TableHead>Responses</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {templates.map((template) => (
          <TableRow key={template.id}>
            <TableCell className="font-medium">
              <Link href={`/templates/${template.id}`} className="hover:underline">
                {template.title}
              </Link>
            </TableCell>
            <TableCell>{template.topic}</TableCell>
            <TableCell>
              <Badge variant={template.isPublic ? "default" : "secondary"}>
                {template.isPublic ? "Public" : "Restricted"}
              </Badge>
            </TableCell>
            <TableCell>{new Date(template.createdAt).toLocaleDateString()}</TableCell>
            <TableCell>{template.responseCount}</TableCell>
            <TableCell className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Actions</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => router.push(`/templates/${template.id}`)}>
                    <Eye className="mr-2 h-4 w-4" />
                    View
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push(`/templates/${template.id}/edit`)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleDelete(template.id)}>
                    <Trash className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

