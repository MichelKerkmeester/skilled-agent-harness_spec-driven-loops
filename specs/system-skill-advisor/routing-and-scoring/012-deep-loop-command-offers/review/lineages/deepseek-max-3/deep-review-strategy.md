---
title: Deep Review Strategy - 012-deep-loop-command-offers (deepseek-max-3 lineage)
description: Runtime review strategy for the traceability review of packet 012, sixth fix round.
importance_tier: normal
contextType: planning
version: 1.13.0.0
---

# Deep Review Strategy - 012-deep-loop-command-offers (deepseek-max-3)

## 1. REVIEW CHARTER

- Target: `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers` (spec-folder, Level 2)
- Operator review focus: finish the `spec_code` and `checklist_evidence` protocols. Check every REQ in `spec.md` against the code that implements it or the decision that records it, and every ticked task in `tasks.md` and every `Met` row in `acceptance-criteria.md` against evidence that really exists in the tree, including the sixth fix round (REQ-023 to REQ-034, AC-030 to AC-042, ADR-005, ADR-006).
- Dimensions: correctness, security, traceability, maintainability (configured), emitted in risk order.
- Stop policy: `max-iterations` with a 5-iteration cap; convergence is telemetry only.
- Success criteria: each reviewed REQ, task box and acceptance row is either matched by tree evidence at the cited line, or reported as drift with evidence.

## 2. TOPIC

Review of the deep-loop command-offer packet: the advisor gate (`command-attach.ts` and its Python copy), the stage-one lane (`explicit.ts`), the fused doctor row (`fusion.ts`), the degraded brief paths (`subprocess.ts`, `skill-advisor-cli.ts`), the deep command assets, and the packet docs that claim the behaviour.

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
[All dimensions complete]

<!-- /ANCHOR:review-dimensions -->
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
- P2 (Suggestions): 4
- Resolved: 0

<!-- /ANCHOR:running-findings -->
## 6. NON-GOALS

- Re-running the advisor vitest suite, `npm run build`, the 69-probe set or the corpus capture: the lineage write surface forbids build/test writes, so recorded observations are checked against the tree and their cited lines rather than re-executed.
- Fixing any drift found. This run reports; implementation is a follow-up.

## 7. STOP CONDITIONS

- Iteration cap 5 (configured `stopPolicy: max-iterations`).
- Stuck recovery at `stuckThreshold: 2`.

## 8. WHAT WORKED

- Direct read of the cited `file:line` in each acceptance row, then a grep for the predicate export it names, distinguishes a recorded observation from a real one. (iteration 1)
- Counting a fixture's evidence columns (203 cases, 26 `doctorWithheld`, 11 refusal ids, 5 typed pairs) confirmed four `Met` rows' counts without running a suite. (iteration 1)
- Reading the trust boundary end to end (prompt in, brief out) settled four security questions in one pass. (iteration 2)
- Comparing result files (`after` vs `spec-baseline` vs `fresh-review`) proved more than re-reading prose claims. (iteration 3)
- Counting the acceptance, task and checklist rows and resolving each waiver cell to an ADR closed `checklist_evidence` in one pass. (iteration 4)
- Reading the two gate copies side by side locates unguarded duplication that per-file reading cannot show. (iteration 5)

## 9. WHAT FAILED

- Nothing failed in iteration 1. Recorded here so the section keeps its shape.

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### **"A refusing stuck complaint still gets the fused doctor row."** Ruled out: `doctorRefused` reads `isRunRefused` before the row survives `[SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:1084]`, and the fixture pins the withheld rows `[SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/fixtures/deep-loop-offer-cases.json:138]`. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **"A refusing stuck complaint still gets the fused doctor row."** Ruled out: `doctorRefused` reads `isRunRefused` before the row survives `[SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:1084]`, and the fixture pins the withheld rows `[SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/fixtures/deep-loop-offer-cases.json:138]`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **"A refusing stuck complaint still gets the fused doctor row."** Ruled out: `doctorRefused` reads `isRunRefused` before the row survives `[SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:1084]`, and the fixture pins the withheld rows `[SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/fixtures/deep-loop-offer-cases.json:138]`.

