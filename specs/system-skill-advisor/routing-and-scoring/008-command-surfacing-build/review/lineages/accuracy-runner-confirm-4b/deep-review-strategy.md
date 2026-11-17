---
title: Deep Review Strategy - accuracy-runner-confirm-4b lineage
description: Runtime strategy tracking the confirming review of pass-four fixes in the accuracy-runner area of command surfacing.
version: 1.11.14.0
---

# Deep Review Strategy - accuracy-runner-confirm-4b lineage

## 1. OVERVIEW

### Purpose

Persistent brain for this fan-out lineage. It records which dimensions remain, what was found
(P0/P1/P2), which review approaches worked or failed, and where to focus next. Read at every
iteration before any review action.

### Ownership

Machine-managed metrics and coverage blocks are wrapped in explicit ownership anchors. Human
commentary and operator overrides live outside those anchors.

---

## 2. TOPIC

Confirming round of review pass four of `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build`
in the `accuracy-runner` area. Scope: the nine changed paths listed in
`review/review-scope-4b.txt` whose area is `accuracy-runner` — the Codex session reader and its
test, the routing-accuracy offer/runner pair and their tests, and the doctor presentation row —
plus shared docs that describe them. The change range is `11af224a34..48f03b5013`.

The operator focus is the pass-four confirming brief: read `review-brief-4b.txt` first; confirm
that a refusal over an or-list and an is-the question carry no command while a request over a
list keeps its command; that both run-log writers keep `offeredAs`; that a shell read of a
command document counts as a start while a search, an in-place `sed`, a redirect and a heredoc
line do not; that a heredoc end word with a hyphen or a dot closes correctly; that the Codex
reader opens the resolved file; that the holdout guard reads the live capture; and that docs
agree with code. Holdout prompt text is never read or printed.

---

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
[All dimensions complete]

<!-- /ANCHOR:review-dimensions -->

---

## 4. NON-GOALS

- The attach module, scorer fusion, recommend handler and feature docs in the `scorer-attach`
  area are the `scorer-attach-confirm-4b` lineage's scope. This lineage reads them only as
  context evidence and raises no finding against them.
- Holdout prompt text is never read or printed. Corpus work is limited to counts and
  `jq 'del(.prompt)'` rows.
- No code changes: review is observation-only.
- No runtime command, build, test run or generator is executed; every claim is grounded in a
  direct file read of the changed commit.

---

## 5. STOP CONDITIONS

- Convergence: `newFindingsRatio` at or below the 0.10 threshold with no active P0.
- Cap: `maxIterations` 3.
- Stuck: two consecutive iterations with no new evidence (stuckThreshold 2).
- Any active P0 blocks PASS regardless of convergence.

---

<!-- ANCHOR:completed-dimensions -->
## 4. COMPLETED DIMENSIONS
- [x] correctness
- [x] security
- [x] traceability
- [x] maintainability

<!-- /ANCHOR:completed-dimensions -->

---

<!-- ANCHOR:running-findings -->
## 5. RUNNING FINDINGS
- P0 (Blockers): 0
- P1 (Required): 0
- P2 (Suggestions): 2
- Resolved: 0

<!-- /ANCHOR:running-findings -->

---

## 8. WHAT WORKED

- Reading both writers side by side against the one reader that consumes `offeredAs` closed the
  P1 question without a test run: the field is present on every path that writes a line and the
  reader is the only consumer. (iteration 1)
- Tracing the brief-only branch separately caught the legacy-line behavior before it was mistaken
  for a dropped field. (iteration 1)
- Reading the containment helper instead of the reader alone proved the Codex read lands on the
  path `realpathSync` produced, and the changed test asserts both the link miss and the resolved
  hit. (iteration 2)
- Checking the holdout guard by row id rather than by prompt text kept the rule while proving
  the G2 fixed table holds no corpus row. (iteration 2)
