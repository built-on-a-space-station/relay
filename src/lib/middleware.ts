import { MutatorFn } from './types';

export class Middleware {
	constructor(
		public readonly event: string,
		public readonly mutatorFn?: MutatorFn,
	) {}
}
