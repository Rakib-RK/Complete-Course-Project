"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { X } from "lucide-react"

interface User {
  id: string
  name: string
  email: string
}

interface AccessSettingsProps {
  isPublic: boolean
  setIsPublic: (value: boolean) => void
}

export function AccessSettings({ isPublic, setIsPublic }: AccessSettingsProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedUsers, setSelectedUsers] = useState<User[]>([])
  const [sortBy, setSortBy] = useState<"name" | "email">("name")

  // This would be fetched from the database in a real application
  const suggestedUsers: User[] = [
    { id: "1", name: "John Doe", email: "john@example.com" },
    { id: "2", name: "Jane Smith", email: "jane@example.com" },
    { id: "3", name: "Robert Johnson", email: "robert@example.com" },
    { id: "4", name: "Emily Davis", email: "emily@example.com" },
    { id: "5", name: "Michael Wilson", email: "michael@example.com" },
  ]

  const filteredUsers = suggestedUsers.filter(
    (user) =>
      !selectedUsers.some((selected) => selected.id === user.id) &&
      (user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  const addUser = (user: User) => {
    setSelectedUsers([...selectedUsers, user])
    setSearchQuery("")
  }

  const removeUser = (userId: string) => {
    setSelectedUsers(selectedUsers.filter((user) => user.id !== userId))
  }

  const sortedSelectedUsers = [...selectedUsers].sort((a, b) => {
    if (sortBy === "name") {
      return a.name.localeCompare(b.name)
    } else {
      return a.email.localeCompare(b.email)
    }
  })

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Switch id="public-access" checked={isPublic} onCheckedChange={setIsPublic} />
          <Label htmlFor="public-access">Public access (any authenticated user can fill this form)</Label>
        </div>

        {!isPublic && (
          <div className="space-y-4 pt-4">
            <Label htmlFor="user-search">Add specific users who can access this template</Label>
            <div className="relative">
              <Input
                id="user-search"
                placeholder="Search by name or email"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && filteredUsers.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-background border rounded-md shadow-lg max-h-60 overflow-auto">
                  {filteredUsers.map((user) => (
                    <div key={user.id} className="p-2 hover:bg-muted cursor-pointer" onClick={() => addUser(user)}>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-muted-foreground">{user.email}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {selectedUsers.length > 0 && (
              <div className="space-y-4 pt-4">
                <div className="flex justify-between items-center">
                  <Label>Selected Users ({selectedUsers.length})</Label>
                  <RadioGroup
                    value={sortBy}
                    onValueChange={(value) => setSortBy(value as "name" | "email")}
                    className="flex space-x-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="name" id="sort-name" />
                      <Label htmlFor="sort-name" className="cursor-pointer">
                        Sort by name
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="email" id="sort-email" />
                      <Label htmlFor="sort-email" className="cursor-pointer">
                        Sort by email
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  {sortedSelectedUsers.map((user) => (
                    <div key={user.id} className="flex justify-between items-center p-2 border rounded-md">
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeUser(user.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

