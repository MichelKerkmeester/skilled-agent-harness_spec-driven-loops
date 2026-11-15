---
title: "Goal: Phase 1: shim-wrapper-trust"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "shim wrapper trust goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "scaffold/001-shim-wrapper-trust"
    last_updated_at: "2026-11-12T09:59:40Z"
    last_updated_by: "orchestrator"
    recent_action: "Closed the phase after two fix rounds and an SWE review"
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
# Goal: Phase 1: shim-wrapper-trust

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Run a `skilled-loop` wrapper only when it belongs to the checkout the shim was sourced from.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The shim records the real path of the checkout it was sourced from once at source time. |
| D2 | The shim runs a wrapper only when the wrapper's real path is inside that checkout. A repository whose `.skilled` is a link to that checkout still qualifies. |
| D3 | Any other wrapper is ignored and the plain runtime binary runs. A linked worktree of that checkout is trusted when the checkout's own `git worktree list` reports it. Any other checkout is trusted only when `SKILLED_LOOP_TRUSTED_CHECKOUTS` names it. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] `node --test .skilled/hooks/session-relaunch/tests/skilled-loop-shell.test.cjs` exits 0 and its output names a case where a wrapper outside the sourced checkout is not run.
- [x] `/bin/bash -n .skilled/bin/skilled-loop-shell.sh` and `/bin/zsh -n .skilled/bin/skilled-loop-shell.sh` both exit 0.
- [x] `rg -c 'sourced checkout' .skilled/bin/README.md` prints at least `1` and `rg -c 'sourced checkout' .skilled/hooks/session-relaunch/README.md` prints at least `1`.
- [x] `rg -n 'bash "\$wrapper"' .skilled/bin/skilled-loop-shell.sh` prints the launch line, so a trusted wrapper still runs through the wrapper path.
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
| Planning | Done | Authored `spec.md`, `plan.md`, `tasks.md`, `acceptance-criteria.md` and this goal for the trust check. |
| Build, three passes | Done | `scratch/red.txt`, `scratch/red-2.txt` and `scratch/red-3.txt` hold the failing runs, `scratch/green.txt` the passing shim file (30 tests, 30 pass, 0 fail) |
| Review | Done | SWE through Devin, read-only, on `scratch/review.diff`: CONDITIONAL with one P1 and four P2. The P1 and two P2 were confirmed and fixed, two P2 are recorded as limitations |
| Full relaunch suite | Done | 827 tests, 827 pass, 0 fail, exit 0, in `scratch/green-full.txt` |

### Deviations and findings

| Item | Note |
|------|------|
| Two fix rounds | The first build passed its tests and still held three defects the orchestrator found by reading the diff: a zsh `path` variable tied to `PATH`, a fallback that trusted the shell's start directory, and a git query that could run with an empty checkout. The review then found that an inherited `GIT_DIR` redirects the worktree list. REQ-007 and REQ-008 record both. |

Open question, answered 2026-11-12: the operator's extra trusted checkouts live in `SKILLED_LOOP_TRUSTED_CHECKOUTS`, and registered linked worktrees need no entry.
<!-- /ANCHOR:log -->
