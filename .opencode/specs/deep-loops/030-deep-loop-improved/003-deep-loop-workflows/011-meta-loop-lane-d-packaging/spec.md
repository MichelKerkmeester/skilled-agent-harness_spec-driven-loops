---
title: "Meta-Loop Deep-Loop-Runtime Lane D Self-Improvement Packaging"
description: "The deep-ai-system-improvement skill has no packaging profile for deep-loop-runtime itself as a target; there is no allowed_diff_relpaths allow-list, no frozen scorer surface, and no --self-target fork guard. Without this, any self-improvement run risks mutating its own evaluation infrastructure."
trigger_phrases:
  - "meta loop lane D packaging"
  - "deep-loop-runtime self improvement profile"
  - "allowed_diff_relpaths self target"
  - "Lane D packaging deep loop"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/030-deep-loop-improved/003-deep-loop-workflows/011-meta-loop-lane-d-packaging"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "claude-sonnet"
    recent_action: "Authored spec.md from research.md §5.2 (iter 51)"
    next_safe_action: "Create deep-loop-runtime.json packaging profile and --self-target guard"
    blockers: []
    key_files:
      - ".opencode/skills/deep-loop-workflows/deep-improvement/assets/non_dev_ai_system/profiles/deep-loop-runtime.json"
      - ".opencode/commands/deep/ai-system-improvement.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-authoring-003-deep-loop-workflows"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Meta-Loop Deep-Loop-Runtime Lane D Self-Improvement Packaging

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-28 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 11 of 12 |
| **Predecessor** | 010-deep-improvement-accepted-vs-shipped |
| **Successor** | 012-push-wave-fanout |
| **Handoff Criteria** | `deep-loop-runtime.json` profile created and validates against `packaging_config.schema.json`; `--self-target` guard in `ai-system-improvement.md` forks to dry-run/clean-tree/lock/confirm; scorer files are not in `allowed_diff_relpaths` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 11** of the deep-loop-workflows recommendations.

**Scope Boundary**: Creating the Lane D packaging profile for `deep-loop-runtime` and the `--self-target` guard. Running an actual self-improvement cycle is an operational task outside this spec.

**Dependencies**:
- No hard predecessors; can run independently

**Deliverables**:
- `deep-loop-runtime.json` packaging profile: frozen scorer/harness surfaces, editable technique-doc map, `allowed_diff_relpaths` allow-list, session-prefix exclusions
- `templates/loop.py.template`: template for self-improvement cycle setup
- `packaging_config.schema.json` updated to validate the new profile
- `ai-system-improvement.md` command: `--self-target` flag that forks to dry-run/clean-tree/lock/confirm setup; serial single-candidate default
- `loop_contract.md` reference doc documenting the frozen scorer interface

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The `deep-ai-system-improvement` skill has no packaging profile for `deep-loop-runtime` itself as an improvement target. There is no `allowed_diff_relpaths` allow-list separating editable technique docs from the frozen scorer/harness, no `--self-target` fork guard, and no session-prefix exclusions to prevent a self-improvement run from re-mutating its own previous outputs. A naive self-improvement run could overwrite the scorer it depends on for evaluation.

### Purpose
Create a `deep-loop-runtime.json` Lane D packaging profile with frozen scorer/harness surfaces, editable technique-doc map, `allowed_diff_relpaths` allow-list, and session-prefix exclusions; wire a `--self-target` flag in `ai-system-improvement.md` that forks to a dry-run/clean-tree/lock/confirm setup with serial single-candidate default.

