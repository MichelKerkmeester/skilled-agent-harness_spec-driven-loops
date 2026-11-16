---
title: Deep Research Strategy - cross-cli-5 per-runtime delivery, follow-through and reader gaps
description: Segment-five cross-CLI lane on the built state after phases 016 to 033 at HEAD 84de3d600fa, reading the untuned 033 arm per runtime to separate runner artifacts from product gaps.
---

# Deep Research Strategy - cross-cli-5

## 1. OVERVIEW

### Purpose

Establish, per runtime, what the committed state after phases 016 to 033 still loses in command surfacing: whether the brief is delivered at all (claude, codex, opencode, pi, devin, dsh), whether the model follows the workflow it opens, and whether the measuring reader can see either fact. Phase 033 scored one untuned arm on five runtimes and returned `not shown`; this lane reads that evidence rather than rerunning it.

### Usage

- Reads the parent packet (`008-command-surfacing-build`), phases 016 to 033 and their scratch evidence, then the code at HEAD.
- Writes only inside this lineage directory.
- Reducer owns Sections 3, 6, 7-11A.

### Question Injection Surface

`inbox.jsonl` in this lineage directory if an external question appears.

---

## 2. TOPIC
SEGMENT FIVE, cross-CLI lane: on the built state after phases 016 to 033 at HEAD 84de3d600fa, which per-runtime delivery, follow-through and reader gaps still limit command surfacing on claude, codex, opencode, pi, devin and dsh?

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [x] (a) Why does the 033 untuned arm's follow-through vary so widely per runtime — claude 4 of 28 followed off and 6 of 28 on, opencode 11 of 28 and 13 of 28, pi 13 of 28 and 14 of 28, devin 24 of 28 twice, dsh 18 of 28 and 23 of 28 — and which part of each gap is a runner artifact rather than a product gap?
- [x] (b) OpenCode reads delivery unknown on 36 of 36 off runs and 44 of 44 on runs: what does that cost the arm's evidence, and is a prompt-free plugin receipt the smallest fix that moves those rows?
- [x] (c) Which runtimes still have a reader or attribution gap the arm cannot see — codex unmeasured under Q075, devin and dsh one unknown row each, opencode all unknown — and what file line proves each gap?
- [x] (d) The ask path put `/deep:review` in front of the refusal row fresh-decline-refusal-02 and dsh started `/create:sk-skill` on a decline row: what per-runtime surface decides whether an ask offer is representable, and which runtime's reader loses it?
- [x] (e) Which remaining cross-CLI gap ranks first by commands started when useful per unit of floor risk, and what measurement would confirm the fix on claude, codex, opencode, pi, devin and dsh?

<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS

- Re-ranking or re-deciding segment four's nine ranks (`research/research-segment-4.md` section 3) or earlier segments' dispositions, except where a segment-five number changes one, named with the rank and the number.
- Implementing any fix. Starting CLI, arena, daemon or model sessions. Running the 033 arm or any behaviour arm again.
- Hook latency, turn caps and brief byte cost as such: the `performance-5` lane owns those. Cited here only where a runtime difference explains a delivery or reader fact.
- Offer fit and decline/refusal safety policy as such: the `ux-5` lane owns those. Cited here only where a runtime's representation of an ask offer is the mechanism.
- Reading or printing holdout prompt text from any corpus file, or reading holdout-prompt files at all.
- Editing any tracked file outside this lineage directory. Spec.md write-back, resource-map emission and continuity save are deferred because each writes outside the lineage.

---

## 5. STOP CONDITIONS

