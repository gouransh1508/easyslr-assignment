import { api } from '~/utils/api';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { FullScreenLoader } from '~/components/loader';
import { useEffect } from 'react';
import UserProfileForm from '../_components/profileForm';

export default function ProfilePage() {
  const session = useSession();

  const userId = session?.data?.user?.id ?? '';

  const {
    data: user,
    isLoading,
    error,
    refetch,
  } = api.user.getById.useQuery(
    { id: userId },
    { enabled: !!userId },
  );

  const utils = api.useUtils();

  const { mutate: updateUser, isPending: isSubmitting } =
    api.user.updateProfile.useMutation({
      onSuccess: async () => {
        toast.success('Profile updated successfully');
        await utils.user.invalidate();
        await refetch();
      },
      onError: () => {
        toast.error('Failed to update profile');
      },
    });

  useEffect(() => {
    if (error) toast.error(error.message);
  }, [error]);

  if (isLoading || !userId)
    return <FullScreenLoader></FullScreenLoader>;
  if (!user) return <p>User not found</p>;

  return (
    <div className='mx-auto space-y-6'>
      <h1 className='text-2xl font-semibold'>
        Profile Settings
      </h1>
      <UserProfileForm
        defaultValues={{
          ...user,
          name: user.name ?? '',
          email: user.email ?? '',
          profilePicture: user.profilePicture ?? '',
          bio: user.bio ?? '',
        }}
        onSubmit={async (values) => {
          updateUser({ ...values, id: user.id });
        }}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
