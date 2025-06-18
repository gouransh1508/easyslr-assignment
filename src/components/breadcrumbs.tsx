'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight } from 'lucide-react';

export const Breadcrumbs = () => {
  const pathname = usePathname();

  const segments = pathname
    ?.split('/')
    ?.filter((seg) => seg)
    ?.map((seg, idx, arr) => {
      const href = '/' + arr.slice(0, idx + 1).join('/');
      return {
        name: decodeURIComponent(seg).replace(/-/g, ' '),
        href,
        isLast: idx === arr.length - 1,
      };
    });

  return (
    <nav className='mb-4 flex items-center space-x-1 text-sm text-muted-foreground'>
      <Link href='/' className='hover:underline'>
        Home
      </Link>
      {segments?.map((crumb, index) => (
        <span
          key={index}
          className='flex items-center space-x-1'
        >
          <ChevronRight className='h-4 w-4' />
          {crumb?.isLast || crumb?.name === 'edit' ? (
            <span className='font-medium capitalize text-foreground'>
              {crumb?.name}
            </span>
          ) : (
            <Link
              href={crumb?.href}
              className='capitalize hover:underline'
            >
              {crumb?.name}
            </Link>
          )}
        </span>
      ))}
    </nav>
  );
};
