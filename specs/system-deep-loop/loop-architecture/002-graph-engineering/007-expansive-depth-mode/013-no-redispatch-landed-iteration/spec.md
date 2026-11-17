---
title: "Feature Specification: Stop redispatch_once from re-running an iteration that already landed"
description: "Both deep-loop workflow YAMLs re-dispatch an iteration on the first verify failure of any reason, so an executor_missing failure re-runs an iteration whose narrative, state record and delta already landed and burns a full dispatch. This phase adds a reason filter to redispatch_once in both YAMLs for every non-route-proof reason returned after the delta check."
trigger_phrases:
  - "no redispatch landed iteration"
  - "stop redispatch once from re-running"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Stop redispatch_once from re-running an iteration that already landed

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill every row: level, priority, status, date and branch. Use the real branch name. GOOD: Priority P1. Status Draft. Branch `feat/rotate-logs-keep`. WEAK: Priority TBD. Status maybe. -->

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-11-17 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Predecessor** | None to build first; decided together with `../006-state-log-leaf-fields/`, which makes research `findings_not_enumerated` live and names this phase as its redispatch mitigation |
| **Successor** | None (independent slice) |
| **Source** | `../research/research.md` §13 D14, §20 Slice M |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE
<!-- FILL: State the problem in two sentences: what breaks, and for whom. GOOD: The rotate-logs script never deletes old archives, so a host that copies `logs/archive` fills its disk. WEAK: The script has issues with output. -->

### Problem Statement
`verify-iteration.cjs` returns `executor_missing` only after the narrative, state record and delta checks pass, so that reason means the iteration already landed. Both workflow YAMLs still run `redispatch_once` "On the FIRST failure of the mechanical command check", whatever the reason, so the landed iteration is dispatched again. This packet hit it live: the second leaf correctly refused to overwrite the landed iteration, and a full dispatch was spent for nothing.

### Purpose
A failure whose reason means the iteration already landed (`executor_missing`, `findings_not_enumerated`, `ledger_backing_missing`) goes straight to the existing still-fails path without a second dispatch, while a failure where the iteration did not land, or a route-proof failure, still gets its one redispatch.

The filter covers more than `executor_missing` because phase 006 widens the research upcast, which makes the research `findings_not_enumerated` gate live. That reason is returned after the delta check (`verify-iteration.cjs:533-550`), and `ledger_backing_missing` after it too (`:582-590`). Excluding only `executor_missing` would bring the wasted dispatch back for `findings_not_enumerated` as soon as 006 lands: both leaf definitions forbid overwriting an existing iteration or delta file (`.skilled/agents/deep-research.md:62`, `.skilled/agents/deep-review.md:263`), so a second leaf on a landed iteration stops without writing, as it did live for `executor_missing`. The same leaf rule applies to a route-proof failure, and `verify-iteration.cjs` picks the latest record with `findLast` (`:516`) for every reason, so an appended corrected record could in principle clear `findings_not_enumerated` as it clears route proof. Route-proof keeps its redispatch here because the plan review's rule names it as the one exception and REQ-005's existing verify-level case depends on that path, not because the two classes differ mechanically. The operator accepted the three-reason list on 2026-11-17 (`decision-record.md` ADR-001). `gateway_bypass_detected` is declared in `REASONS` (`:76`) but no code path returns it, so the filter does not name it.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
<!-- FILL: Run the command this change affects and paste the command and its verbatim output. Quote every number the spec states about current behavior from this block. Write `N/A:` and a reason when no command applies. GOOD: `bash scripts/rotate-logs.sh` with 10 archives, then `ls logs/archive | wc -l` prints 10. WEAK: The script deletes old logs. -->
```text
$ grep -n -o 'redispatch_once: "On the FIRST failure of [a-z ]*' .skilled/commands/deep/assets/deep-research.yaml .skilled/commands/deep/assets/deep-review.yaml
.skilled/commands/deep/assets/deep-review.yaml:1634:redispatch_once: "On the FIRST failure of the mechanical command check for this iteration
.skilled/commands/deep/assets/deep-research.yaml:1539:redispatch_once: "On the FIRST failure of the mechanical command check for this iteration
$ grep -n 'EXECUTOR_MISSING' .skilled/skills/system-deep-loop/runtime/scripts/verify-iteration.cjs
78:  EXECUTOR_MISSING: 'executor_missing',
573:    return { ok: false, reason: REASONS.EXECUTOR_MISSING, detail: executorMissing };
```
Both YAMLs name no reason in the redispatch rule, and `executor_missing` is returned at line 573, after the narrative (line 479), state record (line 520) and delta (line 530) checks.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE
<!-- FILL: List three to five things this change does, each starting with a verb. Before you list a new file, module, option, layer or dependency, name what fails today without it, or drop it. GOOD: Add a `--keep <n>` option that deletes all but the newest n archives in `logs/archive/`. WEAK: Update the script and docs. -->

