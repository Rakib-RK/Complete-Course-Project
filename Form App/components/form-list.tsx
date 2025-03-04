"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Eye, Trash, Edit } from "lucide-react"

type Form = {
  id: string
  templateId: string
  templateTitle: string
  submittedAt: string
}

export default function FormList() {
  const [forms, setForms] = useState<Form[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchForms = async () => {
      // In a real app, this would fetch from an API
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500))

        // Mock data
        const mockForms = [
          {
            id: "1",
            templateId: "1",
            templateTitle: "Job Application Form",
            submittedAt: "2023-06-15T10:30:00Z",
          },
          {
            id: "2",
            templateId: "2",
            templateTitle: "Customer Feedback",
            submittedAt: "2023-07-20T14:45:00Z",
          },
        ]

        setForms(mockForms)
      } catch (error) {
        console.error("Failed to fetch forms:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchForms()
  }, [])

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this form?")) {
      // In a real app, this would call an API
      setForms(forms.filter((form) => form.id !== id))
    }
  }

  if (isLoading) {
    return <div>Loading forms...</div>
  }

  if (forms.length === 0) {
    return (
      <div className="text-center py-10">
        <h3 className="text-lg font-medium mb-2">No forms submitted yet</h3>
        <p className="text-muted-foreground">You haven't submitted any forms yet</p>
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Template</TableHead>
          <TableHead>Submitted</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {forms.map((form) => (
          <TableRow key={form.id}>
            <TableCell className="font-medium">
              <Link href={`/templates/${form.templateId}`} className="hover:underline">
                {form.templateTitle}
              </Link>
            </TableCell>
            <TableCell>{new Date(form.submittedAt).toLocaleDateString()}</TableCell>
            <TableCell className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Actions</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href={`/forms/${form.id}`}>
                      <Eye className="mr-2 h-4 w-4" />
                      View
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href={`/forms/${form.id}/edit`}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleDelete(form.id)}>
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

