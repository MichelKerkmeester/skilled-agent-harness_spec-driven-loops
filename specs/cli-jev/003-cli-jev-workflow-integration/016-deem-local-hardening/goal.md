---
title: "Goal: Phase 16: deem-local-hardening"
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
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/016-deem-local-hardening"
    last_updated_at: "2026-09-28T11:45:00Z"
    last_updated_by: "closure-leaf"
    recent_action: "Ticked all six criteria from the build evidence"
    next_safe_action: "Orchestrator commits the phase docs"
    blockers: []
    key_files:
      - "specs/cli-jev/003-cli-jev-workflow-integration/016-deem-local-hardening/spec.md"
      - "specs/cli-jev/003-cli-jev-workflow-integration/016-deem-local-hardening/acceptance-criteria.md"
      - "specs/cli-jev/003-cli-jev-workflow-integration/007-classifier-deep-research/context/deem-ctl"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "owner-fix-016-planning"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "When may the dated backup ~/.local/share/deem/bin/deem-ctl.bak-2026-09-28 be removed"
    answered_questions:
      - "Q1 CORS exposure: C, accept, with its revisit trigger"
      - "Q2 access log: on, DEEM_ACCESS_LOG=1 and an appending redirect"
      - "Q3 DEEM_N_ORDERS: hold at 1 until phase 002's order-flip rate"
      - "Q4 deem-ctl home: B, a reviewed copy in 007's context with a cmp check"
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 16: deem-local-hardening

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> Everything between the frontmatter and the log is the DURABLE SLICE: it is
> what an operator sets as the session objective, and it must stay true for the
> life of the packet. The frontmatter above it is bookkeeping and never leaves
> this file: it is not sent in chat, not injected, not stored in an objective.
> Keep the slice short. A phase parent or top-level packet has one limit, 4000
> characters, measured from the frontmatter's closing fence to the log anchor.
> Up to 4000 passes and past it fails; the runtime goal surfaces cap what they
> hold, and a truncated objective loses its tail, which is where the criteria
> live.

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Carry out the operator's answers on the local Deem install's four open gaps, accepting the open CORS exposure with its revisit trigger, turning the access log on, holding `DEEM_N_ORDERS` at 1 and keeping a reviewed copy of `deem-ctl` in git, each change with a dated backup and a rehearsed rollback.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The operator answered Q1 to Q4 of `spec.md` section 10 on 2026-09-28, each with the recommended option. Every change starts from a dated backup of `deem-ctl`, and nothing under `~/.local/share/deem/src/` changes |
| D2 | The access log comes from the server's own `DEEM_ACCESS_LOG` switch, set in `deem-ctl`'s `start_server` with an appending redirect. No patch to Deem's code serves it |
| D3 | `DEEM_N_ORDERS` stays at 1. Only phase 002's `--deem` order-flip rate above 0.10 reopens it |
| D4 | Phase 008's scope stays frozen. The reviewed copy of `deem-ctl` lives at `../007-classifier-deep-research/context/deem-ctl`, outside `cli-deem`, and `cmp` keeps it equal to the live file |
| D5 | The CORS exposure is accepted: no patch, launcher or proxy. It is revisited before any hook calls Deem live, with option A's launcher as the plan put to the operator |

### Operator copy

The operator holds this directive as the session objective, and that copy is
what judges completion, not this file. Whenever anything above the log changes
(objective, a decision, the binding table, a criterion), resend this file's
chat slice so the operator can update their copy. The chat slice is the
durable slice without its frontmatter, HTML comments, anchor markers, `---`
dividers or heading section numbers, and `goal.cjs packet` prints it as
`chat_slice`. Never send more than 4000 characters: cut this file first. Keep
reminding while the copy stays unset, and never stop work for it. A child goal
change that alters a parent decision or criterion is an amendment to the
parent: apply it there first, then resend the parent.
<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

Three to seven bullets, each checkable without opening another file. Copy them
verbatim into the objective: nothing dereferences a path, so criteria left only
here are invisible to whatever judges completion.

