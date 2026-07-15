---
title: "Feature Specification: Comprehensive Audit Remediation"
description: "Phase parent remediating the ~50 verified findings from the packet-012 deep-review + research audit, grouped into 7 file-disjoint phases mapped to 5 root causes."
trigger_phrases:
  - "audit remediation"
  - "013 remediation"
  - "fix audit findings"
  - "deep review remediation"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/000-release-and-program-cleanup/013-comprehensive-audit-remediation"
    last_updated_at: "2026-06-05T07:30:00Z"
    last_updated_by: "main_agent"
    recent_action: "Central verification executed by takeover session 2026-06-05"
    next_safe_action: "Committed; activates on daemon recycle"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "remediation-scaffold"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Findings re-verified against current code; D2/C2 partially pre-resolved, E7 is the metadata root cause"
      - "Central verification run 2026-06-05; details in central-verification-record.md."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT
  FORBIDDEN content (do NOT author at phase-parent level):
    - merge/migration/consolidation narratives (consolidate*, merged from, renamed from, collapsed, X→Y, reorganization history)
    - migrated from, ported from, originally in
    - heavy docs: plan.md, tasks.md, checklist.md, decision-record.md, implementation-summary.md — these belong in child phase folders only
  REQUIRED content (MUST author at phase-parent level):
    - Root purpose: what problem does this entire phased decomposition solve?
    - Sub-phase list: which child phase folders exist and what each one does
    - What needs done: the high-level outcome the phases work toward
-->

# Feature Specification: Comprehensive Audit Remediation

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-06-04 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | `system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup` |
| **Predecessor** | `012-comprehensive-deep-review-audit` |
| **Successor** | None |
| **Handoff Criteria** | All P0/P1/P2 findings implemented and verified (typecheck + targeted vitest + contract-parity test + validate.sh --strict) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The packet-012 audit surfaced ~50 verified findings — one true infrastructure P0, two governed-scope findings calibrated to P1 under the local single-user model, and pervasive contract/metadata/doc drift — clustering into five systemic root causes. Left unremediated, the deep-loop fan-out engine reports failed reviewer lineages as successes, governed scope leaks on fallback/causal paths, a write-path cache goes stale, and the program's own status/metadata and operator docs misrepresent reality.

### Purpose
Drive every P0/P1/P2 finding to implemented-and-verified through seven independently executable, file-disjoint phases — fixing the root cause where one exists (a fan-out accounting fix, a status-derivation fix, a contract-parity test) rather than only the symptoms.

> **Phase-parent note:** This spec.md is the only required authored document at the parent level. All detailed plans, tasks, checklists, decisions, and continuity live in the child phase folders listed in the Phase Documentation Map below.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Remediation of all confirmed P0/P1/P2 findings from `012-comprehensive-deep-review-audit` (re-verified against current code).
- Root-cause fixes: fan-out result accounting (RC5), tool-contract parity test (RC1), entity-density invalidation wiring (RC3), governed-scope post-filters (RC4), status-derivation table fallback (RC2).
- Regression tests for each behavioral fix; accuracy fixes for the feature catalog, testing playbook, and governance skill docs.
- Reconciliation of stale 026/027 status metadata that the status-derivation fix makes durable.

### Out of Scope
- Building a full multi-tenant authorization system — scope findings get minimal fail-closed post-filters calibrated to the local single-user threat model.
- Reworking the fan-out pool primitive's success/failure contract (shared with the council dispatcher) — the fix lives in the worker.
- A corpus-wide rewrite of all 163 metadata-status contradictions in one pass — the heuristic is fixed and cited packets reconciled; the broader backfill is reported, applied where safe.

