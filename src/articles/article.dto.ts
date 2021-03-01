import { IsValueAlreadyExist } from 'src/validators/isAlreadyExist';
export class CreateArticleDto {
  @IsValueAlreadyExist() readonly title: string;
  readonly content: string;
  readonly seoTitle: string;
  readonly seoDescription: string;

  @IsValueAlreadyExist() readonly url: string;
}

export class UpdateArticleDto {
  readonly title: string;
  readonly content: string;
  readonly seoTitle: string;
  readonly seoDescription: string;
  readonly url: string;
}
