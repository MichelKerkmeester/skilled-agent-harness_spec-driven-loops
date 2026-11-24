---
title: Deep Review Strategy
description: Persistent review brain for the deepseek-max-2 lineage over packet 012, tracking dimension coverage, findings, exhausted approaches and next focus.
trigger_phrases:
  - "deep review strategy 012 deepseek-max-2"
importance_tier: normal
contextType: planning
---

# Deep Review Strategy - Packet 012 / lineage deepseek-max-2

## 2. TOPIC
Review target: `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers` (spec-folder).
Operator focus: traceability, completing the `spec_code` and `checklist_evidence` protocols over REQ-001..REQ-034, the ticked tasks, the Met acceptance rows, and the sixth fix round (REQ-023 to REQ-034, AC-030 to AC-042, ADR-005, ADR-006).

---

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
[All dimensions complete]

<!-- /ANCHOR:review-dimensions -->
## 4. NON-GOALS
- Implementing fixes for any finding.
- Re-running the repository's build, test, or validation tooling; evidence is read from the tree and from the packet's recorded runs.
- Re-reviewing packet 013's own requirements except where packet 012's REQ-034 cites them as closure evidence.
- Broadening code findings outside `reviewScopeFiles`; packet docs, commands and skills are cited as traceability context only.

---

## 5. STOP CONDITIONS
- `config.stopPolicy` is `max-iterations` with `maxIterations=5`: the loop runs all five iterations and convergence is telemetry only.
- Hard stop on three consecutive failed iterations, or on an unreadable state file.

---

<!-- ANCHOR:completed-dimensions -->
## 4. COMPLETED DIMENSIONS
- [x] correctness
- [x] security
- [x] traceability
- [x] maintainability

<!-- /ANCHOR:completed-dimensions -->
<!-- ANCHOR:running-findings -->
## 5. RUNNING FINDINGS
- P0 (Blockers): 0
- P1 (Required): 1
- P2 (Suggestions): 7
- Resolved: 0

<!-- /ANCHOR:running-findings -->
## 8. WHAT WORKED
- **Executing both gate copies instead of reading them:** the built native gate and `skill_advisor.asks_for_loop_run` answered the 41 REQ prompts identically, which turns REQ-020/REQ-021/REQ-031 from prose claims into a measurement (iteration 1).
- **Counting the shared fixture and searching the changelog for the quoted number:** two cheap reads turned three `Met` evidence cells into findings without a suite run (iteration 1).
- **Replicating the drift guard's per-entry logic over the tracked fixture:** proved 248 cases cover every exported word list with 0 misses (iteration 1).
- **Resolving every citation mechanically instead of eyeballing rows:** 110 of 110 `path:line` references resolved in range, so the one imprecise cell stood out against a measured baseline (iteration 2).
- **Re-running each "prints nothing" verification command:** five absent-phrase claims and four counted claims all reproduced, which separates real drift from prose suspicion (iteration 2).
- **Executing an inflected prompt set instead of only the fixture's prompts:** 13 plural and singular loop names exposed a whole vocabulary class the fixture never tries (iteration 3).
- **Timing both gates on adversarial 10,000-character prompts:** ten cases, worst case 17 ms, which turns "ReDoS" from a suspicion into a measurement (iteration 4).
- **Generating 2,306 prompt combinations to test two-copy parity:** 0 disagreements, so the maintenance risk could be stated as a boundary rather than a guess (iteration 5).

---

## 9. WHAT FAILED
- **Reading the packet's round-to-round suite totals as authority:** AC-042 (3029), T087 (3,126) and the changelog (3,126) disagree, and the suite cannot be re-run inside this lineage's write surface, so the number stays an open record question (iteration 1).
- **Treating citation resolution as proof:** all 110 citations resolve in range, yet AC-031's two still land on a comment and a fixture property, so line existence and line meaning are separate checks (iteration 2).
- **Sampling the vocabulary only at the singular:** every pass through the fixture and the 41 REQ prompts missed the plural loop nouns, so a fixture-driven review reproduces the fixture's blind spots (iteration 3).
- **Leaving dimensions to the last iteration under a hard cap:** maintainability was first covered in iteration 5, so the coverage gate read `coverage-too-young` and the stop is a FAIL that no further iteration of this run could clear (iteration 5).

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### **A bare-loop-name ask (ADR-006)**: "deep loop: audit the payments flow" reads `false`; "run a deep loop" and "I want a review loop" read `true`. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **A bare-loop-name ask (ADR-006)**: "deep loop: audit the payments flow" reads `false`; "run a deep loop" and "I want a review loop" read `true`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A bare-loop-name ask (ADR-006)**: "deep loop: audit the payments flow" reads `false`; "run a deep loop" and "I want a review loop" read `true`.

### **A comment that contradicts its pattern**: none found on the changed blocks. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **A comment that contradicts its pattern**: none found on the changed blocks.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A comment that contradicts its pattern**: none found on the changed blocks.

