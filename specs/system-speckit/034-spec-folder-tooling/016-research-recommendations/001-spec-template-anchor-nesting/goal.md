---
title: "Goal: Spec template anchor nesting"
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
    packet_pointer: "system-speckit/034-spec-folder-tooling/016-research-recommendations/001-spec-template-anchor-nesting"
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
# Goal: Spec template anchor nesting

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Move the spec.md template's questions anchor from inside NFR/edge-cases/complexity to wrap only the questions section, fixing retrieval and merges for new scaffolds.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Fix the template at the source rather than individual documents; SH-11 (anchor-repair-mode) handles the 549 existing files |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] The golden snapshot test passes with the fixed anchor layout for L1, L2, L3 and L3+
- [ ] A new L1, L2, L3 and L3+ scaffold from `create.sh` passes strict validation on ANCHORS_VALID
- [ ] The snapshot test asserts no anchor nesting, order and pairing for every level
- [ ] The spec-kit test suite runs with no regressions
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
| None yet | Plan is ready for build |
<!-- /ANCHOR:log -->
