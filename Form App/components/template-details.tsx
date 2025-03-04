"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Heart, Share2, Edit } from "lucide-react"
import type { Template } from "@/lib/data"

interface TemplateDetailsProps {
  id: string
}

export default function TemplateDetails({ id }: TemplateDetailsProps) {
  const [template, setTemplate] = useState<Template | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)

  useEffect(() => {
    const fetchTemplate = async () => {
      // In a real app, this would fetch from an API
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500))

        // Mock data
        const mockTemplate: Template = {
          id,
          title: "Job Application Form",
          description: "A form for collecting job applications with experience and contact details.",
          topic: "Business",
          imageUrl: "/placeholder.svg?height=400&width=800",
          isPublic: true,
          createdAt: "2023-05-15T10:00:00Z",
          author: {
            id: "1",
            name: "John Doe",
            email: "john@example.com",
            image: null,
            isAdmin: true,
          },
          responseCount: 42,
          tags: [
            { id: "1", name: "job" },
            { id: "2", name: "application" },
          ],
        }

        setTemplate(mockTemplate)
        setLikeCount(15) // Mock like count
      } catch (error) {
        console.error("Failed to fetch template:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTemplate()
  }, [id])

  const toggleLike = () => {
    setLiked(!liked)
    setLikeCount(liked ? likeCount - 1 : likeCount + 1)
  }

  if (isLoading) {
    return <div>Loading template details...</div>
  }

  if (!template) {
    return <div>Template not found</div>
  }

  return (
    <div>
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">{template.title}</h1>
          <div className="flex items-center gap-4 text-muted-foreground">
            <span>By {template.author.name}</span>
            <span>•</span>
            <span>{new Date(template.createdAt).toLocaleDateString()}</span>
            <span>•</span>
            <span>{template.responseCount} responses</span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={toggleLike}>
            <Heart className={`mr-2 h-4 w-4 ${liked ? "fill-red-500 text-red-500" : ""}`} />
            {likeCount}
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
          <Button variant="outline" size="sm">
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
        </div>
      </div>

      {template.imageUrl && (
        <div className="relative h-64 mb-6 rounded-lg overflow-hidden">
          <Image src={template.imageUrl || "/placeholder.svg"} alt={template.title} fill className="object-cover" />
        </div>
      )}

      <div className="mb-6">
        <p className="text-lg mb-4">{template.description}</p>
        <div className="flex flex-wrap gap-2">
          <Badge>{template.topic}</Badge>
          {template.tags.map((tag) => (
            <Badge key={tag.id} variant="secondary">
              {tag.name}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  )
}

