---
title: "Implementation Summary: Closing the Phase 12 Review Findings"
description: "Scenario 433 now tears its sandbox down without a signal, as CP-003 and CP-004 do. All three teardowns keep a sandbox they cannot check and remove with rm -r. One watched crash test timed how an orphaned sandbox daemon lets go of its files, and the phase 12 records now match their evidence."
trigger_phrases:
  - "phase 12 review findings summary"
  - "scenario 433 signal-free teardown"
  - "lsof self-check teardown"
  - "watched crash test result"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/030-pi-skill-orchestrator-based-research-refinement/013-review-follow-ups"
    last_updated_at: "2026-09-28T08:18:17Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Proved the parent goal's six criteria again from the final state"
    next_safe_action: "None. Phase 13 is complete"
    blockers: []
    key_files:
      - ".skilled/skills/system-spec-kit/manual-testing-playbook/ux-hooks/cli-hook-transport-down-fail-open.md"
      - ".skilled/skills/system-skill-advisor/manual-testing-playbook/compat-and-disable/global-disable-flag.md"
      - ".skilled/skills/system-skill-advisor/manual-testing-playbook/compat-and-disable/daemon-absent-fallback.md"
      - "evidence/crash-test/result.txt"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-28-030-phase-013"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: Closing the Phase 12 Review Findings

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 013-review-follow-ups |
| **Completed** | 2026-09-28 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A fresh Opus 5.5 review of phase 12 found one P1 and nine P2 problems, and the orchestrator confirmed all but one against the files. Scenario 433 no longer signals a process to clear its sandbox. The three sandbox teardowns now keep a folder they cannot check instead of removing it. One watched crash test observed what the crashed-launcher claim had only inferred, and the phase 12 records say only what their evidence shows. The reruns found one more problem: the generation check in 433 and CP-004 can read the live advisor's own reindex as a sandbox leak.

### Phase 13: review-follow-ups

**Scenario 433 (F1).** The scenario's default-budget hook call starts a sandbox advisor on every run. Its teardown matched the lease socket as text, sent `kill -TERM` to the lease pids and removed the folder without waiting, which is the design GPT-6 Luna failed twice in phase 12. The block now exports the 12-second idle timeout before its hook calls and ends with the same signal-free wait as CP-003 and CP-004. It unsets the timeout with the sandbox variables, so a live advisor started later from that shell keeps the default.

**The teardown guards (F3, F4, F9, F10).** Phase 12's wait read an empty `lsof` result as "no file open", so a missing or blocked `lsof` let it remove the sandbox without the open-file test. Each block now asks `lsof` for its own shell's open files first. When that prints nothing, it keeps the sandbox and prints `lsof cannot list open files here`. Each block also checks its variables before the wait and prints a rerun message when one is missing, because CP-004 step 5 printed `live generation file unchanged` in a shell that had lost step 2. The removal is now `rm -r`, which Codex's command guard allows and which fails on an empty path, and `sandbox removed` prints only when it succeeds. The kept-sandbox message reads "still running after the wait", since phase 12's 60 checks took 67 seconds in case A2.

**The watched crash test (F2).** On the operator's yes, one run killed a sandbox launcher after its cold-start call and removed its lease files, as the launcher's crash handler would. Samples every 0.1 seconds showed the orphaned daemon holding its databases and its socket until +15.63 seconds. At +15.74 seconds it held nothing in the sandbox while its socket file stayed, and at +15.85 seconds it was gone with the socket folder empty. So the lease-and-socket test alone would also have waited for this daemon, and the open-file test covered no extra time in this run. The result changed no block. It corrected phase 12's claim instead, and the live advisor stayed up in all 186 samples.

**The records (F5, F6, F10).** Phase 12's spec, goal and implementation summary were corrected in place, and its two evidence notes gained dated corrections. The live-launcher note now names the earlier case where a killed sandbox launcher left the live advisor running, and the legacy lease fallback, which finds nothing today. The carry-over record now lists the route manifest changes it missed. The advisor attaches a compiled route to a hub recommendation only as metadata, and none of the six scenarios that keep their phase 11 result checks it.

