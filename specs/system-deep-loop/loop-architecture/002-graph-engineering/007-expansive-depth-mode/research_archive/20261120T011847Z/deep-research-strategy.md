---
title: Deep Research Strategy - expansive-depth sub-mode, generation 2
description: Session tracking for the generation-2 extension of the expansive-depth sub-mode research (5 iterations, cli-devin swe-2-max).
trigger_phrases:
  - "expansive depth mode"
  - "deep research strategy"
importance_tier: normal
contextType: planning
---

# Deep Research Strategy - Session Tracking

## 1. OVERVIEW

### Purpose

Persistent brain for generation 2 of the expansive-depth research. Records what to investigate, what worked, what failed, and where to focus next.

### Question Injection Surface

Append external questions to `research/inbox.jsonl`, one JSON object per line with `id`, `text`, `source`, `origin` (`angle-bank`, `analyst-strategy`, `operator`, `legacy-import`), `injectedAtIteration` and `promotedQuestionId`. Inbox rows are immutable input, the reducer registry is canonical question state, and Section 3 is rendered from the registry.

---

## 2. TOPIC
Generation 2 extension of the expansive-depth sub-mode research for system-deep-loop deep-research and deep-review. Generation 1 (7 iterations, archived at `specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/research_archive/20261117T103614Z/research.md`) designed an opt-in `--depth-mode=expansive` frontier sub-mode and registered defects D1-D9. This generation verifies and deepens it: adversarial verification of the design and D1-D9, the generation-1 open questions, further narrowness causes generation 1 missed, and a concrete, testable implementation slice plan.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [ ] Q1: Adversarially verify the generation-1 design (§8, §10 of the archived research.md) and defects D1-D9 against the current code. Which claims hold, which are wrong or overstated, and what are the corrected statements with file:line evidence?
- [x] Q2: On the review side, how do divergent-review-pivot.ts, the deep-review reducer, the review prompt pack and fanout-merge.cjs internals keep review runs narrow, and what does the frontier sub-mode need to change there that generation 1 did not map?
- [x] Q3: How many extra iterations does a divergent pivot after all_questions_answered actually buy (trace the code path end to end), and what is the honest fix for D1: who should produce coverage-graph quality_class, from what closed vocabulary, enforced where?
- [ ] Q4: For example target 2 (skill-advisor auto-utilization while chatting), what do the scorer (df-idf.ts and its callers) and the prompt-policy gate actually do with casual chat prompts, and does the generation-1 frontier decomposition for that target survive contact with the code?
- [x] Q5: Turn the generation-1 recommendations into concrete, independently shippable change slices: for each slice the files, the behavior change, the tests that prove it (existing and new), the default-path risk, and the ordering dependencies.
- [x] Q6: Design completed-run extension for deep-research and deep-review. Today a completed packet halts (step_classify_session on_completed_session) and the completed-continue lineage mode is deferred, so the only way to add iterations is --restart, which archives the registry, strategy and questions. How should an in-place extension work (completed-continue or an --extend=N flag): which config fields change, which ledger event records it, how the reducer, convergence floor and synthesis treat pre- and post-extension iterations, and which files and tests change?

<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS
- No implementation or runtime code edits; research only.
- Do not redo generation 1's diagnosis from scratch; verify and extend it.
- Do not design a replacement for the existing deep-loop logic; the sub-mode stays additive and opt-in.

---

## 5. STOP CONDITIONS
- All five iterations run (stopPolicy max-iterations; convergence is telemetry only).
- Halt early only on executor failure, three consecutive failed iterations, or an operator pause.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- Q2: On the review side, how do divergent-review-pivot.ts, the deep-review reducer, the review prompt pack and fanout-merge.cjs internals keep review runs narrow, and what does the frontier sub-mode need to change there that generation 1 did not map?
- Q3: How many extra iterations does a divergent pivot after all_questions_answered actually buy (trace the code path end to end), and what is the honest fix for D1: who should produce coverage-graph quality_class, from what closed vocabulary, enforced where?
- Q5: Turn the generation-1 recommendations into concrete, independently shippable change slices: for each slice the files, the behavior change, the tests that prove it (existing and new), the default-path risk, and the ordering dependencies.
- Q6: Design completed-run extension for deep-research and deep-review. Today a completed packet halts (step_classify_session on_completed_session) and the completed-continue lineage mode is deferred, so the only way to add iterations is --restart, which archives the registry, strategy and questions. How should an in-place extension work (completed-continue or an --extend=N flag): which config fields change, which ledger event records it, how the reducer, convergence floor and synthesis treat pre- and post-extension iterations, and which files and tests change?

