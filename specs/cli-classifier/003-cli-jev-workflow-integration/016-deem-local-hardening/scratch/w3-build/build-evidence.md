# Build evidence: 016-deem-local-hardening (wave 3)

Build orchestrator: Opus 5.5 xhigh leaf, 2026-09-28. Raw outputs sit in `logs/`, briefs in `briefs/`.

## 1. Baseline (before any change)

Captured 13:18 to 13:20 CEST (11:18 to 11:20 UTC), HEAD `cdc790c48b`, clean tree.

| Check | Command | Result | Exit |
|-------|---------|--------|------|
| Deem status | `deem-ctl status` | `{"status": "ok", "model": "deem-0.8-v1", "backend": "torch"}`, `model 8cbabbb, source 7cf293f` | 0 |
| shellcheck 0.11.0 | `shellcheck ~/.local/share/deem/bin/deem-ctl` | no output | 0 |
| bash syntax | `bash -n deem-ctl` | no output | 0 |
| Access-log switch | `grep -c 'DEEM_ACCESS_LOG=1' deem-ctl` | `0` | 1 |
| Option orders | `grep -c DEEM_N_ORDERS deem-ctl` | `0` | 1 |
| Source checkout | `git -C ~/.local/share/deem/src status --porcelain` | empty, HEAD `7cf293f` | 0 |
| CORS header | `curl -s -D - -o /dev/null http://127.0.0.1:8300/health` | `Access-Control-Allow-Origin: *` present | 0 |
| Backup | `ls ~/.local/share/deem/bin/deem-ctl.bak-*` | no match | 1 |
| Reviewed copy | `cmp deem-ctl .../007-classifier-deep-research/context/deem-ctl` | `No such file or directory` | 2 |
| Pending answers | `grep -c 'Operator answer: pending' 016/spec.md` | `0` | 1 |
| Pointer line | `grep -n '016-deem-local-hardening' deem-local.md` | no match | 1 |
| 008 diff | `git diff --stat -- .../008-cli-classifier-hub` | empty | 0 |
| Live file | `wc -l`, `shasum -a 256` | 250 lines, `f4a6228a...0c3a19` | 0 |
| Strict validate 016 | `validate.sh <016> --strict` | `Errors: 0  Warnings: 0`, `RESULT: PASSED` | 0 |
| Strict validate 007 | `validate.sh <007> --strict` | `Errors: 0  Warnings: 0`, `RESULT: PASSED` | 0 |
| check-goal 016 | `check-goal.cjs <016>` | `RESULT: PASSED (5/5 checks)` | 0 |
| validate_document on `deem-local.md` | `validate_document.py deem-local.md` | not a skill doc: README fallback, 1 pre-existing error (`missing_required_section: overview`), 1 warning (`document_type_fallback`) | 1 |
| `choice` latency, access log off | `python3 latency.py 50`, twice (10 warm-up, 50 timed, one urllib client) | p50 72.9 ms and 74.8 ms, p95 89.8 and 85.6 | 0 |
| Negative control | on the old `deem-ctl`: `curl -s 'http://127.0.0.1:8300/health?probe=016'`, `deem-ctl stop`, `deem-ctl start`, then `/usr/bin/grep -c '"GET /health?probe=016 HTTP/1.1" 200' server.log` | `0` (and `0` access lines of any kind) | 1 |

No repository runtime suite is touched by this phase: the changes are one shell script outside the repository, one line in a spec context doc and one new byte copy. The gates that apply are the ones above.

## 2. Proof plan (from the phase goal's six criteria, the acceptance rows and the NFRs)

All `grep` below is `/usr/bin/grep` (BSD). This harness's shell wraps `grep` in `ugrep -I`, which skips binary files, and `server.log` holds NUL bytes (section 5), so a plain `grep` here prints nothing for it.

