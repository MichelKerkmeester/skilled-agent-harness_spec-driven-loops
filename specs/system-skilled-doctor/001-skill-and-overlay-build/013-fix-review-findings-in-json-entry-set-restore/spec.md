---
title: "Feature Specification: Phase 13: fix-review-findings-in-json-entry-set-restore"
description: "A fresh review of the json-entry set restore found seven problems, all reproduced. The worst wrote one array item's value into another item during a re-pin and still printed RESULT: PASSED."
trigger_phrases:
  - "fix review findings in json entry set restore"
  - "phase 13 fix review findings in json entry"
  - "cannot-apply overlay state"
  - "json entry restore item identity check"
importance_tier: "important"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 13: fix-review-findings-in-json-entry-set-restore

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-11-16 |
| **Branch** | `worktrees/425-repin-engine-limits-intake` |
| **Parent Spec** | ../spec.md |
| **Phase** | 13 of 14 |
| **Predecessor** | 012-fix-barter-022-handover-items-for-doctor-scripts |
| **Successor** | 014-harden-overlay-engine-from-fable-review |
| **Handoff Criteria** | `node --test .skilled/commands/doctor/scripts/tests` prints `fail 0` with the sixteen new tests in the count |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 13** of the skill and overlay build. It fixes the seven findings a fresh Opus review reported against the set restore phase 11 shipped at `35d49e8f638`.

**Scope Boundary**: the restore of dropped `set` records, the re-pin's reading of the pinned copy, the report state for a json-entry plan problem, and the docs that describe them.

**Dependencies**:
- Phase 11's `sets` record in `sync-state.json`.

**Deliverables**:
- Engine and test changes in the overlay engine, the overlay reference and the doctor overlay command assets.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The restore checked only that an array held the same number of items in the live file and in the pin. A file the re-pin did not copy stayed on the old base, so after upstream swapped two items the re-pin wrote item A's value into item B and printed `RESULT: PASSED`. Six smaller problems made refusals wrong, late, impossible to clear or mislabeled.

### Purpose
A dropped `set` either returns the value the pin holds at the same item, or the engine refuses before it writes anything, with advice that clears the refusal.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ node review3/p05b-stale-base-excluded-path.cjs      (engine at 35d49e8f638)
--- repin with the set dropped: exit=0
    RESULT: PASSED
    live rows after repin = [{"id":"A","top":"a"},{"id":"B","top":"a"}]
    item B top = "a" (B's own value is "b")

$ node review3/p01-nested-sets-dropped-together.cjs
--- apply with both sets removed: exit=1
    both-changed baseline.json  ...  fix: resolve skilled-overlays/json/baseline.json and baseline.json, then run ... status
    BLOCKED  baseline-set: ... dropped set at rows.a.top was edited after it was applied
```
The review reproduced all seven findings with the probes in its report.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Refuse a restore through an array index unless the item at that index is the pin's item, apart from values this overlay's sets wrote into it.
- Read the new commit for a re-pin destination the copy leaves in place, and refuse before the backup when its entry set cannot be applied at the new pin.
- Restore nested dropped sets outer first, and compare index steps however they are spelled.
- Treat live bytes that hash to the entry's `pinnedSha256` as the pinned copy when no checkout can be read, and name `pin.checkout` in the refusal.
- Report an entry set that cannot be applied to an untouched file as a new `cannot-apply` state, and update the docs, including the silent cases that remain.

### Out of Scope
- Records for `setKeyOnItem` and `insertObjectKeys`. They are documented as silent cases, as phase 11 decided for `setKeyOnItem`.
- The kept-set shift, where a kept indexed set moves to the next item when an `insertItems` leaves. It is documented, not fixed.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/commands/doctor/scripts/overlay-engine.cjs` | Modify | Restore checks, reader, re-pin check, state |
| `.skilled/commands/doctor/scripts/tests/overlay-engine-sync.test.cjs` | Modify | Eight tests |
| `.skilled/commands/doctor/scripts/tests/overlay-engine-repin.test.cjs` | Modify | Two tests |
| `.skilled/skills/system-skilled-doctor/references/overlays.md` | Modify | The `sets` paragraph and the state table |
| `.skilled/commands/doctor/_routes.yaml` and `assets/doctor-overlay-{apply,status,repin}.yaml`, `assets/doctor-overlay-presentation.txt` | Modify | Name `cannot-apply` beside the other blocking states |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | A restore through an array index refuses when the pin holds another item at that index | The test `a dropped set through an array index is refused when the pin holds another item at that index` passes, and its pair test with a kept set in the same item still restores |
| REQ-002 | A re-pin never refuses a json-entry destination after its backup | The test `a re-pin stops before the backup ...` exits 2 with no run folder, and a root-level destination restores from the new commit |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Two nested sets dropped together both leave | The nested-sets test passes for both write orders, and the hand-edit pair test still refuses |
| REQ-004 | `1` and `"1"` name one path | The two index-spelling tests pass |
| REQ-005 | The no-checkout refusal names `pin.checkout` and clears once the file holds the pinned bytes | Its test passes |
| REQ-006 | The array refusal names the array whose restore clears it | The `cannot-apply` test puts that array back and the apply exits 0 |
| REQ-007 | An entry set the engine cannot apply to an untouched file is `cannot-apply`, not `both-changed` | `status --json` reports `cannot-apply` with the reason in `fix` |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `node --test .skilled/commands/doctor/scripts/tests` prints `fail 0` with 1220 tests, 1204 before plus sixteen new ones across the three build rounds.
- **SC-002**: The review's probes p01 to p06 no longer show their finding on the built engine.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The vendoring project reads state names in `--json` | Med | `cannot-apply` blocks like `both-changed`, and the handover names the new state |
| Risk | The item check refuses a case that restored before | Low | A paired test keeps a kept set in the same item restoring. A refusal writes nothing and names the array that clears it |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. The operator answered the four design questions on 2026-11-16. They are in `decision-record.md`.
<!-- /ANCHOR:questions -->

---
