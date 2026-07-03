---
title: "Verification Checklist: Phase 11: daemon-freshness-and-health-truthfulness [template:level_2/checklist.md]"
description: "Verification Date: pending — set when Phase 3 verification runs"
trigger_phrases:
  - "dist freshness deadlock"
  - "stale dist exit 75"
  - "memory health truthfulness"
  - "sigbus crash loop"
  - "daemon freshness checklist"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/016-fix-deep-dive-p0-p2-findings-for-mk-spec-memory/011-daemon-freshness-and-health-truthfulness"
    last_updated_at: "2026-07-03T09:59:39Z"
    last_updated_by: "markdown-agent"
    recent_action: "Resolved checklist to Level 2 with phase-specific evidence expectations"
    next_safe_action: "Mark items [x] with evidence only as Phase 3 verification produces receipts"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/tests/dist-freshness.vitest.ts"
      - ".opencode/skills/system-spec-kit/scripts/tests/test-dist-freshness.sh"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "planning-011-daemon-freshness-and-health-truthfulness"
      parent_session_id: null
    completion_pct: 10
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Phase 11: daemon-freshness-and-health-truthfulness

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

- [ ] CHK-001 [P0] Requirements documented in spec.md (REQ-001..REQ-008 with acceptance criteria and finding IDs)
- [ ] CHK-002 [P0] Technical approach defined in plan.md (FIX ADDENDUM surface inventory + cache-bootstrap invariant)
- [ ] CHK-003 [P1] Dependencies identified and available (no upstream phase; native modules present; phase-002 handoff note planned)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Code passes lint/format checks (mcp_server + shim files touched by T004-T012)
- [ ] CHK-011 [P0] No console errors or warnings (ExperimentalWarning absent from CLI stderr after T011)
- [ ] CHK-012 [P1] Error handling implemented (gate refusal paths keep structured JSON error envelope; fallback hook records failures instead of swallowing)
- [ ] CHK-013 [P1] Code follows project patterns (cache-path logic stays single-sourced in dist-freshness.cjs; no finding IDs in code comments per comment-hygiene rule)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] All acceptance criteria met (REQ-001..REQ-008 ACs verified with receipts)
- [ ] CHK-021 [P0] Manual testing complete (same-session build→fresh receipt; forced-stale --help/--version; startup one-liner; health-vs-raw-SQL reconciliation)
- [ ] CHK-022 [P1] Edge cases tested (T014 matrix: genuinely-stale still refuses; cache mismatched; per-entry cache isolation)
- [ ] CHK-023 [P1] Error scenarios validated (missing dist entry; failed build writes no cache; uninitialized runtime health read)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`. (Expected: Chain C deadlock = class-of-bug across 3 shims; #24 = instance-only pending grep; exit taxonomy = cross-consumer; health labels = matrix/evidence)
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep. (`code-index.cjs` / `skill-advisor.cjs` gate parity dispositions recorded per plan.md inventory row)
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests. (exit-75 consumers; `staleDistWarning` field consumers; session_health response consumers; enforcement doc + playbooks 429/455)
- [ ] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases. (cache-path resolution: entry-name injection into cachePathFor; stale-cache-vouches-for-wrong-entry case in T014)
- [ ] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed. (T014: 4 dist states × 4 argv classes × 3 cache states — enumerated rows in the vitest file)
- [ ] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state. (SPECKIT_SPEC_MEMORY_CLI_DEV_ALLOW_STALE=1, SPECKIT_IPC_SOCKET_DIR set/unset, NODE_OPTIONS interference with warning suppression)
- [ ] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets (touched files are shims/handlers/docs; verify no env values inlined)
- [ ] CHK-031 [P0] Input validation implemented (argv exemption matching is exact-token, not substring; skip-reason strings sanitized before startup surface emission)
- [ ] CHK-032 [P1] Auth/authz working correctly (n/a for local shims — confirm socket dir permissions 0o700 preserved by any spawn changes)
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized (statuses, decision recorded in T006, deferrals explicit)
- [ ] CHK-041 [P1] Code comments adequate (durable WHY only; no spec/finding IDs in code per comment-hygiene HARD BLOCK)
- [ ] CHK-042 [P2] README updated (if applicable — dist-freshness-enforcement.md + playbooks count as the doc surface here; hooks README only if fallback behavior text changed)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files in scratch/ only (vitest baseline, SIGBUS log excerpts, probe receipts)
- [ ] CHK-051 [P1] scratch/ cleaned before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 0/12 |
| P1 Items | 13 | 0/13 |
| P2 Items | 1 | 0/1 |

**Verification Date**: Pending — set when Phase 3 verification runs
<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
