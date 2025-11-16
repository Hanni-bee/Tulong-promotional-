"use client";

import * as React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { DashboardIcon, UsersIcon, AnalyticsIcon, GlobeIcon, ClockIcon } from "./icons";

interface AppSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const menuItems = [
  {
    id: "overview",
    title: "Overview",
    icon: DashboardIcon,
  },
  {
    id: "users",
    title: "Users",
    icon: UsersIcon,
  },
  {
    id: "analytics",
    title: "Analytics",
    icon: AnalyticsIcon,
  },
  {
    id: "geographic",
    title: "Geographic",
    icon: GlobeIcon,
  },
  {
    id: "time",
    title: "Time Analysis",
    icon: ClockIcon,
  },
];

export function AppSidebar({ activeTab, onTabChange }: AppSidebarProps) {
  return (
    <Sidebar collapsible="icon" className="border-r border-gray-200/60">
      <SidebarHeader className="h-20 border-b border-red-800/30 bg-gradient-to-br from-[#D32F2F] to-[#B71C1C]">
        <div className="flex items-center gap-3 px-4 h-full group-data-[collapsible=icon]:justify-center">
          <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center border border-white/20 shadow-sm ring-1 ring-white/10 flex-shrink-0 p-1.5">
            <img 
              src="/logo.png" 
              alt="T.U.L.O.N.G Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          <div className="flex flex-col group-data-[collapsible=icon]:hidden min-w-0">
            <span className="text-white font-bold text-sm leading-tight">T.U.L.O.N.G</span>
            <span className="text-white/90 text-xs leading-tight font-medium">Admin Portal</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="custom-scrollbar">
        <SidebarGroup>
          <SidebarGroupLabel className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const isActive = activeTab === item.id;
                const Icon = item.icon;
                return (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      onClick={() => onTabChange(item.id)}
                      isActive={isActive}
                      className="data-[active=true]:bg-gradient-to-r data-[active=true]:from-[#D32F2F] data-[active=true]:to-[#B71C1C] data-[active=true]:text-white data-[active=true]:shadow-sm hover:bg-red-50/50"
                    >
                      <Icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-gray-200/60 p-3 bg-gray-50/30">
        <div className="text-xs text-center group-data-[collapsible=icon]:hidden">
          <div className="flex items-center justify-center gap-1.5 mb-1">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-sm" />
            <p className="font-medium text-gray-700">System Online</p>
          </div>
          <p className="text-gray-500">v1.0.0</p>
        </div>
        <div className="hidden group-data-[collapsible=icon]:flex justify-center">
          <div className="relative group">
            <div className="w-9 h-9 bg-gradient-to-br from-red-50 to-red-100 rounded-lg flex items-center justify-center border border-red-200/50 shadow-sm hover:shadow-md transition-all cursor-pointer hover:scale-110 p-1.5">
              <img 
                src="/logo.png" 
                alt="T.U.L.O.N.G Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-emerald-500 rounded-full border-2 border-white shadow-sm animate-pulse" />
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

