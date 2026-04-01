import * as readline from 'node:readline';
const { stdin: input, stdout: output } = require('node:process');
//example
// const genders : Choice[] = [
//     { label: 'Food', value: 'FOOD' },
//     { label: 'Transport', value: 'TRANSPORT' },
//     { label: 'Entertainment', value: 'ENTERTAINMENT' },
//     { label: 'Other', value: 'OTHER' },
// ]
export const openInterractionManager = () => {
    const rl = readline.createInterface({ input, output });
    const ask = async (question, option) => {
        const { defaultAnswer, validator } = option || {};
        return new Promise((resolve) => {
            rl.question(question + ` ${defaultAnswer ? '(' + defaultAnswer + ')' : ''}`, (answer) => {
                if (validator && !validator(answer)) {
                    console.log('Invalid input. Please try again.');
                    return resolve(ask(question, { defaultAnswer, validator }));
                }
                resolve(answer || defaultAnswer);
            });
        });
    };
    const choose = async (question, choices, optional = false) => {
        console.log(question);
        choices.forEach((choice) => {
            console.log(`${choice.value}. ${choice.label}`);
        });
        const choice = await ask('Please enter your choice:', { validator: (input) => {
                if (optional && input.trim() === '') {
                    return true; // Allow empty input if optional
                }
                return choices.some(choice => choice.value === input);
            } });
        return choices.find(c => c.value === choice);
    };
    const close = () => {
        rl.close();
    };
    return {
        ask,
        choose,
        close
    };
};
//# sourceMappingURL=interaction-manager.js.map