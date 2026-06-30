---
title: "Phase 8: sk-code-review Checklist Reclassification (references to assets)"
description: "Move the six review-checklist artifacts from sk-code-review/references/ to assets/ where reusable checklists belong, align them to the sk-doc asset template, and update every coupled reference (routing, README, metadata, playbook, cross-skill, runtime mirrors)."
trigger_phrases:
  - "sk-code-review checklist reclassification"
  - "review checklists references to assets"
  - "asset template alignment review"
  - "checklist asset move"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/skilled-agent-orchestration/z_archive/113-sk-code-ponytail-based-refinement/008-sk-code-review-checklist-reclassification"
    last_updated_at: "2026-06-14T07:40:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Reclassification + asset alignment implemented and verified"
    next_safe_action: "Run validate.sh --strict, then scoped commit on branch 028"
    blockers: []
    key_files:
      - ".opencode/skills/sk-code-review/SKILL.md"
      - ".opencode/skills/sk-code-review/assets/code_quality_checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "146-008-sk-code-review-checklist-reclassification"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions:
      - "Move target -> assets/ flat (preserves ../-relative links)"
      - "removal_plan -> moved whole, not split"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 8: sk-code-review Checklist Reclassification (references to assets)

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | In Progress |
| **Created** | 2026-06-14 |
| **Branch** | `028-mcp-to-cli-tool-transition` |
| **Parent Spec** | ../spec.md |
| **Phase** | 8 of 8 |
| **Predecessor** | 007-sk-code-asset-router-alignment |
| **Successor** | None |
| **Handoff Criteria** | Six checklists VALID as assets, canary green, all relative links resolve, mirrors re-synced |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 8** of the 146 packet — the sk-code-review counterpart to the sk-code alignment in phase 007. It corrects a misclassification surfaced while reviewing the ponytail work: several `sk-code-review/references/` files are really checklist artifacts a reviewer applies, not doctrine a reviewer reads.

**Scope Boundary**: sk-code-review only. The sk-code-side reference optimization is documented in phase 007. The four genuine references stay put.

**Dependencies**:
- sk-doc asset standard: `assets/skill/skill_asset_template.md`; validator `scripts/validate_document.py --type asset`.
- The rule canary `scripts/check-rule-copies.js` (keys on `pr_state_dedup.md`, which stays).

**Deliverables**:
- Six review checklists moved `references/` to `assets/`, each conformant to the asset template.
- Every by-path reference updated; the `.claude`/`.codex` mirrors re-synced.

**Changelog**:
- Documented in `sk-code-review/changelog/v1.5.0.0.md`.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Six `sk-code-review/references/` files (`code_quality_checklist`, `security_checklist`, `solid_checklist`, `test_quality_checklist`, `fix-completeness-checklist`, `removal_plan`) are checklist artifacts a reviewer applies, but they lived under `references/` (the home for explanatory doctrine the agent reads). Their overview sections also carried reference-flavored structure rather than the asset template's shape.

### Purpose
Put the review checklists where reusable checklist artifacts belong under the sk-doc convention, aligned to the asset template, without breaking any load path.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Move the six checklists `references/` to a new `assets/` folder (flat depth to preserve `../`-relative links).
- Align each moved checklist to the asset template OVERVIEW (Purpose + Usage); fully restructure the `fix-completeness` outlier.
- Update all coupling: SKILL.md routing + RESOURCE_MAP + Resource Domains prose, README, graph-metadata, sibling cross-links, 19 playbook files, 2 cross-skill `quality_standards.md`, and the runtime mirrors.

### Out of Scope
- The four genuine references (`review_core`, `review_ux_single_pass`, `quick_reference`, `pr_state_dedup`) - they stay in `references/`.
- Historical changelogs (v1.1-v1.4) - left as point-in-time records that cite the old paths.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `sk-code-review/references/{code_quality,security,solid,test_quality,fix-completeness,removal_plan}*.md` | Move | references/ to assets/ + asset-template alignment |
| `sk-code-review/{SKILL.md,README.md,graph-metadata.json}` | Modify | re-path the six checklists to assets/ |
| `sk-code-review/manual_testing_playbook/**` | Modify | 19 per-feature source-anchor edits |
| `sk-code/references/opencode/{python,shell}/quality_standards.md` | Modify | cross-skill checklist pointers |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The six checklists move to `assets/` and validate as assets | `validate_document.py --type asset` returns VALID for each `assets/*.md` |
| REQ-002 | No load path breaks | No stale `references/<moved>.md` remains (excluding historical changelogs); all relative links resolve |
| REQ-003 | The rule canary stays green | `check-rule-copies.js` exits 0 |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Each moved checklist follows the asset OVERVIEW shape | Every `assets/*.md` has `## 1. OVERVIEW` with `### Purpose` and `### Usage` |
| REQ-005 | The SKILL.md router prose matches the new home | §2 Resource Domains + loading levels point at `assets/` |
| REQ-006 | Runtime mirrors are consistent | `.claude`/`.codex` `assets/` match `.opencode`; no stale `references/<moved>` |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All six checklists validate `--type asset` and live in `assets/`; the four genuine references stay in `references/`.
- **SC-002**: Every coupled reference resolves (routing, README, metadata, sibling links, playbook anchors, cross-skill pointers); canary green.
- **SC-003**: `validate.sh --strict` passes for this phase folder; parent still validates as a phase parent.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A by-path reference is missed and breaks a load | Medium - stale link | Exhaustive grep sweep for all 6 names post-move; 0 stragglers asserted |
| Risk | Relative-link depth breaks on move | Medium - broken cross-links | Moved to `assets/` flat (same depth as `references/`); bidirectional links re-pathed and resolution-checked |
| Risk | Runtime mirrors drift (hardlinks broken by edits) | Low - local staleness | `.claude`/`.codex` re-synced after edits; mirrors are untracked/regenerated |
| Dependency | sk-doc `validate_document.py` | Blocks acceptance | Standard tooling under `sk-doc/scripts/` |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None outstanding. Move target (`assets/` flat) and removal_plan handling (moved whole) were settled during implementation.
<!-- /ANCHOR:questions -->

---