### **"A second typed command hides the first" (REQ-025 regression).** Ruled out: the deep gate reads `typedCommandsIn(prompt).includes(...)` and the served head walks the same ordered list `[SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:1320]`, `[SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:305]`. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **"A second typed command hides the first" (REQ-025 regression).** Ruled out: the deep gate reads `typedCommandsIn(prompt).includes(...)` and the served head walks the same ordered list `[SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:1320]`, `[SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:305]`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **"A second typed command hides the first" (REQ-025 regression).** Ruled out: the deep gate reads `typedCommandsIn(prompt).includes(...)` and the served head walks the same ordered list `[SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:1320]`, `[SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:305]`.

### **"The refusal lead also swallows the idiom controls" ("don't forget/hesitate to run a deep review").** Ruled out: the lead allows at most two words before the loop name, and both idioms place four `[SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:581]`; the fixture pins both as asks `[SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/fixtures/deep-loop-offer-cases.json:136]`, `[SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/fixtures/deep-loop-offer-cases.json:137]`. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **"The refusal lead also swallows the idiom controls" ("don't forget/hesitate to run a deep review").** Ruled out: the lead allows at most two words before the loop name, and both idioms place four `[SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:581]`; the fixture pins both as asks `[SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/fixtures/deep-loop-offer-cases.json:136]`, `[SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/fixtures/deep-loop-offer-cases.json:137]`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **"The refusal lead also swallows the idiom controls" ("don't forget/hesitate to run a deep review").** Ruled out: the lead allows at most two words before the loop name, and both idioms place four `[SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:581]`; the fixture pins both as asks `[SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/fixtures/deep-loop-offer-cases.json:136]`, `[SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/fixtures/deep-loop-offer-cases.json:137]`.

### **"The stage-one lane still boosts a past-run pass count."** Ruled out: `passesAsked` requires `asksForLoopRun` or `isStuckRunComplaint` `[SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts:454]`. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **"The stage-one lane still boosts a past-run pass count."** Ruled out: `passesAsked` requires `asksForLoopRun` or `isStuckRunComplaint` `[SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts:454]`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **"The stage-one lane still boosts a past-run pass count."** Ruled out: `passesAsked` requires `asksForLoopRun` or `isStuckRunComplaint` `[SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts:454]`.

### **A `run` policy reaching a `/deep:*` command.** Ruled out: both deep commands are `ask` in the table and the scorer row, and the renderer's offer branch requires `ask` `[SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:137]`. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **A `run` policy reaching a `/deep:*` command.** Ruled out: both deep commands are `ask` in the table and the scorer row, and the renderer's offer branch requires `ask` `[SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:137]`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A `run` policy reaching a `/deep:*` command.** Ruled out: both deep commands are `ask` in the table and the scorer row, and the renderer's offer branch requires `ask` `[SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:137]`.

### **A comment that has gone stale in the code.** Ruled out for the gate comments; the stale prose lives in the closure record (the active P1). -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **A comment that has gone stale in the code.** Ruled out for the gate comments; the stale prose lives in the closure record (the active P1).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A comment that has gone stale in the code.** Ruled out for the gate comments; the stale prose lives in the closure record (the active P1).

### **A dead or unreachable sixth-round branch.** Ruled out: every new predicate is reachable from `attachCommand`, `withholdDeepLoopDoctorWithoutRun`, `degradedRecommendations` or the Python gate. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **A dead or unreachable sixth-round branch.** Ruled out: every new predicate is reachable from `attachCommand`, `withholdDeepLoopDoctorWithoutRun`, `degradedRecommendations` or the Python gate.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A dead or unreachable sixth-round branch.** Ruled out: every new predicate is reachable from `attachCommand`, `withholdDeepLoopDoctorWithoutRun`, `degradedRecommendations` or the Python gate.

### **A false `Met` on the sixth-round rows.** Ruled out: AC-030 to AC-039 and AC-041 rest on fixture columns, test files and code lines that exist; only the pointer precision fails. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **A false `Met` on the sixth-round rows.** Ruled out: AC-030 to AC-039 and AC-041 rest on fixture columns, test files and code lines that exist; only the pointer precision fails.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A false `Met` on the sixth-round rows.** Ruled out: AC-030 to AC-039 and AC-041 rest on fixture columns, test files and code lines that exist; only the pointer precision fails.

### **A missing completion message or next step.** Ruled out: both YAML lists carry them at the cited lines. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **A missing completion message or next step.** Ruled out: both YAML lists carry them at the cited lines.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A missing completion message or next step.** Ruled out: both YAML lists carry them at the cited lines.

### **A missing near-miss or holdout row.** Ruled out: 31 near-miss rows and three `-04` deep holdout ids are present. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **A missing near-miss or holdout row.** Ruled out: 31 near-miss rows and three `-04` deep holdout ids are present.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A missing near-miss or holdout row.** Ruled out: 31 near-miss rows and three `-04` deep holdout ids are present.

