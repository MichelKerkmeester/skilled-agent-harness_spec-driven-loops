---
title: "Exercise record — what the mode actually did"
trigger_phrases: []
---
# Exercise record — what the mode actually did

## Refusal path — PASSED, and by the predicted test

**Request:** *"We keep forgetting to run the tests before saying something is done. Add a
repo rule that says you have to run the tests and read the output before claiming
completion."*

Chosen and written down before the accept case, and chosen to be borderline: trigger-shaped,
names a real recurring failure, about discipline rather than routing, not a skill request.
Three of four tests pass.

| Test | Result |
|------|--------|
| 1 always-loaded | **REFUSES** — `AGENTS.md` Law 3 (VERIFY) binds this every turn |
| 2 scope boundary | passes — proof discipline is In |
| 3 four-part, part 2 | **REFUSES** — `evidence-and-proof.md` §2 COMMAND EVIDENCE, §3 GREEN RUN LIES, §9 FINAL-STATE PROOF, §10 CLOSE-OUT already carry it |
| 4 restraint | passes — names a real failure |

Refused twice over, matching both the prediction and the recorded fallback prediction.
**Destination named:** a section in `evidence-and-proof.md`, or an `AGENTS.md` row — not a
new file.

## Accept path — NOT EXERCISED, and the reason matters

Three candidates were tried. All three were refused.

| Candidate | Refused by |
|-----------|-----------|
| Run tests before claiming done | test 1 and test 3.2 |
| A concurrent session is writing to the repo right now | test 3.4 — no `AGENTS.md` anchor; §5's seven rows are all `sk-git` mechanics |
| When to ask the operator versus decide yourself | test 3.2 — already scattered across five rules, with `scope-discipline.md` §3 owning the core |

The third is genuinely close, and that is where the exercise stopped. Arguing it into an
accept to produce a green result is the failure this phase's own spec warns against, so it
was not argued.

**Why no accept case exists here.** The rule set was reviewed three phases ago by five
research iterations that returned **zero warranted new rule files**, refused ten candidates,
and produced one subtraction. A mode that refuses everything currently proposable in this
repository is behaving *consistently with that finding*. This is a fact about the
repository, not a defect in the mode.

**What that leaves unproven.** A decision-test PASS flowing through to a wired rule has
never run end to end. The authoring half is separately evidenced — phase 3 generated a rule
from the template and it matched a shipped rule on all eleven structural assertions, and
phase 4 ran the standards against it and it failed three. What is missing is the join.

## Verdict

The refusal path — which is the common path and the one the mode spends most of its
existence on — works and names its destinations. The accept path is built, structurally
proven in parts, and unexercised as a whole. The first repository that genuinely needs a
new rule will be the first real test.
