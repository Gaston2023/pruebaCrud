import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PhotosService } from './photos.service';
import { CreatePhotoDto } from './dto/create-photo.dto';
import { UpdatePhotoDto } from './dto/update-photo.dto';
import { Photo } from './entities/photo.entity';

@Controller('photos')
export class PhotosController {
  constructor(private readonly photosService: PhotosService) {}

  @Post()
  async create(@Body() createPhotoDto: CreatePhotoDto): Promise<Photo> {
    return this.photosService.create(createPhotoDto);
  }

  @Get()
  async findAll(): Promise<Photo[]> {
    return this.photosService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Photo> {
    return this.photosService.findOne(+id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePhotoDto: UpdatePhotoDto,
  ): Promise<Photo> {
    return this.photosService.update(+id, updatePhotoDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.photosService.remove(+id);
  }
}
