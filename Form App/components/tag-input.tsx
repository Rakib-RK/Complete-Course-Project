"use client"

import type React from "react"

import { useState, useRef, type KeyboardEvent } from "react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"

interface TagInputProps {
  tags: string[]
  setTags: (tags: string[]) => void
}

// This would be fetched from the database in a real application
const suggestedTags = [
  "Education",
  "Business",
  "Feedback",
  "Survey",
  "Quiz",
  "HR",
  "Events",
  "Customer",
  "Product",
  "Health",
  "Research",
  "Marketing",
]

export function TagInput({ tags, setTags }: TagInputProps) {
  const [inputValue, setInputValue] = useState("")
  const [suggestions, setSuggestions] = useState<string[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInputValue(value)

    if (value.trim()) {
      const filtered = suggestedTags.filter(
        (tag) => tag.toLowerCase().startsWith(value.toLowerCase()) && !tags.includes(tag),
      )
      setSuggestions(filtered)
    } else {
      setSuggestions([])
    }
  }

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim()
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag])
      setInputValue("")
      setSuggestions([])
      inputRef.current?.focus()
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue) {
      e.preventDefault()
      addTag(inputValue)
    } else if (e.key === "," && inputValue) {
      e.preventDefault()
      addTag(inputValue.replace(",", ""))
    } else if (e.key === "Backspace" && !inputValue && tags.length > 0) {
      removeTag(tags[tags.length - 1])
    }
  }

  return (
    <div className="relative">
      <div className="flex flex-wrap gap-2 p-2 border rounded-md min-h-10">
        {tags.map((tag, index) => (
          <Badge key={index} variant="secondary" className="flex items-center gap-1">
            {tag}
            <button type="button" onClick={() => removeTag(tag)} className="rounded-full hover:bg-muted p-0.5">
              <X className="h-3 w-3" />
              <span className="sr-only">Remove {tag}</span>
            </button>
          </Badge>
        ))}
        <Input
          ref={inputRef}
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className="flex-1 min-w-[120px] border-0 p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
          placeholder={tags.length === 0 ? "Add tags..." : ""}
        />
      </div>

      {suggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-background border rounded-md shadow-lg max-h-60 overflow-auto">
          {suggestions.map((suggestion, index) => (
            <div key={index} className="p-2 hover:bg-muted cursor-pointer" onClick={() => addTag(suggestion)}>
              {suggestion}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