### **A depth-word leak into the gate**: "do a thorough code review" and "find out everything you can" both read `asksForLoopRun: false`, as REQ-002 requires. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **A depth-word leak into the gate**: "do a thorough code review" and "find out everything you can" both read `asksForLoopRun: false`, as REQ-002 requires.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A depth-word leak into the gate**: "do a thorough code review" and "find out everything you can" both read `asksForLoopRun: false`, as REQ-002 requires.

### **A false `Met` whose evidence file is missing**: all 13 named scratch evidence files exist. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **A false `Met` whose evidence file is missing**: all 13 named scratch evidence files exist.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A false `Met` whose evidence file is missing**: all 13 named scratch evidence files exist.

### **A parity drift on the new prompts**: both copies agree on all 24 prompts measured this iteration; the findings are vocabulary gaps present in both, not divergence. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **A parity drift on the new prompts**: both copies agree on all 24 prompts measured this iteration; the findings are vocabulary gaps present in both, not divergence.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A parity drift on the new prompts**: both copies agree on all 24 prompts measured this iteration; the findings are vocabulary gaps present in both, not divergence.

### **A parity drift the guard would have missed**: 0 disagreements over 2,306 prompts. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **A parity drift the guard would have missed**: 0 disagreements over 2,306 prompts.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A parity drift the guard would have missed**: 0 disagreements over 2,306 prompts.

### **A prompt-only path to the pass-through in P2-001**: the Python gate marks `typed` only on its own table's rows, so reaching it needs a hostile or buggy child, which is why it is hardening rather than a blocker. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **A prompt-only path to the pass-through in P2-001**: the Python gate marks `typed` only on its own table's rows, so reaching it needs a hostile or buggy child, which is why it is hardening rather than a blocker.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A prompt-only path to the pass-through in P2-001**: the Python gate marks `typed` only on its own table's rows, so reaching it needs a hostile or buggy child, which is why it is hardening rather than a blocker.

### **A question-reading bug**: "what does deep review mean" / "how does the deep review pick dimensions" both return false. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **A question-reading bug**: "what does deep review mean" / "how does the deep review pick dimensions" both return false.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A question-reading bug**: "what does deep review mean" / "how does the deep review pick dimensions" both return false.

### **A refusal-in-later-clause bug**: a refusal of a different action leaves an earlier ask standing, in both copies. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **A refusal-in-later-clause bug**: a refusal of a different action leaves an earlier ask standing, in both copies.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A refusal-in-later-clause bug**: a refusal of a different action leaves an earlier ask standing, in both copies.

### **A TS/Python parity drift in `asksForLoopRun`**: 41 REQ prompts compared, 0 disagreements; the words level is also pinned by the twelve-pair guard. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **A TS/Python parity drift in `asksForLoopRun`**: 41 REQ prompts compared, 0 disagreements; the words level is also pinned by the twelve-pair guard.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A TS/Python parity drift in `asksForLoopRun`**: 41 REQ prompts compared, 0 disagreements; the words level is also pinned by the twelve-pair guard.

### **A two-cue mode leak**: a prompt with both mode cues gets no command on a deferred route, as CHK-012 requires. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **A two-cue mode leak**: a prompt with both mode cues gets no command on a deferred route, as CHK-012 requires.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A two-cue mode leak**: a prompt with both mode cues gets no command on a deferred route, as CHK-012 requires.

### **A typed-command loss on a second typed command**: both REQ-025 prompts keep `/deep:review` at the gate layer and the served head. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **A typed-command loss on a second typed command**: both REQ-025 prompts keep `/deep:review` at the gate layer and the served head.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A typed-command loss on a second typed command**: both REQ-025 prompts keep `/deep:review` at the gate layer and the served head.

### **A typed-list ordering bug**: `typedCommandsIn` order does not hide a shorter typed command; measured in iteration 1 as well. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **A typed-list ordering bug**: `typedCommandsIn` order does not hide a shorter typed command; measured in iteration 1 as well.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A typed-list ordering bug**: `typedCommandsIn` order does not hide a shorter typed command; measured in iteration 1 as well.

### **A Verification Summary that miscounts its boxes**: 12/11, 13/13, 1/1 reproduce. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **A Verification Summary that miscounts its boxes**: 12/11, 13/13, 1/1 reproduce.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A Verification Summary that miscounts its boxes**: 12/11, 13/13, 1/1 reproduce.

### **A waiver without an ADR**: all three name ADRs that exist. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **A waiver without an ADR**: all three name ADRs that exist.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A waiver without an ADR**: all three name ADRs that exist.

### **An unresolved in-range citation (110 checked)**: 0 failures. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **An unresolved in-range citation (110 checked)**: 0 failures.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **An unresolved in-range citation (110 checked)**: 0 failures.

### **An unverifiable "prints nothing" task claim**: all five re-run and all hold. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **An unverifiable "prints nothing" task claim**: all five re-run and all hold.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **An unverifiable "prints nothing" task claim**: all five re-run and all hold.

