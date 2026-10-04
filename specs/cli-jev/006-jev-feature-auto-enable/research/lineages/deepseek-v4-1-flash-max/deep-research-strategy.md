---
title: Deep Research Strategy — Jev feature proof-or-retire (deepseek-v4-1-flash-max lineage)
description: Session tracking for the five-iteration research on the three Jev classifier features without a clean keep verdict.
trigger_phrases:
  - "jev feature proof or retire"
  - "deep research strategy"
importance_tier: normal
contextType: planning
---

# Deep Research Strategy - Jev feature proof-or-retire

Lineage `deepseek-v4-1-flash-max` of the fan-out run `fanout-deepseek-v4-1-flash-max-1791147269547-wctu8t`.
Artifact directory: `specs/cli-jev/006-jev-feature-auto-enable/research/lineages/deepseek-v4-1-flash-max`.
Write boundary: this lineage directory only (detached fan-out lineage; spec-folder writeback intentionally skipped).

## 1. OVERVIEW

### Purpose

Persistent brain for this lineage: five iterations, each with one focus, researching how to prove, improve, harden, debug, integrate and test the three Jev classifier features that have no clean keep verdict — spec-track narrowing, routing clarify default, alignment folder suggestion — so each can either earn a live, auto-on path like the four proven features or be retired with evidence. Findings are appended to `deltas/iter-NNN.jsonl` as `type:"finding"` records and narrated in `iterations/iteration-NNN.md`; the terminal synthesis is `research.md`.

### Usage

- Per iteration: read Next Focus, read `steer.md` if the lead left one, gather evidence, write the iteration file and delta, append the iteration record through the append gateway.
- The official reducer cannot run against this lineage (it resolves artifact paths from the spec folder, outside this write boundary), so the executor maintains Sections 3, 6-11A of this file directly, keeping the reducer's shapes.

---

## 2. TOPIC

Research how to prove, improve, harden, debug, integrate and test the three Jev classifier features that have no clean keep verdict, so each can either earn a live, auto-on path like the four proven features or be retired with evidence. (1) Spec-track narrowing, `.skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs`: its first live run kept (97 right of 256 against ripgrep), but the repeat on a 270-row corpus stopped on margin (106 vs 82, bootstrap interval spanning zero). (2) Routing clarify default, `.skilled/skills/sk-doc/sk-create-skill/scripts/score-clarify-default.cjs`: a keep on a fixture corpus (28 vs 15 of 54), while the real router clarifies only 3 of 359 committed prompts and the scorer now refuses rows the router no longer clarifies. (3) Alignment folder suggestion, `.skilled/skills/system-spec-kit/runtime/cli/evals/score-alignment-suggestion.ts`: a keep on fixture rows (39 vs 30 of 40), but a distractor-state control turns it to kill (W=0 L=30). For each feature answer: what corpus, labels, keep rule and power would prove a live win or settle a kill; what question, option or input changes would improve accuracy; which failure modes need hardening; where it would plug into a live path behind the shared gate `.skilled/skills/cli-classifier/shared/scripts/jev-features.mjs` (featureReady, JEV_FEATURE_<NAME>, auto-on with a stored credential) the way cite-drift, the injection screen hook, the reviewer verdict fallback and the D4 hallucination grader now do; and what tests would cover it. Measured history lives in `specs/cli-jev/003-cli-jev-workflow-integration/` children 017, 020, 022, 047, 048 and 049. Read only outside your lineage folder. Cite `file:line` for every claim, give each recommendation a priority (P0 to P2) and say how you confirmed it.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)