- Comparing the README's two backfill field lists against both writers and the output-log
  sentence made the stale count visible without running the harness. (iteration 3)
- Following the head-moved early return showed the blanket "every line" sentence is false on the
  one exit-3 path the README documents. (iteration 3)

---

## 9. WHAT FAILED

- Nothing failed in iteration 1; the changed writer surface is four small functions and every
  branch was readable directly. (iteration 1)
- Two clean iterations at ratio 0.0 reached the stuck threshold, so the loop schedules a
  recovery pass instead of treating the silence as convergence: dimension coverage is only 2 of 4. (iteration 2)
- The recovery pass found documentation drift rather than code drift; the two P2s are in the
  README that phase 027 T012/T013 edited, not in the writers themselves. (iteration 3)

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### **A holdout row can reach a live turn through the fixed G2 table.** Ruled out by id: the G2 -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **A holdout row can reach a live turn through the fixed G2 table.** Ruled out by id: the G2
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A holdout row can reach a live turn through the fixed G2 table.** Ruled out by id: the G2

### **A link inside the store can escape the store.** Ruled out: `resolveInside` realpaths both -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **A link inside the store can escape the store.** Ruled out: `resolveInside` realpaths both
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A link inside the store can escape the store.** Ruled out: `resolveInside` realpaths both

### **The A11 row contradicts the doctor check.** Ruled out: the checker's malformed message names -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **The A11 row contradicts the doctor check.** Ruled out: the checker's malformed message names
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The A11 row contradicts the doctor check.** Ruled out: the checker's malformed message names

### **The backfill paragraph's "three fields" is correct for `--brief-only`.** Ruled out: the -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **The backfill paragraph's "three fields" is correct for `--brief-only`.** Ruled out: the
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The backfill paragraph's "three fields" is correct for `--brief-only`.** Ruled out: the

### **The Codex reader still opens the caller's locator.** Ruled out: `codex.mjs:169` reads -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **The Codex reader still opens the caller's locator.** Ruled out: `codex.mjs:169` reads
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The Codex reader still opens the caller's locator.** Ruled out: `codex.mjs:169` reads

### **The live capture publishes a holdout row.** Ruled out in the sibling area by -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **The live capture publishes a holdout row.** Ruled out in the sibling area by
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The live capture publishes a holdout row.** Ruled out in the sibling area by

### **The output-log sentence still omits `offeredAs`.** Ruled out: `README.md:188` lists it. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **The output-log sentence still omits `offeredAs`.** Ruled out: `README.md:188` lists it.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The output-log sentence still omits `offeredAs`.** Ruled out: `README.md:188` lists it.

### **The top attribution list still says three fields.** Ruled out: `README.md:65` says four and -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **The top attribution list still says three fields.** Ruled out: `README.md:65` says four and
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The top attribution list still says three fields.** Ruled out: `README.md:65` says four and

### `agent_cross_runtime` -- notApplicable. No runtime branch in the changed docs or writers. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: `agent_cross_runtime` -- notApplicable. No runtime branch in the changed docs or writers.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `agent_cross_runtime` -- notApplicable. No runtime branch in the changed docs or writers.

### `agent_cross_runtime`: pending. No agent definition changed. -- BLOCKED (iteration 2, 2 attempts)
- What was tried: `agent_cross_runtime`: pending. No agent definition changed.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `agent_cross_runtime`: pending. No agent definition changed.

### `checklist_evidence` -- partial. `CHK-040` (tasks.md:244) asks `RA` to name `offeredAs` in both -- BLOCKED (iteration 3, 1 attempts)
- What was tried: `checklist_evidence` -- partial. `CHK-040` (tasks.md:244) asks `RA` to name `offeredAs` in both
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `checklist_evidence` -- partial. `CHK-040` (tasks.md:244) asks `RA` to name `offeredAs` in both

### `checklist_evidence`: pending. No checklist row in this area is claimed by iteration 1. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `checklist_evidence`: pending. No checklist row in this area is claimed by iteration 1.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `checklist_evidence`: pending. No checklist row in this area is claimed by iteration 1.

