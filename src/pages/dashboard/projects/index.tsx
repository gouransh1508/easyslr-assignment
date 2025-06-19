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

const ITEMS_PER_PAGE = 5;

export default function ProjectsListPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);

  const { data, isLoading } = api.project.list.useQuery({
    page,
    limit: ITEMS_PER_PAGE,
  });

  console.log(data, 'datadata');

  const totalPages = data
    ? Math.ceil(data.totalCount / ITEMS_PER_PAGE)
    : 1;

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <h1 className='text-3xl font-bold'>Projects</h1>
        <Button
          onClick={() =>
            router.push('/dashboard/projects/create')
          }
        >
          Create Projects
        </Button>
      </div>

      {isLoading ? (
        <div className='grid grid-cols-1 gap-8 md:grid-cols-3'>
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
          {data?.projects?.length === 0 ? (
            <EmptyState
              title='No projects found'
              description='You haven’t created any project yet.'
              buttonLabel='Create First Project'
              href='/dashboard/projects/create'
            />
          ) : (
            <div className='grid grid-cols-1 gap-8 md:grid-cols-3'>
              <div className='space-y-4'>
                {data?.projects?.map((project) => (
                  <Card
                    key={project.id}
                    className='cursor-pointer transition hover:shadow-xl'
                    onClick={() =>
                      router.push(
                        `/dashboard/projects/${project.id}`,
                      )
                    }
                  >
                    <CardContent className='space-y-2 p-4'>
                      <div className='flex items-center justify-between'>
                        <h2 className='text-xl font-semibold'>
                          {project.name}
                        </h2>
                      </div>
                      <p className='truncate text-sm text-gray-700'>
                        {project.description}
                      </p>
                      <div className='flex justify-between text-xs text-gray-500'>
                        <span>
                          Created By:{' '}
                          {project.createdBy.name}
                        </span>
                        <span>
                          Created At:{' '}
                          {new Date(
                            project.createdAt,
                          ).toLocaleString()}{' '}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
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
