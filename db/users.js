const { MongoClient, ObjectId } = require("mongodb");

const password = "kVa5YnvFWAb38NGV";
const dbName = "chat-webapp";
const uri = `mongodb+srv://pasha_admin:${password}@cluster-chat.6zt5f.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

exports.findByUsername = async function(username, cb) {
	const client = new MongoClient(uri, {
		useNewUrlParser: true, useUnifiedTopology: true
	});

	try {
		await client.connect();

		const database = client.db(dbName);
		const collection = database.collection("users");

		const query = { username: username };
		const user = await collection.findOne(query);

		user ? cb(null, user) : cb(null, null);
	} finally {
		await client.close();
	}
}

exports.findById = async function(id, cb) {
	const client = new MongoClient(uri, {
		useNewUrlParser: true, useUnifiedTopology: true
	});

	try {
		await client.connect();

		const database = client.db(dbName);
		const collection = database.collection("users");

		const query = { _id: new ObjectId(id) };
		const user = await collection.findOne(query);

		user ? cb(null, user) : cb(new Error("User with id: " + id + " does not exist."));
	} finally {
		await client.close();
	}
}

exports.insertUser = async function(user) {
	const client = new MongoClient(uri, {
		useNewUrlParser: true, useUnifiedTopology: true 
	});

	try {
		await client.connect();

		const database = client.db(dbName);
		const collection = database.collection("users");

		await collection.insertOne(user);
	} finally {
		await client.close();
	}
}
