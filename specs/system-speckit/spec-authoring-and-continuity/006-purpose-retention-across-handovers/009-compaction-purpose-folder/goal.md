---
title: "Goal: Phase 9: compaction-purpose-folder"
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
    packet_pointer: "system-speckit/spec-authoring-and-continuity/006-purpose-retention-across-handovers/009-compaction-purpose-folder"
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
# Goal: Phase 9: compaction-purpose-folder

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Show the purpose after a compaction for a session the Stop hook never pinned to one packet, and make both compaction adapters refuse a folder that lies outside the project.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | This phase changes only the files its `spec.md` lists under Files to Change, plus its own packet docs. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] REQ-001: Neither adapter hands the helper a folder outside the project. The first Measured Behavior command prints no line, and the tests `adds no purpose section for a last spec folder outside the project` and `adds no packet purpose for a last spec folder outside the workspace` pass
- [ ] REQ-002: A compaction with no pinned folder takes the purpose from the folder the cached brief names. The test `takes the purpose from the folder the cached brief names when no last folder is pinned` passes
- [ ] REQ-003: The compaction tests store the repo-relative value real state holds. The third Measured Behavior command prints no line, and `../node_modules/.bin/vitest run --config vitest.config.ts runtime/tests/hook-session-start.vitest.ts runtime/tests/history-locator-adapters.vitest.ts`, run from `.skilled/skills/system-spec-kit/runtime`, prints `(27 tests)`, `(19 tests)` and `Tests  46 passed (46)`
- [ ] REQ-004: The fallback reads the line the PreCompact brief really writes. The test `reads the folder line the PreCompact brief writes` passes inside the REQ-003 run
- [ ] REQ-005: The runtime still typechecks and builds. `npm run typecheck` and `npm run build` in `.skilled/skills/system-spec-kit/runtime` exit 0
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
