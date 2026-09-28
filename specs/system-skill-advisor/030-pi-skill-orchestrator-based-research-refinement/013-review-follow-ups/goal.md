---
title: "Goal: Closing the Phase 12 Review Findings"
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
    packet_pointer: "system-skill-advisor/030-pi-skill-orchestrator-based-research-refinement/013-review-follow-ups"
    last_updated_at: "2026-09-28T08:18:17Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Closed F1 to F12 and proved the parent goal again"
    next_safe_action: "None. Every criterion holds"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-28-030-phase-013"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Closing the Phase 12 Review Findings

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Close every finding the fresh review of phase 12 confirmed, so scenarios 433, CP-003 and CP-004 tear down safely in every CLI and the phase 12 records match their evidence.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | A defect found while closing a finding goes into `spec.md` before any work on it starts. |
| D2 | The three teardown blocks send no signal. Only the watched crash test signals, and only its own sandbox launcher after checking the lease socket, the pid and the command. Nothing in this phase signals the live advisor. |
| D3 | The watched crash test runs once, on the operator's yes of 2026-09-28. |
| D4 | No file another session has changed is staged or rewritten. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `cli-hook-transport-down-fail-open.md` has no `kill` line, and its block exports `SPECKIT_LAUNCHER_IDLE_TIMEOUT_MIN=0.2` and removes its sandbox only after the signal-free wait
- [ ] With `/usr/sbin` left out of `PATH`, the teardown in scenario 433, CP-003 step 1 and CP-004 step 5 keeps its sandbox and prints `lsof cannot list open files here`, and CP-004 step 5 run in an empty environment prints neither `live generation file unchanged` nor `sandbox removed`
- [ ] GPT-6 Luna max fast through cli-codex returns PASS on the three teardown blocks
- [ ] Scenarios 433, CP-003 and CP-004 report PASS in cli-pi, cli-opencode, cli-devin, cli-cursor and cli-codex, or a FAIL traced to a named environment limit, and no `/tmp/cli-playbook.*`, `/tmp/cp003.*` or `/tmp/cp004.*` folder remains
- [ ] The watched crash test has run once and recorded the sandbox socket, the daemon's open database, the daemon and the live advisor's pid at 0.1-second intervals until the daemon exits
- [ ] Packet 030's `graph-metadata.json` reads `"status": "complete"`, `test_readme_manifest.py` reports `reproduced=True` and `validate.sh` on packet 030 with `--strict --recursive` prints `RESULT: PASSED` for every folder
- [ ] The fixes are committed and pushed to origin/main
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
| Phase opened | Done | Scaffolded with `create.sh`, baselines in `evidence/baselines.txt` |
| F1 scenario 433 teardown | Done | No `kill` line. The block exports the 12-second idle timeout and waits without a signal. Run as written, it removed its sandbox and nothing came back within 60 seconds (`evidence/guard-checks/as-written/`) |
| F3, F4 and F9 teardown guards | Done | With `lsof` hidden, phase 12's CP-003 and CP-004 removed their sandboxes and all three new blocks kept theirs, in bash and zsh. In an empty environment the new blocks printed only their rerun message (`evidence/guard-checks/summary.txt`) |
| GPT-6 Luna verify | Done | PASS, six checks of six, on the first verify (`evidence/luna-verify/report-1.txt`) |
| F2 watched crash test | Done | Ran once. The orphaned daemon let go of its database and its socket inside one 0.1-second interval, and the live advisor stayed up in all 186 samples (`evidence/crash-test/result.txt`) |
| F5, F6 and F10 record fixes | Done | Corrected in place in phase 12's spec, goal and implementation summary, with dated notes added to its two evidence records |
| F7 parent status | Done | Phase 12's and this phase's derived metadata were refreshed before the parent's, and the parent's `graph-metadata.json` reads `"status": "complete"` (`evidence/final-gates.txt`) |
| F12 generation check | Done | Both `CHANGED` lines traced to the live advisor's reindex on another session's edit, and both runs passed a quiet rerun. The triage in 433 and CP-004 now names the live writers and the quiet-rerun conditions. GPT-6 Luna's first verify failed three checks and its second failed one. The third passed (`evidence/reruns/generation-trace.txt`, `evidence/luna-verify/report-2.txt` to `report-4.txt`) |
| Reruns in the five CLIs | Done | 15 runs, 13 PASS. 433 failed in OpenCode and Devin on the live advisor's own reindex, which is F12, and both passed on a quiet rerun. Every tester quoted `sandbox advisor exited; sandbox removed`, no tester changed a teardown command and no sandbox folder remained (`evidence/reruns/`) |
| Parent goal proved again | Done | The four suites, the live plugin load, the sandboxed daemon and the installer check pass, and the suites, the plugin load and the installer check passed again at `396d26d4ff`. The other six scenarios keep their phase 11 result. The one code change since that matrix in the paths they run through, `b274f085fb`, adds a function to the hook flags and changes no existing one (`evidence/goal-reverify/`) |