- Max 8 iterations, convergence threshold 0.05 after the mandatory 3-iteration floor.
- Stop early only at legal convergence; record the reason in `research.md`.
- No writes outside this lineage directory. A scope decision reached at init: spec.md write-back, resource-map emission and continuity save are recorded as deferred rather than attempted.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- (a) Why does the 033 untuned arm's follow-through vary so widely per runtime — claude 4 of 28 followed off and 6 of 28 on, opencode 11 of 28 and 13 of 28, pi 13 of 28 and 14 of 28, devin 24 of 28 twice, dsh 18 of 28 and 23 of 28 — and which part of each gap is a runner artifact rather than a product gap?
- (b) OpenCode reads delivery unknown on 36 of 36 off runs and 44 of 44 on runs: what does that cost the arm's evidence, and is a prompt-free plugin receipt the smallest fix that moves those rows?
- (c) Which runtimes still have a reader or attribution gap the arm cannot see — codex unmeasured under Q075, devin and dsh one unknown row each, opencode all unknown — and what file line proves each gap?
- (d) The ask path put `/deep:review` in front of the refusal row fresh-decline-refusal-02 and dsh started `/create:sk-skill` on a decline row: what per-runtime surface decides whether an ask offer is representable, and which runtime's reader loses it?
- (e) Which remaining cross-CLI gap ranks first by commands started when useful per unit of floor risk, and what measurement would confirm the fix on claude, codex, opencode, pi, devin and dsh?

<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- reading the classifier before the numbers turned a spread into a definition. The 4-of-28 to 24-of-28 range looked like a behaviour difference until the helper showed that one pre-write read decides the path; after that the spread reads as access, which the step reader confirms is not completion. (iteration 1)
- reading the test beside the reader was decisive. A reader branch alone cannot move OpenCode's number while `command-offer.vitest.ts:259` asserts the unknown for a session that does hold the brief, so the fix has a second file and a second proof that a code-only reading would have missed. (iteration 2)
- reading the classifier first turned "almost no ask evidence" into a statement about accepted transcript shapes rather than a statement about model behaviour. Then decompressing the one dsh session settled the mechanism: the offer was declined twelve times and a different command started anyway, which separates representation from outcome in one file. (iteration 3)
- reading the offer-reached rule turned a reporting gap into a counterfactual gap. Before it, OpenCode's unknown looked like one blank column; after it, the unknown is shown to inflate the off arm's offer count to the on arm's level, which is a defect in the comparison rather than in a single cell. (iteration 4)
- reading the second start function paid off. The discrepancy between `startState` and `startedCommand` over a bare read is invisible in any printed table and changes what both numbers mean, so one function would have looked consistent while two disagreed. (iteration 5)
- joining the scorer's field rule to the per-runtime exit-code census produced a split no summary prints. The word "capped" looked like one quantity in eleven printed blocks; the census shows it is a wall-clock cap on one runtime and a missing exit code on another. (iteration 6)
- reading the call site rather than the function alone changed the limit line's scope. `replayOffer` looked like an off-arm backfill in the documentation; the call site shows it running unconditionally after every turn, which makes the on arm's offer field a replay too. (iteration 7)
- keeping the four instrument findings separate from the five answers made the order possible. Folding them into a question would have produced a list of six topics and no rank, because the instrument facts do not compete with the product facts for a place. (iteration 8)

<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- the first plan was to compare the arm's followed rate against the step reader as two measures of one quantity. They sample different rows and different stages, so the comparison had to be reframed as two measures of different things rather than a contradiction. (iteration 1)
- the first attempt to locate the devin and dsh unplaceable rows by scanning every run line for a missing `offeredCommand` returned 51 to 52 lines per runtime, which is the decline and must-not-start population, not the scored set. The scorer's own condition is the only reliable filter, so the finding rests on the accounting rule rather than a row identity. (iteration 2)
- the first plan was to count ask-policy rows and their outcomes as a rate. With one `asked` classification in 280 runs the rate would be a fiction, so the finding reports the counts instead. (iteration 3)
- the first draft of the rank used each runtime's start-rate delta as its gain column. Recomputing the intervals showed all five pairs overlap, so the rank had to be rebuilt on measurement restored instead, which is what the evidence supports. (iteration 4)
- the first attempt to identify the start rows by row id found none, because the rows are keyed by policy rather than by a `fresh-start-*` name. The policy key is the right handle and it is what `isStartRow` uses. (iteration 5)
- the first hypothesis was that every devin exit-null line was a restore fault. Checking `restored` on all 19 refuted it, since 17 of them are restored normally; the finding had to narrow to the missing exit code, which is the actual predicate. (iteration 6)
- the first search for pointer or leftover events returned nothing, which briefly read as a failed query. It is a true zero: no turn disturbed the pointer, so there was nothing to find. (iteration 7)
- the first draft of this close-out ranked the instrument items by how surprising they were. That is not a gain measure; the order was rebuilt on what each item restores to the published numbers. (iteration 8)

