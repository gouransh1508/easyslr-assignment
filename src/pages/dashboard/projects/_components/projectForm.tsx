'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { type z } from 'zod';

import { Info } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Textarea } from '~/components/ui/textarea';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '~/components/ui/tooltip';

import { projectSchema } from '~/server/lib/validators/project';

type ProjectFormValues = z.infer<typeof projectSchema>;

type ProjectFormProps = {
  defaultValues?: Partial<ProjectFormValues>;
  onSubmit: (values: ProjectFormValues) => void;
  isSubmitting?: boolean;
};

export const ProjectForm = ({
  defaultValues,
  onSubmit,
  isSubmitting,
}: ProjectFormProps) => {
  const {
    register,
    handleSubmit,

    formState: { errors },
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues,
  });

  const handleFormSubmit = async (
    values: ProjectFormValues,
  ) => {
    onSubmit(values);
  };

  return (
    <TooltipProvider>
      <form
        onSubmit={handleSubmit(handleFormSubmit)}
        className='space-y-6 rounded-2xl border bg-background p-8 shadow-lg dark:border-zinc-800'
      >
        {/* Title */}
        <div className='space-y-2'>
          <div className='flex items-center gap-1'>
            <Label htmlFor='title'>Name</Label>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info
                  size={16}
                  className='cursor-help text-muted-foreground'
                />
              </TooltipTrigger>
              <TooltipContent>
                Give your project a descriptive name.
              </TooltipContent>
            </Tooltip>
          </div>
          <Input
            id='title'
            placeholder='Enter project name'
            {...register('name')}
          />
          {errors.name && (
            <p className='text-sm text-red-500'>
              {errors.name.message}
            </p>
          )}
        </div>

        {/* Description */}
        <div className='space-y-2'>
          <Label htmlFor='description'>Description</Label>
          <Textarea
            id='description'
            placeholder='Describe the project...'
            {...register('description')}
          />
          {errors.description && (
            <p className='text-sm text-red-500'>
              {errors.description.message}
            </p>
          )}
        </div>

        {/* Submit */}
        <div className='flex justify-center pt-2'>
          <Button
            type='submit'
            disabled={isSubmitting}
            className='transition-all duration-200 hover:shadow-lg'
          >
            {isSubmitting ? 'Saving...' : 'Save Project'}
          </Button>
        </div>
      </form>
    </TooltipProvider>
  );
};