- [x] `grep -c 'Operator answer: pending'` on this phase's `spec.md` prints 0, and `git -C ~/.local/share/deem/src status --porcelain` prints nothing
- [x] After `curl -s 'http://127.0.0.1:8300/health?probe=016'`, `deem-ctl stop` and `deem-ctl start`, `grep -c '"GET /health?probe=016 HTTP/1.1" 200' ~/.local/share/deem/server.log` prints 1
- [x] `shellcheck ~/.local/share/deem/bin/deem-ctl` exits 0 and one `deem-ctl.bak-*` file sits beside it. After that backup is restored and the server restarted, `deem-ctl status` exits 0 and prints `"backend": "torch"`
- [x] Q1's answer line in this phase's `spec.md` names the revisit trigger, and `curl -s -D - -o /dev/null http://127.0.0.1:8300/health` still shows `Access-Control-Allow-Origin: *`
- [x] `grep -c DEEM_N_ORDERS ~/.local/share/deem/bin/deem-ctl` prints 0
- [x] `git diff --stat -- ../008-cli-classifier-hub` prints nothing, and `cmp` of the live `deem-ctl` and `../007-classifier-deep-research/context/deem-ctl` exits 0
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
| Planning documents | Done | 2026-09-27: `spec.md`, `plan.md`, `tasks.md`, `acceptance-criteria.md`, this goal and `implementation-summary.md` authored from the owner-fix brief's section for this phase and `../007-classifier-deep-research/context/deem-local.md` |
| Operator answers to Q1 to Q4 | Done | 2026-09-28, each the recommended option: Q1 C, Q2 on, Q3 hold at 1, Q4 B. Recorded in `spec.md` section 10 by the spec pass, and `grep -c 'Operator answer: pending'` on it prints 0 |
| Build | Done | Released by the operator on 2026-09-28 (parent `goal.md` D3). Built from `scratch/w3-build/briefs/` and committed as `10697dcceb`. Rows below. Nothing under `~/.local/share/deem/` was changed or run while planning or during the spec pass |
| Baseline | Done | 13:18 to 13:20 CEST, HEAD `cdc790c48b`: `deem-ctl status` exit 0, `torch`, `model 8cbabbb, source 7cf293f`. `shellcheck` and `bash -n` clean, `DEEM_ACCESS_LOG=1` and `DEEM_N_ORDERS` counts 0, source checkout clean, header present, no backup and no copy yet. `choice` p50 72.9 and 74.8 ms. Source: build record section 1 |
| Negative control on the old `deem-ctl` | Done | Probe, `stop`, `start`: probe count 0 and 0 access lines of any kind. Source: build record section 4 |
| Backup (T004) | Done | `cp -p` to `deem-ctl.bak-2026-09-28`, `cmp` exit 0, SHA-256 `f4a6228a...0c3a19`. Source: build record sections 3 and 4 |
| Brief 01, the live `deem-ctl` (T005) | Done | Devin `deepseek-v4-1-flash-max`, 149 s, `STATUS: DONE`. One hunk at `start_server`, 3 lines out and 6 in, 250 to 253 lines, mode kept. Source: build record section 3 |
| Reviewed copy (T008) | Done | Read-through review, then `cp -p` to `../007-classifier-deep-research/context/deem-ctl`, `cmp` exit 0, SHA-256 `5ed8e538...1299a7`. Source: build record sections 3, 4 and 6 |
| Restart onto the new file | Done | `running (pid 37605)`, `torch`, earlier log kept (987 to 1419 bytes). Source: build record section 4 |
| Rollback rehearsal (T014) | Done | Backup restored, `status` exit 0 with `torch`, then the new version put back with `cmp` exit 0 against the copy. Source: build record section 4 |
| Access log (T011) | Done | Probe count 0, then 1, then 1 after `stop` and `start` with no wait. Source: build record section 4 |
| Header and latency (T012, T013) | Done | `Access-Control-Allow-Origin: *`. p50 75.7 and 72.9 ms with the log on, +0.45 ms on the mean. Source: build record sections 4 and 5 |
| Brief 02, the pointer line (T009) | Done | Pi `cline-pass/cline-pass/deepseek-v4.1-flash` xhigh, 23 s, `STATUS: DONE`. Line 75, numstat `2 0`. Source: build record section 3 |
| Final proof plan P1 to P12 | Done | All PASS at 13:28 CEST, criterion 6 rerun at 13:31 after `9aea8cdc56`. `validate.sh --strict` on 016 and 007 `RESULT: PASSED`, `check-goal.cjs` 5/5. Source: build record section 7 |
| Host check of the six criteria | Done | Pending count 0 and source status empty. Probe count 1. `shellcheck` exit 0 and one backup. Revisit trigger present and the header shows. `DEEM_N_ORDERS` count 0. 008 diff empty and `cmp` exit 0. Source: orchestrator session record |
| Host reproduction of criterion 2 | Done | `/health?probe=016session` 200, `stop` and `start` exit 0, count 1 after the restart, 0 NUL bytes in `server.log`, `status` ok `torch` `8cbabbb`/`7cf293f`. Source: orchestrator session record |
| Cross-family review | Done | The session (Claude) reviewed the live diff, written by DeepSeek via Devin, against `deem_server.py`'s `DEEM_ACCESS_LOG` read, with `shellcheck` clean and the live restart test: no P0, P1 or P2. Source: orchestrator session record |
| Build commit | Done | `10697dcceb`, 35 files: the reviewed copy, the fact-sheet line and `scratch/w3-build/`. Source: orchestrator session record, `git show --stat 10697dcceb` |
| Phase docs | Done | Closure leaf, 2026-09-28: tasks, acceptance criteria, this log and `implementation-summary.md` record the evidence, and `spec.md` and `plan.md` carry the corrected premises. Gate results are in `implementation-summary.md` Verification |

