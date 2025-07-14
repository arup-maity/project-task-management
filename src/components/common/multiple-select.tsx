"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

type Option = {
   label: string
   value: string | number
}

interface MultiSelectProps {
   options: Option[]
   selected: (string | number)[]
   onChange: (selected: (string | number)[]) => void
   placeholder?: string
   className?: string
}

export function MultiSelect({ options= [], selected, onChange, placeholder = "Select items...", className }: MultiSelectProps) {
   const [open, setOpen] = React.useState(false)

   const handleSelect = (value: string | number) => {
      if (selected.includes(value)) {
         onChange(selected.filter((item) => item !== value))
      } else {
         onChange([...selected, value])
      }
   }

   // const handleRemove = (value: string | number) => {
   //    onChange(selected.filter((item) => item !== value))
   // }

   const selectedOptions = options.filter((option) => selected.includes(option.value))

   return (
      <Popover open={open} onOpenChange={setOpen}>
         <PopoverTrigger asChild>
            <Button variant="outline" role="combobox" aria-expanded={open} className={cn("min-w-80 h-10 justify-between", className)}>
               <div className="flex flex-wrap gap-1">
                  {selectedOptions.length === 0 ? (
                     <span className="text-muted-foreground">{placeholder}</span>
                  ) : selectedOptions.length === 1 ? (
                     <span>{selectedOptions[0].label}</span>
                  ) : (
                     <>
                        <Badge variant="secondary" className="text-xs">
                           {selectedOptions[0].label}
                        </Badge>
                        {selectedOptions.length > 1 && (
                           <Badge variant="secondary" className="text-xs">
                              +{selectedOptions.length - 1} more
                           </Badge>
                        )}
                     </>
                  )}
               </div>
               <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
         </PopoverTrigger>
         <PopoverContent className="min-w-80 w-full p-0" align="start">
            <Command>
               <CommandInput placeholder="Search..." />
               <CommandList>
                  <CommandEmpty>No items found.</CommandEmpty>
                  <CommandGroup>
                     {options.map((option) => (
                        <CommandItem key={option.value} value={option.label} onSelect={() => handleSelect(option.value)}>
                           <Check
                              className={cn("mr-2 h-4 w-4", selected.includes(option.value) ? "opacity-100" : "opacity-0")}
                           />
                           {option.label}
                        </CommandItem>
                     ))}
                  </CommandGroup>
               </CommandList>
            </Command>
         </PopoverContent>
      </Popover>
   )
}
