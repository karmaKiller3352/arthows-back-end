import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CreateArticleDto, UpdateArticleDto } from './article.dto';
import { Article } from './article.schema';
import { ArticlesService } from './articles.service';

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articleService: ArticlesService) {}
  @Get()
  getAll(): Promise<Article[]> {
    return this.articleService.getAll();
  }

  @Get(':id')
  getOne(@Param('id') id: string): Promise<Article> {
    return this.articleService.getById(id);
  }

  @Post()
  create(@Body() createArticleDto: CreateArticleDto): Promise<Article> {
    return this.articleService.create(createArticleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<Article> {
    return this.articleService.remove(id);
  }

  @Put(':id')
  update(
    @Body() updateProductDto: UpdateArticleDto,
    @Param('id') id: string,
  ): Promise<Article> {
    return this.articleService.update(id, updateProductDto);
  }
}
