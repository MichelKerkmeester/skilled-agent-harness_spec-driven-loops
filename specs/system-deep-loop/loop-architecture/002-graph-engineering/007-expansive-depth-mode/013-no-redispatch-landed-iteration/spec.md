---
title: "Feature Specification: Stop redispatch_once from re-running an iteration that already landed"
description: "Both deep-loop workflow YAMLs re-dispatch an iteration on the first verify failure of any reason, so an executor_missing failure re-runs an iteration whose narrative, state record and delta already landed and burns a full dispatch. This phase adds a reason filter to redispatch_once in both YAMLs."
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
| **Predecessor** | None (independent slice, depends on: none) |
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
An `executor_missing` failure goes straight to the existing still-fails path without a second dispatch, while a failure where the iteration did not land still gets its one redispatch.
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
- Add a reason filter to `post_dispatch_validate.on_failure.redispatch_once` in `deep-research.yaml` (line 1539) so `executor_missing` skips the redispatch and takes the existing still-fails path.
- Add the same filter to `deep-review.yaml` (line 1634), worded the same way.
- Add a reason-table case to `verify-iteration.vitest.ts` showing `executor_missing` is returned only when the narrative, state record and delta are present.
- Add a YAML-reading assertion that both redispatch rules name the excluded reason.

### Out of Scope
- Any change to `verify-iteration.cjs` - research §20 Slice M states the verify gate already tells the cases apart.
- Route-proof reasons - an append-only redispatch can correct a route-proof mismatch, and the existing case "uses the latest record when an append-only redispatch added a corrected one" depends on that path.
- Other reasons returned after the delta check (`findings_not_enumerated`, `gateway_bypass_detected`, `ledger_backing_missing`) - whether they also skip the redispatch is an open question, and widening the filter goes beyond D14.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/commands/deep/assets/deep-research.yaml` | Modify | reason filter in `redispatch_once` (line 1539) |
| `.skilled/commands/deep/assets/deep-review.yaml` | Modify | reason filter in `redispatch_once` (line 1634) |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/verify-iteration.vitest.ts` | Modify | reason-table case and YAML-reading assertion on both files, following the file-reading pattern of `stop-policy-yaml-parity.vitest.ts` |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
<!-- FILL: Write one testable requirement per row. Name the exact command or output. GOOD: With 10 archives, `bash scripts/rotate-logs.sh --keep 3` exits 0 and `ls logs/archive | wc -l` prints 3. WEAK: The option should work well. -->
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The research `redispatch_once` rule does not re-dispatch on `executor_missing`, and sends that failure to the existing still-fails path. | A YAML-reading assertion finds `executor_missing` named as excluded in the `deep-research.yaml` redispatch rule; the assertion fails on the current file. |
| REQ-002 | The review `redispatch_once` rule carries the same exclusion. | The same assertion passes on `deep-review.yaml` and fails on the current file. |
| REQ-003 | A failure where the iteration did not land (`iteration_file_missing`, `state_record_missing`, `delta_file_missing`) still re-dispatches exactly once. | The assertion checks that neither rule excludes these three reasons, and both rules still say "Never re-dispatch a given iteration more than once". |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | `executor_missing` is returned only when the narrative, state record and delta are all present. | A reason-table case in `verify-iteration.vitest.ts` removes each of the three artifacts in turn from an `executor_missing` fixture and asserts the reason changes to `iteration_file_missing`, `state_record_missing` and `delta_file_missing`. |
| REQ-005 | The route-proof redispatch path is unchanged. | The existing case "uses the latest record when an append-only redispatch added a corrected one" passes unchanged. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
<!-- FILL: Write one measurable outcome per line. A command can prove it. GOOD: With 10 archives in `logs/archive`, `bash scripts/rotate-logs.sh --keep 3` leaves 3. WEAK: The feature is successful. -->

- **SC-001**: `npx vitest run runtime/tests/unit/verify-iteration.vitest.ts runtime/tests/unit/stop-policy-yaml-parity.vitest.ts` exits 0 with the new cases included.
- **SC-002**: `grep -n 'redispatch_once:.*executor_missing' .skilled/commands/deep/assets/deep-research.yaml .skilled/commands/deep/assets/deep-review.yaml` prints one line per file; before the change it prints nothing.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES
<!-- FILL: Name one dependency and one risk. Give each a concrete mitigation. GOOD: A script that reads `--keep` with no value could delete every archive. Mitigation: reject a missing value with exit 2 and test it. WEAK: There may be some risk. -->

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | None. Slice M depends on no other slice (research §20). | None | None needed |
| Risk | The filter is prose the orchestrator reads, so a wording the orchestrator misreads would still re-dispatch, or stop a needed one. | Low: default-path risk is LOW per research §20 | Name the excluded reason literally in both files, keep the two rules worded the same, and assert both in one test. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS
<!-- FILL: Write each open question as one line. Write `None` when nothing blocks. GOOD: Does a missing `--keep` value delete every archive? Decision: no, a missing value exits 2. WEAK: Edge cases are unclear. -->

- Should `findings_not_enumerated`, `gateway_bypass_detected` and `ledger_backing_missing`, which are also returned after the delta check, skip the redispatch too? Recorded in `goal.md`; this phase excludes only `executor_missing`.
<!-- /ANCHOR:questions -->

---