**The generation check (F12).** Two of the fifteen reruns, 433 in OpenCode and in Devin, printed `live generation file CHANGED`. The live daemon republishes that file about three seconds after any skill file it watches changes, and another session was editing watched sk-doc and system-spec-kit files at the time. In each window the new generation came from the live daemon after another session wrote a watched file, while a sandbox daemon publishes only under its own folder. Both runs passed when rerun with no live change in their window. The check stays, since the file records no writer and the live daemon also writes it when it starts, stops, scans or rebuilds. The test left is a rerun with no watched file changing, the live advisor's pids unchanged and no skill-graph scan or advisor rebuild running, and the triage in both scenario files now says so.

**Parent status and the manifest (F7, F11).** Phase 12's and this phase's derived metadata were refreshed before the parent's, so the parent reads its status from finished children. The frozen README manifest test ran before the push.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-spec-kit/manual-testing-playbook/ux-hooks/cli-hook-transport-down-fail-open.md` | Modified | Scenario 433: the signal-free wait with its 12-second idle timeout, the `lsof` self-check, the variable check, `rm -r` and F12's triage sentences |
| `.skilled/skills/system-skill-advisor/manual-testing-playbook/compat-and-disable/global-disable-flag.md` | Modified | CP-003 step 1 gains the self-check, the variable check, `rm -r` and the new kept-sandbox message |
| `.skilled/skills/system-skill-advisor/manual-testing-playbook/compat-and-disable/daemon-absent-fallback.md` | Modified | CP-004 step 5 gains the same four changes, and its "Live state changed" row gains F12's triage |
| `../012-reverify-follow-ups/spec.md`, `goal.md`, `implementation-summary.md`, `graph-metadata.json` | Modified | The corrections in F2, F6, F9 and F10, and the metadata derived from them |
| `../012-reverify-follow-ups/evidence/live-launcher-change.txt`, `evidence/goal-reverify/changes-since-phase-11.txt` | Modified | Dated corrections for F5 and F6 |
| `../goal.md`, `../spec.md`, `../graph-metadata.json` | Modified | The phase 13 binding and row, the corrected carry-over line, the child list and the refreshed status |
| `evidence/` | Created | Baselines, the guard checks, the crash test, Luna's four reports, the reruns with the generation monitor and trace, the live advisor restart, the final gates with the validator's HEAD baseline and the parent goal's proof under `goal-reverify/` |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The orchestrator made every edit, each a few lines with its own check, under the parent's amended D1, and recorded the baselines before the first one. The guard checks cut the teardown from each scenario file as it stands and from HEAD, which held phase 12's form. They ran both with `lsof` hidden from `PATH`, with it visible and in an empty environment, in bash and in zsh. The three new blocks then ran as written with real sandbox daemons, and the watched crash test ran once. GPT-6 Luna max fast through cli-codex passed the three blocks on its first verify. Then each scenario reran in cli-pi, cli-opencode, cli-devin, cli-cursor and cli-codex, two at a time. When two 433 runs printed `CHANGED`, the hook diagnostics log gave each block's window and a read-only monitor started timing every change to the live generation file. Each run was then traced, recorded as F12 and rerun once. Luna's first verify of the trace and triage failed three of its four checks and its second failed one. Each was corrected before the next, and the third passed. Then the parent goal's six criteria were proved again from the final state. Three commits from another session landed after that proof, so the four suites, the live plugin load and the installer check ran again at `396d26d4ff`. Its next two commits added a spec packet and rebuilt the trigger index, with no code change.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| The self-check asks `lsof` about the shell's own files | An empty answer about the sandbox means either that nothing is open or that `lsof` could not look. The shell always has files open, so an empty answer about it can only mean `lsof` cannot run here |
| A block that cannot check keeps its sandbox | A kept folder with a message is a leftover the tester sees. A folder removed under a live daemon comes back unseen |
| The variable check runs before the wait | Without it, a shell that had lost step 2 printed the success line, and its removal would have run on an empty path |
| `rm -r` instead of `rm -rf` | Codex's command guard refuses `rm -rf`, and `rm -r` fails on an empty path where `rm -rf` exits 0 |
| The open-file test stays after the crash test | The crash test watched one fault once. The test costs one `lsof` scan per check and still guards a crash during the startup scan, when phase 12 saw the daemon hold its database before its socket existed |
| Luna's PID-namespace note is recorded, not changed | It cannot arise in these macOS runs, and a check across namespaces would need a tool the scenarios cannot count on |
| The generation check stays as written after F12 | The file records no writer, so no check inside the block can tell the live daemon's own writes from a sandbox write. A rerun with no watched file changing, the live advisor's pids unchanged and no scan or rebuild running narrows it to the sandbox, so the triage asks for one. A writer field would need an advisor runtime change that no finding covers |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Guard checks, `lsof` hidden | Phase 12's CP-003 and CP-004 removed their sandbox. All three new blocks kept theirs and printed `lsof cannot list open files here`, in bash and zsh (`evidence/guard-checks/summary.txt`) |
| Guard checks, empty environment | Each new block printed only its rerun message. Phase 12's CP-004 step 5 printed `live generation file unchanged` |
| As written, real sandbox daemons | 433, CP-003 step 1 and CP-004 steps 2 to 5 each printed `sandbox advisor exited; sandbox removed`, and no sandbox folder came back within 60 seconds. The live advisor, generation file and lease matched before and after (`evidence/guard-checks/as-written/`) |
| Watched crash test | Ran once. The daemon let go of its databases and socket within one 0.11-second interval, then exited at +15.85 seconds. CP-004 step 5 as written removed the sandbox at +25.71 seconds, and the live advisor stayed up in all 186 samples (`evidence/crash-test/result.txt`) |
| GPT-6 Luna, the three blocks | PASS, six checks of six, on the first verify (`evidence/luna-verify/report-1.txt`) |
| GPT-6 Luna, the F12 trace and triage | PASS on the third verify. The first failed three of its four checks and the second failed one. Each was corrected before the next (`evidence/luna-verify/report-2.txt` to `report-4.txt`) |
| Reruns in the five CLIs | 15 runs, two at a time: 13 PASS. The two FAILs, 433 in OpenCode and in Devin, printed `live generation file CHANGED` because the live daemon reindexed on another session's edit inside the block's window (`evidence/reruns/generation-trace.txt`). Both passed when rerun with no live change in the window (`evidence/reruns/quiet-reruns/`). All 17 reports quote `sandbox advisor exited; sandbox removed`. No tester changed a teardown command, the three Codex testers ran `rm -r` as written and Cursor's sandbox let `lsof` run. Besides dropping the missing `gtimeout` from 433's hook calls, testers added only read-only checks, `set -x` tracing or an exit-code echo. The one exception is Cursor's CP-004 tester, which created the sandbox socket folder before step 3, and step 3 still returned `connect ENOENT`. No sandbox folder remained (`evidence/reruns/state-after.txt`) |
| `validate_document.py` | 0 issues on each of the three scenario files, as on their HEAD copies (`evidence/final-gates.txt`, `evidence/validate-document-baseline.txt`) |
| Route guard, Hermes check and README manifest | Each matches its T002 baseline. The route guard exits 0, 71 Hermes copies are in sync and the manifest test reports `reproduced=True`. No sandbox folder is left in `/tmp` (`evidence/final-gates.txt`) |
| Strict validation | `validate.sh --strict --recursive` on packet 030 prints `RESULT: PASSED` for all 14 folders, after `repair-derived.cjs` refreshed phase 12's and this phase's metadata and then the parent's. The first run failed phase 12 alone, on metadata left stale by this phase's corrections to its docs. The parent's `graph-metadata.json` reads `"status": "complete"` (`evidence/strict-validate.txt`, `evidence/final-gates.txt`) |
| Parent goal: OpenCode plugin live load | PASS at `396d26d4ff`. `opencode run --print-logs` exits 0 with no `failed to load plugin` line, and the session lists `spec_kit_skill_advisor_status` (`evidence/goal-reverify/opencode-plugin-live-load.txt`) |
| Parent goal: the four suites | PASS at `396d26d4ff`. Advisor 129 files with 971 passed and 6 skipped, after a clean typecheck. Spec-kit hook files 237 passed and 7 skipped, with the Copilot file skipping itself. Pi dispatch 50 of 50 and plugin 35 of 35. Every count matches the run at `4f4d25288c` (`evidence/goal-reverify/`) |
| Parent goal: sandboxed daemon | PASS at `4f4d25288c`. CP-004 steps 2 to 5 as written answered live from the sandbox, printed `live generation file unchanged` and removed the sandbox in 28 seconds. The live generation file, the lease and the advisor pids matched before and after (`evidence/goal-reverify/crit3-sandbox-daemon.txt`) |
| Parent goal: the nine scenarios | PASS. 433, CP-003 and CP-004 pass in all five CLIs, two 433 runs on a quiet rerun. The other six keep their phase 11 result, 30 of 30. The one code change since that matrix in the paths they run through is `b274f085fb`, which adds a function to the hook flags and changes no existing one (`evidence/goal-reverify/changes-since-phase-11.txt`, `hook-flags-diff.txt`) |
| Parent goal: `install-codex-hooks.mjs --check` | PASS at `396d26d4ff`, `install-codex-hooks: OK ~/.codex/hooks.json` (`evidence/goal-reverify/install-codex-hooks-check.txt`) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The self-check trusts one PID namespace.** GPT-6 Luna noted that in a restricted or shared-volume PID namespace, `lsof -t -p $$` could see the shell while `lsof -t +D` misses a process in another namespace that holds a sandbox file. These macOS runs cannot reach that case, so it stays recorded here.
2. **The crash test watched one fault once.** It killed a launcher after its call had answered. It did not cover a crash during the daemon's startup scan, when phase 12 saw the database open before the socket existed. The teardown runs only after the cold start has answered, so it meets a daemon past that scan.
3. **Six scenarios keep their phase 11 result.** CL-001, CL-005, CL-006, NC-001, NC-004 and 457 were not rerun. The one code change since then in the paths they run through adds a function to the hook flags and changes no existing one, but a CLI update could still move a result, and only a rerun would show it.
4. **Scenario 433 still names `gtimeout`.** It is not installed here, so the testers ran the three hook calls without it, as in phases 11 and 12.
5. **The generation check cannot name its writer.** Where other sessions edit skill files, 433 and CP-004 can print `CHANGED` for the live advisor's own reindex. A `CHANGED` line points to the sandbox only on a rerun with no watched file changing, the live advisor's pids unchanged and no skill-graph scan or advisor rebuild running, and even then it does not name the writer. A check that names it would need a writer field in the generation file.
6. **Four advisor changes during the phase have no confirmed cause.** Launcher 33066 gave way to 87524 at 06:47:40Z, before this phase's first check, and generation 562 came from the new launcher's startup scan. Worktree 069's launcher 9479 and daemon 9492 were gone by 07:24:53Z. At 07:51:42Z live daemon 87539 shut down on a SIGTERM and a new daemon did the same 0.67 seconds after its scan. Launcher 21222 with daemon 21257 has served since. The launcher's dead-socket respawn is the likely path, but the live launcher keeps no log to show it. Barter's launcher 86318 and daemon 86320, listed at 07:50:21Z, were gone by 07:55:30Z. No command of this phase named any of those advisors' sockets or databases or sent them a signal (`evidence/live-advisor-change.txt`, `evidence/live-advisor-restart.txt`, `evidence/reruns/state-before.txt`).
<!-- /ANCHOR:limitations -->

---
