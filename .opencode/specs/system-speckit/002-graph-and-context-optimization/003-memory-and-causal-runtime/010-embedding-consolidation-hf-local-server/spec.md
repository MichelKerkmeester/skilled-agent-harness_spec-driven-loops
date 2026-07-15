---
title: "Feature Specification: Embedding consolidation and hf-local model server"
description: "Phase parent for consolidating local embeddings on nomic-ai/nomic-embed-text-v1.5 and re-architecting hf-local as a launcher-supervised local HTTP model server instead of a daemon-forked sidecar."
trigger_phrases:
  - "embedding consolidation hf local server"
  - "029-embedding-consolidation phase parent"
  - "nomic only hf-local model server"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/003-memory-and-causal-runtime/010-embedding-consolidation-hf-local-server"
    last_updated_at: "2026-05-29T13:30:00Z"
    last_updated_by: "claude-opus"
    recent_action: "All 6 phases shipped; nomic-only + hf-local model server + shared cross-launcher supervision"
    next_safe_action: "Option B complete; optional live two-launcher validation when daemons run"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000029"
      session_id: "029-embedding-consolidation-parent"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Execution order: nomic-only consolidation first, then hf-model-server through skill-advisor wiring"
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

# Feature Specification: Embedding consolidation and hf-local model server

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Implemented (all 6 phases shipped + committed; live two-launcher residency deferred) |
| **Created** | 2026-05-29 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | system-spec-kit |
| **Predecessor** | None |
| **Successor** | None |
| **Handoff Criteria** | Each child validates independently; local embeddings use one default model and hf-local runs through a launcher-supervised HTTP model server |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The embedding stack exposes too many local model choices across separate registries, dimension maps, provider defaults, type strings, and docs. In parallel, `hf-local` still loads transformers inside daemon/sidecar execution paths instead of using the launcher-owned, health-probed local-service shape already used for long-lived daemon processes.

### Purpose
Consolidate the embedding stack on a single default model (`nomic-ai/nomic-embed-text-v1.5`) and re-architect the local `hf-local` provider to run as a launcher-supervised local HTTP model server, like ollama, instead of a daemon-forked sidecar.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Root purpose and the child-phase manifest for the embedding-consolidation and hf-local-server work.
- Per-phase implementation details (in the child folders).

### Out of Scope
- Detailed per-phase implementation plans at the parent level.
- Generated packet metadata (`description.json`, `graph-metadata.json`), which is produced separately.
- Historical benchmark report rewrites or benchmark/test-fixture history edits.

### Files to Change
Summary of aggregate file scope. Per-phase detail lives in child plans.

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `shared/embeddings/registry.ts`, `shared/embeddings/factory.ts` | Modify | 001 | Reduce local model registry and dimension maps to nomic-only while preserving runtime dims for user overrides |
| `shared/embeddings/providers/*.ts`, docs | Modify | 001 | Trim local-provider model mentions and documentation to the single default model |
| `.opencode/bin/hf-model-server.cjs` | Add | 002 | Local HTTP/UDS model server wrapping the existing transformers load path |
| `shared/embeddings/providers/hf-local.ts` | Modify | 003 | Rewrite hf-local into an ollama-shaped HTTP client with readiness retry and runtime dim adoption |
| `bin/mk-spec-memory-launcher.cjs`, `bin/lib/launcher-ipc-bridge.cjs` | Modify | 004 | Launcher-owned lazy supervision, health probe, respawn lock, lease pid, and RSS watchdog |
| `mcp_server/lib/embedders/execution-router.ts`, sidecar files/tests | Modify/Delete | 005 | Retire sidecar execution and route hf-local through the direct factory-backed adapter |
| `system-skill-advisor/mcp_server/lib/embedders/index.ts`, docs | Modify | 006 | Wire skill-advisor to the shared server socket and document new env/troubleshooting contracts |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-nomic-only-consolidation/ | Reduce local embedding model menus, dimensions, defaults, and docs to `nomic-ai/nomic-embed-text-v1.5` while allowing unlisted user overrides via runtime dim derivation | Implemented |
| 2 | 002-hf-model-server/ | Add a pure-Node hf model server exposing `/api/embed` and `/api/health` over UDS/tcp while relocating existing transformers load logic | Implemented |
| 3 | 003-hf-local-http-client/ | Rewrite `hf-local.ts` as an ollama-shaped HTTP client with client-side prefixes, readiness retry, and runtime dim adoption | Implemented |
| 4 | 004-launcher-supervision/ | Lazy-spawn and supervise the model server from the launcher with a second crash-loop guard, RSS watchdog, lease pid, and health probe | Implemented |
| 5 | 005-retire-sidecar/ | Remove sidecar execution for embeddings and collapse hf-local routing to the direct factory-backed adapter path | Implemented |
| 6 | 006-skill-advisor-shared-wiring/ | Point skill-advisor at the shared model-server socket and document the new env and troubleshooting surface | Implemented |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins.
- Parent spec tracks aggregate progress via this map.
- Use `/spec_kit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase.
- Run `validate.sh --recursive` on parent to validate all phases as an integrated unit.

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-nomic-only-consolidation | 002-hf-model-server | Local provider defaults and docs list only nomic; user overrides still derive runtime dimensions | tsc + embeddings vitest green |
| 002-hf-model-server | 003-hf-local-http-client | Server answers health during load and embed requests await the single-flight load | hf-model-server tests pass |
| 003-hf-local-http-client | 004-launcher-supervision | Client can reach the server over socket/tcp, retries loading states, and treats runtime dim as authoritative | hf-local client tests pass |
| 004-launcher-supervision | 005-retire-sidecar | Launcher supervises, probes, relaunches, and tears down the model server via lease state | launcher/bridge tests pass |
| 005-retire-sidecar | 006-skill-advisor-shared-wiring | No live sidecar execution path remains for hf-local embeddings | grep + router tests confirm no live sidecar branch |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- Should `HF_EMBED_SERVER_IDLE_MS` default to disabled forever, or should a later packet introduce an opt-in idle eviction policy after field data?
- Should multi-model residency remain out of scope until heterogeneous consumers have measured demand?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md.
- **Parent Spec**: See `../spec.md`.
- **Graph Metadata**: Generated separately as `graph-metadata.json`.
