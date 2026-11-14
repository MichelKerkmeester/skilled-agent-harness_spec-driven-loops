---
title: "Goal: Phase 7: purpose-reader-coverage"
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
    packet_pointer: "system-speckit/spec-authoring-and-continuity/006-purpose-retention-across-handovers/007-purpose-reader-coverage"
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
# Goal: Phase 7: purpose-reader-coverage

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Make the purpose helper return a packet's own purpose for the live packets that state it without a `### Purpose` heading, 272 of the 292 that lack the heading when this was planned, and stop it returning a list marker or a sentence cut at an abbreviation.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | This phase changes only the files its `spec.md` lists under Files to Change, plus its own packet docs. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] REQ-001: The helper reads a purpose under a level-two purpose heading and in a labelled paragraph, and still reads `### Purpose` first. `../node_modules/.bin/vitest run --config vitest.config.ts runtime/tests/packet-purpose.vitest.ts`, run from `.skilled/skills/system-spec-kit/runtime`, prints `Tests  9 passed (9)`
- [ ] REQ-002: Two real packets that resolve to a parent or to nothing today resolve to their own purpose. `node <this folder>/scratch/probe-reader.mjs`, fed the file list and the two folders named in `tasks.md`, prints `001-goal-hooks-cross-runtime packet` and `001-deep-research packet`
- [ ] REQ-003: A purpose label outside a purpose section is not read as the packet's purpose. The test `ignores a purpose label outside a purpose section` passes inside the REQ-001 run
- [ ] REQ-004: The first-sentence rule drops a list marker and keeps a sentence whole across `e.g.`. The test `drops a list marker and does not end the sentence at an abbreviation` passes inside the REQ-001 run
- [ ] REQ-005: The hooks and the save path that call the helper are unchanged. `hook-session-start.vitest.ts` prints `(23 tests)`, `history-locator-adapters.vitest.ts` prints `(18 tests)`, both pass, and `npm run typecheck` in the runtime folder exits 0
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
| Phase opened | Pending | Planned 2026-11-14, verified by an independent plan review |

### Deviations and findings

| Item | Note |
|------|------|
| None recorded | The criteria above are this phase's own requirement rows, copied from its `spec.md` |
<!-- /ANCHOR:log -->
