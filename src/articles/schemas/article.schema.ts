import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ArticleDocument = Article & Document;

@Schema()
export class Article {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop()
  seoTitle: string;

  @Prop()
  seoDescription: string;

  @Prop({ required: true })
  url: string;
}

export const ArticleSchema = SchemaFactory.createForClass(Article);
