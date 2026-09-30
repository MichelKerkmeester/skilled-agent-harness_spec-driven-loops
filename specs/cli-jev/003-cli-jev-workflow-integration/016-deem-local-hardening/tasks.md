---
title: "Tasks: Phase 16: deem-local-hardening"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "deem hardening tasks"
  - "deem access log tasks"
  - "deem cors decision tasks"
  - "deem-ctl backup tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 16: deem-local-hardening

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`

Evidence comes from two records. The build record is `scratch/w3-build/build-evidence.md`, with its briefs and raw logs beside it. `L` below is `scratch/w3-build/logs`. The orchestrator session's record holds the host check of the six goal criteria, its own reproduction of the log criterion, the cross-family review and the commit. It wins where the two differ, because it reran the gates from the final state. The build is committed as `10697dcceb`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read the tail of `update.log` and run `deem-ctl status`, record the model and source commits and confirm no scheduled update is running (`~/.local/share/deem/update.log`). Evidence: at the baseline (13:18 CEST, HEAD `cdc790c48b`) `deem-ctl status` printed `{"status": "ok", "model": "deem-0.8-v1", "backend": "torch"}` and `model 8cbabbb, source 7cf293f`, exit 0 (`L/00-baseline.txt`). The `update.log` tail read `2026-09-28T00:15:57Z updated: model 8cbabbb, source 7cf293f` and `06:15:58Z current` (`L/02-negative-control.txt`). Each step log rereads the tail, and at the final proof (13:28 CEST) it still ended at `06:15:58Z current`, so no scheduled update ran during the build (`L/07-final-proof.txt`)
- [x] T002 Reopen `deem_server.py:794-800`, `:809`, `:837` and `deem-ctl:109-125` at the live commits and correct any moved citation (`spec.md` section 10). Evidence: every cited line of `deem_server.py` still resolves at `7cf293f`: `:65`, `:201`, `:236`, `:665-671`, `:794-800`, `:809`, `:821-831`, `:837`, `:875`, `:910` and `:985` (`build-evidence.md` section 8). `deem-ctl` citations at or below `:117` hold, and later ones moved down by 3 with the edit: the redirect `:120` is `:123`, `start_server` `:109-125` is `:109-128`, `:127-132` is `:130-135`, `:137-138` is `:140-141`, `:145-225` is `:148-228` and `:177-178` is `:180-181`. The closure pass read those lines again on the live files and corrected them in `spec.md`, `plan.md` and this file. It also moved the `deem-local.md` citations below the new pointer line down by 2 (`:85` to `:87`, `:93-97` to `:95-99`) and replaced the source commit `6755b30` with `7cf293f` where a doc stated it as current
- [x] T003 Record the operator's answers to Q1 to Q4 in place of each pending answer line (`spec.md` section 10, `goal.md` log). Evidence: answered 2026-09-28, each the recommended option (D4 of the parent `goal.md`): Q1 C, Q2 on, Q3 hold at 1, Q4 B. Recorded by the spec pass, and nothing under `~/.local/share/deem/` was read or changed
- [x] T004 Copy `deem-ctl` to `deem-ctl.bak-<date>` with `cp -p` before the first edit, since Q2 and Q4 approve changes (`~/.local/share/deem/bin/`). Evidence: the orchestrator ran `cp -p deem-ctl deem-ctl.bak-2026-09-28` before any dispatch, and `cmp` exited 0 (`build-evidence.md` section 4). The backup is the 250-line baseline file, SHA-256 `f4a6228a...0c3a19`, and it was unchanged after the edit (`L/01-verify.txt`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Q2 is on: add `DEEM_ACCESS_LOG=1` to `start_server`'s environment and change `>"$SERVER_LOG"` to `>>"$SERVER_LOG"`. Write to a temp file, then `mv` it into place (`~/.local/share/deem/bin/deem-ctl:118-120`, now `:118-123`). Evidence: brief 01 ran on Devin `deepseek-v4-1-flash-max` in 149 s, exit 0, `STATUS: DONE` with no question and empty stderr (`L/01.dispatch.txt`, `L/01.last.txt`). It edited `deem-ctl.new` and moved it into place with `mv -f` only after `bash -n` and `shellcheck` exited 0. `diff -u` against the backup shows one hunk at `start_server`, 3 lines out and 6 in: a two-line WHY comment, `DEEM_ACCESS_LOG=1` in the environment and `>>"$SERVER_LOG"` (`L/01-verify.txt`). The file went from 250 to 253 lines and kept mode `-rwxr-xr-x`
- [x] T006 Q1 is C: confirm the acceptance and its revisit trigger stand in section 10, and change nothing under `~/.local/share/deem/src/` (`spec.md` section 10). Evidence: the Q1 answer line with `Revisit trigger: before any hook calls Deem live` matches once in `spec.md` (P4, `L/07-final-proof.txt`). `git -C ~/.local/share/deem/src status --porcelain` printed nothing at every step with HEAD `7cf293f`, and the closure pass reran it read-only with the same result, exit 0
- [x] T007 [P] Q3 holds at 1: confirm `grep -c DEEM_N_ORDERS deem-ctl` prints 0 after T005 (`~/.local/share/deem/bin/deem-ctl`). Evidence: `0`, exit 1, after the edit (`L/01-verify.txt`) and at the final proof (P5). Rerun read-only while closing these docs: `0`
- [x] T008 Q4 is B: after T005 and a read-through review, copy the live `deem-ctl` to the packet and run `cmp` on the pair. It is the one new file this phase adds outside its own folder (`../007-classifier-deep-research/context/deem-ctl`). Evidence: the build orchestrator read the hunk and the paths that reach it first (`build-evidence.md` section 6). The prefix assignment scopes `DEEM_ACCESS_LOG=1` to the server command, `>>` with `2>&1` appends both streams and `$!` is still the server. It then ran `cp -p`, and `cmp` exited 0 with the same SHA-256, `5ed8e538...1299a7`. The copy is committed in `10697dcceb` as mode `100755`, and `cmp` against the live file still exits 0 (closure pass, read-only)
- [x] T009 Add one pointer line after the Exposure paragraph (`../007-classifier-deep-research/context/deem-local.md:73`). Evidence: brief 02 ran on Pi `cline-pass/cline-pass/deepseek-v4.1-flash` at xhigh in 23 s, `STATUS: DONE` with no 429 (`L/02.dispatch.txt`, `L/02.last.txt`). The paragraph landed at `deem-local.md:75`, after the blank line that follows the Exposure paragraph. `git diff --numstat` printed `2 0`, and the line is byte-equal to the brief's text (`cmp` exit 0, `L/02-verify.txt`). Committed in `10697dcceb`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Run `shellcheck` on the edited `deem-ctl` and read its output and exit status (`~/.local/share/deem/bin/deem-ctl`). Evidence: `shellcheck` 0.11.0 printed nothing, exit 0, and `bash -n` exited 0 (`L/01-verify.txt`, P3 and P10 in `L/07-final-proof.txt`). Rerun read-only while closing these docs: no output, exit 0
- [x] T011 Access log: send one `GET /health` and restart with `deem-ctl stop` then `deem-ctl start`. The first line is still in `server.log` (`~/.local/share/deem/server.log`). Evidence: the probe count was `0` before, `1` after `curl -s 'http://127.0.0.1:8300/health?probe=016'` and still `1` after `deem-ctl stop` then `deem-ctl start` with no wait between them, `running (pid 43843)` (`L/05-access-log-probe.txt`). The line reads `127.0.0.1 - - [28/Sep/2026 13:26:14] "GET /health?probe=016 HTTP/1.1" 200 -`. The same sequence on the old `deem-ctl` counted `0` (`L/02-negative-control-recount.txt`). The orchestrator session reproduced it with its own tag: `/health?probe=016session` answered 200, `stop` and `start` exited 0 and the count was `1` after the restart, with 0 NUL bytes in `server.log`. Every count used `/usr/bin/grep`, because the harness's `grep` skips binary files
- [x] T012 Q1 is C: `curl -s -D - -o /dev/null http://127.0.0.1:8300/health` still shows `Access-Control-Allow-Origin: *`, and `git -C ~/.local/share/deem/src status --porcelain` prints nothing (`127.0.0.1:8300`). Evidence: the header check printed `Access-Control-Allow-Origin: *`, exit 0, and the source status printed nothing, exit 0 (`L/06-header-latency-after.txt`). The orchestrator session's host check saw the same header
- [x] T013 Time 50 `choice` calls after the change and compare the p50 with 60 to 65 ms. Revert the log if it rose more than 5 ms (`deem-local.md:36`, `:87`). Evidence: before the change, two runs of `latency.py 50` gave p50 72.9 and 74.8 ms (`L/01-latency-before.txt`). After it, with the log on, they gave 75.7 and 72.9 ms (`L/06-header-latency-after.txt`). The mean p50 moved by +0.45 ms, under the 5 ms revert line, so the log stays on. Deviation: the comparison used the same-session baseline, because it was already about 74 ms with the log off, and comparing with the 60 to 65 ms of 2026-09-27 would charge machine load to the log
- [x] T014 Rehearse the rollback: restore the backup, restart, `deem-ctl status` prints backend `torch`, then put the new version back and rerun `cmp` against the copy (`~/.local/share/deem/bin/`). Evidence: the orchestrator stopped the server, restored the backup through a temp copy and `mv -f`, and `cmp` against the backup exited 0. `deem-ctl start` printed `running (pid 40952)`, and `deem-ctl status` exited 0 with `"backend": "torch"`. On the old file `DEEM_ACCESS_LOG=1` counted 0 and the start truncated the log to 234 bytes, as the old `>` does. It then stopped the server and put the reviewed copy back the same way: `cmp` against the copy exited 0, `running (pid 42460)`, `torch` (`L/04-rollback-rehearsal.txt`). The final live file's SHA-256 equals Devin's output
- [x] T015 Run `validate.sh --strict` and `check-goal.cjs` on this folder and read both results (`016-deem-local-hardening/`). Evidence: the build ran both before and after its change. `validate.sh --strict` printed `Errors: 0  Warnings: 0` and `RESULT: PASSED`, and `check-goal.cjs` printed `RESULT: PASSED (5/5 checks)`, each time (`L/00-baseline-validate-016-deem-local-hardening.txt`, `L/08-final-validate-016-deem-local-hardening.txt`, `L/08-final-check-goal.txt`). The closure pass reran both on the final state of these docs, and `implementation-summary.md` Verification holds those results
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed. The probe, restart, header, latency and rollback checks ran on the served instance, and the orchestrator session reproduced the log check
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Build record**: See `scratch/w3-build/build-evidence.md`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md. Evidence: `spec.md` section 4, REQ-001 to REQ-006
- [x] CHK-002 [P0] Technical approach defined in plan.md. Evidence: `plan.md` sections 3 and 4
- [x] CHK-003 [P1] Dependencies identified and available. Evidence: the operator's answers were in `spec.md` section 10 before the build (`grep -c 'Operator answer: pending'` prints 0), the served instance answered `deem-ctl status` with `torch` at the baseline and `shellcheck` 0.11.0 was installed
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks. Evidence: `shellcheck` 0.11.0 and `bash -n` on the edited `deem-ctl`, no output, exit 0 each (T010)
- [x] CHK-011 [P0] No console errors or warnings. Evidence: each `deem-ctl start` printed only `running (pid N)`, and each `status` exited 0. The `resource_tracker` shutdown warning in `server.log` comes from Deem's server when it is killed, and it also appears with the old `deem-ctl` (`L/02-negative-control.txt`), so the edit did not add it
- [x] CHK-012 [P1] Error handling implemented. Evidence: the diff touches only the environment and the redirect (T005). `wait_healthy || return 4` (`deem-ctl:126`) and the exit codes 0 to 4 (`deem-ctl:13-18`) are unchanged, as NFR-R01 requires
- [x] CHK-013 [P1] Code follows project patterns. Evidence: the edit keeps the file's prefix-assignment style, and the comment states the durable why with no ephemeral label (`build-evidence.md` section 6). The orchestrator session's cross-family review found no P0, P1 or P2
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met. Evidence: `acceptance-criteria.md`, 6 of 6 Met
- [x] CHK-021 [P0] Manual testing complete. Evidence: T011 to T014 ran on the served instance, and the orchestrator session reproduced T011 with its own probe tag
- [x] CHK-022 [P1] Edge cases tested. Evidence: the plan's edge case, a line surviving `deem-ctl stop` then `deem-ctl start`, holds on the new file and fails on the old one (T011). After the rollback rehearsal put the new version back, `cmp` against the copy still exited 0 (T014)
- [x] CHK-023 [P1] Error scenarios validated. Evidence: the recovery half of the external-failure scenario was rehearsed: the backup restored, the old version served `torch` and the new one went back (T014). The start failure itself, `deem-ctl start` exiting 4, was not provoked, and the edit leaves that path unchanged (`deem-ctl:126`). The concurrent-access case was observed: the restart onto the new file and its `status` wrote three `GET /health` lines of their own (`L/03-restart-on-new.txt`)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`. Classes: the unset `DEEM_ACCESS_LOG` and the truncating redirect are both `instance-only`, and the NUL bytes the build found in `server.log` come from the same redirect
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep. Evidence: `rg -n 'SERVER_LOG|server\.log'` on the baseline `deem-ctl` shows one redirect into the log, line 120, beside the path definition at line 37 and three failure messages (`L/00-baseline.txt`). The plan's CORS `rg` over `src/serve` finds `deem_server.py:809` and `:837` only, both left unchanged under Q1 C
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests. Evidence: the other `SERVER_LOG` uses are the failure messages at `deem-ctl:186`, `:222` and `:234` of the baseline file, which only name the path. `update` and `rollback` reach `start_server`, so they inherit the setting (`build-evidence.md` section 6). Phase 008's lifecycle reference documents commands whose names and exit codes did not change
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases. N/A: the edit sets one environment variable and changes one redirect, with no path, parser or redaction logic. The 120 `POST` lines the latency runs wrote measure 73 bytes each, so none carries a request body (NFR-S01)
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed. Evidence: `plan.md` names one axis, server restart (none, one), crossed here with the `deem-ctl` version (old, new). Old with one restart counted 0 (negative control), and new with none and with one each counted 1 (T011). Old with no restart was not run, because with the switch unset the server writes no access line (`deem_server.py:794-800`)
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state. N/A: the edit adds no read of process-wide state to `deem-ctl`. It sets `DEEM_ACCESS_LOG=1` for the server command only, through a prefix assignment that overrides any value in the caller's environment (`build-evidence.md` section 6). No variant was run
- [x] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range. Evidence: the live file's SHA-256 `5ed8e538...1299a7` equals the copy committed in `10697dcceb`, and the backup's is `f4a6228a...0c3a19` (`L/07-final-proof.txt`)
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets. Evidence: the diff adds two comment lines, one variable set to `1` and one redirect, with no credential, key or token (NFR-S02, `L/01-verify.txt`)
- [x] CHK-031 [P0] Input validation implemented. N/A: the edit adds no input path. Q1's answer C leaves the server's request handling unchanged, and `git -C ~/.local/share/deem/src status --porcelain` prints nothing
- [x] CHK-032 [P1] Auth/authz working correctly. N/A: the server checks no credential, and the operator accepted that on 2026-09-28 (Q1 C) with a revisit trigger. The header check shows the server unchanged (T012)
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized. Evidence: spec, plan, tasks, acceptance criteria, goal and summary agree on Complete, and the stale premises are corrected in each
- [x] CHK-041 [P1] Code comments adequate. Evidence: the two-line comment says why the variable is set and why the redirect appends. It carries no ephemeral label and avoids the literal `DEEM_ACCESS_LOG=1`, so the criterion count stays 1
- [x] CHK-042 [P2] README updated (if applicable). N/A: the phase names no README. The fact sheet `deem-local.md` is the doc it updates, and it gained its pointer line (T009)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only. Evidence: the build record, briefs, `latency.py` and raw logs sit in `scratch/w3-build/`. Brief 01's `deem-ctl.new` is gone: `ls` in `~/.local/share/deem/bin` shows only `deem-ctl` and `deem-ctl.bak-2026-09-28`
- [x] CHK-051 [P1] scratch/ cleaned before completion. Deviation: `scratch/w3-build/` is kept on purpose as the build record, committed in `10697dcceb`, as sibling phases keep their briefs. Nothing else is in `scratch/` apart from `.gitkeep`
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-09-28. CHK-051 keeps `scratch/w3-build/` as a recorded deviation
<!-- /ANCHOR:summary -->

---