### In Scope
- Add a reason filter to `post_dispatch_validate.on_failure.redispatch_once` in `deep-research.yaml` (line 1539) so `executor_missing`, `findings_not_enumerated` and `ledger_backing_missing` skip the redispatch and take the existing still-fails path.
- Add the same filter to `deep-review.yaml` (line 1634). The two rules differ today (review adds "(per step_evaluate_results.on_missing_outputs)"), so the new clause is one shared literal in both files: `Skip this redispatch when the failure reason is executor_missing, findings_not_enumerated or ledger_backing_missing.`
- Update the `command_note` in both YAMLs (research line 1514, review line 1590), which says any non-zero exit triggers `on_failure.redispatch_once`.
- Add a reason-table case to `verify-iteration.vitest.ts` showing `executor_missing` and `findings_not_enumerated` are returned only when the narrative, state record and delta are present.
- Add a YAML-reading assertion that both redispatch rules carry the shared literal.
- Add a fixture that pins what the reducers and `deriveLoopCounters` see when a landed iteration also gets the still-fails `status: error` row.
- Regenerate both compiled command contracts, and write the user-visible behavior as a manual testing playbook scenario through `/create:manual-testing-playbook`.

### Out of Scope
- Any change to `verify-iteration.cjs` - research §20 Slice M states the verify gate already tells the cases apart.
- Route-proof reasons - an append-only redispatch can correct a route-proof mismatch, and the existing case "uses the latest record when an append-only redispatch added a corrected one" depends on that path.
- `gateway_bypass_detected` - declared in `REASONS` but returned by no code path today; a later change that returns it decides its redispatch rule.
- Changing what the still-fails path writes for a landed iteration - recorded as an open question; this phase keeps today's end state.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/commands/deep/assets/deep-research.yaml` | Modify | reason filter in `redispatch_once` (line 1539) |
| `.skilled/commands/deep/assets/deep-review.yaml` | Modify | reason filter in `redispatch_once` (line 1634) |
| `.skilled/commands/deep/assets/deep-research.yaml`, `deep-review.yaml` | Modify | `command_note` of the verify step (research line 1514, review line 1590) names the skipped reasons |
| `.skilled/commands/deep/assets/compiled/deep-research.contract.markdown`, `deep-review.contract.markdown` | Regenerate | `compile-command-contracts.cjs --write` for both commands, because both contracts digest their YAML |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/verify-iteration.vitest.ts` | Modify | reason-table case and YAML-reading assertion on both files, reading the YAMLs with `readFileSync` the way `stop-policy-yaml-parity.vitest.ts` does |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/loop-counters-derivation.vitest.ts`, `deep-research-reduce-state.vitest.ts`, `deep-review-state-reducer.vitest.ts` | Modify | landed-plus-error-row fixture: one landed `type: iteration` record and a later `status: error` row for the same iteration number |
| `.skilled/skills/system-deep-loop/runtime/manual-testing-playbook/executor/` | Modify through `/create:manual-testing-playbook` | one scenario: a landed iteration is not dispatched a second time |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
<!-- FILL: Write one testable requirement per row. Name the exact command or output. GOOD: With 10 archives, `bash scripts/rotate-logs.sh --keep 3` exits 0 and `ls logs/archive | wc -l` prints 3. WEAK: The option should work well. -->
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The research `redispatch_once` rule does not re-dispatch on `executor_missing`, `findings_not_enumerated` or `ledger_backing_missing`, and sends those failures to the existing still-fails path. | A YAML-reading assertion finds the shared literal `Skip this redispatch when the failure reason is executor_missing, findings_not_enumerated or ledger_backing_missing.` in the `deep-research.yaml` redispatch rule; the assertion fails on the current file. |
| REQ-002 | The review `redispatch_once` rule carries the same exclusion, word for word. | The same assertion, with the same literal, passes on `deep-review.yaml` and fails on the current file. |
| REQ-003 | A failure where the iteration did not land (`iteration_file_missing`, `state_record_missing`, `delta_file_missing`) or a route-proof failure (`route_proof_missing`, `route_proof_mismatch`) still re-dispatches exactly once. | The assertion checks that neither rule names these five reasons, and both rules still say "Never re-dispatch a given iteration more than once". |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | `executor_missing` and `findings_not_enumerated` are returned only when the narrative, state record and delta are all present. | A reason-table case in `verify-iteration.vitest.ts` removes each of the three artifacts in turn from an `executor_missing` fixture and from a `findings_not_enumerated` fixture, and asserts the reason changes to `iteration_file_missing`, `state_record_missing` and `delta_file_missing`. |
| REQ-005 | The route-proof redispatch path is unchanged. | The existing case "uses the latest record when an append-only redispatch added a corrected one" passes unchanged. |
| REQ-006 | The consequence of the still-fails path for a landed iteration is pinned. | A fixture with a landed `type: iteration` record followed by the `if_other_failure` row (`status: error`, `findingsCount: 0`, `deep-research.yaml:1646-1650`) for the same iteration number shows what `deriveLoopCounters` (`convergence.cjs:1288-1342`, where the later row supersedes the earlier one) and both reducers count; the cases in `loop-counters-derivation.vitest.ts`, `deep-research-reduce-state.vitest.ts` and `deep-review-state-reducer.vitest.ts` pass and assert today's end state. |
| REQ-007 | Both `command_note` lines name the skipped reasons, and both compiled contracts match their sources. | `grep -n 'triggers on_failure.redispatch_once' .skilled/commands/deep/assets/deep-*.yaml` prints lines that name the exception, and `node .skilled/skills/system-deep-loop/runtime/scripts/check-contract-drift.cjs` exits 0. |
| REQ-008 | The behavior has a manual testing playbook scenario. | `/create:manual-testing-playbook system-deep-loop update --path .skilled/skills/system-deep-loop/runtime/manual-testing-playbook` adds a scenario under `executor/` and the package index lists it. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
<!-- FILL: Write one measurable outcome per line. A command can prove it. GOOD: With 10 archives in `logs/archive`, `bash scripts/rotate-logs.sh --keep 3` leaves 3. WEAK: The feature is successful. -->

