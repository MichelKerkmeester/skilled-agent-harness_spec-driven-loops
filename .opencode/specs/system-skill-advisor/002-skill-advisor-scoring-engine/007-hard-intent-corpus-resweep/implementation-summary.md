---
title: "Implementation Summary: Harder intent-described corpus + sweep"
description: "Pending; filled by codex with harder-set numbers and recommendation."
trigger_phrases:
  - "harder corpus summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/007-hard-intent-corpus-resweep"
    last_updated_at: "2026-05-14T01:30:00Z"
    last_updated_by: "claude"
    recent_action: "Scaffolded packet"
    next_safe_action: "Dispatch codex"
    blockers: []
    key_files:
      - "implementation-summary.md"
      - "research/sweep-results-harder.md"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
# Implementation Summary: Harder intent-described corpus + sweep

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-05-14 |
| **Branch** | `007-hard-intent-corpus-resweep` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Authored `harder-intent-prompt-corpus.ts` with 22 lexical-mis-route prompts covering 11 distinct skill ids. Per-skill count: `cli-gemini` 2, `deep-ai-council` 2, `deep-research` 2, `deep-review` 2, `mcp-chrome-devtools` 2, `mcp-coco-index` 2, `mcp-code-mode` 2, `sk-doc` 2, `sk-git` 2, `sk-prompt` 2, `system-spec-kit` 2.

Extended `lane-weight-sweep.vitest.ts` with a second seeded sweep over the harder corpus, fixture coverage assertions, skip-report handling, and a report writer for `research/sweep-results-harder.md`.

| Vector | Harder accuracyTotal | Harder intentDescribed | Delta vs original-24 accuracyTotal | Delta vs original-24 intentDescribed | flippedFromBaseline |
|---|---:|---:|---:|---:|---:|
| V0-baseline-015-002 | 0.2273 | 0.2273 | -0.4394 | -0.1060 | 0 |
| V1-pre-015-002 | 0.2273 | 0.2273 | -0.4394 | -0.1060 | 0 |
| V2-slightly-higher | 0.2273 | 0.2273 | -0.4394 | -0.1060 | 0 |
| V3-medium | 0.2273 | 0.2273 | -0.4394 | -0.1060 | 0 |
| V4-aggressive | 0.2273 | 0.2273 | -0.4394 | -0.1060 | 0 |
| V5-explicit-heavy | 0.2273 | 0.2273 | -0.4394 | -0.1060 | 0 |
| V6-cosine-dominant | 0.2273 | 0.2273 | -0.4394 | -0.1060 | 0 |

Recommendation: stay at `0.05`. The harder corpus confirmed the saturation hypothesis only partly: it is materially harder than the original 24, but semantic weights from 0.00 to 0.30 still produced no top-route variance and no accuracy lift.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Implemented directly in the 015/007 packet without subagents. The default embedding provider skipped locally with `Failed to create context`; an explicit `EMBEDDINGS_PROVIDER=hf-local` run completed the seeded sweep and produced the final harder-set numbers.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## KEY DECISIONS

| Decision | Why |
|----------|-----|
| Sibling fixture vs extending existing | Preserves the original 24-prompt baseline as a stable reference |
| Cover 8-12 skills | Avoids over-loading any single skill in the harder set |
| Inline mis-route comments | Future readers can verify the authoring intent |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Gate | Status | Evidence |
|------|--------|----------|
| Strict spec validation | Pass | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/007-hard-intent-corpus-resweep --strict` -> RESULT: PASSED |
| Parent strict validation | Pass | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/002-semantic-routing-lane --strict` -> RESULT: PASSED |
| Typecheck | Pass | `npm run typecheck` from `mcp_server/` -> PASS |
| Vitest skill_advisor | Pass with known baseline | `npm exec --workspace=@spec-kit/mcp-server -- vitest run skill_advisor` -> 42 files, 303 tests, 1 known `plugin-bridge.vitest.ts` failure |
| Sweep harder run | Pass | `EMBEDDINGS_PROVIDER=hf-local LANE_WEIGHT_SWEEP_REPORT_FALLBACK_DIR=/tmp/015007-sweep npm exec -- vitest run skill_advisor/tests/scorer/lane-weight-sweep.vitest.ts --reporter dot` -> 1 file, 3 tests passed |
| Dist rebuilt | Pass | `npx tsc --build` from `system-spec-kit/` -> PASS |
| Recommendation cited | Pass | Stay at `0.05`; harder accuracy 0.2273, intent-described delta -0.1060, varianceDetected false |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Authored vs real telemetry**: harder prompts are still synthetic; real distributions may differ.
2. **Fixed lane registry**: this packet does not change weights; downstream packet would act if a clear winner emerges.
3. **Provider variance**: cosine vectors depend on the active embedding model; results bound to current Gemma config.
<!-- /ANCHOR:limitations -->
