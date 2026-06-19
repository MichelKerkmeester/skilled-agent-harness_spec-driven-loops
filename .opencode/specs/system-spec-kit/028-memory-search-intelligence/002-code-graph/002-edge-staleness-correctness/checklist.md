---
title: "Verification Checklist: Code-Graph Edge-Staleness Correctness"
description: "P0/P1/P2 verification gates for the reverse-dependency force-parse staleness repair (benchmark-gated) and the additive rename SUPERSEDES edge; both candidates PENDING (neither shipped in 030 Wave-0)."
trigger_phrases:
  - "code graph edge staleness checklist"
  - "reverse-dep force-parse verification"
  - "rename supersedes edge verification"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/002-code-graph/002-edge-staleness-correctness"
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

- [ ] CHK-001 [P0] Requirements documented in spec.md (REQ-001..006)
- [ ] CHK-002 [P0] Technical approach + ordering gate + benchmark gate defined in plan.md
- [ ] CHK-003 [P1] HARD ORDERING CONSTRAINT recorded: reverse-deps captured before `replaceNodes` (post-persist JOIN returns nothing)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Typecheck/build passes (`tsc` on the code-graph mcp_server)
- [ ] CHK-011 [P0] No new lint warnings in `structural-indexer.ts` / `code-graph-db.ts` / the scan driver
- [ ] CHK-012 [P1] Path-filtered `queryImportersOf` used in the scan loop; full-scan `queryFileImportDependents` retained for the read-path consumer (`handlers/query.ts:1017`)
- [ ] CHK-013 [P1] `SUPERSEDES` edge is additive — `SCHEMA_VERSION` unchanged (stays 5); absent-edge queries byte-identical
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] Reverse-dep re-derive test: rename/kind-flip B → A→B `IMPORTS` survives, re-derived to new id
- [ ] CHK-021 [P0] Body-edit control: stable symbol_id → no extra A parse, A→B unchanged
- [ ] CHK-022 [P1] Ordering-gate test: reverse-dep query post-`replaceNodes` returns empty
- [ ] CHK-023 [P1] Q1-C2 test: rename emits a `contentHash`-keyed `SUPERSEDES` edge; absent-edge byte-identical
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each candidate has a finding class: Unit 1 staleness-repair = `algorithmic` (silent cross-file edge loss on refactor); Q1-C2 = `additive structural edge` (rename lineage).
- [ ] CHK-FIX-002 [P0] Same-class producer inventory: `rg -n 'skipFreshFiles|isFileStale|forceParse|replaceNodes|pruneDanglingEdges' lib/` (any other site that skips a stale dependent or prunes its edges).
- [ ] CHK-FIX-003 [P0] Consumer inventory: `rg -n 'queryFileImportDependents|queryImportersOf' lib/ handlers/` (the read-path caller stays intact; the scan loop uses the path-filtered query).
- [ ] CHK-FIX-004 [P0] Correctness invariant: a refactored dependency re-derives its dependents' edges in the SAME scan; reverse-deps captured BEFORE persistence; a body-only edit triggers NO dependent re-parse. Adversarial cases (empty reverse-dep set, high fan-in, rename-with-content-change, mis-ordered capture) covered.
- [ ] CHK-FIX-005 [P1] Matrix axes listed: {dependency symbol-id changed (refactor) | stable (body edit)} × {has importers | none} × {pure rename (contentHash match) | content also changed}.
- [ ] CHK-FIX-006 [P1] Fan-in re-parse benchmark captured on a hot high-importer file BEFORE any default-on flip (regression-baseline rule; the cost is UNMEASURED per research §6).
- [ ] CHK-FIX-007 [P1] Evidence pinned to a fix SHA / explicit diff range per candidate; neither candidate shipped in 030 Wave-0 (both PENDING).
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets introduced
- [ ] CHK-031 [P0] No new untrusted-content read path — the change touches scan-ordering + a structural edge only (no recalled content rendered)
- [ ] CHK-032 [P1] `SUPERSEDES` edge carries structural lineage only (node ids + edge type), no content body
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] spec/plan/tasks/checklist synchronized; candidate status (PENDING) consistent across spec §3, tasks Phase 2, and the 030 §14 / §Wave-1 reference
- [ ] CHK-041 [P1] Research citations (file:line + [CONFIRMED]/[INFERRED]) preserved; the content-hash-gated correction (NOT mtime) recorded
- [ ] CHK-042 [P2] Comment hygiene: no spec/packet ids embedded in production comments (keep the durable WHY)
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
| P0 Items | 10 | [ ]/10 |
| P1 Items | 11 | [ ]/11 |
| P2 Items | 2 | [ ]/2 |

**Verification Date**: 2026-06-19
<!-- /ANCHOR:summary -->
