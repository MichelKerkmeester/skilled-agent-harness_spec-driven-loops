---
title: "Plan: bge-reranker-v2-m3 trial [template:level_1/plan.md]"
description: "Phase-2 execution: allowlist + revision pin → pre-fetch → benchmark → verdict."
trigger_phrases:
  - "011/002 plan"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/008-rerank-sidecar-arc/011-spec-memory-rerank-decision-arc/002-bge-v2-m3-trial"
    last_updated_at: "2026-05-21T13:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "Plan scaffolded; gated on Phase 1"
    next_safe_action: "Hold until Phase 1 OFF_DEFICIENT verdict"
    blockers:
      - "Phase 1 must complete"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Plan: bge-reranker-v2-m3 trial

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Four phases. Wall clock: ~4-6 hours including download. Cli-codex dispatch fits two invocations (config + bench, then verdict + verification) since the model download is a separate I/O-heavy step.

| Phase | Step | Wall clock |
|---|---|---|
| A | Sidecar source audit + allowlist + revision pin + pre-fetch | ~1-2 hours |
| B | Configure cross-encoder.ts:54 to point at bge-v2-m3; restart sidecar; smoke-test `/rerank` | ~30 min |
| C | Run 50-probe fixture; compute deltas vs Phase 1 OFF baseline | ~1-2 hours |
| D | Verdict + (if PROMOTE) flip default + live verification | ~1 hour |
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

```
COMPLETE iff
  bge-reranker-v2-m3 runs successfully on the 50-probe fixture AND
  per-probe deltas vs Phase 1 OFF baseline captured AND
  all Phase 1 target metrics have PASS/FAIL outcomes AND
  arc invariant gates evaluated (+3 hits over OFF, p95 < +500ms, no OOM) AND
  verdict (PROMOTE or HOLD) recorded with supporting data AND
  IF PROMOTE:
    spec-memory default flipped + live verification snippet shows cross_encoder_rerank signal
  AND strict-validate exit 0
ELSE PARTIAL (record blockers; HOLD acceptable but must be explicit).
```

Auxiliary:

- `system-rerank-sidecar/manual_testing_playbook.md` + `feature_catalog.md` updated if model behavior differs from Qwen baseline (warm-up time, batch size sensitivity, etc.)
- The 168 pre-existing vitest failures from `005-cross-cutting-quality/008-spec-memory-vitest-stabilization` remain unaffected
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Sidecar allowlist mechanism (from session memory)

- v0.2.0 sidecar (already shipped) added: allowlist via `RERANK_ALLOWED_MODELS` env, per-model locks, `RERANK_TORCH_DTYPE` for fp16 toggling
- `start.sh` env -i scrubs parent shell secrets; the rerank-relevant passthrough list already includes `RERANK_ALLOWED_MODELS`, `RERANK_MODEL_REVISIONS`, `RERANK_TORCH_DTYPE`

Phase 2 adds bge-v2-m3 by extending those env values. No new env variable needed.

### Configuration shape

In `.opencode/skills/system-rerank-sidecar/.env.local` (or equivalent — Phase A confirms):

```bash
RERANK_ALLOWED_MODELS="Qwen/Qwen3-Reranker-0.6B,cross-encoder/ms-marco-MiniLM-L-6-v2,BAAI/bge-reranker-v2-m3"
RERANK_MODEL_REVISIONS="Qwen/Qwen3-Reranker-0.6B=<sha>,cross-encoder/ms-marco-MiniLM-L-6-v2=<sha>,BAAI/bge-reranker-v2-m3=<sha>"
```

Existing Qwen + ms-marco entries stay; bge-v2-m3 joins them. Revision SHAs are recorded so behavior is reproducible.

### cross-encoder.ts:54 swap

```ts
local: {
  model: 'BAAI/bge-reranker-v2-m3',  // was: cross-encoder/ms-marco-MiniLM-L-6-v2
  // ...
}
```

This is the spec-memory default. Cocoindex remains on Qwen via its own config path.

### Use-model.sh helper

Per session memory, the sidecar ships `use-model.sh` as a one-shot model swapper. For Phase 2 the executor either uses that helper OR manually edits the env file + restarts the sidecar. The helper path is preferred if it supports bge-v2-m3 out of the box.

### Pre-fetch + warmup

Sidecar's `/warmup` endpoint loads the model into memory on demand. Pre-fetch happens implicitly on first request; the dispatch should issue a warmup call before the benchmark to keep per-probe latency clean.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase A — Sidecar config

1. Read `.opencode/skills/system-rerank-sidecar/scripts/rerank_sidecar.py` + `start.sh` to confirm allowlist mechanism (env vs registry)
2. Read `.opencode/skills/system-rerank-sidecar/.env*` files to find where the existing models are configured
3. Add bge-v2-m3 to `RERANK_ALLOWED_MODELS`; pin a HEAD revision SHA in `RERANK_MODEL_REVISIONS`
4. Restart the sidecar; confirm `/health` returns 200 with bge-v2-m3 in the model list
5. Pre-fetch via `curl -X POST /warmup -d '{"model":"BAAI/bge-reranker-v2-m3"}'`; record load time + RSS

### Phase B — cross-encoder.ts wire-up

