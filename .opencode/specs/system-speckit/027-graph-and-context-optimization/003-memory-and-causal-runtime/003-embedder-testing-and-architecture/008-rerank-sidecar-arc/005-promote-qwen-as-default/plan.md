---
title: "Implementation Plan: Promote Qwen3-Reranker-0.6B as the spec-memory default [template:level_1/plan.md]"
description: "Three-phase plan: read phase 004 verdict, apply PROMOTE or HOLD path, update arc parent status."
trigger_phrases:
  - "005 plan promote qwen default"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/008-rerank-sidecar-arc/005-promote-qwen-as-default"
    last_updated_at: "2026-05-20T00:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "HOLD path executed per phase 004 verdict"
    next_safe_action: "Arc 008 closed; follow-on requires CPU to MPS device tuning before re-benchmark"
    blockers: []
---
# Implementation Plan: Promote Qwen3-Reranker-0.6B as the spec-memory default

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Phase | What | Status |
|-------|------|--------|
| **A** | Read phase 004's `benchmark_report.md` §8; choose PROMOTE or HOLD per the documented decision rule | Complete |
| **B** | Execute the chosen path's file edits (PROMOTE: cross-encoder.ts + 4 configs + 3 docs; HOLD: docs/metadata only) | Complete (HOLD) |
| **C** | Update arc parent's `graph-metadata.json` `last_active_child_id` + status; mark arc complete (or "complete with sidecar opt-in" if HOLD) | Complete |
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

1. Phase 004 benchmark report must exist and validate as sk-doc-compliant before this phase starts.
2. Strict validate 0/0 on this packet.
3. If PROMOTE: integration smoke (cold spec-memory start; `memory_search` returns Qwen-reranked scores; trace shows `provider: 'local'` and `model: 'Qwen/Qwen3-Reranker-0.6B'`).
4. If HOLD: ENV_REFERENCE.md `SPECKIT_CROSS_ENCODER` row diffs reveal the opt-in + benchmark link.
5. Arc parent's `spec.md` Phase 005 row reflects the chosen path.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Decision-driven dispatch

```
read benchmark_report.md §8 RECOMMENDATIONS
  ├── PROMOTE path detected
  │     ├── Edit cross-encoder.ts:55 model name
  │     ├── Add SPECKIT_CROSS_ENCODER=true to 4 configs
  │     ├── Update ENV_REFERENCE.md (default-on rationale)
  │     ├── Update embedder_architecture.md (Stage 3 section)
  │     ├── Update system-rerank-sidecar/SKILL.md (cross-reference)
  │     └── Integration smoke
  │
  └── HOLD path detected
        ├── Update ENV_REFERENCE.md (opt-in rationale)
        ├── Update embedder_architecture.md (mention as opt-in)
        └── (no code, no config changes)
```

### Smoke (PROMOTE only)

```bash
# Kill all daemons, clear leases (use the operational recipe from packet 011)
pkill -KILL -f "mk-spec-memory-launcher|context-server|rerank_sidecar"
rm -f .opencode/skills/system-spec-kit/mcp_server/database/.mk-spec-memory-launcher.json

# Cold spec-memory start (no env overrides; defaults active)
( sleep 30; echo done ) | node .opencode/bin/mk-spec-memory-launcher.cjs > /tmp/smoke.log 2>&1 &

# Wait for ensure-rerank-sidecar to spawn sidecar
sleep 10

# Verify sidecar bound port 8765
ls -la /tmp/mk-spec-memory/daemon-ipc.sock  # for spec-memory itself
curl -s http://localhost:8765/health         # for the rerank sidecar

# Issue a memory_search via MCP; verify rerank applied
# (exact invocation depends on MCP harness available; document in implementation-summary)
```

### Doc updates (both paths)

**ENV_REFERENCE.md `SPECKIT_CROSS_ENCODER` row — PROMOTE:**
> `SPECKIT_CROSS_ENCODER` | `true` | boolean | **Default ON** (post-arc-008 phase 005). Routes Stage 3 reranking through the HTTP cross-encoder at `localhost:8765` (provided by the `system-rerank-sidecar` skill — auto-spawned by the launcher). Default model: `Qwen/Qwen3-Reranker-0.6B` (Apache-2.0). Set `false` to opt out. Evidence: `benchmarks/benchmark-2026-MM-DD-rerank-ab/`.