- **SC-001**: `cd .skilled/skills/system-deep-loop/runtime && npx vitest run tests/unit/verify-iteration.vitest.ts tests/unit/loop-counters-derivation.vitest.ts tests/unit/deep-research-reduce-state.vitest.ts tests/unit/deep-review-state-reducer.vitest.ts` exits 0 with the new cases included.
- **SC-002**: `grep -n 'redispatch_once:.*executor_missing' .skilled/commands/deep/assets/deep-research.yaml .skilled/commands/deep/assets/deep-review.yaml` prints one line per file; before the change it prints nothing.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES
<!-- FILL: Name one dependency and one risk. Give each a concrete mitigation. GOOD: A script that reads `--keep` with no value could delete every archive. Mitigation: reject a missing value with exit 2 and test it. WEAK: There may be some risk. -->

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | None. Slice M depends on no other slice (research §20). | None | None needed |
| Risk | The filter is prose the orchestrator reads, so the test pins wording, not behavior; a wording the orchestrator misreads would still re-dispatch, or stop a needed one. | Low: default-path risk is LOW per research §20 | Name the excluded reasons literally in one shared clause in both files and assert both with one literal. |
| Risk | A landed iteration that fails with an excluded reason is still recorded as `status: error` by the still-fails path, and `deriveLoopCounters` lets that later row supersede the landed record, so it counts as a failure. This is today's end state too, reached one dispatch later. | Low | REQ-006 pins it with a fixture; the open question decides whether to keep the record with a warning instead. |
| Risk | Compiled-contract drift: both contracts digest their YAML, so `check-contract-drift` fails the full gate until both are regenerated, and other phases regenerate the same files. | Med | Regenerate as the last implementation task, and regenerate again on the merged tree instead of resolving digest lines by hand. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS
<!-- FILL: Write each open question as one line. Write `None` when nothing blocks. GOOD: Does a missing `--keep` value delete every archive? Decision: no, a missing value exits 2. WEAK: Edge cases are unclear. -->

- Should a landed iteration that fails with an excluded reason keep its record with a warning, instead of the still-fails `status: error` row that then counts as a failure? Recommended default: keep today's end state in this phase and pin it with the REQ-006 fixture; changing what the still-fails path writes is a separate change.
- Does the leaf's no-overwrite rule make the route-proof redispatch a no-op as well? If a second leaf always refuses a landed iteration, route-proof failures waste the dispatch too. This phase leaves route-proof unchanged (REQ-005) and records the question.
- Decided 2026-11-17 by the operator (`decision-record.md` ADR-001): `findings_not_enumerated` and `ledger_backing_missing` also skip the redispatch, because both are returned after the delta check and the leaf refuses to overwrite a landed iteration. This closes the coupling with `../006-state-log-leaf-fields/`, which makes the research `findings_not_enumerated` gate live. `gateway_bypass_detected` has no return site and is not named.
<!-- /ANCHOR:questions -->

---
