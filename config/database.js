const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

module.exports = (settings) => {
	mongoose
		.connect(settings.db, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true })
		.catch((err) => {
			console.log("database ERROR");
			console.log(err);
		});
	let db = mongoose.connection;

	db.once("open", (err) => {
		if (err) {
			throw err;
		}
		
		db.dropDatabase("test");
		console.log("old DB dropped");
		console.log("MongoDB ready!");
		console.log(settings.db);
	});

	db.on("error", (err) => console.log(`Database error: ${err}`));
};
