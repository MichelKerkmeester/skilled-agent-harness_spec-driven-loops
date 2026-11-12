---
title: "Goal: Phase 2: state-dir-read-check"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "state dir read check goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "scaffold/002-state-dir-read-check"
    last_updated_at: "2026-11-12T10:33:57Z"
    last_updated_by: "orchestrator"
    recent_action: "Closed the phase after one follow-up pass and an SWE review"
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
# Goal: Phase 2: state-dir-read-check

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Make every relaunch record read subject to the same real-directory and owner check as a write, and refuse a `handoff` path outside the handoffs directory.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | `readRelaunchFile` applies the same real-directory and owner check as `ensureStateDir` before it reads, without creating the directory. |
| D2 | A directory that fails the check reads as no record and is logged. |
| D3 | `consume` refuses a `handoff` value that `handoffPathWithinRepo` rejects. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] `node --test .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs` exits 0 with a case where a record behind a symlinked state directory reads as null.
- [x] `node --test .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs` exits 0 with a case where a record behind a foreign-owned state directory reads as null.
- [x] `node --test .skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs` exits 0 with a case where a `handoff` outside the handoffs directory is refused.
- [x] `node --test .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs .skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs` exits 0.
- [x] `rg -n 'function readRelaunchFile' .skilled/hooks/session-relaunch/lib/relaunch-core.cjs` prints one line with `loopId` and `env` as its two parameters.
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
| Planning | Done | Authored `spec.md`, `plan.md`, `tasks.md`, `acceptance-criteria.md` and this goal, and `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/036-review-remediation/002-state-dir-read-check --strict --quiet` printed `RESULT: PASSED`. |
| Build, two passes | Done | `scratch/red.txt` and `scratch/red-2.txt` hold the failing runs, `scratch/green.txt` the passing files (369 tests, 369 pass, 0 fail) |
| Review | Done | SWE through Devin, read-only, on `scratch/review.diff`: PASS with three P2. Two fixed in the second pass, one moved to phase 006 |
| Suites | Done | Relaunch suite 831 of 831, OpenCode plugin 65 of 65, Pi 59 of 59, each exit 0 |

### Deviations and findings

| Item | Note |
|------|------|
| Scope grew by one reader | The review found `readStateFile` in `nudge.cjs` reading the same directory without the check. REQ-004 adds it. The lock directory finding moved to phase 006 as its REQ-005. One existing `consume` case now creates the handoffs directory, because a note in a missing handoffs directory is dropped. |
<!-- /ANCHOR:log -->
