import * as readline from 'node:readline';
import { stdin as input, stdout as output } from 'node:process';

export type ValidatorFn = (value : string) => boolean;

export interface AskOptions {
    defaultAnswer?: string|undefined; 
    validator?: ValidatorFn|undefined;
}

export interface Choice {
    label: string;
    value: string;
}
export const openInterractionManager = () => {
    const rl = readline.createInterface({ input, output });
    const ask :(question: string, option?: AskOptions) => Promise<string| undefined> = async (question:string, option?:AskOptions)=>{
    const { defaultAnswer, validator } = option || {};
        return new Promise((resolve) => {
            rl.question(question + ` ${defaultAnswer ? '(' + defaultAnswer + ')' : ''}`, (answer:string) => {
                if (validator && !validator(answer)) {
                    console.log('Invalid input. Please try again.');
                    return resolve(ask(question, { defaultAnswer, validator }));
                }
                resolve(answer || defaultAnswer);
            });
        });
    }
    const choose : (question:string, choices: Choice[],optional? : boolean) => Promise<Choice|undefined> = async (question:string, choices: Choice[], optional = false) => {
        console.log(question);
        choices.forEach((choice) => {
            console.log(`${choice.value}. ${choice.label}`);
        });
       const choice = await ask('Please enter your choice:', { validator: (input) => {
            if (optional && input.trim() === '') {
                return true; 
            }
            return choices.some(choice => choice.value === input);
        }});
        return choices.find(c =>c.value === choice);
    }
    const close = () => {
        rl.close();
    }
    return{
        ask,
        choose,
        close              
    }
}