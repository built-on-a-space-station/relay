import { Channel } from '../channel';
import { Relay } from '../relay';

it('creates a default channel', () => {
	const relay = new Relay();

	relay.create('channel');

	expect(relay.channel('channel')).toBeInstanceOf(Channel);
});

it('adds a channel', () => {
	const relay = new Relay();
	const channel = new Channel('channel');

	relay.add(channel);

	expect(relay.channel('channel')).toBe(channel);
});

it('throws an error if a duplicate channel is added', () => {
	const relay = new Relay();

	const name = 'channel';

	relay.create(name);

	const channel = new Channel(name);

	expect(() => relay.add(channel)).toThrowError(/Channel already registered/);
});