<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### A sixth answer question. The lane's five questions are answered; the four extra findings are measurement facts about the instrument, and folding them into a new question would hide that they were found while testing the answers. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: A sixth answer question. The lane's five questions are answered; the four extra findings are measurement facts about the instrument, and folding them into a new question would hide that they were found while testing the answers.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A sixth answer question. The lane's five questions are answered; the four extra findings are measurement facts about the instrument, and folding them into a new question would hide that they were found while testing the answers.

### Attributing dsh's decline-row start to a delivery or representation failure. The run line records the brief as delivered and the session records the offer as declined, so the mechanism is present and the outcome still violates the row. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Attributing dsh's decline-row start to a delivery or representation failure. The run line records the brief as delivered and the session records the offer as declined, so the mechanism is present and the outcome still violates the row.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Attributing dsh's decline-row start to a delivery or representation failure. The run line records the brief as delivered and the session records the offer as declined, so the mechanism is present and the outcome still violates the row.

### Comparing runtimes on start rate without naming the shape mix, while the shape vocabulary differs by runtime. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Comparing runtimes on start rate without naming the shape mix, while the shape vocabulary differs by runtime.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Comparing runtimes on start rate without naming the shape mix, while the shape vocabulary differs by runtime.

### Comparing the arm's followed rate with the step reader as two estimates of one quantity. They are not: one is pre-write access, the other is post-hoc step grading on a different row sample (the 20 `fresh-fit-*` rows, not the 28 paired rows). -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Comparing the arm's followed rate with the step reader as two estimates of one quantity. They are not: one is pre-write access, the other is post-hoc step grading on a different row sample (the 20 `fresh-fit-*` rows, not the 28 paired rows).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Comparing the arm's followed rate with the step reader as two estimates of one quantity. They are not: one is pre-write access, the other is post-hoc step grading on a different row sample (the 20 `fresh-fit-*` rows, not the 28 paired rows).

### Counting ask-policy rows that ended in prose questions without a `?`. The classifier requires the mark, so no such run can be recovered after the fact. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Counting ask-policy rows that ended in prose questions without a `?`. The classifier requires the mark, so no such run can be recovered after the fact.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Counting ask-policy rows that ended in prose questions without a `?`. The classifier requires the mark, so no such run can be recovered after the fact.

### Looking for a `pointerRestored` or `leftoverPaths` event in the logs to show a turn disturbing the pointer. No line carries either field, so no turn touched it. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: Looking for a `pointerRestored` or `leftoverPaths` event in the logs to show a turn disturbing the pointer. No line carries either field, so no turn touched it.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Looking for a `pointerRestored` or `leftoverPaths` event in the logs to show a turn disturbing the pointer. No line carries either field, so no turn touched it.

### Ranking by any per-runtime start delta. Recomputed intervals overlap for all five runtimes, so that column cannot carry an order. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: Ranking by any per-runtime start delta. Recomputed intervals overlap for all five runtimes, so that column cannot carry an order.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Ranking by any per-runtime start delta. Recomputed intervals overlap for all five runtimes, so that column cannot carry an order.

### Ranking by claimed start gain. No pair of per-runtime intervals separates, so the gain column cannot carry a rank. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Ranking by claimed start gain. No pair of per-runtime intervals separates, so the gain column cannot carry a rank.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Ranking by claimed start gain. No pair of per-runtime intervals separates, so the gain column cannot carry a rank.

### Reading the `capped` column as a wall-clock count on every runtime. On devin it is a missing-exit-code count. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Reading the `capped` column as a wall-clock count on every runtime. On devin it is a missing-exit-code count.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Reading the `capped` column as a wall-clock count on every runtime. On devin it is a missing-exit-code count.