### **A missing or miscounted checklist box.** Ruled out: 26 boxes, 25 ticked, and the one open box is CHK-020 for AC-040. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **A missing or miscounted checklist box.** Ruled out: 26 boxes, 25 ticked, and the one open box is CHK-020 for AC-040.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A missing or miscounted checklist box.** Ruled out: 26 boxes, 25 ticked, and the one open box is CHK-020 for AC-040.

### **A probe-group regression.** Ruled out by direct comparison with `results-spec-baseline.json` and `results-fresh-review.json`. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **A probe-group regression.** Ruled out by direct comparison with `results-spec-baseline.json` and `results-fresh-review.json`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A probe-group regression.** Ruled out by direct comparison with `results-spec-baseline.json` and `results-fresh-review.json`.

### **A refused stuck complaint keeping the doctor row.** Ruled out in both copies, and pinned by seven Python cases `[SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/python/test_skill_advisor.py:2943]`. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **A refused stuck complaint keeping the doctor row.** Ruled out in both copies, and pinned by seven Python cases `[SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/python/test_skill_advisor.py:2943]`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A refused stuck complaint keeping the doctor row.** Ruled out in both copies, and pinned by seven Python cases `[SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/python/test_skill_advisor.py:2943]`.

### **An unbacked waiver.** Ruled out: ADR-001, ADR-002 and ADR-003 each exist and state their row. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **An unbacked waiver.** Ruled out: ADR-001, ADR-002 and ADR-003 each exist and state their row.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **An unbacked waiver.** Ruled out: ADR-001, ADR-002 and ADR-003 each exist and state their row.

### **An unbounded new read on every prompt.** Ruled out: the two windows bound the new scans, and the 10,000-unit head bounds the Python gate. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **An unbounded new read on every prompt.** Ruled out: the two windows bound the new scans, and the 10,000-unit head bounds the Python gate.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **An unbounded new read on every prompt.** Ruled out: the two windows bound the new scans, and the 10,000-unit head bounds the Python gate.

### **An unrecorded open task.** Ruled out: T084 is the only open box and the Completion Criteria name it. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **An unrecorded open task.** Ruled out: T084 is the only open box and the Completion Criteria name it.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **An unrecorded open task.** Ruled out: T084 is the only open box and the Completion Criteria name it.

### **Prompt-as-instruction injection through the brief.** Ruled out: the gate treats the prompt only as text; nothing echoes it into the brief, and every label that does reach the brief is sanitized `[SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/render.ts:163]`. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **Prompt-as-instruction injection through the brief.** Ruled out: the gate treats the prompt only as text; nothing echoes it into the brief, and every label that does reach the brief is sanitized `[SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/render.ts:163]`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Prompt-as-instruction injection through the brief.** Ruled out: the gate treats the prompt only as text; nothing echoes it into the brief, and every label that does reach the brief is sanitized `[SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/render.ts:163]`.

### **Shell injection through the prompt.** Ruled out: the prompt goes over stdin and the child is spawned with an argument array and no shell `[SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/subprocess.ts:283]`. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **Shell injection through the prompt.** Ruled out: the prompt goes over stdin and the child is spawned with an argument array and no shell `[SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/subprocess.ts:283]`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Shell injection through the prompt.** Ruled out: the prompt goes over stdin and the child is spawned with an argument array and no shell `[SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/subprocess.ts:283]`.

<!-- /ANCHOR:exhausted-approaches -->
## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

## 11. RULED OUT DIRECTIONS

