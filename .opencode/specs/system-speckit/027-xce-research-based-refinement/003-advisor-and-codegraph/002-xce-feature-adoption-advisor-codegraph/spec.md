---
title: "Feature Specification: Adopt proven spec-027 memory features into Skill Advisor and Code Graph"
description: "Phase parent tracking adoption of shipped spec-027 memory-system features (observability, provenance guard, BM25, BFS, feedback calibration, tombstones, why-included) into the mk_skill_advisor and mk_code_index daemon systems."
trigger_phrases:
  - "018-xce-feature-adoption-advisor-codegraph"
  - "advisor 027 feature adoption"
  - "code graph 027 feature adoption"
  - "phase parent"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/003-advisor-and-codegraph/002-xce-feature-adoption-advisor-codegraph"
    last_updated_at: "2026-06-11T00:00:00Z"
    last_updated_by: "claude-fable-5"
    recent_action: "Reconciled parent docs: all 9 child phases implemented and committed"
    next_safe_action: "Close packet or schedule BM25 shadow-lane wiring as a future phase"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-018-xce-feature-adoption-advisor-codegraph"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
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

# Feature Specification: Adopt proven spec-027 memory-system features into the skill advisor and code graph systems

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 (phase parent) |
| **Priority** | P1 |
| **Status** | Phase Parent |
| **Created** | 2026-06-10 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | system-spec-kit/027-xce-research-based-refinement/003-advisor-and-codegraph |
| **Source of truth** | `/tmp/xce-adoption-analysis.md` (ranked 027 transfer analysis, 2026-06-10) |
| **Handoff Criteria** | Each child phase validates `--strict` independently before its work begins |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Spec-027 hardened the Spec Kit Memory system with retrieval observability, a provenance-overwrite guard, packed BM25/BM25F lexical search, shared app-level BFS traversal, shadow feedback reducers, and soft-delete tombstones. The sibling daemon systems (`mk_skill_advisor` and `mk_code_index`) carry the same gaps that 027 closed: the advisor strips ranker evidence at output, has no manual-provenance guard on auto-edge writes, runs a token-overlap lexical lane, hand-rolls BFS, and never reuses validate outcomes; the code graph hard-deletes nodes/edges without audit, hand-rolls two BFS paths, returns no per-file chain breadcrumbs, and matches symbols by exact equality only. A ranked read-only analysis identified the ten transfers worth doing and rejected the rest.

### Purpose
Adopt the proven, shipped 027 memory features into the advisor and code-graph daemons phase by phase, carrying each feature's 027 rollout discipline (prompt-safety, shadow-first, behavior-preservation, bounded retention) so the adoption never regresses the live systems. The work is decomposed into nine independently executable child phases; this parent only tracks purpose, the phase manifest, and handoff discipline.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below. This keeps the parent from drifting stale as phases execute and pivot. All nine phases are IMPLEMENTED and COMMITTED: the advisor and code-graph source changes have landed, with per-phase validation evidence in each child's implementation-summary.md.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Five advisor-side adoptions: observability (`why_recommended` + degraded-vector/maintenance counters), provenance guard, packed BM25/BM25F lexical lane, shared BFS consolidation, shadow feedback calibration.
- Four code-graph-side adoptions: soft-delete tombstone audit, shared BFS consolidation, `why_included` edge-chain breadcrumbs, optional BM25 symbol resolver.
- Each phase carries its source 027 feature's rollout guardrail (prompt-safety, shadow-first, behavior-preservation, bounded retention).

### Out of Scope
- The three rejected transfers: vector read-path resilience shard quarantine (027 phase 013 is planned-only, not shipped), the five-port storage adapter seam (027 phase 015 planned-only, likely over-engineering), and idempotency receipts (already covered by content-hash skip + duplicate-id rejection in both daemons).
- Adding a brand-new semantic lane to the advisor (it already has a live semantic-shadow lane) or text search to the code graph (intentionally structural; Grep owns text search).
- Advisor/code-graph code edits outside the per-phase file scopes below — implementation landed phase by phase within each child's frozen scope.

