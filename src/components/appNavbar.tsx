import { ModeToggle } from './modeToggle';
import { SidebarTrigger } from './ui/sidebar';

export function AppNavbar() {
  return (
    <header className='flex items-center justify-between border-b px-6 py-4'>
      <div className='item-center flex gap-2'>
        <SidebarTrigger className='cursor-pointer' />
        <h1 className='text-xl font-bold'>
          EasySLR Assignment
        </h1>
      </div>
      <ModeToggle />
    </header>
  );
}
