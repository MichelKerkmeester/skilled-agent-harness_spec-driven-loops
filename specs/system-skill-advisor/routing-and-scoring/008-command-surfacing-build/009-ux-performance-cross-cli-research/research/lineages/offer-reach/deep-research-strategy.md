---
title: "Deep Research Strategy - offer-reach lineage, segment two"
description: "Session tracking for the offer-reach lane of segment two: how often a plain chat request gets its command offered while false offers stay 0 of 35."
trigger_phrases:
  - "offer reach research strategy"
importance_tier: normal
contextType: planning
version: 1.14.0.19
---

# Deep Research Strategy - offer-reach

## 1. OVERVIEW

### Purpose

Persistent brain for the offer-reach lineage of segment two. It tracks what to investigate, what worked, what failed and where to focus next. Read by the reducer and by each iteration of this lineage.

### Usage

- **Init:** populated with the topic, key questions and boundaries from this lineage's config.
- **Per iteration:** this agent reads Next Focus, writes iteration evidence, and the reducer refreshes machine-owned sections.
- **Mutability:** analyst-owned sections stay stable; machine-owned sections are rewritten by the reducer after each iteration.

---

## 2. TOPIC
Find the next improvements to plain-chat command offering after phases 005, 006, 008 and 010 are built and phase 011 is in flight. The measured bottleneck is the offer rate, not obedience: the expected command was offered on 3 of 16 plain tune rows, /doctor:helper on 2 more, nothing on 11. Lane label `offer-reach`: hub mode vocabulary and deferral, a default command for a hub that defers, semantic lane weight and embedding text, the doctor family, and scoring thresholds. Floors that must not move: typed recall 24 of 44, false offers 0 of 35, scorer [159,50,20,5].

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [x] Which plain tune rows get no offer because a hub returns `defer` (or routes to a mode with no command), and what is the smallest rule that turns a deferring hub prompt into an offer without adding a false offer?
- [x] How much of the 3-of-16 plain offer rate is score placement (the command row or owner below the top-1 threshold) versus evidence absence (no lane, no phrase, no embedding text), measured per row?
- [x] What does the semantic lane contribute to the plain tune rows, and does a wording or weight change raise offers without moving the scorer floors?
- [x] Which doctor-family strings can ever score a document read, and how much plain recall is lost to the argued-route/document lookup rather than to scoring?
- [x] Which threshold or ranking constant could move the plain offer rate, and what is its measured risk to false offers 0 of 35 and typed recall 24 of 44?

<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS
- Re-recommending anything phases 005, 006, 008, 010 built, or anything phase 011 plans (typed 44 of 44 delivery, policy on hub-attached commands, visibility guard, hook health, brief cost script, command document path in the head, Gate 2 policy clause, embed deadline abort, spawn collapse, brief-cost/read-cost scripts, native-spelling column).
- Any change to code, commands, hooks or `AGENTS.md`; this lineage writes findings only, inside its own lineage directory.
- Reading or printing holdout prompt text; reading the tune and none rows is allowed, holdout counts only.
- Starting any model CLI session, arena or daemon, running ollama, or editing outside the lineage folder.

---

## 5. STOP CONDITIONS
- Convergence at newInfoRatio below 0.05 after minIterations 3.
- Hard cap at 4 iterations.
- Stop early only if the packet state is unreadable, which is an error status rather than convergence.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- Which plain tune rows get no offer because a hub returns `defer` (or routes to a mode with no command), and what is the smallest rule that turns a deferring hub prompt into an offer without adding a false offer?
- How much of the 3-of-16 plain offer rate is score placement (the command row or owner below the top-1 threshold) versus evidence absence (no lane, no phrase, no embedding text), measured per row?
- What does the semantic lane contribute to the plain tune rows, and does a wording or weight change raise offers without moving the scorer floors?
- Which doctor-family strings can ever score a document read, and how much plain recall is lost to the argued-route/document lookup rather than to scoring?
- Which threshold or ranking constant could move the plain offer rate, and what is its measured risk to false offers 0 of 35 and typed recall 24 of 44?

