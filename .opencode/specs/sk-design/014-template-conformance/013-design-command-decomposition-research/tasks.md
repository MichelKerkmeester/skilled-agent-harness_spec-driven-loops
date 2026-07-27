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
    last_updated_at: "2026-07-27T14:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Authored task breakdown across three phases"
    next_safe_action: "Start T001"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/design-interface/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-author-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
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

- [ ] T001 Confirm the five research questions and hard constraint text match `spec.md` verbatim in both lineages' iteration framing (no path) [15m]
- [ ] T002 Snapshot `design-interface/SKILL.md`'s current 5 argument lanes, 12 internal lanes, `INTENT_SIGNALS`, and `RESOURCE_MAP` as the shared evidence base (`.opencode/skills/sk-design/design-interface/SKILL.md`) [15m]
- [ ] T003 Create `research/lineages/glm/` and `research/lineages/composer/` directories (`research/lineages/`) [5m]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Lineage A — cli-devin / glm-5-2

- [ ] T004 [P] Dispatch Lineage A, iterations 1-10, forced (no early convergence stop) (`research/lineages/glm/`) [varies]
- [ ] T005 Lineage A produces converged synthesis: ranked value-to-cost recommendations, explicit confidence per item, "not worth doing" section (`research/lineages/glm/`) [included in T004]
- [ ] T006 Lineage A's synthesis explicitly addresses all five research questions (`research/lineages/glm/`) [included in T004]

### Lineage B — cli-cursor / composer-2.5

- [ ] T007 [P] Dispatch Lineage B, iterations 1-10, forced (no early convergence stop) (`research/lineages/composer/`) [varies]
- [ ] T008 Lineage B produces converged synthesis: ranked value-to-cost recommendations, explicit confidence per item, "not worth doing" section (`research/lineages/composer/`) [included in T007]
- [ ] T009 Lineage B's synthesis explicitly addresses all five research questions (`research/lineages/composer/`) [included in T007]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T010 Confirm both `research/lineages/glm/` and `research/lineages/composer/` show 10 completed iteration records (no path) [10m]
- [ ] T011 Spot-check every ranked-above-"not worth doing" recommendation in both syntheses against the hard constraint (no path) [20m]
- [ ] T012 Produce the cross-lineage comparison: named agreements, named disagreements, most load-bearing disagreement identified (`research.md` or `implementation-summary.md`) [30m]
- [ ] T013 `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/sk-design/014-template-conformance/013-design-command-decomposition-research --strict` exits 0 (no path) [5m]
- [ ] T014 Mark checklist.md items with evidence (`checklist.md`) [10m]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Both lineages show exactly 10 completed iterations
- [ ] Both syntheses ranked, confidence-scored, with a "not worth doing" section
- [ ] Cross-lineage comparison names concrete agreements and disagreements
- [ ] Checklist.md fully verified
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
<!-- /ANCHOR:cross-refs -->
