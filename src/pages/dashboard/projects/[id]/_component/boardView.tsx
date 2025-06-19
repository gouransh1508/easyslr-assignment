'use client';

import {
  DndContext,
  closestCorners,
  type DragEndEvent,
  useDroppable,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useState } from 'react';
import { type Status, type Task } from '@prisma/client';
import { api } from '~/utils/api';
import { toast } from 'sonner';
import { Button } from '~/components/ui/button';
import {
  Card,
  CardContent,
  CardTitle,
} from '~/components/ui/card';
import { Plus } from 'lucide-react';
import Link from 'next/link';

export default function BoardView({
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
      void utils.tasks.invalidate();
      toast.success('Task moved successfully!');
    },
    onError: () => {
      toast.error('Failed to move task');
    },
  });

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const taskId = active.id.toString();

    const overContainer = document.querySelector(
      `[data-status-column-id="${over.id}"]`,
    );

    const columnElement = overContainer?.closest(
      '[data-status-column-id]',
    );

    if (!columnElement) return;

    const newStatusId = columnElement.getAttribute(
      'data-status-column-id',
    );
    if (!newStatusId) return;

    const task = tasks.find((t) => t.id === taskId);
    if (!task || task.statusId === newStatusId) return;

    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? { ...t, statusId: newStatusId }
          : t,
      ),
    );

    // Delay for smoother transition
    setTimeout(() => {
      updateStatus.mutate({
        taskId,
        statusId: newStatusId,
      });
    }, 150);
  };

  return (
    <DndContext
      collisionDetection={closestCorners}
      onDragEnd={handleDragEnd}
    >
      <div className='grid grid-cols-1 gap-4 md:grid-cols-5'>
        {statuses.map((status) => (
          <DroppableColumn key={status.id} status={status}>
            <SortableContext
              items={tasks
                .filter((t) => t.statusId === status.id)
                .map((t) => t.id)}
              strategy={verticalListSortingStrategy}
            >
              {tasks.filter((t) => t.statusId === status.id)
                .length === 0 ? (
                <div className='rounded border bg-background px-3 py-2 text-sm italic text-muted-foreground'>
                  No tasks yet
                </div>
              ) : (
                tasks
                  .filter((t) => t.statusId === status.id)
                  .map((task) => (
                    <DraggableCard
                      key={task.id}
                      task={task}
                    />
                  ))
              )}
            </SortableContext>
          </DroppableColumn>
        ))}
      </div>
    </DndContext>
  );
}

function DroppableColumn({
  status,
  children,
}: {
  status: Status;
  children: React.ReactNode;
}) {
  const { setNodeRef } = useDroppable({ id: status.id });

  return (
    <Card
      ref={setNodeRef}
      className='rounded-lg bg-muted p-2'
      data-status-column-id={status.id}
    >
      <CardTitle className='mb-4 flex items-center justify-between gap-2'>
        {status.name}
        <Link
          href={`/dashboard/tasks/create?projectId=${status.projectId}&statusId=${status.id}`}
        >
          <Button variant='outline' size='icon'>
            <Plus />
          </Button>
        </Link>
      </CardTitle>
      <CardContent className='p-0'>
        <div className='min-h-[300px] space-y-2'>
          {children}
        </div>
      </CardContent>
    </Card>
  );
}

function DraggableCard({ task }: { task: Task }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Link href={`/dashboard/tasks/edit/${task.id}`}>
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
        <div className='flex justify-between'>
          <span className='text-sm text-gray-500'>
            {task.tag}
          </span>
          <span className='text-sm text-red-300'>
            {new Date(task.deadline).toLocaleDateString()}
          </span>
        </div>
      </Card>
    </Link>
  );
}
