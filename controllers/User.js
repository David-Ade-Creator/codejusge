const User = require("../models/User");

module.exports = {
	create: async (req, res) => {
		try {
			const { username } = req.body;
			const AlreadyExistinguser = await User.findOne({username});

			if(AlreadyExistinguser) throw new Error("User Already exists");

			const newUser = await User.create({ username });
    
			return res.status(201).json(newUser);
		} catch (error) {
			res.status(400).json({
				status: "failure",
				reason: error.message || "Something went wrong",
			});
		}
	},

	find: async (req, res) => {
		const user = await User.find();
		res.send(user);
	},


	pending: async (req, res) => {
		try {
			var firstUser = req.params.userA;
			var secondUser = req.params.userB;

			var userA = await User.findOne({"username" : req.params.userA});
			var userB = await User.findOne({"username" : req.params.userB});
			if(!userA || !userB)
				throw new Error("Check if both users exits");
        
			if(userA.pendingRequests.indexOf(secondUser) > -1 ){
				userA.pendingRequests = userA.pendingRequests.filter(u => u !== secondUser);
				userB.friends.push(firstUser);
				userA.friends.push(secondUser);
				await userB.save();
				await userA.save();
				return res.status(202).json({
					status: "success",
				});
			}
			if (userB.pendingRequests.find((f) => f === firstUser)) {
				throw new Error(
					`User:${firstUser} has already sent request to User:${secondUser}`);
			}
			if (userB.friends.find((f) => f === firstUser)) {
				throw new Error(
					`User:${firstUser} is already a friend of  User:${secondUser}`);
			}
      
			userB.pendingRequests.push(firstUser);
			await userB.save();

			return res.status(202).json({
				status: "success",
			});
		} catch (error) {
			res.status(400).json({
				status: "failure",
				reason: error.message || "Something went wrong",
			});
		}
	
	},
	getPendingFriendRequests: async (req, res) => {
		try {
			var userA = await User.findOne({"username" : req.params.userA});
			if(!userA)
				return res.status(400).json({
					status: "failure",
					reason: "no user of this name",
				});
			if(userA.pendingRequests.length === 0)
				return res.status(404).json({
					status: "failure",
					reason: "no pending requests",
				});
			return res.status(200).json({
				friend_requests: userA.pendingRequests,
			});
		} catch (error) {
			res.status(400).json({
				status: "failure",
				reason: error.message || "Something went wrong",
			});
		}
	},
	getAllFriends: async (req, res) => {
		try {
			var userA = await User.findOne({"username" : req.params.userA});
			if (userA.friends.length === 0) {
				return res.status(404).json({
					status: "failure",
					reason: "no friends to show.",
				});
			}
			return res.status(200).json({
				friends: userA.friends,
			});
		} catch (error) {
			res.status(400).json({
				status: "failure",
				reason: error.message || "Something went wrong",
			});
		}
	},
	getSuggestionForFriends: async(req, res) => {
		try {
			var userA = await User.findOne({"username" : req.params.userA});
			if (userA.friends.length === 0) {
				return res.status(404).json({
					status: "failure",
					reason: "no friends to show.",
				});
			}

			for (const friend of userA.friends) {
				const user1 = await User.findOne({"username" : friend});
				for (const friend1 of user1.friends) {
					userA.suggestions.push(friend1);
					const user2 = await User.findOne({"username" : friend1});
					for (const friend2 of user2.friends) {
						userA.suggestions.push(friend2);
					}
				}
			}
      
			for (var i = 0; i <= userA.suggestions.length; i++ ){
				if(userA.suggestions[i] === userA.username)
					userA.suggestions.splice(i , 1);
			}
			
			const distinct = (value , index, self) => {
				return self.indexOf(value) === index;
			};
			userA.suggestions = userA.suggestions.filter(distinct);
      
			for(var j = 0; j < userA.suggestions.length; j++){
				for(var k= 0; k< userA.friends.length ;k++){
					if(userA.suggestions[j] === userA.friends[k])
						userA.suggestions.splice(j , 1);
				}
			}
			await userA.save();
			return res.status(200).json({
				suggestions: userA.suggestions,
			});
		} catch (error) {
			res.status(400).json({
				status: "failure",
				reason: error.message || "Something went wrong",
			});
		}
	}
};



