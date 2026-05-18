---
title: "Implementation Summary: Lane weight sweep harness and intent-prompt corpus"
description: "Pending; filled by cli-codex with sweep results and recommendation."
trigger_phrases:
  - "weight sweep summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/005-weight-sweep-harness"
    last_updated_at: "2026-05-13T20:45:00Z"
    last_updated_by: "claude"
    recent_action: "Scaffolded packet"
    next_safe_action: "Dispatch codex"
    blockers: []
    key_files:
      - "implementation-summary.md"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
# Implementation Summary: Lane weight sweep harness and intent-prompt corpus

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Planned |
| **Created** | 2026-05-13 |
| **Branch** | `003-weight-sweep-harness` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Built the 015/003 lane-weight sweep harness and recommendation artifact.

| Artifact | Result |
|----------|--------|
| `AdvisorScoringOptions.laneWeightsOverride` | Added as a documented optional partial lane-weight vector. |
| `scoreAdvisorPrompt` override merge | Added effective per-lane weight resolution that keeps defaults for omitted lanes, drops unknown runtime keys, and does not renormalize. |
| `runLaneWeightSweep` | Added structured vector summaries, per-case results, category accuracy, and baseline flip counts. |
| Intent prompt corpus | Added 24 prompts: 12 `today-correct`, 12 `intent-described`. |
| Vitest sweep | Added a two-test file covering override behavior and the candidate-vector sweep. |
| Research report | Emitted `research/sweep-results.md` with the sweep table and routing diffs. |

Sweep summary:

| vectorLabel | accuracyTotal | todayCorrect | intentDescribed | flippedFromBaseline |
|---|---:|---:|---:|---:|
| V0-baseline-015-002 | 0.7917 | 1.0000 | 0.5833 | 0 |
| V1-pre-015-002 | 0.7917 | 1.0000 | 0.5833 | 0 |
| V2-slightly-higher | 0.7917 | 1.0000 | 0.5833 | 0 |
| V3-medium | 0.7917 | 1.0000 | 0.5833 | 0 |
| V4-aggressive | 0.7917 | 1.0000 | 0.5833 | 0 |
| V5-explicit-heavy | 0.7917 | 1.0000 | 0.5833 | 0 |
| V6-cosine-dominant | 0.7917 | 1.0000 | 0.5833 | 0 |

Recommended next weight: stay at current 0.05 (V0).

Why (with major caveat — see Known Limitations #2): every tested vector produced byte-identical numbers (0.7917 total / 1.0000 today-correct / 0.5833 intent-described / 0 baseline flips). The most likely explanation is NOT that semantic weight does not matter — it is that the sweep runs against `createFixtureProjection(...)`, a synthetic projection that does NOT carry skill embeddings. The cosine lane reads `loadSkillEmbeddings()` against the real `skill-graph.sqlite`, which in test environment is either empty or unpopulated, so the semantic lane contributes zero regardless of its weight. The "stay at 0.05" conclusion is therefore conservative-correct (no empirical reason to change), but the sweep's negative signal is uninformative on its own. A follow-on packet should seed synthetic embeddings into the projection (or run the sweep against a fully-populated skill-graph.sqlite) before drawing real tuning conclusions.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Delivered directly in the existing 015/003 packet without changing `lane-registry.ts`, the cosine lane math, or exported default weight constants.

Implementation steps:

1. Reviewed the existing fusion and ablation paths.
2. Authored the 24-prompt corpus before running the sweep.
3. Added the scoring override and sweep harness.
4. Added the Vitest report writer and generated `research/sweep-results.md`.
5. Used the sweep numbers above for the research-only recommendation.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## KEY DECISIONS

| Decision | Why |
|----------|-----|
| Research-only packet | Avoid auto-promoting a tuned weight without separate review |
| Author corpus before sweep | Prevents biasing prompts toward the existing cosine lane |
| Non-renormalizing override merge | Lets callers explore non-unitary vectors without surprise side effects |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Gate | Status | Evidence |
|------|--------|----------|
| Strict spec validation | Passed | Packet 015/003 and parent 015 both passed `validate.sh --strict`. |
| Typecheck | Passed | `npm run typecheck` from `mcp_server/` passed. |
| Vitest sweep run | Passed | `node .opencode/skills/system-spec-kit/mcp_server/node_modules/vitest/vitest.mjs run .opencode/skills/system-spec-kit/mcp_server/skill_advisor/tests/scorer/lane-weight-sweep.vitest.ts --config .opencode/skills/system-spec-kit/mcp_server/vitest.config.ts` passed 2 tests. |
| Skill advisor suite | Baseline failure only | 302 tests run: 301 passed, 1 failed in `plugin-bridge.vitest.ts`, matching the known forced-local fail-open baseline. |
| Dist rebuild | Passed | `npx tsc --build` from `system-spec-kit/` passed. |
| Recommendation present | Passed | Recommendation: stay at current 0.05 (V0), because no vector improved `intent-described` above 0.5833. |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Corpus size**: 24 entries is small. The recommendation should be treated as a directional signal, not a definitive answer.
2. **Synthetic projection lacks skill embeddings.** The sweep test uses `createFixtureProjection(...)` for the skill set; that projection does NOT seed the `embedding` column that the cosine lane reads via `loadSkillEmbeddings()`. As a result the cosine lane contributed zero to every vector, every prompt, every case — which is why all 7 vectors converged on identical accuracy numbers. The sweep harness, the corpus, and the type/fusion extensions are all real and reusable; the conclusion is currently a conservative non-answer. A follow-on packet should either (a) seed synthetic embeddings into the projection before the sweep runs, or (b) run the sweep against a fully-populated `skill-graph.sqlite` to get a real signal about whether 0.05 is right.
2. **Synthetic prompts**: a portion of the corpus is authored, not drawn from real telemetry. Real prompt distribution may differ.
3. **Single dimension**: this packet only sweeps lane weights. Thresholds (confidence/uncertainty) are not tuned here.
<!-- /ANCHOR:limitations -->
