"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface FormResponse {
  id: string
  userId: string
  userName: string
  submittedAt: string
  answers: Record<string, any>
}

interface TemplateResultsProps {
  id: string
}

export default function TemplateResults({ id }: TemplateResultsProps) {
  const [responses, setResponses] = useState<FormResponse[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchResponses = async () => {
      // In a real app, this would fetch from an API
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500))

        // Mock data
        const mockResponses: FormResponse[] = [
          {
            id: "r1",
            userId: "u1",
            userName: "Alice Johnson",
            submittedAt: "2023-06-10T14:30:00Z",
            answers: {
              q1: "Frontend Developer",
              q2: "3",
              q3: "+1234567890",
              q4: "I have experience with React and TypeScript.",
            },
          },
          {
            id: "r2",
            userId: "u2",
            userName: "Bob Smith",
            submittedAt: "2023-06-12T09:15:00Z",
            answers: {
              q1: "Backend Developer",
              q2: "5",
              q3: "bob.smith",
              q4: "I specialize in Node.js and PostgreSQL.",
            },
          },
          {
            id: "r3",
            userId: "u3",
            userName: "Charlie Brown",
            submittedAt: "2023-06-15T16:45:00Z",
            answers: {
              q1: "Full Stack Developer",
              q2: "7",
              q3: "+9876543210",
              q4: "I have worked with MERN stack for 5 years.",
            },
          },
        ]

        setResponses(mockResponses)
      } catch (error) {
        console.error("Failed to fetch responses:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchResponses()
  }, [])

  // Prepare data for the chart
  const chartData = responses.map((response) => ({
    name: response.userName,
    experience: Number.parseInt(response.answers.q2) || 0,
  }))

  if (isLoading) {
    return <div>Loading results...</div>
  }

  if (responses.length === 0) {
    return (
      <div className="text-center py-10">
        <h3 className="text-lg font-medium mb-2">No responses yet</h3>
        <p className="text-muted-foreground">Share your template to collect responses</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Results ({responses.length})</h2>
        <Button variant="outline">Export Results</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Experience Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis label={{ value: "Years", angle: -90, position: "insideLeft" }} />
                <Tooltip />
                <Bar dataKey="experience" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div>
        <h3 className="text-xl font-bold mb-4">Individual Responses</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Position</TableHead>
              <TableHead>Experience</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Submitted</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {responses.map((response) => (
              <TableRow key={response.id}>
                <TableCell className="font-medium">{response.userName}</TableCell>
                <TableCell>{response.answers.q1}</TableCell>
                <TableCell>{response.answers.q2} years</TableCell>
                <TableCell>{response.answers.q3}</TableCell>
                <TableCell>{new Date(response.submittedAt).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

