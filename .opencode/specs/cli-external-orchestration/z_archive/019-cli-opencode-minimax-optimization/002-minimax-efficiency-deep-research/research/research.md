# Deep Research: MiniMax 2.7 efficiency via cli-opencode direct API

> Canonical synthesis output. Workflow-owned. Compiled from 10 iterations (cli-codex `gpt-5.5`, reasoning high, service tier fast). Stop reason: maxIterationsReached.

## 1. Executive Summary

MiniMax 2.7 should be operated through cli-opencode as a **large-context (204,800-token), native-tool-using, separate-quota-pool (`minimax-api`) direct provider** that is selected explicitly and never substituted silently. The work to make best use of it is almost entirely **metadata + documentation + routing guidance that extends the existing 114 small-model infrastructure** — there is no need for MiniMax-specific runtime logic. Phase 001 already wired the provider and a registry stub; the follow-on implementation packet should refine that stub (set the real context window, budget row, routing table) and defer a small set of facts that genuinely require a live `MINIMAX_API_KEY`.

## 2. Research Question & Scope

How can we improve/update `sk-prompt-models` and `cli-opencode` to make best use and maximize the efficiency of MiniMax 2.7 dispatched through cli-opencode via the direct MiniMax.io API provider — extending (not rebuilding) the 114 infrastructure, and outputting concrete file-level deltas. Out of scope: implementing the deltas, the opencode-go gateway path, and live auth setup.

## 3. Methodology

10 iterations, each a fresh cli-codex `gpt-5.5` (high/fast) dispatch over externalized JSONL+markdown state. Iterations 1–5 answered the five core questions; iterations 6–10 hardened the answers against the actual post-phase-001 files and produced patch-ready, confidence-scored deltas. newInfoRatio declined monotonically (0.92 → 0.12), confirming saturation.

## 4. Key Findings (summary)

- **F1**: MiniMax-2.7 = 204,800-token context, native tool use with interleaved-thinking continuity, pay-as-you-go pricing, RPM/TPM rate limits. High confidence on official API facts. [SOURCE: research/iterations/iteration-001.md]
- **F2**: Budget tuple = 204,800 context → **143,360 active budget** under 114's existing 70% rule, preserving complete active tool-call/tool-result spans. [SOURCE: research/iterations/iteration-002.md] [SOURCE: .opencode/skills/cli-devin/assets/per-model-budgets.json]
- **F3**: Prompt quality reuses RCAF/CLEAR + existing budget-awareness; **omit `--variant` by default** until a live ablation proves MiniMax honors it. [SOURCE: research/iterations/iteration-003.md] [SOURCE: research/iterations/iteration-007.md]
- **F4**: `minimax-api` is its own quota pool with `fallback_target: null` (fail-fast, like `qwen3.6`); permissions + output-verification stay provider-neutral — no MiniMax-specific code. [SOURCE: research/iterations/iteration-004.md] [SOURCE: .opencode/skills/sk-prompt/assets/model-profiles.json]
- **F5**: Route to MiniMax for large retained evidence, active tool-round continuity, and quota isolation; DeepSeek/Qwen/Kimi/GLM remain better for their established shapes. [SOURCE: research/iterations/iteration-005.md] [SOURCE: research/iterations/iteration-008.md]

## 5. Q1 — MiniMax 2.7 API characteristics

Context window 204,800 tokens; native tool calling with interleaved thinking continuity; pay-as-you-go pricing with token-plan quotas and RPM/TPM limits; documented speed classes. Residuals requiring runtime: exact accepted model-slug casing, real `--variant` translation behavior, observed latency, live pricing. The cli-opencode provider and registry id `minimax/minimax-2.7` from phase 001 are consistent with the static docs.

## 6. Q2 — Context-budget tuple & output-verification recipe

Budget: reuse `cli-devin/assets/per-model-budgets.json` schema with `context_length: 204800`, `max_budget_pct: 70` → 143,360 active tokens, `working_memory_tokens: 500`, `summary_threshold_lines: 200`, standard truncation marker, and a note to preserve complete active tool-call/tool-result spans (interleaved-thinking continuity). Output-verification: reuse 114's 4-stage pipeline (compile → execute → smoke-test → lint) unchanged; it is provider-neutral and needs no MiniMax fork.

