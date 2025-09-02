import { ValidationArguments } from 'class-validator';

export const lengthValidationMessage = (arg: ValidationArguments) => {
  if (arg.constraints.length === 2) {
    return `${arg.property}는 ${arg.constraints[0]} ~ ${arg.constraints[1]}글자를 입력해주세요.`;
  } else {
    return `${arg.property}는 최소 ${arg.constraints[0]}글자를 입력해주세요.`;
  }
};