- The two cross-runtime constants are duplicated literals with no parity assertion (iteration 5, evidence: `command-attach.ts:592`, `skill_advisor.py:4886`).
- A dead sixth-round branch or a stale code comment: every predicate has a live caller (iteration 5, evidence: `command-attach.ts:1319`).
- Thirteen `Met` rows point one to nine lines off the observation they name; the observations exist (iteration 4, evidence: `acceptance-criteria.md:58`, `implementation-summary.md:153`).
- Unbacked waivers or a miscounted checklist: three waiver ADRs exist and the summary matches the boxes (iteration 4, evidence: `tasks.md:291`).
- The REQ-011 alias clause: two of three aliases in the hub files; the drop is recorded only in the scratch decision log (iteration 3, evidence: `spec.md:223`, `hub-router.json:34`, `scratch/decisions.md:16`).
- A probe, keep, negative, stage-one or corpus regression: groups match their baselines (iteration 3, evidence: `results-after.json`, `results-spec-baseline.json`, `command-routing-baseline.json`).
- The brief echoing prompt text as an instruction: no prompt text reaches a rendered label (iteration 2, evidence: `render.ts:163`, `subprocess.ts:306`).
- A `run` policy on a `/deep:*` command: both rows are `ask` (iteration 2, evidence: `command-attach.ts:137`, `render.ts:250`).
- A second typed command hiding the first (iteration 1, evidence: `command-attach.ts:1320`, `command-attach.ts:305`).
- The refusal lead swallowing the idiom controls "don't forget/hesitate to run a deep review" (iteration 1, evidence: `command-attach.ts:581`, fixture `:136` and `:137`).
- A refusing stuck complaint keeping the fused doctor row (iteration 1, evidence: `fusion.ts:1084`, fixture `:138`).
- The stage-one lane boosting a past-run pass count (iteration 1, evidence: `explicit.ts:454`).

<!-- ANCHOR:next-focus -->
## 12. NEXT FOCUS
- None. Terminal iteration: the cap (5) was reached and synthesis follows.
- Reviewed dimensions: correctness (1), security (2), traceability (3, 4), maintainability (5).
- Carry-forward: `R1-P1-001` active; `R1-P2-002`, `R3-P2-003`, `R4-P2-004`, `R5-P2-005` active; `spec_code: partial`, `checklist_evidence: partial`.
<!-- /ANCHOR:next-focus -->
## 13. KNOWN CONTEXT

### Bounded Context Snapshot

- Target pointers: 46 scope files under `.skilled/skills/system-skill-advisor/runtime/`, `.skilled/commands/deep/`, `.skilled/skills/system-deep-loop/`, plus the packet docs at `specs/system-skill-advisor/routing-and-scoring/012-*` and `013-*`.
- Behaviour claims to verify: REQ-001 to REQ-034 in `spec.md`; AC-001 to AC-042 in `acceptance-criteria.md`; T001 to T085 in `tasks.md`; ADR-001 to ADR-006 in `decision-record.md`.
- Reuse and conventions: the TypeScript gate is authoritative; the Python copy in `skill_advisor.py` mirrors it; the shared fixture `tests/fixtures/deep-loop-offer-cases.json` is read by both suites.
- Review risks: the recorded suite, probe and corpus numbers cannot be re-run inside this lineage's write surface, so a `Met` row that rests only on a count is checked for a recorded observation with a matching line, not by execution.

## 14. CROSS-REFERENCE STATUS
<!-- MACHINE-OWNED: START -->
| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | partial | 3, 5 | REQ-001 to REQ-034 mapped; REQ-011's third alias absent with only a scratch-log decision (R3-P2-003) |
| `checklist_evidence` | core | partial | 4, 5 | 42 acceptance rows resolved; thirteen Met-row evidence pointers drifted (R4-P2-004) |
| `skill_agent` | overlay | notApplicable | - | the packet claims no skill or agent definition |
| `agent_cross_runtime` | overlay | notApplicable | - | no agent mirror is named |
| `feature_catalog_code` | overlay | notApplicable | - | no feature-catalog entry is claimed |
| `playbook_capability` | overlay | notApplicable | - | no playbook entry is claimed |
<!-- MACHINE-OWNED: END -->

## 15. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->
| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| [seeded from reviewScopeFiles] | - | - | - | not-started |
<!-- MACHINE-OWNED: END -->

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 5
- Convergence threshold: 0.1
- Stop policy: max-iterations
- Session lineage: sessionId=fanout-deepseek-max-3-1795511183570-92w0ez, parentSessionId=2026-11-24T09:06:03.000Z, generation=3, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Per-iteration budget: 24 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=[spec_code, checklist_evidence], overlay=[skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability]
- Started: 2026-11-24T09:08:04.000Z
<!-- MACHINE-OWNED: END -->

---

## 17. OUTCOME (terminal)

- Verdict: **FAIL** (recomputed from the findings registry and the terminal-gates row; `coverage` failed, `evidence` and `scope` passed)
- Stop reason: `maxIterationsReached` (cap 5, `stopPolicy: max-iterations`)
- Active findings: P0 = 0, P1 = 1, P2 = 4; resolved: 0; search debt: 0
- Release-readiness state: `in-progress`
- Report: `review-report.md` in this lineage directory
