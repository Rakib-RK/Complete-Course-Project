import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import Image from "next/image"

const latestTemplates = [
  {
    id: "1",
    title: "Job Application Form",
    description: "Streamlined application for potential candidates",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/job-application-form-1-KQCIJtXkjzjl6qS0LwGFVKGkPVMOyi.png",
    author: {
      name: "Alex Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  },
  {
    id: "2",
    title: "Customer Feedback Survey",
    description: "Gather insights to improve your products and services",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-03-04%20103915-EQt2TanepIcjbWP21fPQMjWhXAprNd.png",
    author: {
      name: "Maria Garcia",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  },
  {
    id: "3",
    title: "Event Registration Form",
    description: "Easy sign-up process for your next big event",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-03-04%20104053-itpaPHWVRrRcXYQYC0sW42cTHifPPV.png",
    author: {
      name: "Sam Wilson",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  },
]

export default function LatestTemplates() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {latestTemplates.map((template) => (
        <Card key={template.id} className="flex flex-col">
          <CardHeader className="p-0">
            <div className="relative h-48 w-full">
              <Image
                src={template.image || "/placeholder.svg"}
                alt={template.title}
                fill
                className="object-cover rounded-t-lg"
              />
            </div>
          </CardHeader>
          <CardContent className="flex-grow p-4">
            <CardTitle className="text-xl mb-2">{template.title}</CardTitle>
            <p className="text-muted-foreground">{template.description}</p>
          </CardContent>
          <CardFooter className="flex justify-between items-center p-4">
            <div className="flex items-center space-x-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={template.author.avatar} alt={template.author.name} />
                <AvatarFallback>{template.author.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <span className="text-sm text-muted-foreground">{template.author.name}</span>
            </div>
            <Link href={`/templates/${template.id}`} className="text-sm font-medium text-primary hover:underline">
              Use Template
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

