'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, type ReactNode } from 'react';
import { AppNavbar } from '~/components/appNavbar';
import { AppSidebar } from '~/components/appSidebar';
import { Breadcrumbs } from '~/components/breadcrumbs';
import { FullScreenLoader } from '~/components/loader';
import { SidebarProvider } from '~/components/ui/sidebar';

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    }
  }, [status, router]);

  if (status === 'unauthenticated') {
    return null;
  }

  if (status === 'loading') {
    return <FullScreenLoader></FullScreenLoader>;
  }

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
