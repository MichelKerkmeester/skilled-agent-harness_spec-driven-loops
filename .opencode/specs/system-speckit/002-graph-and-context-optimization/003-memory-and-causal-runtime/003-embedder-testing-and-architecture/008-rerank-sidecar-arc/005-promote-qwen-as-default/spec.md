---
title: "Feature Specification: Promote Qwen3-Reranker-0.6B as the spec-memory default"
description: "Final phase of arc 008. Phase 004 returned HOLD, so Qwen remains opt-in via SPECKIT_CROSS_ENCODER=true. This phase updates ENV_REFERENCE.md, embedder_architecture.md, system-rerank-sidecar/SKILL.md, and arc metadata without changing source code or runtime configs."
trigger_phrases:
  - "promote qwen default reranker"
  - "cross-encoder ms-marco to qwen3"
  - "speckit_cross_encoder default on"
  - "005 default promotion"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/008-rerank-sidecar-arc/005-promote-qwen-as-default"
    last_updated_at: "2026-05-21T15:30:00Z"
    last_updated_by: "cli-codex"
    recent_action: "Superseded by 011/005 opt-in closure"
    next_safe_action: "Use 011/005 instead"
    blockers:
      - "Superseded — do not execute"
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/cross-encoder.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md"
      - ".opencode/skills/system-spec-kit/references/memory/embedder_architecture.md"
---
# Feature Specification: Promote Qwen3-Reranker-0.6B as the spec-memory default

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

