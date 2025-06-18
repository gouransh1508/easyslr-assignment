import {
  Circle,
  ListCheck,
  ListTodo,
  UserPen,
} from 'lucide-react';

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
      title: 'Tasks',
      subItems: [
        {
          title: 'Tasks List',
          url: '/dashboard/tasks',
          icon: ListTodo,
        },
        {
          title: 'Create Task',
          url: '/dashboard/tasks/create',
          icon: ListCheck,
        },
      ],
    },
    {
      title: 'Profile',
      subItems: [
        {
          title: 'Edit Profile',
          url: '/dashboard/profile/edit',
          icon: UserPen,
        },
      ],
    },
  ];

  return (
    <Sidebar>
      <SidebarHeader />
      <SidebarContent>
        {items.map((item) => {
          return (
            <SidebarGroup key={item.title}>
              <SidebarGroupLabel className='text-xl'>
                {item.title}
              </SidebarGroupLabel>
              <SidebarGroupContent className='mt-1'>
                <SidebarMenu>
                  {item.subItems.map((subItem) => (
                    <SidebarMenuItem key={subItem.title}>
                      <SidebarMenuButton asChild>
                        <a href={subItem.url}>
                          <subItem.icon />
                          <span className='text-xs font-bold'>
                            {subItem.title}
                          </span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          );
        })}
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
