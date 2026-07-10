---
title: "Implementation Summary: Smart-Routing Benchmark Program"
description: "What shipped for the smart-routing benchmark program: 7/8 children scoring Mode-A PASS on their own gold, the sk-code union-projection drift guard, a proven live Mode-B pipeline with a circularity meter, and the migration-gated remainder (deep-ai-council + deep-loop hub Type-2)."
trigger_phrases:
  - "smart routing benchmark summary"
  - "routing benchmark shipped"
  - "circularity meter results"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/054-smart-routing-benchmark-program"
    last_updated_at: "2026-07-09T05:05:29Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Completed the full 20-run routing benchmark matrix"
    next_safe_action: "Wire the Mode-A configs + drift guard into a CI job (only remaining follow-up)"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/sk-code-router-sync.vitest.ts"
      - ".opencode/skills/sk-code/shared/references/smart_routing.md"
      - ".opencode/skills/sk-code/*/manual_testing_playbook/"
      - ".opencode/skills/system-deep-loop/{deep-research,deep-review,deep-improvement}/manual_testing_playbook/10--intra-routing-recall/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session_01Ht7J9NZTEBBXwzTeNvras9"
      parent_session_id: null
    completion_pct: 95
    open_questions:
      - "Trim Mode-B to representative-per-family permanently, or run all 10 once the deep-loop hub unblocks?"
    answered_questions:
      - "Both hubs, each child its own router+gold, both modes — locked before build"
---
# Implementation Summary: Smart-Routing Benchmark Program

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 054-smart-routing-benchmark-program |
| **Completed** | Complete — 20/20 runs (8 children + 2 hubs, both modes); CI wiring is the only follow-up |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:what-built -->
## What Was Built

The benchmark program delivered the full 10-target / 20-run matrix (per-child routers + gold, parent projection + drift guard, and both Mode-A and Mode-B baselines) plus the circularity-meter synthesis.

## What shipped

The program is complete — **all 8 children and both hubs scored in both modes** (20 runs), verified and pushed to the shared branch `system-speckit/028-memory-search-intelligence`.

### Mode-A (deterministic router-replay — the CI gate)

**All 8 children score PASS** on **their own** non-fabricated gold; **both hub baselines** are captured; the sk-code parent is a drift-guarded union projection of its children.

| Target | Verdict | Aggregate | Notes |
|--------|---------|-----------|-------|
| `code-review` | PASS | 100 | already self-routed; gold tightened to exact `assets/*` |
| `deep-review` | PASS | 93 | router already canonical |
| `deep-ai-council` | PASS | 92 | tuple `INTENT_MODEL` normalized → canonical `INTENT_SIGNALS`; new gold |
| `code-webflow` | PASS | 91 | new inline §2b router (13 intents) |
| `deep-research` | PASS | 91 | router already canonical |
| `deep-improvement` | PASS | 91 | router already canonical |
| `code-quality` | PASS | 89 | thin single-intent router (hybrid; path precision is a unit test) |
| `code-opencode` | PASS | 84 | new inline §2b router (6 intents, 30 paths) |
| `system-deep-loop` hub | PASS | 100 | 20 hub scenarios; parent→child route-gold |
| `sk-code` hub | baseline | 85 | union projection; byte-identical before/after P3 |

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Delivery used the existing benchmark engine, a sk-code projection guard, and representative live corroboration.

### Architecture + guardrail

- Decentralized sk-code surface-child routing into each child's `SKILL.md`; rewrote the parent `smart_routing.md` `RESOURCE_MAP` as `union(children) + parent-owned tier`.
- Extended `sk-code-router-sync.vitest.ts` to enforce `parent == union(children) + tier`, each child self-parseable, and every child path on disk — 7/7 green.
- **Invariant held**: the sk-code hub Mode-A run is byte-identical before and after the projection rewrite (the highest-value guardrail — the working two-layer hub run did not change).

### Mode-B (live `cli-opencode gpt-5.5-fast --variant high` — advisory)

