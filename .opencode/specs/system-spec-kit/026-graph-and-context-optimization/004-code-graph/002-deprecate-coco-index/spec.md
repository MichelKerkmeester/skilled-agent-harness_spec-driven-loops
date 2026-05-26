---
title: "014: Deprecate CocoIndex + Rerank-Sidecar, Decouple Code-Graph (phase parent)"
description: "Phase parent for removing the mcp-coco-index semantic-search skill and the system-rerank-sidecar cross-encoder service from the live repo surface, and decoupling system-code-graph from CocoIndex (sever the ccc_* bridge + semantic/hybrid routing while keeping the structural code-graph skill alive). Research-first: 001 maps every live touchpoint into a classified resource map before any deletion phase runs."
trigger_phrases:
  - "deprecate cocoindex"
  - "remove mcp-coco-index"
  - "deprecate rerank sidecar"
  - "decouple code-graph from cocoindex"
  - "remove ccc bridge"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/014-deprecate-coco-index"
    last_updated_at: "2026-05-25T00:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "Phases 002-012 done; coco+rerank coupling removed; builds+tests green"
    next_safe_action: "Optional: scrub harmless residual (index-scope exclusion, sweep, data)"
    blockers: []
    key_files:
      - "spec.md"
      - "resource-map.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000014000"
      session_id: "014-deprecation-complete"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-phase-parent | v2.2 -->
# Feature Specification: Deprecate CocoIndex + Rerank-Sidecar, Decouple Code-Graph

<!-- SPECKIT_LEVEL: phase-parent -->
<!-- CONTENT DISCIPLINE: PHASE PARENT
  Lean phase-parent control file. Only {spec.md, description.json,
  graph-metadata.json} (+ resource-map.md once 001 research lands) live here.
  Heavy docs (plan, tasks, checklist, implementation-summary, decision-record)
  live in each phase child where they stay accurate to that phase's work.
  Resume on this parent follows graph-metadata.json.derived.last_active_child_id,
  else lists children with statuses (per /spec_kit:resume step 3b).
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | phase-parent |
| **Priority** | P1 |
| **Status** | Complete (functional; harmless residual enumerated) |
| **Created** | 2026-05-25 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The repo carries a semantic code-search stack that is being retired: the `mcp-coco-index` skill (a soft-fork of cocoindex-code + the `ccc` CLI + the `cocoindex_code` MCP server) and the `system-rerank-sidecar` cross-encoder HTTP service. Two couplings make removal non-trivial: `system-code-graph` (structural indexing) is bound to CocoIndex through the `ccc_*` bridge tools and the semantic/hybrid query-intent routing, and `system-rerank-sidecar` is consumed by **both** CocoIndex and `mk-spec-memory` (opt-in cross-encoder rerank). Removing these cleanly requires mapping every live touchpoint first.

### Purpose
Remove `mcp-coco-index` and `system-rerank-sidecar` from the live repo surface, and decouple `system-code-graph` from CocoIndex so it stands alone as the structural-only surface — without breaking `mk-spec-memory`, the deep-research / agent flows, or the 4-runtime configs, and without rewriting frozen historical spec docs.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. Detailed planning lives in the phase children. The classified touchpoint `resource-map.md` is produced by 001 and promoted to this root.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- DELETE the `mcp-coco-index` skill (skill folder, forked `mcp_server/`, `ccc` CLI, `cocoindex_code` MCP registration) and all LIVE references.
- DELETE the `system-rerank-sidecar` skill and neutralize its consumers: CocoIndex (dies with it) and `mk-spec-memory`'s opt-in `local` cross-encoder path (`SPECKIT_CROSS_ENCODER` / `RERANKER_LOCAL`, the ensure helper, the `cross-encoder.ts` local branch).
- DECOUPLE `system-code-graph` from CocoIndex: sever the `ccc_status` / `ccc_reindex` / `ccc_feedback` bridge tools, the semantic/hybrid query-intent routing, and the `ccc_bridge_integration` doc — keeping the structural code-graph skill alive with green tests.
- Update LIVE runtime configs + docs across the 4-runtime mirror: opencode.json, .vscode/mcp.json, .gemini/, .claude/, .codex/, AGENTS.md, CLAUDE.md search-routing, README, install guides, the `/doctor cocoindex` route.
- Define the post-state semantic-search policy (what replaces "find code by concept").

### Out of Scope
- Editing or rewriting FROZEN historical spec docs under `.opencode/specs/**` — they stay as the record of past work (operator directive 2026-05-25).
- Re-adding cloud rerankers (voyage / cohere) — already removed in 022/013.
- Any change to `mk-spec-memory` embeddings or non-rerank retrieval channels beyond the cross-encoder removal.

