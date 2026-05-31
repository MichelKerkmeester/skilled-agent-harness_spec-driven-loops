---
title: "Implementation Plan: 027/002 Memory Write Safety"
description: "Plan for three focused P0 safety fixes: broaden auto provenance caps, preserve manual causal edges on upsert, and make retention sweep tier-aware before deletion."
trigger_phrases:
  - "027 phase 002"
  - "feedback P0 correctness"
  - "auto-provenance cap broadening"
  - "manual-edge overwrite guard"
  - "retention-sweep tier basement"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/001-memory-write-safety"
    last_updated_at: "2026-05-11T00:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Scaffolded packet per pt-04 audit"
    next_safe_action: "Read the three target production files and implement the P0 fixes with focused tests"
    blockers: []
    key_files: ["spec.md", "tasks.md", "checklist.md", "implementation-summary.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-05-11-012-feedback-p0-correctness-scaffold"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: 027/002 Memory Write Safety

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript |
| **Framework** | system-spec-kit MCP server |
| **Storage** | Existing causal graph and memory retention stores |
| **Testing** | Focused Vitest/unit tests, OpenCode checks, strict spec validation |

### Overview

Phase 002 implements the three P0 precondition fixes split from 027/009. The work is intentionally narrow: update causal provenance handling, add manual-edge overwrite protection, and prevent retention sweep from deleting protected high-tier records on TTL expiry alone.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] pt-04 source decision identified in `../research/027-xce-research-pt-04/research.md`.
- [x] Original P0 scope identified in `../009-feedback-reducers/spec.md` Sub-Phase 1.
- [x] Target production files named.
- [x] No dependency preconditions.

### Definition of Done

- [ ] `auto-session` and other `auto-*` provenance values are capped like `auto`.
- [ ] Manual causal edges cannot be overwritten by automatic/reducer upsert.
- [ ] Retention sweep has tier and pin fields available before delete decisions.
- [ ] Constitutional and critical expired rows are protected from TTL-only deletion.
- [ ] Focused tests pass.
- [ ] Strict validation passes for this packet.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Small policy hardening inside existing causal and retention modules. No new reducer architecture is introduced in this packet.

### Key Components

- **Auto provenance predicate**: maps `auto` and `auto-*` to automatic provenance for strength capping.
- **Manual-edge preservation guard**: checks existing edge provenance before an upsert can overwrite curated rows.
- **Retention deletion decision**: enriches expired rows with tier fields and blocks destructive delete for protected tiers.

### Data Flow

Causal edge writes enter `insertEdge`, inspect requested provenance, inspect existing provenance on conflict, and either preserve or upsert. Consolidation applies the same auto-provenance cap semantics. Retention sweep selects expired rows with tier metadata, classifies the row, and only calls deletion for unprotected records.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `mcp_server/lib/causal/causal-edges.ts` | Edge insert/upsert and strength cap | Modify | Predicate tests and manual-overwrite fixture |
| `mcp_server/lib/causal/consolidation.ts` | Decay/consolidation cap behavior | Modify | `auto-session` cap fixture or shared helper coverage |
| `mcp_server/lib/memory/memory-retention-sweep.ts` | Expired-row selection and deletion | Modify | Expired protected/unprotected row tests |
| Existing causal tests | Regression coverage | Modify/Create | Auto, auto-session, manual, auto-to-auto rows |
| Existing retention tests | Regression coverage | Modify/Create | Tier, pinned, missing-tier matrix |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

- [ ] Read `causal-edges.ts`, `consolidation.ts`, and `memory-retention-sweep.ts`.
- [ ] Locate existing causal and retention tests.
- [ ] Confirm whether a shared provenance helper already exists.

### Phase 2: Core Implementation

- [ ] Implement or reuse `isAutoEdgeCreator(createdBy)`.
- [ ] Apply the predicate in `causal-edges.ts`.
- [ ] Apply the predicate in `consolidation.ts`.
- [ ] Add existing-edge lookup before upsert overwrite in `insertEdge`.
- [ ] Preserve non-auto existing edge rows when attempted write provenance is auto/reducer.
- [ ] Extend `RetentionExpiredRow` and select query fields.
- [ ] Add tier-aware deletion decision before destructive delete.

### Phase 3: Verification

- [ ] Test `auto-session` cap behavior.
- [ ] Test non-auto values are not classified as auto.
- [ ] Test manual edge is not overwritten by auto/reducer write.
- [ ] Test auto edge can still update under cap.
- [ ] Test constitutional and critical expired rows are not deleted.
- [ ] Test normal expired rows keep existing deletion behavior.
- [ ] Run selected TypeScript tests.
- [ ] Run strict spec validation.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Reason |
|-------|------------|--------|
| Phase 1: Setup | None | Read current files and tests before implementation. |
| Phase 2: Core Implementation | Phase 1 | Existing helper/test layout determines whether to share or duplicate provenance logic. |
| Phase 3: Verification | Phase 2 | Fixtures must exercise the actual production behavior. |

Execution order is sequential. P0-1 and P0-2 both touch causal edge semantics, so implement and test those together before changing retention sweep.
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Auto provenance predicate and cap boundaries | Vitest |
| Unit | `insertEdge` conflict behavior | Vitest with existing DB/test fixture |
| Unit/Integration | Retention sweep expired-row decision | Existing retention test harness |
| Regression | Existing causal and retention tests | Project test runner selected from current package scripts |
| Documentation | Spec folder contract | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <folder> --strict` |

Required matrix:

| Axis | Values |
|------|--------|
| New provenance | `auto`, `auto-session`, `auto-rq-b3`, `manual` |
| Existing edge provenance | none, `auto`, `auto-session`, `manual` |
| Retention tier | constitutional, critical, important, normal, temporary, missing |
| Retention state | expired only, expired+pinned, expired+recent access |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATE

| Area | Production LOC | Test LOC | Notes |
|------|----------------|----------|-------|
| Auto provenance cap | 10-20 | 15-30 | Shared helper or paired local predicates. |
| Manual-edge overwrite guard | 20-35 | 20-35 | Existing-edge lookup plus conflict fixture. |
| Retention tier basement | 20-35 | 25-35 | Row schema/select fields plus deletion decision matrix. |
| **Total** | **50-80** | **60-100** | Matches pt-04 carve-out estimate. |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Existing causal graph write path | Internal | Available | Required for P0-1 and P0-2 |
| Existing retention sweep | Internal | Available | Required for P0-3 |
| 027/009 learning reducers | Downstream | Waits on this packet | 009 should not start reducer work until this lands |

No external dependencies. No network access required.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Focused tests show the guard blocks legitimate manual writes, or retention sweep stops deleting unprotected expired rows.
- **Procedure**: Revert the three production file edits and associated tests, then re-open this packet with the failing matrix row documented.
- **Blast radius**: Causal edge write path and retention sweep only.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

| Failure Mode | Detection | Rollback |
|--------------|-----------|----------|
| Auto predicate overmatches non-auto values | Predicate fixture fails | Restore previous predicate and add narrower namespace handling. |
| Manual-edge guard blocks manual writes | Conflict fixture or integration test fails | Restrict guard to automatic/reducer call paths only. |
| Retention sweep stops normal expiry deletes | Retention matrix fails | Keep extended row schema but restore delete decision for unprotected tiers. |

Rollback must preserve any tests that capture the failure case, even if production code is reverted during investigation.
<!-- /ANCHOR:enhanced-rollback -->
