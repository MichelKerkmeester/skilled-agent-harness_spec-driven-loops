---
title: "Goal: Phase 10: problem-sentence-carry"
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
    packet_pointer: "system-speckit/spec-authoring-and-continuity/006-purpose-retention-across-handovers/010-problem-sentence-carry"
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
# Goal: Phase 10: problem-sentence-carry

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** After a compaction, show the first sentence of the packet's Problem Statement under its purpose line, so the recovered context says why the work exists as well as what it delivers.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | This phase changes only the files its `spec.md` lists under Files to Change, plus its own packet docs. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] REQ-001: The helper returns the problem sentence beside the purpose, and null where the packet states none. `../node_modules/.bin/vitest run --config vitest.config.ts runtime/tests/packet-purpose.vitest.ts`, run from `.skilled/skills/system-spec-kit/runtime`, prints `Tests  9 passed (9)` with the four extended assertions
- [x] REQ-002: The context recovered after a compaction prints the Problem line under the purpose line. The test `adds the problem under the purpose line` passes, and `hook-session-start.vitest.ts` prints `(28 tests)`
- [x] REQ-003: The Pi adapter prints the same line. `history-locator-adapters.vitest.ts` prints `(19 tests)`, all passing, with the extended assertion
- [x] REQ-004: The stored `packet_purpose` value is unchanged. `../node_modules/.bin/vitest run --config vitest.config.ts runtime/tests/thin-continuity-record.vitest.ts runtime/tests/authored-continuity-snapshot.vitest.ts`, run from the runtime folder, passes with the test counts captured in task T002, and `git status --short` does not list `runtime/cli/core/workflow.ts`
- [x] REQ-005: The runtime still typechecks and builds. `npm run typecheck` and `npm run build` in the runtime folder exit 0, and `rg -c 'formatPacketProblem' dist/lib/spec/packet-purpose.js` prints `1`
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
| Phase built | Done | E1 to E14 applied by a DeepSeek V4.1 Flash max worker through cli-deepseek-harness on 2026-11-14, then every criterion rerun by the orchestrator |

### Deviations and findings

| Item | Note |
|------|------|
| Build before the Pi test | The Pi adapter loads the helper from `dist/`, so its purpose test fails until `npm run build` regenerates it. The worker, told not to build, reported partial with that one failure. After the build the three suites print `(9 tests)`, `(28 tests)`, `(19 tests)` and `Tests  56 passed (56)` |
<!-- /ANCHOR:log -->
