import { Mutator } from './mutator';
import { Subscription } from './subsciption';
import { Invocation, MutatorFn } from './types';

export class Channel {
	private _context: Map<string, () => any> = new Map();
	private _mutators: Mutator[] = [];
	private _name: string;
	private _subscriptions: Subscription[] = [];

	constructor(name: string) {
		if (!name) {
			throw new Error('Channel must be created with a name');
		}

		this._name = name;
	}

	// Public methods

	on(event: string, invocation: Invocation) {
		const subscription = new Subscription(event, invocation);
		this._subscriptions.push(subscription);

		return () => {
			this.remove(subscription);
		};
	}

	send(event: string, data?: any) {
		const mutators = this._mutators.filter((mut) => mut.event === event);
		const context = (name: string) => {
			return this._context.get(name)?.();
		};

		const final = mutators.reduce(
			(acc, curr) => curr.mutatorFn(acc, { context }),
			data,
		);

		for (const sub of this._subscriptions) {
			if (sub.event === event) {
				sub.invocation(final);
			}
		}
	}

	use(event: string, mutatorFn: MutatorFn) {
		this._mutators.push(new Mutator(event, mutatorFn));
	}

	context(name: string, retriever: () => any) {
		if (this._context.has(name)) {
			throw new Error(`Context ${name} has already been declared`);
		}

		this._context.set(name, retriever);
	}

	// Private methods

	remove(subscription: Subscription) {
		this._subscriptions = this._subscriptions.filter(
			(sub) => sub !== subscription,
		);
	}

	// Accessors

	get name() {
		return this._name;
	}
}