<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- pairing each generation-1 file:line citation with a targeted grep/read verified six defects in ~9 research calls; the live projection probe settled D7 and D9 with zero extra cost by folding the check into the mandatory gateway call. (iteration 1)
- reading the adapter file in full before tracing callers exposed the seed-regeneration asymmetry (`keyFindings.slice(-3)`) that the yield question actually hinges on; targeted greps then priced the caps (`maxPivots`, `maxCouncilSeatOutputs`, the exclusion list) instead of reading two more large files. (iteration 2)
- reading the adapter file in full first exposed the single-trigger guard and the closed seed vocabulary, which made the `missingDimensions` vs `buildDimensionCoverage` asymmetry (finding 1) visible the moment the convergence side was read — a cross-file invariant check rather than a per-file summary. (iteration 3)
- the four prior iterations' file:line-grounded findings made the slice plan an assembly task rather than a research task; one glob over the existing vitest tree grounded every "tests that prove it" cell instead of guessing suite names. (iteration 5)

<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- nothing failed; D4/D8 were consciously deferred as cheaper tails than the verified set. (iteration 1)
- nothing failed; the grep for pivot caps in `divergent-pivot.cjs` came back nearly empty because the limits live in the `.ts` lib — the second grep against the lib recovered them in one call. (iteration 2)
- nothing failed; the review reducer's location inside the shared `reduce-state.cjs` was already known from generation 1, so no time was lost locating it. (iteration 3)
- nothing failed. Q4 remains genuinely open — one iteration cannot both plan the slices and trace a new subsystem; the residual note names the four reads a follow-up needs. (iteration 5)

<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### "Pivot buys ~1 iteration" as a general claim — contradicted by the re-fire mechanics: `all_questions_answered` persists after a pivot (no new questions are added), every later stop re-enters the branch, and the lifetime cap is `maxPivots: 3`, not 1. The claim survives only at trigger iteration = `maxIterations − 1`. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: "Pivot buys ~1 iteration" as a general claim — contradicted by the re-fire mechanics: `all_questions_answered` persists after a pivot (no new questions are added), every later stop re-enters the branch, and the lifetime cap is `maxPivots: 3`, not 1. The claim survives only at trigger iteration = `maxIterations − 1`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "Pivot buys ~1 iteration" as a general claim — contradicted by the re-fire mechanics: `all_questions_answered` persists after a pivot (no new questions are added), every later stop re-enters the branch, and the lifetime cap is `maxPivots: 3`, not 1. The claim survives only at trigger iteration = `maxIterations − 1`.

### **`--extend=N` as a standalone flag divorced from the lineage mode**: needs identical machinery (classify branch, event, config mutation) while splitting the documented vocabulary — rejected in favor of `lineage_mode=completed-continue` with `--extend` as its spelling. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **`--extend=N` as a standalone flag divorced from the lineage mode**: needs identical machinery (classify branch, event, config mutation) while splitting the documented vocabulary — rejected in favor of `lineage_mode=completed-continue` with `--extend` as its spelling.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`--extend=N` as a standalone flag divorced from the lineage mode**: needs identical machinery (classify branch, event, config mutation) while splitting the documented vocabulary — rejected in favor of `lineage_mode=completed-continue` with `--extend` as its spelling.

### **Emitting the extension as a plain `resumed` event**: cheaper (no schema change) but makes a budget top-up indistinguishable from an ordinary resume in the ledger and dashboard — violates the provenance the ledger exists to carry. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **Emitting the extension as a plain `resumed` event**: cheaper (no schema change) but makes a budget top-up indistinguishable from an ordinary resume in the ledger and dashboard — violates the provenance the ledger exists to carry.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Emitting the extension as a plain `resumed` event**: cheaper (no schema change) but makes a budget top-up indistinguishable from an ordinary resume in the ledger and dashboard — violates the provenance the ledger exists to carry.

