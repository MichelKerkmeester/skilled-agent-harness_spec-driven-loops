---
title: "Implementation Summary: Phase 16: deem-local-hardening"
description: "deem-ctl now starts the local Deem server with its access log on and appends to server.log, so a request's line survives a restart. The CORS exposure stays accepted, DEEM_N_ORDERS stays at 1 and a reviewed copy of deem-ctl sits in git beside the fact sheet. Built and committed as 10697dcceb, 6 of 6 acceptance criteria Met."
trigger_phrases:
  - "deem hardening summary"
  - "deem hardening status"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/016-deem-local-hardening"
    last_updated_at: "2026-09-28T11:45:00Z"
    last_updated_by: "closure-leaf"
    recent_action: "Closed the phase: 6 of 6 AC Met"
    next_safe_action: "Orchestrator commits the phase docs"
    blockers: []
    key_files:
      - "specs/cli-jev/003-cli-jev-workflow-integration/007-classifier-deep-research/context/deem-ctl"
      - "specs/cli-jev/003-cli-jev-workflow-integration/007-classifier-deep-research/context/deem-local.md"
      - "specs/cli-jev/003-cli-jev-workflow-integration/016-deem-local-hardening/scratch/w3-build/build-evidence.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-016-deem-local-hardening"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "When may the dated backup ~/.local/share/deem/bin/deem-ctl.bak-2026-09-28 be removed"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: Phase 16: deem-local-hardening

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 016-deem-local-hardening |
| **Status** | Complete |
| **Completed** | 2026-09-28 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The local Deem server's log can now tell you whether anything called it during a window, and the script that runs the server has a reviewed copy in git.

### Phase 16: deem-local-hardening

**The access log.** `deem-ctl`'s `start_server` now starts Deem's server with `DEEM_ACCESS_LOG=1` in its environment, a switch the server already reads (`deem_server.py:795`). It also appends to `server.log` with `>>` where it used to truncate the file with `>`. Each request writes one line, such as `127.0.0.1 - - [28/Sep/2026 13:26:14] "GET /health?probe=016 HTTP/1.1" 200 -`, and a restart keeps the earlier lines. `update` and `rollback` restart the server through `start_server`, so they carry the setting with no change of their own. Every caller shows as `127.0.0.1`, which means the log proves when calls happened, while a caller's own record says which process made them.

**A defect the old redirect hid.** Truncating the log did more than erase history. A killed server's `resource_tracker` wrote its shutdown warning at its own file offset after the next start had truncated the file, which left a run of NUL bytes mid-file, 454 of them after the negative control. `>>` opens the file with `O_APPEND`, so every write lands at the end, and the final log holds 0 NUL bytes.

**The two decisions that changed nothing.** The operator accepted the CORS exposure until a hook calls Deem live, so the server still sends `Access-Control-Allow-Origin: *` and its source checkout stays clean. `deem-ctl` never sets `DEEM_N_ORDERS`, so the server's default of 1 stands until phase 002's `--deem` order-flip rate reopens it.

**The reviewed copy.** `../007-classifier-deep-research/context/deem-ctl` is a byte copy of the edited live file, taken after a read-through review, and `cmp` of the two exits 0. The fact sheet `deem-local.md` gained one pointer paragraph at line 75 that sends a reader to this phase's section 10.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `~/.local/share/deem/bin/deem-ctl` (outside the repository) | Modified | `start_server`: a two-line comment, `DEEM_ACCESS_LOG=1` and `>` changed to `>>`. 250 to 253 lines, mode `-rwxr-xr-x` kept, SHA-256 `5ed8e538...1299a7`. Brief 01, Devin |
| `~/.local/share/deem/bin/deem-ctl.bak-2026-09-28` (outside the repository) | Created | The dated backup the rollback restores, SHA-256 `f4a6228a...0c3a19`. It stays until the operator confirms its removal |
| `../007-classifier-deep-research/context/deem-ctl` | Created | The reviewed copy, mode `100755`. Commit `10697dcceb` |
| `../007-classifier-deep-research/context/deem-local.md` | Modified | The pointer paragraph at `:75` and one blank line, +2/-0. Brief 02, Pi. Commit `10697dcceb` |
| `scratch/w3-build/` | Created | The build record: `build-evidence.md`, the two briefs, `latency.py` and the raw logs. Commit `10697dcceb` |
| `spec.md`, `plan.md`, `tasks.md`, `acceptance-criteria.md`, `goal.md` and this file | Modified | The closure pass recorded the evidence and corrected the stale premises |

