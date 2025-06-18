/* eslint-disable import/no-unresolved */
/* eslint-disable react/prop-types */
import { GeistSans } from 'geist/font/sans';
import { type Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import { type AppType } from 'next/app';

import { api } from '~/utils/api';

import '~/styles/globals.css';
import { Toaster } from 'sonner';

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <div className={GeistSans.className}>
        <Component {...pageProps} />
        <Toaster></Toaster>
      </div>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
