---
title: "XCE-Derived Spec Kit Refinement"
description: "Phase-parent packet for Spec Kit refinements: memory-system correctness, indexing, causal graph lifecycle, trigger matching, learning feedback reducers, and peck-derived documentation/process improvements."
trigger_phrases:
  - "027 xce memory refinement"
  - "memory semantic triggers"
  - "feedback P0 correctness"
  - "feedback reducers"
  - "memoization dependency dag"
  - "causal graph tombstones"
  - "frontmatter causal edge promoter"
  - "statediff reconciliation layer"
  - "incremental memory index"
  - "memory feedback reducers"
  - "peck teachings adoption"
  - "self-check templates"
  - "current-state discipline"
  - "constitutional rule review"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement"
    last_updated_at: "2026-06-10T18:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Shipped phases 000-010; deep review CONDITIONAL (0 P0); reconciling parent docs"
    next_safe_action: "Finish review remediation; run stress + manual playbook; then implement 011"
    blockers: []
    key_files:
      - "spec.md"
      - "001-peck-teachings-adoption/spec.md"
      - "002-memory-write-safety/spec.md"
      - "003-memory-index-causal-lifecycle/spec.md"
      - "004-semantic-trigger-fallback/spec.md"
      - "005-learning-feedback-reducers/spec.md"
      - "006-gem-team-adoption/spec.md"
      - "007-memclaw-derived-memory-hardening/spec.md"
      - "008-openltm-retrieval-observability/spec.md"
      - "009-openltm-continuity-resilience/spec.md"
      - "010-mcp-to-cli-tool-transition/spec.md"
      - "011-command-presentation-workflow-separation/spec.md"
      - "review/review-report.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-04-027-peck-phase-adoption"
      parent_session_id: null
    completion_pct: 85
    open_questions: []
    answered_questions:
      - "027 is the parent packet for the peck-derived planned work; the peck work lives under child phase 001."
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

# Feature Specification: XCE-Derived Spec Kit Refinement (Phase Parent)

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Phase Parent |
| **Created** | 2026-05-08 |
| **Updated** | 2026-06-04 |
| **Branch** | `main` |
| **Executor** | local spec authoring |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Spec Kit has coordinated refinement work across memory correctness, indexing, causal graph hygiene, trigger matching, learning feedback, and documentation/process quality. These topics share operational surfaces but have independent delivery risks, so they need a parent control document that points to child phase folders without duplicating implementation detail.

### Purpose
Coordinate the remaining child phases so each one can be resumed, implemented, and validated independently while the parent keeps the current phase map, high-level scope, and handoff order visible. This refinement builds on the now-completed 026 graph-and-context-optimization program (Status: Complete as of 2026-06-05; track 005 deferred in place).

> **Phase-parent note:** This spec.md is the only REQUIRED authored document at the parent level; optional cross-cutting docs (the `context-index.md` migration bridge and `resource-map.md`) may also live here. All detailed planning, task breakdowns, checklists, decisions, and continuity live inside the child phase folders listed in the Phase Documentation Map below.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Spec Kit Memory safety, indexing, causal-edge lifecycle, metadata edge promotion, statediff reconciliation, semantic trigger matching, and learning feedback reducers.
- Low-risk peck-derived documentation/process improvements: self-check template guidance, current-state discipline, and constitutional rule review.
- Dual-stack CLI surfaces over the mk-* MCP daemons as a completed workstream.
- Root-level child phase routing, dependency visibility, and resume wayfinding.

### Out of Scope
- Implementing the peck-derived T1 per-acceptance-criterion coverage gate.
- Detailed implementation plans at the parent level.
- Changing child phase implementation scope beyond the phase map.

