import { ValidationArguments } from 'class-validator';

export const emailValidationMessage = (arg: ValidationArguments) => {
  return `${arg.property}에 올바른 이메일 형식을 입력해주세요.`;
};
