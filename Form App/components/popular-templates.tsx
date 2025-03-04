import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

const popularTemplates = [
  {
    id: "1",
    title: "Employee Satisfaction Survey",
    submissions: 1287,
    author: "HR Department",
    tags: ["Workplace", "Feedback"],
  },
  {
    id: "2",
    title: "Product Launch Feedback",
    submissions: 956,
    author: "Marketing Team",
    tags: ["Product", "Feedback"],
  },
  {
    id: "3",
    title: "Conference Registration",
    submissions: 843,
    author: "Events Team",
    tags: ["Event", "Registration"],
  },
  {
    id: "4",
    title: "Customer Support Ticket",
    submissions: 721,
    author: "Support Team",
    tags: ["Customer Service", "Support"],
  },
  {
    id: "5",
    title: "Website Usability Survey",
    submissions: 689,
    author: "UX Research Team",
    tags: ["UX", "Feedback"],
  },
]

export default function PopularTemplates() {
  return (
    <div className="space-y-4">
      {popularTemplates.map((template, index) => (
        <Card key={template.id}>
          <CardHeader className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-2xl font-bold text-muted-foreground">{index + 1}</span>
                <div>
                  <CardTitle className="text-lg">
                    <Link href={`/templates/${template.id}`} className="hover:underline">
                      {template.title}
                    </Link>
                  </CardTitle>
                  <div className="text-sm text-muted-foreground">
                    By {template.author} • {template.submissions} submissions
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                {template.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </CardHeader>
        </Card>
      ))}
    </div>
  )
}

