import type {ValidatorFn} from './validator.type';

export const numberValidator: ValidatorFn = (inout: string) => {
    return !isNaN(+input);
}