### Reading the `offerUnknown: 1` on devin and dsh as a lost offer. The field is absent from the line; it is not a recorded non-offer. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Reading the `offerUnknown: 1` on devin and dsh as a lost offer. The field is absent from the line; it is not a recorded non-offer.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Reading the `offerUnknown: 1` on devin and dsh as a lost offer. The field is absent from the line; it is not a recorded non-offer.

### Reading the arm's per-runtime followed rate as a UX or fit measure. The classifier's contract and its helper both define it as a pre-write document read, so the label overstates what the number is. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Reading the arm's per-runtime followed rate as a UX or fit measure. The classifier's contract and its helper both define it as a pre-write document read, so the label overstates what the number is.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Reading the arm's per-runtime followed rate as a UX or fit measure. The classifier's contract and its helper both define it as a pre-write document read, so the label overstates what the number is.

### Reading the near-zero `asked` count as evidence that models do not ask. The classifier only accepts two transcript shapes, so the count measures representability at least as much as behaviour. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Reading the near-zero `asked` count as evidence that models do not ask. The classifier only accepts two transcript shapes, so the count measures representability at least as much as behaviour.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Reading the near-zero `asked` count as evidence that models do not ask. The classifier only accepts two transcript shapes, so the count measures representability at least as much as behaviour.

### Reading the off arm's offer field as counterfactual and the on arm's as observed. Both are replays; only the model's own line distinguishes them. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: Reading the off arm's offer field as counterfactual and the on arm's as observed. Both are replays; only the model's own line distinguishes them.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Reading the off arm's offer field as counterfactual and the on arm's as observed. Both are replays; only the model's own line distinguishes them.

### Searching for a scored-row field that records the restore fault. `restored` and `headMoved` exist on the run line and are never read by the scorer. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Searching for a scored-row field that records the restore fault. `restored` and `headMoved` exist on the run line and are never read by the scorer.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Searching for a scored-row field that records the restore fault. `restored` and `headMoved` exist on the run line and are never read by the scorer.

### Searching the run logs for a start-shape field. No such field exists in the line schema; only `changedPaths`, `offeredCommand`, `offeredPolicy`, `offeredAs`, `briefDelivered`, `restored` and `exit` are written. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Searching the run logs for a start-shape field. No such field exists in the line schema; only `changedPaths`, `offeredCommand`, `offeredPolicy`, `offeredAs`, `briefDelivered`, `restored` and `exit` are written.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Searching the run logs for a start-shape field. No such field exists in the line schema; only `changedPaths`, `offeredCommand`, `offeredPolicy`, `offeredAs`, `briefDelivered`, `restored` and `exit` are written.

### Searching the run logs for opencode rows that carry a delivery answer. All 80 lines read unknown by construction, so no per-row inspection can recover a delivery fact from them. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Searching the run logs for opencode rows that carry a delivery answer. All 80 lines read unknown by construction, so no per-row inspection can recover a delivery fact from them.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Searching the run logs for opencode rows that carry a delivery answer. All 80 lines read unknown by construction, so no per-row inspection can recover a delivery fact from them.

### Treating Codex as a sixth measured runtime. No row exists, and the gate that stops it is a runner refusal with an operator repair path, not a scoring gap. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Treating Codex as a sixth measured runtime. No row exists, and the gate that stops it is a runner refusal with an operator repair path, not a scoring gap.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating Codex as a sixth measured runtime. No row exists, and the gate that stops it is a runner refusal with an operator repair path, not a scoring gap.

### Treating opencode's `deliveryUnknown 44` as evidence that the plugin failed to emit. No reader exists to observe either outcome. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Treating opencode's `deliveryUnknown 44` as evidence that the plugin failed to emit. No reader exists to observe either outcome.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating opencode's `deliveryUnknown 44` as evidence that the plugin failed to emit. No reader exists to observe either outcome.

