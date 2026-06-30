---
title: "Implementation Plan: Phase 8: sk-code-review Checklist Reclassification"
description: "Move six review checklists references/ to assets/ (flat, to preserve relative links), align each to the asset template, and update every coupled path in lockstep, verified by the asset validator, the rule canary, and a grep sweep."
trigger_phrases:
  - "sk-code-review reclassification plan"
  - "checklist move plan"
  - "coupling lockstep update"
  - "asset alignment plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/skilled-agent-orchestration/z_archive/113-sk-code-ponytail-based-refinement/008-sk-code-review-checklist-reclassification"
    last_updated_at: "2026-06-14T07:40:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Move + coupling + alignment executed; guards green"
    next_safe_action: "Run validate.sh --strict on this phase folder"
    blockers: []
    key_files:
      - ".opencode/skills/sk-code-review/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "146-008-sk-code-review-checklist-reclassification"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 8: sk-code-review Checklist Reclassification

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown skill assets + SKILL.md (OPENCODE surface) |
| **Framework** | sk-doc skill-authoring templates |
| **Storage** | None |
| **Testing** | `validate_document.py --type asset`, `check-rule-copies.js`, grep sweep |

### Overview
Move the six checklists to a new flat `assets/` folder (same depth as `references/`, so `../`-relative links keep resolving), align each to the asset template OVERVIEW, then update every coupled path - routing, README, metadata, sibling cross-links, playbook anchors, cross-skill pointers - in the same pass, and re-sync the untracked runtime mirrors.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] The six asset candidates and four genuine references are classified
- [x] Full coupling map and cross-link topology captured
- [x] Mirror structure and canary dependency confirmed

### Definition of Done
- [x] Six checklists validate as assets in `assets/`
- [x] 0 stale `references/<moved>` (excluding historical changelogs); all links resolve; canary green
- [x] Mirrors re-synced; changelog written
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
File reclassification with lockstep path reconciliation - no behavioral or review-doctrine change.

### Key Components
- **Moved checklists (`assets/*.md`)**: six review-checklist artifacts; asset-template OVERVIEW alignment.
- **Staying references (`references/*.md`)**: four genuine doctrine/index/spec files, unchanged in place except cross-link re-pathing.
- **Coupling surfaces**: SKILL.md routing, README, graph-metadata, playbook anchors, cross-skill pointers, runtime mirrors.

### Data Flow
The reviewer's router discovers `references/` + `assets/` recursively; the six checklists now resolve from `assets/`, the loading-levels table and RESOURCE_MAP name `assets/` paths, and the staying references link out to `../assets/`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This phase moves shared, widely-referenced files, so the surface inventory records every consumer and how the change was verified.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `references/<6 checklists>` | misfiled checklist artifacts | move to `assets/` + align | `validate_document.py --type asset` VALID x6 |
| `SKILL.md` routing / RESOURCE_MAP / Resource Domains | names the checklist paths | update to `assets/` | `--type skill` VALID; grep shows 0 stale |
| README, graph-metadata | reference table + metadata paths | update to `assets/` | 0 stale `references/<moved>` |
| staying refs + moved files | bidirectional cross-links | re-path | all relative links resolve on disk |
| `manual_testing_playbook/**`, cross-skill `quality_standards.md` | cite checklists by path | update | grep sweep clean |
| `.claude` / `.codex` mirrors | untracked runtime copies | re-sync | mirror `assets/` matches `.opencode` |

Required inventories:
- Consumers of the moved files: `rg -n 'references/(code_quality|solid|fix-completeness|security|test_quality|removal_plan)' .opencode/skills` (must be empty except changelogs).
- Canary invariant: the rule canary keys on `pr_state_dedup.md` (a staying reference), so it is unaffected.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Classify the 10 references; map coupling + cross-link topology
- [x] Confirm mirrors are untracked/hardlinked and the canary's dependency

### Phase 2: Core Implementation
- [x] `git mv` the six to `assets/`; re-path bidirectional cross-links
- [x] Update SKILL/README/graph-metadata/playbook/cross-skill paths
- [x] Align each moved checklist to the asset OVERVIEW; restructure `fix-completeness`

### Phase 3: Verification
- [x] Asset validator VALID x6; grep sweep 0 stale; all links resolve
- [x] Canary exit 0; SKILL `--type skill` VALID; mirrors re-synced
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Schema/structure | the six moved checklists + SKILL.md | `validate_document.py --type asset/skill` |
| Invariant guard | load-bearing review wording | `check-rule-copies.js` |
| Coupling | no stale paths, links resolve | grep sweep + on-disk resolution check |
| Mirror parity | `.claude`/`.codex` consistency | rsync + diff |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| sk-doc `validate_document.py` | Internal | Green | Cannot assert asset conformance |
| sk-code-review rule canary | Internal | Green | Cannot assert wording invariants |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a load path breaks or a guard fails.
- **Procedure**: `git mv` the six files `assets/` back to `references/` and `git restore` the coupled files; the change is path-only with no data migration, and historical changelogs were never touched.
<!-- /ANCHOR:rollback -->

---
