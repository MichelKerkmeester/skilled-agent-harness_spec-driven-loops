---
title: "Tasks: Harder intent-described corpus + sweep"
description: "Author fixture, extend sweep, re-run, recommend."
trigger_phrases:
  - "harder corpus tasks"
importance_tier: "important"
contextType: "tasks"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/007-hard-intent-corpus-resweep"
    last_updated_at: "2026-05-14T01:30:00Z"
    last_updated_by: "claude"
    recent_action: "Scaffolded packet"
    next_safe_action: "Dispatch codex"
    blockers: []
    key_files:
      - "tasks.md"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
# Tasks: Harder intent-described corpus + sweep

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

- [x] T001 Read existing `intent-prompt-corpus.ts` to know its shape and categories.
- [x] T002 Read `lane-weight-sweep.vitest.ts` to find extension points.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## PHASE 2: IMPLEMENTATION

- [x] T010 Author `harder-intent-prompt-corpus.ts` with 15-25 entries across 8-12 skills.
- [x] T011 Inline per-entry comment explaining the lexical-mis-route hypothesis.
- [x] T012 Extend sweep test to run a second `runLaneWeightSweep` call against the harder set.
- [x] T013 Run sweep; emit `research/sweep-results-harder.md` with delta vs original-24 baseline.
- [x] T014 Update `implementation-summary.md` with edit ledger + recommendation.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## PHASE 3: VERIFICATION

- [x] T020 `npm run typecheck` from `mcp_server/`.
- [x] T021 `npm exec -- vitest run skill_advisor`; baseline holds.
- [x] T022 `npx tsc --build`.
- [x] T023 Strict validate this packet.
- [x] T024 Strict validate parent 015.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## COMPLETION CRITERIA

- [x] All Phase 1-3 tasks `[x]`.
- [x] No `[B]` blockers.
- [x] Recommendation explicitly addresses corpus saturation hypothesis.
- [x] Strict validation green.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## CROSS-REFERENCES

- Parent: `002-semantic-routing-lane`
- Predecessor baselines: `004-corpus-seeded-sweep`, `006-apply-metadata-fixes-and-resweep`
- Sibling parallel packet: `008-populate-intent-signals-and-relationships`
<!-- /ANCHOR:cross-refs -->
