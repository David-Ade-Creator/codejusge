var express = require('express');
var router = express.Router();
const User = require("../controllers/User");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post("/create", User.create);
router.post("/add/:userA/:userB", User.pending);
router.get("/all", User.find);
router.get("/friendRequests/:userA", User.getPendingFriendRequests);
router.get("/friends/:userA", User.getAllFriends);
router.get("/suggestions/:userA", User.getSuggestionForFriends);


module.exports = router;
