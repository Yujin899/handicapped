"use client"

import * as React from "react"
import { Check, ChevronsUpDown, Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { getSpecialties, type Specialty } from "@/lib/specialties"

interface SpecialtyComboboxProps {
  value: string
  onChange: (value: string) => void
  placeholder: string
  locale: string
}

export function SpecialtyCombobox({ value, onChange, placeholder, locale }: SpecialtyComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [specialties, setSpecialties] = React.useState<Specialty[]>([])

  React.useEffect(() => {
    getSpecialties().then(setSpecialties)
  }, [])

  const selectedOption = specialties.find((s) => s.id === value)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="h-11 w-full justify-between border-0 bg-transparent ps-10 text-sm font-normal shadow-none hover:bg-transparent focus-visible:ring-0"
        >
          <div className="flex items-center gap-2 overflow-hidden">
            <Search className="absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <span className="truncate">
              {selectedOption 
                ? (locale === 'ar' ? selectedOption.nameAr : selectedOption.name)
                : placeholder}
            </span>
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0" align="start">
        <Command>
          <CommandInput placeholder={placeholder} />
          <CommandList>
            <CommandEmpty>{locale === 'ar' ? 'لم يتم العثور على تخصص.' : 'No specialty found.'}</CommandEmpty>
            <CommandGroup>
              {specialties.map((specialty) => (
                <CommandItem
                  key={specialty.id}
                  value={specialty.id}
                  onSelect={(currentValue) => {
                    onChange(currentValue === value ? "" : currentValue)
                    setOpen(false)
                  }}
                  className="flex items-center justify-between"
                >
                  <span>{locale === 'ar' ? specialty.nameAr : specialty.name}</span>
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      value === specialty.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
