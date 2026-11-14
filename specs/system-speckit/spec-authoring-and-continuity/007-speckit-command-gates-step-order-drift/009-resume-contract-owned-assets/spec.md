---
title: "Feature Specification: Phase 9: resume-contract-owned-assets"
description: "The command contract still lists speckit-resume-auto.yaml and speckit-resume-confirm.yaml as owned assets of /speckit:resume after phase 5 merged them into speckit-resume.yaml. The router drift check exits 1, so the Spec-Kit Check workflow is red on main."
trigger_phrases:
  - "resume contract owned assets"
  - "phase 9 resume contract owned assets"
  - "speckit resume path drift"
  - "generate-command-routers check exits 1"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 9: resume-contract-owned-assets

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill every row: level, priority, status, date and branch. Use the real branch name. GOOD: Priority P1. Status Draft. Branch `feat/rotate-logs-keep`. WEAK: Priority TBD. Status maybe. -->

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-11-14 |
| **Branch** | `worktrees/389-resume-contract-owned-assets` |
| **Parent Spec** | ../spec.md |
| **Phase** | 9 of 9 |
| **Predecessor** | 008-router-readme-presentation-alignment |
| **Successor** | None |
| **Handoff Criteria** | `generate-command-routers.cjs --check` exits 0 and the CLI vitest project passes on main |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 9** of the speckit command gates and step-order drift specification. It repairs one row set that phase 5 left behind when it merged the resume workflows.

**Scope Boundary**: the speckit family's `owned_assets` rows in the command contract. No router, workflow or test changes.

**Dependencies**:
- Phase 5 (`005-resume-detection-and-single-workflow`), which deleted the two resume workflow files.

**Deliverables**:
- A contract whose owned assets for `/speckit:resume` name only files that exist.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE
<!-- FILL: State the problem in two sentences: what breaks, and for whom. GOOD: The rotate-logs script never deletes old archives, so a host that copies `logs/archive` fills its disk. WEAK: The script has issues with output. -->

### Problem Statement
Phase 5 merged `speckit-resume-auto.yaml` and `speckit-resume-confirm.yaml` into one `speckit-resume.yaml` and updated the contract's execution targets, but two `owned_assets` rows still name the deleted files. The router drift check reports path drift on `resume.md` and exits 1, so the typo-flags test that expects `--check` to exit 0 fails and Spec-Kit Check is red on main.

### Purpose
The contract names the single resume workflow, the drift check exits 0 and Spec-Kit Check passes on main.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
<!-- FILL: Run the command this change affects and paste the command and its verbatim output. Quote every number the spec states about current behavior from this block. Write `N/A:` and a reason when no command applies. GOOD: `bash scripts/rotate-logs.sh` with 10 archives, then `ls logs/archive | wc -l` prints 10. WEAK: The script deletes old logs. -->
```text
$ node .skilled/skills/system-spec-kit/runtime/cli/codex/generate-command-routers.cjs --check
command-router drift check

  DRIFT .skilled/commands/speckit/resume.md [mode-pair]
        - PATH-DRIFT missing=[".skilled/commands/speckit/assets/speckit-resume-auto.yaml",".skilled/commands/speckit/assets/speckit-resume-confirm.yaml"]

routers=42 clean=41 path-drift=1 shape-drift=0
EXIT=1
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE
<!-- FILL: List three to five things this change does, each starting with a verb. Before you list a new file, module, option, layer or dependency, name what fails today without it, or drop it. GOOD: Add a `--keep <n>` option that deletes all but the newest n archives in `logs/archive/`. WEAK: Update the script and docs. -->

### In Scope
- Remove the `auto_workflow` and `confirm_workflow` rows scoped to `/speckit:resume` from the speckit family's owned assets.
- Add `/speckit:resume` to the speckit `workflow` row, so the contract expects `speckit-resume.yaml`.

### Out of Scope
- The `auto_workflow` and `confirm_workflow` enum values in `command-contract.schema.json` - the create, design and deep families still use them.
- The router generator - it read the contract correctly, and the contract was the stale producer.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/sk-doc/sk-create-command/assets/command-contract.json` | Modify | Speckit owned assets name the single resume workflow |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
<!-- FILL: Write one testable requirement per row. Name the exact command or output. GOOD: With 10 archives, `bash scripts/rotate-logs.sh --keep 3` exits 0 and `ls logs/archive | wc -l` prints 3. WEAK: The option should work well. -->
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The contract's owned assets for `/speckit:resume` name only files that exist | `generate-command-routers.cjs --check` prints `routers=42 clean=42 path-drift=0 shape-drift=0` and exits 0 |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | No other reader of the contract regresses | CLI vitest shard 2 and the doctor contract tests pass with 0 failures |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
<!-- FILL: Write one measurable outcome per line. A command can prove it. GOOD: With 10 archives in `logs/archive`, `bash scripts/rotate-logs.sh --keep 3` leaves 3. WEAK: The feature is successful. -->

- **SC-001**: `tests/typo-flags.vitest.ts` passes 34 of 34 tests.
- **SC-002**: Spec-Kit Check passes on main after the push.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES
<!-- FILL: Name one dependency and one risk. Give each a concrete mitigation. GOOD: A script that reads `--keep` with no value could delete every archive. Mitigation: reject a missing value with exit 2 and test it. WEAK: There may be some risk. -->

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `resume.md` names `speckit-resume.yaml` in its owned assets table | The drift check would report the new expected path as missing | The drift check after the edit reports all 42 routers clean |
| Risk | Another reader keys on the removed `auto_workflow` rows for speckit | Low | A repository search outside `specs/` finds no reader of the speckit resume rows, and the doctor contract tests pass |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS
<!-- FILL: Write each open question as one line. Write `None` when nothing blocks. GOOD: Does a missing `--keep` value delete every archive? Decision: no, a missing value exits 2. WEAK: Edge cases are unclear. -->

- None
<!-- /ANCHOR:questions -->

---
