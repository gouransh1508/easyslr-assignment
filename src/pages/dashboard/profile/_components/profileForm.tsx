'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { type z } from 'zod';
import {
  Input,
  Input as FileInput,
} from '~/components/ui/input';
import { Textarea } from '~/components/ui/textarea';
import { Button } from '~/components/ui/button';
import { userProfileSchema } from '~/server/lib/validators/user';
import { api } from '~/utils/api';
import { useRef, useState } from 'react';
import { toast } from 'sonner';
import { uploadProfilePicture } from '~/utils/supabase';
import { useSession } from 'next-auth/react';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '~/components/ui/avatar';
import { Label } from '~/components/ui/label';

import { Upload } from 'lucide-react';

type FormData = z.infer<typeof userProfileSchema>;

type Props = {
  defaultValues?: Partial<FormData>;
  onSubmit: (data: FormData) => Promise<void>;
  isSubmitting?: boolean;
};

export function UserProfileForm({
  defaultValues,
  onSubmit,
  isSubmitting,
}: Props) {
  const session = useSession();
  const utils = api.useUtils();

  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const updatePicture =
    api.user.updateProfilePicture.useMutation();

  const handleUpload = async () => {
    if (!file) return toast.error('No file selected');
    if (!file.type.startsWith('image/'))
      return toast.error('Only image files are allowed');

    try {
      const imageUrl = await uploadProfilePicture(
        file,
        session.data?.user.id ?? '',
      );
      await updatePicture.mutateAsync({ imageUrl });
      await utils.user.invalidate();

      toast.success('Profile picture updated!');
    } catch {
      toast.error('Upload failed');
    }

    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(userProfileSchema),
    defaultValues,
  });

  return (
    <div className='grid grid-cols-1 gap-8 md:grid-cols-3'>
      <div className='flex w-full justify-center rounded-xl border bg-background p-6 shadow-xl'>
        <div className='flex flex-col items-center space-y-4'>
          <Avatar className='h-28 w-28 border'>
            <AvatarImage
              src={
                defaultValues?.profilePicture ??
                session.data?.user.profilePicture ??
                ''
              }
              alt='Profile picture'
            />
            <AvatarFallback>
              {session.data?.user.name?.charAt(0) ?? 'U'}
            </AvatarFallback>
          </Avatar>

          <FileInput
            type='file'
            accept='image/*'
            ref={fileInputRef}
            onChange={(e) =>
              setFile(e.target.files?.[0] ?? null)
            }
          />

          <Button
            onClick={handleUpload}
            disabled={updatePicture.isPending}
            className='flex items-center gap-2'
          >
            <Upload className='h-4 w-4' />
            {updatePicture.isPending
              ? 'Uploading...'
              : 'Upload Picture'}
          </Button>
        </div>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className='space-y-6 rounded-xl bg-background p-6 shadow-xl md:col-span-2'
      >
        <div className='grid gap-2'>
          <Label htmlFor='name'>Full Name</Label>
          <Input
            id='name'
            placeholder='John Doe'
            {...register('name')}
          />
          {errors.name && (
            <p className='text-sm text-red-500'>
              {errors.name.message}
            </p>
          )}
        </div>

        <div className='grid gap-2'>
          <Label htmlFor='email'>Email</Label>
          <Input
            id='email'
            type='email'
            placeholder='john@example.com'
            {...register('email')}
          />
          {errors.email && (
            <p className='text-sm text-red-500'>
              {errors.email.message}
            </p>
          )}
        </div>

        <div className='grid gap-2'>
          <Label htmlFor='bio'>Bio</Label>
          <Textarea
            id='bio'
            placeholder='Your short bio...'
            {...register('bio')}
          />
        </div>

        <Button
          type='submit'
          disabled={isSubmitting}
          className='w-full'
        >
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </Button>
      </form>
    </div>
  );
}
