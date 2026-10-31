---
title: "Goal: Phase 19: follow-up-fixes"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "follow up fixes goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-speckit/054-weak-model-spec-authoring/019-follow-up-fixes"
    last_updated_at: "2026-10-26T19:30:00Z"
    last_updated_by: "phase-doc-writer"
    recent_action: "Recorded both fixes, the review and the remediation"
    next_safe_action: "None: phase complete"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "054-019-follow-up-fixes"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 19: follow-up-fixes

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE
<!-- FILL: Write one sentence: what the packet is for, not how. GOOD: Keep only the newest n archives on request. WEAK: Improve the script. -->

**Objective:** Keep the goal-file manifest check off fsmonitor, and keep one dirty speed-loop sandbox from dropping its variant for the rest of a run.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | `check-goal-file-manifest.sh` keeps mode 100755 and its fail-closed exit 2 |
| D2 | A re-prepared sandbox is kept only when its snapshot head matches the head recorded at the start of the run |
| D3 | The loop is checked only with `--dry-run`; no paid model run is dispatched for this phase |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA
<!-- FILL: Write one command-checkable criterion per line. GOOD: `--keep 3` leaves 3 archives in `logs/archive` and exits 0. WEAK: The work is done. -->

- [x] `npx vitest run --project cli tests/recursive-child-manifest.vitest.ts` exits 0 with `Tests  2 passed (2)`
- [x] `git diff` on the manifest script shows `100755` and no `old mode` line
- [x] The `loop.sh` dry run exits 0, reuses both sandboxes and leaves the results folder at 8 entries
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
| Change A, fsmonitor off | Done | `rg -c 'core.fsmonitor=false'` prints 2; vitest `Tests  2 passed (2)` |
| Change B, re-prepare between rounds | Done | `bash -n loop.sh` exit 0; dry run exit 0, 158 lines |
| Review | Done | `scratch/review.md`: one P1, three P2s |
| Remediation | Done | `ls -l` prints `-rwxr-xr-x`; `PREPPED` at loop.sh lines 93, 106, 143 |
| Refusal made final | Done | `REFUSED` at loop.sh lines 135 and 164; `scratch/test/reprepare-harness.sh` exit 0 |

### Deviations and findings

| Item | Note |
|------|------|
| Weak-model edit dropped the executable bit | DeepSeek V4.1 Flash wrote the file back as 100644; the remediation pass ran `chmod +x` |
| Leak check only with a terms file | The brief asked for `task_term_refs=0` on every re-prepare; the loop requires it only when the task has a terms file, as the start-of-run gate does |
| One P2 left open | An orphan directory after a failed prepare; optional. The refusal-retry P2 is fixed |
<!-- /ANCHOR:log -->
