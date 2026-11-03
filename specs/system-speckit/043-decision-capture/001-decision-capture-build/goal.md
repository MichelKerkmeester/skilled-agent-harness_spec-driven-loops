---
title: "Goal: Automatic operator decision capture"
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
    packet_pointer: "system-speckit/043-decision-capture/001-decision-capture-build"
    last_updated_at: "2026-11-01T21:30:00Z"
    last_updated_by: "series-planner"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "fe0c9990-06d3-454e-a8e7-7c7bc649bc49"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Goal: Automatic operator decision capture

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Capture each in-scope operator answer and write it into the correct packet as a short, traceable decision with its exact question, options and answer kept beside it.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The session model rewrites answers into decisions at save time. No hook calls a model (ADR-001). |
| D2 | The writer reuses the validator's `detectLevel` and the CLI's `resolveContinuityLeaf` instead of new level or routing code (ADR-002). |
| D3 | Process questions about Gate 3, spec folders, worktrees, branches and commit or push permission never reach the queue or the record. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] `node --test` on `capture-core.test.mjs`, `sweep-transcript.test.mjs`, `sweep-devin.test.mjs` and `sweep-opencode.test.mjs` passes 35 of 35.
- [x] Two identical full-auto saves leave `decision-record.md` byte-identical, with one row per Q id.
- [x] A Gate 3, spec-folder, worktree or commit question creates no queue line and no record row.
- [x] `.skilled/hooks/decision-capture/claude/ask-capture-posttooluse.mjs`, fed `claude/fixtures/claude-posttooluse-askuserquestion.json`, writes exactly one queue line.
- [x] `validate.sh --strict` on `specs/system-speckit/043-decision-capture/001-decision-capture-build` prints `RESULT: PASSED`.
- [x] `git branch -r --contains` lists `origin/main` for each of commits `23b4f3d2e7`, `198c922956` and `5ce5feb336`.
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
| Node tests | Done | `node --test` on the four decision-capture test files: 35 pass, 0 fail, 2026-11-01 |
| Idempotent save, process filter, Claude adapter | Done | acceptance-criteria.md AC-006, AC-003 and AC-001, each Met |
| Strict validation | Done | `validate.sh --strict` on this folder, run after it became child 001 |
| Commit and push | Done | `git branch -r --contains` lists `origin/main` for all three commits |

### Deviations and findings

| Item | Note |
|------|------|
| Goal written after the work | This goal records criteria the build already met. The open gaps from Known Limitations are planned in siblings 002 to 006. |
<!-- /ANCHOR:log -->
