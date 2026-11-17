---
title: "Goal: Carry the review coverage surfaces through the fan-out merge (D12)"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "fanout review coverage merge goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/009-fanout-review-coverage-merge"
    last_updated_at: "2026-11-17T14:35:13Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-009-fanout-review-coverage-merge"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Carry the review coverage surfaces through the fan-out merge (D12)

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Give a merged fan-out review registry the coverage data its lineages already produced, so later guards can read it.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The merge rules are the ones in `plan.md` section 3: union for coverage, strongest restriction for traceability status, per-lineage pivot state. |
| D2 | This slice adds data only; the guard that blocks on coverage gaps ships with Slice K. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `npm test -- tests/unit/fanout-merge.vitest.ts tests/fanout-review-focus.vitest.ts` exits 0 with the new cases.
- [ ] The Measured Behavior loop in `spec.md` prints a count above 0 for all six surface names.
- [ ] The T001 suites pass against the baseline plus the new cases.
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
| Phase docs authored | Done | `spec.md`, `plan.md`, `tasks.md` |
| Implementation | Pending | Starts at `tasks.md` T001 |

### Deviations and findings

| Item | Note |
|------|------|
| Pivot state key | The merged registry carries `divergenceByLineage`, not `divergence`, because merging lineage-local pivot state into one object would invent a focus no lineage chose. |
<!-- /ANCHOR:log -->