1. Read `lib/search/cross-encoder.ts:54` provider definition
2. Update local-provider model to `BAAI/bge-reranker-v2-m3`
3. Smoke-test: a single direct `/rerank` HTTP call with 5 dummy candidates against a real probe query; expect 200 + sigmoid-normalized scores in `[0, 1]`

### Phase C — Benchmark

1. Run the 50-probe fixture with `SPECKIT_CROSS_ENCODER=true` + `RERANKER_LOCAL=true` + sidecar config from Phase A
2. Capture per-probe results to `evidence/bge-v2-m3-bench-<date>.json`
3. Compute deltas vs Phase 1 OFF baseline; populate the targets table in implementation-summary
4. Run p95 latency check; record vs OFF baseline

### Phase D — Verdict

1. Apply gates → verdict (PROMOTE / HOLD) in §Verdict
2. If PROMOTE: confirm the cross-encoder.ts patch is in (already done in Phase B); run a live `memory_search` via MCP and capture the output showing `cross_encoder_rerank` signal
3. Update arc parent's phase-map (mark 002 Complete; arc terminates here on PROMOTE; Phase 3 marked Superseded)
4. Update sidecar skill docs if needed
5. If HOLD: update Phase 3 (003-domain-tuned-finetune) spec with "bge-v2-m3 baseline" row in its target metrics
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

- **Smoke test (Phase B)**: a direct curl against `/rerank` confirms sidecar serves the new model
- **Benchmark (Phase C)**: existing 50-probe fixture is the test surface
- **Live verification (Phase D, PROMOTE only)**: at least one real `memory_search` call returns results with `cross_encoder_rerank` in `rankingSignals`
- **Regression**: focused vitest suites still pass (skill-advisor + spec-kit embedder-sidecar)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- Phase 1 verdict (OFF_DEFICIENT required to proceed)
- `system-rerank-sidecar` skill running + healthy
- `lib/search/cross-encoder.ts` and `lib/search/search-flags.ts`
- HuggingFace network access for one-time weight download
- 50-probe fixture from arc 008 Phase 004
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

To revert:

1. `git revert <commit-sha>` for the cross-encoder.ts change + env file change
2. Restart sidecar (will resume serving the previously-configured model)
3. The bge-v2-m3 weights stay on disk; they're harmless and reusable if Phase 3 ever revisits this model as a fine-tune base

No data migration; the spec-memory index doesn't depend on which reranker is configured.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:dispatch -->
## 8. DISPATCH (cli-codex gpt-5.5 high fast)

**Pre-flight:** main agent reads `.opencode/skills/cli-codex/SKILL.md` first.

**Dispatch prompt (copy-paste verbatim):**

```text
SCOPE: spec packet 011/002-bge-v2-m3-trial. Execute Phases A-D per plan.md. Phase 1 (011/001) MUST be Complete with OFF_DEFICIENT verdict before this dispatch fires.

GATE 3: D) Skip — packet already exists; this dispatch fills evidence + may patch sidecar config + cross-encoder.ts

ALLOWED WRITE PATHS:
- 011/002-bge-v2-m3-trial/implementation-summary.md (§Benchmark Results, §Verdict, §Commit Handoff)
- 011/002-bge-v2-m3-trial/evidence/
- .opencode/skills/system-rerank-sidecar/.env* (allowlist + revision pin)
- .opencode/skills/system-spec-kit/mcp_server/lib/search/cross-encoder.ts (local provider model, ONLY if Phase D PROMOTE)
- 011-spec-memory-rerank-decision-arc/spec.md (phase-map status update)

DO NOT TOUCH: other rerank packets, cocoindex side (rerankers/reranker.py), Qwen or ms-marco config rows (additions only)

NETWORK: required for HF model download. codex exec must run with -c sandbox_workspace_write.network_access=true

DELIVERABLES:
1. Sidecar /health returns 200 with bge-v2-m3 in allowlist; /warmup load time + RSS recorded
2. Direct /rerank smoke-test output captured
3. evidence/bge-v2-m3-bench-<date>.json with per-probe results
4. implementation-summary.md filled (targets table from §Scope, §Verdict, §Commit Handoff)
5. If PROMOTE: cross-encoder.ts patched + live memory_search shows cross_encoder_rerank signal
6. Strict-validate exit 0 on this packet + arc parent

VERIFICATION:
- bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <packet> --strict
- bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <arc-parent> --strict

COMMIT HANDOFF: do NOT commit. Cli-codex sandbox blocks .git/index.lock. List exact paths in implementation-summary §Commit Handoff. Main agent commits on behalf.
```

**Invocation shape:**

```bash
codex exec \
  --model gpt-5.5 \
  --sandbox workspace-write \
  -c sandbox_workspace_write.network_access=true \
  -c model_reasoning_effort="high" \
  -c service_tier="fast" \
  -c sandbox_workspace_write.writable_roots='["/path/to/Public","/Users/michelkerkmeester/.cache/huggingface"]' \
  --output-last-message /tmp/codex-002-output.txt \
  --prompt-file /tmp/codex-002-prompt.txt
```

Network access enabled (HF download). HF cache writable so the sandbox can write the downloaded weights.
<!-- /ANCHOR:dispatch -->
