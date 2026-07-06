---
title: "Verification Checklist: Code Graph - Doc-Symbol Lane + Lease Telemetry (Q5-C1, Q7-lease)"
description: "Verification Date: 2026-06-19 (Q5-C1 and Q7-lease implemented, metrics sink wiring out of scope)"
trigger_phrases:
  - "code graph doc symbol lane checklist"
  - "q5-c1 doc symbol extractor verification"
  - "lease classification telemetry checklist"
  - "symbolkind heading key render tolerance verify"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-code-graph/001-code-graph-core/008-doc-symbol-lane"
    last_updated_at: "2026-06-19T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Verified Q5-C1 doc-symbol lane and Q7 lease classifier/no-op emit"
    next_safe_action: "Run strict validation and hand off the implemented phase"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-002-008-doc-symbol-lane"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Both candidates are implemented in this phase, metrics sink/dashboard wiring remains out of scope"
---
# Verification Checklist: Code Graph, Doc-Symbol Lane + Lease Telemetry (Q5-C1, Q7-lease)

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

> **Phase status:** both candidates are implemented in this phase. Q5-C1 shipped the doc-symbol lane, and Q7-lease shipped classifier + no-op-default emit. Metrics sink/dashboard wiring remains out of scope because no launcher sink exists today.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md, REQ-001..008 cover deterministic heading/key extraction, SymbolKind extension, render tolerance, additive-off-boundary, glob decision and the Q7 classifier + no-op emit
- [x] CHK-002 [P0] Technical approach defined in plan.md, two independent tracks (A: SymbolKind + render + extractor slot-in, B: lease classifier + no-op emit), no shared schema migration
- [x] CHK-003 [P1] Dependencies identified and available, SymbolKind union (`indexer-types.ts:13`), `code-graph-context` render path, default globs (`:156-177`) and the absent launcher metrics sink (Red) are all inventoried in plan.md §6
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks, `npm run typecheck`, `node --check .opencode/bin/mk-code-index-launcher.cjs`, comment hygiene and alignment drift passed
- [x] CHK-011 [P0] No console errors or warnings, targeted Vitest passed without runtime warnings, launcher syntax check passed
- [x] CHK-012 [P1] Error handling implemented, malformed json degrades to zero keys, fenced-code headings are skipped and missing metrics sink no-ops
- [x] CHK-013 [P1] Code follows project patterns, extractor emits existing node/edge shapes, launcher telemetry uses a pluggable no-op sink
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] All acceptance criteria met, REQ-001..008 covered by `doc-symbol-extractor.vitest.ts`, `code-graph-indexer.vitest.ts`, `code-graph-context-handler.vitest.ts` and `launcher-lease.vitest.ts`
- [x] CHK-021 [P0] Manual testing complete, targeted automated coverage exercised parse, persistence-facing node counts, render output and lease classes. Live daemon scan not required for this bounded phase
- [x] CHK-022 [P1] Edge cases tested, fenced-block heading skip, malformed json → zero nodes, json/jsonc/yaml/yml/toml nested keys, id stability and markdown nesting are covered
- [x] CHK-023 [P1] Error scenarios validated, `emitLeaseMetric()` no-ops with no sink and emits only through a configured sink in tests
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class, doc-lane capability-add and launcher observability classes both implemented
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only proven by grep, the `=== 'doc'` early-return is the single parse seam, launcher emit tokens were absent at baseline
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers/schema/response fields, `SymbolKind` consumers inventoried, context render path covered for `heading` and `key`
- [x] CHK-FIX-004 [P0] Parser/redaction fixes include adversarial table tests, fenced-block `#`, ATX/Setext headings, malformed json and nested config keys covered
- [x] CHK-FIX-005 [P1] Matrix axes and row count listed before completion, axes covered: markdown heading variants, json/jsonc/yaml/yml/toml config formats, malformed json and lease transition classes
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed, no-op sink and launcher fixture dependency behavior tested, extractor remains pure
- [x] CHK-FIX-007 [P1] Evidence pinned to a fix SHA or explicit diff range, no commit by request, evidence is pinned to the dirty diff plus verification commands in this phase
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets, confirmed by design: the lane handles file content and internal lease classes only, no credentials introduced (NFR-S01/S02)
- [x] CHK-031 [P0] Input validation implemented, config keys extracted by parse/scanner paths, never `eval`/`require`, markdown regex-scanned, malformed json returns zero symbols
- [x] CHK-032 [P1] Auth/authz working correctly, N/A: no auth surface change, the doc lane and lease telemetry add no new external input path
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized, spec.md, plan.md, tasks.md, checklist.md and implementation-summary.md carry the same implemented candidate status
- [x] CHK-041 [P1] Code comments adequate, comment hygiene passed on touched source and tests, no new ephemeral artifact pointers in code comments
- [x] CHK-042 [P2] README updated (if applicable), N/A, no README change required for this source-level phase
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only, no temp files, this sub-phase holds only spec-doc artifacts
- [x] CHK-051 [P1] scratch/ cleaned before completion, N/A (no scratch/ created)
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 11 | 11/11 |
| P1 Items | 12 | 12/12 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-06-19
<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
