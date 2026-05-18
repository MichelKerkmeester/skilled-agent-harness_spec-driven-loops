---
title: "Tasks: Lane evidence damping + sweep"
description: "Damping math, sweep extension, recommend."
trigger_phrases:
  - "lane damping tasks"
importance_tier: "important"
contextType: "tasks"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/008-advisor-routing-calibration"
    last_updated_at: "2026-05-14T02:15:00Z"
    last_updated_by: "claude"
    recent_action: "Scaffolded packet"
    next_safe_action: "Dispatch codex"
    blockers: []
    key_files:
      - "tasks.md"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
# Tasks: Lane evidence damping + sweep

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

- [ ] T001 Read `scorer/fusion.ts`, `lane-registry.ts`, `types.ts`, `ablation.ts`.
- [ ] T002 Read `lane-weight-sweep.vitest.ts` to find damping extension point.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## PHASE 2: IMPLEMENTATION

- [ ] T010 Add damping types + per-lane config fields.
- [ ] T011 Wire damping math in `scorer/fusion.ts` (default-off).
- [ ] T012 Extend `AdvisorScoringOptions` with `dampingOverride`.
- [ ] T013 Extend sweep harness with damping dimension.
- [ ] T014 Author ≥4 damping configs (D0 control, D1 light, D2 medium, D3 aggressive).
- [ ] T015 Run sweep against 24-corpus + 22-harder; emit `research/damping-sweep-results.md`.
- [ ] T016 Update implementation-summary with recommendation.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## PHASE 3: VERIFICATION

- [ ] T020 `npm run typecheck` from `mcp_server/`.
- [ ] T021 `npm exec -- vitest run skill_advisor`; only plugin-bridge baseline fails.
- [ ] T022 `npx tsc --build`.
- [ ] T023 Strict validate this packet + parent 015.
- [ ] T024 Confirm REQ-002 today-correct floor held in chosen config.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## COMPLETION CRITERIA

- [ ] All Phase 1-3 tasks `[x]`.
- [ ] No `[B]` blockers.
- [ ] Recommendation cites specific deltas.
- [ ] Strict validation green.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## CROSS-REFERENCES

- Parent: `002-skill-advisor-semantic-lane`
- Advisory: `015/scratch/next-steps-advisory.md`
- Sweep harness: `015/003-weight-sweep-harness`
- Seed helper: `015/004-corpus-seeded-sweep`
- Skill-side graph_causal feed: `015/008-populate-intent-signals-and-relationships`
<!-- /ANCHOR:cross-refs -->
