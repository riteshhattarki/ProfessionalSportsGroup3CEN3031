
//These are the test cases we have to run. This is specifically for the round reversal logic because this is what majority of our project runs on
const test = require("node:test");
const assert = require("node:assert");
const { startDraft, whoseTurn, makePick, isDone } = require("./draftState");

test("first round goes in order", function () {
  let draft = startDraft(["a", "b", "c", "d"], 2);
  assert.strictEqual(whoseTurn(draft), "a");

  draft = makePick(draft, "a", "p1").draft;
  assert.strictEqual(whoseTurn(draft), "b");

  draft = makePick(draft, "b", "p2").draft;
  assert.strictEqual(whoseTurn(draft), "c");
});

test("second round runs backwards", function () {
  let draft = startDraft(["a", "b", "c", "d"], 2);
  draft = makePick(draft, "a", "p1").draft;
  draft = makePick(draft, "b", "p2").draft;
  draft = makePick(draft, "c", "p3").draft;
  draft = makePick(draft, "d", "p4").draft;

  // d picks again first, then c, b, a
  assert.strictEqual(whoseTurn(draft), "d");
  draft = makePick(draft, "d", "p5").draft;
  assert.strictEqual(whoseTurn(draft), "c");
  draft = makePick(draft, "c", "p6").draft;
  assert.strictEqual(whoseTurn(draft), "b");
  draft = makePick(draft, "b", "p7").draft;
  assert.strictEqual(whoseTurn(draft), "a");
});

test("third round goes forward again", function () {
  let draft = startDraft(["a", "b"], 3);
  const players = ["p1", "p2", "p3", "p4"];
  const order = ["a", "b", "b", "a"];
  for (let i = 0; i < 4; i++) {
    draft = makePick(draft, order[i], players[i]).draft;
  }
  assert.strictEqual(whoseTurn(draft), "a");
});

test("wrong team cannot pick", function () {
  const draft = startDraft(["a", "b"], 2);
  const result = makePick(draft, "b", "p1");
  assert.strictEqual(result.error, "it is not your turn");
});

test("same player cannot be picked twice", function () {
  let draft = startDraft(["a", "b"], 2);
  draft = makePick(draft, "a", "p1").draft;
  const result = makePick(draft, "b", "p1");
  assert.strictEqual(result.error, "that player was already picked");
});

test("draft ends after the last pick", function () {
  let draft = startDraft(["a", "b"], 1);
  draft = makePick(draft, "a", "p1").draft;
  draft = makePick(draft, "b", "p2").draft;
  assert.strictEqual(isDone(draft), true);
  assert.strictEqual(whoseTurn(draft), null);
  assert.strictEqual(makePick(draft, "a", "p3").error, "the draft is over");
});
