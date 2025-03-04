"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Edit, Eye, Trash } from "lucide-react"
import Link from "next/link"

// This would be fetched from the database in a real application
const initialForms = [
  {
    id: "1",
    templateTitle: "Job Application Form",
    templateId: "template-1",
    submittedAt: "2023-10-22",
    templateOwner: "HR Department",
  },
  {
    id: "2",
    templateTitle: "Customer Feedback Survey",
    templateId: "template-2",
    submittedAt: "2023-10-18",
    templateOwner: "Marketing Team",
  },
  {
    id: "3",
    templateTitle: "Event Registration",
    templateId: "template-3",
    submittedAt: "2023-10-15",
    templateOwner: "Events Team",
  },
]

export function UserForms() {
  const [forms, setForms] = useState(initialForms)
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

  const sortedForms = [...forms].sort((a, b) => {
    if (!sortField) return 0

    const fieldA = a[sortField as keyof typeof a]
    const fieldB = b[sortField as keyof typeof b]

    if (typeof fieldA === "string" && typeof fieldB === "string") {
      return sortDirection === "asc" ? fieldA.localeCompare(fieldB) : fieldB.localeCompare(fieldA)
    }

    return 0
  })

  const deleteForm = (id: string) => {
    setForms(forms.filter((form) => form.id !== id))
  }

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="cursor-pointer" onClick={() => handleSort("templateTitle")}>
              Template {sortField === "templateTitle" && (sortDirection === "asc" ? "↑" : "↓")}
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort("templateOwner")}>
              Template Owner {sortField === "templateOwner" && (sortDirection === "asc" ? "↑" : "↓")}
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort("submittedAt")}>
              Submitted {sortField === "submittedAt" && (sortDirection === "asc" ? "↑" : "↓")}
            </TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedForms.map((form) => (
            <TableRow key={form.id}>
              <TableCell>
                <Link href={`/forms/${form.id}`} className="font-medium hover:underline">
                  {form.templateTitle}
                </Link>
              </TableCell>
              <TableCell>{form.templateOwner}</TableCell>
              <TableCell>{form.submittedAt}</TableCell>
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
                      <Link href={`/forms/${form.id}`}>
                        <Eye className="mr-2 h-4 w-4" /> View
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`/forms/${form.id}/edit`}>
                        <Edit className="mr-2 h-4 w-4" /> Edit
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`/templates/${form.templateId}`}>
                        <Eye className="mr-2 h-4 w-4" /> View Template
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => deleteForm(form.id)} className="text-red-600 focus:text-red-600">
                      <Trash className="mr-2 h-4 w-4" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {forms.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground mb-4">You haven't submitted any forms yet</p>
          <Button asChild>
            <Link href="/templates">Browse Templates</Link>
          </Button>
        </div>
      )}
    </div>
  )
}

