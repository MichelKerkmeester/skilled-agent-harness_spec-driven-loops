---
title: "Feature Specification: Relocate the chart corpus packet under this parent"
description: "A closed, green, pushed packet of 300 directories and 1,529 tracked files moves here so the chart history sits with the skill it describes. Nothing is authored: this child is a destination."
trigger_phrases:
  - "chart packet relocation"
  - "sk-create-chart spec move"
importance_tier: normal
contextType: general
version: 1.0.0.0
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Relocate the chart corpus packet under this parent

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Draft |
| **Created** | 2026-09-06 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Packet** | `018-sk-design-parent-v2` |
| **Origin** | Operator: "move [specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart] into [018-sk-design-parent-v2/001-sk-create-chart]" |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

`sk-create-chart` is now a mode of `sk-design`. Its spec packet still lives under the documentation
track, so the record and the skill disagree about which hub owns chart work.

### This child is a destination, not authored work

Nothing here is written. `specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart` moves in whole: 300 directories, 1,529
tracked files, 25 MB, already nesting three packet levels deep. Under this parent it nests five.

That depth was raised as an objection by the orchestrator and by an independent planner, and the
operator ruled to proceed. It is recorded here so the cost is visible rather than rediscovered, not
so it can be re-argued.

### Purpose

The chart record sits with the chart skill, and nothing points at the path it left.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The packet moved, as renames.
- Derived frontmatter pointers and fingerprints repaired for the moved tree.
- The 229 self-references inside the packet and the 16 references outside it.
- The lexical trigger index regenerated, because it is keyed on spec paths and goes stale silently.

### Out of Scope
- Any change to what the packet says. Its findings, criteria and evidence stand exactly as shipped.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/` | Move | Becomes `001-sk-create-chart` under this parent |
| The moved tree's generated metadata | Regenerate | Pointers, fingerprints, parent chain |
| Files outside the packet naming the old path | Modify | Repointed |
| `.opencode/skills/system-spec-kit/runtime/data/trigger-index.json` | Regenerate | Lexical index keyed on spec paths |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement |
|----|-------------|
| REQ-001 | The packet moves as renames, not delete-plus-add. |
| REQ-002 | `validate.sh --strict` passes for the moved packet, taking the first `RESULT:` line. |
| REQ-003 | No file outside historical archives still resolves to the old path. |
| REQ-004 | The chart corpus checker still passes, because skill and spec must agree once both have moved. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `git diff --cached --name-status -M` shows the tree as renames.
- **SC-002**: `validate.sh --strict` prints `RESULT: PASSED` for the moved packet.
- **SC-003**: A sweep for the old path returns only deliberate historical mentions.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Metadata fingerprints attest documents at a path that no longer exists | High: validation fails across 300 folders | Repair derived metadata immediately after the move, before validating |
| Risk | The trigger index silently keeps the old path | Medium: retrieval misses the packet with no error | Regenerate it as part of this step, not later |
| Dependency | `004-chart-and-diagram-cutover` | The skill must move before its spec does | Complete, commit `e34e225517` |
<!-- /ANCHOR:risks -->
