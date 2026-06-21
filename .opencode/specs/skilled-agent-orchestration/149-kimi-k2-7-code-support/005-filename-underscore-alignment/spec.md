---
title: "Feature Specification: Phase 5: filename-underscore-alignment [template:level_1/spec.md]"
description: "Align sk-prompt-small-model documentation and asset filenames to the house underscore convention (dashes to underscores), then repair every live inbound reference. Five descriptive markdown files and two dash-named JSON assets are renamed; the four references/models/<id>.md profiles are kept dashed because a pre-commit drift guard derives their path from the dashed model id."
trigger_phrases:
  - "sk-prompt-small-model filename underscore"
  - "rename dash filenames to underscores"
  - "filename-underscore-alignment phase"
  - "model-profiles.json rename"
  - "phase 005 spec"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/149-kimi-k2-7-code-support/005-filename-underscore-alignment"
    last_updated_at: "2026-06-16T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Renamed 7 targets (git mv), repaired ~27 live reference files, drift guard exit 0"
    next_safe_action: "Phase complete; strict-validate and close"
    blockers: []
    key_files:
      - ".opencode/skills/sk-prompt-small-model/assets/model_profiles.json"
      - ".opencode/skills/system-skill-advisor/mcp_server/scripts/check-prompt-quality-card-sync.sh"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-opus-005-filename-underscore-alignment"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Rename the 4 references/models/<id>.md profiles too? No - kept dashed (the drift guard derives the path from the dashed model id)."
      - "Rename the dash-named JSON assets too? Yes - model_profiles.json + per_model_budgets.json, with every functional reference updated."
      - "Update the ~293 historical/archived spec-doc references? No - skill plus live wiring only."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 5: filename-underscore-alignment

<!-- SPECKIT_LEVEL: 1 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-06-16 |
| **Branch** | `system-speckit/027-xce-research-based-refinement` |
| **Parent Spec** | ../spec.md |
| **Phase** | 5 |
| **Predecessor** | 004-discriminating-bakeoff |
| **Successor** | None |
| **Handoff Criteria** | All 7 targets renamed; zero stale dash references in live wiring; `check-prompt-quality-card-sync.sh .` exits 0; `validate.sh --strict` exits 0 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 5** of the kimi-k2-7-code-support specification, a filename-convention cleanup on the `sk-prompt-small-model` skill (the hub that hosts the kimi-k2.7-code profile).

**Scope Boundary**: Rename dash-named documentation and asset files to underscores and repair live inbound references. No change to model behaviour, framework choice, registry DATA values, or dispatch logic - only filenames and the strings that point at them.

**Decision (model profiles stay dashed)**: `check-prompt-quality-card-sync.sh` derives each model profile path as `references/models/<id>.md` from the dashed model id read out of the registry. Those ids are external provider identifiers and keep their dashes; renaming the profile files would fail the guard's existence check and block every commit. The four model-profile filenames are an id-mirror class (like the reserved `graph-metadata.json`) and are excluded by design.

**Dependencies**:
- The pre-commit drift guard `.opencode/skills/system-skill-advisor/mcp_server/scripts/check-prompt-quality-card-sync.sh`.

**Deliverables**:
- 5 descriptive markdown files plus 2 JSON assets renamed dash to underscore via `git mv`.
- Every live inbound reference updated (the skill, `cli-opencode`, the pre-commit hook, permissions configs, the root README, the drift-guard `json.load` path).

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The house convention for descriptive markdown and asset filenames is underscores (`document_name.md`), matching peer skills such as `mcp-open-design` (`od_cli_reference.md`) and `sk-design-interface` (`design_principles.md`). `sk-prompt-small-model` is inconsistent: several `references/` and `assets/` files use dashes (`pattern-index.md`, `context-budget.md`, `output-verification.md`, `quota-fallback.md`, `confidence-scoring-rubric.md`, `model-profiles.json`, `per-model-budgets.json`).