**ENV_REFERENCE.md `SPECKIT_CROSS_ENCODER` row — HOLD:**
> `SPECKIT_CROSS_ENCODER` | `false` | boolean | Opt-in for Stage 3 cross-encoder reranking via the `system-rerank-sidecar` skill at `localhost:8765`. Default `Qwen/Qwen3-Reranker-0.6B`. Phase 004 benchmark (`benchmarks/benchmark-2026-MM-DD-rerank-ab/`) found insufficient quality lift to default-enable. Set `true` to opt in.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase A — Read benchmark verdict
- `cat .opencode/skills/system-spec-kit/mcp_server/benchmarks/benchmark-2026-MM-DD-rerank-ab/benchmark_report.md` → §8 RECOMMENDATIONS
- Quote the recommendation verbatim into this packet's implementation-summary.md §2 What Was Built
- Choose PROMOTE or HOLD branch

### Phase B — Execute path

#### B.PROMOTE
- Edit `cross-encoder.ts:55` — single string change
- Edit 4 runtime configs — add `SPECKIT_CROSS_ENCODER=true` to spec-memory env blocks
- Edit `ENV_REFERENCE.md` — replace `SPECKIT_CROSS_ENCODER` row with PROMOTE wording
- Edit `embedder_architecture.md` — Stage 3 section: describe Qwen + sidecar + fallback chain
- Edit `system-rerank-sidecar/SKILL.md` — note spec-memory is a primary consumer
- Cold smoke; capture trace evidence

#### B.HOLD
- Edit `ENV_REFERENCE.md` — replace row with HOLD wording
- Edit `embedder_architecture.md` — mention opt-in path + reason
- (no code, no config changes)

### Phase C — Arc-parent close
- Update arc parent `graph-metadata.json.derived.last_active_child_id` to this phase
- Update arc parent `spec.md` phase-map row for 005: status = "Complete (PROMOTE)" or "Complete (HOLD — sidecar opt-in)"
- Update arc parent `graph-metadata.json.derived.status` = `complete`
- Strict validate this packet AND the arc parent
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test | What | Expected |
|------|------|----------|
| Strict validate | `validate.sh --strict <packet>` | Exit 0 |
| Path-correctness audit | `git diff HEAD~1 -- <expected files>` matches the chosen path | Diff covers only the appropriate files |
| PROMOTE smoke | Cold spec-memory; memory_search returns rerank evidence | Trace shows Qwen scores |
| HOLD smoke | `cat ENV_REFERENCE.md` shows opt-in row + benchmark link | Manual visual confirmation |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- **Upstream**: phase 004 benchmark report must exist + validate.
- **Sideways**: ENV_REFERENCE.md, embedder_architecture.md, cross-encoder.ts — touched in spec-memory.
- **Sideways (PROMOTE only)**: 4 runtime configs — same env-var pattern as packets 011/012.
- **Downstream**: potential future `006-shared-deduplication-from-cocoindex` — depends on Qwen being spec-memory's default (otherwise the cocoindex de-dup question is moot).
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

| Surface | How to roll back |
|---------|------------------|
| cross-encoder.ts (PROMOTE only) | `git checkout HEAD~1 -- .opencode/skills/system-spec-kit/mcp_server/lib/search/cross-encoder.ts` |
| Runtime configs (PROMOTE only) | `git checkout HEAD~1 -- .mcp.json opencode.json .gemini/settings.json .codex/config.toml` |
| ENV_REFERENCE.md, embedder_architecture.md | Revert; restore previous wording |
| system-rerank-sidecar/SKILL.md cross-reference | Same |
| Arc parent graph-metadata.json + spec.md | Same — restore prior `last_active_child_id` + phase-map row |

After rollback: spec-memory returns to phase-004 state (sidecar exists but is not the default). Operators can still explicitly opt in via env.
<!-- /ANCHOR:rollback -->