### Deviations and findings

| Item | Note |
|------|------|
| Review findings | A fresh Opus 5.5 review of phase 12 returned REQUESTED_CHANGES with one P1 and nine P2 findings. The orchestrator confirmed the P1 and eight P2s against the files and judged F8, cli-devin's undefined "task", a matter the operator had already approved |
| Found by the orchestrator | Phase 12's commit broke sk-doc's frozen README manifest test on main until another session's `fda380addc`. Recorded as F11 |
| Review count corrected | The review said the 457 record's pairs cover 6 files. They cover 10, and five are byte-identical adapter summaries, so they hold 6 distinct hashes. Per D1 the F10 bullet in `spec.md` was corrected before the phase 12 records were |
| Live advisor changed before the first check | Launcher 33066 gave way to 87524 at 06:47:40Z, with generation 562 from its startup scan. No tool call of this phase ran then, and no check had started. The checks took 87524 as their baseline (`evidence/live-advisor-change.txt`) |
| Crash test summary line | The first summary read a 0.10-second window where only the open-file check saw the daemon. That was scan lag: the samples show no such window. `summarize.py` was corrected and rerun on the same logs, and the crash test was not rerun (`evidence/crash-test/result.txt`) |
| Luna's note | In a restricted or shared-volume PID namespace, `lsof -t -p $$` could see the shell while `lsof -t +D` misses a holder in another namespace. Not reachable in these macOS runs, so it is recorded as a limitation, not changed |
| Worktree 069 advisor | Its launcher 9479 and daemon 9492 were listed at 07:09:10Z and gone at 07:24:53Z. No command of this phase named that worktree's socket or database, and the advisor suites that ran from 07:21:15Z use temporary workspaces. The cause is not known |
| F12 found in the reruns | Two 433 reruns printed `live generation file CHANGED` for the live advisor's own reindex on another session's edits. Per D1 it went into `spec.md` as F12 before the triage text was written |
| Live advisor restart | At 07:51:42Z the monitor recorded live daemon 87539 shutting down on a SIGTERM, then a new daemon doing the same 0.67 seconds after its scan. Launcher 21222 and daemon 21257 have served since. No sandbox existed, no command of this phase sent a signal and D2 held. The likely path is the launcher's dead-socket respawn, which is outside this phase (`evidence/live-advisor-restart.txt`) |
| Barter's advisor | Its launcher 86318 and daemon 86320 were listed at 07:50:21Z and gone by 07:55:30Z. No command of this phase named Barter's socket or database |
| Three commits after the goal proof | Another session committed `b274f085fb`, `3303e85a43` and `396d26d4ff` at about 08:02Z, after the suites ran at `4f4d25288c`. They add a named-switch function to the hook flags and validation off switches to `validate.sh` and the sk-doc validators. The four suites, the live plugin load and the installer check ran again at `396d26d4ff` with the same results, and neither off switch was set for the final checks (`evidence/goal-reverify/hook-flags-diff.txt`). Its next two commits, `6fe740a282` and `0e7c046902`, change no code. They add its spec packet and rebuild the trigger index |
<!-- /ANCHOR:log -->
