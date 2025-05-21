import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Album, AlbumDocument } from './album.schema';

export type TrackDocument = Track & Document;

@Schema()
export class Track {
  @Prop({ required: true })
  title: string;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: Album.name,
  })
  album: AlbumDocument;

  @Prop()
  duration: string;
}

export const TrackSchema = SchemaFactory.createForClass(Track);
