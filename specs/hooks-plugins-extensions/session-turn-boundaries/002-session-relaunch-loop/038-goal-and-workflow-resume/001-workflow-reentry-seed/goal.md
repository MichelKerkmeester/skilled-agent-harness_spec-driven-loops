---
title: "Goal: Phase 1: workflow-reentry-seed"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "workflow reentry seed goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "scaffold/001-workflow-reentry-seed"
    last_updated_at: "2026-11-13T03:55:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Closed the phase after the build, the review fixes and the final suite run"
    next_safe_action: "None; phase closed"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "[SESSION-ID]"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 1: workflow-reentry-seed

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** After a hop the receiver runs the sender's command again, reads the goal of the phase it works, and a Codex sender names its goal in the note.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The active command travels as one line under `## In-flight state`. No relaunch record field and no new module, per parent D3. |
| D2 | The receiver runs the command again with the same mode and arguments. The command's own state detection picks the step. |
| D3 | The sender releases a held deep-loop lock before prepare, with the `--lock-path`, `--owner-pid` and `--nonce` values the command captured. |
| D4 | Codex gets a prose route only. The sender writes an `Active goal:` line and the receiver brings the goal back with `create_goal`. |
| D5 | Only `nudge.cjs`, `handoff.md` and `nudge.test.cjs` change. The record format, `relaunch-core.cjs` and the CLI stay as they are. |
| D6 | The review's fixes for a cleared Claude goal, the shared goal off switch and the resend reminder stay out, per parent D4. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] `node --test .skilled/hooks/session-relaunch/tests/nudge.test.cjs` exits 0 with the five new cases and the existing note shape case.
- [x] `node --test .skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs` exits 0.
- [x] `rg -n -e 'Active command' -e 'Active goal' -e 'goal\.md' -e 'release --owner-pid' .skilled/hooks/session-relaunch/lib/nudge.cjs .skilled/commands/speckit/handoff.md` prints at least one line for each term in each file.
- [x] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/001-workflow-reentry-seed --strict` prints `RESULT: PASSED`.
- [x] Every row of `acceptance-criteria.md` is `Met`.
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
| Planning | Done | 2026-11-12: authored `spec.md`, `plan.md`, `tasks.md`, `acceptance-criteria.md` and this goal from `scratch/finding.md`. |
| Baseline | Done | 2026-11-12: `node --test .skilled/hooks/session-relaunch/tests/nudge.test.cjs` exited 0 with `fail 0`. |
| Validation | Done | 2026-11-12: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/001-workflow-reentry-seed --strict` printed `RESULT: PASSED` with 0 errors. |
| Strict-run metadata repair | Recorded | The Draft auto-repair re-derived `graph-metadata.json` and normalized the `implementation-summary.md` packet pointer. No planning content was written in either file. |
| Build | Done | Luna built it through `codex exec` at xhigh, test first: `scratch/red.txt` holds the failing run and `scratch/green.txt` the passing one. The orchestrator then changed one sentence: the receiver step named `create_goal`, which only Codex has, so it now also tells a receiver without it to name the goal to the operator. |
| Suites | Done | The orchestrator reran every suite outside the builders' sandboxes from the final working tree: relaunch and OpenCode plugin suites 1471 of 1471, goal hook suites 200 of 200, Pi relaunch suite 59 of 59, each exit 0. |

### Deviations and findings

| Item | Note |
|------|------|
| None yet | No implementation has run. |
<!-- /ANCHOR:log -->
