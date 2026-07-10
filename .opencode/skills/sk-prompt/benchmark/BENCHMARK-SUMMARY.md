# sk-prompt Benchmark Summary

Rigorous Lane-C skill-benchmark pass over the merged `sk-prompt` parent hub, run 2026-07-09 as a post-merge verification (packet `skilled-agent-orchestration/124-sk-prompt-parent` is complete; this is a deeper follow-on check, not new packet scope). Invocations verified against the deep-improvement skill's own authoritative docs: `references/skill_benchmark/{operator_guide,scoring_contract,routing_optimization}.md`.

## Hub level (`sk-prompt`)

| Run | Mode | Verdict | D1-intra | D2 | D3 | D5 | Notes |
|-----|------|---------|----------|----|----|----|-------|
| `router-final/` | Mode A (deterministic router-replay, `--advisor-mode=python` included per the operator guide's documented invocation) | PASS 100/100 | 100 | 100 | unscored | 100 | Canonical artifact. |
| `live-final/` | Mode B (live, real `openai/gpt-5.5-fast --variant high` dispatch, `GRADER_MODEL` defaults to `claude-sonnet-4-5` matching the guide's canonical command) | PASS 100/100 | 100 | 100 | unscored | 100 | Real dispatch confirmed via captured model responses (`liveEvidence.responseHead`), not a router-replay fallback. |

**D1-inter (advisor)**: unscored in both runs, confirmed with `--advisor-mode=python` explicitly passed (not just omitted) — the hub playbook (`SP-001..004`) is entirely `classKind: routing`, and `run-skill-benchmark.cjs`'s advisor-probe only fires for `classKind: advisor` scenarios (an `SA-*`-id or "advisor top-1" pass-criteria scenario), regardless of the flag. Would need a dedicated advisor-probe scenario authored as a follow-up; out of scope for this pass.

**D4 (hallucination, weighted)**: unscored — needs the full skill-on/off hallucination ablation, a separate instrument from D4-R task-outcome below.

**D4 task-outcome (advisory, real grader, not in the weighted aggregate)**: **62/100** average across 4 scenarios, real skill-on vs skill-off dispatch + real grading (`--grader-mode real`):

| Scenario | on | off | delta score |
|----------|----|----|------|
| SP-001 (default-mode routing) | 0.31 | 0.48 | 41.5 — **inverted**, on scored below off |
| SP-002 (DeepSeek named-model query) | 0.79 | 0.24 | 77.5 |
| SP-003 (short-mode) | 0.89 | 0.42 | 73.5 |
| SP-004 (GLM-5.2 named-model query) | 0.81 | 0.78 | 51.5 — near-wash |

SP-001's inversion is a single-sample ("approximate" attribution) result from an LLM grader, not a re-sampled or weighted signal — treat as noise unless it reproduces. Worth a re-run with n>1 before treating as a real regression.

## Individual packets (`prompt-improve`, `prompt-models`)

**Correction from an earlier draft of this summary**: this is a real, named conformance gap, not an inherent architectural fact. `deep-improvement/references/skill_benchmark/routing_optimization.md` §6 (Parent-Hub Routing) states the doctrine's actual expectation plainly: *"Re-run Lane C on both the child and the parent. The child should pass its own routing contract."* `sk-code`'s children (`code-review`, `code-quality`, `code-webflow`, `code-opencode`) meet that bar because each one was authored with its own `INTENT_SIGNALS`/`RESOURCE_MAP` block — that's why they benchmark individually with real Mode-A/Mode-B scores. `sk-prompt`'s two children do not meet it yet:

- **`prompt-improve`**: its in-skill router is `INTENT_MODEL`, with per-keyword weighted tuples (`[("rcaf", 5), ("framework", 4), ...]`) — a pre-canon shape never migrated to `INTENT_SIGNALS`.
- **`prompt-models`**: routes by direct model-alias lookup (`MODEL_ALIASES` → `routing_key`), not intent classification — a genuinely different routing pattern (its own `SKILL.md` names it "Pattern 3: model id is the runtime key"), which may warrant a different Lane-C measurement approach rather than a forced `INTENT_SIGNALS` retrofit.

The 124-sk-prompt-parent merge correctly left this alone — its own scope explicitly excluded "any redesign of sk-prompt's 7-framework/DEPTH/CLEAR internals" and scoped the program to relocation/re-registration, not behavior change. `run-skill-benchmark.cjs`'s own target-eligibility doc confirms the resulting `NO-SCENARIOS`/degraded-D5 result when pointed at either packet root is the *documented, expected* behavior for a non-`INTENT_SIGNALS` router ("a real signal... not a harness bug"), not a benchmarking mistake — but closing the gap (migrating to `INTENT_SIGNALS`) is real, deferred work, not something to wave off as by-design forever.

Verified what's actually checkable today instead of forcing a number:
1. **`parent-skill-check.cjs --strict`**: 0 warnings (structural wiring, both packets).
2. **`RESOURCE_MAP` / `DEFAULT_RESOURCE` path audit** (every path both packets can route to, checked against disk): `prompt-improve` 11/11 resolve, `prompt-models` 1/1 resolves. Zero dead references.
3. **Hub-level scenario coverage**: `SP-001`/`SP-003` route to `prompt-improve`, `SP-002`/`SP-004` route to `prompt-models` by named model — both packets are directly exercised by the hub's Mode-A and Mode-B runs above, which is the realistic path (advisor → hub → packet), not a synthetic standalone probe.

## Known follow-ups (not blocking)

1. **Migrate `prompt-improve`'s `INTENT_MODEL` to a canon `INTENT_SIGNALS` block** (or an explicitly-justified documented exception) so it can pass its own routing contract per `routing_optimization.md` §6 — the real fix for individual-packet benchmarking, not a benchmark-tooling workaround.
2. **Decide `prompt-models`' Lane-C measurement path** — either an entity/alias-routing extension to the engine, or an explicit doctrine exception for alias-based routers (raise as a cross-hub question, not a sk-prompt-only one).
3. Author an `SA-*` advisor-probe scenario to unlock D1-inter scoring at the hub level.
4. Author a full D4 hallucination ablation pass (distinct from the D4-R task-outcome instrument already run).
5. Re-sample SP-001's D4 task-outcome ablation (n>1) before treating the on<off inversion as signal.
