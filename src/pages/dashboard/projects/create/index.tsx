'use client';

import { api } from '~/utils/api';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import ProjectForm from '../_components/projectForm';

export default function CreateProjectPage() {
  const router = useRouter();
  const utils = api.useUtils();

  const create = api.project.create.useMutation({
    onSuccess: () => {
      toast.success('Task created');
      void utils.tasks.list.invalidate();
      void utils.tasks.invalidate();
      router.push('/dashboard/projects');
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  return (
    <div className='mx-auto'>
      <h1 className='mb-4 text-2xl font-bold'>
        Create Project
      </h1>
      <ProjectForm
        onSubmit={(data) => create.mutate(data)}
        isSubmitting={create.isPending}
      />
    </div>
  );
}
