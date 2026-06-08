---
title: "Verification Checklist: Code Graph + Advisor + Hooks Polish"
description: "Checklist for Phase 026/007/012/006 clusters A-E."
trigger_phrases:
  - "026/007/012/006 checklist"
  - "cluster a to e verification"
importance_tier: "critical"
contextType: "verification"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/005-code-graph/011-real-world-usefulness-test-planning/007-readiness-hooks-advisor-polish"
    last_updated_at: "2026-05-06T11:34:49Z"
    last_updated_by: "cli-codex-gpt-5.5"
    recent_action: "Aligned checklist with Level 2 contract"
    next_safe_action: "Review verification blockers"
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
# Verification Checklist: Code Graph + Advisor + Hooks Polish

<!-- SPECKIT_LEVEL: 2 -->

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

- [x] CHK-001 [P0] Requirements documented in spec.md. Evidence: `spec.md` captures all five clusters and finding IDs F-007, F-012 through F-019, and Cluster E.
- [x] CHK-002 [P0] Technical approach documented in plan.md. Evidence: `plan.md` sequences implementation A through E and names verification surfaces.
- [x] CHK-003 [P1] Source research and target files read before edits. Evidence: read `003-code-graph-bug-surface-research/research/research.md` plus target TS, test, and README/reference files before patching.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-025 [P1] Existing handler envelope style is preserved. Evidence: targeted handler tests pass and new fields are additive.
- [x] CHK-026 [P1] Shared helpers stay scoped to existing code graph/advisor surfaces. Evidence: no new cross-subsystem abstraction or DB schema was introduced.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] New tests count is at least 8. Evidence: 11 focused tests added/updated across query, context, verify, scan, indexer, ensure-ready, advisor-rebuild, and context-server suites.
- [x] CHK-021 [P1] `npx vitest run code_graph/tests/` passes. Evidence: PASS, 20 files and 270 tests.
- [ ] CHK-022 [P1] Advisor test suite passes. Evidence: FAIL, `npx vitest run skill_advisor/tests/` reported 36 files passed, 3 files failed, 285 tests passed, 3 tests failed; failing parity/python compat expectations are outside the changed advisor rebuild predicate.
- [ ] CHK-023 [P1] Hooks/general `tests/` suite passes. Evidence: FAIL, broad `npx vitest run tests/` reported 7 failed suites and 116 failed tests in the current dirty workspace; the scoped query fallback and structural scan regressions now pass.
- [x] CHK-024 [P0] `npm run build` passes. Evidence: PASS, `npm run build` exits 0.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-010 [P0] F-007 diagnostics fields land in blocked-read payloads with regression test. Evidence: `ensure-ready.ts` now returns active/stored scope, manifest count/digest, reason, parse backlog, and auto-rescan safety fields; `code-graph-query-handler.vitest.ts` covers the blocked-read payload.
- [x] CHK-011 [P0] F-018 guarded auto-rescan lands with safe-path regression test. Evidence: query/context handlers pass `allowGuardedInlineFullScan`; `ensure-ready.vitest.ts` covers matching-scope auto full scan and parse-backlog blocking.
- [x] CHK-012 [P0] F-019 verify scope preflight lands with mismatch regression test. Evidence: `verify.ts` returns `scopePreflight`; `code-graph-verify.vitest.ts` covers mismatch blocking.
- [x] CHK-013 [P0] F-014 advisor rebuild predicate lands with mixed-axis regression test. Evidence: `advisor-rebuild.ts` skips only when live and trust state is not absent; `advisor-rebuild.vitest.ts` covers live/absent repair.
- [x] CHK-014 [P0] F-015 startup post-index assertion lands with regression test. Evidence: `context-server.ts` asserts SQLite, generation file, and live advisor status before publishing live; `context-server.vitest.ts` includes F-015 source-regression coverage.
- [x] CHK-015 [P0] F-016 CocoIndex snake_case seed normalizer lands with regression test. Evidence: `context.ts` normalizes `file_path`, `start_line`, `end_line`, and `content`; `code-graph-context-handler.vitest.ts` covers snake_case seed input.
- [x] CHK-016 [P0] Cluster E glob fingerprint behavior lands with regression test. Evidence: `index-scope-policy.ts` emits v3 fingerprints for non-empty include/exclude globs and keeps v2 compatibility; `code-graph-scan.vitest.ts` covers glob-only mismatch blocking.
- [x] CHK-017 [P1] F-012 Copilot docs updated without runtime code changes. Evidence: `hooks/copilot/README.md` now describes raw startup/compact text instead of status JSON.
- [x] CHK-018 [P1] F-013 Gemini docs updated without runtime code changes. Evidence: `hooks/gemini/README.md` now documents SessionStart, compact, SessionEnd registration and smoke examples.
- [x] CHK-019 [P1] F-017 CocoIndex docs updated without runtime code changes. Evidence: `mcp-coco-index/references/tool_reference.md` now documents canonical snake_case live output plus an interop note.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets. Evidence: code/docs changes add no credentials, tokens, or secret material.
- [x] CHK-031 [P1] New read-path auto-rescan remains guarded by scope and parse backlog checks. Evidence: `ensure-ready.ts` requires stored/active scope compatibility and parse backlog <= threshold before inline full scan.
- [x] CHK-032 [P1] No auth or network behavior changed. Evidence: touched surfaces are code graph readiness/query/context/verify, advisor freshness, startup publication, tests, and docs only.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan, tasks, checklist, ADR, and implementation summary synchronized. Evidence: `implementation-summary.md` records delivered fixes and failed global verification gates.
- [x] CHK-041 [P1] Parent `graph-metadata.json` includes `007-readiness-hooks-advisor-polish`. Evidence: parent `children_ids` includes `system-spec-kit/026-graph-and-context-optimization/005-code-graph/011-real-world-usefulness-test-planning/007-readiness-hooks-advisor-polish`.
- [x] CHK-042 [P2] Strict validation passes for child and parent. Evidence: PASS, child exit 0 and parent exit 0.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## FILE ORGANIZATION

- [x] CHK-050 [P1] Source and test edits remain in requested files/surfaces. Evidence: code changes are limited to code graph, advisor, context-server, docs, and packet artifacts named in scope.
- [x] CHK-051 [P1] Parent/child packet files remain under the requested spec hierarchy. Evidence: packet artifacts live under `007-readiness-hooks-advisor-polish`, with parent `graph-metadata.json` updated.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 15 | 13/15 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-05-06
<!-- /ANCHOR:summary -->
