import { MutatorFn } from './types';

export class Mutator {
	constructor(
		public readonly event: string,
		public readonly mutatorFn: MutatorFn,
	) {}
}
