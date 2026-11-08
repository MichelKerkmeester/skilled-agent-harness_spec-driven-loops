---
title: "Feature Specification: Removed-folder files read as live edits"
description: "The overlay engine reads an upstream file added inside a skill-root remove folder as a live edit, suggests --capture, and refuses apply. This packet fixes that classification and verifies Barter's five other handover items."
trigger_phrases:
  - "removed folder classification"
  - "remove list live-edited"
  - "barter handover items"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Removed-folder files read as live edits

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
| **Created** | 2026-11-08 |
| **Branch** | `worktrees/331-removed-folder-classification` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE
<!-- FILL: State the problem in two sentences: what breaks, and for whom. GOOD: The rotate-logs script never deletes old archives, so a host that copies `logs/archive` fills its disk. WEAK: The script has issues with output. -->

### Problem Statement
A skill-root overlay can remove folders from an upstream skill. When upstream adds a file inside such a folder, `status` calls it `live-edited`, its fix line says `apply --capture`, and `apply` exits 1. Barter hit this on its re-pin to 96153b476b and had to add two `repin.exclude` entries to get past it.

### Purpose
A file under a remove folder is treated as removed: `apply` deletes it and exits 0, and nothing suggests capturing it.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
<!-- FILL: Run the command this change affects and paste the command and its verbatim output. Quote every number the spec states about current behavior from this block. Write `N/A:` and a reason when no command applies. GOOD: `bash scripts/rotate-logs.sh` with 10 archives, then `ls logs/archive | wc -l` prints 10. WEAK: The script deletes old logs. -->
```text
Baseline before the change, in this worktree:
node --test overlay-engine-{sync,fixes,repin,replay}.test.cjs  ->  tests 58, pass 58, fail 0
bash .skilled/commands/doctor/scripts/tests/run-all.sh  ->  [run-all] 7 suite(s) passed, 0 failed
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE
<!-- FILL: List three to five things this change does, each starting with a verb. GOOD: Add a `--keep <n>` option that deletes all but the newest n archives in `logs/archive/`. WEAK: Update the script and docs. -->

### In Scope
- Classify a file under a skill-root remove folder as removed, not `live-edited`, in `overlay-engine.cjs`.
- Add failing-then-passing tests for status, apply, capture and `repin --stage`.
- Update the `live-edited` rows in `overlays.md` and the overlay presentation asset, and release the doctor changelog.
- Verify Barter handover items 1 to 5 with their stated checks.

### Out of Scope
- Changing Barter's manifest - Barter drops its two `repin.exclude` entries on its next re-pin.
- Host trigger-index auto-selection (item 5) - the handover only asked to consider it; deferred unless the operator asks.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/commands/doctor/scripts/overlay-engine.cjs` | Modify | Classify removed-folder files as removed |
| `.skilled/commands/doctor/scripts/tests/overlay-engine-sync.test.cjs` | Modify | Status, apply and capture cases |
| `.skilled/commands/doctor/scripts/tests/overlay-engine-repin.test.cjs` | Modify | `repin --stage` case |
| `.skilled/skills/system-skilled-doctor/references/overlays.md` | Modify | `live-edited` row |
| `.skilled/commands/doctor/assets/doctor-overlay-presentation.txt` | Modify | `live-edited` row |
| `.skilled/skills/system-skilled-doctor/changelog/v1.1.2.0.md`, `SKILL.md` | Create, Modify | Release note and version |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
<!-- FILL: Write one testable requirement per row. Name the exact command or output. GOOD: With 10 archives, `bash scripts/rotate-logs.sh --keep 3` exits 0 and `ls logs/archive | wc -l` prints 3. WEAK: The option should work well. -->
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | An upstream file inside a skill-root remove folder is removed, not `live-edited` | In a temp tree, `status` shows it `overlay-edited` with fix `apply`, `apply` exits 0 and deletes it, and a second `status` ends `RESULT: PASSED` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | A replace-listed file inside a removed folder stays, and capture on a removed path writes nothing | The new sync tests pass; the four overlay suites and `run-all.sh` stay at or above baseline |
| REQ-003 | Items 1 to 5 each have a check result read by the orchestrator | The report lists command and exit status per item |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
<!-- FILL: Write one measurable outcome per line. A command can prove it. GOOD: With 10 archives in `logs/archive`, `bash scripts/rotate-logs.sh --keep 3` leaves 3. WEAK: The feature is successful. -->

- **SC-001**: `repin --stage` with an upstream file added inside a removed folder ends `RESULT: STAGED` with no blocked line.
- **SC-002**: `validate.sh --strict` on this folder prints `RESULT: PASSED`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES
<!-- FILL: Name one dependency and one risk. Give each a concrete mitigation. GOOD: A script that reads `--keep` with no value could delete every archive. Mitigation: reject a missing value with exit 2 and test it. WEAK: There may be some risk. -->

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Devin DeepSeek flash workers | Work stalls | The orchestrator verifies every result and finishes by hand |
| Risk | Treating removed files as removed could hide a real local edit the user wanted | Med | Only paths under a remove prefix and not named by `replace` change class; tests cover the replace-listed file |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS
<!-- FILL: Write each open question as one line. Write `None` when nothing blocks. GOOD: Does a missing `--keep` value delete every archive? Decision: no, a missing value exits 2. WEAK: Edge cases are unclear. -->

- None.
<!-- /ANCHOR:questions -->

---


