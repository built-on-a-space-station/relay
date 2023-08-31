# Relay

Relay makes it easy to share messages between parts of your application in a clean, reactive way.

The core of Relay is the `Relay` class, which is comprised of `Channels`. Observers can subscribe to individual events within channels. Channels can intercept and mutate events to keep the data flow clean.

## Basic Usage

```ts
const relay = new Relay();

relay.create('my channel');

const handler = () => {
	console.log('I got called!');
};

relay.channel('my channel').on('hello', handler);

relay.send('hello').to('my channel');

// "I got called!"
```
