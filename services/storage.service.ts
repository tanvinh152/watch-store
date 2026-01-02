import { createClient } from '@/lib/supabase/client';

const BUCKET_NAME = 'products';

export const storageService = {
  async uploadProductImage(file: File): Promise<string> {
    const supabase = createClient();
    
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) throw uploadError;

    const {
      data: { publicUrl },
    } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath);

    return publicUrl;
  },

  async uploadMultipleImages(files: File[]): Promise<string[]> {
    const uploadPromises = files.map((file) => this.uploadProductImage(file));
    return Promise.all(uploadPromises);
  },

  async deleteProductImage(url: string): Promise<void> {
    const supabase = createClient();
    
    // Extract file path from URL
    const urlParts = url.split(`/${BUCKET_NAME}/`);
    if (urlParts.length < 2) return;

    const filePath = urlParts[1];

    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([filePath]);

    if (error) throw error;
  },

  async deleteMultipleImages(urls: string[]): Promise<void> {
    const deletePromises = urls.map((url) => this.deleteProductImage(url));
    await Promise.all(deletePromises);
  },
};
