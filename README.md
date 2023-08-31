# Relay

> If you don’t have somethin’ nice to say, don’t say nuthin’ at all.

Thumper's mom

Relay lets modules communicate with each other is a nice, simple way. You want to organize your code into distinct sections. Those sections should stick to what they do best.

```ts
const relay = new Relay();

relay.create('')

	// or
const channel = new Channel('something');
relay.add(channel);

channel.context('store', () => store)

channel.intercept('something').map((data, { event, get }) => {
	const store = get('store');
	// do stuff
	return newValue;
}).forward('event').to('other-channel')

constructor(Inject() relay) {
	this.connect(relay);
}

connect(relay) {
	const subscription = relay.channel('thing').on('event', (data) => {

	})
}
```

What should this do

1. Set up interceptors that can transform data
2. Use channels to keep things separate
