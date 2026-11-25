---
title: "Feature Specification: Phase 18: json-entry removeItems"
description: "A json-entry overlay can now remove items from an array in an upstream JSON file, so Barter no longer carries its whole .utcp_config.json as a file overlay only to delete four manuals."
trigger_phrases:
  - "json entry remove items"
  - "removeItems overlay operation"
  - "overlay remove array item"
  - "phase 18 json entry remove items"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 18: json-entry removeItems

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-25 |
| **Branch** | `worktrees/544-upstream-overlay-mechanisms` |
| **Parent Spec** | ../spec.md |
| **Phase** | 18 of 18 |
| **Predecessor** | 017-overlay-alignment-follow-ups |
| **Successor** | None |
| **Handoff Criteria** | `removeItems` is committed on the branch with tests that failed before it, the engine suite passes with no failure, and the `@review` verdict is APPROVED with no P0 or P1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 18** of the overlay framework/root layout packet. It runs in Skilled on its own worktree branch, beside the router unification program's data-driven hub registry, which shares the branch and the review.

**Scope Boundary**: the overlay engine's json-entry operations, their tests, and the doctor docs and playbook that describe them. Barter's `.utcp_config.json` overlay is read only.

**Dependencies**:
- Barter's file overlay of `.utcp_config.json`, read only, for the four manuals it deletes.
- The json-entry take-back contract in `references/overlays.md`, which `removeItems` follows for a dropped op.

**Deliverables**:
- A `removeItems` json-entry operation in the overlay engine, with a test file that failed first.
- The operation documented in `references/overlays.md`, the overlay presentation asset and a playbook scenario.
- A recorded `@review` verdict that approves with no P0 or P1.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Barter carries its whole `.utcp_config.json` as a file overlay only to delete four manuals, `notion`, `obsidian`, `gitkraken` and `webflow`, from `manual_call_templates`. A json-entry overlay could set keys and add items but had no operation that removes an array item, so every upstream change to that file meant a re-pin conflict on a file Barter does not otherwise edit.

### Purpose
A consumer removes array items from an upstream JSON file with one json-entry operation, and the file keeps its own bytes everywhere else.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
The new test file, run on the engine before the change, captured in `/tmp/upstream-544/engine-red.txt`:
```text
$ grep -n -m1 'unknown operation' /tmp/upstream-544/engine-red.txt; grep -E '^ℹ (tests|pass|fail) ' /tmp/upstream-544/engine-red.txt
38:  BLOCKED  utcp-config: cannot apply the entry set to .utcp_config.json: unknown operation "removeItems"
ℹ tests 23
ℹ pass 0
ℹ fail 23
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add a `removeItems` operation that takes `path`, `items` and an optional `identityKey`, removing keyed objects by name or, without `identityKey`, plain values.
- Remove each item byte-stably: the item goes with its comma, the file keeps its indent and EOL, and an emptied array becomes `[]`.
- Judge a name the live file no longer holds against the pin: silent when the pin holds it, a `NOTE` in status and re-pin when the pin lacks it too, and apply still runs.
- Refuse a non-array path, object items in `items`, a keyed op meeting a non-object live item, a duplicate live name, an `insertItems`, `appendItems` or `setKeyOnItem` on the same item, and an insert anchored on a removed item.
- Document the operation and add playbook scenario SKD-014.

### Out of Scope
- Restoring an item when a consumer drops its `removeItems` - the op keeps no record, so it is not undone. The cross-check `NOTE` names the difference and a re-pin restores the item, as the take-back contract allows.
- Removing Barter's `.utcp_config.json` file overlay - Barter's repository is read only here, and it can move onto the new op only once Skilled main carries it.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/commands/doctor/scripts/overlay-engine.cjs` | Modify | The `removeItems` planner, its refusals, the pin cross-check and the shared expected-bytes path that status and audit read |
| `.skilled/commands/doctor/scripts/tests/overlay-engine-remove-items.test.cjs` | Create | Layout, idempotence, missing-name, dropped-op and refusal tests |
| `.skilled/skills/system-skilled-doctor/references/overlays.md` | Modify | Lists `removeItems` with the other json-entry operations and its lifecycle line |
| `.skilled/skills/system-skilled-doctor/manual-testing-playbook/overlays/removed-items-leave-the-file.md` | Create | Scenario SKD-014 |
| `.skilled/skills/system-skilled-doctor/manual-testing-playbook/manual-testing-playbook.md` | Modify | Indexes SKD-014 |
| `.skilled/commands/doctor/assets/doctor-overlay-presentation.txt` | Modify | Names `removeItems` among the json-entry operations |
| `.skilled/skills/system-skilled-doctor/leaf-manifest.json` | Modify | Registers the new playbook leaf |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `removeItems` takes the four manuals out of a utcp config and leaves the bytes the file's own indent and EOL would give, in LF and CRLF files, for a first, middle and last item | `node --test .skilled/commands/doctor/scripts/tests/overlay-engine-remove-items.test.cjs` exits 0, and the file failed on the unchanged engine |
| REQ-002 | A second apply changes nothing, and status and `status --audit` agree after apply | the idempotence and status tests in the same file pass |
| REQ-003 | Each listed refusal blocks the entry set and writes nothing | the refusal tests in the same file pass |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | The engine suite and the overlay guard suite keep their baseline counts, plus the new tests | the engine suite passes 573 with 0 failing (548 before) and the overlay guard 21 of 21 |
| REQ-005 | A `@review` pass approves with no P0 or P1 | the verdict line is recorded in `implementation-summary.md` |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: On the branch, the engine suite passes 573 tests with 0 failing, and the overlay guard passes 21 of 21.
- **SC-002**: `validate.sh` on this folder with `--strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The engine's one expected-bytes path for json entries | If `removeItems` lived only in apply, status would call every applied file `overlay-edited` | The op is planned in the shared path, with a test that status and `status --audit` agree after apply |
| Risk | A removal that reformats the rest of the file makes every re-pin a whole-file conflict again | High | The item goes with its comma and nothing else moves, tested on LF and CRLF files at three positions |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None. A dropped `removeItems` is not undone, which the take-back contract already allows, and a re-pin restores the item.
<!-- /ANCHOR:questions -->

---
