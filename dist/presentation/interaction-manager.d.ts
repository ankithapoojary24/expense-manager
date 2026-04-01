export type ValidatorFn = (value: string) => boolean;
export interface AskOptions {
    defaultAnswer?: string | undefined;
    validator?: ValidatorFn | undefined;
}
export interface Choice {
    label: string;
    value: string;
}
export declare const openInterractionManager: () => {
    ask: (question: string, option?: AskOptions) => Promise<string | undefined>;
    choose: (question: string, choices: Choice[], optional?: boolean) => Promise<Choice | undefined>;
    close: () => void;
};
//# sourceMappingURL=interaction-manager.d.ts.map