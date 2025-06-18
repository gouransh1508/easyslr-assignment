import { Circle } from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
} from '~/components/ui/sidebar';

export function AppSidebar() {
  const items = [
    {
      title: 'Tasks LIst',
      url: '/dashboard/tasks',
      icon: Circle,
    },
    {
      title: 'Create Task',
      url: '/dashboard/tasks/create',
      icon: Circle,
    },
  ];
  return (
    <Sidebar>
      <SidebarHeader />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className='text-xl'>
            Tasks
          </SidebarGroupLabel>
          <SidebarGroupContent className='mt-1'>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span className='text-xs font-bold'>
                        {item.title}
                      </span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
