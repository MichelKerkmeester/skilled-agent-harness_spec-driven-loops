---
title: "Goal: Phase 9: nudge-note-lines"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "nudge note lines goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/009-nudge-note-lines"
    last_updated_at: "2026-11-13T09:30:00Z"
    last_updated_by: "planner"
    recent_action: "Planned the phase from research section 9 ranks 1, 3, 4 and 12"
    next_safe_action: "Wait for the operator greenlight, then run T001"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-009-nudge-note-lines"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 9: nudge-note-lines

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Make every hand-over name the workers, scheduled tasks and added directories the sending session leaves behind, and stop a fan-out runner before its lock is released, so the receiver checks before it starts the same work again.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | `prepare` requires only the `Running workers:` line. `Scheduled:` and `Added directories:` are asked for and read, never required. |
| D2 | The check lives in `validatedNote` in `bin/session-relaunch.cjs`, behind an option only `prepare` sets, and runs before the goal packet write. `keep`, `core.validateHandoff` and `HANDOFF_SECTIONS` stay unchanged. |
| D3 | A usable `Running workers:` value is `none`, in any case, or a value that holds at least one `pid <digits>`. A leading `- ` is allowed. Workers on one line are separated by ` \| `. |
| D4 | The worker check seed step appears on every seed. The scheduled and directory steps appear only on a hop seed, never after a compaction, because a compacted session kept both. |
| D5 | The runner stop is part of the one deep-loop step right before `prepare`: `kill -TERM`, wait until `kill -0` fails, then the existing release form. |
| D6 | The `/speckit:handoff` template and the live hop harness note change in this phase, so their notes still pass `prepare`. The README and the playbook wait for phase 017. |
| D7 | Test first. Each must-fail test holds a recorded failing run before its source edit. |
| D8 | Nothing is built before the operator's greenlight, and nothing is pushed or merged without the operator. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `env -u AI_SESSION_CHILD node --test .skilled/hooks/session-relaunch/tests/*.test.cjs .opencode/plugins/tests/*.test.cjs` exits 0 with `fail 0`.
- [ ] `rg -c '\| Met \|' specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/009-nudge-note-lines/acceptance-criteria.md` prints 12.
- [ ] `rg -c '^not ok' specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/009-nudge-note-lines/scratch/red.txt` prints 7.
- [ ] `git diff --name-only -- .skilled .opencode` lists only the six files named in `spec.md`.
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/009-nudge-note-lines --strict` prints `RESULT: PASSED`.
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
| Planning documents | Done | Five documents written on 2026-11-13 from `../research/research.md` section 9 and the live run in `../scratch/live-hops-claude-2026-11-13/10-background-worker-orphaned/`. Baseline of the three test files: 280 of 280 pass |
| T001 runner stop | Pending | Waits for the greenlight |
| T002 scheduler and add-dir | Pending | Waits for the greenlight |
| Build | Pending | Waits for the greenlight |

### Deviations and findings

| Item | Note |
|------|------|
| `/speckit:handoff` template in scope | The brief names only `nudge.cjs` and `prepare`. A `prepare` that requires `Running workers:` would refuse notes from `.skilled/commands/speckit/handoff.md:116-133`, which mirrors the nudge, so the plan adds that file. Open question: keep it here or move it to phase 017? |
| `prepare` never checked the `Active command:` line | `validateHandoff` at `lib/relaunch-core.cjs:364-394` checks status, session and the four sections only. The new line is the first line-level check, so it lives in the CLI and leaves `claim` and other readers alone |
| The runner is foreground by design | `deep-research-confirm.yaml:248` runs `fanout-run.cjs` with `wait_for_completion: true`. A runner is alive at `prepare` only after a backgrounded or timed-out tool call, so the step is worded for that case |
| Open question: added directories | Whether a Claude Code session can add a directory itself is UNCONFIRMED. T002 checks. The planned seed text asks the operator to run `/add-dir`, which holds either way |
<!-- /ANCHOR:log -->
