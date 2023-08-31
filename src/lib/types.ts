export type Invocation = (...args: any[]) => any;

interface MutatorFnOptions {
	context: (name: string) => any;
}

export type MutatorFn = (data: any, { context }: MutatorFnOptions) => any;
