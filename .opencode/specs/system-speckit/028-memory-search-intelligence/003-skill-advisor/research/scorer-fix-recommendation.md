---
title: "Advisor-Scorer Fix Recommendation — Saturation-Class Root Fix"
description: "Synthesis of two focused GPT-5.5 research rounds (diagnosis + fix design) on the advisor scorer: the explicit-lane penalty-saturation class, executor-delegation misrouting, live TS/Python parity regressions, graph-causal order bug, eval-gate looseness, and semantic_shadow ablation — with a leverage-ordered implementation sequence."
status: research-complete
created: 2026-07-05
---

# Advisor-Scorer Fix Recommendation — rounds 1+2 synthesis

**Method:** two focused GPT-5.5-fast research rounds. Round 1 = diagnosis (6 dimensions, 4 P0 / 18 P1 / 3 P2). Round 2 = fix design for the same 6 areas (6 P0 / 18 P1 / 1 P2). R1↔R2 pair 1:1, so each problem has a designed remedy.

**Verdict:** the shipped `-3.0` cli-opencode explicit-lane widening (`ea689d84e0`) is a **band-aid on an architectural class**, not a fix. Penalties are pre-clamp additive offsets (`Math.min(score,1)`), and fusion floors net-negative lane matches to zero (`Math.max(existing.rawScore, match.score)`) — so a penalty can never survive as durable negative evidence, and any saturating positive support erases it. Six workstreams follow, leverage-ordered.

---

## Workstream 1 — Explicit-lane demotion channel  [P0, ROOT]

**Problem (R1 explicit-saturation):** the saturation class extends well past cli-opencode — verbose cli-opencode + sk-code surface tokens, colon/deep-review framings (penalty −0.6 vs +0.85/+1/+3 support), webflow-cms (−0.5), benchmark disambiguators (−0.4/−0.6). Every one clamps to 1 when ordinary tokens re-saturate.
Evidence: `lib/scorer/lanes/explicit.ts:47,50,53,62,72,73,115,138,159,280,302,316,318,355`; `lib/scorer/fusion.ts` (the `Math.max` floor).

**Fix (R2 root-fix-design):** stop treating disambiguation as an ordinary pre-clamp offset. Two viable designs:
- **(A) Post-cap demotion (minimal risk, recommended default):** `score = Math.max(0, Math.min(supportScore, 1) + demotionScore)` — cap positive support FIRST, then subtract demotion, so a −3 can't be absorbed by clamp headroom.
- **(B) Separate disambiguation channel** (if telemetry/RRF/tuning need first-class negative evidence): extend `LaneMatchIndexEntry` + contribution assembly with `disambiguationPenalty`; subtract it from effective raw score, weighted score, RRF sort adjustment, and confidence/directScore inputs.
Ship a verbose-saturation fixture set alongside (cli-opencode, colon review loop, webflow CMS, benchmark-mode) asserting both `topSkill` and the demoted candidate's effective explicit contribution.

**Recommendation:** start with (A); escalate to (B) only if the scorer needs to *rank by* negative evidence rather than just suppress.

## Workstream 2 — Metadata-driven executor-delegation resolver  [P0]

**Problem (R1 cli-opencode-class):** the `-3.0` rule is a one-off OpenCode regex, narrow, and runs before later matches re-saturate sk-code. The class extends to **cli-claude-code, minimax, kimi** (active executor triggers) and archived **codex** — all uncovered in TS. Python already post-adjusts `use/delegate to opencode`; TS has no equivalent.

**Fix (R2 executor-resolver-design):** replace the inline regex with a shared `lib/scorer/executor-delegation.ts` resolver that:
1. Detects delegation verbs (`use`, `delegate to`, `ask`, `run`, `invoke`, `second opinion`) near an executor alias.
2. Builds its alias table **from metadata, not hardcode**: every `graph-metadata.json` with `family:'cli'`/`category:'cli-orchestrator'` (skill_id, intent_signals, derived.trigger_phrases/key_topics/entities) + sk-prompt-models `model_profiles.json` (models[].id, executors[].{executor,provider,quota_pool}) — MiniMax/Kimi resolve to their primary executor (cli-opencode). Load z_archive cli metadata as `lifecycleStatus:'archived'` (suppress sk-code fallback + abstain/redirect on "use codex", never default-routable).
3. Applies a **post-fusion routing override** (must be post-fusion because explicit penalties are pre-clamp): after ranked recommendations are built, lift the resolved active executor to confidence ≥0.95 and suppress sk-code re-saturation.
Shared executor-delegation fixture consumed by both TS native tests and Python parity.

## Workstream 3 — Live TS↔Python parity regressions  [P0, BLOCKING]

**Problem:** live 193-row run is FAILING — pythonCorrect=104, tsCorrect=145/0.7513, **regressions=5**, holdout 28/40; contract expects regressions=0. R2 confirms all 5 are real TS ranking gaps:

| ID | prompt gist | gold | TS wrong→ | fix class |
|---|---|---|---|---|
| rr-iter2-016 | "find code that handles `resume deep review`" | system-code-graph | deep-loop-workflows | code-discovery primary intent outranks embedded deep-loop phrase |
| rr-iter2-060 | "investigate deep-research state **with code graph context**" | system-code-graph | deep-loop-workflows | "code graph context" = system-code-graph primary intent |
| rr-iter3-093 | "audit whether the corpus has duplicated prompt intents" | sk-code | sk-prompt | corpus-evaluation audit ≠ prompt-improvement |
| rr-iter3-100 | "audit the prompt IDs, confirm stable" | sk-code | sk-prompt | prompt-ID/corpus stability audit rule + refresh stale ledger rows |
| rr-iter3-104 | "audit whether corpus stresses connector-routing enough" | sk-code | system-spec-kit | split corpus *scoring/audit* (sk-code) from corpus *maintenance* (spec-kit) |

