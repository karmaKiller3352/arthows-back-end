import { extname } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { diskStorage } from 'multer';
import { v4 as uuid } from 'uuid';
import { HttpException, HttpStatus } from '@nestjs/common';

// Multer configuration
export const MULTER_CONFIG = {
  IMAGES: {
    dest: process.env.UPLOAD_LOCATION_IMAGES,
    fileSize: 2 * 1024 * 1024, // 2 MB
    fileTypes: /\/(jpg|jpeg|png|gif|)$/,
  },
  VIDEOS: {
    dest: process.env.UPLOAD_LOCATION_VIDEOS,
    fileSize: 20 * 1024 * 1024, // 20 MB
    fileTypes: /\/(mpg|mpeg|mp4|mov|wmv|avi|3gp)$/,
  },
  DOCS: {
    dest: process.env.UPLOAD_LOCATION_DOCS,
    fileSize: 5 * 1024 * 1024, // 2 MB
    fileTypes: /\/(rtf|vnd.openxmlformats-officedocument.wordprocessingml.document|msword|vnd.oasis.opendocument.text|pdf)$/,
  },
};

export const getUploadConfig = (TYPE: string) => ({
  limits: {
    fileSize: MULTER_CONFIG[TYPE].fileSize,
  },
  TYPE,
  fileFilter: (req: any, file: any, cb: any) => {
    if (file.mimetype.match(MULTER_CONFIG[TYPE].fileTypes)) {
      cb(null, true);
    } else {
      cb(
        new HttpException(
          `Unsupported file type ${extname(file.originalname)}`,
          HttpStatus.BAD_REQUEST,
        ),
        false,
      );
    }
  },
  storage: diskStorage({
    destination: (req: any, file: any, cb: any) => {
      const uploadPath = MULTER_CONFIG[TYPE].dest;
      if (!existsSync(uploadPath)) {
        mkdirSync(uploadPath);
      }
      cb(null, uploadPath);
    },
    filename: (req: any, file: any, cb: any) => {
      cb(null, `${uuid()}${extname(file.originalname)}`);
    },
  }),
});
