import { Channel } from '../channel';

it('initializes with the specified name', () => {
	const name = 'channel';

	const channel = new Channel(name);

	expect(channel.name).toBe(name);
});