### **Dead code left behind by the packet**: every touched symbol has a reader. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **Dead code left behind by the packet**: every touched symbol has a reader.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Dead code left behind by the packet**: every touched symbol has a reader.

### **Prototype pollution through `skill` ids**: own-key lookups on every table read. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **Prototype pollution through `skill` ids**: own-key lookups on every table read.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Prototype pollution through `skill` ids**: own-key lookups on every table read.

### **ReDoS in either gate copy**: measured, worst case 17 ms on 10,000 characters. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **ReDoS in either gate copy**: measured, worst case 17 ms on 10,000 characters.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **ReDoS in either gate copy**: measured, worst case 17 ms on 10,000 characters.

### **REQ-001 "plain loop asks gain the command row" as a finding**: the gate returns `/deep:review` on a plain ask in both copies and the deferred-route cue adds the mode; no drift found. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **REQ-001 "plain loop asks gain the command row" as a finding**: the gate returns `/deep:review` on a plain ask in both copies and the deferred-route cue adds the mode; no drift found.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **REQ-001 "plain loop asks gain the command row" as a finding**: the gate returns `/deep:review` on a plain ask in both copies and the deferred-route cue adds the mode; no drift found.

### **Secrets in the changed files**: none. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **Secrets in the changed files**: none.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Secrets in the changed files**: none.

### **Shell injection through the prompt**: the prompt never reaches a command line. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **Shell injection through the prompt**: the prompt never reaches a command line.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Shell injection through the prompt**: the prompt never reaches a command line.

### **Two offer sections drifting apart**: both carry the same option set and the same composed-flag rule. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **Two offer sections drifting apart**: both carry the same option set and the same composed-flag rule.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Two offer sections drifting apart**: both carry the same option set and the same composed-flag rule.

<!-- /ANCHOR:exhausted-approaches -->
## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

## 11. RULED OUT DIRECTIONS
[Review angles that were investigated and definitively eliminated -- consolidated from iteration dead-end data]

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- None. The run reached its fifth and final iteration; terminal gates recorded, synthesis complete.
- Outcome: verdict FAIL on the terminal coverage gate (`coverage-too-young`) with an active P1. Report: `review-report.md` in this lineage.
- Carry-forward: the P1 (plural loop names) and the P2 performance-vocabulary finding need one operator decision — guard the family or record it as a limitation beside limitation 7.
- Coverage note: the last dimension was first covered in the final capped iteration, so REQ-033 / AC-040 needs a rerun with a stabilization pass or an amended criterion.

<!-- /ANCHOR:next-focus -->
## 13. KNOWN CONTEXT

### Bounded Context Snapshot

- **Target pointers**: the score file `command-attach.ts` and its guard suites; `skill_advisor.py`; the two deep presentation assets and the two deep command docs; the packet docs (`spec.md`, `tasks.md`, `acceptance-criteria.md`, `decision-record.md`, `implementation-summary.md`); packet 013's docs as closure evidence; reducer/closeout scripts and their unit tests.
- **Behavior claims**: REQ-001..REQ-034 (offers on plain loop asks, no depth-only offers, typed-command precedence, refusal and subject readings, degraded-path rendering, registry refinement identity, coverage-gate closure).
- **Reuse and conventions**: the shared fixture `tests/fixtures/deep-loop-offer-cases.json` is the single source both the TypeScript and Python suites read; the presentation files carry the offer section the AI reads.
- **Review risks and gaps**: no `resource-map.md` in the packet, so the coverage-gate section is absent; recorded probe and suite results live in `scratch/` and the changelog, not in machine-rerun evidence; a prior three-lineage Opus review of this packet returned FAIL on its coverage gate.

---

## 14. CROSS-REFERENCE STATUS
<!-- MACHINE-OWNED: START -->
[Alignment checks completed across core and overlay protocols]

| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | pass | 1 | REQ-001..REQ-034 each resolved to a producer; 41 REQ prompts agree across both gate copies; record-accuracy drift raised as ITER1-P2-001..003 |
| `checklist_evidence` | core | pass | 2 | 110 of 110 citations resolve; 39 Met rows read; 3 ADR-backed waivers; Verification Summary reproduces its boxes; one citation-precision P2 |
| `skill_agent` | overlay | pending | - | - |
| `agent_cross_runtime` | overlay | pending | - | - |
| `feature_catalog_code` | overlay | pending | - | - |
| `playbook_capability` | overlay | pending | - | - |
<!-- MACHINE-OWNED: END -->

---

## 15. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->
[Per-file coverage state table -- populated as iterations cover files]

| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
<!-- MACHINE-OWNED: END -->

---

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 5
- Convergence threshold: 0.1
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=fanout-deepseek-max-2-1795514074741-gl47kr, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 24 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=[spec_code, checklist_evidence], overlay=[skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability]
- Started: 2026-11-24T09:55Z
<!-- MACHINE-OWNED: END -->
