---
title: "Goal: Anchor repair mode"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "completion criteria"
  - "goal binding"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-speckit/034-spec-folder-tooling/016-research-recommendations/011-anchor-repair-mode"
    last_updated_at: "2026-10-08T12:00:00Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "bd2aa56c-623b-43f8-a2ef-69a13c32d626"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: Anchor repair mode

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Build an anchor-repair mode that fixes three anchor defect classes (glued templates, fenced duplicates, nested questions layout) with dry-run, collision detection and atomic writes, integrating into upgrade-legacy as one repair step, with the marker-only un-nesting also applied to archived documents.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Fence-aware pairing: respect code fence boundaries when pairing anchors, never cross them |
| D2 | Dry-run writes nothing; all findings go to stdout, never to a leftovers file |
| D3 | Phase 1 (SH-01) must ship first so the un-nesting target template is available |
| D4 | The marker-only un-nesting also runs on archived documents. No other anchor repair touches them. Decided 2026-10-08 by the operator |
| D5 | Phase 13 waits for this phase before nesting becomes an error |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] Dry-run on a document with all three anchor defect types reports findings and writes no files
- [ ] Collision detection prevents suffix conflicts when numbering ambiguous duplicates
- [ ] Apply on 50 randomly selected documents from the 549 nested questions layouts leaves all documents valid
- [ ] The anchor-repair step runs in `upgrade-legacy --apply` and the full upgrade passes
- [ ] An archived fixture with the nested layout is un-nested by `upgrade-legacy --apply --include-archive`, and a test shows its prose lines are unchanged
- [ ] The spec-kit test suite passes with no regressions
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Planning documents written | Done | spec.md, plan.md, tasks.md, acceptance-criteria.md, implementation-summary.md pass strict validation |
| Metadata re-derived | Done | repair-derived.cjs --apply, graph-metadata.json SOURCE_FINGERPRINT matches |

### Deviations and findings

| Item | Note |
|------|------|
| Archived un-nesting decided | 2026-10-08, the operator chose to run the marker-only un-nesting on archived documents too, because it moves marker lines only and never prose. Without it, about 164 archived packets would keep the nesting and fail once phase 13 makes nesting an error |
<!-- /ANCHOR:log -->