### Files to Change
Aggregate file scope across all phases (audit trail only). Per-phase detail and the exact file:line evidence live in each child's spec.md and plan.md.

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `system-skill-advisor/.../handlers/advisor-recommend.ts`, `advisor-status.ts`, `lib/scorer/*` | Modify | 001 | Prompt-safe attribution + semantic-lane health counters |
| `system-skill-advisor/.../lib/cross-skill-edges/apply-graph-metadata-patch.ts` | Modify | 002 | `source_kind` / manual-overwrite guard for auto edges |
| `system-skill-advisor/.../lib/scorer/lanes/lexical.ts` (+ BM25 helper) | Modify/Create | 003 | Packed BM25 + BM25F field weights for the lexical lane |
| `system-skill-advisor/.../lib/skill-graph/skill-graph-queries.ts` (+ BFS helper) | Modify/Create | 004 | Shared app-level BFS for transitive_path / subgraph |
| `system-skill-advisor/.../handlers/advisor-validate.ts`, `lib/scorer/weights-config.ts` | Modify | 005 | Shadow-only lane-weight/threshold calibration |
| `system-code-graph/.../lib/code-graph-db.ts`, `handlers/scan.ts`, `handlers/status.ts` | Modify | 006 | Soft-delete tombstone lineage / status counts |
| `system-code-graph/.../handlers/query.ts` (+ BFS helper) | Modify/Create | 007 | Shared BFS for transitive symbol traversal + blast radius |
| `system-code-graph/.../handlers/query.ts` computeBlastRadius, `lib/code-graph-context.ts` | Modify | 008 | `why_included` edge-chain breadcrumbs behind includeTrace |
| `system-code-graph/.../handlers/query.ts` (+ symbol lexical index) | Modify/Create | 009 | Optional BM25 fuzzy symbol resolver for disambiguation |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-codegraph-tombstone-audit/ | Transfer #4: bounded soft-delete tombstone lineage for stale code-graph nodes/edges | Complete |
| 2 | 002-codegraph-bfs-consolidation/ | Transfer #7: standardize code-graph's two BFS paths (transitive symbol + blast radius) | Complete |
| 3 | 003-codegraph-why-included/ | Transfer #8: `why_included` edge-chain breadcrumbs for `blast_radius` + `code_graph_context` | Complete |
| 4 | 004-codegraph-bm25-symbol-resolver/ | Transfer #9: optional BM25 fuzzy symbol resolver for disambiguation only (must not compete with Grep) | Complete |

The 5 advisor-only phases that originally lived here (observability, provenance guard, packed BM25 lexical, BFS consolidation, feedback calibration) moved to `system-skill-advisor/009-advisor-and-codegraph-migrated-items/` on 2026-07-07.

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before its work is claimed done.
- All 4 remaining phases touch code-graph only and are independent of each other.
- Parent spec tracks aggregate progress via this map.
- Use `/speckit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase.
- Run `validate.sh --recursive` on parent to validate all phases as an integrated unit.

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-codegraph-tombstone-audit | (none) | Independent; bounded/default-off; ships standalone | Phase `--strict` validate |
| 003-codegraph-why-included | (none) | Independent; behind includeTrace; ships standalone | Phase `--strict` validate |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- Which phase ships first? The S-effort advisor observability phases (001) and the provenance guard (002) are the lowest-risk starting points; the BM25 phases (003, 009) carry the most validation overhead.
- Do the advisor and code-graph BFS consolidations (004, 007) justify a single shared helper package, or do package-ownership boundaries force two local helpers? The analysis flags importing memory's helper directly as a package-ownership risk.
- For the shadow feedback calibration (005), what held-out validation set gates any future weight promotion, given feedback-poisoning and sample-bias risk?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md
- **Parent Spec**: See `../spec.md`
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
