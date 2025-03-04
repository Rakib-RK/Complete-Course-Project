// This is a mock data file. In a real application, this would connect to a database.

// Types
export type User = {
  id: string
  name: string
  email: string
  image: string | null
  isAdmin: boolean
}

export type Template = {
  id: string
  title: string
  description: string
  topic: string
  imageUrl: string | null
  isPublic: boolean
  createdAt: string
  author: User
  responseCount: number
  tags: { id: string; name: string }[]
}

// Mock data
const users: User[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    image: null,
    isAdmin: true,
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    image: null,
    isAdmin: false,
  },
]

const templates: Template[] = [
  {
    id: "1",
    title: "Job Application Form",
    description: "A form for collecting job applications with experience and contact details.",
    topic: "Business",
    imageUrl: "/placeholder.svg?height=400&width=600",
    isPublic: true,
    createdAt: "2023-05-15T10:00:00Z",
    author: users[0],
    responseCount: 42,
    tags: [
      { id: "1", name: "job" },
      { id: "2", name: "application" },
    ],
  },
  {
    id: "2",
    title: "Customer Satisfaction Survey",
    description: "Collect feedback from your customers about their experience with your product or service.",
    topic: "Business",
    imageUrl: "/placeholder.svg?height=400&width=600",
    isPublic: true,
    createdAt: "2023-06-20T14:30:00Z",
    author: users[1],
    responseCount: 128,
    tags: [
      { id: "3", name: "feedback" },
      { id: "4", name: "customer" },
    ],
  },
  {
    id: "3",
    title: "Event Registration",
    description: "A form for registering participants for your next event or conference.",
    topic: "Events",
    imageUrl: "/placeholder.svg?height=400&width=600",
    isPublic: true,
    createdAt: "2023-07-05T09:15:00Z",
    author: users[0],
    responseCount: 75,
    tags: [
      { id: "5", name: "event" },
      { id: "6", name: "registration" },
    ],
  },
  {
    id: "4",
    title: "Quiz: General Knowledge",
    description: "Test your general knowledge with this fun quiz.",
    topic: "Education",
    imageUrl: "/placeholder.svg?height=400&width=600",
    isPublic: true,
    createdAt: "2023-08-10T16:45:00Z",
    author: users[1],
    responseCount: 210,
    tags: [
      { id: "7", name: "quiz" },
      { id: "8", name: "knowledge" },
    ],
  },
  {
    id: "5",
    title: "Product Feedback",
    description: "Help us improve our product by providing your feedback.",
    topic: "Business",
    imageUrl: "/placeholder.svg?height=400&width=600",
    isPublic: true,
    createdAt: "2023-09-25T11:20:00Z",
    author: users[0],
    responseCount: 56,
    tags: [
      { id: "3", name: "feedback" },
      { id: "9", name: "product" },
    ],
  },
]

// Mock API functions
export async function getLatestTemplates(): Promise<Template[]> {
  // In a real app, this would query the database
  return templates.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

export async function getPopularTemplates(): Promise<Template[]> {
  // In a real app, this would query the database
  return templates.sort((a, b) => b.responseCount - a.responseCount).slice(0, 5)
}

export async function getTags(): Promise<{ id: string; name: string; count: number }[]> {
  // In a real app, this would query the database
  const tagMap = new Map<string, { id: string; count: number }>()

  templates.forEach((template) => {
    template.tags.forEach((tag) => {
      if (tagMap.has(tag.name)) {
        const existing = tagMap.get(tag.name)!
        tagMap.set(tag.name, { ...existing, count: existing.count + 1 })
      } else {
        tagMap.set(tag.name, { id: tag.id, count: 1 })
      }
    })
  })

  return Array.from(tagMap.entries()).map(([name, { id, count }]) => ({
    id,
    name,
    count,
  }))
}

