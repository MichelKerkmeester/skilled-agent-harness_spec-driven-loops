---
title: "Tasks: Lane weight sweep harness and intent-prompt corpus"
description: "Extend scoring, build sweep, author corpus, run, recommend."
trigger_phrases:
  - "weight sweep harness tasks"
importance_tier: "important"
contextType: "tasks"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/005-weight-sweep-harness"
    last_updated_at: "2026-05-13T20:45:00Z"
    last_updated_by: "claude"
    recent_action: "Scaffolded packet"
    next_safe_action: "Dispatch cli-codex gpt-5.5 high"
    blockers: []
    key_files:
      - "tasks.md"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
# Tasks: Lane weight sweep harness and intent-prompt corpus

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## TASK NOTATION

| Marker | Meaning |
|--------|---------|
| `[ ]` | Open |
| `[x]` | Done |
| `[B]` | Blocked |
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## PHASE 1: SETUP

- [ ] T001 Read `scoreAdvisorPrompt` in `scorer/fusion.ts` to find the weight-merge insertion point.
- [ ] T002 Read `runLaneAblation` to understand existing on/off pattern.
- [ ] T003 Inventory existing fixture corpora under `skill_advisor/tests/legacy/advisor-fixtures/`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## PHASE 2: IMPLEMENTATION

- [ ] T010 Extend `AdvisorScoringOptions` with `laneWeightsOverride?: Partial<Record<ScorerLane, number>>` in `scorer/types.ts`.
- [ ] T011 Update `scoreAdvisorPrompt` to merge override over `DEFAULT_SCORER_WEIGHTS` when present.
- [ ] T012 Add `runLaneWeightSweep` function to `scorer/ablation.ts`.
- [ ] T013 Author corpus at `skill_advisor/tests/scorer/fixtures/intent-prompt-corpus.ts` with 20-30 entries (50/50 today-correct vs intent-described).
- [ ] T014 Author Vitest test `tests/scorer/lane-weight-sweep.vitest.ts` that runs the sweep against the corpus.
- [ ] T015 Emit markdown report to `003-weight-sweep-harness/research/sweep-results.md` (Vitest creates the dir + file).
- [ ] T016 Update `implementation-summary.md` with the recommendation table + rationale.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## PHASE 3: VERIFICATION

- [ ] T020 Run `npm run typecheck` from `mcp_server/`.
- [ ] T021 Run `npm exec -- vitest run skill_advisor`, confirm no new failures vs the known plugin-bridge baseline.
- [ ] T022 Run `npx tsc --build` in `system-spec-kit/` to rebuild dist.
- [ ] T023 Strict spec validate this packet.
- [ ] T024 Strict spec validate parent 015 packet.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## COMPLETION CRITERIA

- [ ] All Phase 1-3 tasks `[x]`.
- [ ] No `[B]` blockers.
- [ ] Recommendation entry justified by numbers.
- [ ] Strict validation green.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## CROSS-REFERENCES

- Parent phase: `002-skill-advisor-semantic-lane`
- Sibling phases: `001-embed-cache-and-cosine-wiring`, `002-ablation-sweep-and-promote` (both shipped)
- Source files: `skill_advisor/lib/scorer/types.ts`, `fusion.ts`, `ablation.ts`, `weights-config.ts`
<!-- /ANCHOR:cross-refs -->
