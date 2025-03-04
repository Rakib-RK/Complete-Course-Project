"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { GripVertical, Plus, Trash } from "lucide-react"

type QuestionType = "text" | "textarea" | "number" | "checkbox"

interface Question {
  id: string
  type: QuestionType
  title: string
  description: string
  showInTable: boolean
}

const questionTypes = [
  { value: "text", label: "Single-line Text" },
  { value: "textarea", label: "Multiple-line Text" },
  { value: "number", label: "Number" },
  { value: "checkbox", label: "Checkbox" },
]

function SortableQuestion({
  question,
  onUpdate,
  onDelete,
}: {
  question: Question
  onUpdate: (id: string, updates: Partial<Question>) => void
  onDelete: (id: string) => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: question.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <Card ref={setNodeRef} style={style} className="mb-4">
      <CardHeader className="p-4 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <div {...attributes} {...listeners} className="cursor-grab">
            <GripVertical className="h-5 w-5 text-muted-foreground" />
          </div>
          <CardTitle className="text-base">
            {questionTypes.find((t) => t.value === question.type)?.label || "Question"}
          </CardTitle>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(question.id)}
          className="text-red-500 hover:text-red-700 hover:bg-red-50"
        >
          <Trash className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="p-4 pt-0 space-y-4">
        <div className="space-y-2">
          <Label htmlFor={`question-${question.id}-type`}>Question Type</Label>
          <Select
            value={question.type}
            onValueChange={(value) => onUpdate(question.id, { type: value as QuestionType })}
          >
            <SelectTrigger id={`question-${question.id}-type`}>
              <SelectValue placeholder="Select question type" />
            </SelectTrigger>
            <SelectContent>
              {questionTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor={`question-${question.id}-title`}>Question Title</Label>
          <Input
            id={`question-${question.id}-title`}
            value={question.title}
            onChange={(e) => onUpdate(question.id, { title: e.target.value })}
            placeholder="Enter question title"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor={`question-${question.id}-description`}>Description (optional)</Label>
          <Textarea
            id={`question-${question.id}-description`}
            value={question.description}
            onChange={(e) => onUpdate(question.id, { description: e.target.value })}
            placeholder="Enter additional instructions or description"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id={`question-${question.id}-show`}
            checked={question.showInTable}
            onCheckedChange={(checked) => onUpdate(question.id, { showInTable: checked })}
          />
          <Label htmlFor={`question-${question.id}-show`}>Show this question in results table</Label>
        </div>
      </CardContent>
    </Card>
  )
}

export function QuestionEditor() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [counts, setCounts] = useState({
    text: 0,
    textarea: 0,
    number: 0,
    checkbox: 0,
  })

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      setQuestions((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id)
        const newIndex = items.findIndex((item) => item.id === over.id)

        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }

  const addQuestion = (type: QuestionType) => {
    // Check if we've reached the limit for this question type
    if (counts[type] >= 4) {
      alert(`You can only add up to 4 ${type} questions.`)
      return
    }

    const newQuestion: Question = {
      id: `question-${Date.now()}`,
      type,
      title: "",
      description: "",
      showInTable: false,
    }

    setQuestions([...questions, newQuestion])
    setCounts({
      ...counts,
      [type]: counts[type] + 1,
    })
  }

  const updateQuestion = (id: string, updates: Partial<Question>) => {
    setQuestions(questions.map((q) => (q.id === id ? { ...q, ...updates } : q)))
  }

  const deleteQuestion = (id: string) => {
    const questionToDelete = questions.find((q) => q.id === id)
    if (questionToDelete) {
      setQuestions(questions.filter((q) => q.id !== id))
      setCounts({
        ...counts,
        [questionToDelete.type]: counts[questionToDelete.type] - 1,
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Button
          onClick={() => addQuestion("text")}
          variant="outline"
          className="h-auto py-4 flex flex-col items-center"
          disabled={counts.text >= 4}
        >
          <Plus className="h-5 w-5 mb-2" />
          <span>Single-line Text</span>
          <span className="text-xs text-muted-foreground mt-1">{counts.text}/4 used</span>
        </Button>

        <Button
          onClick={() => addQuestion("textarea")}
          variant="outline"
          className="h-auto py-4 flex flex-col items-center"
          disabled={counts.textarea >= 4}
        >
          <Plus className="h-5 w-5 mb-2" />
          <span>Multiple-line Text</span>
          <span className="text-xs text-muted-foreground mt-1">{counts.textarea}/4 used</span>
        </Button>

        <Button
          onClick={() => addQuestion("number")}
          variant="outline"
          className="h-auto py-4 flex flex-col items-center"
          disabled={counts.number >= 4}
        >
          <Plus className="h-5 w-5 mb-2" />
          <span>Number</span>
          <span className="text-xs text-muted-foreground mt-1">{counts.number}/4 used</span>
        </Button>

        <Button
          onClick={() => addQuestion("checkbox")}
          variant="outline"
          className="h-auto py-4 flex flex-col items-center"
          disabled={counts.checkbox >= 4}
        >
          <Plus className="h-5 w-5 mb-2" />
          <span>Checkbox</span>
          <span className="text-xs text-muted-foreground mt-1">{counts.checkbox}/4 used</span>
        </Button>
      </div>

      {questions.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed rounded-md">
          <p className="text-muted-foreground mb-4">No questions added yet</p>
          <p className="text-sm text-muted-foreground">Click on one of the buttons above to add a question</p>
        </div>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={questions.map((q) => q.id)} strategy={verticalListSortingStrategy}>
            {questions.map((question) => (
              <SortableQuestion
                key={question.id}
                question={question}
                onUpdate={updateQuestion}
                onDelete={deleteQuestion}
              />
            ))}
          </SortableContext>
        </DndContext>
      )}
    </div>
  )
}