`10697dcceb` holds 35 files: the copy, the fact-sheet line and 33 files under `scratch/w3-build/` (`git show --stat 10697dcceb`). Nothing under `~/.local/share/deem/src` changed.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The operator released the phase on 2026-09-28 (parent `goal.md` D3). A build orchestrator, Opus 5.5 at xhigh, took the baseline and a negative control on the old `deem-ctl`, then backed the file up. It sent two single-change briefs from `scratch/w3-build/briefs/`. Brief 01 went to Devin `deepseek-v4-1-flash-max` for the live `deem-ctl` edit, and brief 02 went to Pi `cline-pass/cline-pass/deepseek-v4.1-flash` at xhigh for the pointer line. Both returned `STATUS: DONE` on the first dispatch, in 149 s and 23 s. The orchestrator then reviewed the diff and took the reviewed copy. It restarted the server onto the new file, rehearsed the rollback and ran its proof plan P1 to P12 from the final state.

The orchestrator session checked all six goal criteria on the host after that. It reproduced the log criterion with its own probe tag and reviewed the `deem-ctl` diff as a second model family. It then committed the build as `10697dcceb`. This closure pass recorded that evidence in the phase docs and ran the phase gates.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Q1: accept the CORS exposure, revisit before any hook calls Deem live | The exposure is compute only, and every planned Deem caller is an offline arm run by hand. Operator answer, 2026-09-28 |
| Q2: switch the access log on through `deem-ctl` | The server already reads `DEEM_ACCESS_LOG`, so no patch to Deem's code was needed. Operator answer, 2026-09-28 |
| Q3: hold `DEEM_N_ORDERS` at 1 | Only phase 002's `--deem` order-flip rate can show that averaging helps. Operator answer, 2026-09-28 |
| Q4: a reviewed copy in `007`'s context with a `cmp` check | It records each reviewed version in git and needs no amendment to phase 008. Operator answer, 2026-09-28 |
| Compare latency against a same-session baseline | The `choice` p50 was already about 74 ms with the log off, so the 60 to 65 ms of 2026-09-27 would have charged machine load to the log |
| Write the new `deem-ctl` to a temp file and `mv` it into place | The six-hourly updater can run `deem-ctl` at any time, and a whole-file `mv` never leaves it a half-written script |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

The build orchestrator ran the build checks on 2026-09-28, and the orchestrator session reran the goal criteria from the final state. `L` is `scratch/w3-build/logs`. Every count on `server.log` used `/usr/bin/grep`.