- [x] Q1: What is the exact live-path contract behind `.skilled/skills/cli-classifier/shared/scripts/jev-features.mjs` (featureReady, JEV_FEATURE_<NAME>, auto-on with a stored credential), and how did each of the four proven features (cite-drift, injection screen hook, reviewer verdict fallback, D4 hallucination grader) earn its auto-on slot? What must a candidate feature demonstrate to pass that gate? — answered (iteration 1): FEATURES holds four entries; featureReady is switch-first then one bounded auth probe; four live paths share the gate-first fail-open shape; no gate change is needed for candidates.
- [x] Q2: Spec-track narrowing (`score-track-narrowing.mjs`): given the repeat on 270 rows stopped on margin (106 vs 82, bootstrap interval spanning zero), what corpus, labels, keep rule and power would prove a live win or settle a kill; what question, option or input changes improve accuracy; which failure modes need hardening; where would it plug into a live path; what tests would cover it? — answered (iteration 2): repeat inconclusive; 80% power needs 217 decided pairs (~431 rows); relative-only rule needs floors; advisory Gate 1 shape; R1 binds.
- [x] Q3: Routing clarify default (`score-clarify-default.cjs`): same five sub-questions, including the contradiction between the fixture keep (28 vs 15 of 54) and the live router clarifying only 3 of 359 committed prompts, and the scorer's new refusal of rows the router no longer clarifies. — answered (iteration 3): 3 of 365 census (2 mode); 42 of 54 rows refused; power wall (69 discordant pairs at 0.65); seam drops alternatives; shadow logging is the next step.
- [x] Q4: Alignment folder suggestion (`score-alignment-suggestion.ts`): same five sub-questions, including the distractor-state control that flips keep to kill (W=0 L=30). — answered (iteration 4): distractor control kills; the pick follows the state's folder name (30 of 30); fixture corpus cannot prove; masked-state ablation gates the decision.
- [x] Q5: Cross-feature: what unified corpus, label, keep-rule and power standard would let each feature either earn a live auto-on path or be retired with evidence; what hardening and test plan applies across all three; and what ranked next step does each feature get? — answered (iteration 5): seven-requirement standard; shared-kit amendment set; shadow→canary→live order; ranked next step per feature.
<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS

- Implementing any fix, wiring, scorer change or test; this run reports only.
- Live Jev or Pi calls; evidence comes from code, docs, recorded run folders and prior research.
- Re-measuring any benchmark; recorded results are evidence.
- Writing outside this lineage directory; spec-folder writeback is intentionally skipped.

---

## 5. STOP CONDITIONS

- Five iterations reached (stopPolicy `max-iterations`; convergence before the cap is telemetry only).
- All five key questions answered or explicitly bounded, with a ranked next step per non-proven feature in `research.md`.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS

- Q1 — answered (iteration 1): gate contract + four proven auto-on paths; no gate change needed for candidates.
- Q2 — answered (iteration 2): track narrowing; repeat inconclusive; 217 decided pairs for 80% power; relative-only rule needs floors; advisory Gate 1 shape; R1 binds.
- Q3 — answered (iteration 3): clarify default; 3 of 365 census; 42 of 54 rows refused; 69 discordant pairs at 0.65; seam drops alternatives; shadow logging next.
- Q4 — answered (iteration 4): alignment; distractor control kills (W=0 L=30, state-anchored pick); masked-state ablation gates the decision.
- Q5 — answered (iteration 5): seven-requirement standard; shared-kit amendment set; shadow→canary→live order; ranked next step per feature.
<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED

- Reading the gate module end to end first made every call-site read cheap; each site could be judged against one contract (iteration 1).
- Computing exact binomial power from the repeat's own counts turned "underpowered" into actionable numbers (217 decided pairs / ~431 rows; MDE 13.7pp) (iteration 2).
- Running the clarify census and the fixture replay read-only converted the topic's summary numbers into today's measured numbers (3 of 365; 42 of 54 refused) (iteration 3).
- Reading the distractor arm's per-row discordant lines turned "a control flips it to kill" into the mechanism — the pick follows the state's folder name on 30 of 30 rows (iteration 4).
- Re-verifying the shared kit and the three rule lines in one pass made the cross-feature amendment set concrete (one kit change + three rule lines) (iteration 5).
<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED

- Nothing failed outright. The only friction: `timeout` is not available on this macOS shell (iteration 3), and the label-swap control's semantics are narrower than they first appear (it only swaps rows whose label is the top alternative), so its result is weaker evidence than the distractor arm (iteration 4).
<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)

[Populated when an approach has been tried from multiple angles without success]
<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS

- Wiring any of the three now (out of scope; unsupported by evidence) — iteration 5.
- Reading the track repeat as a kill (CI spans zero; underpowered) — iteration 2.
- Adopting probability-aware aggregation as a free row (lost 4 rows on the repeat) — iteration 2.
- Scoring the clarify fixture as-is (42 of 54 rows no longer clarify) — iteration 3.
- Reading the clarify keep as mode-selection skill (12 of 17 wins are abstentions) — iteration 3.
- Serving a clarify suggestion on the current contract (normalized route drops the alternatives) — iteration 3.
- Reading the alignment fixture keep as production superiority (distractor control flips it; target wrong 0/40) — iteration 4.
- Chasing f022-001 with describer edits (both options described; still loses) — iteration 4.
- A non-interactive or hard-block-overriding alignment suggestion (policy; D6) — iteration 4.
- A single accuracy number as the keep bar (all three rules are relative) — iteration 5.
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

