---
title: "Goal: Phase 4: compaction-purpose-line"
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
    packet_pointer: "system-speckit/spec-authoring-and-continuity/006-purpose-retention-across-handovers/004-compaction-purpose-line"
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
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Goal: Phase 4: compaction-purpose-line

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** After a compaction on Claude, Codex, Cursor, DSH or Pi, the recovered context opens with one sentence quoted from the last active packet's purpose, so the session keeps why the work exists and not only what it touched.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | This phase changes only the files its `spec.md` lists under Files to Change, plus its own packet docs. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] REQ-001: The compact output of `session-prime` opens with `## Packet Purpose` and one sentence from the last spec folder's `### Purpose` when that text is authored. The test `leads the compact recovery with the packet purpose` passes, and the measurement script in `scratch/` prints `purpose_heading=1 purpose_text=1` after the build
- [x] REQ-002: A missing spec folder, a missing or unreadable `spec.md` and any helper failure add no section, leave the rest of the output as it is and never fail the hook. The test `adds no purpose section when the last spec folder has no spec.md` passes, and `resolvePacketPurpose` returns null for a missing folder
- [x] REQ-003: `resolvePacketPurpose` applies the purpose rule in order: the packet's own purpose, then the nearest enclosing phase parent's labelled as the parent's, then the packet's `goal.md` Objective, then null. A template token, a bracketed prompt, `UNKNOWN` and both wordings of the scaffold layout sentence count as no purpose. The four tests in `tests/packet-purpose.vitest.ts` pass
- [x] REQ-004: The Pi `session_compact` message carries the same `## Packet Purpose` section, and none when no session id is known. The test `names the packet purpose of the last active spec folder` passes and the no-session test asserts no `## Packet Purpose`
- [x] REQ-005: The existing suites stay green and the runtime still builds and typechecks. The five-file Vitest run in `plan.md` prints `Tests  71 passed (71)`, and the build and the typecheck exit 0
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
| Phase built | Done | Status Complete in `spec.md`. Criteria marked from that status and `implementation-summary.md`, not rerun on 2026-11-14 |

### Deviations and findings

| Item | Note |
|------|------|
| None recorded | The criteria above are this phase's own requirement rows, copied from its `spec.md` |
<!-- /ANCHOR:log -->
