import { InferSelectModel } from 'drizzle-orm';
import { userGallery } from '~/db/schema';

export type GalleryType = InferSelectModel<typeof userGallery>;
export type GalleryWithImages = {
  id: number;
  title: string;
  description: string;
  createdAt: Date;
  userId: number;
  images: {
    id: number;
    title: string;
    description: string;
    createdAt: Date;
    galleryId: number;
  }[];
};
