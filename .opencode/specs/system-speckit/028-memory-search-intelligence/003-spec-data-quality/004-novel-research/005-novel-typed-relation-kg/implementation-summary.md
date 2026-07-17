---
title: "Implementation Summary [template:level_2/implementation-summary.md]"
description: "Planned state for the typed-relation KG build. This phase is scaffolded and not yet implemented, no code has shipped."
trigger_phrases:
  - "typed relation kg"
  - "llm graph backfill"
  - "knowledge graph navigation"
  - "causal edges provenance"
  - "deterministic extractor"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/003-spec-data-quality/004-novel-research/005-novel-typed-relation-kg"
    last_updated_at: "2026-07-06T18:49:50.596Z"
    last_updated_by: "markdown-agent"
    recent_action: "Record planned state for the typed-relation KG build"
    next_safe_action: "Begin Phase 1 setup once dependencies land"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "template-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 023-novel-typed-relation-kg |
| **Completed** | Not yet, scaffold only |
| **Level** | 2 |
| **Status** | PLANNED |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Nothing is built yet. This phase holds the Level-2 doc set and the design, and it waits on implementation. The notes below describe the planned build so a future session can pick it up without re-deriving scope.

### Planned: LLM typed-relation extractor

A new module `llm-relation-extractor.ts` will type high-value document prose into the six canonical `RELATION_TYPES` semantic relations and persist them to `causal_edges` with a distinct provenance marker. It will close the unwired `registerLlmBackfillFn` seam at `graph-lifecycle.ts:635` so the shipped `_scheduleLlmBackfill` scheduler fires for real. No code exists for this yet.

### Planned: typed-edge navigation surface

A read-only accessor in `graph-search-fn.ts` will return a result node's typed edges (relation, target, provenance, strength) without changing retrieval ranking or the truncation floor. It is a navigation and provenance surface, not a ranking lane. Not yet built.

### Files Changed

No files are changed yet. The rows below are the planned edits, not shipped code.

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/causal/llm-relation-extractor.ts` | Planned (Create) | LLM typed-relation extractor with bounded parse and reused caps |
| `.opencode/skills/system-spec-kit/mcp_server/lib/storage/causal-edges.ts` | Planned (Modify) | Persist LLM-derived edges with a distinct `created_by` and an LLM `evidence` marker |
| `.opencode/skills/system-spec-kit/mcp_server/context-server.ts` | Planned (Modify) | Register the backfill callback at bootstrap to close the unwired seam |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts` | Planned (Modify) | Read-only typed-edge navigation accessor over `causal_edges` |
| `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md` | Planned (Modify) | Document the extractor under the existing `SPECKIT_LLM_GRAPH_BACKFILL` flag |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Not yet delivered. When built, the extractor will ship default-off behind the existing `SPECKIT_LLM_GRAPH_BACKFILL` flag and run async on the shipped fire-and-forget `setImmediate` path so it adds no save latency. Delivery confidence will come from a vitest unit suite over the bounded parse and the cap enforcement plus a high-value fixture doc that exercises the save-to-edge path. The strict spec validator will gate any completion claim.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Map onto the existing six `RELATION_TYPES`, never widen the CHECK constraint | Keeps the write target frozen so no insert can fail the constraint |
| Ship as a navigation and provenance surface, not a ranking lane | Avoids the C2 prod-mode recall gate and the weak sparse-edge graph-boost risk |
| Reuse `MAX_AUTO_STRENGTH` and `MAX_EDGES_PER_NODE` caps | Stops the LLM layer from densifying the graph beyond the deterministic bounds |
| Tag LLM edges with a distinct `created_by` and `evidence` marker | Lets a reviewer audit and roll back LLM edges as a class |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

No build-time verification has run because no code has shipped. The commands below are the planned gate, not passing results.

| Check | Result |
|-------|--------|
| `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <this-folder> --strict` | Doc set only, run during scaffold authoring, not a completion gate |
| vitest unit suite | Not yet run, no code shipped |
| Acceptance criteria in spec.md | Not yet met, scaffold only |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Not yet implemented.** This phase is a scaffold. No extractor, no wiring and no navigation accessor exist yet. The Planned rows above are the intended build, not shipped code.
2. **Default-off when built.** The extractor will ship behind `SPECKIT_LLM_GRAPH_BACKFILL` and be a no-op when the flag is unset.
3. **Structural relation types stay out of scope.** The four deterministic structural relation types that fail the six-type CHECK constraint are recorded as an open question in spec.md, not fixed here.
<!-- /ANCHOR:limitations -->
