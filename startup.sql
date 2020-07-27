CREATE TABLE users (
	discord_id VARCHAR(255) PRIMARY KEY,
	level INTEGER NOT NULL,
	experience INTEGER NOT NULL
);

CREATE TABLE rarities (
	id SERIAL PRIMARY KEY,
	name VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE entities (
	id SERIAL PRIMARY KEY,
	name VARCHAR(255) NOT NULL UNIQUE,
	type VARCHAR(255) NOT NULL,
	rarity INTEGER REFERENCES rarities(id)
);

CREATE TABLE items (
	id SERIAL PRIMARY KEY,
	name VARCHAR(255) UNIQUE NOT NULL,
	type VARCHAR(255) NOT NULL,
	rarity INTEGER REFERENCES rarities(id)
);

CREATE TABLE inventory (
	user_fk VARCHAR(255) REFERENCES users(discord_id),
	item_fk INTEGER REFERENCES items(id)
);

CREATE TABLE equipment (
	user_fk VARCHAR(255) REFERENCES users(discord_id),
	head INTEGER REFERENCES items(id),
	chest INTEGER REFERENCES items(id),
	legs INTEGER REFERENCES items(id),
	feet INTEGER REFERENCES items(id),
	hands INTEGER REFERENCES items(id),
	left_hand INTEGER REFERENCES items(id),
	right_hand INTEGER REFERENCES items(id),
	earrings INTEGER REFERENCES items(id),
	necklace INTEGER REFERENCES items(id),
	ring_1 INTEGER REFERENCES items(id),
	ring_2 INTEGER REFERENCES items(id)
);



