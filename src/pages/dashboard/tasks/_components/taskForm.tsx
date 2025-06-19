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
import { useParams } from 'next/navigation';
import { api } from '~/utils/api';

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
  const params = useParams();
  const projectIdFromParams = params?.projectId as
    | string
    | undefined;
  const statusIdFromParams = params?.statusId as
    | string
    | undefined;

  const { data: projects = [] } =
    api.project.getAllProjects.useQuery();

  const [selectedProject, setSelectedProject] = useState(
    defaultValues?.projectId ?? projectIdFromParams ?? '',
  );

  const { data: statuses = [] } =
    api.status.getStatusesByProject.useQuery(
      { projectId: selectedProject },
      {
        enabled: !!selectedProject,
      },
    );

  const { data: users = [] } =
    api.user.getAllUsers.useQuery();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      ...defaultValues,
      projectId:
        defaultValues?.projectId ??
        projectIdFromParams ??
        '',
      statusId:
        defaultValues?.statusId ?? statusIdFromParams ?? '',
    },
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
        className='grid grid-cols-3 gap-8 rounded-2xl border bg-background p-8 shadow-lg dark:border-zinc-800'
      >
        {/* Project Selection */}
        <div className='space-y-2'>
          <Label htmlFor='project'>Project</Label>
          <Select
            value={watch('projectId')}
            onValueChange={(val) => {
              setValue('projectId', val);
              setSelectedProject(val);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder='Select Project' />
            </SelectTrigger>
            <SelectContent>
              {projects.map((project) => (
                <SelectItem
                  key={project.id}
                  value={project.id}
                >
                  {project.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Status Selection */}
        <div className='space-y-2'>
          <Label htmlFor='status'>Status</Label>
          <Select
            value={watch('statusId')}
            onValueChange={(val) =>
              setValue('statusId', val)
            }
            disabled={!statuses.length}
          >
            <SelectTrigger>
              <SelectValue placeholder='Select Status' />
            </SelectTrigger>
            <SelectContent>
              {statuses.map((status) => (
                <SelectItem
                  key={status.id}
                  value={status.id}
                >
                  {status.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Assignee */}
        <div className='space-y-2'>
          <div className='mt-2 flex items-center gap-1'>
            <Label htmlFor='assignee'>Assignee</Label>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info
                  size={16}
                  className='cursor-help text-muted-foreground'
                />
              </TooltipTrigger>
              <TooltipContent>
                Select the user assigned to this task.
              </TooltipContent>
            </Tooltip>
          </div>
          <Select
            value={watch('assignee')}
            onValueChange={(val) =>
              setValue('assignee', val)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder='Select Assignee' />
            </SelectTrigger>
            <SelectContent>
              {users.map((user) => (
                <SelectItem key={user.id} value={user.id}>
                  {user.name ?? user.email}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.assignee && (
            <p className='text-sm text-red-500'>
              {errors.assignee.message}
            </p>
          )}
        </div>

        {/* Title */}
        <div className='col-span-3 space-y-2'>
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
        <div className='col-span-3 space-y-2'>
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
              <SelectItem value='Medium'>Medium</SelectItem>
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
                  ? format(new Date(deadline), 'PPP p')
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
                    date
                      ? new Date(date).toISOString()
                      : '',
                  );
                }}
              />
            </PopoverContent>
          </Popover>
          {errors.deadline && (
            <p className='text-sm text-red-500'>
              {errors.deadline.message}
            </p>
          )}
        </div>

        {/* Submit */}
        <div className='col-span-3 flex justify-center pt-2'>
          <Button
            type='submit'
            disabled={isSubmitting}
            className='transition-all duration-200 hover:shadow-lg md:px-20'
          >
            {isSubmitting ? 'Saving...' : 'Save Task'}
          </Button>
        </div>
      </form>
    </TooltipProvider>
  );
};
