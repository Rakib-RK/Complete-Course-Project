import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getLatestTemplates } from "@/lib/data"

export default async function TemplateGallery() {
  const templates = await getLatestTemplates()

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {templates.map((template) => (
        <Card key={template.id} className="overflow-hidden">
          <CardHeader className="p-0">
            {template.imageUrl ? (
              <div className="relative h-48 w-full">
                <Image
                  src={template.imageUrl || "/placeholder.svg"}
                  alt={template.title}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="h-48 bg-muted flex items-center justify-center">
                <span className="text-muted-foreground">No image</span>
              </div>
            )}
          </CardHeader>
          <CardContent className="p-6">
            <CardTitle className="mb-2">
              <Link href={`/templates/${template.id}`} className="hover:underline">
                {template.title}
              </Link>
            </CardTitle>
            <p className="text-muted-foreground line-clamp-2">{template.description}</p>
          </CardContent>
          <CardFooter className="p-6 pt-0 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={template.author.image || ""} alt={template.author.name} />
                <AvatarFallback>{template.author.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <span className="text-sm text-muted-foreground">{template.author.name}</span>
            </div>
            <span className="text-sm text-muted-foreground">{new Date(template.createdAt).toLocaleDateString()}</span>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

