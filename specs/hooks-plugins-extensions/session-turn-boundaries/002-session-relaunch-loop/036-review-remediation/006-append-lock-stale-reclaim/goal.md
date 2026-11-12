---
title: "Goal: Phase 6: append-lock-stale-reclaim"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "append lock stale reclaim goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "scaffold/006-append-lock-stale-reclaim"
    last_updated_at: "2026-11-12T14:17:06Z"
    last_updated_by: "orchestrator"
    recent_action: "Closed the phase after a design amendment and an SWE review"
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
# Goal: Phase 6: append-lock-stale-reclaim

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Remove a stale append lock under a reclaim directory with a second age check so waiters cannot both acquire the lock.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | A waiter that finds a stale lock takes `<lockPath>.reclaim`, reads the lock's age again while holding it and removes the lock only when it is still stale. Amended by the operator on 2026-11-12 from the rename design |
| D2 | Only one waiter at a time reclaims. A waiter that finds the reclaim directory taken waits and retries, and removes a reclaim directory older than the stale bound |
| D3 | The wait bound and the run-without-lock fallback keep their current behaviour. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] `node --test .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs` exits 0 with cases where two waiters and eight waiters never hold the lock together.
- [x] `rg -c 'const reclaimPath' .skilled/hooks/session-relaunch/lib/relaunch-core.cjs` prints 1.
- [x] `rg -c 'rmdirSync\(lockPath\)' .skilled/hooks/session-relaunch/lib/relaunch-core.cjs` prints 2, the reclaim and the release.
- [x] `rg -n 'APPEND_LOCK_WAIT_MS = 2000' .skilled/hooks/session-relaunch/lib/relaunch-core.cjs` prints one line.
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
| Phase 6 planning documents | Done | Five files written in `specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/036-review-remediation/006-append-lock-stale-reclaim` on 2026-11-12. The measured behavior is the `rg -n 'APPEND_LOCK_STALE_MS|rmdirSync\(lockPath\)'` output in `spec.md` |
| Build, three passes | Done | DeepSeek V4.1 Flash at max through OpenCode Go. `scratch/red.txt`, `scratch/red-2.txt` and `scratch/red-3.txt` hold the failing runs, `scratch/green.txt` the passing file (148 tests, 148 pass, 0 fail) |
| Stress probe | Done | 0 overlaps in five runs of 60 rounds with eight waiters and in 30 rounds with sixteen |
| Review | Done | SWE through Devin, read-only, on `scratch/review.diff`: CONDITIONAL with one P1 and two P2. The P1 and one P2 fixed, one P2 recorded as a limitation |
| Suites | Done | Relaunch suite 861 of 861, OpenCode plugin 65 of 65, Pi 59 of 59, each exit 0 |
| Second review | Done | SWE through Devin, read-only, on the later passes: PASS with one P2 on `withStateLock`. DeepSeek V4.1 Flash fixed it test first, `scratch/red-4.txt` (1 test, 1 fail), then 149 of 149. Stress probe 0 overlaps. Relaunch suite 865 of 865, OpenCode plugin 65 of 65, Pi 59 of 59 |

### Deviations and findings

| Item | Note |
|------|------|
| Design amended by the operator | The frozen rename design was measured in a scratch copy with one stale lock and eight waiters: 127 to 176 overlapping critical sections per 60 rounds, and 0 with two waiters. The reclaim directory measured 0 overlaps in 180 rounds of eight waiters and 30 rounds of sixteen. Asked on 2026-11-12 which design ships, the operator answered Reclaim directory. D1, D2 and two criteria were reworded. The wait bound and the run-without-lock fallback stay as they are. |
| First build followed an incomplete brief | The orchestrator's first brief asked for the rename without the identity check, and its two-waiter test passed. An eight-waiter stress run measured 318 overlaps per 60 rounds for that build against 77 on the unchanged checkout, which is what exposed the design. |
| Scope grew by one helper | `withStateLock` carries the phase 002 review finding, so a record lock is never created inside an unsafe state directory, while a handoff-note lock in a linked directory keeps working. |
<!-- /ANCHOR:log -->
