---
title: "Implementation Summary: Promote Qwen3-Reranker-0.6B as the spec-memory default [template:level_1/implementation-summary.md]"
description: "PRE-IMPLEMENTATION stub for the decision-gated promotion phase. Decision path will be chosen and documented after phase 004 ships."
trigger_phrases:
  - "005 implementation summary"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/008-rerank-sidecar-arc/005-promote-qwen-as-default"
    last_updated_at: "2026-05-20T00:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "Stub authored ahead of decision"
    next_safe_action: "Wait for phase 004 verdict"
    blockers: ["awaiting phase 004 benchmark report"]
    completion_state: "pre-implementation"
---
# Implementation Summary: Promote Qwen3-Reranker-0.6B as the spec-memory default

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary-core | v2.2 -->

> **Status: PRE-IMPLEMENTATION + DECISION-GATED.** This phase doesn't start until phase 004's `benchmark_report.md` exists. The path (PROMOTE vs HOLD) is determined by the §8 RECOMMENDATIONS in that report.

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Status** | Planned (decision-gated; awaiting phase 004) |
| **Created** | 2026-05-20 |
| **Branch** | `main` |
| **Parent Arc** | `008-rerank-sidecar-arc` |
| **Position in arc** | Phase 005 of 5 — the final promotion or hold decision |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

(to fill after the path is chosen — quote phase 004's §8 verbatim here, then describe the executed branch)

Planned shape:

### Phase 004 §8 RECOMMENDATIONS (verbatim, to be pasted post-benchmark)

> _(quote of `benchmarks/benchmark-2026-MM-DD-rerank-ab/benchmark_report.md` §8 here)_

### Path executed: PROMOTE / HOLD (to fill)

**If PROMOTE path:**
- `cross-encoder.ts:55` updated to `Qwen/Qwen3-Reranker-0.6B`
- `SPECKIT_CROSS_ENCODER=true` added to `.mcp.json`, `opencode.json`, `.gemini/settings.json`, `.codex/config.toml`
- ENV_REFERENCE.md, embedder_architecture.md, system-rerank-sidecar/SKILL.md updated
- Integration smoke: cold spec-memory invokes Qwen rerank without operator env override

**If HOLD path:**
- ENV_REFERENCE.md and embedder_architecture.md updated to describe the opt-in path + benchmark rationale
- No source-code or runtime-config changes
- Arc 008 still ships — the sidecar infrastructure is permanent; only the default flip is held back
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

(to fill after implementation)

Planned shape:

- Phase A: read phase 004's §8; quote into this file; choose path
- Phase B: execute path-specific file edits
- Phase C: arc-parent close — update `last_active_child_id`, phase-map row, derived.status

The work itself is small (1-line code change + 4 config edits + 3 doc edits at most). The discipline is in cleanly gating on phase 004's evidence and refusing to PROMOTE if the data doesn't justify it.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

### D-001 (planned): Decision rule encoded in phase 004, applied mechanically here
**Decision:** Phase 005 doesn't independently re-evaluate the benchmark; it consumes the §8 RECOMMENDATIONS as a directive.
**Rationale:** Separation of concerns. Phase 004 is the evidence + decision-rule application. Phase 005 is the execution. Re-litigating the threshold here would defeat the purpose of the upfront commitment.

### D-002 (planned): HOLD path still ships ENV_REFERENCE updates
**Decision:** Even on HOLD, this phase touches docs to explain the opt-in path.
**Rationale:** Without doc updates, operators can't discover the sidecar exists. HOLD ≠ "do nothing"; it means "ship infrastructure, defer default flip". The docs need to reflect that.

### D-003 (planned): Keep `cross-encoder/ms-marco-MiniLM-L-6-v2` referenceable as opt-in fallback
**Decision:** PROMOTE path changes the DEFAULT to Qwen but doesn't remove ms-marco from the codebase.
**Rationale:** Operators may want to compare or fall back. `RERANK_MODEL_NAME=cross-encoder/ms-marco-MiniLM-L-6-v2` should still work as an override. Removing ms-marco entirely is a separate cleanup.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

(to fill with actual command outputs after path execution)

Planned verification (PROMOTE path):
```bash
# Strict validate
bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh \
  .opencode/specs/.../008-rerank-sidecar-arc/005-promote-qwen-as-default \
  --strict
# Expect: Exit 0

# Path-correctness audit
git diff HEAD~1 -- \
  .opencode/skills/system-spec-kit/mcp_server/lib/search/cross-encoder.ts \
  .mcp.json opencode.json .gemini/settings.json .codex/config.toml \
  .opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md \
  .opencode/skills/system-spec-kit/references/memory/embedder_architecture.md \
  .opencode/skills/system-rerank-sidecar/SKILL.md
# Expect: only those 8 files touched

# Integration smoke
pkill -KILL -f "mk-spec-memory-launcher|context-server|rerank_sidecar"
( sleep 30; echo done ) | node .opencode/bin/mk-spec-memory-launcher.cjs > /tmp/smoke.log 2>&1 &
sleep 10
curl -s http://localhost:8765/health
# Expect: 200 with model_loaded=true after warmup
```

Planned verification (HOLD path):
```bash
# Strict validate same as above

# Path-correctness audit
git diff HEAD~1 -- \
  .opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md \
  .opencode/skills/system-spec-kit/references/memory/embedder_architecture.md
# Expect: only those 2 files touched

# Doc audit (manual)
grep "SPECKIT_CROSS_ENCODER" .opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md
# Expect: row mentions opt-in + benchmark link
```
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

(to refine after implementation)

Planned limitations:

1. **Decision is binary.** No "partial promote" path. If phase 004 shows marginal improvement, we either go all-in or wait — no in-between.
2. **PROMOTE adds rerank cost to every search.** ~150-500ms p95. Operators on slow hardware may prefer HOLD even if quality lift is real.
3. **PROMOTE depends on the sidecar skill being installed.** If a user removes `system-rerank-sidecar/`, spec-memory falls back to positional scores (graceful degradation, not failure).
4. **HOLD path is conservative.** If phase 004 shows minor positive lift, HOLD chooses not to flip the default. This is intentional — defaults should require clear evidence — but means operators who'd benefit from rerank-on must explicitly opt in.
5. **No A/B testing in production.** This phase ships the decision; there's no infrastructure for running 50/50 with-rerank vs without-rerank in live workspaces.
<!-- /ANCHOR:limitations -->
