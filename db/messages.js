const { MongoClient, ObjectId } = require("mongodb");

const password = "kVa5YnvFWAb38NGV";
const dbName = "chat-webapp";
const uri = `mongodb+srv://pasha_admin:${password}@cluster-chat.6zt5f.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

exports.insertMessage = async function(message, username) {
	const client = new MongoClient(uri, {
		useNewUrlParser: true, useUnifiedTopology: true
	});

	try {
		await client.connect();

		const database = client.db(dbName);
		const collection = database.collection("messages");

		await collection.insertOne({ message: message, username: username }); 
	} finally {
		await client.close();
	}
}

exports.getAllMessages = async function() {
	const client = new MongoClient(uri, {
		useNewUrlParser: true, useUnifiedTopology: true
	});

	try {
		await client.connect();

		const database = client.db(dbName);
		const collection = database.collection("messages");

		const messages = await collection.find({}).toArray();

		return messages;
	} finally {
		await client.close();
	}
}
