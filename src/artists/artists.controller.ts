import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Artist, ArtistDocument } from '../schemas/artist.schema';
import { Model } from 'mongoose';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateArtistDto } from './create-artist.dto';
import { TokenAuthGuard } from '../token-auth/token-auth.guard';
import { RoleGuardGuard } from '../role-guard/role-guard.guard';

@Controller('artists')
export class ArtistsController {
  constructor(
    @InjectModel(Artist.name) private artistModel: Model<ArtistDocument>,
  ) {}

  @Get()
  getAll() {
    return this.artistModel.find();
  }
  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.artistModel.find({ _id: id });
  }

  @UseGuards(TokenAuthGuard)
  @Post()
  @UseInterceptors(
    FileInterceptor('image', { dest: './public/uploads/artists' }),
  )
  create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createArtistDto: CreateArtistDto,
  ) {
    const artist = new this.artistModel({
      name: createArtistDto.name,
      information: createArtistDto.information,
      image: file ? '/uploads/artists/' + file.filename : null,
    });
    return artist.save();
  }
  @UseGuards(RoleGuardGuard)
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.artistModel.findByIdAndDelete(id);
  }
}
