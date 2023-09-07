import { Middleware } from './middleware';
import { Relay } from './relay';
import { Subscription } from './subsciption';
import { Transfer } from './transfer';
import { Invocation, MutatorFn } from './types';

export class Channel {
	private _context: Map<string, () => any> = new Map();
	private _middleware: Middleware[] = [];
	private _name: string;
	private _relay?: Relay;
	private _subscriptions: Subscription[] = [];
	private _transfers: Transfer[] = [];

	constructor(name: string) {
		if (!name) {
			throw new Error('Channel must be created with a name');
		}

		this._name = name;
	}

	// Public methods

	on(event: string, invocation?: Invocation) {
		const subscription = new Subscription(event, invocation);
		this._subscriptions.push(subscription);

		const unsubscribe = () => {
			this.remove(subscription);
		};

		return unsubscribe;
	}

	send(event: string, data?: any) {
		const middleware = this._middleware.filter((mut) => mut.event === event);
		const context = (name: string) => this._context.get(name)?.();

		const final = middleware.reduce((acc, curr) => {
			const mutator = curr.mutatorFn;

			return mutator ? mutator(acc, { context }) : acc;
		}, data);

		for (const sub of this._subscriptions) {
			if (sub.event === event) {
				sub.invocation?.(final);
			}
		}

		for (const transfer of this._transfers) {
			if (transfer.event === event) {
				this._relay
					?.send(transfer.name || transfer.event, final)
					.to(transfer.channel);
			}
		}
	}

	use(event: string, mutatorFn: MutatorFn) {
		const middleware = new Middleware(event, mutatorFn);

		this._middleware.push(middleware);

		return this;
	}

	context(name: string, retriever: () => any) {
		if (this._context.has(name)) {
			throw new Error(`Context ${name} has already been declared`);
		}

		this._context.set(name, retriever);
	}

	forward(event: string, { as, to }: { to: string; as?: string }) {
		this._transfers.push(new Transfer(event, to, as));

		return this;
	}

	setRelay(relay: Relay) {
		this._relay = relay;
	}

	// Private methods

	private remove(subscription: Subscription) {
		this._subscriptions = this._subscriptions.filter(
			(sub) => sub !== subscription,
		);
	}

	// Accessors

	get name() {
		return this._name;
	}
}
