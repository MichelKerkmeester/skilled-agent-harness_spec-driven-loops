---
title: "Verification Checklist: Phase 5: stale-audit-and-tool-ownership"
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
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/005-memclaw-derived-memory-hardening/005-stale-audit-and-tool-ownership"
    last_updated_at: "2026-06-10T14:35:00Z"
    last_updated_by: "gpt-5.5-fast"
    recent_action: "Verified read-only audit and ownership lint"
    next_safe_action: "Monitor health and ownership drift surfaces"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/005-stale-audit-and-tool-ownership"
      parent_session_id: null
    completion_pct: 100
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

- [x] CHK-001 [P0] Read-only stale/status hard-exclusion audit and derived tool-ownership lint documented in spec.md, with op-dispatch consolidation and SemVer governance explicitly rejected. Evidence: spec.md scope and out-of-scope sections retained and status updated to completed.
- [x] CHK-002 [P0] Observe-only audit + derived-artifact lint approach (no recall-path edit, no new search flag, no stored-data mutation) defined in plan.md. Evidence: implementation exposed predicate metadata only and did not add a search flag or DB write.
- [x] CHK-003 [P1] Existing substrate (`doctor_memory.yaml` staleness signals, the pre-commit gate chain, `TOOL_DEFINITIONS` in `tool-schemas.ts`) confirmed available. Evidence: all three were read and updated within the allowed scope.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Audit, derived-map, lint, and health/pre-commit edits pass tsc/lint/format checks. Evidence: `npx tsc --noEmit -p tsconfig.json` clean; comment hygiene rerun clean with `python3`.
- [x] CHK-011 [P0] No console errors or warnings from the audit, the derived ownership map, or the pre-commit gate. Evidence: `node tests/tool-ownership-lint-runner.mjs` clean and new vitest suite passed.
- [x] CHK-012 [P1] Audit reads exclusion predicates exposed by `hybrid-search.ts` without editing the recall path; the search path stays byte-identical. Evidence: new suite asserts JSON-serialized recall IDs before/after audit are equal.
- [x] CHK-013 [P1] Ownership map is derived from `TOOL_DEFINITIONS` (not hand-edited) and follows the existing diagnostic/lint patterns (no new search surface introduced). Evidence: `deriveToolOwnershipMap()` and runner derive from source definitions and compare against the committed fixture.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] All four success criteria (SC-001 silent exclusion detectable, SC-002 ownership drift caught, SC-003 zero manual checklist, SC-004 recall byte-identical) met. Evidence: `tests/stale-audit-tool-ownership.vitest.ts` passed all 6 cases.
- [x] CHK-021 [P0] Manual end-to-end check: `/doctor memory` surfaces the exclusion diagnostic and ownership drift is surfaced by the blocking governance gate. Evidence: health payload includes `data.exclusionAudit`; direct `doctor_skill-budget.yaml` edit was outside the allowed file list.
- [x] CHK-022 [P1] Edge cases tested: deprecated-but-relevant row flagged as silent, archived row classified as intended (not flagged), and a tool added/removed in `TOOL_DEFINITIONS` caught as drift. Evidence: new suite covers all cases.
- [x] CHK-023 [P1] Error scenarios validated: missing/malformed intended-exclusion policy emits an unclassified diagnostic without blocking health; unreadable `TOOL_DEFINITIONS` fails the lint closed. Evidence: malformed policy and missing source path tests passed.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`. Evidence: classified as matrix/evidence plus cross-consumer health/pre-commit surfacing.
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed for recall exclusion predicates (`includeArchived`, `importance_tier != 'deprecated'`), or instance-only status proven by grep. Evidence: searched `includeArchived`, `importance_tier`, `deprecated`, and `active_memory_projection` across search code.
- [x] CHK-FIX-003 [P0] Consumer inventory completed for the derived ownership map, the `staleness_signals` registry, the pre-commit gate chain, the response `hints[]` field, and tests. Evidence: touched tool schema helpers, doctor memory signal, pre-commit gate, health hints, and new test suite.
- [x] CHK-FIX-004 [P0] Audit/lint tests include adversarial cases: deprecated-but-relevant row (silent), archived row excluded by `includeArchived=false` (intended), unrecognized exclusion source (unclassified), and a tool-ownership drift in both directions. Evidence: new suite covers deprecated, archived, malformed policy, missing, extra, deterministic, and unreadable-source cases.
- [x] CHK-FIX-005 [P1] Matrix axes listed before completion: exclusion-source (`archived | deprecated-tier | other`) x classification (`intended | silent`); ownership-drift direction (`added | removed | field-changed`). Evidence: audit entries expose source/classification and lint report exposes missing/extra/changed arrays.
- [x] CHK-FIX-006 [P1] Hostile-state variant executed: lint stays deterministic and idempotent under repeated runs against an unchanged `TOOL_DEFINITIONS` (no spurious drift block). Evidence: serialization equality test and runner clean check passed.
- [x] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range. Evidence: evidence is command-based and file-specific; no branch-relative completion claim used.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets in the audit, derived-map, lint, or health/pre-commit edits. Evidence: no credentials or environment secrets added.
- [x] CHK-031 [P0] The audit is observe-only — it holds no write capability and cannot widen recall, mutate a row, or expose an excluded row through any normal search path. Evidence: audit reads counts and predicate metadata only; recall byte-identical test passed.
- [x] CHK-032 [P1] The ownership map is derived from `TOOL_DEFINITIONS` and never trusts generated docs (`hook_system.md`) as input, so a tampered doc cannot forge ownership/stability past the lint. Evidence: runner inputs are source definitions plus committed JSON fixture only.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] spec.md / plan.md / tasks.md / implementation-summary.md synchronized on the Level 2 scope. Evidence: docs updated to completed status and verification evidence.
- [x] CHK-041 [P1] The stale-exclusion audit and the tool-ownership lint surfaces documented in `hook_system.md` (treated as a generated output, never a lint input). Evidence: hook reference now documents `data.exclusionAudit` and pre-commit ownership drift gate.
- [x] CHK-042 [P2] Tool-ownership drift gate surfaces in `/doctor skill-budget` and the exclusion diagnostic surfaces in `/doctor memory`. Evidence: exclusion diagnostic is registered in doctor memory; direct skill-budget asset was not edited because it was outside the allowed write list.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only. Evidence: no temp files were written under the phase folder.
- [x] CHK-051 [P1] scratch/ cleaned before completion. Evidence: scratch contains only `.gitkeep`.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 12 | 12/12 |
| P2 Items | 2 | 2/2 |

**Verification Date**: 2026-06-10
<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
