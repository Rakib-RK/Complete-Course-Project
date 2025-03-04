"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Edit, Eye, Trash, Copy, Lock, Unlock } from "lucide-react"
import Link from "next/link"

// This would be fetched from the database in a real application
const initialTemplates = [
  {
    id: "1",
    title: "Job Application Form",
    createdAt: "2023-10-15",
    updatedAt: "2023-10-20",
    responses: 24,
    isPublic: true,
    topic: "Employment",
  },
  {
    id: "2",
    title: "Customer Feedback Survey",
    createdAt: "2023-09-05",
    updatedAt: "2023-10-18",
    responses: 156,
    isPublic: true,
    topic: "Feedback",
  },
  {
    id: "3",
    title: "Team Performance Review",
    createdAt: "2023-08-22",
    updatedAt: "2023-09-30",
    responses: 8,
    isPublic: false,
    topic: "HR",
  },
]

export function UserTemplates() {
  const [templates, setTemplates] = useState(initialTemplates)
  const [sortField, setSortField] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const sortedTemplates = [...templates].sort((a, b) => {
    if (!sortField) return 0

    const fieldA = a[sortField as keyof typeof a]
    const fieldB = b[sortField as keyof typeof b]

    if (typeof fieldA === "string" && typeof fieldB === "string") {
      return sortDirection === "asc" ? fieldA.localeCompare(fieldB) : fieldB.localeCompare(fieldA)
    }

    if (typeof fieldA === "number" && typeof fieldB === "number") {
      return sortDirection === "asc" ? fieldA - fieldB : fieldB - fieldA
    }

    if (typeof fieldA === "boolean" && typeof fieldB === "boolean") {
      return sortDirection === "asc"
        ? fieldA === fieldB
          ? 0
          : fieldA
            ? 1
            : -1
        : fieldA === fieldB
          ? 0
          : fieldA
            ? -1
            : 1
    }

    return 0
  })

  const toggleVisibility = (id: string) => {
    setTemplates(
      templates.map((template) => (template.id === id ? { ...template, isPublic: !template.isPublic } : template)),
    )
  }

  const deleteTemplate = (id: string) => {
    setTemplates(templates.filter((template) => template.id !== id))
  }

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="cursor-pointer" onClick={() => handleSort("title")}>
              Title {sortField === "title" && (sortDirection === "asc" ? "↑" : "↓")}
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort("topic")}>
              Topic {sortField === "topic" && (sortDirection === "asc" ? "↑" : "↓")}
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort("createdAt")}>
              Created {sortField === "createdAt" && (sortDirection === "asc" ? "↑" : "↓")}
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort("updatedAt")}>
              Updated {sortField === "updatedAt" && (sortDirection === "asc" ? "↑" : "↓")}
            </TableHead>
            <TableHead className="cursor-pointer text-right" onClick={() => handleSort("responses")}>
              Responses {sortField === "responses" && (sortDirection === "asc" ? "↑" : "↓")}
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort("isPublic")}>
              Visibility {sortField === "isPublic" && (sortDirection === "asc" ? "↑" : "↓")}
            </TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedTemplates.map((template) => (
            <TableRow key={template.id}>
              <TableCell>
                <Link href={`/templates/${template.id}`} className="font-medium hover:underline">
                  {template.title}
                </Link>
              </TableCell>
              <TableCell>
                <Badge variant="outline">{template.topic}</Badge>
              </TableCell>
              <TableCell>{template.createdAt}</TableCell>
              <TableCell>{template.updatedAt}</TableCell>
              <TableCell className="text-right">{template.responses}</TableCell>
              <TableCell>
                {template.isPublic ? (
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    Public
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                    Restricted
                  </Badge>
                )}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={`/templates/${template.id}`}>
                        <Eye className="mr-2 h-4 w-4" /> View
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`/templates/${template.id}/edit`}>
                        <Edit className="mr-2 h-4 w-4" /> Edit
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`/templates/${template.id}/results`}>
                        <Eye className="mr-2 h-4 w-4" /> Results
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => toggleVisibility(template.id)}>
                      {template.isPublic ? (
                        <>
                          <Lock className="mr-2 h-4 w-4" /> Make Private
                        </>
                      ) : (
                        <>
                          <Unlock className="mr-2 h-4 w-4" /> Make Public
                        </>
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`/templates/${template.id}/duplicate`}>
                        <Copy className="mr-2 h-4 w-4" /> Duplicate
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => deleteTemplate(template.id)}
                      className="text-red-600 focus:text-red-600"
                    >
                      <Trash className="mr-2 h-4 w-4" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {templates.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground mb-4">You haven't created any templates yet</p>
          <Button asChild>
            <Link href="/templates/create">Create Your First Template</Link>
          </Button>
        </div>
      )}
    </div>
  )
}

