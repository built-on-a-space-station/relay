# Relay

Relay makes it easy to share messages between parts of your application in a clean, reactive way.

The core of Relay is the `Relay` class, which is comprised of `Channels`. Observers can subscribe to individual events within channels. Channels can intercept and mutate events to keep the data flow clean.

## Basic Usage

```ts
const relay = new Relay();

const channel = relay.create('channel1');

const unsubscribe = channel.on('hello', () => console.log('I got called!'));

channel.send('hello');

// "I got called!"

unsubscribe();
```

Channels can also be created from scratch.

```ts
const channel = new Channel('mtv');

relay.add(channel);
```

## Sending Events

Send an event directly to a channel.

```ts
const channel = relay.channel('channel1');

channel.send('hello');
```

Alternatively, the relay can handle dispatching of events.

```ts
relay.send('hello').to('channel1');
```

## Broadcasts

You can send an event to every channel by broadcasting directly to the relay.

```ts
relay.broadcast('hello');
```

## Event Data Transformations

Channels can apply middleware to events. Combined with context, this allows you to purely transform data before it is consumed by listeners.

```ts
const store = { multiplier: 2 };

channel.context('store', () => store);

channel.use('hello', (count: number, { context }) => {
	const store = context('store');

	return count * store.multiplier;
});

const handler = (count: number) => {
	console.log(`I said "hello" ${count} times today!`);
};

channel.on('hello', handler);

channel.send('hello', 5);

// 'I said "hello" 10 times today!'
```

You can apply multiple middleware to a channel either by calling `channel.use(...)` multiple times or via chaining. Mutators are applied to the event data in the same order that they are registered on the channel.

## Event Forwarding

Sometimes you might want to capture an event in one channel and then forward it to another.

```ts
channel.forward('hello', { to: 'channel2' });
```

In this case, any middleware will first be applied to the event data. Oberservers for the "hello" event will be triggered in both the origin channel and the "channel2" channel.

You can rename the event sent to the channel as well.

```ts
channel.forward('hello', { to: 'channel2', as: 'hola' });
```

## Notes

And that's it (for now)!
