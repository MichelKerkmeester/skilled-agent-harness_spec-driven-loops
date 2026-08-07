---
title: "Phase 7: sk-code Asset-Template Alignment + Smart-Router Conformance"
description: "Align sk-code's authoring-checklist assets to the sk-doc asset template and surface the canonical Resource Loading Levels table plus the UNKNOWN_FALLBACK checklist in the SKILL.md smart router, without losing the surface-first two-axis design or tripping its guards."
trigger_phrases:
  - "sk-code asset template alignment"
  - "sk-code smart router conformance"
  - "loading levels table"
  - "authoring checklist overview section"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-code/z_archive/015-sk-code-ponytail-based-refinement/007-sk-code-asset-router-alignment"
    last_updated_at: "2026-06-14T06:45:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Part A + B implemented and verified; spec folder authored"
    next_safe_action: "Run validate.sh --strict, then reconcile completion metadata"
    blockers: []
    key_files:
      - ".opencode/skills/sk-code/SKILL.md"
      - ".opencode/skills/sk-code/assets/opencode/checklists/skill_authoring.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "146-007-sk-code-asset-router-alignment"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions:
      - "Router depth -> structural conform, keep two-axis"
      - "Part C scope -> separate dedicated packet"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 7: sk-code Asset-Template Alignment + Smart-Router Conformance

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | In Progress |
| **Created** | 2026-06-14 |
| **Branch** | `028-mcp-to-cli-tool-transition` |
| **Parent Spec** | ../spec.md |
| **Phase** | 7 of 7 |
| **Predecessor** | 006-optional-addons |
| **Successor** | None |
| **Handoff Criteria** | All sk-code asset + router guards green and `validate.sh --strict` passes |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 7** of the 146 packet — a follow-on alignment pass distinct from the ponytail-transplant phases (001-006). It conforms sk-code's owned assets and router prose to the sk-doc skill-authoring standards surfaced while reviewing the ponytail work.

**Scope Boundary**: sk-code only — its `assets/opencode/checklists/*_authoring.md` files and the `SKILL.md §2` smart-router section. The parallel sk-code-review references-to-assets reclassification (Part C) is deliberately carved into its own dedicated packet because of its broad coupling.

**Dependencies**:
- sk-doc standards: `assets/skill/skill_asset_template.md`, `skill_smart_router.md`, `skill_md_template.md`.
- sk-doc validator: `scripts/validate_document.py` (`--type asset` and `--type skill`).
- sk-code guards: `assets/scripts/verify_stack_folders.py`, `sk-code-review/scripts/check-rule-copies.js`.

**Deliverables**:
- 5 `*_authoring.md` checklists conformant to the asset template (all 11 pass `--type asset`).
- A Resource Loading Levels table and an UNKNOWN_FALLBACK checklist inline in `SKILL.md §2`.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
sk-code's five `*_authoring.md` checklist assets led with `## 1. PURPOSE` and so failed the sk-doc asset template's required `OVERVIEW` section (`validate_document.py --type asset` → `missing_required_section: overview`). Separately, the `SKILL.md §2` smart router omitted two elements the canonical `skill_smart_router.md` standard makes visible inline: a Resource Loading Levels table and an UNKNOWN_FALLBACK disambiguation checklist (both existed only in `references/smart_routing.md`).

### Purpose
Bring sk-code's authoring assets and router prose to the sk-doc skill-authoring standard while preserving the surface-first two-axis routing design and every guard the router depends on.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Restructure the 5 `*_authoring.md` checklists to `## 1. OVERVIEW` (Purpose + Usage) with dividers and renumbering; content preserved verbatim.
- Add a Resource Loading Levels table (ALWAYS / CONDITIONAL / ON_DEMAND) to `SKILL.md §2`.
- Surface the UNKNOWN_FALLBACK disambiguation checklist inline in `SKILL.md §2`.

