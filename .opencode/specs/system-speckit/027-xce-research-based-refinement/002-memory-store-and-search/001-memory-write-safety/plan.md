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
    packet_pointer: "system-speckit/027-xce-research-based-refinement/002-memory-store-and-search/001-memory-write-safety"
    last_updated_at: "2026-06-10T00:00:00Z"
    last_updated_by: "claude-fable-5"
    recent_action: "All plan phases complete incl. secret-redaction amendment"
    next_safe_action: "Start 027/005 reducers; this packet is their completed dependency"
    blockers: []
    key_files: ["spec.md", "tasks.md", "checklist.md", "implementation-summary.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-10-027-002-memory-write-safety-implementation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "OpenLTM amendment folded into this phase: pre-index secret redaction at the parse head"
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

Phase 002 implements the three P0 precondition fixes split from 027/005. The work is intentionally narrow: update causal provenance handling, add manual-edge overwrite protection, and prevent retention sweep from deleting protected high-tier records on TTL expiry alone. The OpenLTM amendment (spec.md) folds one further write-safety item into this phase: fail-closed pre-index secret redaction at the head of the memory write/index path, before content-hash, embedding, and FTS.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] pt-04 source decision identified in `../research/027-xce-research-pt-04/research.md`.
- [x] Original P0 scope identified in `../005-learning-feedback-reducers/spec.md` Sub-Phase 1.
- [x] Target production files named.
- [x] No dependency preconditions.

### Definition of Done

- [x] `auto-session` and other `auto-*` provenance values are capped like `auto`.
- [x] Manual causal edges cannot be overwritten by automatic/reducer upsert.
- [x] Retention sweep has tier and pin fields available before delete decisions.
- [x] Constitutional and critical expired rows are protected from TTL-only deletion.
- [x] Secrets are scrubbed fail-closed at the parse head before content-hash/embedding/FTS, with a redaction count in memory_health.
- [x] Focused tests pass (60/60 across the three focused suites).
- [x] Strict validation passes for this packet.
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
| `mcp_server/lib/storage/causal-edges.ts` | Edge insert/upsert and strength cap | Modify | Predicate tests and manual-overwrite fixture |
| `mcp_server/lib/storage/consolidation.ts` | Decay/consolidation cap behavior | Modify | `auto-session` cap fixture or shared helper coverage |
| `mcp_server/lib/governance/memory-retention-sweep.ts` | Expired-row selection and deletion | Modify | Expired protected/unprotected row tests |
| `mcp_server/handlers/memory-retention-sweep.ts` | MCP tool response for the sweep | Modify | Protected counts surfaced in summary/data |
| `mcp_server/lib/parsing/secret-scrubber.ts` | Pre-index secret redaction (new) | Create | Per-kind, false-positive, and fail-closed tests |
| `mcp_server/lib/parsing/memory-parser.ts` | Single parse head for write/index path | Modify | Scrub-before-content-hash integration test |
| `mcp_server/handlers/memory-crud-update.ts` | Direct title/trigger writes | Modify | Fail-closed refusal path |
| `mcp_server/handlers/memory-crud-health.ts` | memory_health report | Modify | `data.redaction` counter test |
| Existing causal tests | Regression coverage | Modify/Create | Auto, auto-session, manual, auto-to-auto rows |
| Existing retention tests | Regression coverage | Modify/Create | Tier, pinned, missing-tier matrix |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

- [x] Read `causal-edges.ts`, `consolidation.ts`, and `memory-retention-sweep.ts`.
- [x] Locate existing causal and retention tests.
- [x] Confirm whether a shared provenance helper already exists.
- [x] Confirm the current code still uses `createdBy === "auto"` / `created_by === "auto"` checks before editing.

### Phase 2: Core Implementation

- [x] Implement or reuse `isAutoEdgeCreator(createdBy)`.
- [x] Apply the predicate in `causal-edges.ts`.
- [x] Apply the predicate in `consolidation.ts`.
- [x] Add existing-edge lookup before upsert overwrite in `insertEdge`.
- [x] Preserve non-auto existing edge rows when attempted write provenance is auto/reducer.
- [x] Extend `RetentionExpiredRow` and select query fields.
- [x] Add tier-aware deletion decision before destructive delete.
- [x] Treat `auto`, `auto-session`, and other `auto-*` values as automatic in both insert and consolidation paths.
- [x] Preserve a non-auto existing edge when an automatic or reducer-origin upsert conflicts with it.
- [x] Select `importance_tier`, `decay_half_life_days`, `is_pinned`, `access_count`, and `last_accessed` before retention deletion.

### Phase 2b: Secret Redaction (OpenLTM Amendment)

- [x] Create the ordered, fail-closed secret scrubber module with typed `[REDACTED:<kind>]` markers.
- [x] Call the scrubber at the head of `parseMemoryContent`, BEFORE content-hash/embedding/FTS.
- [x] Scrub direct `title`/`triggerPhrases` writes in `memory_update` with fail-closed refusal.
- [x] Surface the redaction count in `memory_health`.

### Phase 3: Verification

- [x] Test `auto-session` cap behavior.
- [x] Test non-auto values are not classified as auto.
- [x] Test manual edge is not overwritten by auto/reducer write.
- [x] Test auto edge can still update under cap.
- [x] Test constitutional and critical expired rows are not deleted.
- [x] Test normal expired rows keep existing deletion behavior.
- [x] Test `auto-session` cannot bypass the strength cap in either edge insert or consolidation.
- [x] Test retention decisions protect pinned and high-tier rows from TTL-only deletion.
- [x] Test secret scrubbing across persisted fields, fail-closed-on-error, and the memory_health redaction count.
- [x] Run selected TypeScript tests.
- [x] Run strict spec validation.
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
| Unit/Integration | Secret scrubber kinds, false-positive guards, fail-closed, parse-head and memory_health integration | Vitest (`tests/secret-scrubber.vitest.ts`) |
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
| 027/005 learning reducers | Downstream | Waits on this packet | 005 should not start reducer work until this lands |

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
