"use client"
import * as React from "react"
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Plus,
  Search,
  Settings2,
  SquareTerminal,
} from "lucide-react"
import { NavMain } from "@/components/nav-main"
import { NavChats } from "@/components/nav-chats"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import {NavLogo} from "./nav-logo"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  }
}

const chats =  [
    {
      name: "Design Engineering ",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing ",
      url: "#",
      icon: Frame,
    },
    {
      name: "Travel Engineering",
      url: "#",
      icon: Frame,
    },
  ]

const navMain = [
    {
      title: "Search",
      url: "#",
      icon: Search,
    },
    {
      title: "New Chat",
      url: "#",
      icon: Plus,

    }
  ]
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <NavLogo />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
        <NavChats projects={chats} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}