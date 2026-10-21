---
title: "Feature Specification: Phase 53: final-commit-live-proof"
description: "Phase 046 proved all 17 plugins live on OpenCode 1 and 2 at commit eb0c18f7e9, and main has moved since, so the two-version proof described a tree that is no longer the one shipping. This phase reruns the same 17-plugin playbook on 1.19.3 and 2.0.32 at origin/main dfdc523af5 and records 17 of 17 on both. It changes no code."
trigger_phrases:
  - "final commit live proof"
  - "phase 53 final commit live proof"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 53: final-commit-live-proof

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-21 |
| **Branch** | `worktrees/196-v1-default-llmgateway` |
| **Parent Spec** | ../spec.md |
| **Phase** | 53 of 53 |
| **Predecessor** | 052-v1-default-llmgateway |
| **Successor** | None |
| **Handoff Criteria** | The 17-plugin matrix shows 17 of 17 on both OpenCode versions at `dfdc523af5`, strict validation of this folder passes, and CI is green at the pushed commit |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 53** of the OpenCode v1 and v2 dual compatibility packet. It re-establishes the two-version proof on the commit that is actually on main.

**Scope Boundary**: the live run of the existing 17-plugin playbook on both installed OpenCode versions, the evidence it produced, and the matrix that records it. No plugin, hook, runtime or doc that the playbook exercises is edited, and no suite is rerun as a gate for this phase.

**Dependencies**:
- `../046-final-two-version-proof/`, which ran the same playbook at `eb0c18f7e9` and supplies the signal each verdict is read against.
- `../052-v1-default-llmgateway/`, which left both versions on `llmgateway/deepseek-v4.1-flash`, so one model serves both runs here.
- `llmgateway` credentials on both installed OpenCode versions, and the live evidence the playbook runner captures under the gitignored state folder.

**Deliverables**:
- The 17 scenario logs, the rerun log, `summary.txt` and the per-run effect and exit files in `scratch/live-runs/`.
- `scratch/live-runs/results-matrix.md`, one row per plugin with the evidence and what was observed on each version.
- This phase's four docs, filled from the scaffold.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Phase 046 proved all 17 plugins live on OpenCode 1.19.3 and 2.0.32, but it did so at `eb0c18f7e9`. Main has moved since, through phases 047 to 052, so the recorded proof covers a tree that is not the one about to ship. A plugin that stopped working somewhere in those six phases would still read as green.

### Purpose
Rerun the unchanged playbook at the final main commit `dfdc523af5` and record 17 of 17 on both versions there, so the two-version proof describes the shipped tree.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Running each scenario file's own `Exact Command Sequence` unchanged, in order, on both installed OpenCode versions at `dfdc523af5`.
- The evidence the runs produce, and one rerun of the scenario that stayed silent for a fixture-shape reason.
- `scratch/live-runs/results-matrix.md` and this phase's four docs.

### Out of Scope
- Any code change - this phase edits no plugin, hook, runtime or skill file.
- The tracked suites - 046 reran them, and this phase re-proves the live behaviour only.
- The playbook scenarios themselves - the blocks are run as written, and a block that needed editing would be a finding rather than a fix.
- `specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/spec.md` beyond the phase map and handoff rows for this phase.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `scratch/live-runs/results-matrix.md` | Create | One row per plugin: v1 and v2 verdict, evidence file and what was observed, plus totals, the rerun note and the shared-service line |
| `spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md` | Modify | This phase's packet, filled from the scaffold |
| `../spec.md` | Modify | The phase map row for 053 and the 052 to 053 handoff row |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The 17 playbook blocks run unchanged on OpenCode 1.19.3 and 2.0.32 at `dfdc523af5`, and every cell's verdict is read from the evidence files rather than from the model's reply or from `summary.txt` alone. | `scratch/live-runs/results-matrix.md` records 17 of 17 on both versions, each row naming its evidence file (`scratch/live-runs/*.txt`, `summary.txt`, `effects/`). |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | The run is clean against the shared service and the credentials: every v2 run uses `--standalone`, PID 46220 stays untouched, and no evidence file contains the llmgateway key. | The matrix states the shared-service line, and the key scan reports 0 matches. |
| REQ-003 | The one scenario that needed a rerun is recorded plainly, with the reason it stayed silent on the first pass. | The matrix carries the rerun note and both `system-completion-sentinel.txt` and `system-completion-sentinel.rerun1.txt`. |
| REQ-004 | Strict validation of this folder passes, and the parent map and handoff rows carry this phase. | `validate.sh 053-final-commit-live-proof --strict` prints `RESULT: PASSED`; `../spec.md` shows 053 Complete with criteria and verification text on the 052 to 053 row. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: On `dfdc523af5`, every one of the 17 plugins shows its checked effect on OpenCode 1.19.3 and on OpenCode 2.0.32, so the matrix totals read 17 of 17 twice.
- **SC-002**: The rerun is explained rather than hidden: the first pass is kept, the reason the advisory was absent is recorded, and the unchanged rerun produces it on both versions.
- **SC-003**: No code changed, and strict validation of this folder passes.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `llmgateway/deepseek-v4.1-flash` serving both installed versions | High | Every block exited 0 and each verdict was read from its evidence file |
| Dependency | The live evidence under the gitignored state folder | High | The scenario logs and the per-run effect and exit files are copied into `scratch/live-runs/`, so the matrix does not depend on that folder surviving |
| Risk | A block's exit code hides a plugin that stayed silent | High | Verdicts were read per version from the evidence files, which is how the sentinel's silent first pass was found |
| Risk | A rerun looks like a proof that was patched until it passed | Med | Both logs are kept, the reason the first pass produced nothing is recorded, and the rerun block is unchanged |
| Risk | A v2 run disturbs the shared service another session depends on | Med | Every v2 run used `--standalone`, and PID 46220 was never stopped, started or attached to |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None for this phase. The run, the verdicts and the rerun are recorded, and pushing to main with its CI is tracked as a task.
<!-- /ANCHOR:questions -->

---
