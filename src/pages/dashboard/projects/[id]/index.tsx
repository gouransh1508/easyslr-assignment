'use client';

import { useParams, useRouter } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '~/components/ui/dropdown-menu';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '~/components/ui/tabs';

import {
  Columns3,
  Edit,
  Ellipsis,
  Rows3,
} from 'lucide-react';
import { Skeleton } from '~/components/ui/skeleton';
import { api } from '~/utils/api';
import { BoardView } from './_component/boardView';
import { Button } from '~/components/ui/button';

export default function ProjectHomePage() {
  const params = useParams();
  const id = params?.id as string | undefined;

  const router = useRouter();
  const projectId = id!;

  const { data, isLoading } =
    api.tasks.listByProject.useQuery({ projectId });

  if (isLoading)
    return <Skeleton className='h-32 w-full' />;

  return (
    <div className='space-y-2'>
      <div className='flex items-center gap-4'>
        <h1 className='text-2xl font-bold'>
          {data?.project?.name ?? 'Project'}
        </h1>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant='outline'
              size={'icon'}
              className='flex items-center gap-2'
            >
              <Ellipsis></Ellipsis>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align='end' className='w-44'>
            <DropdownMenuItem
              onClick={() =>
                router.push(
                  `/dashboard/projects/edit/${projectId}`,
                )
              }
            >
              <Edit className='mr-2 h-4 w-4' />
              <span className='cursor-pointer text-xs font-bold'>
                Edit Project
              </span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Tabs
        defaultValue='board'
        className='w-full items-center !p-0'
      >
        <TabsList className='mt-1 w-full justify-start border-b !p-0'>
          <TabsTrigger
            value='board'
            className='mb-2 flex items-center gap-2 md:min-w-40'
          >
            <Columns3 size={20}></Columns3>
            Board
          </TabsTrigger>
          <TabsTrigger
            value='list'
            className='flex items-center gap-2 md:min-w-40'
          >
            <Rows3 size={20}></Rows3>
            List
          </TabsTrigger>
        </TabsList>

        <TabsContent value='board' className='mt-4'>
          <BoardView
            tasks={data?.tasks ?? []}
            statuses={data?.statuses ?? []}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
