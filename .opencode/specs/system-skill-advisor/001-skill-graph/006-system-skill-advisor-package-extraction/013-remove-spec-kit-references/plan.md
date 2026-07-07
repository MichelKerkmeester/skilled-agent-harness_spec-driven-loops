---
title: "Implementation Plan: Sweep stale advisor refs from spec-kit docs"
description: "Plan for auditing, bucketing, fixing, and validating stale advisor references in system-spec-kit docs."
trigger_phrases:
  - "013/009/013 plan"
  - "spec-kit advisor docs cleanup plan"
importance_tier: "critical"
contextType: "plan"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/001-skill-graph/006-system-skill-advisor-package-extraction/013-remove-spec-kit-references"
    last_updated_at: "2026-05-14T19:00:00Z"
    last_updated_by: "codex"
    recent_action: "Plan executed"
    next_safe_action: "Commit scoped changes"
    blockers: []
    completion_pct: 100
---
# Implementation Plan: Sweep stale advisor refs from spec-kit docs

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, JSON packet metadata |
| **Framework** | system-spec-kit Level 2 docs |
| **Storage** | Packet docs under `.opencode/specs/` |
| **Testing** | Grep audit, strict spec validation, targeted spot-checks |

### Overview

Classify advisor-related references in spec-kit operator docs into stale live, stale historical, current sibling, and no-longer-relevant buckets. Rewrite or delete stale live content, annotate historical content only where ambiguity remains, and capture binding counts.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Gate 3 answered for `013/009/013`.
- [x] Required handover and ADR-004 stale-doc policy read.
- [x] Baseline grep captured.

### Definition of Done

- [x] Zero stale live references remain.
- [x] Strict validation passes for `013`.
- [x] Checklist rows are checked with evidence.
- [ ] Scoped commit lands on `main`.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Documentation-only topology reconciliation after extraction.

### Key Components

- **Spec-kit docs**: the current operator-facing documentation surface.
- **System-skill-advisor sibling**: current owner of advisor functionality and standalone MCP server.
- **ADR-004 policy**: delete live stale refs, annotate historical refs.

### Data Flow

Grep finds advisor references, manual bucketing determines action, edits update only stale or misplaced content, and final grep plus strict validation prove the docs and packet are consistent.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Pre-flight and Scaffold

- [x] Read required parent handover, ADR-004 policy, 008 D2 evidence, and 010 metadata shape.
- [x] Scaffold Level 2 packet files.
- [x] Run baseline advisor grep and record hit count.

### Phase 2: Bucket and Fix

- [x] Classify grep hits into `STALE_LIVE`, `STALE_HISTORICAL`, `CURRENT_SIBLING`, and `NO_LONGER_RELEVANT`.
- [x] Rewrite stale live paths and ownership statements.
- [x] Annotate historical references where ambiguity remains.
- [x] Delete advisor-owned entries from spec-kit docs where they are no longer relevant.

### Phase 3: Verification

- [x] Re-run advisor grep and confirm zero stale live matches.
- [x] Run strict validation for this packet.
- [x] Spot-check fixed files for context preservation.

### Phase 4: Packet Docs and Commit

- [x] Fill implementation summary with binding counts.
- [x] Check checklist rows with evidence.
- [x] Mark tasks complete.
- [ ] Commit scoped changes on `main`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Static audit | Advisor doc references | Required `rg` pattern |
| Metadata | Packet contract | `validate.sh --strict` |
| Manual review | Edited docs | Spot-check 3-5 fixed files |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 013/009 extraction context | Internal | Read | Needed to classify current versus stale topology. |
| Parallel packet boundaries | External | Avoided | Prevents races with packet 011 and 012. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Validation fails, stale live references remain, or out-of-scope files are modified.
- **Procedure**: Revert only this packet's commit, restore edited docs, and rerun the baseline grep before another attempt.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Pre-flight | Gate 3 and required reads | Bucketing |
| Bucket and fix | Baseline grep | Verification |
| Verification | Fixes | Commit |
| Commit | Packet docs | Delivery |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Pre-flight | Low | 20 minutes |
| Bucket and fix | Medium | 45 minutes |
| Verification | Low | 20 minutes |
| Commit | Low | 10 minutes |
| **Total** | | **Single dispatch** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Data Reversal

- **Has data migrations?** No.
- **Reversal procedure**: Git revert restores docs and packet metadata.
<!-- /ANCHOR:enhanced-rollback -->
