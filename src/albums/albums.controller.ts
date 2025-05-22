import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Album, AlbumDocument } from '../schemas/album.schema';
import { Model, Types } from 'mongoose';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateAlbumDto } from './create-album.dto';

@Controller('albums')
export class AlbumsController {
  constructor(
    @InjectModel(Album.name) private albumModel: Model<AlbumDocument>,
  ) {}

  @Get()
  async getAll(@Query('artist') artist: string) {
    let albums = [];
    if (artist) {
      albums = await this.albumModel.find({
        artist: new Types.ObjectId(artist),
      });
    } else {
      albums = await this.albumModel.find();
    }
    return albums;
  }
  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.albumModel.find({ _id: id });
  }
  @Post()
  @UseInterceptors(
    FileInterceptor('image', { dest: './public/uploads/albums' }),
  )
  create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createAlbumDto: CreateAlbumDto,
  ) {
    const album = new this.albumModel({
      title: createAlbumDto.title,
      artist: createAlbumDto.artist,
      createdDate: createAlbumDto.createdDate,
      image: file ? '/uploads/albums/' + file.filename : null,
    });
    return album.save();
  }
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.albumModel.findByIdAndDelete(id);
  }
}