### **Re-stamping `createdAt` to reset the duration clock**: erases elapsed-time audit and breaks `elapsedMinutes` telemetry; raising `maxDurationMinutes` is the honest budget bump the confirm gate already prescribes. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **Re-stamping `createdAt` to reset the duration clock**: erases elapsed-time audit and breaks `elapsedMinutes` telemetry; raising `maxDurationMinutes` is the honest budget bump the confirm gate already prescribes.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Re-stamping `createdAt` to reset the duration clock**: erases elapsed-time audit and breaks `elapsedMinutes` telemetry; raising `maxDurationMinutes` is the honest budget bump the confirm gate already prescribes.

### `maxCouncilSeatOutputs: 9` is a shared lifetime cap — worth recording because a partial/resumed pivot consumes seat budget without completing, silently shrinking the effective pivot count below 3. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: `maxCouncilSeatOutputs: 9` is a shared lifetime cap — worth recording because a partial/resumed pivot consumes seat budget without completing, silently shrinking the effective pivot count below 3.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `maxCouncilSeatOutputs: 9` is a shared lifetime cap — worth recording because a partial/resumed pivot consumes seat budget without completing, silently shrinking the effective pivot count below 3.

### `minRemainingIterations` as a meaningful guard — `remainingIterations == 0` is unreachable because `maxIterationsReached` outranks the pivot branch. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: `minRemainingIterations` as a meaningful guard — `remainingIterations == 0` is unreachable because `maxIterationsReached` outranks the pivot branch.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `minRemainingIterations` as a meaningful guard — `remainingIterations == 0` is unreachable because `maxIterationsReached` outranks the pivot branch.

### A separate `--extend` implementation path that skips the ledger event — rejected in iteration 4 (plain `resumed` destroys provenance); reaffirmed here. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: A separate `--extend` implementation path that skips the ledger event — rejected in iteration 4 (plain `resumed` destroys provenance); reaffirmed here.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A separate `--extend` implementation path that skips the ledger event — rejected in iteration 4 (plain `resumed` destroys provenance); reaffirmed here.

### Admitting frontier nodes through `research/inbox.jsonl` on the review side — the review reducer has no question surface to project it into; nothing reads an inbox row (finding 2). -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Admitting frontier nodes through `research/inbox.jsonl` on the review side — the review reducer has no question surface to project it into; nothing reads an inbox row (finding 2).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Admitting frontier nodes through `research/inbox.jsonl` on the review side — the review reducer has no question surface to project it into; nothing reads an inbox row (finding 2).

### Candidate exhaustion as the yield limiter — `keyFindings.slice(-3)` cross-check seeds regenerate whenever new findings land. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Candidate exhaustion as the yield limiter — `keyFindings.slice(-3)` cross-check seeds regenerate whenever new findings land.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Candidate exhaustion as the yield limiter — `keyFindings.slice(-3)` cross-check seeds regenerate whenever new findings land.

### Shipping the frontier sub-mode as one large change — the defect layer is independently shippable and de-risks the surfaces frontier composes (focus precedence, pack contract, projection fields, diversity signal). -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Shipping the frontier sub-mode as one large change — the defect layer is independently shippable and de-risks the surfaces frontier composes (focus precedence, pack contract, projection fields, diversity signal).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Shipping the frontier sub-mode as one large change — the defect layer is independently shippable and de-risks the surfaces frontier composes (focus precedence, pack contract, projection fields, diversity signal).

### Treating Q4's gate as the df-idf scorer — the scorer never sees casual chat because `prompt-policy.ts` gates fire/skip upstream. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Treating Q4's gate as the df-idf scorer — the scorer never sees casual chat because `prompt-policy.ts` gates fire/skip upstream.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating Q4's gate as the df-idf scorer — the scorer never sees casual chat because `prompt-policy.ts` gates fire/skip upstream.