<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- reading the delivered `offeredCommand` beside the capture's `offered` flag exposed a measurement gap that would otherwise inflate every offer-rate claim; the pure compiled-route resolver then separated hub misses from attach misses without a daemon or a rebuild. (iteration 1)
- diffing the two captures row by row turned a headline "9 to 14" into a per-row fact, which is what showed the gain is orthogonal to the chat set; reading phase 003's summary recovered a measured alias regression that would otherwise have been re-proposed. (iteration 2)
- running the committed matcher was decisive — it showed the exact command was already ranked first on three rows, which turned a vague "doctor family" idea into a two-line change with a known firing gate. (iteration 3)
- the grep over the none prompts converted a judgment call into a count, and the canary read exposed the true cost of an sk-doc change (two artifacts, not one). (iteration 4)

<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- the capture script refuses to run because the advisor dist is stale, and this lineage may not rebuild; the committed baseline plus resolver were enough for route-level facts but not for score magnitudes. (iteration 1)
- the stand-in capture cannot expose cosine values, so the exact distance from 0.72 for each chat row stays unknown without a re-embed. (iteration 2)
- a defer-time offer looked attractive in iteration 1 but fails the near-miss as soon as it is checked; the depth gate only protects a single route. (iteration 3)
- the expected row gains remain inference because the dist is stale; the only honest claim is "each row has a named mechanism", not "each row will move". (iteration 4)

<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### A generic "problem" cue for the doctor helper row: the none row "what are the doctor commands actually used for" is a question about the family, and a bare problem word is the weak cue that already must not fire when a skill passes. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: A generic "problem" cue for the doctor helper row: the none row "what are the doctor commands actually used for" is a question about the family, and a bare problem word is the weak cue that already must not fire when a skill passes.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A generic "problem" cue for the doctor helper row: the none row "what are the doctor commands actually used for" is a question about the family, and a bare problem word is the weak cue that already must not fire when a skill passes.

### A second meaning lane with a lower cosine bar: it would spend false-offer risk on the doctor and speckit rows that already pass, not on the chat rows. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: A second meaning lane with a lower cosine bar: it would spend false-offer risk on the doctor and speckit rows that already pass, not on the chat rows.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A second meaning lane with a lower cosine bar: it would spend false-offer risk on the doctor and speckit rows that already pass, not on the chat rows.

### A single "one rule" for all 11 rows: the causes split across three layers (hub vocabulary, doctor cue/matcher, scorer anchors), and each layer has its own verification surface. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: A single "one rule" for all 11 rows: the causes split across three layers (hub vocabulary, doctor cue/matcher, scorer anchors), and each layer has its own verification surface.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A single "one rule" for all 11 rows: the causes split across three layers (hub vocabulary, doctor cue/matcher, scorer anchors), and each layer has its own verification surface.

### Adding a new doctor mode to the deep hub: the command row and the matcher entry already exist, so a mode would duplicate a working lookup. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Adding a new doctor mode to the deep hub: the command row and the matcher entry already exist, so a mode would duplicate a working lookup.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Adding a new doctor mode to the deep hub: the command row and the matcher entry already exist, so a mode would duplicate a working lookup.

### An `ask`-only default command on a deferring hub (finding 5): it would fire on the deep-loop near-miss where the hub legitimately has no mode. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: An `ask`-only default command on a deferring hub (finding 5): it would fire on the deep-loop near-miss where the hub legitimately has no mode.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: An `ask`-only default command on a deferring hub (finding 5): it would fire on the deep-loop near-miss where the hub legitimately has no mode.

### Asking the doctor helper handoff to cover doctor-deep-loop: the helper is chosen only for a "problem" prompt and the deep-loop row is a diagnostic request; extending the handoff would have to suppress the expected `/doctor:deep-loop`, which is worse. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Asking the doctor helper handoff to cover doctor-deep-loop: the helper is chosen only for a "problem" prompt and the deep-loop row is a diagnostic request; extending the handoff would have to suppress the expected `/doctor:deep-loop`, which is worse.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Asking the doctor helper handoff to cover doctor-deep-loop: the helper is chosen only for a "problem" prompt and the deep-loop row is a diagnostic request; extending the handoff would have to suppress the expected `/doctor:deep-loop`, which is worse.

