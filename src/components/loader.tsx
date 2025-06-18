import { Loader2 } from 'lucide-react';

export const FullScreenLoader = () => {
  return (
    <div className='flex min-h-[60vh] items-center justify-center'>
      <Loader2 className='h-8 w-8 animate-spin text-muted-foreground' />
    </div>
  );
};

export const Loader = () => {
  return <Loader2 className='mr-2 h-4 w-4 animate-spin' />;
};
