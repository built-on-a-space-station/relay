import { Invocation } from './types';

export class Subscription {
	constructor(
		public readonly event: string,
		public readonly invocation?: Invocation,
	) {}
}