### Editing the compiled policy snapshot by hand: the deriver/compiler owns it; only `hub-router.json` is authored. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Editing the compiled policy snapshot by hand: the deriver/compiler owns it; only `hub-router.json` is authored.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Editing the compiled policy snapshot by hand: the deriver/compiler owns it; only `hub-router.json` is authored.

### Folding the metadata re-embed into the same phase: it needs a capture this lineage cannot run and would hide the smaller items' measured gains. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Folding the metadata re-embed into the same phase: it needs a capture this lineage cannot run and would hide the smaller items' measured gains.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Folding the metadata re-embed into the same phase: it needs a capture this lineage cannot run and would hide the smaller items' measured gains.

### Lowering `COMMAND_MEANING_MIN_COSINE` (0.72) to lift the create rows: the misses are explicit-lane and hub decides, and the meaning lane needs the real embedder, so a lower bar spends false-offer risk without touching a hub `defer`. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Lowering `COMMAND_MEANING_MIN_COSINE` (0.72) to lift the create rows: the misses are explicit-lane and hub decides, and the meaning lane needs the real embedder, so a lower bar spends false-offer risk without touching a hub `defer`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Lowering `COMMAND_MEANING_MIN_COSINE` (0.72) to lift the create rows: the misses are explicit-lane and hub decides, and the meaning lane needs the real embedder, so a lower bar spends false-offer risk without touching a hub `defer`.

### Lowering `COMMAND_MEANING_MIN_COSINE` below 0.72: it cannot reach a row with no cosine evidence, and the 5 real-embedder gains are outside the chat set. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Lowering `COMMAND_MEANING_MIN_COSINE` below 0.72: it cannot reach a row with no cosine evidence, and the 5 real-embedder gains are outside the chat set.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Lowering `COMMAND_MEANING_MIN_COSINE` below 0.72: it cannot reach a row with no cosine evidence, and the 5 real-embedder gains are outside the chat set.

### Making `attachCommand` ignore `selectionKind` for a multi-target route: a bundle names several modes, so any single command would be a guess; that is exactly the defer case the hub reports. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Making `attachCommand` ignore `selectionKind` for a multi-target route: a bundle names several modes, so any single command would be a guess; that is exactly the defer case the hub reports.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Making `attachCommand` ignore `selectionKind` for a multi-target route: a bundle names several modes, so any single command would be a guess; that is exactly the defer case the hub reports.

### Raising the semantic lane weight: the lane is live at 0.05 and its gains are already counted; a weight change would reorder rows the floor depends on without adding evidence. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Raising the semantic lane weight: the lane is live at 0.05 and its gains are already counted; a weight change would reorder rows the floor depends on without adding evidence.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Raising the semantic lane weight: the lane is live at 0.05 and its gains are already counted; a weight change would reorder rows the floor depends on without adding evidence.

### Ranking a top-3 command row into the brief instead of the top skill: the renderer deliberately prints one top label plus a doctor companion, and phase 005 froze that head shape; a second arbitrary line is a new brief surface, not a scoring fix. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Ranking a top-3 command row into the brief instead of the top skill: the renderer deliberately prints one top label plus a doctor companion, and phase 005 froze that head shape; a second arbitrary line is a new brief surface, not a scoring fix.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Ranking a top-3 command row into the brief instead of the top skill: the renderer deliberately prints one top label plus a doctor companion, and phase 005 froze that head shape; a second arbitrary line is a new brief surface, not a scoring fix.

### Re-adding "persona file": measured regression in phase 003 (finding 4). -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Re-adding "persona file": measured regression in phase 003 (finding 4).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Re-adding "persona file": measured regression in phase 003 (finding 4).

### Shipping a phrase that was not grepped against the none set: the measurement is cheap and the floor is pinned at 0 of 35. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Shipping a phrase that was not grepped against the none set: the measurement is cheap and the floor is pinned at 0 of 35.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Shipping a phrase that was not grepped against the none set: the measurement is cheap and the floor is pinned at 0 of 35.

