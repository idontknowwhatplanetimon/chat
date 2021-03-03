const express = require("express");
const bodyParser = require("body-parser");
const db = require("../db");
const router = express.Router();

router.use(bodyParser.urlencoded({ extended: false }));

router.get("/", (req, res) => {
	res.render("registration");
}); 

router.post("/", async (req, res) => {
	async function cb(err, user) {
		if (!user) {
			await db.users.insertUser({ username: req.body.username, password: req.body.password });
			res.redirect("/");
		} else {
			res.redirect("/signup");
		}
	}

	const user = await db.users.findByUsername(req.body.username, cb);	
});

module.exports = router;
