// src/pages/signup.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { api } from '~/utils/api';
import { signIn } from 'next-auth/react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '~/components/ui/card';
import { Input } from '~/components/ui/input';
import { Button } from '~/components/ui/button';
import { Label } from '~/components/ui/label';
import { toast } from 'sonner';

const signupSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters'),
});

type SignupValues = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
  });

  const signupMutation = api.auth.signup.useMutation({
    onSuccess: async (_, data) => {
      toast.success('Signup successful. Logging in...');
      await signIn('credentials', {
        email: data.email,
        password: data.password,
        callbackUrl: '/dashboard',
      });
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const onSubmit = (data: SignupValues) => {
    signupMutation.mutate(data);
  };

  return (
    <div className='flex min-h-screen items-center justify-center bg-gray-100 p-4'>
      <Card className='w-full max-w-md shadow-xl'>
        <CardHeader>
          <CardTitle className='text-center text-2xl'>
            Create an Account
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className='space-y-4'
          >
            <div>
              <Label htmlFor='name'>Name</Label>
              <Input id='name' {...register('name')} />
              {errors.name && (
                <p className='text-sm text-red-500'>
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor='email'>Email</Label>
              <Input
                id='email'
                type='email'
                {...register('email')}
              />
              {errors.email && (
                <p className='text-sm text-red-500'>
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor='password'>Password</Label>
              <Input
                id='password'
                type='password'
                {...register('password')}
              />
              {errors.password && (
                <p className='text-sm text-red-500'>
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button
              type='submit'
              className='w-full'
              disabled={signupMutation.isPending}
            >
              {signupMutation.isPending
                ? 'Creating Account...'
                : 'Sign Up'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
