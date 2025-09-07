import { IsArray, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { stringValidationMessage } from 'src/common/validation-message/string-validation.message';

export class UpdatePOstImagesOpsDto {
  @IsOptional()
  @IsArray()
  add?: string[];

  @IsOptional()
  @IsArray()
  remove?: number[];
}

export class UpdatePostDto {
  @IsOptional()
  @IsString({ message: stringValidationMessage })
  title?: string;

  @IsOptional()
  @IsString({ message: stringValidationMessage })
  content?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => UpdatePOstImagesOpsDto)
  images?: UpdatePOstImagesOpsDto;
}
