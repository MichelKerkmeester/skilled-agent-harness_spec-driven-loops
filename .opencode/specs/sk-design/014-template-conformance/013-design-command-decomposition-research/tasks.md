---
title: "Tasks: /interface:design command decomposition research"
description: "Task breakdown for setting up the shared evidence base, dispatching the two 10-iteration lineages (cli-devin/glm-5-2 and cli-cursor/composer-2.5), and verifying + comparing their converged syntheses."
trigger_phrases:
  - "design command decomposition research tasks"
  - "interface design command split tasks"
  - "sk-design command surface research tasks"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-design/014-template-conformance/013-design-command-decomposition-research"
    last_updated_at: "2026-07-27T18:30:00Z"
    last_updated_by: "spec-author"
    recent_action: "Both lineages converged 10/10; verdict recorded, 3 defects fixed."
    next_safe_action: "Leave packet closed; SKILL.md word-cap relief remains an open follow-up."
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/design-interface/SKILL.md"
      - "research/lineages/glm/research.md"
      - "research/lineages/composer/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-author-session"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "SKILL.md word-cap relief (GLM rec #3, confidence 0.7) — not executed"
      - "Motion-only process branching (GLM rec #4, confidence 0.65) — not executed"
    answered_questions:
      - "Should /interface:design be decomposed? No — both lineages independently converged on not-worth-doing."
---

<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->
# Tasks: /interface:design command decomposition research
<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path) [effort]`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm the five research questions and hard constraint text match `spec.md` verbatim in both lineages' iteration framing (no path) [15m]
- [x] T002 Snapshot `design-interface/SKILL.md`'s current 5 argument lanes, 12 internal lanes, `INTENT_SIGNALS`, and `RESOURCE_MAP` as the shared evidence base (`.opencode/skills/sk-design/design-interface/SKILL.md`) [15m]
- [x] T003 Create `research/lineages/glm/` and `research/lineages/composer/` directories (`research/lineages/`) [5m]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Lineage A — cli-devin / glm-5-2

- [x] T004 [P] Dispatch Lineage A, iterations 1-10, forced (no early convergence stop) (`research/lineages/glm/`) [varies]
- [x] T005 Lineage A produces converged synthesis: ranked value-to-cost recommendations, explicit confidence per item, "not worth doing" section (`research/lineages/glm/`) [included in T004]
- [x] T006 Lineage A's synthesis explicitly addresses all five research questions (`research/lineages/glm/`) [included in T004]

### Lineage B — cli-cursor / composer-2.5

- [x] T007 [P] Dispatch Lineage B, iterations 1-10, forced (no early convergence stop) (`research/lineages/composer/`) [varies]
- [x] T008 Lineage B produces converged synthesis: ranked value-to-cost recommendations, explicit confidence per item, "not worth doing" section (`research/lineages/composer/`) [included in T007]
- [x] T009 Lineage B's synthesis explicitly addresses all five research questions (`research/lineages/composer/`) [included in T007]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Confirm both `research/lineages/glm/` and `research/lineages/composer/` show 10 completed iteration records (no path) [10m]
- [x] T011 Spot-check every ranked-above-"not worth doing" recommendation in both syntheses against the hard constraint (no path) [20m]
- [x] T012 Produce the cross-lineage comparison: named agreements, named disagreements, most load-bearing disagreement identified (`research.md` or `implementation-summary.md`) [30m]
- [x] T013 `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/sk-design/014-template-conformance/013-design-command-decomposition-research --strict` exits 0 (no path) [5m]
- [x] T014 Mark checklist.md items with evidence (`checklist.md`) [10m]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Both lineages show exactly 10 completed iterations
- [x] Both syntheses ranked, confidence-scored, with a "not worth doing" section
- [x] Cross-lineage comparison names concrete agreements and disagreements
- [x] Checklist.md verified (14/15 P0-P2 items; CHK-060 left unticked as a documented deviation — see `checklist.md`)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
<!-- /ANCHOR:cross-refs -->