### Threshold tuning as a substitute for evidence: four of five rows are below top-3, so no threshold reaches them. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Threshold tuning as a substitute for evidence: four of five rows are below top-3, so no threshold reaches them.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Threshold tuning as a substitute for evidence: four of five rows are below top-3, so no threshold reaches them.

### Treating `/doctor:deep-loop` as a scoring problem: the matcher ranks it first at 16.249; the blocker is the cue gate, not the score. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Treating `/doctor:deep-loop` as a scoring problem: the matcher ranks it first at 16.249; the blocker is the cue gate, not the score.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating `/doctor:deep-loop` as a scoring problem: the matcher ranks it first at 16.249; the blocker is the cue gate, not the score.

### Treating `doctor-deep-loop` as a scoring miss: the deep hub declares no doctor mode, so there is no command candidate to rank. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Treating `doctor-deep-loop` as a scoring miss: the deep hub declares no doctor mode, so there is no command candidate to rank.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating `doctor-deep-loop` as a scoring miss: the deep hub declares no doctor mode, so there is no command candidate to rank.

### Treating the capture's `offered` as delivered: shown false on create-agent-01 in finding 1. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Treating the capture's `offered` as delivered: shown false on create-agent-01 in finding 1.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the capture's `offered` as delivered: shown false on create-agent-01 in finding 1.

<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- Asking the doctor helper handoff to cover doctor-deep-loop: the helper is chosen only for a "problem" prompt and the deep-loop row is a diagnostic request; extending the handoff would have to suppress the expected `/doctor:deep-loop`, which is worse. (iteration 1)
- Lowering `COMMAND_MEANING_MIN_COSINE` (0.72) to lift the create rows: the misses are explicit-lane and hub decides, and the meaning lane needs the real embedder, so a lower bar spends false-offer risk without touching a hub `defer`. (iteration 1)
- Making `attachCommand` ignore `selectionKind` for a multi-target route: a bundle names several modes, so any single command would be a guess; that is exactly the defer case the hub reports. (iteration 1)
- Ranking a top-3 command row into the brief instead of the top skill: the renderer deliberately prints one top label plus a doctor companion, and phase 005 froze that head shape; a second arbitrary line is a new brief surface, not a scoring fix. (iteration 1)
- Treating the capture's `offered` as delivered: shown false on create-agent-01 in finding 1. (iteration 1)
- A second meaning lane with a lower cosine bar: it would spend false-offer risk on the doctor and speckit rows that already pass, not on the chat rows. (iteration 2)
- Lowering `COMMAND_MEANING_MIN_COSINE` below 0.72: it cannot reach a row with no cosine evidence, and the 5 real-embedder gains are outside the chat set. (iteration 2)
- Raising the semantic lane weight: the lane is live at 0.05 and its gains are already counted; a weight change would reorder rows the floor depends on without adding evidence. (iteration 2)
- Re-adding "persona file": measured regression in phase 003 (finding 4). (iteration 2)
- Threshold tuning as a substitute for evidence: four of five rows are below top-3, so no threshold reaches them. (iteration 2)
- Treating `doctor-deep-loop` as a scoring miss: the deep hub declares no doctor mode, so there is no command candidate to rank. (iteration 2)
- A generic "problem" cue for the doctor helper row: the none row "what are the doctor commands actually used for" is a question about the family, and a bare problem word is the weak cue that already must not fire when a skill passes. (iteration 3)
- Adding a new doctor mode to the deep hub: the command row and the matcher entry already exist, so a mode would duplicate a working lookup. (iteration 3)
- An `ask`-only default command on a deferring hub (finding 5): it would fire on the deep-loop near-miss where the hub legitimately has no mode. (iteration 3)
- Treating `/doctor:deep-loop` as a scoring problem: the matcher ranks it first at 16.249; the blocker is the cue gate, not the score. (iteration 3)
- A single "one rule" for all 11 rows: the causes split across three layers (hub vocabulary, doctor cue/matcher, scorer anchors), and each layer has its own verification surface. (iteration 4)
- Editing the compiled policy snapshot by hand: the deriver/compiler owns it; only `hub-router.json` is authored. (iteration 4)
- Folding the metadata re-embed into the same phase: it needs a capture this lineage cannot run and would hide the smaller items' measured gains. (iteration 4)
- Shipping a phrase that was not grepped against the none set: the measurement is cheap and the floor is pinned at 0 of 35. (iteration 4)

