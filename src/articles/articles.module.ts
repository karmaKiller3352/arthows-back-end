import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ArticlesService } from './articles.service';
import { ArticlesController } from './articles.controller';
import { Article, ArticleSchema } from './article.schema';

@Module({
  providers: [ArticlesService],
  controllers: [ArticlesController],
  imports: [
    MongooseModule.forFeature([{ name: Article.name, schema: ArticleSchema }]),
  ],
})
export class ArticlesModule {}
