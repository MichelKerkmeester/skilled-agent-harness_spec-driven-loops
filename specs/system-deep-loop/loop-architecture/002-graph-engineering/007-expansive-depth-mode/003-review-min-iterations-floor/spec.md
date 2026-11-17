---
title: "Feature Specification: Apply the configured review minIterations floor in convergence"
description: "The review config ships antiConvergence.minIterations, but convergence.cjs applies the floor only when loopType is research, so a review run configured with a floor above 2 can stop before reaching it. This phase applies the floor to review too; the shipped floor of 2 changes no default run."
trigger_phrases:
  - "review min iterations floor"
  - "apply the configured review miniterations"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Apply the configured review minIterations floor in convergence

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill every row: level, priority, status, date and branch. Use the real branch name. GOOD: Priority P1. Status Draft. Branch `feat/rotate-logs-keep`. WEAK: Priority TBD. Status maybe. -->

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Planned |
| **Created** | 2026-11-17 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Predecessor** | None (independent slice, depends on: none) |
| **Successor** | None (independent slice) |
| **Source** | `../research/research.md` §13 D3, §15, §20 Slice C |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE
<!-- FILL: State the problem in two sentences: what breaks, and for whom. GOOD: The rotate-logs script never deletes old archives, so a host that copies `logs/archive` fills its disk. WEAK: The script has issues with output. -->

### Problem Statement
The review config ships `antiConvergence.minIterations: 2`, and `stopDecisionConfig` reads it for both loop types, but the floor check in `convergence.cjs` runs only when `loopType === 'research'`. A review run configured with a floor above 2 can therefore stop on a clean candidate before it reaches that floor. With the shipped floor of 2 no default run changes, because every review stop candidate already needs two iterations (`coverageAge >= 1`); research §13 D3 corrected the earlier "stop at iteration 1" claim.

### Purpose
A review run never stops before its configured `minIterations` floor, and a run with the shipped floor stops exactly where it does today.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
<!-- FILL: Run the command this change affects and paste the command and its verbatim output. Quote every number the spec states about current behavior from this block. Write `N/A:` and a reason when no command applies. GOOD: `bash scripts/rotate-logs.sh` with 10 archives, then `ls logs/archive | wc -l` prints 10. WEAK: The script deletes old logs. -->
```text
$ grep -n "loopType === 'research' && minIterations" .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs
1159:  if (loopType === 'research' && minIterations > 1 && iterationCount < minIterations) {
$ grep -n '"minIterations"' .skilled/skills/system-deep-loop/deep-review/assets/deep-review-config.json
12:    "minIterations": 2,
```
The floor check at line 1159 is gated on research, and the shipped review floor at line 12 is 2.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE
<!-- FILL: List three to five things this change does, each starting with a verb. Before you list a new file, module, option, layer or dependency, name what fails today without it, or drop it. GOOD: Add a `--keep <n>` option that deletes all but the newest n archives in `logs/archive/`. WEAK: Update the script and docs. -->

### In Scope
- Apply the `minIterations` floor check at `convergence.cjs:1159` to review as well as research, returning `CONTINUE` with reason `minIterationsNotReached`.
- Add a configured-floor-above-2 review case to the review convergence suites, and invert the existing `stop-decision.vitest.ts` case "does not apply the iteration floor to review" (lines 905-913), which asserts today's research-only gate.
- Add the review floor to the stop-order prose in `deep-review.yaml` `step_check_convergence` and a sentence to `deep-review/README.md`, then regenerate the review compiled contract.
- Write the user-visible behavior as a manual testing playbook scenario through `/create:manual-testing-playbook`.