### Files to Change
Summary of aggregate file scope. Per-phase detail lives in child plans.

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `templates/manifest/**`, validation docs, constitutional review surfaces | Modify/Create | 001 | Peck-derived documentation/process improvements |
| `mcp_server/handlers/save/**` and memory docs | Modify | 002 | Memory write-safety and feedback correctness |
| `mcp_server/lib/{indexing,causal}/**`, edge promotion + save/index reconciliation paths | Modify | 003 | Memory index & causal write lifecycle (phase parent; children 001-004) |
| Trigger matching and search fallback paths | Modify | 004 | Semantic trigger fallback (phase parent; children 001-004) |
| Feedback reducer pipeline paths | Modify | 005 | Learning feedback reducers |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 000 | `000-release-cleanup/` | Release cleanup phase-parent — public README, skill docs, feature catalog, manual playbook, MCP/CLI stress, commands, agents, AGENTS.md, as 8 nested aspects (`001-008`) | Complete |
| 001 | `001-peck-teachings-adoption/` | Peck adoption phase-parent — README teachings T1-T4 (self-check/current-state/constitutional) + source-pass T5-T10 (reviewer-benchmark, verification-discipline, acceptance-coverage gate), as 7 nested phases (`001-007`) | Complete |
| 002 | `002-memory-write-safety/` | P0 feedback correctness fixes + secret redaction | Complete |
| 003 | `003-memory-index-causal-lifecycle/` | Memory index & causal write lifecycle phase-parent — incremental index foundation, causal-edge tombstones, metadata-edge promoter, write-path reconciliation, as 4 nested phases (`001-004`) | Complete |
| 004 | `004-semantic-trigger-fallback/` | Hybrid lexical+semantic trigger matching phase-parent — schema+backfill, semantic matcher, hybrid handler, tests/goldens/shadow eval, as 4 nested phases (`001-004`) | Complete |
| 005 | `005-learning-feedback-reducers/` | Learning feedback reducers phase parent | Complete |
| 006 | `006-gem-team-adoption/` | Gem-team adoption phase-parent — typed agent I/O contract + scoped gates + advisory fields, as 3 nested phases (`001-003`) | Complete |
| 007 | `007-memclaw-derived-memory-hardening/` | MemClaw-derived memory write/surface hardening (idempotency receipts, tool-ownership map, stale-recall audit) + amendments to 002-005 | Complete |
| 008 | `008-openltm-retrieval-observability/` | OpenLTM-derived retrieval & memory observability — doc-anchor `why_ranked`, inline contradiction/supersession warnings, degraded-vector signal, maintenance counters (`research/010`) | Complete |
| 009 | `009-openltm-continuity-resilience/` | OpenLTM-derived continuity/session resilience — bounded restore panel, authored-continuity PreCompact snapshot, goal/decision/progress/gotcha facets (`research/010`) | Complete |
| 010 | `010-mcp-to-cli-tool-transition/` | Dual-stack CLI surfaces over the mk-* MCP daemons | Complete |
| 011 | `011-command-presentation-workflow-separation/` | Split presentation (startup questions, dashboards, results templates) out of command.md into routed files — memory/speckit/create/doctor command families, as 4 nested phases (`001-004`) each with 4 aspects | Planned |
| 012 | `012-causal-traversal-bfs/` | Replace the two recursive-CTE graph traversals with a shared snapshot-equivalent BFS helper (CTE OR-join defeats indexes; memo path queries empty tables per insert) | Spec-scaffolded |
| 013 | `013-vector-read-path-resilience/` | Vector shard integrity probe + quarantine + auto-rebuild (live malformed shard observed 2026-06-10), authoritative dimension discovery, KNN query-shape benchmark | Spec-scaffolded |
| 014 | `014-packed-bm25-field-weights/` | Packed in-memory BM25 engine (reserved slot; fixes 300-600MB fallback RAM hazard) + BM25F field weights restoring title-weighting parity | Spec-scaffolded |
| 015 | `015-storage-adapter-ports/` | Five-port storage adapter seam (vector/lexical/traversal/maintenance/contention) — testability now, backend option-value later; planning decides phase-split vs packet promotion | Spec-scaffolded |

> `001-peck-teachings-adoption` holds all peck adoptions as 7 nested phases — README teachings (phases 002-004) plus the `research/006-peck-source-deep-mining` source-pass (phases 005-007; the once-deferred T1 is now adopted at phase 007). `006` holds the gem-team `research/007` proposals as nested phases `001-003` (integration analysed in `research/009`); `007` holds the `research/008-caura-memclaw-...` memory-hardening proposals. Phases 000-010 are implemented and shipped (see `changelog/` and `before-vs-after.md`). Phases `011-015` are planned refinement phases, scaffolded but not yet implemented: `011` is the command-presentation refactor; `012-015` are the backend-agnostic improvements from the sqlite-to-turso revalidation (BFS traversal, vector read-path resilience, packed BM25 field weights, storage adapter ports), detailed in the Continuation Research Planning Amendments below.

### Continuation Research Planning Amendments

