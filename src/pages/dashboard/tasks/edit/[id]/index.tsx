'use client';

import { useEffect } from 'react';
import { api } from '~/utils/api';
import { toast } from 'sonner';
import { TaskForm } from '~/pages/dashboard/tasks/_components/taskForm';
import { useRouter } from 'next/router';
import { useRouter as useNavigationRouter } from 'next/navigation';
import { FullScreenLoader } from '~/components/loader';

export default function EditTaskPage() {
  const router = useRouter();
  const navigationRouter = useNavigationRouter();
  const { id } = router.query;

  const taskId = typeof id === 'string' ? id : '';

  const {
    data: task,
    isLoading,
    error,
  } = api.tasks.getById.useQuery(
    { id: taskId ?? '' },
    { enabled: !!taskId },
  );

  const utils = api.useUtils();

  const { mutate: updateTask, isPending: isSubmitting } =
    api.tasks.update.useMutation({
      onSuccess: async () => {
        toast.success('Task updated successfully');
        await utils.tasks.invalidate();
        navigationRouter.push('/dashboard/tasks');
      },
      onError: () => {
        toast.error('Failed to update task');
      },
    });

  useEffect(() => {
    if (error) toast.error(error.message);
  }, [error]);

  if (isLoading || !taskId)
    return <FullScreenLoader></FullScreenLoader>;
  if (!task) return <p>Task not found</p>;

  return (
    <div className='mx-auto max-w-2xl p-6'>
      <h1 className='mb-4 text-2xl font-bold'>Edit Task</h1>
      <TaskForm
        defaultValues={{
          ...task,
          deadline: new Date(task.deadline)
            .toISOString()
            .slice(0, 16),
        }}
        isSubmitting={isSubmitting}
        onSubmit={(values) =>
          updateTask({ ...values, id: task.id })
        }
      />
    </div>
  );
}
