import * as React from "react"
import {CheckCheckIcon, ChevronDown } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Image from "next/image"
import { MODELS } from "@/lib/constant"
import { setModelCookie } from "@/lib/models"

// const model = await getModelCookie()

export function ModelSwitcher() {

  const [activeModel, setActiveModel] = React.useState<{id: string, name: string, logo: string}>(MODELS[0])

  
  const changeModel = (model:{id: string, name: string, logo: string}) => {
    setModelCookie(model.id)
    setActiveModel(model)

  }
  


  if (!activeModel) {
    return null
  }

  return (
        <DropdownMenu>
          <DropdownMenuTrigger className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground cursor-pointer p-0.5 rounded-md " asChild> 
            <div className="flex gap-2 items-center  ">
              <div className="flex border aspect-square size-8 items-center justify-center rounded-lg">
                <Image src={activeModel.logo} width={32} height={32} className="size-4" alt={activeModel.name} />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{activeModel.name}</span>
              </div>
              <ChevronDown />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            align="start"
            side={'left'}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-muted-foreground text-xs">
              Models
            </DropdownMenuLabel>
            {MODELS.map((team,) => (
              <DropdownMenuItem
                key={team.name}
                onClick={()=> changeModel(team)}
                className={"gap-2 p-2"}
              >
                <div className="flex size-6 items-center justify-center rounded-md border">
                <Image src={team.logo} width={32} height={32} className="size-3.5" alt={team.name} />
                </div>
                {team.name}
                
                {activeModel.name === team.name && (
                  <CheckCheckIcon className="ml-auto size-4" />
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
  )
}
