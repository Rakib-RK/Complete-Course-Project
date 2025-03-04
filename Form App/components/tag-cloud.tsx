import { Badge } from "@/components/ui/badge"
import Link from "next/link"

const tags = [
  { name: "Feedback", count: 156 },
  { name: "Customer Service", count: 132 },
  { name: "Human Resources", count: 98 },
  { name: "Event Planning", count: 87 },
  { name: "Education", count: 76 },
  { name: "Marketing", count: 65 },
  { name: "Product Development", count: 54 },
  { name: "IT Support", count: 43 },
  { name: "Finance", count: 32 },
  { name: "Healthcare", count: 28 },
  { name: "Non-profit", count: 24 },
  { name: "Real Estate", count: 21 },
]

export default function TagCloud() {
  const maxCount = Math.max(...tags.map((tag) => tag.count))
  const minCount = Math.min(...tags.map((tag) => tag.count))

  const getFontSize = (count: number) => {
    const minSize = 0.8
    const maxSize = 1.5
    return minSize + ((count - minCount) / (maxCount - minCount)) * (maxSize - minSize)
  }

  return (
    <div className="flex flex-wrap gap-3 py-4">
      {tags.map((tag) => (
        <Link key={tag.name} href={`/search?tag=${encodeURIComponent(tag.name)}`}>
          <Badge
            variant="outline"
            className="cursor-pointer hover:bg-secondary transition-colors"
            style={{ fontSize: `${getFontSize(tag.count)}rem` }}
          >
            {tag.name} ({tag.count})
          </Badge>
        </Link>
      ))}
    </div>
  )
}

