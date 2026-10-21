const express = require("express");
const League = require("../models/League");
const Draft = require("../models/Draft");
const { requireLogin } = require("../middleware/auth");
const { startDraft, makePick } = require("../draft/draftState");
const { sendToLeague } = require("../socket");

const router = express.Router();

// POST /api/draft/:leagueId/start  (commissioner only)
router.post("/:leagueId/start", requireLogin, async function (req, res) {
  const league = await League.findById(req.params.leagueId);
  if (!league) {
    return res.status(404).json({ message: "league not found" });
  }
  if (String(league.commissioner) !== String(req.userId)) {
    return res.status(403).json({ message: "only the commissioner can start the draft" });
  }
  if (await Draft.findOne({ leagueId: league._id })) {
    return res.status(400).json({ message: "the draft was already started" });
  }

  const draft = startDraft(league.members, req.body.rounds || 10);
  const saved = await Draft.create({ leagueId: league._id, ...draft });

  sendToLeague(league._id, saved);
  res.status(201).json(saved);
});

// GET /api/draft/:leagueId
router.get("/:leagueId", requireLogin, async function (req, res) {
  const draft = await Draft.findOne({ leagueId: req.params.leagueId });
  if (!draft) {
    return res.status(404).json({ message: "the draft has not started yet" });
  }
  res.json(draft);
});

// POST /api/draft/:leagueId/pick
router.post("/:leagueId/pick", requireLogin, async function (req, res) {
  const { playerId } = req.body;
  if (!playerId) {
    return res.status(400).json({ message: "pick a player first" });
  }

  const saved = await Draft.findOne({ leagueId: req.params.leagueId });
  if (!saved) {
    return res.status(404).json({ message: "the draft has not started yet" });
  }

  // check the pick with the state machine
  const result = makePick(saved.toObject(), req.userId, playerId);
  if (result.error) {
    return res.status(400).json({ message: result.error });
  }

  saved.pickNumber = result.draft.pickNumber;
  saved.picks = result.draft.picks;
  await saved.save();

  sendToLeague(req.params.leagueId, saved);
  res.json(saved);
});

module.exports = router;
