import { supabase } from '~/lib/supabase/client';

export async function uploadProfilePicture(
  file: File,
  userId: string,
) {
  if (!userId) {
    throw Error('Invalid Operation!');
  }
  const filePath = `${userId}/${Date.now()}-${file.name}`;

  const { error } = await supabase.storage
    .from('easyslr/profile-pictures')
    .upload(filePath, file);

  if (error) throw error;

  const { data: publicUrlData } = supabase.storage
    .from('easyslr/profile-pictures')
    .getPublicUrl(filePath);

  return publicUrlData.publicUrl;
}