| Row | Source | Command | Expected |
|-----|--------|---------|----------|
| P1 | Goal 1, AC-001 | `grep -c 'Operator answer: pending' 016/spec.md`; `git -C ~/.local/share/deem/src status --porcelain` | `0`; empty, exit 0 |
| P2 | Goal 2, AC-002, T011 | `curl -s 'http://127.0.0.1:8300/health?probe=016'`, `deem-ctl stop`, `deem-ctl start`, `grep -c '"GET /health?probe=016 HTTP/1.1" 200' ~/.local/share/deem/server.log`; `grep -c 'DEEM_ACCESS_LOG=1' deem-ctl` | `1`; `1` |
| P3 | Goal 3, AC-003, T010, T014 | `ls deem-ctl.bak-*`; `shellcheck deem-ctl`; restore the backup, restart, `deem-ctl status`; put the new version back, `cmp` against the copy | one file; no output, exit 0; exit 0 with `"backend": "torch"`; `cmp` exit 0 |
| P4 | Goal 4, AC-004, T012 | Q1 answer line holds `Revisit trigger: before any hook calls Deem live`; `curl -s -D - -o /dev/null http://127.0.0.1:8300/health` | one line; `Access-Control-Allow-Origin: *` |
| P5 | Goal 5, AC-005, T007 | `grep -c DEEM_N_ORDERS deem-ctl`; Q3 answer line names 002's order-flip rate | `0`; one line |
| P6 | Goal 6, AC-006, T008 | `cmp deem-ctl 007/context/deem-ctl`; `git diff --stat -- 008-cli-classifier-hub` | exit 0; empty, or only the concurrent closure leaf's 008 docs |
| P7 | Plan step, T009 | `grep -n '016-deem-local-hardening' deem-local.md`; `git diff --numstat -- deem-local.md` | one line; `2 0` |
| P8 | NFR-P01, T013 | `latency.py 50` twice after the change | p50 within 5 ms of the same-session baseline |
| P9 | NFR-P02 | `deem-ctl start` | `running (pid N)`, exit 0 |
| P10 | T010 | `bash -n deem-ctl` | exit 0 |
| P11 | Review | `diff deem-ctl.bak-2026-09-28 deem-ctl` | one hunk at `start_server`: 3 lines out, 6 in |
| P12 | T015 | `validate.sh 016 --strict`, `validate.sh 007 --strict`, `check-goal.cjs 016` | `RESULT: PASSED` each |

## 3. Files changed

