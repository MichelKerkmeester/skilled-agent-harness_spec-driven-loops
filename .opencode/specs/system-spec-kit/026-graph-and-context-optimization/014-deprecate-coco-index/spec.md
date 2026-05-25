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
    recent_action: "001 research complete (12 iters); scaffolded phases 002-008 from DAG"
    next_safe_action: "Plan/execute 002-decouple-code-graph (decouple before delete)"
    blockers: []
    key_files:
      - "spec.md"
      - "001-touchpoint-research/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000014000"
      session_id: "014-scaffold"
      parent_session_id: null
    completion_pct: 20
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
| **Status** | In Progress |
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

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 001 | `001-touchpoint-research/` | Deep-research (12 iters): classified touchpoint map + phase DAG → `resource-map.md` | Complete |
| 002 | `002-decouple-code-graph/` | Sever ccc_* bridge (11→8 tools), routing, doctor route; keep code-graph green | Planned |
| 003 | `003-remove-memory-rerank-path/` | Remove mk-spec-memory local cross-encoder path + flags + ensure helper | Planned |
| 004 | `004-remove-rerank-sidecar-skill/` | Delete the system-rerank-sidecar skill (after 003) | Planned |
| 005 | `005-remove-coco-index-skill/` | Delete the mcp-coco-index skill + ccc CLI (after 002) | Planned |
| 006 | `006-runtime-configs-4runtime-mirror/` | Remove coco MCP regs + RERANK env from 4-runtime configs (after 004,005) | Planned |
| 007 | `007-docs-readme-search-routing/` | Rewrite 27 YAML assets + docs to HYBRID search policy (after 006) | Planned |
| 008 | `008-runtime-artifacts-cleanup/` | venvs, daemon sockets, sweeper, port 8765 (after 004,005) | Planned |

### Phase Transition Rules
- Each phase MUST pass `validate.sh` independently before the next begins.
- 002+ are not finalized until 001 converges and the resource map is promoted to this root.
- **Decouple before delete:** sever code-graph↔coco and memory↔sidecar BEFORE deleting the coco / sidecar skills.
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS
- What replaces "semantic code search" once CocoIndex is gone — drop it, repoint to `memory_search`, or grep + code-graph structural? (RQ4)
- Does removing the sidecar force `mk-spec-memory` to lose cross-encoder rerank entirely, and what is the safe fallback? (RQ2)
- Exact dependency-correct ordering + rollback points for the deletion phases. (RQ6)
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS
- **Research subphase**: `001-touchpoint-research/` (deep-research loop + research.md + resource-map.md)
- **Resource Map (promoted)**: `resource-map.md` (after 001 converges)
- **Parent Spec**: `../spec.md`
- **Graph Metadata**: `graph-metadata.json` (`derived.last_active_child_id` pointer)
