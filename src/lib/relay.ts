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

	// Private methods

	private addChannel(name: string, channel: Channel) {
		if (this._channels.has(name)) {
			throw new Error(`Channel already registered: ${name}`);
		}

		this._channels.set(name, channel);
	}
}
