---
title: "Implementation Plan: Advisor doc alignment with sk-doc"
description: "Plan for aligning system-skill-advisor documentation with sk-doc templates and current post-013/009 advisor state."
trigger_phrases:
  - "013/009/012 plan"
  - "doc alignment plan"
importance_tier: "critical"
contextType: "plan"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/004-skill-graph/006-system-skill-advisor-package-extraction/012-sk-doc-documentation-alignment"
    last_updated_at: "2026-05-14T18:45:00Z"
    last_updated_by: "codex"
    recent_action: "Plan executed"
    next_safe_action: "Commit scoped documentation changes only"
    blockers: []
    completion_pct: 100
---
# Implementation Plan: Advisor doc alignment with sk-doc

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, JSON |
| **Framework** | sk-doc, system-spec-kit validation |
| **Storage** | Packet metadata JSON only |
| **Testing** | JSON parse, anchor/frontmatter checks, strict spec validation |

### Overview

Align advisor docs by applying template traces, anchor normalization, current-reality architecture structure, and content corrections for the standalone `system_skill_advisor` server.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Gate 3 pre-answered for new packet 012.
- [x] Required sk-doc templates and advisor docs read.
- [x] Baseline advisor Markdown inventory captured.

### Definition of Done

- [x] Packet metadata JSON parses.
- [x] Scoped docs have anchors and sk-doc template traces.
- [x] Root README advisor section is current.
- [x] Strict validation passes for packet 012.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Documentation-only quality pass with role-based template mapping.

### Key Components

- **Skill root docs**: runtime and operator entry points.
- **Feature catalog**: asset-style capability references.
- **Manual testing playbook**: scenario contracts and expected evidence.
- **References**: technical policies and migration boundaries.
- **Inner READMEs**: folder-level orientation.
- **Root README**: public package overview.

### Data Flow

Source truth comes from existing docs and source reads. The pass updates Markdown only, then records evidence in packet 012 docs.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `SKILL.md` | Runtime skill instructions | Align with eight-tool current state | Spot check |
| `ARCHITECTURE.md` | Package architecture | Rewrite current-reality flow | Section check |
| `feature_catalog/**` | Feature references | Add template traces and correct stale claims | Search check |
| `manual_testing_playbook/**` | Manual validation package | Add anchors and normalize fixed pass-count wording | Search check |
| `references/**` | Policy docs | Add anchors and update DB/path boundary wording | Spot check |
| Inner `README.md` files | Folder orientation | Add template traces and anchors | Anchor check |
| Root `README.md` | Public overview | Update advisor server path, tools, and pending 011 note | Spot check |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

- [x] Inventory advisor Markdown docs.
- [x] Read required sk-doc templates and current advisor architecture docs.
- [x] Scaffold packet 012 Level 2 docs and metadata.

### Phase 2: Documentation Alignment

- [x] Apply template traces and anchors across scoped docs.
- [x] Rewrite advisor architecture.
- [x] Update skill-root docs, inner READMEs, feature catalog, playbook, and references.
- [x] Update root README advisor content.

### Phase 3: Verification

- [x] Run metadata JSON parse.
- [x] Run anchor/frontmatter/template trace checks.
- [x] Run stale wording searches.
- [x] Run strict packet validation.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Metadata | Packet JSON | `node -e JSON.parse(...)` |
| Structure | Advisor Markdown | Node anchor/frontmatter scripts |
| Content | Stale claims | `rg` searches |
| Packet | Level 2 spec docs | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| sk-doc templates | Internal | Read | Needed for template mapping. |
| Advisor source truth | Internal | Read | Needed for eight-tool and lane-weight claims. |
| Parallel packet-011 files | Worktree | Present | Must not be committed by packet 012. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Strict validation fails, source files enter the commit, or docs misstate current advisor ownership.
- **Procedure**: Revert the documentation commit and rerun packet validation after restoring packet docs to the prior state.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Gate 3 and required reads | Documentation alignment |
| Documentation alignment | Setup | Verification |
| Verification | Documentation alignment | Commit |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | Completed in-session |
| Documentation Alignment | Medium | Completed in-session |
| Verification | Medium | Completed in-session |
| **Total** | | **Single dispatch** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Data Reversal

- **Has data migrations?** No.
- **Reversal procedure**: Git revert restores documentation content. No runtime data store is involved.
<!-- /ANCHOR:enhanced-rollback -->