- (track) Which absolute accuracy and per-track recall floors would the operator accept? (from iteration 2)
- (track) Is `pickProb` calibrated well enough to gate a miss-only serving call? (from iteration 2)
- (clarify) Can shadow logging collect enough real mode clarifications to measure lift per hub? (from iteration 3)
- (clarify) Which compiled-router owner would approve and maintain an additive alternatives contract? (from iteration 3)
- (alignment) Does the masked-state variant survive the distractor control? (from iteration 4)
- (alignment) How often is the real final folder inside the offered candidate set? (from iteration 4)
<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS

Synthesis complete. All five key questions are answered; `research.md` carries the ranked next step per non-proven feature (REQ-010 of packet 006). No further iteration is warranted: the remaining open items are bounded experiments (a powered holdout run, shadow logging, a masked-state ablation), not research gaps. The loop stopped at the iteration cap with `stopReason: maxIterationsReached`.
<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT

Prior context loaded from the packet (read-only):

- `spec.md` (packet 006): REQ-010 asks for a five-iteration research run per executor ending in `research.md` with a ranked next step per non-proven feature. Out of scope: wiring the three features; none holds a clean keep and the research decides what would prove one.
- `plan.md` (packet 006): the shared gate `jev-features.mjs` (`featureEnabled`, `jevReady`, `featureReady`), auto-graded benchmark defaults, and the injection hook are the shipped pattern; the three candidates are not part of it.
- Prior research (2026-10-03, read-only): `003-cli-jev-workflow-integration/048-jev-feature-improvement-research/` children `002-track-narrowing-research`, `007-clarify-default-research`, `008-folder-suggestion-research` hold merged two-lineage research with ranked recommendations R1-R10 each; `049-jev-feature-improvement-build/` children `002`, `007`, `008` hold the built improvements. The 2026-10-04 topic adds new evidence: a 270-row track-narrowing repeat (106 vs 82, bootstrap interval spanning zero), the clarify scorer now refusing non-clarify rows (3 of 359 committed prompts clarify), and a distractor-state control on alignment (W=0 L=30).
- The four proven features: citation drift (032), injection screen (035), reviewer verdict fallback (025), hallucination grader (024).

### Bounded Context Snapshot

- Source pointers: `.skilled/skills/cli-classifier/shared/scripts/{jev-features.mjs,jev-transport.mjs}` + tests; `.skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs`; `.skilled/skills/sk-doc/sk-create-skill/scripts/score-clarify-default.cjs`; `.skilled/skills/system-spec-kit/runtime/cli/evals/score-alignment-suggestion.ts`; the four live call sites; `ENV-REFERENCE.md`, `.env.example`, `hook-flags.env.example`.
- Measured history: `003-cli-jev-workflow-integration/` children 017 (track narrowing arm), 020 (clarify default), 022 (folder suggestion), 047 (measure every feature), 048 (improvement research), 049 (improvement build).
- Integration points: the `FEATURES` table and `featureReady` gate; the auto-grader resolution pattern in `run-benchmark.cjs` and `reviewer-scorer.cjs`; the hook fail-open pattern.
- Constraints and risks: read-only outside this lineage; recorded runs are evidence, not to be regenerated; prior research conclusions are inputs, not substitutes for current-code verification.

---

## 13. RESEARCH BOUNDARIES

- Max iterations: 5
- Convergence threshold: 0.05
- Per-iteration budget: 12 tool calls target (max 24)
- Progressive synthesis: true (default)
- `research/research.md` ownership: workflow-owned canonical synthesis output (written at synthesis)
- Lifecycle branches: `resume`, `restart` (live); `fork`, `completed-continue` (deferred, not runtime-wired)
- Machine-owned sections: maintained by the executor in this lineage (official reducer resolves paths outside the lineage write boundary)
- Question injection surface: not used in this detached lineage
- Canonical pause sentinel: `research/.deep-research-pause` (not used; detached lineage)
- Current generation: 1
- Started: 2026-10-04T20:58:11.000Z
