---
title: "Verification Checklist: Code-Graph Edge-Staleness Correctness"
description: "P0/P1/P2 verification gates for the reverse-dependency force-parse staleness repair (benchmark-gated) and the additive rename SUPERSEDES edge. Code implemented default-off/tombstone-gated, fan-in benchmark acceptance pending."
trigger_phrases:
  - "code graph edge staleness checklist"
  - "reverse-dep force-parse verification"
  - "rename supersedes edge verification"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-code-graph/001-code-graph-core/002-edge-staleness-correctness"
    last_updated_at: "2026-06-19T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Author edge-staleness-correctness verification checklist from 028/002 research"
    next_safe_action: "Verify CHK items as the two units land"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-002-edge-staleness-correctness"
      parent_session_id: null
    completion_pct: 15
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Code-Graph Edge-Staleness Correctness

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

- [x] CHK-001 [P0] Requirements documented in spec.md (REQ-001..006)
- [x] CHK-002 [P0] Technical approach + ordering gate + benchmark gate defined in plan.md
- [x] CHK-003 [P1] HARD ORDERING CONSTRAINT recorded: reverse-deps captured before `replaceNodes` (post-persist JOIN returns nothing)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Typecheck/build passes (`tsc` on the code-graph mcp_server). Evidence: `npm run typecheck` exit 0.
- [x] CHK-011 [P0] No new lint warnings in `structural-indexer.ts` / `code-graph-db.ts` / the scan driver. Evidence: alignment drift pass, comment hygiene pass, `git diff --check` pass.
- [x] CHK-012 [P1] Path-filtered `queryImportersOf` used in the scan loop, full-scan `queryFileImportDependents` retained for the read-path consumer (`handlers/query.ts:1017`)
- [x] CHK-013 [P1] `SUPERSEDES` edge is additive, `SCHEMA_VERSION` unchanged (stays 5), absent-edge queries byte-identical
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Reverse-dep re-derive test: rename/kind-flip B → A→B `IMPORTS` survives, re-derived to new id. Evidence: `edge-staleness-correctness.vitest.ts`.
- [x] CHK-021 [P0] Body-edit control: stable symbol_id → no extra A parse, A→B unchanged. Evidence: `edge-staleness-correctness.vitest.ts`.
- [x] CHK-022 [P1] Ordering-gate test: reverse-dep query post-`replaceNodes` returns empty. Evidence: `edge-staleness-correctness.vitest.ts`.
- [x] CHK-023 [P1] Q1-C2 test: rename emits a `contentHash`-keyed `SUPERSEDES` edge, absent-edge byte-identical. Evidence: `edge-staleness-correctness.vitest.ts`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each candidate has a finding class: Unit 1 staleness-repair = `algorithmic` (silent cross-file edge loss on refactor), Q1-C2 = `additive structural edge` (rename lineage).
- [x] CHK-FIX-002 [P0] Same-class producer inventory: `rg -n 'skipFreshFiles|isFileStale|forceParse|replaceNodes|pruneDanglingEdges' lib/` (any other site that skips a stale dependent or prunes its edges).
- [x] CHK-FIX-003 [P0] Consumer inventory: `rg -n 'queryFileImportDependents|queryImportersOf' lib/ handlers/` (the read-path caller stays intact, the scan loop uses the path-filtered query).
- [x] CHK-FIX-004 [P0] Correctness invariant: a refactored dependency re-derives its dependents' edges in the SAME scan, reverse-deps captured BEFORE persistence, a body-only edit triggers NO dependent re-parse. Adversarial cases (empty reverse-dep set, high fan-in, rename-with-content-change, mis-ordered capture) covered.
- [x] CHK-FIX-005 [P1] Matrix axes listed: {dependency symbol-id changed (refactor) | stable (body edit)} × {has importers | none} × {pure rename (contentHash match) | content also changed}.
- [ ] CHK-FIX-006 [P1] Fan-in re-parse benchmark captured on a hot high-importer file BEFORE any default-on flip (regression-baseline rule, the cost is UNMEASURED per research §6). LEFT-PENDING: live benchmark/reindex/scan disallowed in this task.
- [x] CHK-FIX-007 [P1] Evidence pinned to a fix SHA / explicit diff range per candidate, neither candidate shipped in 030 Wave-0 (both were pending before this phase). Evidence: no commit requested, diff-scoped implementation plus named tests.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets introduced
- [x] CHK-031 [P0] No new untrusted-content read path, the change touches scan-ordering + a structural edge only (no recalled content rendered)
- [x] CHK-032 [P1] `SUPERSEDES` edge carries structural lineage only (node ids + edge type), no content body
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] spec/plan/tasks/checklist synchronized, candidate status now records implemented default-off code plus pending benchmark gate.
- [x] CHK-041 [P1] Research citations (file:line + [CONFIRMED]/[INFERRED]) preserved, the content-hash-gated correction (NOT mtime) recorded
- [x] CHK-042 [P2] Comment hygiene: no spec/packet ids embedded in production comments (keep the durable WHY)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only
- [x] CHK-051 [P1] scratch/ cleaned before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 10 | 10/10 |
| P1 Items | 11 | 10/11 |
| P2 Items | 2 | 2/2 |

**Verification Date**: 2026-06-19
<!-- /ANCHOR:summary -->