Phase 005 of the 008 rerank-sidecar arc. Final decision phase — promote Qwen to default ONLY IF phase 004's benchmark proved it out.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete (HOLD) |
| **Created** | 2026-05-20 |
| **Branch** | `main` |
| **Parent Arc** | `008-rerank-sidecar-arc` |
| **Predecessor** | `004-spec-memory-rerank-benchmark` |
| **Successor** | (potential future: `006-shared-deduplication-from-cocoindex` — repoint cocoindex's bundled Qwen to the shared sidecar) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

After phases 001-003 ship, spec-memory has a working cross-encoder rerank pipeline plumbed to a shared Qwen sidecar. But two things stay un-default:

1. `lib/search/cross-encoder.ts:55` still defaults `local.model` to `cross-encoder/ms-marco-MiniLM-L-6-v2` — the old stale default.
2. `SPECKIT_CROSS_ENCODER` defaults to `false` (per `search-flags.ts:102`), so the rerank pipeline only activates when the operator explicitly opts in.

Both leave spec-memory in "shipped but inert" state. The reranker exists; nobody uses it without explicit config.

### Purpose

If phase 004's benchmark satisfies the decision rule (PROMOTE path):

1. Flip `cross-encoder.ts:55` `local.model` default → `Qwen/Qwen3-Reranker-0.6B`
2. Add `SPECKIT_CROSS_ENCODER=true` to all 4 runtime configs (spec-memory env block)
3. Update `ENV_REFERENCE.md` to describe Qwen as the default + reference the phase 004 benchmark report for the evidence base
4. Update `references/memory/embedder_architecture.md` Stage 3 reranker section to describe Qwen + the sidecar architecture
5. Update `system-rerank-sidecar/SKILL.md` to note that spec-memory now defaults to its model

If phase 004's benchmark does NOT satisfy the decision rule (HOLD path):

1. **No source changes** to `cross-encoder.ts`
2. **No env defaults change** in runtime configs (`SPECKIT_CROSS_ENCODER` stays default-off)
3. Update `ENV_REFERENCE.md` + `embedder_architecture.md` to mention that Qwen is available as an opt-in via the sidecar but is not the default; link to the phase 004 benchmark explaining why
4. The arc still "ships" — the sidecar infrastructure (phases 001-003) is permanent
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope (PROMOTE path)

- One-line change in `cross-encoder.ts:55` (`model` field of the `local` provider)
- Add `SPECKIT_CROSS_ENCODER=true` to spec-memory env block in `.mcp.json`, `opencode.json`, `.gemini/settings.json`, `.codex/config.toml`
- ENV_REFERENCE.md `SPECKIT_CROSS_ENCODER` row update: describe new default-on + reference benchmark
- embedder_architecture.md Stage 3 section: explain the sidecar + Qwen + ms-marco-fallback chain
- system-rerank-sidecar/SKILL.md: cross-reference spec-memory as a primary consumer
- Brief integration smoke: cold-start spec-memory with default configs; verify memory_search uses Qwen rerank without explicit env override

### In Scope (HOLD path)

- ENV_REFERENCE.md updates only — describe Qwen as opt-in with rationale
- No source-code changes

### Out of Scope (both paths)

- **Cocoindex de-duplication** — phase 006 candidate; cocoindex still loads its own Qwen even after spec-memory points at the shared sidecar. De-duplicating requires changing cocoindex's `rerankers/reranker.py` to make HTTP calls instead of in-process predict, which is a separate decision with its own benchmarking.
- **Removing the ms-marco model name from `cross-encoder.ts`** — keep it as an opt-in fallback for operators who explicitly set `RERANK_MODEL_NAME=cross-encoder/ms-marco-MiniLM-L-6-v2`
- **Deleting `local-reranker.ts` no-op shim** — separate cleanup packet

### Files to Change

#### PROMOTE path

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/cross-encoder.ts` | Modify | Line 55: change `model: 'cross-encoder/ms-marco-MiniLM-L-6-v2'` → `'Qwen/Qwen3-Reranker-0.6B'` |
| `.mcp.json`, `opencode.json`, `.gemini/settings.json`, `.codex/config.toml` | Modify | Add `SPECKIT_CROSS_ENCODER=true` to spec-memory env block |
| `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md` | Modify | Update `SPECKIT_CROSS_ENCODER` row |
| `.opencode/skills/system-spec-kit/references/memory/embedder_architecture.md` | Modify | Stage 3 section |
| `.opencode/skills/system-rerank-sidecar/SKILL.md` | Modify | Note spec-memory adoption |

#### HOLD path

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md` | Modify | Describe opt-in + link to benchmark |
| `.opencode/skills/system-spec-kit/references/memory/embedder_architecture.md` | Modify | Same |
| `.opencode/skills/system-rerank-sidecar/SKILL.md` | Modify | Document spec-memory as an opt-in consumer and record the CPU latency limitation |
| `../spec.md` | Modify | Mark phase 005 `Complete (HOLD)` in the arc phase map |
| `../graph-metadata.json` | Modify | Point `last_active_child_id` at this phase and mark the arc complete |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Read phase 004's `benchmark_report.md` §8 RECOMMENDATIONS | Documented in this packet's `implementation-summary.md` (paste of the recommendation block) |
| REQ-002 | Choose path (PROMOTE or HOLD) per the documented decision rule | This packet's `implementation-summary.md` §2 What Was Built explicitly states "PROMOTE path executed" or "HOLD path executed" |
| REQ-003 | If PROMOTE: cross-encoder.ts default updated AND `SPECKIT_CROSS_ENCODER=true` in all 4 configs | `grep -c "Qwen/Qwen3-Reranker-0.6B" cross-encoder.ts` returns ≥1; `grep -c SPECKIT_CROSS_ENCODER .mcp.json` etc. confirms `=true` |
| REQ-004 | If HOLD: cross-encoder.ts untouched AND configs unchanged | `git diff HEAD~1 -- cross-encoder.ts .mcp.json opencode.json .gemini/settings.json .codex/config.toml` returns empty for those files |
| REQ-005 | ENV_REFERENCE.md updated regardless of path | Diff shows new row content |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | embedder_architecture.md updated regardless of path | Diff shows new Stage 3 section |
| REQ-007 | system-rerank-sidecar SKILL.md cross-references this decision | Visible link from sidecar skill to spec-memory's decision |
| REQ-008 | If PROMOTE: integration smoke confirms default-on behavior | Cold-start memory_search returns Qwen-reranked scores without env override |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Decision path documented in this packet's implementation-summary.md, with quoted recommendation from phase 004.
- **SC-002**: All path-appropriate files updated; diff matches the decision.
- **SC-003**: PROMOTE path: cold memory_search uses Qwen by default without operator env override.
- **SC-004**: HOLD path: ENV_REFERENCE.md clearly explains why Qwen is opt-in and how to enable it (`SPECKIT_CROSS_ENCODER=true`).
- **SC-005**: Strict validate exits 0 on this packet.
- **SC-006**: arc parent's `graph-metadata.json` `last_active_child_id` updated to this phase; arc status = `complete` (or `complete with open follow-on` if a 006 phase is planned).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | PROMOTE path: enabling rerank-by-default adds 150-500ms per search → user-visible slowdown | Operators surprised by latency | benchmark_report.md documents the p95 impact; ENV_REFERENCE.md explains the opt-out (set `SPECKIT_CROSS_ENCODER=false`) |
| Risk | PROMOTE path on machines without the sidecar installed → no rerank, just positional fallback (today's behavior) | No regression vs. today, just no improvement either | Graceful degradation is already wired (phase 002 + 003). ENV_REFERENCE.md notes the dependency on the sidecar skill being installed |
| Risk | HOLD path: arc ships but operators don't know how to enable rerank | Feature stays dormant | README of arc parent and ENV_REFERENCE both explain `SPECKIT_CROSS_ENCODER=true` opt-in |
| Risk | Phase 004 result is borderline — barely meets one criterion but not others | Ambiguous decision | Decision rule in phase 004 spec is conjunctive (hit-rate OR mrr AND latency). Ambiguity gets resolved by the operator's read of §8 RECOMMENDATIONS in the benchmark report |
| Dependency | Phase 004's benchmark report must exist and validate | Phase blocked | Confirmed before starting this phase |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- If PROMOTE: should we also raise spec-memory's default `SPECKIT_MAX_SECONDARY_CLIENTS` since the reranker adds inference cost? **DEFERRED**: phase 005 ships the model promotion; separate tuning packet if profiling shows the secondary-client cap matters.
- If HOLD: should the arc explicitly create a `005a` follow-on phase to try Qwen3-Reranker-4B (larger sibling) instead? **PROPOSED: not as part of 005.** Track as a potential future packet (`009-rerank-model-size-sweep`) if the 0.6B model genuinely underperforms.
- Should this phase update cocoindex's `mcp-coco-index/.env.example` to recommend pointing at the shared sidecar instead of bundling Qwen? **PROPOSED: not yet.** That's the 006 packet's scope; this phase touches spec-memory only.
- If PROMOTE: do we backfill the cross-encoder.ts comment block (lines 8-21) that describes the providers? **YES** — update the line `(ms-marco-MiniLM-L-6-v2)` to `(Qwen/Qwen3-Reranker-0.6B via the system-rerank-sidecar skill)`.
<!-- /ANCHOR:questions -->
