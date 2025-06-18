import { Card, CardContent } from '~/components/ui/card';
import { Button } from '~/components/ui/button';
import { useRouter } from 'next/navigation';

export function EmptyState({
  title = 'Nothing found',
  description = 'Try creating something new!',
  buttonLabel,
  href,
}: {
  title?: string;
  description?: string;
  buttonLabel: string;
  href: string;
}) {
  const router = useRouter();

  return (
    <Card className='py-12 text-center'>
      <CardContent className='flex flex-col items-center justify-center gap-4'>
        <h2 className='text-lg font-semibold text-gray-600'>
          {title}
        </h2>
        <p className='text-sm text-gray-500'>
          {description}
        </p>
        <Button onClick={() => router.push(href)}>
          {buttonLabel}
        </Button>
      </CardContent>
    </Card>
  );
}
