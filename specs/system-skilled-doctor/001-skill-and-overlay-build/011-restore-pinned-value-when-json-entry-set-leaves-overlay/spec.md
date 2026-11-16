---
title: "Feature Specification: Phase 11: restore-pinned-value-when-json-entry-set-leaves-overlay"
description: "A set operation removed from a json-entry overlay source leaves its value in the live file, and status still prints RESULT: PASSED. The engine records the array items an overlay adds and nothing about a set, so it has nothing to restore."
trigger_phrases:
  - "restore pinned value when json entry set leaves overlay"
  - "phase 11 restore pinned value when json entry"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 11: restore-pinned-value-when-json-entry-set-leaves-overlay

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill every row: level, priority, status, date and branch. Use the real branch name. GOOD: Priority P1. Status Draft. Branch `feat/rotate-logs-keep`. WEAK: Priority TBD. Status maybe. -->

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-11-16 |
| **Branch** | `worktrees/425-repin-engine-limits-intake` |
| **Parent Spec** | ../spec.md |
| **Phase** | 11 of 12 |
| **Predecessor** | 010-fix-barter-repin-handover-items-for-overlay-engine |
| **Successor** | 012-fix-barter-022-handover-items-for-doctor-scripts |
| **Handoff Criteria** | `node --test .skilled/commands/doctor/scripts/tests` prints `fail 0` with the new tests in the count |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 11** of the skill and overlay build. It takes item 7 of the second handover a vendoring project sent, copied as `../010-fix-barter-repin-handover-items-for-overlay-engine/handover-from-barter-024.md`.

**Scope Boundary**: The `set` operation of a `json-entry` overlay in `overlay-engine.cjs`, the `sync-state.json` record it needs and the reference that describes that record. Items 8 to 10 of the same handover are router and advisor work and have their own packets.

**Dependencies**:
- Phase 9 added the `items` record this phase follows as its pattern.
- Phase 10 added the `set` branch that inserts a key the file does not hold yet.

**Deliverables**:
- A `sets` record in `sync-state.json`.
- A restore step in `overlay-engine.cjs` that runs before an entry set is applied.
- Tests for the restore, the refusal and the older state file.
- The record described in `overlays.md`.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE
<!-- FILL: State the problem in two sentences: what breaks, and for whom. GOOD: The rotate-logs script never deletes old archives, so a host that copies `logs/archive` fills its disk. WEAK: The script has issues with output. -->

### Problem Statement
A project that vendors Skilled changes one value in an upstream JSON file with a `set` operation in a `json-entry` overlay. When the operation is later removed from the overlay source, `apply` prints `0 changed` and `status` prints `RESULT: PASSED`, while the live file keeps the overlay's value. The vendoring project saw this twice on `command-routing-baseline.json`, and a test that reads the file failed on the stale row.

The cause is in `planOperation`. Its `set` branch writes the operation's value and reports nothing. `sync-state.json` records only the array items an overlay added, through `onListed`, and `removeDroppedItems` retracts only those. A key that the `set` branch inserts is left behind the same way.

### Purpose
After a `set` operation leaves an overlay source, `apply` returns the live value to the pin's value, and removes a key the engine added that the pin does not hold.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
<!-- FILL: Run the command this change affects and paste the command and its verbatim output. Quote every number the spec states about current behavior from this block. Write `N/A:` and a reason when no command applies. GOOD: `bash scripts/rotate-logs.sh` with 10 archives, then `ls logs/archive | wc -l` prints 10. WEAK: The script deletes old logs. -->

```text
$ node specs/system-skilled-doctor/001-skill-and-overlay-build/011-restore-pinned-value-when-json-entry-set-leaves-overlay/scratch/repro-removed-set.cjs .
pin value: sk-code
after apply with the set: sk-doc
after apply with the set removed: sk-doc (text unchanged: true)
key the set added, after the set is removed: {"top":"sk-code","extra":1}
exit status: 0
```

The script calls `applyJsonOperations` at commit `b3c140536fb`, first with one `set` and then with an empty entry set. The second call returns the text it was given, so the plan has no write and `status` has nothing to report.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE
<!-- FILL: List three to five things this change does, each starting with a verb. Before you list a new file, module, option, layer or dependency, name what fails today without it, or drop it. GOOD: Add a `--keep <n>` option that deletes all but the newest n archives in `logs/archive/`. WEAK: Update the script and docs. -->