<!-- /ANCHOR:ruled-out-directions -->

---

<!-- ANCHOR:divergence-frontier -->
## 10A. SATURATED DIRECTIONS AND DIVERGENCE FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

<!-- /ANCHOR:divergence-frontier -->

---

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. CARRIED-FORWARD OPEN QUESTIONS
- Does a widened alias set keep false offers at 0 of 35 on the none rows, measured rather than reasoned? (iteration 1)
- How much of the remaining gap is score placement versus evidence absence on the 5 rows whose top skill is not the owner (create-command, create-goal, create-manual-playbook, deep-review, doctor-deep-loop)? (iteration 1)
- Can the doctor family gain a deep-loop diagnostic route without breaking the deep hub's defer contract? (iteration 2)
- Which of the proposed explicit anchors can be added without moving any none row, and what is each anchor's measured tune gain in the stand-in capture? (iteration 2)
- What is the measured row gain of the sk-doc alias and explicit-anchor proposals in the stand-in capture, and do any of them move a none row? (iteration 3)
- How should the recommendations be ranked by gain per unit of risk, and which are safe to commit as one phase? (iteration 3)
- Do the five recommendations move their named rows in a real capture, and does any unseen paraphrase reach a none row? (iteration 4)
- Which item does the operator want first if only one phase is funded: the data-only hub pair or the code-level doctor pair? (iteration 4)

<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[All tracked questions are resolved]

<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT

Segment one synthesis (`../009-ux-performance-cross-cli-research/research/research.md`) ranked 14 items; ranks 1-6 and 10 became phase 010, and phase 011 builds rank 9 (second half), rank 12 and two items of rank 14, and explicitly defers rank 7, 8, 11 and 13. The offer bottleneck is new information from the after arm, not from segment one: segment one measured no offer at all before phase 005 and could not see offer rate.

Known surfaces for this lane:
- Hub compiled routes: `.skilled/bin/compiled-route.cjs`, hub manifests under `.skilled/skills/system-deep-loop/` and `.skilled/skills/*/ROUTER.md`, `ADV/lib/compiled-routing-flag.ts`.
- Command attach: `ADV/lib/command-attach.ts` (`MODE_COMMANDS`, `attachCommand`, depth gate, `commandRowFor`).
- Scorer: `ADV/lib/scorer/lanes/explicit.ts` (`PHRASE_BOOSTS`, owner/row ordering), `ADV/lib/scorer/fusion.ts`, `ADV/lib/scorer/scoring-constants.ts`, `ADV/lib/scorer/lanes/semantic-shadow.ts`.
- Corpus and captures: `ADV/scripts/routing-accuracy/command-prompts.jsonl` (tune/none rows readable, holdout counts only), `capture-command-routing-baseline.mjs` (plain recall 9/45 phrases, 14/45 real embedder), `score-command-transcripts.mjs`, `run-command-behaviour.mjs`.
- After-arm logs: `007-per-runtime-behaviour-proof/scratch/runs-pre-final.jsonl` and `runs-post-final.jsonl`, with `offeredCommand`/`offeredPolicy` per line.

---

## 13. RESEARCH BOUNDARIES
- Max iterations: 4
- Convergence threshold: 0.05
- Per-iteration budget: 24 tool calls, 10 minutes
- Progressive synthesis: true
- research.md ownership: this lineage writes its own `research.md` as the workflow synthesis output; the parent merge owns the merged file
- Lifecycle branches: `resume`, `restart` (live); `fork`, `completed-continue` (deferred)
- Machine-owned sections: reducer controls Sections 3, 6, 7-11A
- Canonical pause sentinel: `.deep-research-pause`
- Current generation: 1
- Started: 2026-11-13T10:00:00.000Z
