import { ValidationArguments } from 'class-validator';

export const numberValidationMessage = (arg: ValidationArguments) => {
  return `${arg.property}는 Number을 입력해주세요.`;
};