### Out of Scope
- The sk-code-review references-to-assets reclassification - carved into its own packet because of broad coupling (changelogs, playbook anchors, mirrors).
- Any change to the surface-first two-axis routing model, STACK_FOLDERS keys, or the Iron Law wording - explicitly preserved, not modified.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-code/assets/opencode/checklists/{agent,command,mcp_server,skill,spec_folder}_authoring.md` | Modify | PURPOSE -> OVERVIEW (Purpose + Usage), dividers, renumber |
| `.opencode/skills/sk-code/SKILL.md` | Modify | Add Resource Loading Levels table + UNKNOWN_FALLBACK checklist to §2 |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | All 11 sk-code checklist assets pass the asset template | `validate_document.py --type asset` returns VALID for every file in `assets/opencode/checklists/` |
| REQ-002 | The router rewrite preserves the STACK_FOLDERS parse contract | `verify_stack_folders.py` exits 0 with all declared surfaces resolving |
| REQ-003 | The router rewrite preserves both Iron Law lines | `check-rule-copies.js` exits 0; both SKILL.md Iron Law lines retain "completion claim" + "verification" |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | The Resource Loading Levels table is present and canonical | `SKILL.md §2` contains an ALWAYS / CONDITIONAL / ON_DEMAND table consistent with `smart_routing.md §3` |
| REQ-005 | The UNKNOWN_FALLBACK checklist is surfaced inline | `SKILL.md §2` contains the disambiguation checklist mirrored from `smart_routing.md §8` |
| REQ-006 | SKILL.md still validates and the ladder gate is intact | `validate_document.py --type skill` returns VALID; the Design Restraint Ladder reference remains in the Phase Overview |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 11 checklist assets validate `--type asset`; the 5 authoring files preserve their checklist content verbatim.
- **SC-002**: `SKILL.md §2` reads to the canonical loading-levels + fallback skeleton while the surface-first two-axis design and all four hard constraints remain intact.
- **SC-003**: `validate.sh --strict` passes for this phase folder and the parent still validates as a phase parent.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Router edit breaks the STACK_FOLDERS dict literal | High - `verify_stack_folders.py` fails | Additive insertions only; never touch the dict; re-run the guard after every edit |
| Risk | Router edit drifts an Iron Law line | High - `check-rule-copies.js` fails | Both Iron Law lines preserved verbatim; canary re-run after edit |
| Risk | Playbook by-section anchors break on line shifts | Medium - manual test refs stale | Playbook cites by-section, not by-line; named sections kept recognizable |
| Dependency | sk-doc `validate_document.py` | Blocks acceptance if unavailable | Standard tooling under `sk-doc/scripts/`; run locally |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None outstanding. Router depth (structural-conform, keep two-axis) and Part C scope (separate dedicated packet) were resolved with the operator before implementation.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The added router subsections stay read-time prose; they must not change resource-loading behavior or add runtime cost.
- **NFR-P02**: No new file loads are introduced; the Loading Levels table only names existing loads.

### Security
- **NFR-S01**: Markdown-only edits; no secrets, no executable logic, no input handling introduced.
- **NFR-S02**: The comment-hygiene contract is untouched; no forbidden ids added.

### Reliability
- **NFR-R01**: The four router guards (stack-folders, rule canary, asset validator, skill validator) must stay green after every edit.
- **NFR-R02**: Both Iron Law lines must retain the "completion claim" and "verification" substrings verbatim.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty or low-confidence intent: the new UNKNOWN_FALLBACK checklist covers the stack-agnostic and `max(intent_scores) < 0.5` case explicitly.
- STACK_FOLDERS parse: the dict literal must remain `ast.literal_eval`-parseable after the insertions.
- Unsupported surface: the fallback still refuses Go / Next.js / React Native / Swift routes.

### Error Scenarios
- Guard failure after an edit: revert via `git restore`; the insertions are additive with no migration.
- Validator drift on an asset: re-run `validate_document.py --type asset` and restore the OVERVIEW section.

### State Transitions
- Iron Law drift: both lines must keep "completion claim" + "verification"; the canary blocks any drift.
- Playbook anchor drift: the manual-test files cite by section, so line shifts are safe; named sections stay recognizable.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 6/25 | 6 markdown files, about 25 added lines, no logic |
| Risk | 8/25 | guarded router edit, no behavior change, 4 hard constraints |
| Research | 6/20 | standards already mapped during the prior ponytail review |
| **Total** | **20/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---
