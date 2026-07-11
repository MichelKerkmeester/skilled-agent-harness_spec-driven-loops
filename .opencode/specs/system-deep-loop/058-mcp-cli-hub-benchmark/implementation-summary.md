---
title: "Implementation Summary: mcp-tooling + cli-external Hub Benchmark & Router Improvements"
description: "Made the two new parent hubs (mcp-tooling, cli-external) and all five children properly benchmarkable on the Lane C smart-routing harness, then acted on the findings. Authored per-child Type-1 gold (T1 + blind-holdout T2 + T3 negative) so the children stopped returning NO-SCENARIOS; normalized mcp-figma's INTENT_MODEL tuple router with an additive INTENT_SIGNALS mirror (runtime byte-unchanged, key-sync guarded); hardened both hubs' Type-2 gold; proved genuine Mode-B live dispatch. The benchmark's load-bearing finding: T1 scenarios score ~100 (circular, gold extracted from the router) but T2 blind holdouts score ~31 — the children's routers are keyword-matchers, not semantic routers, while the hubs route natural language correctly. Five Sonnet-authored router fixes followed (keyword broadening + structural cleanups); an integrity gate (fresh positives + adjacent negatives routed through the real router) proved the fixes are safe (zero over-firing) and honest (no overfitting) but bounded — keyword broadening lifts enumerated phrasings and cannot generalize to unseen natural language. Durable recommendation: per-child natural-language routing needs a semantic/model-based layer, not longer keyword lists."
trigger_phrases:
  - "mcp cli hub benchmark results"
  - "keyword router ceiling finding"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/058-mcp-cli-hub-benchmark"
    last_updated_at: "2026-07-10T22:30:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "All 7 targets benchmarked both modes; 5 router fixes landed; keyword-ceiling finding recorded"
    next_safe_action: "Complete"
    blockers: []
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Keyword broadening is safe (no over-firing) and honest (no overfit) but bounded — cannot generalize to unseen phrasing"
      - "The durable fix for per-child NL routing is semantic/model-based routing; the D1inter advisor probe is deferred"
---
# Implementation Summary: mcp-tooling + cli-external Hub Benchmark & Router Improvements

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

<!-- ANCHOR:metadata -->
## Metadata
| Field | Value |
|-------|-------|
| **Spec Folder** | 058-mcp-cli-hub-benchmark |
| **Completed** | Benchmark enablement + normalization + 5 router fixes + findings |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:what-built -->
## What Was Built
**Benchmark enablement.** Authored per-child Type-1 gold under each child's
`manual_testing_playbook/intra-routing-recall/` — a T1 scenario per `INTENT_SIGNALS` key (prompt carrying the
intent keywords; `expected_resources` copied verbatim from `RESOURCE_MAP[intent]`), plus T2 blind holdouts and a
T3 negative. Every child now scores real Type-1 (previously all five returned NO-SCENARIOS). Hardened both hubs'
`hub-routing/` gold with blind holdouts. **mcp-figma normalization:** its runtime router is `INTENT_MODEL`
with tuple-weighted keywords, invisible to the replay parser (parsed 0 intents); added an additive
`INTENT_SIGNALS` mirror (per-intent weight = max per-keyword weight) with a key-sync vitest — runtime selector
byte-unchanged, parser now yields all 6 intents. **Genuine Mode-B live dispatch** proven via a configured model
env (`SKILL_BENCH_OPENCODE_MODEL`).

**Router improvements (5 Sonnet agents, one per child).** Keyword broadening with genuine domain synonyms
(authored blind to the holdout prompts) + structural fixes: mcp-chrome-devtools (resource precision left intact,
correctly not over-tightened), mcp-click-up (`INSTALL_GUIDE.md` relocated to `references/` so the loader credits
it; dead `DEFAULT` resource key removed), mcp-figma (broadened in both blocks, key-sync kept green),
cli-opencode / cli-claude-code (`DESIGN` cross-skill-handoff documented as deliberate).
<!-- /ANCHOR:what-built -->

<!-- ANCHOR:how-delivered -->
## How It Was Delivered
Proved the gold shape on one child first (chrome-devtools PASS 94), then fanned out. Final Mode-A matrix
(before → after the fixes): mcp-figma 89→**98**, mcp-chrome-devtools 77→**91**, cli-claude-code 85→**92**,
mcp-click-up 76→**78** (structural: D3 92→100, D5 88→100), cli-opencode 85→**85** (broadened, no measured lift);
hubs mcp-tooling **92** and cli-external **87** (post blind-holdout hardening). T1 rows are byte-identical across
every fix (no regression, no test-gaming). Mode-B smoke: a blind holdout scored 31 deterministically but 66 live.
<!-- /ANCHOR:how-delivered -->

<!-- ANCHOR:decisions -->
## Key Decisions
Normalize mcp-figma with a mirror block rather than migrating the runtime selector (lower risk, provably
runtime-identical). Keyword broadening authored blind to the holdout prompts to avoid overfitting. Left
chrome-devtools' `RESOURCE_MAP` untouched — the only over-routing was a holdout side effect, and tightening on
that basis would be holdout-informed overfitting. Kept all five fixes (all safe + honest + net-positive) even
though two produced no measured holdout lift, because the integrity gate showed no over-firing harm.
<!-- /ANCHOR:decisions -->

<!-- ANCHOR:verification -->
## Verification
Each fix re-benchmarked before/after (T1 unchanged, D3/D5 no regression, key-sync green for figma). Integrity
gate: routed fresh positives + adjacent negatives through the real router — **zero over-firing** (adjacent
out-of-domain prompts returned NONE despite 40+ keyword intents) and **no generalization** (fresh un-enumerated
phrasings all missed). This proves the fixes are honest and safe but bounded.
<!-- /ANCHOR:verification -->

<!-- ANCHOR:limitations -->
## Known Limitations
**The load-bearing finding — keyword routing has a ceiling.** The children's in-skill routers are substring
keyword-matchers: broadening the keyword lists improves the phrasings you enumerate (measured holdout lifts) but
cannot generalize to unseen natural language (every fresh-phrasing probe missed), and the ~69-point T1−T2 gap is
inherent. The hubs, by contrast, route natural-language holdouts correctly. **The durable fix for per-child
natural-language routing is a semantic/model-based layer** (which Mode-B live and the hub advisor already
provide), not longer keyword lists — the keyword work is a reasonable floor, not a cure. **Deferred:** the
D1inter advisor probe (needs advisor-class scenarios + the live advisor daemon) and the full Mode-B matrix
(only a smoke was run). **Harness gaps surfaced (not fixed, out of scope):** the loader's path regex drops
repo-root gold paths, and Mode-B's default model can silently short-circuit.
<!-- /ANCHOR:limitations -->