## 7. Q3 — Prompt-quality / `--variant` policy

Reuse the existing RCAF/CLEAR prompt-quality patterns and `cli_prompt_quality_card.md` budget-awareness guidance. For `--variant`: **omit by default**. Do not claim `--variant high` changes MiniMax reasoning until a live ablation (paired runs with/without `--variant high`, measuring reasoning-trace length, tool-call count, latency, output quality) proves the mapping. An optional manual ablation playbook is specified for that promotion.

## 8. Q4 — Quota-pool, fallback, permissions

`minimax-api` is a distinct pool; `fallback_target: null` (fail-fast — no silent fallback from opencode-go/Cognition/DeepSeek to MiniMax, and none out of MiniMax). 114's `fallback-router.ts` already supports pool-aware, single-step, explicit-target routing — no change needed. The structured permissions matrix (`permissions-matrix.md` + `.schema.json` + `permissions-gate.ts`) applies as-is since MiniMax dispatches go through cli-opencode; no MiniMax-only permission logic.

## 9. Q5 — Routing heuristics

Prefer MiniMax-2.7 when: the task needs large retained evidence (100k+ token multi-file review), active tool-round continuity matters, or quota isolation from the Cognition/opencode-go pools is desired. Prefer DeepSeek-v4-pro for hard reasoning, Qwen3.6 for narrow cheap edits, Kimi-k2.6 for long-context via opencode-go, GLM-5.1 for structured synthesis. On an exhausted pool: fail fast and ask, never silently substitute.

## 10. Prioritized follow-on delta list (P0/P1/P2)

> For a follow-on implementation packet. All deltas are docs/metadata/schema only — no runtime code, no duplication of phase-001 edits.

**P0**
1. `sk-prompt/assets/model-profiles.json` — update the existing `minimax-2.7` object: `context_length: 204800` (keep `tool_calling: native`, `provider: minimax`, `quota_pool: minimax-api`, `fallback_target: null`); notes = large retained-evidence route, 143,360 active budget, omit `--variant` pending ablation, pay-as-you-go cost caution. *(High)*
2. `cli-devin/assets/per-model-budgets.json` — insert a `minimax-2.7` row (existing schema): `context_length: 204800`, `max_budget_pct: 70`, `working_memory_tokens: 500`, `summary_threshold_lines: 200`, preserve active tool spans. *(High — shared budget metadata, not cli-devin runtime support)*
3. `cli-opencode/references/context-budget.md` — replace the model-window table with `Context window` + `70% active budget` columns for DeepSeek/Kimi/Qwen/MiniMax; add the MiniMax trimming paragraph. *(High — documentation only)*
4. `cli-opencode/references/cli_reference.md` — change the MiniMax `--variant` row to "omit by default"; ensure only the default `opencode-go/deepseek-v4-pro` route passes `--variant high`; add a MiniMax direct-provider subsection (large evidence, quota isolation, no silent substitution, fail-fast). *(High)*

**P1**
5. `cli-opencode/SKILL.md` — under `### Model Selection`, add the MiniMax direct-provider exception + compact task-shape routing table; preserve the default route. *(High)*
6. `sk-prompt/assets/cli_prompt_quality_card.md` — replace Budget Awareness with the compact small-model routing table incl. MiniMax + fail-fast-on-exhausted-pool. *(High)*
7. `sk-prompt-models/SKILL.md` — add MiniMax-2.7 to the dispatch matrix, expand the cli-opencode ownership row to include the MiniMax.io direct provider, update the required model set. *(High — keep sentinel thin)*
8. `sk-prompt-models/references/pattern-index.md` — insert exactly three link-only MiniMax rows: context-budget adoption, direct-provider routing, prompt-quality/variant-ablation policy. *(High)*

