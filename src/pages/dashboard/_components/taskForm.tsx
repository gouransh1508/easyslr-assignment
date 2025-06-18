'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { type z } from 'zod';
import { taskSchema } from '~/server/lib/validators/task';

import { Input } from '~/components/ui/input';
import { Textarea } from '~/components/ui/textarea';
import { Button } from '~/components/ui/button';
import { Label } from '~/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';
import { CalendarIcon, Info } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '~/components/ui/popover';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '~/components/ui/tooltip';
import { cn } from '~/lib/utils';

import { format } from 'date-fns';
import { Calendar } from '~/components/ui/calendar';

import { useState } from 'react';

type TaskFormValues = z.infer<typeof taskSchema>;

type TaskFormProps = {
  defaultValues?: Partial<TaskFormValues>;
  onSubmit: (values: TaskFormValues) => void;
  isSubmitting?: boolean;
};

export const TaskForm = ({
  defaultValues,
  onSubmit,
  isSubmitting,
}: TaskFormProps) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues,
  });

  const deadline = watch('deadline');
  const [calendarOpen, setCalendarOpen] = useState(false);

  const handleFormSubmit = async (
    values: TaskFormValues,
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
            <Label htmlFor='title'>Title</Label>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info
                  size={16}
                  className='cursor-help text-muted-foreground'
                />
              </TooltipTrigger>
              <TooltipContent>
                Give your task a descriptive title.
              </TooltipContent>
            </Tooltip>
          </div>
          <Input
            id='title'
            placeholder='Enter task title'
            {...register('title')}
          />
          {errors.title && (
            <p className='text-sm text-red-500'>
              {errors.title.message}
            </p>
          )}
        </div>

        {/* Description */}
        <div className='space-y-2'>
          <Label htmlFor='description'>Description</Label>
          <Textarea
            id='description'
            placeholder='Describe the task...'
            {...register('description')}
          />
          {errors.description && (
            <p className='text-sm text-red-500'>
              {errors.description.message}
            </p>
          )}
        </div>

        {/* Priority + Tag */}
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
          <div className='space-y-2'>
            <Label htmlFor='priority'>Priority</Label>
            <Select
              value={watch('priority')}
              onValueChange={(value) =>
                setValue(
                  'priority',
                  value as TaskFormValues['priority'],
                )
              }
            >
              <SelectTrigger>
                <SelectValue placeholder='Select Priority' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='Low'>Low</SelectItem>
                <SelectItem value='Medium'>
                  Medium
                </SelectItem>
                <SelectItem value='High'>High</SelectItem>
              </SelectContent>
            </Select>
            {errors.priority && (
              <p className='text-sm text-red-500'>
                {errors.priority.message}
              </p>
            )}
          </div>

          <div className='space-y-2'>
            <Label htmlFor='tag'>Tag</Label>
            <Select
              value={watch('tag')}
              onValueChange={(value) =>
                setValue(
                  'tag',
                  value as TaskFormValues['tag'],
                )
              }
            >
              <SelectTrigger>
                <SelectValue placeholder='Select Tag' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='Feature'>
                  Feature
                </SelectItem>
                <SelectItem value='Bug'>Bug</SelectItem>
                <SelectItem value='Improvement'>
                  Improvement
                </SelectItem>
              </SelectContent>
            </Select>
            {errors.tag && (
              <p className='text-sm text-red-500'>
                {errors.tag.message}
              </p>
            )}
          </div>
        </div>

        {/* Deadline Date Picker */}
        <div className='space-y-2'>
          <Label htmlFor='deadline'>Deadline</Label>
          <Popover
            open={calendarOpen}
            onOpenChange={setCalendarOpen}
          >
            <PopoverTrigger asChild>
              <Button
                variant='outline'
                className={cn(
                  'w-full justify-start text-left font-normal',
                  !deadline && 'text-muted-foreground',
                )}
              >
                <CalendarIcon className='mr-2 h-4 w-4' />
                {deadline
                  ? // eslint-disable-next-line @typescript-eslint/no-unsafe-call
                    format(new Date(deadline), 'PPP p')
                  : 'Pick a deadline'}
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className='w-auto p-0'
              align='start'
            >
              <Calendar
                mode='single'
                selected={
                  deadline ? new Date(deadline) : undefined
                }
                onSelect={(date) => {
                  setCalendarOpen(false);
                  setValue(
                    'deadline',
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                    date
                      ? // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                        new Date(date).toISOString()
                      : '',
                  );
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {errors.deadline && (
            <p className='text-sm text-red-500'>
              {errors.deadline.message}
            </p>
          )}
        </div>

        {/* Assignee */}
        <div className='space-y-2'>
          <div className='flex items-center gap-1'>
            <Label htmlFor='assignee'>
              Assignee User ID
            </Label>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info
                  size={16}
                  className='cursor-help text-muted-foreground'
                />
              </TooltipTrigger>
              <TooltipContent>
                Enter the user ID of the task assignee.
              </TooltipContent>
            </Tooltip>
          </div>
          <Input
            id='assignee'
            placeholder='e.g. usr_12345'
            {...register('assignee')}
          />
          {errors.assignee && (
            <p className='text-sm text-red-500'>
              {errors.assignee.message}
            </p>
          )}
        </div>

        {/* Submit */}
        <div className='pt-2'>
          <Button
            type='submit'
            disabled={isSubmitting}
            className='w-full transition-all duration-200 hover:shadow-lg'
          >
            {isSubmitting ? 'Saving...' : 'Save Task'}
          </Button>
        </div>
      </form>
    </TooltipProvider>
  );
};
