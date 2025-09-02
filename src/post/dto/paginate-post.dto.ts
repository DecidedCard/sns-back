import { IsNumber, IsOptional, IsString } from 'class-validator';
import { BasePaginationDto } from 'src/common/dto/base-pagination.dto';
import { numberValidationMessage } from 'src/common/validation-message/number-validation.message';
import { stringValidationMessage } from 'src/common/validation-message/string-validation.message';

export class PaginatePostDto extends BasePaginationDto {
  @IsNumber({}, { message: numberValidationMessage })
  @IsOptional()
  where__likeCount__more_than: number;

  @IsString({ message: stringValidationMessage })
  @IsOptional()
  where__title__i_like: string;
}
