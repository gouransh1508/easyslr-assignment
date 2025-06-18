import { User2 } from 'lucide-react';
import { ModeToggle } from './modeToggle';
import { SidebarTrigger } from './ui/sidebar';
import { Button } from './ui/button';
import { ProfileDropdown } from './profileDropDown';

export function AppNavbar() {
  return (
    <header className='flex items-center justify-between border-b px-6 py-4'>
      <div className='item-center flex gap-2'>
        <SidebarTrigger className='cursor-pointer' />
        <h1 className='text-xl font-bold'>
          EasySLR Assignment
        </h1>
      </div>
      <div className='flex items-center gap-4'>
        <ModeToggle />
        <ProfileDropdown></ProfileDropdown>
        {/* <Button
          variant='outline'
          size='icon'
          className='cursor-pointer'
        >
          <User2></User2>
        </Button> */}
      </div>
    </header>
  );
}
