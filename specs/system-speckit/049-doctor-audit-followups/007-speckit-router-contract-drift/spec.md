---
title: "Feature Specification: Phase 7: speckit-router-contract-drift"
description: "The command-router generator reports path drift on /speckit:plan, /speckit:implement and /speckit:complete because the command contract still describes the auto/confirm workflow pair those commands merged into one file."
trigger_phrases:
  - "speckit router contract drift"
  - "command contract merged workflow"
  - "generate-command-routers path drift"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 7: speckit-router-contract-drift

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-10-04 |
| **Branch** | `worktrees/079-doctor-command-audit` |
| **Parent Spec** | ../spec.md |
| **Phase** | 7 of 7 |
| **Predecessor** | 006-doctor-update-fixes |
| **Successor** | None |
| **Handoff Criteria** | `generate-command-routers.cjs --check` exits 0 with no drift |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 7** of the doctor audit follow-ups. The router generator's three drifts were the one check still failing when phase 006 closed.

**Scope Boundary**: The speckit family entry in the command contract, the contract schema, and the generator's asset matching. The speckit routers and workflow assets are already correct and stay unchanged.

**Dependencies**:
- `033-system-speckit-v4/032-recorded-findings-closure/006-lifecycle-command-asset-merge`, which merged the three lifecycle commands' assets and kept resume as a pair on purpose

**Deliverables**:
- A contract that names each speckit router's real workflow assets
- A generator that applies an asset only to the routers it lists

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`generate-command-routers.cjs --check` exits 1 with three path drifts. It expects `speckit-plan-auto.yaml` and `speckit-plan-confirm.yaml`, and the same pair for implement and complete. Those six files were merged into one workflow per command, which branches on `execution_mode`. The contract was never updated, and it has no way to say that `/speckit:resume` still keeps its pair.

### Purpose
The contract describes every speckit router's assets as they are, and the generator check passes with no drift.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add a `workflow` asset purpose and an optional `commands` list to the contract schema's asset and execution-target entries
- Describe the speckit family as one workflow for plan, implement and complete, and an auto/confirm pair for resume
- Make the generator skip an asset whose `commands` list leaves out the router

### Out of Scope
- The speckit routers and workflow YAMLs - they already match the merge decision
- Other families' contract entries - none of them drift

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/sk-doc/sk-create-command/assets/command-contract.schema.json` | Modify | `workflow` purpose and the `commands` filter |
| `.skilled/skills/sk-doc/sk-create-command/assets/command-contract.json` | Modify | Speckit family assets and execution targets |
| `.skilled/skills/system-spec-kit/runtime/cli/codex/generate-command-routers.cjs` | Modify | Honour the `commands` filter |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The generator check passes | `generate-command-routers.cjs --check` prints `routers=32 clean=32 path-drift=0 shape-drift=0` and exits 0 |
| REQ-002 | The check still catches a missing workflow path | Removing the workflow path from `plan.md`, or the auto path from `resume.md`, makes the check exit 1 naming that path |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | The contract validates against its schema | Ajv reports the contract valid, and rejects a malformed command id and an unknown purpose |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The generator check reports no drift across all 32 routers.
- **SC-002**: The doctor contract test, which reads the same contract, still passes.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Other readers of the contract | A new field could break a strict reader | Only the generator and the doctor contract test parse asset entries; both were rerun |
| Risk | The filter hides real drift | Low | REQ-002 proves a removed path still fails the check |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---


