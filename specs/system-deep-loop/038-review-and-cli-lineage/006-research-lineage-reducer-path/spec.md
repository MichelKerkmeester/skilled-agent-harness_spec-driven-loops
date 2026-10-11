---
title: "Feature Specification: Phase 6: research-lineage-reducer-path"
description: "Inside a fan-out lineage the deep-research reducer refreshes the base research folder instead of the lineage folder, so a lineage's registry, dashboard and strategy stay at their starting state."
trigger_phrases:
  - "research lineage reducer path"
  - "phase 6 research lineage reducer path"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 6: research-lineage-reducer-path

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-09 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 6 of 6 |
| **Predecessor** | 005-cli-lineage-findings-contract |
| **Successor** | None |
| **Handoff Criteria** | A fan-out research lineage's reducer writes its registry, dashboard and strategy inside the lineage folder |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 6** of the deep-loop review and CLI lineage packet.

**Scope Boundary**: The deep-research reducer and the two deep-research workflow files, plus the contract compiled from them.

**Dependencies**:
- The deep-review precedent: `step_bind_reducer_artifact_arg` in `.skilled/commands/deep/assets/deep-review-auto.yaml` and `--artifact-dir` in `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs`.

**Deliverables**:
- An `--artifact-dir` flag on the deep-research reducer, with a unit test.
- The per-iteration reducer calls in both research workflows bound to the lineage folder during fan-out.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
During a fan-out deep-research run, each lineage owns `research/lineages/<label>/` and the workflow binds `artifact_dir` to it. The per-iteration reducer calls still pass only `{spec_folder}`, and the reducer resolves its output from that, so it refreshes the base research folder. A 2026-10-09 run showed the effect: one lineage's `findings-registry.json` was never written after initialization and it had no dashboard. The fan-out merge then reads that stale registry.

### Purpose
A lineage's reducer refreshes the lineage's own registry, dashboard and strategy, matching how deep-review already works.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `--artifact-dir <path>` on the deep-research reducer CLI and an `artifactDir` option on `reduceResearchState`.
- A `step_bind_reducer_artifact_arg` step in both research workflows, and `{reducer_artifact_arg}` on their per-iteration reducer calls.
- Regenerating the compiled deep-research command contract.

### Out of Scope
- The synthesis-time reducer calls that run on the merged base folder after fan-out. The base folder is correct there.
- The deep-review and deep-improvement reducers, which do not have this defect.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs` | Modify | Accept an explicit artifact folder |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/deep-research-reduce-state.vitest.ts` | Modify | Cover the lineage-folder path |
| `.skilled/commands/deep/assets/deep-research-auto.yaml` | Modify | Bind and pass the reducer artifact argument |
| `.skilled/commands/deep/assets/deep-research-confirm.yaml` | Modify | Bind and pass the reducer artifact argument |
| `.skilled/commands/deep/assets/compiled/` deep-research contract | Regenerate | Source hashes follow the YAML edit |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The reducer writes to an explicit artifact folder when given one | Unit test asserts the registry lands in the lineage folder and not in the base folder |
| REQ-002 | Per-iteration reducer calls carry the lineage folder during fan-out | All five per-iteration calls carry `{reducer_artifact_arg}`; the four synthesis calls do not |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Single-executor runs behave as before | Existing reducer and workflow-parity test files pass with no new failures against the baseline |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Running the reducer with `--artifact-dir` on the stale lineage from the 2026-10-09 run refreshes that lineage's registry and dashboard in place.
- **SC-002**: The compiled contract matches its sources after regeneration.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A flag value is read as the spec-folder positional | Reducer targets the wrong folder | The CLI excludes the flag value from positionals; covered by a test |
| Risk | A synthesis call gets the lineage argument by mistake | Merged output lands in one lineage | Brief names the four synthesis calls to leave unchanged; grep check |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---