### Deviations and findings

| Item | Note |
|------|------|
| Access log needs no patch | The brief asked whether enabling the log needs a patch. It does not: `deem_server.py:794-800` writes the access line when `DEEM_ACCESS_LOG` is set, and `deem-ctl:120` already sends stderr to `server.log`. The same line uses `>`, which is why each start erased the previous log |
| `DEEM_N_ORDERS` and R21 | The brief ties the hold to phase 002's R21 accuracy result. R21 runs `noul` calls, and `DEEM_N_ORDERS` permutes `choice` questions only (`deem_server.py:665-671`), so R21 cannot show whether averaging helps. D3 ties the hold to 002's `choice` order-flip rate instead, and the orchestrator should confirm that reading |
| Blind compute after the header goes | Dropping `Access-Control-Allow-Origin` alone still lets a page send a simple POST without a preflight, because `_read_body` ignores the content type (`deem_server.py:821-831`, `:875`). Options A and B therefore refuse a foreign `Origin` outright. This rests on the Fetch standard and was not tested |
| Unconfirmed count | The brief says `deem-ctl` changed three times on 2026-09-27. Two versions are confirmed (208 and 250 lines, `research.md:164`). The third change is UNKNOWN here |
| Node `fetch` and `Origin` | Whether Node's built-in `fetch` sends an `Origin` header is UNKNOWN. T006 checks it against a local listener before option A or B is built |
| Scaffold title | The scaffold titled every file "Phase 7". The phase is 16 of 17 (`spec.md` metadata), so the titles now say Phase 16 |
| Amendment: operator answers (2026-09-28) | Source: D4 of the parent `goal.md` ("016 takes its recommendations") and its log row "New directive, wave 3". Q1 option C, accept, with its revisit trigger. Q2 on (`DEEM_ACCESS_LOG=1` and `>>`). Q3 hold `DEEM_N_ORDERS` at 1, reopened only by phase 002's `--deem` order-flip rate. Q4 option B, a reviewed copy at `../007-classifier-deep-research/context/deem-ctl` with a `cmp` check. Changed: the objective, D1 and D4, a new D5 for the accepted exposure, criteria 1, 4 and 6 (each keeps only the chosen branch, none dropped), `spec.md` section 10 and every requirement, task, plan step and acceptance row that branched on an answer. T003 is ticked, because the answers are recorded. The option A and B checks, the Node `Origin` check (T006) and the launcher and proxy rollbacks were removed with those options. The out-of-scope citation of `../008-cli-classifier-hub/spec.md` moved from `:98` and `:151` to `:100` and `:156`, because the same pass added lines above both in 008 |
| Conflict: "the one write outside the phase folder" | The spec-pass brief asked that the copy be named as the phase's one write outside its folder. The phase also plans the `deem-ctl` edit outside the repository and a one-line pointer in `../007-classifier-deep-research/context/deem-local.md` (T009). Both stay, so the docs call the copy the one new file this phase adds outside its own folder. Named for the orchestrator, not resolved |
| Conflict resolved: writes outside the phase folder | The orchestrator session accepted all three: the live `deem-ctl` (the operator's Q2), `deem-local.md` (the fact sheet must follow the changed facts) and the new reviewed copy. Source: orchestrator session record, rulings of the spec pass |
| Deem server stopped before the build | At 11:35 local `deem-ctl status` printed `stopped` with a dead pid in `server.pid` and no reboot. Cause UNKNOWN. The session restarted it (`running (pid 66655)`, `torch`, `8cbabbb`/`7cf293f`), rollback `deem-ctl stop`. Source: orchestrator session record |
| Devin permission mode | The session's executor pre-flight records that cli-devin requires explicit approval for `--permission-mode dangerous`, read as given by parent D5 with D7 and logged as a deviation for the operator. Whether brief 01's dispatch used that mode is not recorded here, because `scratch/w3-build/logs/01.dispatch.txt` names only the executor. Source: orchestrator session record |
| Rehearsal copies by the orchestrator | The rollback rehearsal and putting the new version back are two byte copies (`cp -p` to a temp name, then `mv -f`), each proven by `cmp` and SHA-256, run by the orchestrator rather than an executor brief. They are the named live check and copy already-reviewed bytes. Net change to the live file: none. Source: build record section 8 |
| Latency reference | NFR-P01 and T013 named 60 to 65 ms from `deem-local.md`. The same-session baseline with the log off was already 72.9 and 74.8 ms, so the 5 ms test used it. `spec.md` NFR-P01 now says so. Source: build record section 8 |
| Wait between stop and start | Moving onto the new file and the rehearsal waited for the old pid and every holder of `server.log` to exit before `start`. The criterion 2 check itself ran `stop` then `start` with no wait, as written. Source: build record section 8 |
| WHY comment | The edit carries a two-line WHY comment beside the two text changes, per sk-code's shell checklist, so a later reader does not turn `>>` back into `>`. Source: build record section 8 |
| `grep` in the build harness | The harness shell wraps `grep` in `ugrep -I`, which skips binary files and printed nothing for `server.log` while it held NUL bytes. Every count used `/usr/bin/grep`. Source: build record section 8 |
| Log copies kept | Each restart on the old `>` truncated `server.log`, so its content was copied to `scratch/w3-build/logs/02-server-log-before-negative-control.txt` and `04-server-log-before-rehearsal.txt` first. Both hold only model-load output, library warnings and `127.0.0.1` access lines. Source: build record section 8 |
| Criterion 6 and phase 008 | A closure leaf edited `../008-cli-classifier-hub/` docs during the build, so at 13:28 the 008 diff listed 6 files. Neither brief named 008 and both handbacks list only their own file. The session committed that closure as `9aea8cdc56`, and the rerun at 13:31 printed nothing. Source: build record sections 7 and 8 |
| Stale source commit | The docs cited source `6755b30`. The updater moved it to `7cf293f` at 2026-09-28T00:15:57Z, and every cited line of `deem_server.py` still resolves there. Corrected in the `spec.md` Owners row and the `plan.md` Dependencies row. `deem-local.md:22`, `:71` and `:79` (the build record's `:77`, before the pointer line) still say `6755b30`, outside this phase's one-line scope. Source: build record section 8, orchestrator session record |
| Moved `deem-ctl` lines | The edit adds 3 lines after line 117, so later citations moved down by 3: `:120` to `:123`, `:109-125` to `:109-128`, `:127-132` to `:130-135`, `:137-138` to `:140-141`, `:145-225` to `:148-228` and `:177-178` to `:180-181`. Corrected in `spec.md`, `plan.md` and `tasks.md`, and confirmed by the closure pass with `sed -n` on the live file. Source: build record section 8 |
| Moved `deem-local.md` lines | The pointer line and its blank line sit at `:75-76`, so the latency table cited as `:85` is now `:87` and the `DEEM_N_ORDERS` table at `:93-97` is now `:95-99`. Corrected in `spec.md` and `tasks.md`. Source: closure pass, derived from `scratch/w3-build/logs/02-verify.txt` and a read-only `grep -n` |
| Updater times | The hand-off said the next scheduled runs fall about 12:15 and 18:15 local. `update.log` stamps are UTC, so they fall at 14:15 and 20:15 CEST. None ran during the build. Source: build record section 8 |
| Log line size | The spec estimated about 70 bytes per request. A `POST /v1/systemone` access line measured 73 bytes. `spec.md` now carries both. Source: build record section 8 |
| Finding: the old `>` corrupted the log | After the negative control `server.log` held a 454-byte NUL run: the killed server's `resource_tracker` wrote a shutdown warning at its own file offset after the next start had truncated the file. `>>` opens with `O_APPEND`, so every write lands at the end, and the final log holds 0 NUL bytes. Source: build record section 8, orchestrator session record |
| Access lines from `deem-ctl` itself | Each `deem-ctl start` logs its `wait_healthy` polls and each `status` one `GET /health`. A window count must subtract them, and the `spec.md` edge case now says so. Source: build record section 8 |
| Trigger index | The committed trigger index lists `deem-local.md` in `corpus-manifest.json`. The phase names no regeneration, so the orchestrator's usual post-commit rebuild covers the new line. Source: build record section 8 |
| Reviewed copy mode | `cp -p` kept mode 755, and `git ls-files -s` shows the copy as `100755`. Source: build record section 8, closure pass |
| Changelog not refreshed | The phase metadata asks for a refresh under `../changelog/`. The parent packet has no `changelog/` folder and no phase of this packet wrote one, so nothing was refreshed. Source: closure pass, `ls` |
| Backup kept | `~/.local/share/deem/bin/deem-ctl.bak-2026-09-28` stays outside the repository until the operator confirms its removal, as the `spec.md` file table says. Open operator item, not a gap. Source: build record section 9 |
<!-- /ANCHOR:log -->
