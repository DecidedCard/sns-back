import { IsIn, IsNumber, IsOptional } from 'class-validator';
import { numberValidationMessage } from '../validation-message/number-validation.message';
import { isInValidationMessage } from '../validation-message/isin-validation.message';

const IsInArg = ['ASC', 'DESC'];

export class BasePaginationDto {
  @IsNumber({}, { message: numberValidationMessage })
  @IsOptional()
  page?: number;

  @IsNumber({}, { message: numberValidationMessage })
  @IsOptional()
  where__id__less_than?: number;

  @IsNumber({}, { message: numberValidationMessage })
  @IsOptional()
  where__id__more_than?: number;

  @IsIn(IsInArg, { message: (arg) => isInValidationMessage(arg, IsInArg) })
  @IsOptional()
  order__createdAt: 'ASC' | 'DESC' = 'ASC';

  @IsNumber({}, { message: numberValidationMessage })
  @IsOptional()
  take: number = 20;
}