- Iterations 040-042 are planning hygiene inputs: root `research/` is canonical, path/command naming must be explicit by surface, and XCE ideas remain evidence signals rather than direct requirements.
- Iteration 043 is owned by `001-peck-teachings-adoption/`: keep T3, then T4, then T2; keep T1 deferred.
- Iteration 044 is owned by `002-memory-write-safety/`: treat `auto-*` provenance, manual-edge overwrite protection, and tier/pin-aware retention as P0 safety gates.
- Iteration 045 is owned by `003-memory-index-causal-lifecycle/001-incremental-index-foundation/`: add memo records, dependency edges, chunk fingerprints, chunk kinds, and chunk line spans before handler scan changes.
- Iteration 046 is owned by `003-memory-index-causal-lifecycle/002-causal-edge-tombstones/`: all active causal-edge delete paths must tombstone before hard-delete.
- Iteration 047 is owned by `003-memory-index-causal-lifecycle/003-metadata-edge-promoter/`: promote validated parent/child/parent-chain metadata and avoid duplicating already-wired manual metadata links.
- Iteration 048 is owned by `003-memory-index-causal-lifecycle/004-write-path-reconciliation/`: statediff is an explicit action/subscriber aid, not an implicit source of truth.
- Iterations 049 and 058 are planned together under `004-semantic-trigger-fallback/`: lexical-first remains primary; semantic expansion stays default-off with resumable backfill and shadow-to-union promotion evidence.
- Iterations 050 and 059 are planned together under `005-learning-feedback-reducers/`: reducers stay default-off and shadow-first until ledger quality, replay, and consumer-specific gates pass.
- Iterations 051-057 are cross-cutting planning rules for the child phases: prefer local packet context first, keep context bundles explicit, automate resource maps only with validation, keep reducer repairs idempotent, standardize `/speckit`, refuse stale impact analysis, and keep `memory_context` curation scoped to local memory-backend concerns.
- Phases 008-009 are owned by the OpenLTM study (`research/010-openltm-memory-architecture-teachings`): `008` adopts retrieval/memory observability and `009` adopts continuity/session resilience — both filtered through the spec-documentation-based vs row-based architecture (research §8). Secret redaction, content-fingerprint indexing, and reshaped opt-in capture from the same study are folded as amendments into `002`, `003`, and `005` respectively. Row-coupled mechanics (`learn/reinforce`, per-row provenance/audit, row dedup) are rejected as negative knowledge.
- Phases 012-015 are owned by the sqlite-to-turso revalidation (`.opencode/specs/z_future/sqlite-to-turso/research/research.md` + `004 - gap-alternatives.md`): backend-agnostic improvements that pay off on the current better-sqlite3 stack — BFS traversal (`012`), vector shard self-healing (`013`; live shard corruption observed 2026-06-10), packed BM25 fallback (`014`), and the five-port adapter seam (`015`). Execution order: `012` and `014` are independent; `013` coordinates with `008`'s counters; `015` runs last (it adopts `012`/`014` outputs as port implementations). The Turso migration itself stays out of 027 — gated on upstream 1.0 signals per the revalidation verdict.

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins.
- Parent spec tracks aggregate progress via this map.
- Use `/spec_kit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase.
- Run `validate.sh --recursive` on parent to validate all phases as an integrated unit.

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|----|----------|--------------|
| 002-memory-write-safety | 005-learning-feedback-reducers | P0 feedback safety fixes landed before reducers learn from feedback. | 002 validation evidence and tests. |
| 002-memory-write-safety | 003-memory-index-causal-lifecycle/002-causal-edge-tombstones | Auto-provenance broadening (P0) lands before the tombstone child's session-trace insertions. | 002 validation evidence. |
| 003-memory-index-causal-lifecycle | (internal 001→002→003→004) | The index/causal write lifecycle chain is internal to this parent; see its execution order. | Per-child validation evidence. |
| 001-peck-teachings-adoption/001-peck-teachings-for-spec-kit | 001-peck-teachings-adoption/002-self-check-templates | Peck teachings analysis complete; T3/T4/T2 order and T1 deferral are documented. | 001/001 implementation summary and analysis report. |
| 001-peck-teachings-adoption/002-self-check-templates | 001-peck-teachings-adoption/003-current-state-discipline | Template self-check guidance ships without breaking scaffold validation. | Fresh scaffold plus strict validation evidence. |
| 001-peck-teachings-adoption/003-current-state-discipline | 001-peck-teachings-adoption/004-constitutional-rule-review | Advisory current-state rule is registered without adding strict-mode errors. | Sample validation evidence. |
| 004-semantic-trigger-fallback shadow mode | 004-semantic-trigger-fallback union mode | Resumable backfill complete or explicitly failed; shadow false-positive, recall, latency, cost, and rollback evidence pass. | 004 promotion checklist evidence. |
| 005-learning-feedback-reducers shadow consumers | 005-learning-feedback-reducers active mutation/ranking | Ledger quality, shadow replay, and consumer-specific promotion criteria pass for each consumer. | 005/005 integration gate evidence. |
| 007-memclaw-derived-memory-hardening | 008-openltm-retrieval-observability | OpenLTM research phase 010 complete; observability surfaces are additive and read-only to ranking. | `research/010` deliverables (research.md §8) + per-phase strict validation. |
| 008-openltm-retrieval-observability | 009-openltm-continuity-resilience | Observability surfaces planned; continuity surfaces complement (never replace) the ladder. | Per-phase strict validation evidence. |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- Should `000-release-cleanup` remain a placeholder indefinitely, or should a future cleanup packet remove it?
- Should child phase specs be refreshed to remove stale historical numbering after each implementation phase closes?
- Should the deferred peck-derived T1 coverage gate become a separate future packet after the lower-risk 001 peck phases ship?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md.
- **Peck adoption child**: See `001-peck-teachings-adoption/spec.md`.
- **Research provenance**: See `research/` and child-phase research folders.
- **Graph Metadata**: See `graph-metadata.json` for child phase pointers.