> **Reference evidence**: `external/loop-cli-main/AGENTS.md:126,83-102` (frozen scorer/harness separation); `external/kasper/src/utils.ts:166-170` (packaging profile schema); `external/kasper/src/index.ts:805-814` (`--self-target` fork + serial default). Research.md §5.2 + (iter 51).
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `deep-loop-runtime.json` profile: `frozenSurfaces[]` (scorer, harness), `editableTechDocs[]`, `allowedDiffRelpaths[]`, `excludedSessionPrefixes[]`
- `templates/loop.py.template`: setup template for a self-improvement cycle
- `packaging_config.schema.json` updated: validates `frozenSurfaces`, `editableTechDocs`, `allowedDiffRelpaths`, `excludedSessionPrefixes` fields
- `ai-system-improvement.md`: `--self-target <profile>` flag forks to dry-run/clean-tree/lock/confirm; serial single-candidate default; parallel requires explicit `--parallel` override
- `references/non_dev_ai_system/loop_contract.md`: frozen scorer interface contract

### Out of Scope
- Running an actual self-improvement cycle (operational task; out of scope for this spec)
- Packaging profiles for other skills (other targets; separate follow-ups)

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/deep-loop-workflows/deep-improvement/assets/non_dev_ai_system/profiles/deep-loop-runtime.json` | Create | Lane D packaging profile for deep-loop-runtime with all four required fields |
| `.opencode/skills/deep-loop-workflows/deep-improvement/assets/non_dev_ai_system/templates/loop.py.template` | Create | Setup template for a self-improvement cycle |
| `.opencode/skills/deep-loop-workflows/deep-improvement/assets/packaging_config.schema.json` | Modify | Add validation for `frozenSurfaces`, `editableTechDocs`, `allowedDiffRelpaths`, `excludedSessionPrefixes` |
| `.opencode/commands/deep/ai-system-improvement.md` | Modify | Add `--self-target` flag with dry-run/clean-tree/lock/confirm fork; serial default |
| `.opencode/skills/deep-loop-workflows/deep-improvement/references/non_dev_ai_system/loop_contract.md` | Create | Frozen scorer interface contract |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `deep-loop-runtime.json` defines `frozenSurfaces[]`, `editableTechDocs[]`, `allowedDiffRelpaths[]`, `excludedSessionPrefixes[]`; scorer and harness files are NOT in `allowedDiffRelpaths`; profile validates against `packaging_config.schema.json` without errors | `packaging_config.schema.json` validates `deep-loop-runtime.json` without errors; scorer paths are absent from `allowedDiffRelpaths` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | `--self-target deep-loop-runtime` in `ai-system-improvement.md` forks to dry-run/clean-tree/lock/confirm setup; serial single-candidate is the default; parallel requires explicit `--parallel` override | Running `ai-system-improvement --self-target deep-loop-runtime --dry-run` produces a plan without executing; `--parallel` is required for multi-candidate runs |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `packaging_config.schema.json` validates `deep-loop-runtime.json` without errors; scorer files (e.g., `run-benchmark.cjs`, `promote-candidate.cjs`) are not in `allowedDiffRelpaths`
- **SC-002**: Running `ai-system-improvement --self-target deep-loop-runtime --dry-run` produces a setup plan without executing any mutations; the command exits cleanly with a dry-run summary
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | `allowedDiffRelpaths` allow-list must exclude self-generated session prefixes to avoid re-mutating previous improvement outputs | High | `excludedSessionPrefixes` field in the profile explicitly names the session output directory patterns |
| Risk | `--self-target` without `--dry-run` could accidentally start a live self-improvement run on the scorer | High | Default for `--self-target` is dry-run; live requires explicit `--live` flag + confirmation prompt |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should `--self-target` require `--dry-run` by default (opt-in to live via `--live`) or be live by default with a confirmation prompt? The safer default is dry-run opt-in.
- What is the minimal `allowedDiffRelpaths` set for a meaningful improvement cycle — technique docs only, or also YAML assets and config files?
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->


<!-- SCAFFOLD_VALIDATION_COUNTS:
REQ-003
REQ-004
REQ-005
REQ-006
REQ-007
REQ-008
**Given**
**Given**
**Given**
**Given**
**Given**
**Given**
-->
