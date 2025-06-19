'use client';

import { useState } from 'react';
import { Card, CardContent } from '~/components/ui/card';
import { Button } from '~/components/ui/button';
import { Skeleton } from '~/components/ui/skeleton';
import { useRouter } from 'next/navigation';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from '~/components/ui/pagination';
import { api } from '~/utils/api';
import { EmptyState } from '~/components/emptyState';
import { Badge } from '~/components/ui/badge';
import Link from 'next/link';
import { SquareArrowOutUpRight } from 'lucide-react';

const ITEMS_PER_PAGE = 5;

export default function TaskListPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);

  const { data, isLoading } = api.tasks.list.useQuery({
    page,
    limit: ITEMS_PER_PAGE,
  });

  const totalPages = data
    ? Math.ceil(data.totalCount / ITEMS_PER_PAGE)
    : 1;

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <h1 className='text-3xl font-bold'>Tasks</h1>
        <Button
          onClick={() =>
            router.push('/dashboard/tasks/create')
          }
        >
          Create Task
        </Button>
      </div>

      {isLoading ? (
        <div className='space-y-4'>
          {Array.from({ length: ITEMS_PER_PAGE }).map(
            (_, i) => (
              <Skeleton
                key={i}
                className='h-24 w-full rounded-xl'
              />
            ),
          )}
        </div>
      ) : (
        <div>
          {data?.tasks?.length === 0 ? (
            <EmptyState
              title='No tasks found'
              description='You haven’t created any tasks yet.'
              buttonLabel='Create First Task'
              href='/dashboard/tasks/create'
            />
          ) : (
            <div className='flex flex-col gap-4'>
              {data?.tasks?.map((task) => (
                <Link
                  key={task.id}
                  href={`/dashboard/tasks/edit/${task.id}`}
                >
                  <Card className='cursor-pointer transition hover:shadow-xl'>
                    <CardContent className='space-y-2 p-4'>
                      <div className='flex items-center justify-between'>
                        <h2 className='text-xl font-semibold'>
                          {task.title}
                        </h2>
                        <div className='flex flex-row items-center gap-2 md:flex-row'>
                          <Badge variant={'outline'}>
                            {task.priority}
                          </Badge>
                          <span>
                            <Link
                              href={`/dashboard/projects/${task.project.id}`}
                              className='flex cursor-pointer items-center gap-2 text-sm text-blue-400'
                            >
                              {task.project.name}
                              <SquareArrowOutUpRight
                                size={16}
                              ></SquareArrowOutUpRight>
                            </Link>
                          </span>
                        </div>
                      </div>
                      <p className='truncate text-sm text-gray-700'>
                        {task.description}
                      </p>
                      <div className='flex justify-between text-xs text-gray-500'>
                        <span>Tag: {task.tag}</span>
                        <div className='flex flex-row gap-2 md:flex-row'>
                          <span>
                            Deadline:{' '}
                            {new Date(
                              task.deadline,
                            ).toLocaleDateString()}
                          </span>
                          <span>
                            Created By:{' '}
                            {task.createdBy.name}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      <div className='pt-4'>
        {totalPages > 1 && (
          <Pagination>
            <PaginationContent>
              {Array.from({ length: totalPages }).map(
                (_, index) => (
                  <PaginationItem key={index}>
                    <PaginationLink
                      isActive={page === index + 1}
                      onClick={() => setPage(index + 1)}
                      className='cursor-pointer'
                    >
                      {index + 1}
                    </PaginationLink>
                  </PaginationItem>
                ),
              )}
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </div>
  );
}
