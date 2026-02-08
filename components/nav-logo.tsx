import { GalleryHorizontal } from 'lucide-react'
import React from 'react'
import { SidebarMenuButton } from './ui/sidebar'

export const NavLogo = () => {
    return (
        <SidebarMenuButton
            size="lg"
            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground cursor-pointer "
        >
            <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                <GalleryHorizontal className="size-4" />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
                <span className=" font-semibold font-mono uppercase text-3xl">Cognito</span>
                {/* <span className="truncate text-xs">Beta</span> */}
            </div>
        </SidebarMenuButton>
    )
}