<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- "Pivot buys ~1 iteration" as a general claim — contradicted by the re-fire mechanics: `all_questions_answered` persists after a pivot (no new questions are added), every later stop re-enters the branch, and the lifetime cap is `maxPivots: 3`, not 1. The claim survives only at trigger iteration = `maxIterations − 1`. (iteration 2)
- `maxCouncilSeatOutputs: 9` is a shared lifetime cap — worth recording because a partial/resumed pivot consumes seat budget without completing, silently shrinking the effective pivot count below 3. (iteration 2)
- `minRemainingIterations` as a meaningful guard — `remainingIterations == 0` is unreachable because `maxIterationsReached` outranks the pivot branch. (iteration 2)
- Candidate exhaustion as the yield limiter — `keyFindings.slice(-3)` cross-check seeds regenerate whenever new findings land. (iteration 2)
- Admitting frontier nodes through `research/inbox.jsonl` on the review side — the review reducer has no question surface to project it into; nothing reads an inbox row (finding 2). (iteration 3)
- **`--extend=N` as a standalone flag divorced from the lineage mode**: needs identical machinery (classify branch, event, config mutation) while splitting the documented vocabulary — rejected in favor of `lineage_mode=completed-continue` with `--extend` as its spelling. (iteration 4)
- **Emitting the extension as a plain `resumed` event**: cheaper (no schema change) but makes a budget top-up indistinguishable from an ordinary resume in the ledger and dashboard — violates the provenance the ledger exists to carry. (iteration 4)
- **Re-stamping `createdAt` to reset the duration clock**: erases elapsed-time audit and breaks `elapsedMinutes` telemetry; raising `maxDurationMinutes` is the honest budget bump the confirm gate already prescribes. (iteration 4)
- A separate `--extend` implementation path that skips the ledger event — rejected in iteration 4 (plain `resumed` destroys provenance); reaffirmed here. (iteration 5)
- Shipping the frontier sub-mode as one large change — the defect layer is independently shippable and de-risks the surfaces frontier composes (focus precedence, pack contract, projection fields, diversity signal). (iteration 5)
- Treating Q4's gate as the df-idf scorer — the scorer never sees casual chat because `prompt-policy.ts` gates fire/skip upstream. (iteration 5)

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
- Q1 residual: D4 (`normalizeQuestionOrigin` fallback), D8 (loop-lock pid-liveness), §8/§10 design spot-checks. (iteration 1)
- Q2: review-side pivot adapter, deep-review reducer, review prompt pack, fanout-merge internals. (iteration 1)
- Q5: concrete change slices with tests, risks, ordering. (iteration 1)
- Q4: skill-advisor scorer (`df-idf.ts`) and prompt-policy gate on casual chat. (iteration 1)
- Q3: pivot-after-`all_questions_answered` yield; D1 honest fix (quality_class producer + closed vocabulary). (iteration 1)
- Open sub-question surfaced by this iteration: whether `maxCouncilSeatOutputs: 9` should be per-pivot rather than lifetime — a resumed pivot currently burns lifetime seat budget. (iteration 2)
- Q4: skill-advisor scorer (`df-idf.ts`) + prompt-policy gate on casual chat. (iteration 2)
- Q1 residual: D4 (`normalizeQuestionOrigin` fallback), D8 (loop-lock pid-liveness), §8/§10 spot-checks. (iteration 2)
- Q6 (operator-injected at iteration 2): completed-run extension design. (iteration 2)
- Q2: review side — `divergent-review-pivot.ts`, deep-review reducer, review prompt pack, `fanout-merge.cjs` internals. (iteration 2)
- Q4 (skill-advisor scorer + prompt-policy gate), Q5 (change slices — now includes review-side slices for findings 1-6), Q6 (completed-run extension), Q1 residual (D4/D8), open sub-question on per-pivot `maxCouncilSeatOutputs`. (iteration 3)
- Q4 (unanswered, scoped): the four reads listed in Finding 4 — `prompt-policy.ts:80-223`, `prompt-policy.default.json` thresholds, the `fire:false` call-site consequence, and whether gen-1's target-2 decomposition names the gate or the scorer. (iteration 5)
- Q1 residual (unanswered): D4 (`normalizeQuestionOrigin` fallback, `reduce-state.cjs:128,:204`) and D8 (`loop-lock.cjs:183-186`) — folded into Slices D and A as verification tasks. (iteration 5)
- Open sub-question: per-pivot vs lifetime `maxCouncilSeatOutputs` (Slice L decision point). (iteration 5)

