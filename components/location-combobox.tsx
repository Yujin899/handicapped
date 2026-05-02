"use client"

import * as React from "react"
import { Check, ChevronsUpDown, MapPin } from "lucide-react"
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
import { egyptLocations } from "@/lib/egypt-locations"

interface LocationComboboxProps {
  value: string
  onChange: (value: string) => void
  placeholder: string
  locale: string
}

export function LocationCombobox({ value, onChange, placeholder, locale }: LocationComboboxProps) {
  const [open, setOpen] = React.useState(false)

  const allOptions = React.useMemo(() => {
    const options: { id: string; label: string; labelAr: string; group: string; groupAr: string }[] = []
    egyptLocations.forEach((gov) => {
      // Add the governorate itself as an option
      options.push({
        id: gov.id,
        label: gov.name,
        labelAr: gov.nameAr,
        group: gov.name,
        groupAr: gov.nameAr
      })
      // Add its cities
      gov.cities.forEach((city) => {
        options.push({
          id: city.id,
          label: city.name,
          labelAr: city.nameAr,
          group: gov.name,
          groupAr: gov.nameAr
        })
      })
    })
    return options
  }, [])

  const selectedOption = allOptions.find((option) => option.id === value)

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
            <MapPin className="absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <span className="truncate">
              {selectedOption 
                ? (locale === 'ar' ? selectedOption.labelAr : selectedOption.label)
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
            <CommandEmpty>{locale === 'ar' ? 'لم يتم العثور على موقع.' : 'No location found.'}</CommandEmpty>
            {egyptLocations.map((gov) => (
              <CommandGroup key={gov.id} heading={locale === 'ar' ? gov.nameAr : gov.name}>
                <CommandItem
                  value={gov.id}
                  onSelect={(currentValue) => {
                    onChange(currentValue === value ? "" : currentValue)
                    setOpen(false)
                  }}
                  className="flex items-center justify-between"
                >
                  <span className="font-semibold">{locale === 'ar' ? gov.nameAr : gov.name}</span>
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      value === gov.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
                {gov.cities.map((city) => (
                  <CommandItem
                    key={city.id}
                    value={city.id}
                    onSelect={(currentValue) => {
                      onChange(currentValue === value ? "" : currentValue)
                      setOpen(false)
                    }}
                    className="flex items-center justify-between ps-6"
                  >
                    <span>{locale === 'ar' ? city.nameAr : city.name}</span>
                    <Check
                      className={cn(
                        "ml-auto h-4 w-4",
                        value === city.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
