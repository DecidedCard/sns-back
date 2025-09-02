import { ValidationArguments } from 'class-validator';

export const isInValidationMessage = (arg: ValidationArguments, isIn: any) => {
  return `${arg.property}는 ${isIn}을 입력해주세요.`;
};
