---
title: "Verification Checklist: Search Append-Exempt Serializer + True-Citation Density Probe"
description: "Verification Date: 2026-06-24"
trigger_phrases:
  - "append-exempt checklist"
  - "density probe checklist"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/029-memory-search-intelligence/005-dark-flag-graduation/007-graduation-follow-ups/001-search-append-citation-probe"
    last_updated_at: "2026-06-24T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored checklist"
    next_safe_action: "Run cli test pass"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-session"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Search Append-Exempt Serializer + True-Citation Density Probe

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

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
- [x] CHK-003 [P1] Dependencies identified and available (009 findings P1-001, P2-003)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes tsc with no new errors over the pre-existing tsconfig `baseUrl` deprecation (TS5101). Evidence: `tsc --noEmit --composite false --ignoreDeprecations 6.0` exits 0; the only error in the unmodified command is the pre-existing TS5101 (proven via git-stash baseline).
- [x] CHK-011 [P0] No console errors introduced; probe failures caught and reported as hints.
- [x] CHK-012 [P1] Error handling: probe returns zero-density on error; trim loop converges on all-exempt arrays.
- [x] CHK-013 [P1] Code follows project patterns (flag-gated additive fields, conditional spreads).
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] All acceptance criteria covered by tests (REQ-001..004).
- [ ] CHK-021 [P0] cli executor test pass green (deferred to the cli executor per task instruction).
- [x] CHK-022 [P1] Edge cases tested: all-exempt array, single-class ledger, null-session exclusion, empty ledger, P1-6 reserve-a-primary, P2-14 constitutional-over-backfill, P2-12 199:1 lopsided regression.
- [x] CHK-023 [P1] Error/byte-identity scenarios: flag-off shape has no `appendExempt` key; trim is identical to pop() when no row is exempt and none is constitutional. P2-14 constitutional-sparing is the one deliberate behavior change, independent of the append flags, fires only on a real squeeze with a pinned row.
- [x] CHK-024 [P1] Deep-review findings P1-6, P2-14, P2-12 addressed and regression-tested; trim and density logic cross-checked via a standalone simulation (all 25 cases pass).
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Findings classed: P1-001 is `cross-consumer` (formatter producer + serializer consumer); P2-003 is `instance-only` (one new probe).
- [x] CHK-FIX-002 [P0] Same-class producer inventory: both append modules stamp `source`/`sources`; only those two markers exist (`rg -n "source: 'multihop'|lane-champion:"`).
- [x] CHK-FIX-003 [P0] Consumer inventory: the context-server after-tool callback is the only token-budget trim site that pops `data.results`; the formatter is the only producer of the response rows.
- [x] CHK-FIX-004 [P0] Selection invariant tested adversarially: no-exempt (identical to pop), tail-exempt, interleaved, all-exempt, empty, single-primary-reserve (P1-6), constitutional-over-backfill (P2-14).
- [x] CHK-FIX-005 [P1] Matrix axes listed: {ordinary / backfill / constitutional} x {tail / interleaved / all-pinned / single-primary} for trim; {empty / below / above / single-class / lopsided-199:1 / minority-under-floor / null-session / custom-threshold} for probe.
- [x] CHK-FIX-006 [P1] Hostile-state variant: the flag-off path (no append rows, emitter off) is the global-state variant and is covered by A2 and the health gating.
- [x] CHK-FIX-007 [P1] Evidence pinned to this working-tree diff.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets.
- [x] CHK-031 [P0] No new untrusted input parsed; probe reads only the local shadow ledger.
- [x] CHK-032 [P1] No auth surface touched.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized.
- [x] CHK-041 [P1] Code comments explain the WHY (durable rationale; no artifact-ids).
- [x] CHK-042 [P2] README updated (N/A).
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] No temp files left in the repo; scratch tsconfig removed after the test typecheck.
- [x] CHK-051 [P1] scratch cleaned before completion.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 9 | 8/9 (CHK-021 deferred to cli executor) |
| P1 Items | 12 | 12/12 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-06-24
<!-- /ANCHOR:summary -->
