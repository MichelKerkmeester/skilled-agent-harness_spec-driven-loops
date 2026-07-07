---
title: "Verification Checklist: Manual Test Verification and Fixes"
description: "Evidence checklist for manual verification outcomes, shipped fixes, daemon recovery, and deferred findings."
trigger_phrases:
  - "manual verification checklist"
  - "manual test fixes verification"
  - "bm25 scoped fill verification"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/006-speckit-surface-alignment/005-manual-test-verification-and-fixes"
    last_updated_at: "2026-07-05T00:00:00Z"
    last_updated_by: "opencode"
    recent_action: "Record manual verification and shipped fixes"
    next_safe_action: "Run strict validation for the surface-alignment parent"
    completion_pct: 100
---
# Verification Checklist: Manual Test Verification and Fixes

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

- [x] CHK-001 [P0] Documentation scope confirmed. [EVIDENCE: User instruction: "Do NOT modify any code/test/product file — this is documentation only; the code is already committed. No git commit."]
  - **Evidence**: Scope lock limits this phase to new `015` docs/metadata plus one parent phase-map row.
- [x] CHK-002 [P0] Sibling template identified. [EVIDENCE: `004-recorded-failure-closure/` contains `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md`, `description.json`, and `graph-metadata.json`]
  - **Evidence**: New docs preserve the Level-2 frontmatter and anchor-delimited structure.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Gold-battery path fix recorded. [EVIDENCE: commit `bda7f57879`; `system-code-graph/mcp_server/lib/gold-query-verifier.ts`; `GOLD_BATTERY_RELATIVE_PATH` changed from pre-normalization `system-spec-kit/026-...` to normalized `system-speckit/026-...`; gold file exists at 10.8KB]
  - **Evidence**: Source fix shipped; dist is gitignored; runtime effect waits for code-graph daemon reload.
- [x] CHK-011 [P0] BM25 scoped fill-limit product fix recorded. [EVIDENCE: commit `e4fcccc320`; `system-spec-kit/mcp_server/lib/search/hybrid-search.ts`; `candidateLimit = (specFolder||db) ? index.getStats().documentCount : limit`]
  - **Evidence**: Fix restores corpus-bounded candidate fill and keeps 500-id incremental metadata resolution with early exit at `limit` survivors.
- [x] CHK-012 [P1] BM25 fail-closed guards preserved. [EVIDENCE: fix notes record all fail-closed guards preserved]
  - **Evidence**: No relaxation of scoped search correctness was accepted.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Manual verification result counts recorded. [EVIDENCE: 25 PASS / 2 FAIL / 3 BLOCKED across approximately 30 runnable items]
  - **Evidence**: Deep-loop-runtime scoring + coverage-graph 8/8 PASS; deep-loop observability + convergence 7/7 PASS; system-code-graph 5 PASS, 1 FAIL, 3 BLOCKED; stress harness had one failing search-quality file before fix.
- [x] CHK-021 [P0] BM25 regression verification recorded. [EVIDENCE: `stress:harness` 45/45, baseline was 42/45; `hybrid-search.vitest` 102/102; `tsc` clean; regression baseline delta 0]
  - **Evidence**: The stress harness and hybrid-search suite were green after commit `e4fcccc320`.
- [x] CHK-022 [P1] Code-graph readiness recovery recorded. [EVIDENCE: `code_graph_scan` moved graph stale to fresh/ready/live; three blocked code-graph scenarios unblocked; `blast_radius` BLOCKED to ok]
  - **Evidence**: Blocked status was readiness-related, not a product failure after scan.
- [x] CHK-023 [P1] Spec-memory daemon recovery recorded. [EVIDENCE: cold-start served `memory_search "surface alignment remediation"` with 3 hits]
  - **Evidence**: Historical crash-on-request is resolved by DELETE-journal DB rebuild plus native-ABI rebuild; `memory_health` degraded/0-memories remains a follow-up.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-025 [P0] Gold-battery failure is closed at source. [EVIDENCE: commit `bda7f57879`]
  - **Evidence**: The path now points at normalized `system-speckit/026-...` where the gold file exists.
- [x] CHK-026 [P0] BM25 scoped fill-limit regression is closed. [EVIDENCE: commit `e4fcccc320`; current 0/25 and 0/75 failures changed from adversarial under-fill to filled scoped results]
  - **Evidence**: Empirical A/B: current 0/25 and 0/75 versus `d17b0d7b99~1` 3/3; the product fix restores the scoping contract instead of relaxing the test.
- [x] CHK-027 [P1] Deferred lexical-overlap-quality-gate finding is recorded honestly. [EVIDENCE: 18/20 FAIL, pre-existing, fails identically on origin, delta 0, fails even run alone]
  - **Evidence**: Root cause recorded as FTS5_ONLY mode returning empty with external-content `memory_fts content='memory_index'`; deferred to FTS/016 owner.
- [x] CHK-028 [P1] `exactTriggerSearch limit*3` is closed as safe. [EVIDENCE: SQL applies scope/tier/active-row/trigger filters in `WHERE` before `LIMIT`]
  - **Evidence**: No scope-crowding under-fetch is present for that path.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No credential or secret material introduced. [EVIDENCE: Documentation-only phase docs]
  - **Evidence**: This phase records commits, file paths, commands, and outcomes only.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan, tasks, checklist, summary, and decision record are synchronized. [EVIDENCE: All docs describe the same manual verification counts, two shipped fixes, runtime recovery actions, and deferred findings]
  - **Evidence**: Cross-document facts use the same commit hashes and verification outcomes.
- [x] CHK-041 [P1] Parent phase documentation map updated. [EVIDENCE: `../spec.md` contains `015` row]
  - **Evidence**: Row slug is `manual-test-verification-and-fixes`, executor `AUDIT`, level `2`, status `Complete`.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Files are contained in the approved 015 phase folder. [EVIDENCE: `005-manual-test-verification-and-fixes/`]
  - **Evidence**: New phase docs and generated metadata live under the requested folder.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 8 | 8/8 |
| P1 Items | 8 | 8/8 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-07-05
**Verified By**: gpt-5.5
<!-- /ANCHOR:summary -->