| Check | Result |
|-------|--------|
| Build, baseline: `deem-ctl status` | `{"status": "ok", "model": "deem-0.8-v1", "backend": "torch"}`, `model 8cbabbb, source 7cf293f`, exit 0 (`L/00-baseline.txt`) |
| Build, negative control on the old file: probe, `deem-ctl stop`, `deem-ctl start`, `grep -c '"GET /health?probe=016 HTTP/1.1" 200' server.log` | `0`, exit 1, and 0 access lines of any kind (`L/02-negative-control-recount.txt`) |
| Build, T005: `diff -u deem-ctl.bak-2026-09-28 deem-ctl` | One hunk at `start_server`, 3 lines out and 6 in, exit 1 as expected for a difference (`L/01-verify.txt`) |
| Build, T010: `bash -n deem-ctl` and `shellcheck deem-ctl` (0.11.0) | No output, exit 0 each |
| Build: `grep -c 'DEEM_ACCESS_LOG=1'`, `grep -c '>>"$SERVER_LOG"'`, `grep -c DEEM_N_ORDERS` on `deem-ctl` | `1`, `1`, `0` |
| Build, T008: `cmp` of the live file and `../007-classifier-deep-research/context/deem-ctl` | Exit 0, the same SHA-256 |
| Build, T014: rollback rehearsal | Restore `cmp` 0, `running (pid 40952)`, `status` exit 0 with `torch`. New version back: `cmp` 0 against the copy, `running (pid 42460)`, `torch` (`L/04-rollback-rehearsal.txt`) |
| Build, T011: probe, `stop`, `start` with no wait, then the count | `0` before, `1` after the probe, `running (pid 43843)`, `1` after the restart (`L/05-access-log-probe.txt`) |
| Build, T012: `curl -s -D - -o /dev/null http://127.0.0.1:8300/health` | `Access-Control-Allow-Origin: *`, exit 0 (`L/06-header-latency-after.txt`) |
| Build, T013: `latency.py 50` twice, before and after | p50 72.9 and 74.8 ms before, 75.7 and 72.9 ms after, +0.45 ms on the mean, under the 5 ms revert line |
| Build, T009: `grep -n '016-deem-local-hardening' deem-local.md` and `git diff --numstat` | One line at 75, `2 0` (`L/02-verify.txt`) |
| Build, final proof P1 to P12 | All PASS at 13:28 CEST. P6 rerun at 13:31 after `9aea8cdc56`: the 008 diff printed nothing, exit 0, and `cmp` exited 0 (`L/07-final-proof.txt`, `L/09-criterion-6-rerun.txt`) |
| Build: `validate.sh --strict` on 016 and on 007, before and after | `Errors: 0  Warnings: 0`, `RESULT: PASSED` each, exit 0 |
| Build: `check-goal.cjs` on 016, before and after | `RESULT: PASSED (5/5 checks)` |
| Build: `validate_document.py` on `deem-local.md` | Exit 1 before and after with identical output (`diff` exit 0): one `missing_required_section: overview` error that predates the phase, because a spec context doc falls back to the README type |
| Session, host check of the six goal criteria | Pending count 0 and source status empty. Probe count 1. `shellcheck` exit 0 and one `deem-ctl.bak-2026-09-28`. Revisit trigger present and the header shows. `DEEM_N_ORDERS` count 0. 008 diff empty and `cmp` exit 0 |
| Session, reproduction: `curl /health?probe=016session`, `deem-ctl stop`, `deem-ctl start`, then the count | 200, exit 0, exit 0, `1`. 0 NUL bytes in `server.log`, and `status` ok `torch` `8cbabbb`/`7cf293f` |
| Review, build orchestrator (Opus 5.5) read-through of the hunk and the paths that reach it | No P0, P1 or P2 (`build-evidence.md` section 6) |
| Review, orchestrator session (Claude, a different family from the DeepSeek writer) over the live `deem-ctl` diff against its backup, checked against `deem_server.py`'s `DEEM_ACCESS_LOG` read | No P0, P1 or P2, with `shellcheck` clean and the live restart test above |
| Closure pass, read-only: `cmp` of the live file and the copy, `ls` of `bin/`, the two counts, `shellcheck`, the source status and the 008 diff | `cmp` exit 0. `deem-ctl` and `deem-ctl.bak-2026-09-28` only. `DEEM_ACCESS_LOG=1` 1 and `DEEM_N_ORDERS` 0. `shellcheck` no output, exit 0. Source status empty at `7cf293f`. 008 diff empty, exit 0 |
| Closure pass: `repair-derived.cjs --folder <this phase> --apply` | `inspected=1 repaired=1 failed=0`, exit 0. The first run also listed one `FRONTMATTER_MEMORY_BLOCK` item, which the closure pass fixed by hand |
| Closure pass: `validate.sh <this phase> --strict` | First run: `Errors: 0  Warnings: 1`, four `recent_action` and `next_safe_action` fields that read long, now shortened. Final run: `Summary: Errors: 0  Warnings: 0`, `RESULT: PASSED`, exit 0, 0 `RESULT: FAILED` lines, `AC_COVERAGE` 6/6 and `AC_CLOSURE` 6/6, on the final state of these docs |
| Closure pass: `check-goal.cjs <this phase>` | `RESULT: PASSED (5/5 checks)`, exit 0 |
| Closure pass: `goal.cjs packet <this phase> --workspace "$PWD"` | Exit 0, `packet_budget=unknown` and `packet_durable_chars=4230`, as expected for a phase child |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:deviations -->
## Deviations

