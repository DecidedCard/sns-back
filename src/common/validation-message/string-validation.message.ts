import { ValidationArguments } from 'class-validator';

export const stringValidationMessage = (arg: ValidationArguments) => {
  return `${arg.property}는 String을 입력해주세요.`;
};