### In Scope
- Record each `set` the engine applies in `sync-state.json`, under a new `sets` key per destination: the path, the value written and whether the engine added the key.
- Restore the pin's value at a recorded path when no `set` in the entry set names that path any more.
- Delete a key the engine added when the pin does not hold it.
- Refuse the overlay, with a problem line, when the live value no longer equals the recorded one or the pinned copy cannot be read.
- Describe the record in `overlays.md` and tell the vendoring project what to remove.

### Out of Scope
- A value left behind before this ships - no record of it exists, and a state file from an older engine restores nothing. The vendoring project keeps its two `set` operations until one `apply` under the new engine has recorded them.
- A `status` line for a live value that neither the pin nor an operation explains - the handover offers it as the alternative. It needs the planner to compare the whole live file with the pin, which the `json-entry` planner does not do today.
- `setKeyOnItem` - it has the same shape by reading and nobody has reported it. Open question 1 asks whether to include it.
- The vendoring project's tree - it is read-only from here.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/commands/doctor/scripts/overlay-engine.cjs` | Modify | Report an applied `set`, read and write the `sets` record and restore a dropped one |
| `.skilled/commands/doctor/scripts/tests/overlay-engine-sync.test.cjs` | Modify | Tests for the restore, the deleted key, the refusal, the changed value and the older state file |
| `.skilled/skills/system-skilled-doctor/references/overlays.md` | Modify | The `sets` record beside `links` and `items` |
| `handover-to-barter.md` in this folder | Create | The two `set` operations the vendoring project may remove, and when |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
<!-- FILL: Write one testable requirement per row. Name the exact command or output. GOOD: With 10 archives, `bash scripts/rotate-logs.sh --keep 3` exits 0 and `ls logs/archive | wc -l` prints 3. WEAK: The option should work well. -->

REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | A value a `set` replaced returns to the pin's value when the operation leaves the entry set | A test applies a `set`, applies again without it and reads the pin's value from the live file |
| REQ-002 | A key a `set` added is deleted when the operation leaves the entry set and the pin does not hold the key | A test applies a `set` on a missing key, applies again without it and finds the key gone and the file equal to the pin's bytes |
| REQ-003 | A recorded value that was edited after it was applied is refused, not overwritten | A test edits the live value, removes the `set` and reads a problem line, no write and a `status` result that is not `RESULT: PASSED` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | A state file without the `sets` key loads, restores nothing and keeps its bytes when no overlay holds a `set` | A test loads a state file from the current engine and reads the same bytes after `apply` |
| REQ-005 | A `set` whose value changes in the source is a change, not a removal | A test changes the value of a recorded `set`, applies and reads the new value in the live file and in the record |
| REQ-006 | `overlays.md` describes the `sets` record | `rg -n 'sets' .skilled/skills/system-skilled-doctor/references/overlays.md` prints the paragraph that names `links` and `items` |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
<!-- FILL: Write one measurable outcome per line. A command can prove it. GOOD: With 10 archives in `logs/archive`, `bash scripts/rotate-logs.sh --keep 3` leaves 3. WEAK: The feature is successful. -->

- **SC-001**: `node --test .skilled/commands/doctor/scripts/tests` prints `fail 0` and a pass count above the 1175 the suite printed after phase 10.
- **SC-002**: The first line of the handover's validation checklist holds: after a `set` operation is removed from a source, `apply` returns the live value to the pin's.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES
<!-- FILL: Name one dependency and one risk. Give each a concrete mitigation. GOOD: A script that reads `--keep` with no value could delete every archive. Mitigation: reject a missing value with exit 2 and test it. WEAK: There may be some risk. -->

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The pinned upstream copy, read through the `upstreamBytes` reader `planJsonOverlay` already receives | Without it the engine cannot know the value to restore | Refuse the overlay with a problem line that names the path. Never guess a value |
| Risk | A restore during a re-pin reads the old pin's copy and writes a value the new pin changed | Medium. A wrong value in a routing baseline fails a test far from the cause | Use the reader the run was given, which a re-pin points at the new commit, and cover a restore across a changed pin with a test |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS
<!-- FILL: Write each open question as one line. Write `None` when nothing blocks. GOOD: Does a missing `--keep` value delete every archive? Decision: no, a missing value exits 2. WEAK: Edge cases are unclear. -->

- Should `setKeyOnItem` get the same record in this phase? It writes a key on an upstream item and keeps no record either. Decided by the operator on 2026-11-16: no. This phase covers `set` only, and `overlays.md` names `setKeyOnItem` as a known limit.
- When the pinned copy cannot be read, should the engine refuse or leave the value? Decided by the operator on 2026-11-16: refuse, with a problem line that names the path.
<!-- /ANCHOR:questions -->

---


