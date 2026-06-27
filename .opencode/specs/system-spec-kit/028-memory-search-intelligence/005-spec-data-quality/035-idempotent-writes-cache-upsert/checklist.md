---
title: "Verification Checklist: Idempotent Writes and Global-Cache Upsert [template:level_2/checklist.md]"
description: "Verification Date: Completed (implementation-summary records Status COMPLETE)"
trigger_phrases:
  - "idempotent description writes"
  - "global cache upsert"
  - "content hash gated description"
  - "ensureDescriptionCache over-reach"
  - "description json no-op skip"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/005-spec-data-quality/035-idempotent-writes-cache-upsert"
    last_updated_at: "2026-06-22T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Verified the idempotent writes and the upsert split, vitest and typecheck green"
    next_safe_action: "Graduation follow-on, scoped migration and live-caller routing before flipping the flag on"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/folder-discovery.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/config/capability-flags.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/tests/folder-discovery-idempotent.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-035-idempotent-writes-cache-upsert"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Idempotent Writes and Global-Cache Upsert

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
<!--
SELF-CHECK:
- Confirm every required item has concrete evidence before marking it complete.
- Keep optional deferrals explicit, owned, and separate from blockers.
FAILURE MODES:
- Rubber-stamping the checklist, vague tested-claims, and hidden blocker deferrals.
-->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md
- [x] CHK-002 [P0] Technical approach defined in plan.md
- [x] CHK-003 [P1] Write helpers, the canonical-field builder, and the default-OFF flag mechanism identified and available, confirmed against live code before editing
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] The fingerprint excludes the volatile stamps, the per-folder hash strips `lastUpdated` and the cache hash strips `generated`. It hashes the full write payload rather than the canonical subset alone so a memory-tracking row change still writes, documented in the decisions table
- [x] CHK-011 [P0] No console errors or warnings, vitest run clean and typecheck clean with the flag ON and OFF
- [x] CHK-012 [P1] The missing-cache bootstrap, first-write, and canonical-save escape-hatch branches are handled and tested
- [x] CHK-013 [P1] The change follows the existing `folder-discovery.ts` atomic write-helper patterns and the sibling capability-flag style
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Acceptance criteria met, REQ-001 through REQ-006 and REQ-008 proven by vitest. REQ-007 grandfather reporter deferred with rationale, the default-OFF flag is the rollout guard
- [x] CHK-021 [P0] A no-delta rerun with the flag ON writes nothing and preserves `lastUpdated` and `generated`, proven by the skip and aggregate-gate tests
- [x] CHK-022 [P1] A real content change with the flag ON writes exactly once and advances only the changed entry, proven by the real-delta and targeted-upsert tests
- [x] CHK-023 [P1] A per-folder upsert touches only the target entry and scans no other base path, the full rebuild stays reserved for structural changes, and with the flag OFF the legacy unconditional write path runs untouched
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] The reconciled graph test is class `test-isolation`, it encoded the old non-idempotent contract. The write-determinism change is `class-of-bug`, non-idempotent description writes
- [x] CHK-FIX-002 [P0] Same-class producer inventory run, `rg writeFileSync|new Date.toISOString|lastUpdated|generated` over `folder-discovery.ts`, the description-side producers are the seams edited here
- [x] CHK-FIX-003 [P0] Consumer inventory run for `savePerFolderDescription`, `saveDescriptionCache`, and `ensureDescriptionCache`. The new third options arg is optional, so all existing positional callers compile unchanged, confirmed by typecheck
- [x] CHK-FIX-004 [P0] No new path, parser, or redaction surface, the fingerprint reads existing on-disk content. The no-op, fallback to write on a missing or unparseable file, and missing-cache bootstrap cases are covered by tests
- [x] CHK-FIX-005 [P1] Matrix axes listed in the implementation-summary verification table, flag ON no-delta, real delta, escape hatch, targeted upsert, no-op upsert, insert, aggregate gate, and flag OFF legacy
- [x] CHK-FIX-006 [P1] The flag is process-wide env, the suite sets and deletes it per case in beforeEach and afterEach so a leaked flag cannot cross-contaminate
- [x] CHK-FIX-007 [P1] Evidence is pinned to this phase uncommitted diff, the prompt directs commit nothing, so no SHA is available yet
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets
- [x] CHK-031 [P0] The fingerprint reads existing description content and introduces no new untrusted input
- [x] CHK-032 [P1] No new execution surface introduced by the upsert, it reuses the existing atomic cache writer
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks/implementation-summary synchronized to COMPLETE with no conflicting state
- [x] CHK-041 [P1] Code comments carry the durable why with no artifact ids or spec paths
- [x] CHK-042 [P2] Flag documented inline in `capability-flags.ts` matching the sibling default-OFF flags, which are also indirect reads kept out of ENV_REFERENCE, so no drift-test token is added
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] No temp files written into the repo, tests use OS tmpdir fixtures
- [x] CHK-051 [P1] No scratch artifacts to clean
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-06-22, REQ-007 grandfather reporter deferred with rationale, the default-OFF flag is the rollout guard
<!-- /ANCHOR:summary -->

---
