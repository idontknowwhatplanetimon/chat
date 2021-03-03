const express = require("express");
const path = require("path");
const session = require("express-session");
const passport = require("passport");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const db = require("./db");

const sessionMiddleware = session({ secret: "cats", resave: false, saveUninitialized: false });

const authenticate = require("./js/authenticate");
const registration = require("./js/registration");

app.set("view engine", "pug");

app.use(express.static(path.join(__dirname, "public")));
app.use(sessionMiddleware);

app.use("/", authenticate);
app.use("/signup", registration);

app.get("/", (req, res) => {
	res.render("index", { isLoggedIn: req.isLoggedIn });
});

app.get("/logout", function(req, res){
	req.logout();
	res.redirect("/");
});

app.get("/chat", (req, res) => {
	if (req.isLoggedIn) {
		db.messages.getAllMessages()
			.then(function(messages) {
				res.render("chat", { messages: messages });
			});
	} else {
		res.redirect("/");
	}
});

const wrap = middleware => (socket, next) => middleware(socket.request, {}, next);

io.use(wrap(sessionMiddleware));
io.use(wrap(passport.initialize()));
io.use(wrap(passport.session()));

io.on("connection", (socket) => {
	console.log("a user connected.");

	socket.on("chat message", (msg) => {
		console.log("message: " + msg);

		db.messages.insertMessage(msg, socket.request.user.username);
		io.emit("chat message", `${socket.request.user.username}: ${msg}`);
	});

	socket.on("disconnect", () => {
		console.log("user disconnected.");
	});
});

http.listen(3000, () => {
	console.log("Listening on port 3000");
});
