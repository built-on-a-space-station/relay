import { Channel } from './channel';

export class Relay {
	private _channels: Map<string, Channel> = new Map();

	// Public methods

	public add(channel: Channel) {
		this.addChannel(channel.name, channel);
	}

	public create(name: string) {
		this.addChannel(name, new Channel(name));
	}

	public channel(name: string): Channel {
		const channel = this._channels.get(name);

		if (!channel) {
			throw new Error(`Specified channel does not exist ${this.channel}`);
		}

		return channel;
	}

	public send(event: string, data?: any) {
		return new Transmitter(this, event, data);
	}

	public broadcast(event: string, data?: any) {
		this._channels.forEach((channel) => channel.send(event, data));
	}

	// Private methods

	private addChannel(name: string, channel: Channel) {
		if (this._channels.has(name)) {
			throw new Error(`Channel already registered: ${name}`);
		}

		this._channels.set(name, channel);
	}
}

class Transmitter {
	constructor(
		private relay: Relay,
		private event: string,
		private data?: any,
	) {}

	public to(channel: string) {
		this.relay.channel(channel).send(this.event, this.data);
	}
}
