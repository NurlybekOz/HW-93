import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ArtistDocument = Artist & Document;

@Schema()
export class Artist {
  @Prop({ required: true })
  name: string;

  @Prop()
  information: string;

  @Prop({ default: null, type: String })
  image: string | null;
}

export const ArtistSchema = SchemaFactory.createForClass(Artist);