### Files to Change
Enumerated, deduplicated, and classified (DELETE / EDIT-decouple / EDIT-remove-ref / LEAVE-historical) by 001 research into `resource-map.md`. Per-phase detail lives in each child's plan.md.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> Phased decomposition. 001 is research-first; the deprecation phases (002+) are scaffolded FROM the 001 resource map (ordering finalized by the research DAG).

| Phase | Folder / Commit | Focus | Status |
|-------|--------|-------|--------|
| 001 | `001-touchpoint-research/` | Deep-research (12 iters): classified touchpoint map + phase DAG → `resource-map.md` | Complete |
| 002 | `002-decouple-code-graph/` | Sever ccc_* bridge (11→8 tools), routing, doctor route; keep code-graph green | Complete |
| 003 | `003-remove-memory-rerank-path/` | Remove mk-spec-memory local cross-encoder path + flags + ensure helper | Complete |
| 004 | `004-remove-rerank-sidecar-skill/` | Delete the system-rerank-sidecar skill | Complete |
| 005 | `005-remove-coco-index-skill/` | Delete the mcp-coco-index skill + ccc CLI | Complete |
| 006 | `006-runtime-configs-4runtime-mirror/` | Remove coco MCP regs + RERANK env from 4-runtime configs (+ missed `.mcp.json`/`.devin`) | Complete |
| 007 | `007-docs-readme-search-routing/` | Rewrite 27 YAML assets + docs to HYBRID search policy | Complete |
| 008 | `008-runtime-artifacts-cleanup/` | skill-advisor de-reference + scripts + venvs/daemon/sweeper; skill-graph→21 skills | Complete |
| 009 | commit `3d9e3d0b39` | Skill-doc HYBRID sweep across cli-*/sk-*/commands/README (38 docs) | Complete |
| 010 | `010-remove-memory-coco-integration/` | **Discovered gap:** memory's live coco integration (daemon-probe, calibration, cocoIndexAvailable, vector warning) + repair 002 latent typecheck break | Complete |
| 011 | commit `4a8b2332b0` | **Discovered gap:** complete 002 — remove code-graph's vestigial cocoIndex budget lane + StartupBrief field | Complete |
| 012 | commit `c65e05ae8f` | Functional residue: delete orphan rerank-parity test + sk-doc dead branch | Complete |

### Phase Transition Rules
- Decouple-before-delete honored: code-graph↔coco (002) + memory↔sidecar (003) severed before deleting skills (004/005).
- Per-phase scope-strict commits on `main` as rollback points; frozen specs/changelogs/benchmarks untouched.

### Residual (intentionally retained — harmless, not functional coupling)
- **code-graph index-scope exclusion** (`index-scope.ts`/`index-scope-policy.ts`/`indexer-types.ts` + ~12 tests): `'mcp-coco-index=excluded'` — defensive exclusion of the now-deleted dir; removing it churns 12 assertion tests for zero functional gain.
- **process sweep patterns** (`process-memory-harness.ts`/`process-sweep.vitest.ts`): `cocoindex-daemon`/`cocoindex-mcp` kill-classes — defensive orphan cleanup of any lingering old processes.
- **Frozen data**: benchmark runs, observability measurements, test fixtures, `matrix-manifest.json` F8 cell, changelogs — historical records (left like changelogs).
- A whole-repo scrub of these is a quick optional follow-on; none are live dependencies or documented features.
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. RESOLVED QUESTIONS
- **RQ4** (semantic code-search replacement): HYBRID — Code Graph structural (`code_graph_query`) + Grep; `memory_search` stays for spec-docs/memory only. Applied in 007/009.
- **RQ2** (memory rerank fallback): memory's real search is embedder-backed hybrid (vector/bm25/fts/graph/degree via `vector-index.ts`); the coco/rerank coupling was vestigial telemetry, so default search is unaffected (verified 010).
- **RQ6** (ordering/rollback): decouple-before-delete DAG + per-phase scope-strict commits. Note: 001 research under-mapped two couplings that surfaced during execution — 010 (memory's live coco integration) and 011 (code-graph's cocoIndex budget lane) — plus a latent 002 cross-skill typecheck break; all closed.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS
- **Research subphase**: `001-touchpoint-research/` (deep-research loop + research.md + resource-map.md)
- **Resource Map (promoted)**: `resource-map.md` (after 001 converges)
- **Parent Spec**: `../spec.md`
- **Graph Metadata**: `graph-metadata.json` (`derived.last_active_child_id` pointer)
