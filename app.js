const express = require("express");
const bodyParser = require("body-parser");
const graphqlHttp = require("express-graphql");
const mongoose = require("mongoose");
const path = require("path");
const PORT = process.env.PORT || 3001;

const apiSchema = require("./api/schema/index");
const apiResolvers = require("./api/resolvers/index");
const isAuth = require("./authentication/is-auth");

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Allow-Methods", "POST,GET,OPTIONS");
	res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
	if (req.method === "OPTIONS") {
		return res.sendStatus(200);
	}
	next();
});

app.use(isAuth);

app.use(
	"/graphql",
	graphqlHttp({
		schema: apiSchema,
		rootValue: apiResolvers,
		graphiql: true
	})
);

mongoose
	.connect(
		process.env.MONGODB_URI ||
			`mongodb+srv://${process.env.MONGO_USER}:${
				process.env.MONGO_PASSWORD
			}@cluster0-qftsl.mongodb.net/${process.env.MONGO_DB}?retryWrites=true`
	)
	.then(() => {
		useNewUrlParser: true;
		app.listen(PORT);
	})
	.catch(err => {
		console.log(err);
	});

if (process.env.NODE_ENV === "production") {
	app.use(express.static("client/build"));

	app.get("*", (req, res) => {
		res.sendFile(path.join(__dirname, "client", "build", "index.html")); // relative path
	});
}
