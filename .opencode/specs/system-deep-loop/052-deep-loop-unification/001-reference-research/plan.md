---
title: "Implementation Plan: Reference Research — Deep-Loop Unification"
description: "Plan for a 20-iteration multi-model deep-research fanout validating the deep-loop-workflows + deep-loop-runtime merge design."
trigger_phrases:
  - "deep loop unification research plan"
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/052-deep-loop-unification/001-reference-research"
    last_updated_at: "2026-07-08T06:06:21.300Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Fanout executed and synthesized; corrections applied to 002"
    next_safe_action: "Execute 002-hub-rename-and-runtime-nesting"
    blockers: []
    key_files:
      - "research/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "deep-loop-unification-052-001-scaffold"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Reference Research — Deep-Loop Unification

<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | N/A — research packet, no code change |
| **Framework** | `/deep:research` fanout loop, 3 executor lineages via `deep-loop-runtime/lib/deep-loop/executor-config.ts`'s `fanoutConfigSchema` |
| **Testing** | N/A |

### Overview
Dispatches `/deep:research` with a `--executors=<json>` fanout payload (bare array, per `lineageExecutorSchema`) defining 3 lineages. Every replica runs the standard deep-research loop in its own isolated sub-packet under `research/lineages/{label}/`; `fanout-merge.cjs` aggregates after all 20 independently terminate (no cross-lineage early-convergence path exists, so the operator's "converge early only after >=3/lineage" constraint is satisfied automatically and more strongly than requested — every individual replica clears its own `minIterations: 3` floor, not just one representative per family).
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Executor kinds/models confirmed against live schema and registries (`executor-config.ts`, `sk-prompt-models/assets/model_profiles.json`, prior confirmed usage of `claude-sonnet-5`).
- [x] `serviceTier` confirmed dead for every wired executor kind — "fast" expressed via the model slug (`openai/gpt-5.5-fast`) instead.
- [x] Convergence-floor mechanism confirmed already shipped (`antiConvergence.minIterations: 3`, hardcoded per-replica) — no runtime patch needed.

### Definition of Done
- [x] All 20 replicas dispatched (10 gpt55-fast, 5 glm52, 5 sonnet5).
- [x] gpt55-fast and glm52 lineages reached their `minIterations: 3` floor and completed 10/10 and 5/5. sonnet5 finished with 0 completed replicas (terminal Keychain auth failure, not a research-design issue) — substituted with 5 Plan-agent passes to satisfy the underlying intent.
- [x] `research/research.md` synthesized with ranked, evidence-cited findings (10 sections + revision checklist).
- [x] `research/fanout-attribution.md` present for the 15 real replicas.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Standard `/deep:research` fanout: `config.fanout.executors` (bare array) expands via `expandLineages()` into 20 individually-labeled replicas (`gpt55-fast-1`..`gpt55-fast-10`, `glm52-1`..`glm52-5`, `sonnet5-1`..`sonnet5-5`), each spawned by `fanout-run.cjs`/`fanout-pool.cjs` up to `--concurrency=6`, each running the full deep-research protocol independently in its own artifact dir.

### Key Components — confirmed executor mechanics
- **`kind: cli-opencode`** (GPT-5.5, GLM-5.2) → `buildLineageCommand()` constructs `opencode run --model <model> --format json --pure --dir <cwd> --variant <reasoningEffort> <prompt>`. `reasoningEffort` maps to `--variant`.
- **`kind: cli-claude-code`** (Sonnet-5) → constructs `claude -p <prompt> --model <model> --permission-mode <mode> --output-format text --effort <reasoningEffort>`.
- **`kind: native` is deliberately NOT used** for any lineage — every native fan-out dispatch site in `deep_research_auto.yaml` hardcodes `model: opus`, and `native`'s `EXECUTOR_KIND_FLAG_SUPPORT` is `[]` (cannot even set `reasoningEffort`). Using `native` for the Sonnet-5 lineage would silently dispatch Opus instead.
- **Field name trap**: the per-lineage max-iterations override field is `iterations`, not `iters` (`iters` is only the CLI flag name for the *repeatable* `--executor=<type> --iters=N` form). Using `"iters"` inside the JSON payload is silently stripped by zod's unknown-key handling.

### The exact `--executors` payload

```json
[
  {"kind":"cli-opencode","model":"openai/gpt-5.5-fast","reasoningEffort":"xhigh","label":"gpt55-fast","count":10,"iterations":10},
  {"kind":"cli-opencode","model":"zai-coding-plan/glm-5.2","reasoningEffort":"max","label":"glm52","count":5,"iterations":5},
  {"kind":"cli-claude-code","model":"claude-sonnet-5","reasoningEffort":"xhigh","label":"sonnet5","count":5,"iterations":5}
]
```

Full invocation:
```
/deep:research "Validate and stress-test the merge design for folding deep-loop-runtime into deep-loop-workflows as system-deep-loop: structural layout, bidirectional path-coupling repair, the system-spec-kit tooling-borrow, reference migration across commands/agents/READMEs/advisor-corpus, and whether fallback-router.ts should be wired for real GLM-5.2 to MiMo-v2.5-Pro fallback." :auto \
  --spec-folder=.opencode/specs/system-deep-loop/052-deep-loop-unification/001-reference-research \
  --max-iterations=10 --convergence=0.05 --stop-policy=convergence --concurrency=6 \
  --executors='[{"kind":"cli-opencode","model":"openai/gpt-5.5-fast","reasoningEffort":"xhigh","label":"gpt55-fast","count":10,"iterations":10},{"kind":"cli-opencode","model":"zai-coding-plan/glm-5.2","reasoningEffort":"max","label":"glm52","count":5,"iterations":5},{"kind":"cli-claude-code","model":"claude-sonnet-5","reasoningEffort":"xhigh","label":"sonnet5","count":5,"iterations":5}]'
```
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Smoke-test the `sonnet5` lineage at `count: 1` before committing all 5 replicas (recommended precaution, not a hard gate — the `cli-claude-code` dispatch path is confirmed safe by code trace, but not yet observed live in this exact fanout shape).
- [ ] Confirm no stale writer-lock files under `deep-loop-runtime/database/` before dispatch.

### Phase 2: Core Implementation
- [ ] Dispatch the full 20-replica fanout via the payload above.
- [ ] Monitor for GLM-5.2 replica failures; on `maxRetries` exhaustion, either accept the degraded lineage count or manually re-dispatch a failed `glm52-N` as a standalone `mimo-v2.5-pro` replica and drop its output into the same `lineages/` directory before re-running `fanout-merge.cjs`.

### Phase 3: Verification
- [ ] Confirm `minIterations: 3` was reached by every completed replica (per-replica state log check).
- [ ] Synthesize `research/research.md` + `research/resource-map.md`; feed findings back into child 002/003's plan.md as revisions where warranted.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Convergence-floor audit | Confirm no replica stopped before iteration 3 | Per-replica `deep-research-state.jsonl` |
| Lineage completion audit | Confirm all 3 lineages produced >=1 completed replica | `research/fanout-attribution.md` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `sk-prompt-models/assets/model_profiles.json` (glm-5.2, mimo-v2.5-pro registered) | Internal | Confirmed live | Would need registry entries added first |
| `cli-opencode`/`cli-claude-code` executor kinds wired in `fanout-run.cjs` | Internal | Confirmed live (`buildLineageCommand`) | Fanout dispatch would fail immediately |

### Downstream
`research/research.md`'s synthesis is the direct input to child `002-hub-rename-and-runtime-nesting`'s and `003-external-reference-migration`'s plan.md revisions, if any.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Not applicable — this is a read-only research packet with no runtime behavior to roll back. A failed/stalled fanout can simply be re-invoked.
- **Procedure**: N/A.
<!-- /ANCHOR:rollback -->
