"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { Socket } from "socket.io-client"

interface Comment {
  id: string
  userId: string
  userName: string
  userImage: string | null
  content: string
  createdAt: string
}

interface TemplateCommentsProps {
  id: string
}

export default function TemplateComments({ id }: TemplateCommentsProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const socketRef = useRef<Socket | null>(null)
  const commentsEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchComments = async () => {
      // In a real app, this would fetch from an API
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500))

        // Mock data
        const mockComments: Comment[] = [
          {
            id: "c1",
            userId: "u1",
            userName: "Alice Johnson",
            userImage: null,
            content: "Great template! I've been looking for something like this.",
            createdAt: "2023-06-10T14:30:00Z",
          },
          {
            id: "c2",
            userId: "u2",
            userName: "Bob Smith",
            userImage: null,
            content: "Could you add a field for portfolio links?",
            createdAt: "2023-06-12T09:15:00Z",
          },
        ]

        setComments(mockComments)
      } catch (error) {
        console.error("Failed to fetch comments:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchComments()

    // In a real app, we would connect to a WebSocket server
    // For now, we'll simulate real-time updates
    const interval = setInterval(() => {
      // Simulate receiving a new comment every 30 seconds
      const shouldAddComment = Math.random() > 0.7
      if (shouldAddComment) {
        const newComment: Comment = {
          id: `c${Date.now()}`,
          userId: "u3",
          userName: "Charlie Brown",
          userImage: null,
          content: "Just filled out this form. Very intuitive!",
          createdAt: new Date().toISOString(),
        }
        setComments((prev) => [...prev, newComment])
      }
    }, 30000)

    return () => {
      clearInterval(interval)
      // In a real app, we would disconnect from the WebSocket server
    }
  }, [])

  useEffect(() => {
    // Scroll to bottom when comments change
    commentsEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [])

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return

    setIsSubmitting(true)

    // In a real app, this would call an API to submit the comment
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Add the new comment
      const comment: Comment = {
        id: `c${Date.now()}`,
        userId: "u1", // Current user ID
        userName: "John Doe", // Current user name
        userImage: null,
        content: newComment,
        createdAt: new Date().toISOString(),
      }

      setComments([...comments, comment])
      setNewComment("")
    } catch (error) {
      console.error("Failed to submit comment:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return <div>Loading comments...</div>
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <h2 className="text-2xl font-bold">Comments ({comments.length})</h2>

      <div className="space-y-4 max-h-96 overflow-y-auto p-4 border rounded-md">
        {comments.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No comments yet. Be the first to comment!</p>
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="flex gap-4">
              <Avatar>
                <AvatarImage src={comment.userImage || ""} alt={comment.userName} />
                <AvatarFallback>{comment.userName.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium">{comment.userName}</span>
                  <span className="text-xs text-muted-foreground">{new Date(comment.createdAt).toLocaleString()}</span>
                </div>
                <p>{comment.content}</p>
              </div>
            </div>
          ))
        )}
        <div ref={commentsEndRef} />
      </div>

      <form onSubmit={handleSubmitComment} className="space-y-4">
        <Textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          rows={3}
        />
        <Button type="submit" disabled={isSubmitting || !newComment.trim()}>
          {isSubmitting ? "Posting..." : "Post Comment"}
        </Button>
      </form>
    </div>
  )
}

