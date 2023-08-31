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

it('subscribes to channel events', () => {
	const relay = new Relay();
	relay.create('channel');

	const listener = jest.fn();

	relay.channel('channel').on('event', listener);

	relay.send('event').to('channel');

	expect(listener).toHaveBeenCalledTimes(1);
});

it('broadcasts events to every channel', () => {
	const relay = new Relay();

	relay.create('a');
	relay.create('b');

	const listenerA = jest.fn();
	const listenerB = jest.fn();

	relay.channel('a').on('test', listenerA);
	relay.channel('b').on('test', listenerB);

	relay.broadcast('test');

	expect(listenerA).toHaveBeenCalledTimes(1);
	expect(listenerB).toHaveBeenCalledTimes(1);
});