### Purpose
Bring the skill's filenames into line with the underscore convention without breaking the live tooling that points at them, and without breaking the one hard contract that legitimately requires dashes (the model-profile filenames that mirror external model ids).
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Rename 5 descriptive markdown files and 2 JSON assets in `sk-prompt-small-model`, dash to underscore, preserving history with `git mv`.
- Update every live inbound reference: the skill's own docs/metadata, `cli-opencode`, the `pre-commit` hook text, the `permissions-matrix` configs, the root `README.md`, and the drift-guard's `json.load` path.

### Out of Scope
- The 4 `references/models/<id>.md` profiles - kept dashed (see Phase Context decision).
- The reserved metadata filenames `graph-metadata.json` and `description.json`.
- Historical/archived spec-doc references and changelog files - left as point-in-time records.
- Any change to registry DATA values, model behaviour, or dispatch logic.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `sk-prompt-small-model/assets/confidence-scoring-rubric.md` | Rename | to `confidence_scoring_rubric.md` |
| `sk-prompt-small-model/references/context-budget.md` | Rename | to `context_budget.md` |
| `sk-prompt-small-model/references/output-verification.md` | Rename | to `output_verification.md` |
| `sk-prompt-small-model/references/pattern-index.md` | Rename | to `pattern_index.md` |
| `sk-prompt-small-model/references/quota-fallback.md` | Rename | to `quota_fallback.md` |
| `sk-prompt-small-model/assets/model-profiles.json` | Rename | to `model_profiles.json` |
| `sk-prompt-small-model/assets/per-model-budgets.json` | Rename | to `per_model_budgets.json` |
| `sk-prompt-small-model/**` + `cli-opencode/**` + `cli-claude-code/SKILL.md` + `cli-codex/SKILL.md` | Modify | Update inbound references (path-qualified for the `context-budget` name collision) |
| `.opencode/scripts/git-hooks/pre-commit` | Modify | Update `pattern-index.md` hint string |
| `system-skill-advisor/mcp_server/scripts/check-prompt-quality-card-sync.sh` | Modify | Update the functional `json.load(... model-profiles.json)` path |
| `README.md` (repo root) | Modify | Update `pattern-index.md` reference |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Rename the 7 targets with history preserved | `git mv` used for all 7; new underscore files exist, old dash files gone, `git status` shows R |
| REQ-002 | Repair the functional drift-guard path | `check-prompt-quality-card-sync.sh:116` loads `assets/model_profiles.json`; guard exits 0 |
| REQ-003 | No stale live references | Live-wiring grep finds zero references to the 6 unique old dash names; the only remaining dashed `context-budget.md` refs are cli-opencode's own (non-renamed) file |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Model profiles untouched | The 4 `references/models/<id>.md` files keep dashed names; their content references resolve |
| REQ-005 | Strict validate passes | `validate.sh --strict` exits 0 on this phase folder |
| REQ-006 | Parent map reconciled | The 154 parent phase map gains a phase-5 row and `children_ids` includes this phase |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The 5 markdown files and 2 JSON assets are renamed to underscores; `git status` shows renames (R), not delete+add.
- **SC-002**: `check-prompt-quality-card-sync.sh .` exits 0 (it loads the renamed `model_profiles.json` and still resolves all 4 dashed model profiles).
- **SC-003**: Live-wiring grep for the 6 unique old dash names returns zero hits; remaining dashed `context-budget.md` refs are the intentional cli-opencode keep.
- **SC-004**: `validate.sh --strict` exits 0 on `005-filename-underscore-alignment/`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Renaming the 4 model profiles | Drift guard derives `references/models/<id>.md` from the dashed model id; a rename blocks all commits | Exclude them; keep dashed |
| Risk | `context-budget.md` name collision | `cli-opencode` has its OWN `references/context-budget.md`; a blanket replace would wrongly rename it | Path-qualified replacement plus targeted same-skill link edits; leave cli-opencode's filename and the links to it intact |
| Risk | Missed functional consumer of the JSON | A runtime loader of `model-profiles.json` would break silently | Verified the only code loader is the drift guard (`json.load`); `per-model-budgets.json` has no code loader |
| Dependency | The drift guard script | Defines the model-profile filename contract | Update its `json.load` path; keep model-profile filenames dashed |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. The three scope forks (model files, JSON assets, historical references) were resolved with the user before implementation; see the answered questions in the continuity block.
<!-- /ANCHOR:questions -->
