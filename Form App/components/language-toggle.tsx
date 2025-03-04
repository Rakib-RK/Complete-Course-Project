"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Globe } from "lucide-react"

type Language = {
  code: string
  name: string
}

const languages: Language[] = [
  { code: "en", name: "English" },
  { code: "es", name: "Spanish" },
]

export function LanguageToggle() {
  const [currentLanguage, setCurrentLanguage] = useState<string>("en")

  useEffect(() => {
    // In a real app, this would get the language from localStorage or cookies
    const savedLanguage = localStorage.getItem("language") || "en"
    setCurrentLanguage(savedLanguage)
  }, [])

  const changeLanguage = (code: string) => {
    setCurrentLanguage(code)
    localStorage.setItem("language", code)
    // In a real app, this would trigger a language change in the i18n system
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Globe className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Change language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => changeLanguage(language.code)}
            className={currentLanguage === language.code ? "bg-muted" : ""}
          >
            {language.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