### Files to Change

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `deep-loop-runtime/scripts/fanout-run.cjs` | Modify | 001 | Throw on non-zero/timeout; async spawn; iteration cap; service_tier enum; review read-only |
| `system-code-graph/mcp_server/**`, `fanout-pool.cjs` | Modify | 001 | Strip ephemeral phase/ADR/packet labels from code comments |
| `mcp_server/handlers/memory-search.ts`, `causal-graph.ts`, `memory-context.ts` | Modify | 002 | Governed-scope post-filters, session trust, FK existence guard |
| `mcp_server/handlers/mutation-hooks.ts`, `memory-crud-types.ts` | Modify | 003 | Wire entity-density invalidation into shared post-mutation hook |
| `mcp_server/tests/transaction-manager-recovery.vitest.ts` | Modify | 003 | Regression test for uuid-suffixed pending-file recovery |
| `mcp_server/tool-schemas.ts`, `schemas/tool-input-schemas.ts`, `lib/embedders/embedding-reconcile.ts`, ingest/index/job-queue/save, `context-server.ts` | Modify | 004 | Contract parity, governed-ingest propagation, parity test |
| `mcp_server/lib/graph/graph-metadata-parser.ts` + 026/027 metadata | Modify | 005 | Status-table derivation fallback + metadata reconciliation |
| `system-spec-kit/feature_catalog/**`, `manual_testing_playbook/**`, `README.md` | Modify | 006 | Coverage claims, counts, broken links, stale paths |
| `sk-doc/**`, `sk-code/**`, `constitutional/**`, `AGENTS.md` | Modify | 007 | Frontmatter/command contracts, comment-hygiene checker, routing rule |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable, file-disjoint child spec folder (one-file-one-owner, so phases can be implemented in parallel). All implementation details live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | ../../../../system-deep-loop/045-deep-loop-fanout-reliability/ | RC5 — fan-out result accounting (P0), async spawn, iteration cap, service_tier enum, comment hygiene in code | Moved |
| 2 | 002-retrieval-scope-hardening/ | RC4 — community-fallback scope, causal bare-ID scope, FK guard, session trust (P1) | Complete |
| 3 | 003-memory-write-correctness/ | RC3 — entity-density invalidation on update/delete; atomic-save recovery regression test (P1) | Complete |
| 4 | 004-mcp-contract-parity/ | RC1 — reconcile/ingest/causal_stats contract parity + governed-ingest propagation + parity test (P1/P2) | Complete |
| 5 | 005-metadata-status-derivation/ | RC2 — status-table derivation fallback + 026/027 metadata reconciliation (P1/P2) | Complete |
| 6 | 006-catalog-playbook-accuracy/ | Feature catalog + testing playbook: counts, coverage claims, broken links, stale paths (P1/P2) | Complete |
| 7 | 007-governance-alignment/ | sk-doc/sk-code/constitutional: frontmatter, command contracts, comment-hygiene checker, routing rule (P1/P2) | Complete |

### Phase Transition Rules

- Phases 001-005 touch code; 006-007 touch docs only. File ownership is disjoint, so phases may be implemented in parallel and verified centrally.
- Phase 005 (status-derivation parser fix) must land and the MCP server dist rebuilt before the metadata backfill regenerates derived status.
- Phase 002's causal-scope post-filters are enabled by optional scope fields added to the causal tool schemas in Phase 004.
- Run `validate.sh --strict --recursive` on this parent to validate all phases as an integrated unit.

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001 | central | Fan-out throws on failed lineage; concurrency parallelizes | `vitest run fanout-run / fanout-pool / cli-matrix` |
| 002 | 004 | Scope post-filters in place; schema scope fields needed | `vitest run handler-causal-graph / community-search` |
| 003 | central | Entity-density invalidated via shared hook | `vitest run entity-density-commit-hooks` |
| 004 | 005 | Contract parity test green; governed ingest propagates | `vitest run tool-contract-parity / tool-input-schema` |
| 005 | central | Draft/Placeholder no longer derive 'complete'; dist rebuilt; metadata reconciled | `vitest run graph-metadata-schema` + backfill dry-run |
| 006 | central | Counts/links/coverage claims match disk reality | grep/ls evidence per finding |
| 007 | central | Doc contracts and checker match enforcement reality | checker run + cross-doc consistency |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- Corpus-wide count of metadata-status contradictions (Phase 005 establishes a verified lower bound and reports the backfill blast radius).
- Whether the 027 `000-release-cleanup` placeholder should be de-listed from machine metadata or fully scaffolded (Phase 005 resolves to the minimal honest option).
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Audit source**: `../012-comprehensive-deep-review-audit/implementation-summary.md`
- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md
- **Parent Spec**: See `../spec.md`
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
