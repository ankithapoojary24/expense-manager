import type {ValidatorFn} from './validator.type.js';

export const numberValidator: ValidatorFn = (inout: string) => {
    return !isNaN(+inout);
}