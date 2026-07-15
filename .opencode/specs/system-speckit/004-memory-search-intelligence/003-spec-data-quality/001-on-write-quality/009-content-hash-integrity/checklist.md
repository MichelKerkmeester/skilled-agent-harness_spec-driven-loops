---
title: "Verification Checklist: A9 Read-Time Content-Hash Integrity Verification [template:level_2/checklist.md]"
description: "Verification Date: Pending (scaffold, not yet verified)"
trigger_phrases:
  - "content hash integrity"
  - "read time hash verify"
  - "storage drift guard"
  - "verify_integrity content hash"
  - "silent corruption detection"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/004-memory-search-intelligence/003-spec-data-quality/001-on-write-quality/009-content-hash-integrity"
    last_updated_at: "2026-07-04T17:12:02.624Z"
    last_updated_by: "markdown-agent"
    recent_action: "Added benchmark, test and default-off checklist rows for the A9 scaffold"
    next_safe_action: "Hold for implementation, no item verified yet"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/content-id.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/storage/checkpoints.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Verification Checklist: A9 Read-Time Content-Hash Integrity Verification

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

- [ ] CHK-001 [P0] Requirements documented in spec.md
- [ ] CHK-002 [P0] Technical approach defined in plan.md
- [ ] CHK-003 [P1] Body-form reference and default-off flag dependency identified and available
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] The recompute reuses `hashContentBody` verbatim with no redefined hash logic
- [ ] CHK-011 [P0] No console errors or warnings from the integrity sweep on a clean corpus
- [ ] CHK-012 [P1] Null-hash and absent-hash row branches skip cleanly without counting a mismatch
- [ ] CHK-013 [P1] Change follows the existing integrity-sweep and summary-field patterns
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] All acceptance criteria met (REQ-001 through REQ-006)
- [ ] CHK-021 [P0] A corrupted scratch row is reported in `contentHashMismatches` with its id while a clean corpus reports zero
- [ ] CHK-022 [P1] A re-read of a mismatched row proves the body and stored hash are untouched
- [ ] CHK-023 [P1] The flag-off integrity summary keeps the current shape with no extra row-body read
- [ ] CHK-024 [P0] Planted-mismatch catch-rate benchmark specified at 100 percent of planted corrupt rows caught in `contentHashMismatches` with 0 false positives on clean and null-hash rows
- [ ] CHK-025 [P0] Named test `mcp_server/tests/content-hash-integrity.vitest.ts` specified with the catch-rate, clean-zero, null-skip, no-mutation and flags-off byte-identical assertions
- [ ] CHK-026 [P1] Flags-off byte-identical proof specified, the flag-off integrity summary matches the pre-change shape with no `contentHashMismatches` populated and no extra row-body read
- [ ] CHK-027 [P1] Default-off safety specified, `SPECKIT_CONTENT_HASH_INTEGRITY` defaults off, registered in `flag-ceiling.vitest.ts` ALL_SPECKIT_FLAGS and FLAG_CHECKERS, reversible at runtime via `SPECKIT_CONTENT_HASH_INTEGRITY=false`
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`.
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep.
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests.
- [ ] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases.
- [ ] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed.
- [ ] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state.
- [ ] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets
- [ ] CHK-031 [P0] The recompute stays inside the existing single-author local trust boundary and adds no signing or external key
- [ ] CHK-032 [P1] No new execution surface introduced by the recompute branch
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized
- [ ] CHK-041 [P1] Code comments adequate
- [ ] CHK-042 [P2] README updated (if applicable)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files in scratch/ only
- [ ] CHK-051 [P1] scratch/ cleaned before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 14 | 0/14 |
| P1 Items | 15 | 0/15 |
| P2 Items | 1 | 0/1 |

**Verification Date**: Pending (scaffold, not yet verified)
<!-- /ANCHOR:summary -->

---