| File | Change | Written by | Brief | Proof |
|------|--------|------------|-------|-------|
| `~/.local/share/deem/bin/deem-ctl` (outside the repo) | `start_server`: two WHY comment lines, `DEEM_ACCESS_LOG=1` in the server's environment, `>` to `>>` for `server.log`. 250 to 253 lines, mode `-rwxr-xr-x` kept, SHA-256 `5ed8e538...1299a7` | Devin `deepseek-v4-1-flash-max`, 149 s, written to `deem-ctl.new` then `mv -f` | `briefs/01-deem-ctl-access-log.md` | `logs/01-verify.txt`: one hunk, 3 lines out and 6 in, exactly the brief's text |
| `~/.local/share/deem/bin/deem-ctl.bak-2026-09-28` (outside the repo) | Dated backup of the 250-line file, SHA-256 `f4a6228a...0c3a19`, `cmp` exit 0 before the edit | Orchestrator, `cp -p` | none (T004 is the orchestrator's) | `logs/07-final-proof.txt` |
| `specs/.../007-classifier-deep-research/context/deem-local.md` | One pointer paragraph plus one blank line after the Exposure paragraph, new line 75 | Pi `cline-pass/cline-pass/deepseek-v4.1-flash` xhigh, 23 s | `briefs/02-deem-local-pointer.md` | `logs/02-verify.txt`: `git diff --numstat` `2 0`, line 75 byte-equal to the brief (`cmp` exit 0) |
| `specs/.../007-classifier-deep-research/context/deem-ctl` (new) | Reviewed copy of the edited live file, mode 755 kept by `cp -p` | Orchestrator, `cp -p` after the read-through review in section 6 | none (byte copy the prompt assigns to the orchestrator) | `cmp` exit 0, same SHA-256 as the live file |

Nothing under `~/.local/share/deem/src` changed (`git status --porcelain` empty at every step, HEAD `7cf293f`). No file under `008-cli-classifier-hub/` was named in any brief.

## 4. Checks, in run order

| Step | Command | Result | Exit |
|------|---------|--------|------|
| Negative control, old `deem-ctl` | probe, `deem-ctl stop`, `deem-ctl start`, `/usr/bin/grep -c '"GET /health?probe=016 HTTP/1.1" 200' server.log` | `0`, and `0` access lines of any kind | 1 |
| Backup (T004) | `cp -p deem-ctl deem-ctl.bak-2026-09-28`, `cmp` | identical | 0 |
| Devin handback | `logs/01.last.txt` | `STATUS: DONE`, no question, no auth error, stderr empty | 0 |
| Diff review | `diff -u deem-ctl.bak-2026-09-28 deem-ctl` | one hunk at `start_server`, lines 118 to 123 | 1 (differs, expected) |
| Syntax, lint | `bash -n`, `shellcheck` 0.11.0 | no output each | 0, 0 |
| Counts | `grep -c 'DEEM_ACCESS_LOG=1'`, `grep -c '>>"$SERVER_LOG"'`, `grep -c DEEM_N_ORDERS` | `1`, `1`, `0` | 0, 0, 1 |
| Reviewed copy (T008) | `cp -p` live to `007/context/deem-ctl`, `cmp` | identical | 0 |
| Restart onto the new file | `deem-ctl stop`, wait for the old pid and log holders, `deem-ctl start`, `status` | `running (pid 37605)`, `"backend": "torch"`, 3 `GET /health` access lines, earlier log kept (size 987 to 1419) | 0 |
| Rollback rehearsal (T014) | stop, restore the backup (temp then `mv -f`), `cmp` to backup, start, `status` | `cmp` 0, `running (pid 40952)`, `{"status": "ok", ..., "backend": "torch"}`, `DEEM_ACCESS_LOG=1` count `0`, log truncated to 234 bytes as the old `>` does | 0 |
| New version put back | stop, copy the reviewed copy (temp then `mv -f`), `cmp` to the reviewed copy, start, `status` | `cmp` 0, `running (pid 42460)`, `torch` | 0 |
| Access log (T011, goal 2) | count before `0`; `curl -s 'http://127.0.0.1:8300/health?probe=016'`; count `1`; `deem-ctl stop` then `deem-ctl start` with no wait, as the criterion reads; count again | `0`, `1`, `running (pid 43843)`, `1`. Line: `127.0.0.1 - - [28/Sep/2026 13:26:14] "GET /health?probe=016 HTTP/1.1" 200 -` | 0 |
| Header (T012, goal 4) | `curl -s -D - -o /dev/null http://127.0.0.1:8300/health` | `Access-Control-Allow-Origin: *` | 0 |
| Latency after (T013) | `latency.py 50`, twice, access log on | p50 75.7 and 72.9 ms, p95 94.0 and 90.0 ms. 120 `POST` access lines written, 73 bytes each | 0 |
| Pi handback | `logs/02.last.txt` | `STATUS: DONE`, no question, no 429 | 0 |
| Final proof plan | `logs/07-final-proof.txt` | see section 7 | |
| Strict validate 016, 007 | `validate.sh <folder> --strict` | `Errors: 0  Warnings: 0`, `RESULT: PASSED` each | 0, 0 |
| check-goal 016 | `check-goal.cjs <016>` | `RESULT: PASSED (5/5 checks)` | 0 |
| validate_document on `deem-local.md` | `validate_document.py <file>` | output identical to the baseline (`diff` exit 0): README fallback, the same pre-existing `overview` error | 1 (baseline 1) |

## 5. Baselines and deltas

| Gate | Baseline | Final | Delta |
|------|----------|-------|-------|
| `shellcheck deem-ctl` | clean, exit 0 | clean, exit 0 | none |
| `validate.sh 016 --strict` | PASSED, 0/0 | PASSED, 0/0 | none |
| `validate.sh 007 --strict` | PASSED, 0/0 | PASSED, 0/0 | none |
| `check-goal.cjs 016` | 5/5 | 5/5 | none |
| `validate_document.py deem-local.md` | exit 1, 1 error, 1 warning | exit 1, same output | none |
| `choice` p50, 2 x 50 calls | 72.9, 74.8 ms (mean 73.85) | 75.7, 72.9 ms (mean 74.30) | +0.45 ms, under the 5 ms revert line |
| Probe line after restart | 0 (old file) | 1 | the fix |

No repository test suite covers these files, so no suite ran.

## 6. Review of the new `deem-ctl` (T008 read-through)

Reviewer: this orchestrator (Opus 5.5), a different model family from the DeepSeek writer. Read the whole hunk and the paths that reach it. The prefix assignment scopes `DEEM_ACCESS_LOG=1` to the server command only. `>>` with `2>&1` appends both streams. `nohup` writes no `nohup.out` because both streams are redirected. `$!` is still the server: the pid file held 43843 and `ps` shows `python serve/deem_server.py` at 43843. `update` and `rollback` reach `start_server`, so they inherit the setting. The comment carries a durable why and no ephemeral label, and it avoids the literal `DEEM_ACCESS_LOG=1`, so the criterion count stays 1. Findings: none at P0, P1 or P2. The orchestrator session's own cross-family review under parent D5 stays its call.

## 7. Final proof plan, from the final state (13:28 CEST)

| Row | Result | Verdict |
|-----|--------|---------|
| P1 | pending count `0`; source checkout empty, `7cf293f` | PASS |
| P2 | probe count `1`; `DEEM_ACCESS_LOG=1` count `1` | PASS |
| P3 | one `deem-ctl.bak-2026-09-28`; `shellcheck` clean exit 0; rehearsal `status` exit 0 with `torch`; `cmp` 0 after the new version went back | PASS |
| P4 | Q1 line with the revisit trigger: 1 match; header `Access-Control-Allow-Origin: *` | PASS |
| P5 | `DEEM_N_ORDERS` count `0`; Q3 reopen line: 1 match | PASS |
| P6 | `cmp` live vs reviewed copy exit 0. At 13:28 `git diff --stat -- 008-cli-classifier-hub` was not empty (6 files, all the concurrent closure leaf's, section 8). The orchestrator session then committed them as `9aea8cdc56`, whose file list is those 6 files only, and the rerun at 13:31 printed nothing, exit 0, with `cmp` still 0 (`logs/09-criterion-6-rerun.txt`) | PASS |
| P7 | one line, 75; numstat `2 0` | PASS |
| P8 | +0.45 ms mean p50 | PASS |
| P9 | `running (pid 43843)`, `status` exit 0 | PASS |
| P10 | `bash -n` exit 0 | PASS |
| P11 | one hunk, 3 out and 6 in | PASS |
| P12 | 016 and 007 `RESULT: PASSED`, check-goal 5/5 | PASS |

The server is left running on the final `deem-ctl` (pid 43843) with the access log on. `update.log` still ends at `2026-09-28T06:15:58Z current`, so no scheduled update ran during the build.

## 8. Deviations, premises and findings

| Item | Note |
|------|------|
| Rehearsal copies by the orchestrator | The rollback rehearsal and putting the new version back are two byte copies (`cp -p` to a temp name, then `mv -f`), each proven by `cmp` and SHA-256, run by the orchestrator rather than an executor brief. They are the named live check (T014, AC-003, goal criterion 3), need `deem-ctl stop` and `start` around them, and copy already-reviewed bytes, the same class as the reviewed copy the prompt assigns here. Net change to the live file from these steps: none, the final SHA equals Devin's output |
| Latency reference | NFR-P01 names 60 to 65 ms from `deem-local.md:36`, `:85`. Today's baseline with the log off was already 72.9 and 74.8 ms, so the 5 ms test used the same-session baseline. Comparing to the 2026-09-27 numbers would charge machine load to the log |
| Wait between stop and start | Moving onto the new file and the rehearsal waited for the old pid and every holder of `server.log` to exit before `start` (the criterion does not ask for it). The goal-2 check itself ran `stop` then `start` with no wait, as written |
| WHY comment | The Q2 edit carries a two-line WHY comment beside the two text changes, per sk-code's shell checklist. It keeps a later reader from turning `>>` back into `>` |
| `grep` in this harness | The shell wraps `grep` in `ugrep -I`, which skips binary files, and printed nothing for `server.log` while it held NUL bytes. Every check here uses `/usr/bin/grep` (BSD 2.6.0), which counts correctly |
| Log copies kept | Each restart on the old `>` truncates `server.log`, an untracked file. Its content was copied to `logs/02-server-log-before-negative-control.txt` and `logs/04-server-log-before-rehearsal.txt` first. Both hold only model-load output, library warnings and `127.0.0.1` access lines |
| Criterion 6 and phase 008 | A closure leaf edits `008-cli-classifier-hub/` docs during this build, as the hand-off said. Its files changed at 13:21:42 to 13:27:21. Devin ran 13:21:55 to 13:24:24 (149 s) and Pi 13:27:27 to 13:27:50 (23 s). `tasks.md` first changed at 13:21:42, before Devin started, and `goal.md` (13:24:27, 13:26:47), `tasks.md` again, `implementation-summary.md` and `graph-metadata.json` (13:27:10 to 13:27:21) changed while no executor ran. The diff is closure content (tasks ticked against `ee3a1b057c`). Neither brief named 008 and both handbacks list only their own file. The orchestrator session committed that closure as `9aea8cdc56` at about 13:30, and the rerun then printed nothing |
| Stale source commit | The phase docs cite source `6755b30` (`spec.md` Owners row, `plan.md` Dependencies). The updater moved it to `7cf293f` at `2026-09-28T00:15:57Z`. Every cited line of `deem_server.py` still resolves at `7cf293f`: `:65`, `:201`, `:236`, `:665-671`, `:794-800`, `:809`, `:821-831`, `:837`, `:875`, `:910`, `:985`. `deem-local.md:22`, `:71`, `:77` also say `6755b30`, outside this phase's one-line scope |
| Moved `deem-ctl` lines | The edit adds 3 lines after line 117. Citations at or below `:117` hold (`:1-18`, `:13-18`, `:20`, `:72-81`, `:85-89`, `:109`). Later ones move by 3 in the final file: the redirect `:120` is now `:123`, `:118-120` is `:120-123`, `start_server` `:109-125` is `:109-128`, `:127-132` is `:130-135`, `:137-138` is `:140-141`, `:145-225` is `:148-228`, `:177-178` is `:180-181` |
| Updater times | The hand-off said the next runs fall about 12:15 and 18:15 local. `update.log` stamps are UTC, so the runs fall at 14:15 and 20:15 CEST. None ran during the build |
| Log line size | The spec estimates about 70 bytes per request. A `POST /v1/systemone` access line measured 73 bytes |
| Finding: the old `>` corrupts the log | Observed after the negative control: `server.log` held a 454-byte NUL run. The killed server's multiprocessing `resource_tracker` writes a shutdown warning at its own file offset after the next start has truncated the file. Then, while the size stayed 987 bytes, the NUL count fell to 155 and a second warning appeared, written into the middle of the file by the next killed server. `>>` opens with `O_APPEND`, so every write lands at the end. The final log holds 0 NUL bytes |
| Access lines from `deem-ctl` itself | Each `deem-ctl start` logs its `wait_healthy` polls and each `status` one `GET /health`, as the spec's edge cases say. A window count must subtract them |
| Trigger index | The committed trigger index lists `007-classifier-deep-research/context/deem-local.md` in `corpus-manifest.json`. The phase names no regeneration, so the orchestrator's usual post-commit rebuild covers the new line |
| Reviewed copy mode | `cp -p` kept mode 755, so git will record `007/context/deem-ctl` as executable (`100755`) |

## 9. Open

- The backup `~/.local/share/deem/bin/deem-ctl.bak-2026-09-28` stays until the operator confirms, per `spec.md`'s file table.
- The phase docs (`spec.md`, `tasks.md`, `acceptance-criteria.md`, `goal.md`, `implementation-summary.md`) are untouched here. The closure leaf records this evidence.
