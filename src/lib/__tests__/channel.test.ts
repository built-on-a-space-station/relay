import { Channel } from '../channel';

it('initializes with the specified name', () => {
	const name = 'channel';

	const channel = new Channel(name);

	expect(channel.name).toBe(name);
});

it('subscribes to an event', () => {
	const channel = new Channel('test');

	const listener = jest.fn();

	channel.on('test-event', listener);
	channel.send('test-event', 'data');

	expect(listener).toHaveBeenCalledTimes(1);
	expect(listener).toHaveBeenCalledWith('data');
});

it('emits multiple events', () => {
	const channel = new Channel('test');

	const listener = jest.fn();

	channel.on('test-event', listener);

	[...Array(10)].forEach(() => {
		channel.send('test-event');
	});

	expect(listener).toHaveBeenCalledTimes(10);
});

it('unsubscribes', () => {
	const channel = new Channel('test');

	const listener = jest.fn();

	const unsubscribe = channel.on('test-event', listener);
	channel.send('test-event');

	expect(listener).toHaveBeenCalledTimes(1);

	unsubscribe();

	channel.send('test-event');

	expect(listener).toHaveBeenCalledTimes(1);
});
