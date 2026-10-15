// The draft is a snake draft: round 1 goes 1,2,3,4 then round 2 goes 4,3,2,1.
// Everything here works on a plain object so it is easy to test.

function startDraft(teamIds, rounds) {
  return {
    teams: teamIds.map(String),
    rounds: rounds,
    pickNumber: 0,
    picks: [],
  };
}

function isDone(draft) {
  return draft.pickNumber >= draft.teams.length * draft.rounds;
}

// who is on the clock right now
function whoseTurn(draft) {
  if (isDone(draft)) {
    return null;
  }

  const teamCount = draft.teams.length;
  const round = Math.floor(draft.pickNumber / teamCount);
  const spot = draft.pickNumber % teamCount;

  // even rounds (0, 2, 4) go forward, odd rounds go backward
  if (round % 2 === 0) {
    return draft.teams[spot];
  }
  return draft.teams[teamCount - 1 - spot];
}

// tries to make a pick. gives back { error } or { draft }
function makePick(draft, teamId, playerId) {
  if (isDone(draft)) {
    return { error: "the draft is over" };
  }
  if (whoseTurn(draft) !== String(teamId)) {
    return { error: "it is not your turn" };
  }

  const alreadyTaken = draft.picks.some(function (pick) {
    return pick.player === String(playerId);
  });
  if (alreadyTaken) {
    return { error: "that player was already picked" };
  }

  const newPick = {
    team: String(teamId),
    player: String(playerId),
    number: draft.pickNumber + 1,
  };

  return {
    draft: {
      teams: draft.teams,
      rounds: draft.rounds,
      pickNumber: draft.pickNumber + 1,
      picks: draft.picks.concat([newPick]),
    },
  };
}

module.exports = { startDraft, whoseTurn, makePick, isDone };
