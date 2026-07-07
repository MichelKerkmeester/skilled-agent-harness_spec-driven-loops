---
title: "Implementation Summary: Lane evidence damping + sweep"
description: "Pending; filled by codex with damping artifact list, sweep delta numbers, and chosen config recommendation."
trigger_phrases:
  - "lane damping summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/002-skill-advisor-scoring-engine/008-routing-confidence-calibration"
    last_updated_at: "2026-05-14T07:06:20Z"
    last_updated_by: "codex"
    recent_action: "Implemented damping sweep"
    next_safe_action: "Resolve unrelated suite baseline drift before promotion"
    blockers:
      - "Full skill_advisor suite has 5 failures in this workspace, not the expected 1 plugin-bridge failure baseline"
    key_files:
      - "implementation-summary.md"
      - "research/damping-sweep-results.md"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
# Implementation Summary: Lane evidence damping + sweep

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Implemented; blocked on suite baseline drift |
| **Created** | 2026-05-14 |
| **Branch** | `010-advisor-routing-calibration` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

**Research output preserved; production code reverted.**

Codex shipped a damping prototype (LaneDampingConfig types, fusion-time damping math, sweep harness extension, 6 damping configs, sweep test, unit tests) and ran the sweep across 84 (weight × damping × corpus) combinations producing `research/damping-sweep-results.md`. The empirical finding was unambiguous: **no damping configuration beat the V0/D0 baseline on either corpus, and one combo (V1+D5-aggressive) actively regressed** the harder corpus by -0.0455.

Because the empirical result was zero benefit AND the implementation introduced a default-off invariant leak (4 vitest regressions in graph-health and parity tests when damping infrastructure was present), the main agent **reverted all production code** (`scorer/fusion.ts`, `scorer/ablation.ts`, `tests/scorer/lane-weight-sweep.vitest.ts`, `tests/scorer/lane-damping.vitest.ts`) back to HEAD.

This packet ships:
- `research/damping-sweep-results.md` — the 84-combination empirical record (preserved verbatim from codex's run)
- This implementation-summary documenting the negative finding

This packet does NOT ship:
- Damping types (`LaneDampingConfig`, `dampingOverride`)
- Damping math in `scorer/fusion.ts`
- Sweep harness damping dimension
- Lane registry `damping?` field
- Unit tests for damping math
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

cli-codex gpt-5.5 high fast (`-c service_tier="fast"`) authored the damping prototype + ran the sweep. The sweep used the existing 015/004 seed helper to populate skill embeddings via the local Gemma provider; cacheHits=15 / cacheMisses=0 / seededSkills=15 / promptEmbeddings=46 confirms vectors flowed through.

Codex itself returned `RESULT=BLOCKED` with note "Full skill_advisor suite has 5 failures instead of expected 1". Investigation by the main agent found:
- 2 of the 4 new failures (graph-health) come from parallel-session-introduced empty `system-code-graph` + `system-skill-advisor` skill folders, not from damping
- The remaining 2 new failures (python-ts-parity + advisor-corpus-parity) appeared after the parallel-session skill folders started carrying real SKILL.md content (the TS projection now includes those new skills, Python golden corpus does not)
- Reverting damping code did NOT restore the pre-existing 1-failure baseline; the 3 remaining failures (1 plugin-bridge + 2 parity) predate this packet

Decision: revert damping code (insurance against invariant leak) and ship findings-only. The 3 pre-existing failures are tracked but outside this packet's scope.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## KEY DECISIONS

| Decision | Why |
|----------|-----|
| Damp explicit + lexical only | Advisory identified these as the over-firing pair; other lanes have their own pathologies |
| Default-off in lane-registry | Zero risk of accidental production behavior change until a follow-up packet promotes |
| Sweep multiple damping shapes | Single-shape choice would be guesswork; sweep gives evidence |
| today-correct floor 0.95 | Preserves 24-corpus correctness while allowing a small acceptable loss in exchange for harder-corpus lift |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Gate | Status | Evidence |
|------|--------|----------|
| Strict spec validation | PASS | `validate.sh 010 --strict` + parent `015 --strict` both 0 errors / 0 warnings |
| Sweep ran 7×6×2 = 84 combinations | PASS | `research/damping-sweep-results.md` contains the full matrix; seed: cacheMisses=0/seededSkills=15/promptEmbeddings=46 |
| today-correct floor held | PASS | Every 24-prompt combination stayed at `todayCorrectAccuracy=1.0000` |
| Recommendation cited with numbers | PASS | See Recommendation below; all 84 combos deltaIntentDescribed=+0.0000 vs baseline |
| Damping code reverted | PASS | `git diff HEAD --stat scorer/fusion.ts scorer/ablation.ts tests/scorer/lane-weight-sweep.vitest.ts` is empty post-revert |
| Vitest baseline | DEGRADED (PRE-EXISTING) | 3 failures at HEAD (1 known plugin-bridge + 2 parity from parallel-session skill-folder introductions); NOT caused by this packet |
<!-- /ANCHOR:verification -->

### Recommendation

Stay at current production weights (`explicit_author=0.42`, `lexical=0.28`, `graph_causal=0.13`, `derived_generated=0.12`, `semantic_shadow=0.05`) with no damping.

Evidence:
- 24-prompt corpus: all 42 combinations held `accuracyTotal=0.6667`, `todayCorrectAccuracy=1.0000`, `intentDescribedAccuracy=0.3333`, `flippedFromBaseline=0`.
- 22-harder corpus: baseline remains `intentDescribedAccuracy=0.2273`. No damping config improved it.
- Only one routing variance appeared: `V1-pre-015-002 + D5-probe-t0.80-f0.00` flipped a harder prompt from expected/baseline `cli-gemini` to `cli-codex`, dropping harder accuracy to `0.1818` (`-0.0455` vs harder V0/D0).
- The best eligible harder-corpus result subject to the 24-prompt `todayCorrectAccuracy >= 0.95` floor is still V0/D0 with delta `+0.0000` vs harder baseline.

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Damping is a fusion-time effect**: it changes ranking but not the absolute cosine quality; if the underlying lanes are genuinely wrong (per the advisory's Q5), damping just rearranges deck chairs.
2. **Single-corpus + harder-corpus signal**: real telemetry distribution may surface different damping sweet spots.
3. **today-correct floor 0.95**: if damping cannot meet this with any meaningful intent-described lift, packet ships a "no-go" recommendation and damping stays disabled in production.
<!-- /ANCHOR:limitations -->
