'use client';

import {
  DndContext,
  closestCorners,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useState } from 'react';
import { type Status, type Task } from '@prisma/client';
import { api } from '~/utils/api';
import { toast } from 'sonner';
import {
  Card,
  CardContent,
  CardTitle,
} from '~/components/ui/card';

export function BoardView({
  tasks: initialTasks,
  statuses,
}: {
  tasks: Task[];
  statuses: Status[];
}) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  const utils = api.useUtils();
  const updateStatus = api.tasks.updateStatus.useMutation({
    onSuccess: () => {
      void utils.tasks.invalidate(); // or the specific list query
      toast.success('Task moved successfully!');
    },
    onError: () => {
      toast.error('Failed to move task');
    },
  });

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    console.log('dargendddd');

    const taskId = active.id.toString();
    const newStatusId = over.id.toString();

    const task = tasks.find((t) => t.id === taskId);
    if (!task || task.statusId === newStatusId) return;

    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? { ...t, statusId: newStatusId }
          : t,
      ),
    );

    updateStatus.mutate({ taskId, statusId: newStatusId });
  };

  return (
    <DndContext
      collisionDetection={closestCorners}
      onDragEnd={handleDragEnd}
    >
      <div className='grid grid-cols-1 gap-4 md:grid-cols-5'>
        {statuses.map((status) => (
          <SortableContext
            key={status.id}
            items={tasks
              .filter((t) => t.statusId === status.id)
              .map((t) => t.id)}
            strategy={verticalListSortingStrategy}
          >
            <Card className='rounded-lg bg-muted p-2'>
              <CardTitle className='mb-4 flex items-center justify-between gap-2'>
                {status.name}
                <Button
                  variant='outline'
                  size={'icon'}
                  className='flex items-center gap-2'
                >
                  <Plus></Plus>
                </Button>
              </CardTitle>
              <CardContent className='p-0'>
                <div className='min-h-[300px] space-y-2'>
                  {tasks.filter(
                    (task) => task.statusId === status.id,
                  ).length === 0 ? (
                    <div className='rounded border bg-background px-3 py-2 text-sm italic text-muted-foreground'>
                      No tasks yet
                    </div>
                  ) : (
                    tasks
                      .filter(
                        (task) =>
                          task.statusId === status.id,
                      )
                      .map((task) => (
                        <DraggableCard
                          key={task.id}
                          task={task}
                        />
                      ))
                  )}
                </div>
              </CardContent>
            </Card>
          </SortableContext>
        ))}
      </div>
    </DndContext>
  );
}

import { useDraggable } from '@dnd-kit/core';
import { Plus } from 'lucide-react';
import { Button } from '~/components/ui/button';

function DraggableCard({ task }: { task: Task }) {
  const { attributes, listeners, setNodeRef, transform } =
    useDraggable({ id: task.id });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className='cursor-move space-y-2 bg-card p-3 shadow-xl'
      {...listeners}
      {...attributes}
    >
      <CardTitle className='flex justify-between gap-2'>
        {task.title}
        <span className='text-sm text-gray-500'>
          {task.priority}
        </span>
      </CardTitle>
      <p>{task.description}</p>
      <div className={'flex justify-between'}>
        <span className='text-sm text-gray-500'>
          {task.tag}
        </span>
        <span className='text-sm text-red-300'>
          {new Date(task.deadline).toLocaleDateString()}
        </span>
      </div>
    </Card>
  );
}