> **⚠️ These original Mode-B numbers were a measurement artifact and have been SUPERSEDED.** Follow-up children corrected the live scores: **001** (live scoring fix — assets were scored on a channel `resourceRecall` ignored, and live d1-intra was halved by an unobservable intent term) and **002** (code-review routing optimization + a router-replay parser bug). Corrected Mode-B after re-baseline:
>
> | Target | orig | **corrected** | | Target | orig | **corrected** |
> |---|---|---|---|---|---|---|
> | code-quality | 31 | **100** | | deep-improvement | 62 | **80** |
> | code-opencode | 56 | **88** | | deep-ai-council | 76 | **90** |
> | code-webflow | 57 | **86** | | **code-review** | **0** | **100** (via 002) |
> | deep-research | 80 | **91** | | sk-code hub | 67 | **66** |
> | deep-review | 71 | **87** | | system-deep-loop hub | 93 | **93** |
>
> Every child rose; the two 0.00 cases (code-review, code-quality — all-asset gold) confirmed the artifact. See children 001/002/003 for the fixes; the table below is the historical pre-fix meter.

The live pipeline is proven (`scoringMethod: mode-b-live`, `traceMode: live`). **All 8 children + both hubs were scored live** — the complete 20-run matrix — yielding the full **circularity meter** (Mode-A router-replay vs Mode-B live gpt-5.5-fast, with the live per-scenario `resourceRecall`):

| Target | Mode-A | Mode-B | A→B gap | live resourceRecall | Reading |
|--------|--------|--------|---------|---------------------|---------|
| `deep-research` | 91 | 80 (PASS) | **11** | 1.00 | strongest — live recalls every resource |
| `deep-review` | 93 | 71 (COND) | **22** | 0.89 | holds up live → real capability |
| `deep-improvement` | 91 | 62 (COND) | **29** | 0.90 | holds up live |
| `deep-ai-council` | 92 | 76 (COND) | **16** | 0.91 | holds up live → real capability |
| `code-opencode` | 84 | 56 (COND) | **28** | 0.70 | partial live recall |
| `code-webflow` | 91 | 57 (COND) | **34** | 0.51 | partial live recall |
| `code-quality` | 89 | 31 (FAIL) | **58** | 0.00 | thin single-route; live misses it |
| `code-review` | 100 | 0 (FAIL) | **100** | 0.00 | **most router-overfit** — perfect Mode-A, zero live corroboration |
| `system-deep-loop` hub | 100 | 93 (PASS) | **7** | — | hub routes to the right child live (strongest hub) |
| `sk-code` hub | 85 | 67 (COND) | **18** | — | two-layer hub routes correctly in most cases |

**The meter has two components, and the honest reading separates them:**

1. **A systematic live floor (all children): `intentRecall = 0.00`.** The live executor never emits the gold `INTENT_SIGNALS` keys, so live `d1intra` loses its `0.4·intentRecall` term across the board. This depresses *every* child's Mode-B score and accounts for a fixed slice of every gap — it is an executor characteristic, not a per-child routing defect. (Hubs are scored by route-outcome, not child resourceRecall, so this floor does not apply to them — hence their smaller gaps.)
2. **`resourceRecall` is the real live signal.** The four deep-loop children recall their resources robustly live (0.89–1.00) → genuinely discoverable routers. sk-code surface children recall partially (0.51–0.70). `code-quality` and `code-review` recall nothing live (0.00).

**Standout finding — `code-review` (Mode-A 100 → Mode-B 0, resourceRecall 0):** its perfect Mode-A is pure router self-consistency with *zero* live corroboration — the most overfit Type-1 gold in the set (7/7 scenarios routed to the wrong resources live). This is exactly what the circularity meter exists to surface: a perfect deterministic score that a live model does not reproduce. `code-quality`'s 0.00 is consistent with its deliberately thin single-route (ADR-004). Conversely, all four deep-loop children's high live resourceRecall confirms their routers are real capability, not fixture memorization.