### Treating the arm's five-runtime comparison as holding the framework constant. It holds the arena's pointer constant and leaves the home file in place on one runtime. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: Treating the arm's five-runtime comparison as holding the framework constant. It holds the arena's pointer constant and leaves the home file in place on one runtime.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the arm's five-runtime comparison as holding the framework constant. It holds the arena's pointer constant and leaves the home file in place on one runtime.

### Treating the OpenCode receipt as a delivery-only improvement. It also changes which offers count as reached, because the tally reads the same field. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Treating the OpenCode receipt as a delivery-only improvement. It also changes which offers count as reached, because the tally reads the same field.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the OpenCode receipt as a delivery-only improvement. It also changes which offers count as reached, because the tally reads the same field.

### Treating the printed start rate as "the model took the workflow". A document read alone earns it, and on Claude an expansion the model never chose also earns it. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Treating the printed start rate as "the model took the workflow". A document read alone earns it, and on Claude an expansion the model never chose also earns it.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the printed start rate as "the model took the workflow". A document read alone earns it, and on Claude an expansion the model never chose also earns it.

### Treating the runner's `restore_failed` verdict as reaching the score. It does not: only `exit` is consulted. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Treating the runner's `restore_failed` verdict as reaching the score. It does not: only `exit` is consulted.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the runner's `restore_failed` verdict as reaching the score. It does not: only `exit` is consulted.

### Trying to recover a per-runtime brief effect from the `byPolicy` blocks. Five ask rows and ten start rows per runtime per arm leave nothing separable once the capped rows are removed. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Trying to recover a per-runtime brief effect from the `byPolicy` blocks. Five ask rows and ten start rows per runtime per arm leave nothing separable once the capped rows are removed.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Trying to recover a per-runtime brief effect from the `byPolicy` blocks. Five ask rows and ten start rows per runtime per arm leave nothing separable once the capped rows are removed.

<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- Comparing the arm's followed rate with the step reader as two estimates of one quantity. They are not: one is pre-write access, the other is post-hoc step grading on a different row sample (the 20 `fresh-fit-*` rows, not the 28 paired rows). (iteration 1)
- Reading the arm's per-runtime followed rate as a UX or fit measure. The classifier's contract and its helper both define it as a pre-write document read, so the label overstates what the number is. (iteration 1)
- Treating opencode's `deliveryUnknown 44` as evidence that the plugin failed to emit. No reader exists to observe either outcome. (iteration 1)
- Reading the `offerUnknown: 1` on devin and dsh as a lost offer. The field is absent from the line; it is not a recorded non-offer. (iteration 2)
- Searching the run logs for opencode rows that carry a delivery answer. All 80 lines read unknown by construction, so no per-row inspection can recover a delivery fact from them. (iteration 2)
- Treating Codex as a sixth measured runtime. No row exists, and the gate that stops it is a runner refusal with an operator repair path, not a scoring gap. (iteration 2)
- Attributing dsh's decline-row start to a delivery or representation failure. The run line records the brief as delivered and the session records the offer as declined, so the mechanism is present and the outcome still violates the row. (iteration 3)
- Counting ask-policy rows that ended in prose questions without a `?`. The classifier requires the mark, so no such run can be recovered after the fact. (iteration 3)
- Reading the near-zero `asked` count as evidence that models do not ask. The classifier only accepts two transcript shapes, so the count measures representability at least as much as behaviour. (iteration 3)
- Ranking by claimed start gain. No pair of per-runtime intervals separates, so the gain column cannot carry a rank. (iteration 4)
- Treating the OpenCode receipt as a delivery-only improvement. It also changes which offers count as reached, because the tally reads the same field. (iteration 4)
- Trying to recover a per-runtime brief effect from the `byPolicy` blocks. Five ask rows and ten start rows per runtime per arm leave nothing separable once the capped rows are removed. (iteration 4)
- Comparing runtimes on start rate without naming the shape mix, while the shape vocabulary differs by runtime. (iteration 5)
- Searching the run logs for a start-shape field. No such field exists in the line schema; only `changedPaths`, `offeredCommand`, `offeredPolicy`, `offeredAs`, `briefDelivered`, `restored` and `exit` are written. (iteration 5)
- Treating the printed start rate as "the model took the workflow". A document read alone earns it, and on Claude an expansion the model never chose also earns it. (iteration 5)
- Reading the `capped` column as a wall-clock count on every runtime. On devin it is a missing-exit-code count. (iteration 6)
- Searching for a scored-row field that records the restore fault. `restored` and `headMoved` exist on the run line and are never read by the scorer. (iteration 6)
- Treating the runner's `restore_failed` verdict as reaching the score. It does not: only `exit` is consulted. (iteration 6)
- Looking for a `pointerRestored` or `leftoverPaths` event in the logs to show a turn disturbing the pointer. No line carries either field, so no turn touched it. (iteration 7)
- Reading the off arm's offer field as counterfactual and the on arm's as observed. Both are replays; only the model's own line distinguishes them. (iteration 7)
- Treating the arm's five-runtime comparison as holding the framework constant. It holds the arena's pointer constant and leaves the home file in place on one runtime. (iteration 7)
- A sixth answer question. The lane's five questions are answered; the four extra findings are measurement facts about the instrument, and folding them into a new question would hide that they were found while testing the answers. (iteration 8)
- Ranking by any per-runtime start delta. Recomputed intervals overlap for all five runtimes, so that column cannot carry an order. (iteration 8)

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
[None yet]

