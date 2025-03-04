"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Shield, ShieldOff, Lock, Unlock, Trash } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

// This would be fetched from the database in a real application
const initialUsers = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    role: "admin",
    status: "active",
    createdAt: "2023-01-15",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    role: "user",
    status: "active",
    createdAt: "2023-02-20",
  },
  {
    id: "3",
    name: "Robert Johnson",
    email: "robert@example.com",
    role: "user",
    status: "blocked",
    createdAt: "2023-03-10",
  },
  {
    id: "4",
    name: "Emily Davis",
    email: "emily@example.com",
    role: "admin",
    status: "active",
    createdAt: "2023-04-05",
  },
  {
    id: "5",
    name: "Michael Wilson",
    email: "michael@example.com",
    role: "user",
    status: "active",
    createdAt: "2023-05-12",
  },
]

export default function AdminPage() {
  const [users, setUsers] = useState(initialUsers)
  const [sortField, setSortField] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [confirmAction, setConfirmAction] = useState<{
    type: "delete" | "block" | "unblock" | "makeAdmin" | "removeAdmin"
    userId: string
    open: boolean
  } | null>(null)

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const sortedUsers = [...users].sort((a, b) => {
    if (!sortField) return 0

    const fieldA = a[sortField as keyof typeof a]
    const fieldB = b[sortField as keyof typeof b]

    if (typeof fieldA === "string" && typeof fieldB === "string") {
      return sortDirection === "asc" ? fieldA.localeCompare(fieldB) : fieldB.localeCompare(fieldA)
    }

    return 0
  })

  const handleAction = (action: "delete" | "block" | "unblock" | "makeAdmin" | "removeAdmin", userId: string) => {
    setConfirmAction({
      type: action,
      userId,
      open: true,
    })
  }

  const confirmActionHandler = () => {
    if (!confirmAction) return

    const { type, userId } = confirmAction

    switch (type) {
      case "delete":
        setUsers(users.filter((user) => user.id !== userId))
        break
      case "block":
        setUsers(users.map((user) => (user.id === userId ? { ...user, status: "blocked" } : user)))
        break
      case "unblock":
        setUsers(users.map((user) => (user.id === userId ? { ...user, status: "active" } : user)))
        break
      case "makeAdmin":
        setUsers(users.map((user) => (user.id === userId ? { ...user, role: "admin" } : user)))
        break
      case "removeAdmin":
        setUsers(users.map((user) => (user.id === userId ? { ...user, role: "user" } : user)))
        break
    }

    setConfirmAction(null)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">User Management</h1>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="cursor-pointer" onClick={() => handleSort("name")}>
              Name {sortField === "name" && (sortDirection === "asc" ? "↑" : "↓")}
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort("email")}>
              Email {sortField === "email" && (sortDirection === "asc" ? "↑" : "↓")}
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort("role")}>
              Role {sortField === "role" && (sortDirection === "asc" ? "↑" : "↓")}
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort("status")}>
              Status {sortField === "status" && (sortDirection === "asc" ? "↑" : "↓")}
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort("createdAt")}>
              Created {sortField === "createdAt" && (sortDirection === "asc" ? "↑" : "↓")}
            </TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedUsers.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                {user.role === "admin" ? (
                  <Badge className="bg-purple-100 text-purple-800 border-purple-200">Admin</Badge>
                ) : (
                  <Badge variant="outline">User</Badge>
                )}
              </TableCell>
              <TableCell>
                {user.status === "active" ? (
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    Active
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                    Blocked
                  </Badge>
                )}
              </TableCell>
              <TableCell>{user.createdAt}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {user.role === "admin" ? (
                      <DropdownMenuItem onClick={() => handleAction("removeAdmin", user.id)}>
                        <ShieldOff className="mr-2 h-4 w-4" /> Remove Admin
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem onClick={() => handleAction("makeAdmin", user.id)}>
                        <Shield className="mr-2 h-4 w-4" /> Make Admin
                      </DropdownMenuItem>
                    )}

                    {user.status === "active" ? (
                      <DropdownMenuItem onClick={() => handleAction("block", user.id)}>
                        <Lock className="mr-2 h-4 w-4" /> Block User
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem onClick={() => handleAction("unblock", user.id)}>
                        <Unlock className="mr-2 h-4 w-4" /> Unblock User
                      </DropdownMenuItem>
                    )}

                    <DropdownMenuItem
                      onClick={() => handleAction("delete", user.id)}
                      className="text-red-600 focus:text-red-600"
                    >
                      <Trash className="mr-2 h-4 w-4" /> Delete User
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog
        open={confirmAction?.open || false}
        onOpenChange={(open) => {
          if (!open) setConfirmAction(null)
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {confirmAction?.type === "delete" && "Delete User"}
              {confirmAction?.type === "block" && "Block User"}
              {confirmAction?.type === "unblock" && "Unblock User"}
              {confirmAction?.type === "makeAdmin" && "Make User Admin"}
              {confirmAction?.type === "removeAdmin" && "Remove Admin Rights"}
            </DialogTitle>
            <DialogDescription>
              {confirmAction?.type === "delete" &&
                "Are you sure you want to delete this user? This action cannot be undone."}
              {confirmAction?.type === "block" &&
                "Are you sure you want to block this user? They will not be able to access the system."}
              {confirmAction?.type === "unblock" &&
                "Are you sure you want to unblock this user? They will regain access to the system."}
              {confirmAction?.type === "makeAdmin" &&
                "Are you sure you want to make this user an admin? They will have full access to the system."}
              {confirmAction?.type === "removeAdmin" &&
                "Are you sure you want to remove admin rights from this user? They will lose administrative privileges."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmAction(null)}>
              Cancel
            </Button>
            <Button
              variant={confirmAction?.type === "delete" ? "destructive" : "default"}
              onClick={confirmActionHandler}
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

