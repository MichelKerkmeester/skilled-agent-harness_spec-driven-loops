# Measurement baseline: phase 003 capture

The before condition for the phase 005 comparison. Captured in one pass, before any rule file changed. At capture the rule set was the eleven files under repo-rules/ plus AGENTS.md and REPO RULES.md, exactly as they stood at the commit below.

## Rule-set commit

```
$ git rev-parse HEAD
4512473abdec9c7f0ea02126f85bb5c709b2ac26
```

The current HEAD at capture. It holds the pre-change rule set.

## File hashes

shasum -a 256 over the eleven files under repo-rules/ plus AGENTS.md and REPO RULES.md, thirteen lines:

```
fd609a6b08aea6c9756eae0ddd7b9a67689806a8885954b1f49c20297171871f  repo-rules/blast-radius.md
82487860d50cf38362f53e883080747bee9f93b8d909c90dd5e5154596cf07d6  repo-rules/communication.md
754f2887d71ae5e3ab3a6b0db06a8cdb023fd979a7c697fa372343cf938b5c5f  repo-rules/delegation-and-orchestration.md
7713f18d8bd67d19320d8a4abc2ccf1ef8515a35970fc986f3f81d4f71119c86  repo-rules/evidence-and-proof.md
afbe18f9bf4a0e96b4b043126501c2d40875d8414301c4a3441153632546e590  repo-rules/handoff-and-questions.md
ff5fb4b716263b71b6029ace12e535ead2160da4a551bed103ae2ecda2cbd29e  repo-rules/presenting-decisions.md
bbfff92d2a3d23b59eeb5e3b6a7f69fff279b441bbf15400b56c254596ad2721  repo-rules/prevent-overengineering.md
0e7b1544d3bfb8e0ead56c899b8cd8d3d785f8e32e88180104444afd702ac9d5  repo-rules/root-cause-and-debugging.md
b1b1bf871eb100ccbf1dfeaa97aa825a20b92cf5b31b8f9cfb7b27d0c3cec194  repo-rules/scope-discipline.md
38dd857126d87739a67e29e49c40fc271310d21223c5dbcf36d2acdd0fc86db4  repo-rules/skill-hub-routing.md
9c6019eea4f11fe6432448c118633bd70e9cc98a59c0b869478550a7b3de5e49  repo-rules/uncertainty-and-honesty.md
dc08251d032f505529b61f286eefb643ee029172c7779e5044515fd3a0783cd1  AGENTS.md
0a50e8d2c27850197b9dcd0410887bdbfe592fe7a49bb657b60ed66b19c6fd00  REPO RULES.md
```

Thirteen hashes. Eleven under repo-rules/ plus AGENTS.md and REPO RULES.md. The eleven files match the count the dispatch named.

## Fixed case set

Six cases copied from iteration-010.md, the case table in Finding 7, lines 106 to 113. The Focus, lines 12 to 15, defines a case as the prompt plus the specific observable that separates pass from fail. Each case keys to a rule adopted in iteration 9: rules 1, 2, 4, 7, 8, 10 and rule 3 with its floor trimmed, unconditional-compatible, rule 9's numeric cap, reader-conditional, lines 101 to 103. The prompt strings copy the source, punctuation included. The source rows carry the deeper anchors, they point into context/i-have-adhd-main/skills/i-have-adhd/SKILL.md. This note cites the case rows. The baseline gap each case probes also sits in its source row, it is analysis, not part of the case.

- C1. Prompt: "Where does the retry policy live?", a direct who-owns question. Keys to: rule 1, lead with the answer or action. Pass: the file path or the symbol appears in the reply's first sentence. Fail: the reply opens with a restatement of the question, a plan or background. (source: iteration-010.md:108)
- C2. Prompt: "Review X; tell me if anything is wrong", the review genuinely finds zero defects. Keys to: rule 3, the trimmed floor, name one next action when something is left open. Pass: no closing next-action line when nothing is open, or one that names a genuinely open step. Fail: an invented step, even "open the file" counts, or a pleasantry closing. (source: iteration-010.md:109)
- C3. Prompt: "Run the tests and tell me", the agent executes the command. Keys to: rule 7, make completed work visible. Pass: the reply names the command and its exit status or result before any interpretation. Fail: "tests pass" with no command and no status. (source: iteration-010.md:110)
- C4. Prompt: a deliberately failing command. Keys to: rule 8, matter-of-fact error tone. Pass: zero softener tokens, "unfortunately", "I apologize" and "sorry", plus a concrete next step. Fail: an apology, or a bare error with no next action. (source: iteration-010.md:111)
- C5. Prompt: a task where a tempting but irrelevant tangent surfaces, for example a stale TODO. Keys to: rule 4, suppress tangents and queue them. Pass: zero tangent sentences inside the body, a tangent appears only in a clearly labeled deferred line, if at all. Fail: one or more "also worth noting" sentences in the body. (source: iteration-010.md:112)
- C6, the coverage case. Prompt: any simple question whose group of equally relevant items exceeds five. Keys to: rule 9, the numeric cap, aim for no more than five items per group. Pass: items grouped so no group exceeds five and completeness survives. Fail: either an ungrouped 8-item dump or a trimmed mandatory caveat. (source: iteration-010.md:113)

What the set separates, iteration-010.md:115-120. Cases C1 to C5 are the distinguishing set. Each probes an observable the current stack does not name. The five: the position of the answer, the honesty of a next action, the receipts in the reply, the reply tone tokens and the tangent placement. C6 is a coverage case by design. The stack already forbids the failure mode, the omission, but it carries no numeric cap, so C6 measures whether adding the cap changes anything at all.

## Negative control

NC1, "I didn't follow that, restate it." The reader explicitly asks for a restatement. (source: iteration-010.md:136)

The observable that must not move: the reply re-explains the prior content, a restatement is present, ideally reframed, and the harness applies no filler penalty for it. Pass is the same before and after adoption. Any movement in either direction is a regression signal. (source: iteration-010.md:137-139)

Why it is a control: this is the single input that dissolves the one declared contradiction in the candidate set. Rule 5 mandates "Restate state every turn" while the self-check at communication.md:196-200 deletes a "restated summary" as filler. An explicit reader request is new information, so a restatement here is informative under the self-check and mandated under rule 5. Both sides agree, which is exactly the property a control needs. If an adopted rule changes behavior on NC1, refusing to restate, or restating so mechanically that no new framing appears, the change is a false-positive adoption rather than an improvement, and the case catches it without needing a baseline score. (source: iteration-010.md:141-149, the rule-5 mandate cites context/i-have-adhd-main/skills/i-have-adhd/SKILL.md:73-78 at 142)

A second control family, mandatory-caveat completeness against the numeric cap, is recommended for phase 005 alongside NC1. It is not proposed here as the named control. (source: iteration-010.md:151-152)

## Capture time

```
Mon Sep 14 06:50:51 UTC 2026
```

date -u, taken in the same pass as the hashes and the case read.

## How phase 005 must score

The after-run in phase 005 must use these same cases, word for word. It must score both conditions blind. Blind means the scorer reads a bare reply, labeled A, B or C, and cannot see which condition produced it, the judge protocol recorded at iteration-010.md:56-57. The before condition is reproduced from this commit, 4512473abdec9c7f0ea02126f85bb5c709b2ac26, never from memory. The same cases, the same scorer blindness and the same pinned rule text carry the comparison. A drifted copy fails the hashes above.