### `checklist_evidence`: pending. No checklist row in this area is claimed by iteration 2. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: `checklist_evidence`: pending. No checklist row in this area is claimed by iteration 2.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `checklist_evidence`: pending. No checklist row in this area is claimed by iteration 2.

### `feature_catalog_code` -- notApplicable. No feature-catalog page describes the two changed -- BLOCKED (iteration 3, 1 attempts)
- What was tried: `feature_catalog_code` -- notApplicable. No feature-catalog page describes the two changed
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `feature_catalog_code` -- notApplicable. No feature-catalog page describes the two changed

### `feature_catalog_code`: pending, the README drift is scheduled for iteration 3. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `feature_catalog_code`: pending, the README drift is scheduled for iteration 3.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `feature_catalog_code`: pending, the README drift is scheduled for iteration 3.

### `feature_catalog_code`: pending. The README drift is scheduled for iteration 3. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: `feature_catalog_code`: pending. The README drift is scheduled for iteration 3.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `feature_catalog_code`: pending. The README drift is scheduled for iteration 3.

### `playbook_capability` -- notApplicable. No playbook surface changed. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: `playbook_capability` -- notApplicable. No playbook surface changed.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `playbook_capability` -- notApplicable. No playbook surface changed.

### `playbook_capability`: notApplicable. No playbook surface changed. -- BLOCKED (iteration 2, 2 attempts)
- What was tried: `playbook_capability`: notApplicable. No playbook surface changed.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `playbook_capability`: notApplicable. No playbook surface changed.

### `skill_agent` -- notApplicable. No agent definition changed. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: `skill_agent` -- notApplicable. No agent definition changed.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `skill_agent` -- notApplicable. No agent definition changed.

### `spec_code` -- partial. Phase 027 T006, T007, T010, T012, T013 and T017 are marked `[x]` with -- BLOCKED (iteration 3, 1 attempts)
- What was tried: `spec_code` -- partial. Phase 027 T006, T007, T010, T012, T013 and T017 are marked `[x]` with
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `spec_code` -- partial. Phase 027 T006, T007, T010, T012, T013 and T017 are marked `[x]` with

### `spec_code`: partial. The Codex reader now follows the same containment pattern as -- BLOCKED (iteration 2, 1 attempts)
- What was tried: `spec_code`: partial. The Codex reader now follows the same containment pattern as
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `spec_code`: partial. The Codex reader now follows the same containment pattern as

### `spec_code`: partial. The phase 026 T024 claim that a start is read from the same reads a load -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `spec_code`: partial. The phase 026 T024 claim that a start is read from the same reads a load
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `spec_code`: partial. The phase 026 T024 claim that a start is read from the same reads a load

### A missing `offeredAs` on the backfill writer: ruled out by `command-offer.mjs:496`. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: A missing `offeredAs` on the backfill writer: ruled out by `command-offer.mjs:496`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A missing `offeredAs` on the backfill writer: ruled out by `command-offer.mjs:496`.

### A missing `offeredAs` on the live writer: ruled out by `run-command-behaviour.mjs:1203` and -- BLOCKED (iteration 1, 1 attempts)
- What was tried: A missing `offeredAs` on the live writer: ruled out by `run-command-behaviour.mjs:1203` and
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A missing `offeredAs` on the live writer: ruled out by `run-command-behaviour.mjs:1203` and

### A partner-side command still counted as an offer: ruled out by -- BLOCKED (iteration 1, 1 attempts)
- What was tried: A partner-side command still counted as an offer: ruled out by
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A partner-side command still counted as an offer: ruled out by

<!-- /ANCHOR:exhausted-approaches -->

---

## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

## 11. RULED OUT DIRECTIONS

