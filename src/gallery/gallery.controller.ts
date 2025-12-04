import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { GalleryService } from './gallery.service';
import { CreateGalleryDto } from './dto/create-gallery.dto';
import { UpdateGalleryDto } from './dto/update-gallery.dto';
import { User } from '~/user/user.decorator';
import { GalleryType, GalleryWithImages } from '~/gallery/galleryType';
import { AuthGuard } from '~/guards/auth.guard';

@Controller('gallery')
export class GalleryController {
  constructor(private readonly galleryService: GalleryService) {}
  @UseGuards(AuthGuard)
  @Post()
  create(
    @Body(new ValidationPipe()) createGalleryDto: CreateGalleryDto,
    @User('id') currentUserId: number
  ): Promise<GalleryType> {
    return this.galleryService.create(createGalleryDto, currentUserId);
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll(
    @User('id') currentUserId: number,
    @Query('page') page: string
  ): Promise<GalleryWithImages[]> {
    return this.galleryService.findAll(currentUserId, +page);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@User('id') currentUserId: number, @Param('id') id: string): Promise<GalleryWithImages> {
    return this.galleryService.findOne(currentUserId, +id);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  update(
    @Param('id') galleryId: string,
    @Body(new ValidationPipe()) updateGalleryDto: UpdateGalleryDto,
    @User('id') currentUserId: number
  ): Promise<GalleryType> {
    return this.galleryService.update(+galleryId, updateGalleryDto, currentUserId);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') galleryId: string, @User('id') currentUserId: number): Promise<GalleryType> {
    return this.galleryService.remove(+galleryId, currentUserId);
  }
}
