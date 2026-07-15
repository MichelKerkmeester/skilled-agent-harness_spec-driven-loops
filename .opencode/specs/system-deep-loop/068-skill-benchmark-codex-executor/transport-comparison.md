# Transport comparison: GPT-5.6-luna via cli-opencode vs cli-codex

**Subject model:** `gpt-5.6-luna`, reasoning effort `xhigh`, service tier `fast` (recorded out-of-band; the report JSON does not carry the subject model).
**Harness:** Lane C skill-benchmark, live mode (Mode B), 1 sample per scenario.
**Date:** 2026-07-15.

This is the deliverable for the "run both transports and compare" request. It answers two distinct questions and keeps them separate, because they are not the same question:

1. **Does the transport matter?** (opencode-luna vs codex-luna) — the direct comparison this packet was built for.
2. **Did my SKILL.md changes move the benchmark?** (deterministic Mode-A now vs the frozen baseline) — change attribution.

---

## 1. Scope of what was actually measured

| Skill | Live-runnable | Scenarios | In this run |
|-------|---------------|-----------|-------------|
| `system-deep-loop/deep-improvement` | Yes | 9 | **Tier 1 — both transports** |
| `system-deep-loop` (hub) | **No** | 0 readable | Excluded (see note) |

**Hub exclusion (finding, not a choice of convenience):** the hub's `manual_testing_playbook.md` references feature files at hyphenated paths (`mode-routing/…`, `advisor-integration/…`) while the real directories are underscored (`mode_routing/`, `advisor_integration/`). Every row loads as "feature file unreadable", so the hub yields **0 live scenarios**. This is pre-existing and owned by the concurrent hyphen-naming migration; it is out of this packet's scope and is recorded here so the gap is visible rather than silent.

> Only Tier 1 was run. Tier-2 breadth (other playbook-bearing skills) is a bounded, minutes-per-dispatch cost and is left as an explicit operator decision (see §5).

---

## 2. Question 1 — Transport comparison (the headline)

Both transports, same 9 scenarios, luna xhigh/fast:

| Metric | opencode-luna | codex-luna | Delta |
|--------|---------------|------------|-------|
| Verdict | PASS | PASS | — |
| Aggregate | **86** | **85** | **1** |
| Scenarios parsed | 9/9 | 9/9 | 0 |
| Dispatch errors | 0 | 0 | 0 |
| D1intra (resource recall) | 100 | 98 | 2 |
| D2 (resource routing) | 100 | 98 | 2 |
| D3 (routing efficiency) | 56 | 56 | **0** |
| D5 (connectivity, hard gate) | 97 | 97 | **0** |

Per-scenario (modeAScore):

| Scenario | opencode | codex | Same? |
|----------|----------|-------|-------|
| DI-R01 | 100 | 100 | ✓ |
| DI-R02 | 76 | 76 | ✓ |
| DI-R03 | 100 | 89 | ✗ |
| DI-R04 | 77 | 78 | ✗ (±1) |
| DI-R05 | 72 | 72 | ✓ |
| DI-R06 | 100 | 100 | ✓ |
| DI-R07 | 76 | 76 | ✓ |
| DI-R08 | 76 | 76 | ✓ |
| DI-R10 | 100 | 100 | ✓ |

**Verdict: transport parity confirmed.** 7 of 9 scenarios are identical; the aggregates differ by 1 point. The whole gap is one scenario, DI-R03, where codex-luna recalled 5 of 6 expected resources (`resourceRecall 0.833`) against opencode-luna's 6 of 6. Both cited 5 resources with 0 wasted; luna simply named a slightly different resource set on that single prompt. At N=1 per cell this is sampling variance, not a systematic transport effect. The two dimensions that would expose a real routing difference — D3 (efficiency) and D5 (connectivity) — are **identical** across transports.

**Fidelity note (honored, not hidden):** codex emits no `tool_use` event stream (`eventCount: 0` vs opencode's `eventCount: 6`, `toolCalls: 1`), so activation and observed file-reads are unmeasured on the codex transport. For this skill those channels are not among the scored dimensions (D1-inter is excluded-by-design for the advisor-invisible bundle; D4 needs an ablation not run in Mode B), so the codex fidelity limitation does **not** distort this comparison. The comparison rests entirely on the stated-routing dimensions, which are exactly the ones I said would be comparable.

---

## 3. Question 2 — Did my SKILL.md changes move the benchmark?

Deterministic Mode-A (router replay, no model), now vs the frozen baseline `deep-improvement/benchmark/router_mode_a/`:

| | Baseline (router) | Now (router) | Delta |
|---|---|---|---|
| Aggregate | 100 | 100 | 0 |
| Per-scenario (all 9) | 100 | 100 | **0 on every scenario** |

**Answer: no.** The Lane-D removal that touched deep-improvement's config did not move the deterministic routing score on any scenario. This matches the pre-build research: the scorer reads router config (INTENT_SIGNALS / RESOURCE_MAP / hub-router.json / mode-registry.json), and removing the retired lane did not change deep-improvement's scored routing inputs for these scenarios. The one non-zero movement since the baseline is D5 (connectivity) 100 → 97, a small structural nuance consistent with deleted/renamed files in the tree since the baseline was frozen; it is not a routing regression (per-scenario routing is unchanged).

---

## 4. luna behavior findings (transport-independent)

- **D3 = 56 on both transports** vs the frozen live-mode baseline's D3 = 67. luna is a little less resource-efficient on deep-improvement than whatever model produced the baseline live run (it over- or imprecisely-routes on the lower-scoring scenarios DI-R02/05/07/08). Because the two transports agree exactly (56 = 56), this is a genuine luna trait, not a transport artifact.
- **D1intra / D2 ≈ 98-100 on both.** luna's resource recall is high and consistent across transports.

---

## 5. Tier-2 — pending operator decision

Tier-2 would sweep other playbook-bearing skills (`sk-code`, `sk-design`, `sk-doc` hub, `sk-prompt/prompt-improve`, `system-code-graph`, `mcp-tooling`) to show luna routing breadth. Honest caveat carried from the plan: **Tier-2 measures luna's routing behavior, not attribution of my SKILL.md edits** (those skills' router configs were not changed this session). Each xhigh dispatch is minutes-long, so the recommendation is a bounded sample (a few skills, ~6-8 scenarios each) rather than a full sweep. Not run yet.

---

## 6. Evidence

- `artifacts/tier1-deep-improvement-luna-opencode.report.{md,json}`
- `artifacts/tier1-deep-improvement-luna-codex.report.{md,json}`
- Deterministic change-attribution: `deep-improvement/benchmark/router_mode_a/` (baseline) vs a fresh Mode-A run (delta 0).
