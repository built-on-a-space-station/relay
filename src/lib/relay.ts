import { Channel } from './channel';

export class Relay {
	private _channels: Map<string, Channel> = new Map();

	public add(channel: Channel) {
		this.addChannel(channel.name, channel);
	}

	public create(name: string) {
		this.addChannel(name, new Channel(name));
	}

	public channel(name: string) {
		return this._channels.get(name);
	}

	private addChannel(name: string, channel: Channel) {
		if (this._channels.has(name)) {
			throw new Error(`Channel already registered: ${name}`);
		}

		this._channels.set(name, channel);
	}
}