**Fix:** blocking until TS preserves them OR the divergence ledger is explicitly updated with reviewed accepted regressions. Also: rename the legacy "197-prompt" suite to the real 193; keep force-local parity in CI (native-first delegation can mask fallback drift); evaluate parity against SQLite/source metadata, not diagnostic `skill-graph.json`.

## Workstream 4 — Graph-causal visited-guard order bug  [P1, CONFIRMED]

In graph-causal BFS, `seen.add(edge.targetId)` fires **before** multiplier validation, threshold filtering, and score accumulation — an earlier weak/negative edge to a target suppresses a later stronger edge to the same target. Repro: seed α=1; α→β conflicts_with w=1 and α→β enhances w=0.9; first-visited wins regardless of strength. Evidence: `lib/scorer/lanes/graph-causal.ts:84-94,103-114`.
**Fix:** score-first, traversal-second — compute signed contributions before any visited guard; accumulate positive/conflict evidence per target; replace boolean `seen` with `bestPositiveStrengthByTarget` for queue expansion.

## Workstream 5 — Eval hardening (gates too loose)  [P1]

Aggregate gates pass major regressions: full ≥0.75, holdout ≥0.725, parity floors tsCorrect≥95/holdout≥17 on 193 rows. Ambiguity slice is one synthetic dead-tie, yet **83/193** prompts sit in the near-tie window and explicit_author dominates **174/193**. Holdout is non-independent (every-5th-row, duplicated impl).
**Fix:** empirical ambiguity slice from top-2 margins (frozen `ambiguity-prompts.jsonl`); schema-enforce `bucket`/`source_type`/`eval_bucket` with `slices.buckets.{review,memory_save,delegation}` minN + top1 thresholds; promote delegation to a named regression bucket; ratcheted `scorer-eval-baseline.json` instead of fixed floors; frozen independent `holdout-prompts.jsonl` (≥60 rows or 25%, prompt-family-deduped).

## Workstream 6 — semantic_shadow: prove-or-freeze  [P1]

semantic_shadow is LIVE at weight 0.05 but keep-vs-drop value is **unproven** — both seeded sweep reports skipped on a missing embedding provider; lexical +0.05 flips 4 routes incl. memory-save + read-only review.
**Fix:** keep-low/no-increase until evidence. Restore one deterministic embedding path (local Ollama manifest → repaired hf-local/onnxruntime-common → pinned OpenAI/Voyage); run a paired 193-row ablation (5-lane baseline vs `disabledLanes:['semantic_shadow']`) + holdout, identical projection/thresholds/providerModelId; pin providerModelId in the report; fail on skip.
**Robustness guard (ALL weight changes):** no promotion unless advisor_validate passes, per-skill regressions = 0, memory-save + read-only review buckets = 0 regressions, wrong near-ties don't increase, UNKNOWN count doesn't rise.

---

## Sequencing refinements (post-synthesis review)

1. **WS3 vs WS1 tension.** Four of the five proposed regression fixes are *new special-case intent rules in the explicit lane* — more pre-clamp offsets, exactly the pattern WS1 exists to kill. Sharper order: **ledger the 5 divergences as reviewed-accepted → build WS1's post-cap demotion → re-run the corpus and count how many of the 5 self-resolve** under the new arithmetic before hand-writing rules for the rest. Otherwise WS1 inherits a fresh migration burden.
2. **The two-axis sk-code hub aggravates the saturation class.** Post-restructure, webflow/opencode/animation vocabulary all legitimately boosts the single sk-code identity — verbose executor prompts have *more* saturating fuel than when the research corpus was captured. Raises WS1's urgency.
3. **Deep-loop canon alignment will move advisor evidence.** Two of the five regressions misroute *to* deep-loop-workflows; the pending deep-loop conformance work adds description.json + hub-router.json + registry fields that the projection can pick up. Drift-guard stays green (advisorRouting.* untouched) but green ≠ unchanged evidence — **re-run the 193-row corpus after that lands and re-baseline before comparing scorer numbers.**

## Recommended implementation order

1. WS3 via ledger (unblock the parity gate honestly), 2. WS1 root demotion channel, 3. corpus re-run → hand-write rules only for regressions that survive, 4. WS2 executor resolver (builds on WS1 machinery), 5. WS4 graph-causal (isolated, confirmed), 6. WS5 eval hardening (locks everything in; prerequisite for any weight tuning), 7. WS6 semantic ablation (gated behind WS5's harness).

## Confirmed vs inferred

- **Confirmed (file:line, R1+R2 agree):** pre-clamp offset + fusion `Math.max` floor (WS1); one-off OpenCode regex + uncovered executors (WS2); graph-causal visited-before-score (WS4, independently CONFIRMED with repro); loose gates + non-independent holdout (WS5).
- **Confirmed live-run:** the 5 parity regressions with named IDs + gold/actual (WS3).
- **Inferred (a run is the confirmation):** semantic_shadow lift is unknown — the WS6 ablation IS the experiment; regression counts may shift as the shared corpus/ledger is edited concurrently.

## Scope note

Landing any of this is a **new system-skill-advisor implementation packet** — this document is its design input. At research time, 7 of 8 then-current advisor-suite failures were other sessions' in-flight work (concurrent skill_advisor.py / skill-graph.json / aliases.ts edits) — re-baseline before starting.
