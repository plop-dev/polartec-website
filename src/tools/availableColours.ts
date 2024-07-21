interface Colour {
	name: string;
	hex: string;
	blackBorder?: boolean;
	default?: boolean;
	unavailable?: boolean;
}

const defExp: Colour[] = [
	{ name: 'White', hex: '#fff', blackBorder: true, default: true },
	{ name: 'Red', hex: '#be3b3b' },
	{ name: 'Black', hex: '#000' },
	{ name: 'Light-Green', hex: '#8cc379', blackBorder: true },
	{ name: 'Cloudy', hex: '#949DA0', blackBorder: true },
	{ name: 'Blue', hex: '#2182b3', unavailable: true },
];

export default defExp;
