import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Track, TrackDocument } from '../schemas/track.schema';
import { Model, Types } from 'mongoose';
import { CreateTrackDto } from './create-track.dto';
import { TokenAuthGuard } from '../token-auth/token-auth.guard';
import { RoleGuardGuard } from '../role-guard/role-guard.guard';

@Controller('tracks')
export class TracksController {
  constructor(
    @InjectModel(Track.name) private trackModel: Model<TrackDocument>,
  ) {}

  @Get()
  async getAll(@Query('album') album: string) {
    let tracks = [];
    if (album) {
      tracks = await this.trackModel.find({ album: new Types.ObjectId(album) });
    } else {
      tracks = await this.trackModel.find();
    }
    return tracks;
  }

  @UseGuards(TokenAuthGuard)
  @Post()
  create(@Body() createTrackDto: CreateTrackDto) {
    const track = new this.trackModel({
      title: createTrackDto.title,
      duration: createTrackDto.duration,
      album: createTrackDto.album,
    });
    return track.save();
  }
  @UseGuards(RoleGuardGuard)
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.trackModel.findByIdAndDelete(id);
  }
}
