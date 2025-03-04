"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Question {
  id: string
  type: "text" | "textarea" | "number" | "checkbox"
  title: string
  description: string
}

interface TemplateFormProps {
  id: string
}

export default function TemplateForm({ id }: TemplateFormProps) {
  const [questions, setQuestions] = useState<Question[]>([])
  const [answers, setAnswers] = useState<Record<string, any>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const fetchQuestions = async () => {
      // In a real app, this would fetch from an API
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500))

        // Mock data
        const mockQuestions: Question[] = [
          {
            id: "q1",
            type: "text",
            title: "Position",
            description: "What position are you applying for?",
          },
          {
            id: "q2",
            type: "number",
            title: "Experience",
            description: "Work on commercial projects or freelance (in years)",
          },
          {
            id: "q3",
            type: "text",
            title: "Contact",
            description: "Phone number or Skype",
          },
          {
            id: "q4",
            type: "textarea",
            title: "Additional Information",
            description: "Write anything in the field below",
          },
        ]

        setQuestions(mockQuestions)

        // Initialize answers
        const initialAnswers: Record<string, any> = {}
        mockQuestions.forEach((q) => {
          initialAnswers[q.id] = q.type === "checkbox" ? false : ""
        })
        setAnswers(initialAnswers)
      } catch (error) {
        console.error("Failed to fetch questions:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchQuestions()
  }, [])

  const handleInputChange = (questionId: string, value: any) => {
    setAnswers({
      ...answers,
      [questionId]: value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // In a real app, this would call an API to submit the form
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Redirect to the dashboard
      router.push("/dashboard")
    } catch (error) {
      console.error("Failed to submit form:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return <div>Loading form...</div>
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {questions.map((question) => (
        <Card key={question.id}>
          <CardHeader>
            <CardTitle>{question.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">{question.description}</p>
            {question.type === "text" && (
              <Input
                value={answers[question.id] || ""}
                onChange={(e) => handleInputChange(question.id, e.target.value)}
                placeholder="Enter your answer"
              />
            )}
            {question.type === "textarea" && (
              <Textarea
                value={answers[question.id] || ""}
                onChange={(e) => handleInputChange(question.id, e.target.value)}
                placeholder="Enter your answer"
                rows={4}
              />
            )}
            {question.type === "number" && (
              <Input
                type="number"
                value={answers[question.id] || ""}
                onChange={(e) => handleInputChange(question.id, e.target.value)}
                placeholder="Enter a number"
              />
            )}
            {question.type === "checkbox" && (
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={question.id}
                  checked={answers[question.id] || false}
                  onCheckedChange={(checked) => handleInputChange(question.id, checked)}
                />
                <Label htmlFor={question.id}>Yes</Label>
              </div>
            )}
          </CardContent>
        </Card>
      ))}

      <div className="flex items-center space-x-2">
        <Checkbox id="email-copy" />
        <Label htmlFor="email-copy">Email me a copy of my answers</Label>
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Submit Form"}
      </Button>
    </form>
  )
}

