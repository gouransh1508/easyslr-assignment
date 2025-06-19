'use client';

import { api } from '~/utils/api';
import { toast } from 'sonner';
import {
  useRouter,
  useSearchParams,
} from 'next/navigation';
import TaskForm from '../_components/taskForm';

export default function CreateTaskPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Extract query params
  const projectId = searchParams.get('projectId');
  const statusId = searchParams.get('statusId');

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
    <div className='mx-auto'>
      <h1 className='mb-4 text-2xl font-bold'>
        Create Task
      </h1>
      <TaskForm
        defaultValues={{
          projectId: projectId ?? '',
          statusId: statusId ?? '',
        }}
        onSubmit={(data) => create.mutate(data)}
        isSubmitting={create.isPending}
      />
    </div>
  );
}
