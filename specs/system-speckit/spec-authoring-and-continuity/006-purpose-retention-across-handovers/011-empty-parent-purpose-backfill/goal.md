---
title: "Goal: Phase 11: empty-parent-purpose-backfill"
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
    packet_pointer: "system-speckit/spec-authoring-and-continuity/006-purpose-retention-across-handovers/011-empty-parent-purpose-backfill"
    last_updated_at: "2026-11-14T08:45:00Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "ef52f514-275d-4013-b7bd-ab365324057d"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: Phase 11: empty-parent-purpose-backfill

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Give each of the 21 phase parents that states no purpose one sentence saying why its group of child phases exists, so the next AI working below it sees the right reason.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | This phase changes only the files its `spec.md` lists under Files to Change, plus its own packet docs. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] REQ-001: Each of the 21 parents shows its own purpose. `node specs/system-speckit/spec-authoring-and-continuity/006-purpose-retention-across-handovers/011-empty-parent-purpose-backfill/scratch/check-backfill.mjs` prints `packet` on all 21 lines and `own purpose: 21 of 21`
- [x] REQ-002: No parent validates worse than before. `CI=1 bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh <parent> --strict` prints a first `Summary` line with no more errors or warnings than the T002 baseline for each of the 21
- [x] REQ-003: The operator approved the 21 sentences. The operator's answer is recorded in `implementation-summary.md` before the commit
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
| Phase opened | Done | Planned 2026-11-14, verified by an independent plan review |
| Phase built | Done | A DeepSeek V4.1 Flash max worker through cli-deepseek-harness wrote the 21 sentences from each parent's child docs on 2026-11-14. The operator approved them on 2026-11-14 with two rewrites, for `002-spec-memory-stack` and `005-cross-cutting-quality` |

### Deviations and findings

| Item | Note |
|------|------|
| Generated metadata | Each rewritten parent's `graph-metadata.json` was re-derived with `repair-derived.cjs --apply`, because a changed `spec.md` drifts it. After that every parent printed its baseline `Summary` line |
| Remint gate bypass | The pre-commit `spec-remint` gate could not re-derive metadata for `016-search-and-output-intelligence/research`, because a folder named `research` is not `NNN-slug`. That folder failed strict validation before this phase with 4 errors, unchanged after. On 2026-11-14 the operator approved committing with `SPECKIT_SKIP_SPEC_REMINT=1` once; the folder name stays a known defect |
<!-- /ANCHOR:log -->
