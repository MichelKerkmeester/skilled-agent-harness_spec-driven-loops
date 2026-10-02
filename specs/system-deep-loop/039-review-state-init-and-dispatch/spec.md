---
title: "Feature Specification: Deep-review state-log init through the gateway, and the child-dispatch retry rule"
description: "A deep-review run opened by the workflow could never record an iteration through the append gateway, and dispatched CLI children halted on stale edit anchors. The run now opens through the ledger, and the dispatch preamble tells children to re-read and retry."
trigger_phrases:
  - "deep review run open"
  - "attribution collapse"
  - "run initialized gateway"
  - "child dispatch retry"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Deep-review state-log init through the gateway, and the child-dispatch retry rule

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-10-02 |
| **Branch** | `worktrees/081-review-run-open-through-gateway` (review fix), `worktrees/080-hook-bootstrap-and-dispatch-fixes` (preamble) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Both deep-review workflows open a run by writing a config row straight into `deep-review-state.jsonl`, and no ledger event records it. That file is a projection the append gateway rebuilds from the ledger. The review projection can only rebuild a five-key config row, and `shadow-projection-store.ts` refuses any rebuild that would drop keys from an existing config row. So every gateway append in a workflow-opened run commits to the ledger and then exits 2 with "Projection replace would drop keys from the existing config row". Found on 2026-10-02 during a three-iteration review of packet `sk-git/032`, whose state log stayed at its config row for the whole run.

Separately, CLI children dispatched by an orchestrator read `AGENTS.md`'s halt-on-"string not found" rule as binding. A child has no operator to hand control to, so it stopped having written nothing, twice in one session, each time over an edit anchor that had gone stale.

### Purpose
A workflow-opened deep-review run records its iterations through the gateway with exit 0, and a dispatched child retries a failed edit instead of halting.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Both deep-review workflows open a run by recording `deep_review.run_initialized` through the append gateway instead of writing the state log.
- The review stem census marks `deep_review.run_initialized` as spoken by both workflows.
- An end-to-end test runs the shipped init step, then appends an iteration through the gateway.
- One retry line in the child-dispatch preamble block, and the reason for it.

### Out of Scope
- The iteration record's shape at the gateway. Packet `system-deep-loop/038-review-gateway-iteration-record` owns it, and this change merges after it.
- Runs opened before this change. Their directly written config row still blocks projection; a restart opens them cleanly.
- The research workflow, which opens its run the same way. It needs its own check, because the research gateway has a legacy upcaster review does not.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/commands/deep/assets/deep-review-auto.yaml` | Modify | Init step records `run_initialized` through the gateway |
| `.skilled/commands/deep/assets/deep-review-confirm.yaml` | Modify | Same change for the confirm variant |
| `.skilled/skills/system-deep-loop/runtime/lib/deep-review-ledger-schema/deep-review-ledger-types.ts` | Modify | Census row for `run_initialized` becomes spoken |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/deep-review-run-open.vitest.ts` | Create | Runs the shipped init step end to end |
| `.skilled/skills/cli-external-orchestration/shared/references/child-dispatch-preamble.md` | Modify | Retry line in the block and its reason |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | A run opened by either deep-review workflow records iterations through the gateway with exit 0. | The test runs each shipped init step, then appends `deep_review.dimension_pass_completed`; both exit 0 and the state log reads config then iteration. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | The stem census matches what the workflows emit. | `check-ledger-stem-producers.cjs` exits 0 with `run_initialized` spoken by both workflows. |
| REQ-003 | A dispatched child retries a failed edit match before halting. | The preamble block carries the retry line, and section 3 explains it. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: No workflow-opened review run fails projection with the attribution-collapse error.
- **SC-002**: The deep-loop runtime suite shows no new failures against the main baseline.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Packet 038 edits `deep-review-ledger-types.ts` | Merge conflict in one census row | Merge after 038 lands, then rebase |
| Risk | The projected config row has five keys, not the full config | Low | Nothing reads the state log's config row; the reducer reads `deep-review-config.json` |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---


