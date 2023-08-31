import { Subscription } from './subsciption';
import { Invocation } from './types';

export class Channel {
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
		for (const sub of this._subscriptions) {
			if (sub.event === event) {
				sub.invocation(data);
			}
		}
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