<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[All tracked questions are resolved]

<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT

### Segment-five inputs already read at init

- Phase 033 arm evidence at HEAD `84de3d600fa`: pooled `gained=25 lost=15 ties=100 p=0.0769` over 5 runtimes and 140 paired rows; decline starts `dsh 1 of 16`, every other runtime `0 of 16`; skill-only starts `0 of 8` per runtime; delivery unknown `opencode 36 of 36 off` and `44 of 44 on`, `devin 1`, `dsh 1`, `claude 0`, `pi 0`; `mismatch 0`; floors `fixture combined 2 of 44` and `real 5 of 44`.
- Phase 033 scratch inventory: `arenas.txt`, `arm-evidence.txt`, `before.txt`, `devin-rebase-evidence.txt`, `dsh-head-move-evidence.txt`, `reruns.txt`, `runs/`, `smoke.txt`, `step-reader/`, `summary-arm.json`.
- The lineage containment baseline already captured five `033-untuned-arm-arena-run/scratch/step-reader/sessions/*.json` files and `brief.txt` / `pick.txt`, which suggests a model-reader (step-level) check exists at phase 033.
- Segment four (`research/research-segment-4.md`) section 3 ranked nine items; rank 3 is the OpenCode prompt-free delivery receipt and rank 4 is the OpenCode wall-clock cap. Both were left waiting on the operator.

### Bounded Context Snapshot

- Source pointers: `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/` (runner and scorer), `.opencode/plugins/system-skill-advisor.js`, `.skilled/skills/system-skill-advisor/runtime/lib/render.ts`, `.dsh/plugins/`, `.codex/README.md`, `INSTALL-SKILLED.md`.
- Reuse candidates: the committed capture and runner scripts; the phase 007 per-runtime proof harness; the 033 step-reader session files.
- Integration points: `briefDelivered` in `command-offer.mjs`, `CAP_MS` in `run-command-behaviour.mjs`, and each runtime's hook or plugin entry point.
- Constraints and risks: the arm ran at `b765c7a14c5`; HEAD is `84de3d600fa`, so any code reading must be date-checked against the arm commit. OpenCode's store is outside the repository.

---

## 13. RESEARCH BOUNDARIES
- Max iterations: 8
- Convergence threshold: 0.05
- Per-iteration budget: 24 tool calls, 10 minutes
- Progressive synthesis: true
- research.md ownership: workflow-owned canonical synthesis output inside this lineage
- Lifecycle branches: `resume`, `restart` (live); `fork`, `completed-continue` (deferred, not runtime-wired)
- Machine-owned sections: reducer controls Sections 3, 6, 7-11A
- Canonical pause sentinel: `.deep-research-pause`
- Current generation: 1
- Started: 2026-11-16T03:57:28.000Z
