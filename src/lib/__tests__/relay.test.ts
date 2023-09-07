import { Channel } from '../channel';
import { Relay } from '../relay';

it('creates a default channel', () => {
	const relay = new Relay();

	const channel = relay.create('channel');

	expect(channel).toBeInstanceOf(Channel);
	expect(relay.channel('channel')).toBeInstanceOf(Channel);
	expect(relay.channel('channel')).toBe(channel);
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

	const observer = jest.fn();

	relay.channel('channel').on('event', observer);

	relay.send('event').to('channel');

	expect(observer).toHaveBeenCalledTimes(1);
});

it('broadcasts events to every channel', () => {
	const relay = new Relay();

	relay.create('a');
	relay.create('b');

	const observerA = jest.fn();
	const observerB = jest.fn();

	relay.channel('a').on('test', observerA);
	relay.channel('b').on('test', observerB);

	relay.broadcast('test');

	expect(observerA).toHaveBeenCalledTimes(1);
	expect(observerB).toHaveBeenCalledTimes(1);
});

it('forwards an event to another channel', () => {
	const relay = new Relay();

	relay.create('a');
	relay.create('b');

	const observerA = jest.fn();
	const observerB = jest.fn();

	relay.channel('a').on('test', observerA);
	relay.channel('b').on('test', observerB);

	relay.channel('a').forward('test', { to: 'b' });

	relay.send('test').to('a');

	expect(observerA).toHaveBeenCalledTimes(1);
	expect(observerB).toHaveBeenCalledTimes(1);
});

it('renames forwarded events', () => {
	const relay = new Relay();

	relay.create('a');
	relay.create('b');

	const observerA = jest.fn();
	const observerB = jest.fn();

	relay.channel('a').on('test', observerA);
	relay.channel('b').on('cool', observerB);

	relay.channel('a').forward('test', { to: 'b', as: 'cool' });

	relay.send('test').to('a');

	expect(observerA).toHaveBeenCalledTimes(1);
	expect(observerB).toHaveBeenCalledTimes(1);
});
