import { ModeToggle } from './modeToggle';
import { SidebarTrigger } from './ui/sidebar';
import { ProfileDropdown } from './profileDropDown';

export function AppNavbar() {
  return (
    <header className='flex items-center justify-between border-b px-4 py-4'>
      <div className='item-center flex gap-2'>
        <SidebarTrigger className='cursor-pointer' />
        <div className='flex items-center'>
          <p className='text-center text-xl font-bold !leading-none'>
            EasySLR Assignment
          </p>
        </div>
      </div>
      <div className='flex items-center gap-4'>
        <ModeToggle />
        <ProfileDropdown></ProfileDropdown>
      </div>
    </header>
  );
}
