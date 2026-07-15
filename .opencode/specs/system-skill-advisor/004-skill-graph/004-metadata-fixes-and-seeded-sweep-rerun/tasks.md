---
title: "Tasks: Apply 015/005 metadata fixes and re-run the seeded sweep"
description: "Read audit, edit skills, invalidate cache, re-run sweep, recommend."
trigger_phrases:
  - "metadata fixes tasks"
importance_tier: "important"
contextType: "tasks"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/004-skill-graph/004-metadata-fixes-and-seeded-sweep-rerun"
    last_updated_at: "2026-05-14T01:00:00Z"
    last_updated_by: "claude"
    recent_action: "Scaffolded packet"
    next_safe_action: "Dispatch codex"
    blockers: []
    key_files:
      - "tasks.md"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
# Tasks: Apply 015/005 metadata fixes and re-run the seeded sweep

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

- [ ] T001 Read 015/005 `research/audit-report.md` and extract per-skill recommendations with WHAT/EXAMPLE blocks.
- [ ] T002 Inventory affected skills and their files (`graph-metadata.json` + `SKILL.md`).
- [ ] T003 Read 015/004 sweep cache layout (`tests/scorer/fixtures/.embeddings-cache/`).
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## PHASE 2: IMPLEMENTATION

- [ ] T010 For each top-8 skill: apply concrete edits to `graph-metadata.json` `derived.trigger_phrases` / `derived.key_topics` per audit EXAMPLE.
- [ ] T011 For each top-8 skill: apply concrete edits to `SKILL.md` frontmatter `description:` per audit EXAMPLE.
- [ ] T012 Invalidate the embedding cache for affected skills (delete cache file or affected rows).
- [ ] T013 Run `npm exec -- vitest run mcp_server/skill_advisor/tests/scorer/lane-weight-sweep.vitest.ts`.
- [ ] T014 Author `research/sweep-results-after-fixes.md` with per-vector deltas vs 015/004 baseline.
- [ ] T015 Update `implementation-summary.md` with edit ledger + recommendation.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## PHASE 3: VERIFICATION

- [ ] T020 Run `npm run typecheck` from `mcp_server/`.
- [ ] T021 Run full `vitest run skill_advisor`; confirm only the pre-existing plugin-bridge baseline still fails.
- [ ] T022 Confirm all 17 skills still discoverable (skill_graph_scan returns 17 in fresh process).
- [ ] T023 Strict spec validate this packet.
- [ ] T024 Strict spec validate parent 015 packet.
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

- Parent: `002-semantic-routing-lane`
- Audit source: `005-skill-metadata-quality-audit/research/audit-report.md`
- Baseline: `004-corpus-seeded-sweep/implementation-summary.md`
- Test reused: `mcp_server/skill_advisor/tests/scorer/lane-weight-sweep.vitest.ts`
<!-- /ANCHOR:cross-refs -->
