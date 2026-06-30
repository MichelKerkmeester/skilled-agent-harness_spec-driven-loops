---
title: "Implementation Plan: Phase 7: sk-code Asset-Template Alignment + Smart-Router Conformance"
description: "Additive, structural-only edits: restructure five authoring-checklist assets to the sk-doc OVERVIEW shape, and insert a Resource Loading Levels table plus an UNKNOWN_FALLBACK checklist into the SKILL.md router, with deterministic guard verification after each change."
trigger_phrases:
  - "sk-code asset router plan"
  - "loading levels table plan"
  - "authoring checklist overview restructure"
  - "router conformance verification"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/skilled-agent-orchestration/z_archive/113-sk-code-ponytail-based-refinement/007-sk-code-asset-router-alignment"
    last_updated_at: "2026-06-14T06:45:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Part A + B implemented; guards green"
    next_safe_action: "Run validate.sh --strict on this phase folder"
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
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 7: sk-code Asset-Template Alignment + Smart-Router Conformance

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown skill assets + SKILL.md (OPENCODE surface) |
| **Framework** | sk-doc skill-authoring templates |
| **Storage** | None |
| **Testing** | `validate_document.py`, `verify_stack_folders.py`, `check-rule-copies.js` |

### Overview
Restructure the five `*_authoring.md` checklists so each leads with `## 1. OVERVIEW` (Purpose + Usage), and add the two canonical router elements (Resource Loading Levels table, UNKNOWN_FALLBACK checklist) to `SKILL.md §2`. All edits are additive or structural; the surface-first two-axis routing and the four router guards are preserved, not changed.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] Guards passing (asset validator, stack-folders, rule canary, skill validator)
- [x] Docs updated (spec/plan/tasks/checklist/implementation-summary)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Additive documentation conformance - no behavioral or routing-logic change.

### Key Components
- **Authoring checklists (`assets/opencode/checklists/*_authoring.md`)**: structural OVERVIEW restructure; checklist content preserved.
- **SKILL.md §2 SMART ROUTING**: two new subsections (Resource Loading Levels, UNKNOWN_FALLBACK Checklist) inserted; the heavy INTENT/RESOURCE pseudocode stays factored in `references/smart_routing.md`.

### Data Flow
A code task hits the router: surface detection (unchanged) -> the new Loading Levels table names ALWAYS/CONDITIONAL/ON_DEMAND -> intent + language detection (unchanged) -> UNKNOWN_FALLBACK checklist when no surface matches.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This phase touches shared routing prose, so the surface inventory below records what each guarded contract owns and how the change was verified.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `SKILL.md` STACK_FOLDERS literal | router surface map parsed by the validator | unchanged | `verify_stack_folders.py` exits 0 |
| `SKILL.md` Iron Law lines (x2) | completion-claim invariant the canary locks | unchanged | `check-rule-copies.js` exits 0 |
| `manual_testing_playbook/` SD-*/LS-* | cite router sections by name | unchanged | grep confirms "sub-detection table", "§4 ALWAYS" still resolve |
| `assets/opencode/checklists/*_authoring.md` | asset docs the router surfaces at authoring time | update (OVERVIEW restructure) | `validate_document.py --type asset` VALID x11 |

Required inventories:
- Consumers of the moved sections: `rg -n 'sub-detection table|ALWAYS anti-stall|Design Restraint Ladder' .opencode/skills/sk-code`.
- Guard invariants: STACK_FOLDERS keys (WEBFLOW/OPENCODE/MOTION_DEV) and both Iron Law substrings must survive verbatim.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Read the sk-doc asset + smart-router standards and the current sk-code files
- [x] Confirm the asset-validator failure mode and the four router hard constraints

### Phase 2: Core Implementation
- [x] Restructure the 5 `*_authoring.md` checklists to OVERVIEW (Purpose + Usage)
- [x] Add the Resource Loading Levels table to `SKILL.md §2`
- [x] Surface the UNKNOWN_FALLBACK checklist in `SKILL.md §2`

### Phase 3: Verification
- [x] `validate_document.py --type asset` VALID for all 11 checklists
- [x] `verify_stack_folders.py` exit 0; `check-rule-copies.js` exit 0; SKILL.md `--type skill` VALID
- [x] Documentation updated
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Schema/structure | All 11 checklist assets + SKILL.md | `validate_document.py --type asset/--type skill` |
| Invariant guard | STACK_FOLDERS literal | `verify_stack_folders.py` |
| Invariant guard | Iron Law wording | `check-rule-copies.js` |
| Manual | Router by-section anchors resolve | grep against `manual_testing_playbook/` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| sk-doc `validate_document.py` | Internal | Green | Cannot assert asset/skill conformance |
| sk-code guards | Internal | Green | Cannot assert constraint preservation |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: any guard fails or the router reads incorrectly after the edit.
- **Procedure**: `git restore -- .opencode/skills/sk-code/SKILL.md .opencode/skills/sk-code/assets/opencode/checklists/` to revert the additive edits; the changes are self-contained and carry no migration.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──► Phase 2 (Implementation) ──► Phase 3 (Verification)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | about 0.5 hour |
| Implementation | Low | about 1 hour |
| Verification | Low | about 0.5 hour |
| **Total** | | **about 2 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] No data changes; no backup needed
- [x] No feature flag (markdown docs only)
- [x] The four guards serve as the monitoring gate

### Rollback Procedure
1. `git restore` the edited `SKILL.md` and the five `*_authoring.md` checklists.
2. Re-run the four guards to confirm the green baseline.
3. No stakeholder notification needed (internal skill docs).

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---
