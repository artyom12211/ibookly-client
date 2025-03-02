"use client"

import * as React from "react"
import { Check } from "lucide-react"

import { cn } from "@/lib/utils"
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

export function BaseCombobox({ 
  trigger,
  children,
  ...props }: {
  trigger?: React.ReactNode,
  children: React.ReactNode,
} & {
     options: [
      {
        label: string,
        value: string
      }
     ]
    "search_placeholder": string,
     not_found: string,
     onSelect: (value: string) => void,
     value: string,
     setOpen: (value: boolean) => void,
     open: boolean
  }) {

  return (
    <Popover open={props.open} onOpenChange={props.setOpen}>
      <PopoverTrigger asChild>
        {children}
      </PopoverTrigger>

      <PopoverContent className="w-[200px] p-0" side="bottom" align="center">
        <Command>
          <CommandInput placeholder={props["search_placeholder"]} />
          <CommandList>
            <CommandEmpty>
              {props.not_found}
            </CommandEmpty>
            <CommandGroup>
              {props.options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={props.onSelect}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      props.value === option.value ? "opacity-100" : "opacity-0"
                    )}
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
