export class Channel {
	private _name: string;

	constructor(name: string) {
		this._name = name;
	}

	// Public methods

	on(event: string, data?: any) {}

	// Accessors

	get name() {
		return this._name;
	}
}
