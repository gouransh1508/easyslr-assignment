'use client';

import { useEffect } from 'react';
import { api } from '~/utils/api';
import { toast } from 'sonner';
import { useRouter } from 'next/router';
import { useRouter as useNavigationRouter } from 'next/navigation';
import { FullScreenLoader } from '~/components/loader';
import { ProjectForm } from '../../_components/projectForm';

export default function EditProjectPage() {
  const router = useRouter();
  const navigationRouter = useNavigationRouter();
  const { id } = router.query;

  const projectId = typeof id === 'string' ? id : '';

  const {
    data: project,
    isLoading,
    error,
  } = api.project.getById.useQuery(
    { id: projectId ?? '' },
    { enabled: !!projectId },
  );

  const utils = api.useUtils();

  const { mutate: updateProject, isPending: isSubmitting } =
    api.project.update.useMutation({
      onSuccess: async () => {
        toast.success('Project updated successfully');
        await utils.project.invalidate();
        navigationRouter.push('/dashboard/projects');
      },
      onError: () => {
        toast.error('Failed to update project');
      },
    });

  useEffect(() => {
    if (error) toast.error(error.message);
  }, [error]);

  if (isLoading || !projectId)
    return <FullScreenLoader></FullScreenLoader>;
  if (!project) return <p>Project not found</p>;

  return (
    <div className='mx-auto'>
      <h1 className='mb-4 text-2xl font-bold'>
        Edit Project
      </h1>
      <ProjectForm
        defaultValues={{
          name: project.name ?? '',
          description: project.description ?? '',
        }}
        isSubmitting={isSubmitting}
        onSubmit={(values) =>
          updateProject({ ...values, id: project.id })
        }
      />
    </div>
  );
}
