/* eslint-disable import/no-unresolved */
/* eslint-disable react/prop-types */
import { GeistSans } from 'geist/font/sans';
import { type Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import { type AppProps, type AppType } from 'next/app';

import { api } from '~/utils/api';

import '~/styles/globals.css';
import { Toaster } from 'sonner';
import { ThemeProvider } from 'next-themes';
import DashboardLayout from './dashboard/_layouts/dashboardLayout';

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
  router,
}: AppProps) => {
  const isDashboard =
    router.pathname.startsWith('/dashboard');

  const content = isDashboard ? (
    <DashboardLayout>
      <Component {...pageProps} />
    </DashboardLayout>
  ) : (
    <Component {...pageProps} />
  );

  return (
    <SessionProvider session={session as Session}>
      <div className={`${GeistSans.className} antialiased`}>
        <ThemeProvider
          attribute='class'
          defaultTheme='system'
          disableTransitionOnChange
          enableSystem
        >
          {content}
          <Toaster></Toaster>
        </ThemeProvider>
      </div>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