- [Populated when an iteration rules a direction out, with its evidence]

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- Dimension: none remaining within the cap; synthesis - Focus area: compile the lineage report from the registry, the three deltas and the documentation findings. - Reason: three iterations are complete, two clean code dimensions and two P2 doc drifts; the cap is reached without a legal convergence stop. - Rotation status: correctness and security complete; traceability and maintainability covered by the recovery pass (partial, because the packet's checklist is still open). - Required evidence: the registry's active counts, the three iteration final lines and the synthesis report. - Blocked/productive carry-forward: no blocked approach. - Recovery note: the recovery pass changed granularity to line-level doc claims and produced the two findings.

<!-- /ANCHOR:next-focus -->

---

## 13. KNOWN CONTEXT

### Bounded Context Snapshot

- Target pointers: the nine `accuracy-runner` paths in `review/review-scope-4b.txt`; the fix
  commit `48f03b5013`; the verify report `review/verify-4/report.md`.
- Behavior claims: `offeredAs` travels with an offer through both writers; a partner-side
  command is not counted as an offer; a Codex rollout link is read at its resolved path; an A11
  malformed router row is fixed by hand rather than by embed.
- Reuse and conventions: the reader containment pattern already used by `claude.mjs`; the
  `P0/P1/P2` scale; the delta + iteration narrative pair; the append gateway as sole state-log
  writer.
- Review risks and gaps: no live per-runtime session was captured in this lineage, so runtime
  behaviour is read from code and tests. The scorer and corpus are a sibling lineage's surface;
  this lineage reads them only to check the docs it owns.

---

<!-- ANCHOR:cross-reference-status -->
## 14. CROSS-REFERENCE STATUS

| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | partial | 3 | Phase 027 T006/T007/T010/T012/T013/T017 are [x] with evidence; T012's both-field-lists claim misses the backfill paragraph and runner row. |
| `checklist_evidence` | core | partial | 3 | CHK-040's two edited lists are correct; the backfill lists remain stale, and CHK-FIX-003/004 stay open with the phase. |
| `skill_agent` | overlay | notApplicable | 2 | No agent definition changed in this area. |
| `agent_cross_runtime` | overlay | notApplicable | 2 | No runtime branch in the changed docs or writers; the Codex reader is shared and tested directly. |
| `feature_catalog_code` | overlay | notApplicable | 3 | No feature-catalog page describes the two changed writers. |
| `playbook_capability` | overlay | notApplicable | 1 | No playbook surface changed. |

<!-- /ANCHOR:cross-reference-status -->

---

## 15. FILES UNDER REVIEW

| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-offer.mjs` | D1 | 1 | 0 | reviewed |
| `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/run-command-behaviour.mjs` | D1, D3 | 3 | 0 code; 1 doc | reviewed |
| `.skilled/hooks/shared/session-readers/codex.mjs` | D2 | 2 | 0 | reviewed |
| `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/README.md` | D3, D4 | 3 | 2 P2 | reviewed |
| `.skilled/commands/doctor/assets/doctor-agents-md-presentation.txt` | D3 | 3 | 0 | reviewed |
| `.skilled/hooks/shared/session-readers/codex.d.mts.map` | D2 | 2 | 0 | generated, no review finding |
| `.skilled/hooks/shared/tests/session-readers/codex.test.mjs` | D2 | 2 | 0 | reviewed |
| `.skilled/skills/system-skill-advisor/runtime/tests/command-behaviour-guards.vitest.ts` | D1 | 1 | 0 | reviewed |
| `.skilled/skills/system-skill-advisor/runtime/tests/command-offer.vitest.ts` | D1 | 1 | 0 | reviewed |

---

## 16. REVIEW BOUNDARIES

- Max iterations: 3
- Convergence threshold: 0.10
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=fanout-accuracy-runner-confirm-4b-1794680176420-xvj4ed,
  parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 12 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=[spec_code, checklist_evidence],
  overlay=[skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability]
- Started: 2026-11-14T18:24:38Z
