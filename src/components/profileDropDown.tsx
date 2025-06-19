'use client';

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '~/components/ui/dropdown-menu';
import { Button } from '~/components/ui/button';
import { LogOut, User, User2 } from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '~/components/ui/avatar';

interface ProfileDropdownProps {
  iconOnly?: boolean;
}

export function ProfileDropdown({
  iconOnly = false,
}: ProfileDropdownProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='outline'
          className='flex items-center gap-2'
        >
          {user?.profilePicture ? (
            <Avatar className='h-6 w-6'>
              <AvatarImage
                src={user.profilePicture}
                alt={user.name ?? 'Profile'}
              />
              <AvatarFallback>
                {user.name?.[0] ?? (
                  <User2 className='h-4 w-4' />
                )}
              </AvatarFallback>
            </Avatar>
          ) : (
            <User2 className='h-5 w-5' />
          )}

          {!iconOnly && (
            <span className='text-sm font-medium'>
              {user?.name ?? 'User'}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align='end' className='w-44'>
        <DropdownMenuItem
          onClick={() =>
            router.push('/dashboard/profile/edit')
          }
        >
          <User className='mr-2 h-4 w-4' />
          <span className='cursor-pointer text-xs font-bold'>
            Profile
          </span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={async () => {
            await signOut();
            await router.push('/');
          }}
        >
          <LogOut className='mr-2 h-4 w-4' />
          <span className='cursor-pointer text-xs font-bold'>
            Logout
          </span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
