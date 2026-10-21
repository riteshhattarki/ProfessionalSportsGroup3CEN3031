const mongoose = require("mongoose");

const draftSchema = new mongoose.Schema({
  leagueId: { type: mongoose.Schema.Types.ObjectId, ref: "League", required: true, unique: true },
  teams: [String],
  rounds: { type: Number, required: true },
  pickNumber: { type: Number, default: 0 },
  picks: [
    {
      team: String,
      player: String,
      number: Number,
    },
  ],
});

module.exports = mongoose.model("Draft", draftSchema);
