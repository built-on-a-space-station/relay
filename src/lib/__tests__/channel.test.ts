import { Channel } from '../channel';

it('initializes with the specified name', () => {
	const name = 'channel';

	const channel = new Channel(name);

	expect(channel.name).toBe(name);
});

it('subscribes to an event', () => {
	const channel = new Channel('test');

	const observer = jest.fn();

	channel.on('test-event', observer);
	channel.send('test-event', 'data');

	expect(observer).toHaveBeenCalledTimes(1);
	expect(observer).toHaveBeenCalledWith('data');
});

it('emits multiple events', () => {
	const channel = new Channel('test');

	const observer = jest.fn();

	channel.on('test-event', observer);

	[...Array(10)].forEach(() => {
		channel.send('test-event');
	});

	expect(observer).toHaveBeenCalledTimes(10);
});

it('unsubscribes', () => {
	const channel = new Channel('test');

	const observer = jest.fn();

	const unsubscribe = channel.on('test-event', observer);
	channel.send('test-event');

	expect(observer).toHaveBeenCalledTimes(1);

	unsubscribe();

	channel.send('test-event');

	expect(observer).toHaveBeenCalledTimes(1);
});

it('intercepts events', () => {
	const channel = new Channel('test');

	channel.use('test', (data: number) => {
		return data * 2;
	});

	const observer = jest.fn();

	channel.on('test', observer);
	channel.send('test', 5);

	expect(observer).toHaveBeenCalledTimes(1);
	expect(observer).toHaveBeenCalledWith(5 * 2);
});

it('supplies context to mutators', () => {
	const channel = new Channel('test');

	channel.context('multi', () => 3);

	channel.use('test', (data: number, { context }) => {
		const multiplier = context('multi');
		return data * multiplier;
	});

	const observer = jest.fn();

	channel.on('test', observer);
	channel.send('test', 5);

	expect(observer).toHaveBeenCalledTimes(1);
	expect(observer).toHaveBeenCalledWith(5 * 3);
});
