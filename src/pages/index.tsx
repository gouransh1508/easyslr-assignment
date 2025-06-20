import { signIn, useSession } from 'next-auth/react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { api } from '~/utils/api';

export default function Home() {
  const hello = api.post.hello.useQuery({
    text: 'from Gouransh',
  });

  return (
    <>
      <Head>
        <title>EasySLR Assignment | Gouransh</title>
        <meta
          name='description'
          content='>EasySLR Assignemt | Gouransh'
        />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <main className='flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]'>
        <div className='container flex flex-col items-center justify-center gap-8 px-4 py-16'>
          <p className='max-w-2xl text-center text-2xl font-extrabold !leading-[55px] text-white sm:text-5xl'>
            EasySLR <br />
            <span className='text-[hsl(280,100%,70%)]'>
              Task Submission By <br />
            </span>{' '}
            Gouransh Sachdeva
          </p>
          <div className='flex flex-col items-center gap-2'>
            <p className='text-2xl text-white'>
              {hello.data
                ? hello.data.greeting
                : 'Loading tRPC query...'}
            </p>
          </div>
          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8'>
            <Link
              className='flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20'
              href='https://github.com/gouransh1508/easyslr-assignment'
              target='_blank'
            >
              <h3 className='text-2xl font-bold'>
                Github →
              </h3>
              <div className='text-lg'>
                CodeBase - Source code for the task
                implementation.
              </div>
            </Link>
            <Link
              className='flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20'
              href='https://github.com/gouransh1508/easyslr-assignment#easyslr-assignment-submission-by-gouransh-sachdeva'
              target='_blank'
            >
              <h3 className='text-2xl font-bold'>
                Documentation →
              </h3>
              <div className='text-lg'>
                Readme - Everything you need to know about
                the task implementation.
              </div>
            </Link>
          </div>
          <AuthShowcase />
        </div>
      </main>
    </>
  );
}

function AuthShowcase() {
  const { data: sessionData } = useSession();
  const router = useRouter();
  return (
    <div className='flex flex-col items-center justify-center gap-4'>
      <p className='text-center text-2xl text-white'>
        {sessionData && (
          <span>Logged in as {sessionData.user?.name}</span>
        )}
      </p>
      {sessionData ? (
        <button
          className='rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20'
          onClick={() => {
            router.push('/dashboard/tasks');
          }}
        >
          Dashboard
        </button>
      ) : (
        <div className='flex flex-col gap-4 md:flex-row'>
          <button
            className='rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20'
            onClick={() => void signIn()}
          >
            Sign In
          </button>
          <button
            className='rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20'
            onClick={() => {
              router.push('/auth/signup');
            }}
          >
            Sign Up
          </button>
        </div>
      )}
    </div>
  );
}