1. **Latency baseline.** NFR-P01 and T013 named the 60 to 65 ms of 2026-09-27. The same-session baseline with the log off was already 72.9 and 74.8 ms, so the 5 ms test used it. `spec.md` NFR-P01 now says so.
2. **Rehearsal copies by the orchestrator.** The rollback rehearsal and putting the new version back were two byte copies the orchestrator ran, each a temp copy then `mv -f`, proven by `cmp` and SHA-256. They are the named live check and copy already-reviewed bytes, and the final live file equals Devin's output.
3. **A wait on the other restarts.** Moving onto the new file and the rehearsal waited for the old pid and every holder of `server.log` to exit before `start`. The criterion 2 check ran `stop` then `start` with no wait, as written.
4. **A WHY comment.** The edit carries a two-line comment beside the two text changes, so a later reader does not turn `>>` back into `>`.
5. **`/usr/bin/grep` for every count.** The build harness wraps `grep` in `ugrep -I`, which skipped `server.log` while it held NUL bytes and printed nothing.
6. **Criterion 6 and a concurrent closure.** A closure leaf edited phase 008's docs during the build, so the 008 diff at 13:28 listed 6 files. Neither brief named 008. The session committed those files as `9aea8cdc56`, and the rerun at 13:31 printed nothing.
7. **Stale premises corrected.** The source commit is `7cf293f`, not `6755b30`. `deem-ctl` citations after line 117 moved down by 3, and `deem-local.md` citations after line 74 moved down by 2. The measured access line is 73 bytes, not about 70. The updater's runs fall at 14:15 and 20:15 CEST, because `update.log` stamps are UTC. Each is corrected in `spec.md`, `plan.md` and `tasks.md`, and logged in `goal.md`.
8. **No changelog refresh.** The phase metadata asks for a refresh under `../changelog/`. The parent packet has no `changelog/` folder and no phase of this packet wrote one, so nothing was refreshed.
9. **Build record kept.** CHK-051 asks for a clean `scratch/`. `scratch/w3-build/` stays as the record the executors built from, committed in `10697dcceb`.
10. **Devin permission mode.** The session's executor pre-flight records that cli-devin requires explicit approval for `--permission-mode dangerous`, read as given by parent D5 with D7 and logged for the operator. Whether brief 01's dispatch used that mode is not recorded in this phase's logs.
<!-- /ANCHOR:deviations -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Operator item: the dated backup.** `~/.local/share/deem/bin/deem-ctl.bak-2026-09-28` stays outside the repository until the operator confirms its removal, as the `spec.md` file table says.
2. **The log proves when, not who.** Every caller shows as `127.0.0.1`. A caller's own record, such as phase 002's `calls.jsonl`, attributes a call.
3. **`deem-ctl` writes lines of its own.** Each `deem-ctl start` logs its `wait_healthy` polls and each `status` one `GET /health`, so a window count must subtract them.
4. **No rotation.** A `POST /v1/systemone` line measured 73 bytes. Revisit when `du -k` on `server.log` passes 10,240 KB or when a live hook starts calling Deem.
5. **The CORS exposure stays open.** Any web page can still post to `127.0.0.1:8300`, as accepted. Option A's launcher goes back to the operator before any hook calls Deem live.
6. **The copy is checked by hand.** This phase adds no automated check that keeps `../007-classifier-deep-research/context/deem-ctl` equal to the live file, so each later change to `deem-ctl` needs its own `cmp` and a new copy.
7. **The fact sheet still names the old source.** `deem-local.md:22`, `:71` and `:79` say `6755b30`. They sit outside this phase's one-line scope.
8. **The start-failure path was not provoked.** `deem-ctl start` exiting 4 on an unhealthy server was not tested. The edit leaves that path unchanged (`deem-ctl:126`), and the rollback it leads to was rehearsed.
9. **Why the server was stopped before the build is UNKNOWN.** At 11:35 local `deem-ctl status` printed `stopped` with a dead pid and no reboot. The session restarted it. The server log from before the restart is kept in the session's scratch.
<!-- /ANCHOR:limitations -->

---