**Both hubs — Type-2 parent→child discoverability, live:** `system-deep-loop` scored **PASS 93** (20 scenarios, Mode-A 100 → gap 7) and `sk-code` scored **CONDITIONAL 67** (30 scenarios, Mode-A 85 → gap 18, D5 hard-gate 100). Both route to the correct child in most cases live — the sk-code hub is the P5 Type-2 measurement that is unscoreable in router mode (contamination bans hub keywords), corroborated here in Mode-B.
<!-- /ANCHOR:how-delivered -->
<!-- /ANCHOR:what-built -->

<!-- ANCHOR:decisions -->
## Key Decisions

The implementation follows the ADRs and findings summarized below.

## Key findings (why the build shape is what it is)

1. **Contamination-lint tension** — `--fixtures-dir` hard-fails a router-keyword leak (score 0); the default playbook corpus treats it as advisory. Type-1 prompts must carry the intent keywords to fire the router, so Type-1 gold had to be **playbooks, not fixtures** (ADR-003).
2. **sk-code Type-2 is a Mode-B measurement** — strict `scoreHubRoute` fixtures are unscoreable in router mode: decontaminated prompts route to no mode (silent default → `BLOCKED-BY-ROUTING`), keyword prompts fail contamination. The router-mode Type-2 signal is the D1-inter advisor probe (which surfaced that the advisor wrongly ranks sk-code top for pure doc edits — a real negative-control finding).
3. **`parseRouter` takes SKILL.md text, not a path** — the union-diff and drift guard must `readFileSync` then parse, matching the engine contract.
<!-- /ANCHOR:decisions -->

<!-- ANCHOR:verification -->
## Verification

Verification evidence is the shipped baseline, live-mode evidence, and blast-gated commit record below.

## Commits (shared branch, scratch-index recipe, all blast-gated)

`ed16475077` (P0 baseline + path fix) · `2b0ec3de0d` (webflow+opencode routers) · `5fcd621310` (code-quality thin router) · `3137fb72d2` (drift guard) · `79812f3393` / `c72367b125` / `9ff574a5dd` / `97c0f01d30` (sk-code children gold) · `2825083449` (sk-code children Mode-A baselines) · `3a0c10020f` (deep-loop children gold + baselines) · `2f61bd89be` (packet + first Mode-B) · `c117b8faa2` (full un-gated Mode-B matrix) · `b3dfe378ed` (sk-code hub Mode-B). deep-ai-council (clean router normalization + gold + both modes) + deep-loop hub Mode-B: this turn's commit.

**The 20-run matrix is complete: 8 children × 2 modes + 2 hubs × 2 modes.**
<!-- /ANCHOR:verification -->

<!-- ANCHOR:limitations -->
## Known Limitations

## deep-ai-council un-gating (how the deferral was resolved)

The `deep-ai-council` deferral (originally ADR-006) was resolved by recognizing that my `INTENT_MODEL → INTENT_SIGNALS` normalization and the concurrent `deep-loop-workflows → system-deep-loop` content migration touch **disjoint regions** of `SKILL.md` (my change = the INTENT block; theirs = prose/script-paths, incl. a buggy `runtime//`). The committed `SKILL.md` was built as **origin prose + my INTENT block only** (verified: the diff vs origin is INTENT-scoped, zero migration tokens) and staged via a `git hash-object` blob so the working tree's concurrent migration edits are left untouched. Benchmarking only *reads* the file, so the un-gated runs never required committing the entangled version.

## Remaining follow-up (un-gated, non-blocking)

- **CI wiring**: wire the Mode-A configs + drift guard into a CI job (the drift guard already runs as a vitest). Needs a CI-strategy decision (which runner, blocking vs advisory), so left for the operator.

## Notes

- The `system-deep-loop` hub Mode-B is scored by route-outcome; the concurrent `mode-registry.json` edits did not block a clean PASS 93 run against the current working tree.
<!-- /ANCHOR:limitations -->