<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
Open sub-question: per-pivot vs lifetime `maxCouncilSeatOutputs` (Slice L decision point).

<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT

Generation 1 synthesis (archived `research_archive/20261117T103614Z/research.md`), summarized:

- **Root cause:** every stop signal and focus source is anchored to the init-time question set, and nothing grows it during a run, so narrow-and-answered looks converged. `research/inbox.jsonl` is the only path that grows the counted set, and nothing writes it.
- **Existing levers:** minIterations, convergence `off` and stopPolicy `max-iterations` add duration only; the divergent pivot re-picks from existing state; the coverage graph vetoes stops but never steers; fan-out gives every lineage the same topic; wave_orchestration never runs.
- **Design:** opt-in `--depth-mode=expansive`. Leaf proposes `frontier_proposal` delta rows; a workflow step `step_frontier_admit` admits them (relevance with evidence anchor, dedupe, depth ≤ 3, ≤ 6 children, ≤ 40 total, monotone budget, acyclic) into `inbox.jsonl` with `origin: frontier`; the reducer projects `registry.frontier`; Next Focus picks lowest-depth open node; `convergence.cjs` gains a `frontierOpen` veto right after the minIterations floor (STOP → CONTINUE only); depth budget 50/35/15; fan-out partitions depth-1 nodes via `frontier_scope`.
- **Defects D1-D9:** D1 sourceDiversity unsatisfiable (no quality_class producer, gameable); D2 research cli-claude-code drops --config-dir; D3 review minIterations floor never applied; D4 unknown question origin becomes operator; D5 "Questions Remaining" free text hijacks Next Focus; D6 progressive synthesis forbidden by prompt pack; D7 route-proof fields dropped from state-log projection; D8 transient lock of a dead session blocks resume up to 60 min; D9 focusAlignment guard never evaluated on research.
- **Open questions from generation 1:** review-side pivot adapter and fanout-merge internals unread; whether a pivot after all_questions_answered buys only one iteration; quality_class producer and vocabulary; skill-advisor df-idf.ts unread.

### Bounded Context Snapshot

- Source pointers: `.skilled/skills/system-deep-loop/runtime/scripts/{convergence,reduce-state,fanout-run,fanout-merge,dispatch-iteration,append-mode-event,loop-lock,verify-iteration}.cjs`; `.skilled/skills/system-deep-loop/deep-research/scripts/{reduce-state.cjs,divergent-research-pivot.ts}`; `.skilled/skills/system-deep-loop/deep-review/`; `.skilled/skills/system-deep-loop/runtime/lib/{coverage-graph,deep-loop,deep-research-ledger-schema}/`; `.skilled/commands/deep/assets/deep-{research,review}.yaml`; `.skilled/agents/deep-{research,review}.md`; `.skilled/skills/system-skill-advisor/runtime/lib/`.
- Integration points: the files in generation 1's §10 integration map.
- Constraints: research only; generation-1 iteration files stay write-once in the archive.

---

## 13. RESEARCH BOUNDARIES
- Max iterations: 5
- Convergence threshold: 0.05 (telemetry only; stopPolicy max-iterations)
- Per-iteration budget: 24 tool calls, 10 minutes
- Progressive synthesis: true (default)
- research/research.md ownership: workflow-owned canonical synthesis output
- Lifecycle branches: `resume`, `restart` (live); `fork`, `completed-continue` (deferred, not runtime-wired)
- Machine-owned sections: reducer controls Sections 3, 6, 7-11A, including Section 10A pivot lineage
- Question injection surface: `research/inbox.jsonl`
- Canonical pause sentinel: `research/.deep-research-pause`
- Executor: cli-devin, model swe-2-max
- Current generation: 2 (parent session 2026-11-17T07:52:43.000Z)
- Started: 2026-11-17T10:36:36Z
