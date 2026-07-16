---
title: "Implementation Plan: Docs and Catalogs Rollup"
description: "Gap-analysis driven umbrella-docs rollup: find genuinely-missing 026 capabilities per doc, then apply surgical content-preserving additions."
trigger_phrases:
  - "docs rollup plan"
  - "umbrella docs gap analysis"
  - "catalog rollup plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/000-release-and-program-cleanup/008-docs-and-catalogs-rollup/001-docs-and-catalogs-rollup"
    last_updated_at: "2026-06-01T00:00:00Z"
    last_updated_by: "claude-orchestrator"
    recent_action: "Rollup complete"
    next_safe_action: "None, packet complete"
    blockers: []
    key_files: ["spec.md", "implementation-summary.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000021"
      session_id: "docs-rollup-2026-06-01"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Docs and Catalogs Rollup

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown docs |
| **Framework** | Agent workflow (gap analysis + apply) |
| **Storage** | Filesystem (umbrella docs + catalogs) |
| **Testing** | HVR lint, link check, content-preservation diff |

### Overview

Run a read-only gap analysis of each umbrella doc against the 026 changelogs to find genuinely-missing capabilities, then apply surgical additions per doc, preserving all existing content.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] 026 changelogs and audit available as the shipped-capability source
- [x] Target umbrella docs identified

### Definition of Done
- [x] Genuine gaps applied, sync not aspiration
- [x] No content removed, no new HVR violations, no broken links
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Gap-analysis then surgical-apply. Read-only analysis produces a per-doc gap list, then a content-preserving apply pass inserts only the missing material.

### Key Components

- **Gap analyzer**: one read-only agent per doc comparing the doc against the changelogs.
- **Apply agent**: one agent per doc inserting the listed gaps with a content-preservation guard.

### Data Flow

026 changelogs and audit feed the gap analysis. Gap lists feed the apply pass. Diffs are verified additions-only.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Documentation rollup, not a code fix. The cross-cutting concern is keeping capability claims consistent with what shipped and not duplicating capabilities that moved to extracted skills.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| umbrella docs | describe capabilities | add missing 026 capabilities | gap analysis + grep |
| code-graph and advisor docs | extracted skills | not a consumer here | left to system-code-graph and system-skill-advisor |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Gather 026 shipped-capability evidence (changelogs, rollups, audit)
- [x] Identify the 7 umbrella docs and confirm existence

### Phase 2: Core Implementation
- [x] Gap analysis per doc (read-only)
- [x] Apply surgical additions per doc
- [x] Update tool counts where justified by the net-new tool

### Phase 3: Verification
- [x] Content-preservation diff (additions-only)
- [x] HVR lint on added lines
- [x] Link existence check
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Content preservation | each doc diff | git diff numstat |
| Voice | added lines | grep HVR lint |
| Links | referenced paths | ls or test -e |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 026 changelogs and audit | Internal | Green | No shipped-capability source |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: An umbrella doc regresses (content lost or wrong claim).
- **Procedure**: `git checkout` the affected doc. Additions are isolated per doc.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) --> Phase 2 (Gap + Apply) --> Phase 3 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core |
| Core | Setup | Verify |
| Verify | Core | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | Done |
| Gap + Apply | Medium | 14 agents (7 analyze, 7 apply) |
| Verify | Low | Diff + grep |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Per-doc diff reviewed for additions-only
- [x] Referenced paths verified

### Rollback Procedure
1. Identify the regressed doc.
2. `git checkout` that doc.
3. Re-verify the remaining docs.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: git checkout of the doc paths.
<!-- /ANCHOR:enhanced-rollback -->