**P2**
9. `cli-opencode/manual_testing_playbook/03--multi-provider/005-minimax-variant-ablation.md` (new, optional) — no-variant vs `--variant high` ablation recipe: three paired runs, separate stdout/stderr, timing, pass criteria. *(Medium — requires live MINIMAX_API_KEY)*

## 11. Runtime-deferred residuals (need a live `MINIMAX_API_KEY`)

- Exact accepted model slug casing/discoverability (`opencode models minimax`).
- Whether `--variant high` is accepted / ignored / rejected / mapped.
- Whether a distinct high-speed model slug exists.
- Real wall-clock latency + timeout envelope at 20k/80k/140k active prompts (`avg_iter_wall_clock_min` stays null until measured).
- Actual RPM/TPM rate-limit error shapes via `opencode run`.
- Tool-call event shape + interleaved-thinking preservation in OpenCode `--format json`.
- Current pricing/cost metadata.

## 12. Negative knowledge / constraints

- Do **not** add MiniMax-specific runtime logic — metadata, docs, routing, optional manual verification only.
- Do **not** duplicate phase-001 provider setup — refine the existing rows.
- Do **not** silently fall back to/from MiniMax — separate `minimax-api` pool, explicit-route/fail-fast.
- Do **not** default MiniMax to `--variant high` — omit until live ablation proves it.

## 13. Risks & mitigations

| Risk | Mitigation |
|------|------------|
| Cost runaway on 204,800-token contexts (pay-as-you-go) | 70% active budget cap; cost caution in registry notes; routing reserves MiniMax for genuinely large-evidence tasks |
| `minimax-api` single-path exhaustion (no fallback) | `fallback_target: null` documented; fail-fast + ask the user, never auto-substitute |
| `--variant high` silently a no-op | omit-by-default policy; promote only after ablation |
| Rate limits / hang behavior | deferred-to-runtime residual; capture real error shapes before writing troubleshooting copy |

## 14. Reusable 114 infrastructure leveraged

model-profile registry, context-budget engine (+ cli-opencode mirror), 4-stage output-verification, quota-pool fallback router, structured permissions matrix, `sk-prompt-models` pattern-index — all reused without modification; MiniMax extends them.

## 15. Open questions / next steps

Apply P0/P1 deltas in a follow-on implementation packet; add the P2 ablation playbook before any future `--variant` promotion; resolve the runtime-deferred residuals once a live key is configured.

## 16. References

<!-- ANCHOR:references -->
- Iteration files: `research/iterations/iteration-001.md` … `iteration-010.md`
- Per-iteration deltas: `research/deltas/iter-001.jsonl` … `iter-010.jsonl`
- Phase 001 (provider wiring): `../001-minimax-provider-integration/`
- 114 infrastructure: `skilled-agent-orchestration/z_archive/093-small-ai-model-optimization/`
- Key source files cited across iterations: `sk-prompt/assets/model-profiles.json`, `cli-devin/assets/per-model-budgets.json`, `cli-opencode/references/{context-budget.md,cli_reference.md}`, `cli-opencode/SKILL.md`, `sk-prompt/assets/cli_prompt_quality_card.md`, `sk-prompt-models/{SKILL.md,references/pattern-index.md}`
<!-- /ANCHOR:references -->

## 17. Convergence Report

- Stop reason: maxIterationsReached
- Total iterations: 10
- Questions answered: 5 / 5 (at patch-planning level)
- newInfoRatio trajectory: 0.92 → 0.78 → 0.64 → 0.56 → 0.50 → 0.42 → 0.36 → 0.29 → 0.21 → 0.12 (monotonic decline; saturation confirmed)
- Convergence threshold: 0.05 (rolling-average inline vote not reached by iter 10, but novelty trend + full question coverage indicate practical convergence at the cap)
- Graph-convergence gate: inert this run — agent graph-event node kinds did not match the research coverage-graph schema (QUESTION/FINDING/CLAIM/SOURCE), so the graph stayed empty and non-blocking
- Executor: cli-codex `gpt-5.5`, reasoning high, service tier fast
