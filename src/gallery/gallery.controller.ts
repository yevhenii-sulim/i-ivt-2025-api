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
import { ApiResponse } from '@nestjs/swagger';

@Controller('gallery')
export class GalleryController {
  constructor(private readonly galleryService: GalleryService) {}
  @ApiResponse({
    status: 201,
    schema: {
      example: {
        id: 2,
        title: 'Hello world!',
        description: 'I welcome you to our site\n',
        createdAt: '2025-12-05T19:01:58.753Z',
        userId: 1,
      },
    },
  })
  @UseGuards(AuthGuard)
  @Post()
  create(
    @Body(new ValidationPipe()) createGalleryDto: CreateGalleryDto,
    @User('id') currentUserId: number
  ): Promise<GalleryType> {
    return this.galleryService.create(createGalleryDto, currentUserId);
  }

  @ApiResponse({
    status: 200,
    schema: {
      example: {
        galleries: [
          {
            id: 2,
            title: 'Hello world!',
            description: 'I welcome you to our site\n',
            createdAt: '2025-12-05T19:01:58.753Z',
            userId: 1,
            images: [],
          },
        ],
        total: '1',
      },
    },
  })
  @UseGuards(AuthGuard)
  @Get()
  findAll(
    @User('id') currentUserId: number,
    @Query('page') page: string,
    @Query('limit') limit: string
  ): Promise<{ galleries: GalleryWithImages[]; total: number }> {
    return this.galleryService.findAll(currentUserId, +page, +limit);
  }

  @ApiResponse({
    status: 200,
    schema: {
      example: {
        id: 2,
        title: 'Hello world!',
        description: 'I welcome you to our site\n',
        createdAt: '2025-12-05T19:01:58.753Z',
        userId: 1,
        images: [],
      },
    },
  })
  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@User('id') currentUserId: number, @Param('id') id: string): Promise<GalleryWithImages> {
    return this.galleryService.findOne(currentUserId, +id);
  }

  @ApiResponse({
    status: 200,
    schema: {
      example: {
        id: 2,
        title: 'I am humen!',
        description: 'I welcome you to our site\n',
        createdAt: '2025-12-05T19:01:58.753Z',
        userId: 1,
        images: [],
      },
    },
  })
  @UseGuards(AuthGuard)
  @Patch(':id')
  update(
    @Param('id') galleryId: string,
    @Body(new ValidationPipe()) updateGalleryDto: UpdateGalleryDto,
    @User('id') currentUserId: number
  ): Promise<GalleryType> {
    return this.galleryService.update(+galleryId, updateGalleryDto, currentUserId);
  }
  @ApiResponse({
    status: 200,
    schema: {
      example: {
        id: 2,
        title: 'I am humen!',
        description: 'I welcome you to our site\n',
        createdAt: '2025-12-05T19:01:58.753Z',
        userId: 1,
      },
    },
  })
  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') galleryId: string, @User('id') currentUserId: number): Promise<GalleryType> {
    return this.galleryService.remove(+galleryId, currentUserId);
  }
}
