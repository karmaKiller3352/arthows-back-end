import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Article, ArticleDocument } from './article.schema';
import { CreateArticleDto, UpdateArticleDto } from './article.dto';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectModel(Article.name) private articleModel: Model<ArticleDocument>,
  ) {}

  async getAll(): Promise<Article[]> {
    return this.articleModel.find().exec();
  }

  async getById(id: string): Promise<Article> {
    return this.articleModel.findById(id);
  }

  async create(articleDto: CreateArticleDto): Promise<Article> {
    const newArticle = new this.articleModel(articleDto);
    return newArticle.save();
  }

  async remove(id: string): Promise<Article> {
    return this.articleModel.findOneAndDelete({ _id: id });
  }

  async update(id: string, articleDto: UpdateArticleDto): Promise<Article> {
    return this.articleModel.findOneAndUpdate({ _id: id }, { ...articleDto });
  }
}
