---
title: "Implementation Plan: System Skill Advisor Reference Template Alignment"
description: "Implementation plan for canonicalizing system-skill-advisor references, leaving compatibility stubs, and updating smart-router/resource navigation."
trigger_phrases:
  - "system skill advisor reference alignment plan"
  - "advisor reference template implementation"
importance_tier: "important"
contextType: "documentation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/008-skill-advisor-documentation/007-reference-template-alignment"
    last_updated_at: "2026-05-24T07:27:00Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Completed reference template alignment and validation"
    next_safe_action: "Packet complete; use this folder as validation evidence for the reference cleanup"
    blockers: []
    key_files:
      - ".opencode/skills/system-skill-advisor/SKILL.md"
      - ".opencode/skills/system-skill-advisor/README.md"
      - ".opencode/skills/system-skill-advisor/references/"
    session_dedup:
      fingerprint: "sha256:1111111111111111111111111111111111111111111111111111111111111111"
      session_id: "system-skill-advisor-reference-template-alignment-2026-05-24"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Use compatibility stubs."
      - "Create a new spec packet."
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: System Skill Advisor Reference Template Alignment

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown documentation, OpenCode skill docs |
| **Framework** | sk-doc reference template and system-spec-kit packet validation |
| **Storage** | Git-tracked markdown files |
| **Testing** | sk-doc extract/validate, quick_validate, rg checks, spec strict validation |

### Overview

Move the advisor reference corpus into canonical snake_case subfolders and leave old root paths as short stubs. Update router/resource maps and active documentation links so canonical paths are preferred while runtime advisor behavior stays unchanged.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] User selected canonical folders plus compatibility stubs.
- [x] User selected a new spec packet.
- [x] Current reference inventory and validation drift inspected.

### Definition of Done

- [x] Canonical references and stubs validate as references.
- [x] `SKILL.md` validates as a skill.
- [x] `README.md` validates as a README.
- [x] `quick_validate.py` passes for `system-skill-advisor`.
- [x] rg checks show no stale active root paths or canonical kebab-case reference files.
- [x] Packet strict validation passes.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Documentation-only canonicalization with compatibility stubs.

### Key Components

- **Canonical references**: focused subfolders under `references/` with snake_case filenames.
- **Compatibility stubs**: old root kebab-case files containing only a valid reference-template pointer.
- **Smart router**: dynamic markdown discovery plus intent-to-resource maps that point at canonical paths.
- **Active navigation docs**: README, INSTALL_GUIDE, database README, feature catalog and playbook links.

### Data Flow

Reader or router intent enters `SKILL.md`, maps to a canonical reference domain, and loads a canonical markdown file. Existing old-path links open a root stub and then point to the canonical destination.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Advisor references | Canonical knowledge base | Move, template-align, link-check | reference validation and rg checks |
| Root reference paths | Existing link targets | Replace with stubs | reference validation |
| `SKILL.md` router | Agent resource navigation | Rewrite with sk-doc resilience pattern | skill validation and rg canonical path checks |
| Active docs | Human navigation | Update links to canonical paths | README validation and link smoke check |
| Runtime MCP files | Advisor behavior | Unchanged | git diff scope inspection |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Packet and Inventory

- [x] Create Level 3 packet.
- [x] Inspect current references, router, README links and validator drift.

### Phase 2: Reference Canonicalization

- [x] Move references into canonical subfolders.
- [x] Add old-path compatibility stubs.
- [x] Align canonical references to the sk-doc reference template.

### Phase 3: Navigation and Router

- [x] Update `SKILL.md` smart router and resource map.
- [x] Update active README, install, database, feature catalog and playbook links.

### Phase 4: Verification

- [x] Run extract/validate on changed docs.
- [x] Run quick validation and rg checks.
- [x] Run strict spec validation.
- [x] Reconcile completion metadata.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Structure extraction | Changed skill, README, references and stubs | `extract_structure.py` |
| Template validation | Canonical references and stubs | `validate_document.py --type reference --blocking-only` |
| Skill/README validation | Router and human navigation docs | `validate_document.py --type skill/readme --blocking-only` |
| Skill package validation | Whole advisor skill docs | `quick_validate.py --json` |
| Drift checks | Stale paths, ToC, kebab-case canonical refs | `rg` |
| Packet validation | New spec packet | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| sk-doc validators | Internal | Green | Cannot prove reference-template compliance. |
| system-spec-kit validator | Internal | Green | Cannot claim packet completion. |
| Dirty worktree isolation | Local state | Yellow | Requires careful diff inspection before final. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Reference validation fails in a way that cannot be fixed inside documentation scope, or active links cannot be reconciled.
- **Procedure**: Revert this packet's documentation/reference moves and restore old root files from git, leaving unrelated pre-existing worktree changes untouched.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Packet + Inventory -> Reference Canonicalization -> Navigation + Router -> Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Packet and Inventory | None | Reference Canonicalization |
| Reference Canonicalization | Packet and Inventory | Navigation and Router |
| Navigation and Router | Reference Canonicalization | Verification |
| Verification | Navigation and Router | Completion claim |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Packet and Inventory | Low | 15 minutes |
| Reference Canonicalization | Medium | 60-90 minutes |
| Navigation and Router | Medium | 30-45 minutes |
| Verification | Medium | 30-45 minutes |
| **Total** | | **2-3 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist

- [x] Diff confirms runtime files were not modified by this packet.
- [x] Canonical references and stubs validate.

### Rollback Procedure

1. Restore moved reference docs to their previous root paths.
2. Remove compatibility stubs and canonical subfolders created by this packet.
3. Restore active documentation links to previous root references.
4. Re-run sk-doc and packet validation.

### Data Reversal

- **Has data migrations?** No.
- **Reversal procedure**: N/A.
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```text
sk-doc template
      |
      v
canonical references + stubs
      |
      v
SKILL.md router + README/navigation
      |
      v
validation evidence
```
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

```text
reference moves -> stubs -> router/docs links -> validation -> completion metadata
```

The work can only claim completion after canonical references, old-path stubs and active navigation all validate together.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Evidence |
|-----------|----------|
| Reference layout complete | Canonical subfolders exist and root stubs validate. |
| Router alignment complete | `SKILL.md` validates and RESOURCE_MAP uses canonical paths. |
| Validation complete | sk-doc, rg, quick validation and strict packet validation pass. |
<!-- /ANCHOR:milestones -->
