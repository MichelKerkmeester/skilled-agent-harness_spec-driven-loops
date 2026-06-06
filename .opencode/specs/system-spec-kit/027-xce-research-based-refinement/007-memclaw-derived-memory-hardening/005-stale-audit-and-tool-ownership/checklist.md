---
title: "Verification Checklist: Phase 5: stale-audit-and-tool-ownership [template:level_2/checklist.md]"
description: "Verification acceptance items for Phase 5 stale-audit-and-tool-ownership: read-only stale/status hard-exclusion audit (intended vs silent exclusion), derived tool-ownership lint over TOOL_DEFINITIONS, and wiring into health, /doctor, and pre-commit. Plan only — all items unchecked."
trigger_phrases:
  - "stale exclusion audit checklist"
  - "tool ownership lint verification items"
  - "intended vs silent exclusion acceptance"
  - "TOOL_DEFINITIONS drift checklist"
  - "read-only recall diagnostic verification"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/007-memclaw-derived-memory-hardening/005-stale-audit-and-tool-ownership"
    last_updated_at: "2026-06-06T10:10:50Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Draft Level 2 verification checklist for stale-audit and tool-ownership"
    next_safe_action: "Verify CHK items once stale-exclusion audit implemented"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/005-stale-audit-and-tool-ownership"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Phase 5: stale-audit-and-tool-ownership

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

- [ ] CHK-001 [P0] Read-only stale/status hard-exclusion audit and derived tool-ownership lint documented in spec.md, with op-dispatch consolidation and SemVer governance explicitly rejected
- [ ] CHK-002 [P0] Observe-only audit + derived-artifact lint approach (no recall-path edit, no new search flag, no stored-data mutation) defined in plan.md
- [ ] CHK-003 [P1] Existing substrate (`doctor_memory.yaml` staleness signals, the pre-commit gate chain, `TOOL_DEFINITIONS` in `tool-schemas.ts`) confirmed available
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Audit, derived-map, lint, and health/pre-commit edits pass tsc/lint/format checks
- [ ] CHK-011 [P0] No console errors or warnings from the audit, the derived ownership map, or the pre-commit gate
- [ ] CHK-012 [P1] Audit reads exclusion predicates exposed by `hybrid-search.ts` without editing the recall path; the search path stays byte-identical
- [ ] CHK-013 [P1] Ownership map is derived from `TOOL_DEFINITIONS` (not hand-edited) and follows the existing diagnostic/lint patterns (no new search surface introduced)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] All four success criteria (SC-001 silent exclusion detectable, SC-002 ownership drift caught, SC-003 zero manual checklist, SC-004 recall byte-identical) met
- [ ] CHK-021 [P0] Manual end-to-end check: `/doctor memory` surfaces the exclusion diagnostic and `/doctor skill-budget` surfaces ownership drift
- [ ] CHK-022 [P1] Edge cases tested: deprecated-but-relevant row flagged as silent, archived row classified as intended (not flagged), and a tool added/removed in `TOOL_DEFINITIONS` caught as drift
- [ ] CHK-023 [P1] Error scenarios validated: missing/malformed intended-exclusion policy emits an unclassified diagnostic without blocking health; unreadable `TOOL_DEFINITIONS` fails the lint closed
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`.
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed for recall exclusion predicates (`includeArchived`, `importance_tier != 'deprecated'`), or instance-only status proven by grep.
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for the derived ownership map, the `staleness_signals` registry, the pre-commit gate chain, the response `hints[]` field, and tests.
- [ ] CHK-FIX-004 [P0] Audit/lint tests include adversarial cases: deprecated-but-relevant row (silent), archived row excluded by `includeArchived=false` (intended), unrecognized exclusion source (unclassified), and a tool-ownership drift in both directions.
- [ ] CHK-FIX-005 [P1] Matrix axes listed before completion: exclusion-source (`archived | deprecated-tier | other`) x classification (`intended | silent`); ownership-drift direction (`added | removed | field-changed`).
- [ ] CHK-FIX-006 [P1] Hostile-state variant executed: lint stays deterministic and idempotent under repeated runs against an unchanged `TOOL_DEFINITIONS` (no spurious drift block).
- [ ] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets in the audit, derived-map, lint, or health/pre-commit edits
- [ ] CHK-031 [P0] The audit is observe-only — it holds no write capability and cannot widen recall, mutate a row, or expose an excluded row through any normal search path
- [ ] CHK-032 [P1] The ownership map is derived from `TOOL_DEFINITIONS` and never trusts generated docs (`hook_system.md`) as input, so a tampered doc cannot forge ownership/stability past the lint
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] spec.md / plan.md / tasks.md / implementation-summary.md synchronized on the Level 2 scope
- [ ] CHK-041 [P1] The stale-exclusion audit and the tool-ownership lint surfaces documented in `hook_system.md` (treated as a generated output, never a lint input)
- [ ] CHK-042 [P2] Tool-ownership drift gate surfaces in `/doctor skill-budget` and the exclusion diagnostic surfaces in `/doctor memory`
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
| P0 Items | 12 | 0/12 |
| P1 Items | 12 | 0/12 |
| P2 Items | 2 | 0/2 |

**Verification Date**: Not started — plan only
<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
