const router = require("express").Router();
const { optionalAuth } = require("../middleware/auth");
const { chat, explainTopic, generateTopicQuiz } = require("../controllers/chatController");

router.post("/", optionalAuth, chat);
router.post("/explain", optionalAuth, explainTopic);
router.post("/quiz", optionalAuth, generateTopicQuiz);

module.exports = router;