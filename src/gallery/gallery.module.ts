import { Module } from '@nestjs/common';
import { GalleryService } from './gallery.service';
import { GalleryController } from './gallery.controller';
import { DrizzleModule } from '~/drizzle/drizzle.module';

@Module({
  imports: [DrizzleModule],
  controllers: [GalleryController],
  providers: [GalleryService],
})
export class GalleryModule {}
