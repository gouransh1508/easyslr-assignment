import { type ReactNode } from 'react';
import { AppNavbar } from '~/components/appNavbar';
import { AppSidebar } from '~/components/appSidebar';
import { Breadcrumbs } from '~/components/breadcrumbs';
import { SidebarProvider } from '~/components/ui/sidebar';

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className='flex h-screen'>
      <SidebarProvider>
        <div className='flex min-h-screen w-full'>
          <AppSidebar />
          <div className='flex flex-1 flex-col border'>
            <AppNavbar />
            <main className='flex-1 bg-muted p-4'>
              <Breadcrumbs />
              {children}
            </main>
          </div>
        </div>
      </SidebarProvider>
    </div>
  );
}
