import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateGalleryDto } from './dto/create-gallery.dto';
import { UpdateGalleryDto } from './dto/update-gallery.dto';
import { DrizzleService } from '~/drizzle/drizzle.service';
import { imagesTable, userGallery } from '~/db/schema';
import { and, eq, sql } from 'drizzle-orm';
import { GalleryType, GalleryWithImages } from '~/gallery/galleryType';

@Injectable()
export class GalleryService {
  constructor(private readonly drizzle: DrizzleService) {}

  async getGalleryByTitle(title: string, currentId: number): Promise<GalleryType[]> {
    const galleries = this.drizzle.db
      .select()
      .from(userGallery)
      .where(and(eq(userGallery.title, title), eq(userGallery.userId, currentId)));
    return galleries;
  }

  async create(createGalleryDto: CreateGalleryDto, currentUserId: number): Promise<GalleryType> {
    const galleries = await this.getGalleryByTitle(createGalleryDto.title, currentUserId);
    if (!!galleries.length) {
      throw new HttpException('gallery title like this already exist', HttpStatus.CONFLICT);
    }
    const createdGallery = await this.drizzle.db
      .insert(userGallery)
      .values({
        ...createGalleryDto,
        userId: currentUserId,
      })
      .returning();
    return createdGallery[0];
  }

  async findAll(
    currentUserId: number,
    queryPage: number,
    queryLimit?: number
  ): Promise<{ galleries: GalleryWithImages[]; total: number }> {
    const page = queryPage && queryPage > 1 ? queryPage : 1;
    const limit = queryLimit ? queryLimit : 5;
    const offset = (page - 1) * limit;

    const [galleries, total] = await Promise.all([
      this.drizzle.db
        .select({
          gallery: userGallery,
          image: imagesTable,
        })
        .from(userGallery)
        .leftJoin(imagesTable, eq(imagesTable.galleryId, userGallery.id))

        .where(eq(userGallery.userId, currentUserId))
        .limit(limit)
        .offset(offset),

      this.drizzle.db
        .select({ count: sql<number>`count(*)` })
        .from(userGallery)
        .where(eq(userGallery.userId, currentUserId)),
    ]);

    const map = new Map<number, GalleryWithImages>();

    galleries.forEach(({ gallery, image }) => {
      if (!map.has(gallery.id)) {
        map.set(gallery.id, { ...gallery, images: [] });
      }
      if (image?.id) {
        map.get(gallery.id)!.images.push(image);
      }
    });

    return { galleries: Array.from(map.values()), total: total[0].count };
  }

  async findOne(currentUserId: number, galleryId: number): Promise<GalleryWithImages> {
    const galleries = await this.drizzle.db
      .select({
        gallery: userGallery,
        image: imagesTable,
      })
      .from(userGallery)
      .leftJoin(imagesTable, eq(imagesTable.galleryId, userGallery.id))
      .where(and(eq(userGallery.userId, currentUserId), eq(userGallery.id, galleryId)));
    if (!galleries.length) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    const map = new Map<number, GalleryWithImages>();

    galleries.forEach(({ gallery, image }) => {
      if (!map.has(gallery.id)) {
        map.set(gallery.id, { ...gallery, images: [] });
      }
      if (image?.id) {
        map.get(gallery.id)!.images.push(image);
      }
    });

    return Array.from(map.values())[0];
  }

  async update(
    galleryId: number,
    updateGalleryDto: UpdateGalleryDto,
    currentUserId: number
  ): Promise<GalleryType> {
    const foundGallery = await this.findOne(currentUserId, galleryId);
    if (!foundGallery) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    const updatedGallery = await this.drizzle.db
      .update(userGallery)
      .set(updateGalleryDto)
      .where(and(eq(userGallery.userId, currentUserId), eq(userGallery.id, galleryId)))
      .returning();
    return updatedGallery[0];
  }

  async remove(galleryId: number, currentUserId: number): Promise<GalleryType> {
    const foundGallery = await this.findOne(currentUserId, galleryId);
    if (!foundGallery) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    const deletedGallery = await this.drizzle.db
      .delete(userGallery)
      .where(and(eq(userGallery.userId, currentUserId), eq(userGallery.id, galleryId)))
      .returning();
    return deletedGallery[0];
  }
}