### Out of Scope
- A new iteration-1 review stop case built from real loop state - research §20 records that it cannot be built that way, since every review stop candidate needs `coverageAge >= 1`. The existing direct-input case in `stop-decision.vitest.ts` already builds an iteration-1 stop with `reviewInput({ iterationCount: 1, config: { minIterations: 3 } })`; it is inverted, not added.
- Changing the shipped floor in `deep-review-config.json` - the slice applies the configured value; choosing a new default is a separate decision.
- The review `BLOCKED` gate order beyond the floor - the floor runs before the gate evaluation, as it already does for research.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs` | Modify | drop the research-only condition from the floor check at line 1159 |
| `.skilled/skills/system-deep-loop/runtime/tests/integration/review-depth-convergence.vitest.ts` | Modify | configured-floor-above-2 case |
| `.skilled/skills/system-deep-loop/runtime/tests/integration/review-stop-path-replay.vitest.ts` | Modify | assert the shipped floor replays unchanged |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/stop-decision.vitest.ts` | Modify | invert the case "does not apply the iteration floor to review" (lines 905-913): it now expects `CONTINUE` with `minIterationsNotReached` |
| `.skilled/commands/deep/assets/deep-review.yaml` | Modify | add the floor to the fixed stop order in `step_check_convergence` (lines 1017-1030), after the candidate line 4 and before the gates in line 5, as research states it at `deep-research.yaml:975` |
| `.skilled/skills/system-deep-loop/deep-review/README.md` | Modify | after the sentence at line 155 that names `antiConvergence.minIterations` of 2, state that the floor holds a review run at `CONTINUE` until the iteration count reaches it |
| `.skilled/commands/deep/assets/compiled/deep-review.contract.markdown` | Regenerate | `compile-command-contracts.cjs --command deep/review --write`, because the contract digests `deep-review.yaml` |
| `.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/convergence-and-recovery/` | Modify through `/create:manual-testing-playbook` | one scenario: a review run with `minIterations: 3` does not stop before iteration 3 |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
<!-- FILL: Write one testable requirement per row. Name the exact command or output. GOOD: With 10 archives, `bash scripts/rotate-logs.sh --keep 3` exits 0 and `ls logs/archive | wc -l` prints 3. WEAK: The option should work well. -->
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | A review run with `antiConvergence.minIterations: 3` and a stop candidate at iteration 2 does not stop. | A new case in `review-depth-convergence.vitest.ts` asserts the decision is `CONTINUE` with reason `minIterationsNotReached`; the case fails on the current code. |
| REQ-002 | A review run with the shipped floor of 2 stops at the same iteration with the same decision as today. | `review-stop-path-replay.vitest.ts` passes with its existing fixtures unchanged. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | The same review run with `minIterations: 3` reaches its normal stop decision once the iteration count reaches 3. | The REQ-001 case continues to iteration 3 and asserts the decision is no longer `minIterationsNotReached`. |
| REQ-004 | Research floor behavior is unchanged. | The existing research convergence cases in the system-deep-loop vitest run pass unchanged. |
| REQ-005 | The unit stop-decision suite asserts the new review floor. | The `stop-decision.vitest.ts` case "does not apply the iteration floor to review" is renamed and inverted to expect `CONTINUE` with `minIterationsNotReached`; it fails on the current code. This is the only existing case that changes. |
| REQ-006 | The review workflow and README name the floor. | `grep -n 'minIterationsNotReached' .skilled/commands/deep/assets/deep-review.yaml` prints the stop-order line, and `grep -n 'minIterations' .skilled/skills/system-deep-loop/deep-review/README.md` prints the new sentence. |
| REQ-007 | The review compiled contract matches its sources. | `node .skilled/skills/system-deep-loop/runtime/scripts/check-contract-drift.cjs --command deep/review` exits 0. |
| REQ-008 | The behavior has a manual testing playbook scenario. | `/create:manual-testing-playbook system-deep-loop update --path .skilled/skills/system-deep-loop/deep-review/manual-testing-playbook` adds a scenario under `convergence-and-recovery/` and the package index lists it. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
<!-- FILL: Write one measurable outcome per line. A command can prove it. GOOD: With 10 archives in `logs/archive`, `bash scripts/rotate-logs.sh --keep 3` leaves 3. WEAK: The feature is successful. -->

- **SC-001**: `cd .skilled/skills/system-deep-loop/runtime && npx vitest run tests/integration/review-depth-convergence.vitest.ts tests/integration/review-stop-path-replay.vitest.ts tests/unit/stop-decision.vitest.ts` exits 0 with the new configured-floor case and the inverted review case included.
- **SC-002**: The configured-floor case and the inverted `stop-decision.vitest.ts` case fail against the pre-change `convergence.cjs`.
- **SC-003**: The full runtime suite shows one existing case changed, N cases added and no new failure against the baseline, and `check-contract-drift.cjs --command deep/review` exits 0.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES
<!-- FILL: Name one dependency and one risk. Give each a concrete mitigation. GOOD: A script that reads `--keep` with no value could delete every archive. Mitigation: reject a missing value with exit 2 and test it. WEAK: There may be some risk. -->

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | None. Slice C depends on no other slice (research §20). | None | None needed |
| Risk | An existing unit case asserts the old research-only gate (`stop-decision.vitest.ts:905-913`), so the full suite fails unless that case is inverted in the same change. | Med | REQ-005 inverts it, and the baseline is stated as one case changed plus N added. |
| Risk | Compiled-contract drift: the review contract digests `deep-review.yaml`, so `check-contract-drift` fails the full gate until it is regenerated, and phases 001, 008, 011, 012 and 013 regenerate the same file. | Med | Regenerate as the last implementation task, and regenerate again on the merged tree instead of resolving digest lines by hand. |
| Risk | A review run that today returns `BLOCKED` before the floor would return `CONTINUE` instead, which could hide a blocked gate until the floor. | Low: research §15 states Slice C changes no default run, and the shipped floor of 2 sits at or below every review stop candidate | The REQ-002 replay proves the default is unchanged; the changelog names the floor-above-2 behavior. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS
<!-- FILL: Write each open question as one line. Write `None` when nothing blocks. GOOD: Does a missing `--keep` value delete every archive? Decision: no, a missing value exits 2. WEAK: Edge cases are unclear. -->

- None. The research marks D3 low priority with no open decision.
<!-- /ANCHOR:questions -->

---
