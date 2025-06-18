'use client';

import { api } from '~/utils/api';
import { toast } from 'sonner';
import { TaskForm } from '../_components/taskForm';
import { useRouter } from 'next/navigation';

export default function CreateTaskPage() {
  const router = useRouter();
  const utils = api.useUtils();

  const create = api.tasks.create.useMutation({
    onSuccess: () => {
      toast.success('Task created');
      void utils.tasks.list.invalidate();
      void utils.tasks.invalidate();
      router.push('/dashboard/tasks');
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  return (
    <div className='mx-auto max-w-xl py-10'>
      <h1 className='mb-4 text-2xl font-bold'>
        Create Task
      </h1>
      <TaskForm
        onSubmit={(data) => create.mutate(data)}
        isSubmitting={create.isPending}
      />
    </div>
  );
}
