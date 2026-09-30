---
title: "Implementation Plan: Phase 16: deem-local-hardening"
description: "Carry out the operator's four answers of 2026-09-28 on the local Deem install: an access log switched on through deem-ctl's environment, the CORS exposure accepted with its revisit trigger, DEEM_N_ORDERS held at 1 and a reviewed copy of deem-ctl kept in git. Each change starts from a dated backup and ends with a live check the orchestrator runs."
trigger_phrases:
  - "deem hardening plan"
  - "deem access log plan"
  - "deem cors options rollback"
  - "deem-ctl backup rollback"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 16: deem-local-hardening

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Bash (`deem-ctl`). Deem's server (Python 3.12 standard library) is read, never changed |
| **Framework** | None. Deem serves through `http.server.ThreadingHTTPServer` (`deem_server.py:65`, `:910`) |
| **Storage** | `~/.local/share/deem/server.log`, append-only after this phase, and the reviewed copy `../007-classifier-deep-research/context/deem-ctl` in git |
| **Testing** | `shellcheck`, then live `curl` checks against `127.0.0.1:8300` run by the orchestrator, and `cmp` for the copy |

### Overview
Every item was an operator decision first, and the operator answered Q1 to Q4 of `spec.md` section 10 on 2026-09-28. The build backs up `deem-ctl`, adds `DEEM_ACCESS_LOG=1` and an appending redirect to `start_server` (Q2), leaves the CORS header as it is (Q1 option C) and then copies the edited `deem-ctl` to `../007-classifier-deep-research/context/deem-ctl` (Q4 option B). Deem's server already reads `DEEM_ACCESS_LOG` (`deem_server.py:794-800`), so the log needs no patch to LibertAI's code.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented. `spec.md` sections 2 and 3
- [x] Success criteria measurable. SC-001 and SC-002, each checked by a command in `acceptance-criteria.md`
- [x] Dependencies identified. The operator's four answers were recorded before the build, and the served instance was up at the baseline (`deem-ctl status` exit 0, `torch`)

### Definition of Done
- [x] All acceptance criteria met. `acceptance-criteria.md`, 6 of 6 Met
- [x] Tests passing (if applicable). No test suite covers `deem-ctl`. `shellcheck` and `bash -n` exit 0, and every live check in `tasks.md` Phase 3 passed
- [x] Docs updated (spec/plan/tasks). The closure pass of 2026-09-28 recorded the build evidence and corrected the stale premises
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Other: a local service run by one control script, with a launchd schedule that updates it.

### Key Components
- **`deem-ctl`**: starts, stops, updates and rolls back the server. Its `start_server` (`deem-ctl:109-128`) sets the server's environment and redirects its output, so it is the one place the access log is switched on.
- **`serve/deem_server.py`**: LibertAI's server. `DeemHandler.log_message` writes the access line only when `DEEM_ACCESS_LOG` is set (`:794-800`). `_send_json` and `do_OPTIONS` send the wildcard CORS header (`:809`, `:837`).
- **`com.skilled.deem-update`**: runs `deem-ctl update` every 21,600 s and at login. It reaches `start_server`, so it inherits the access-log setting with no change of its own.

### Data Flow
A caller posts to `127.0.0.1:8300`. The handler answers and, with the log on, writes `127.0.0.1 - - [time] "<request line>" <status> -` to stderr, which `deem-ctl` appends to `server.log`. Q1's answer is C, so the handler still answers every origin, exactly as today.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `deem-ctl` `start_server` (`:109-128`) | Sets the server's environment. It overwrote `server.log` before this phase | Update: add `DEEM_ACCESS_LOG=1`, change `>` to `>>` | `grep -n 'DEEM_ACCESS_LOG=1' deem-ctl` returns one line. `shellcheck deem-ctl` exits 0 |
| `deem_server.py` `log_message` (`:794-800`) | Writes the access line when the variable is set | Unchanged | `git -C ~/.local/share/deem/src status --porcelain` prints nothing |
| `deem_server.py` CORS headers (`:809`, `:837`) | Allows every origin | Unchanged. Q1's answer is C, accept | A `/health` response still carries `Access-Control-Allow-Origin: *`, and `git -C ~/.local/share/deem/src status --porcelain` prints nothing |
| `deem-ctl` `update` and `rollback` (`:148-228`) | Restart the server through `start_server` | Unchanged. They inherit the setting | A restart keeps the earlier log lines |
| Phase 008's lifecycle reference (Planned) | Documents `deem-ctl` commands | Not a consumer of the change. No command or exit code changes | `git diff --stat -- ../008-cli-classifier-hub` is empty |
| `deem-local.md` (`:73`) | States that closing the exposure is the operator's call | Update: one pointer line to section 10 of this phase | `grep -n '016-deem-local-hardening' deem-local.md` returns one line |
| `../007-classifier-deep-research/context/deem-ctl` | Does not exist | Create: the reviewed copy of the edited `deem-ctl` (Q4 option B) | `cmp` of the live file and the copy exits 0 |

Required inventories:
- Same-class producers: `rg -n 'Access-Control-Allow-Origin' ~/.local/share/deem/src/serve` finds `deem_server.py:809` and `:837` only. `deem_mcp.py` is a separate MCP server that `deem-ctl` never starts, so it is out of scope. Q1's answer C leaves both lines as they are.
- Consumers of changed symbols: `rg -n 'SERVER_LOG|server\.log' ~/.local/share/deem/bin/deem-ctl` lists every reader of the log before the redirect changes.
- Matrix axes: server restart (none, one) for the log. The `Origin`-by-method matrix waits for Q1's revisit trigger.
- Algorithm invariant: every request behaves exactly as today, and the only new effect is one access line per request in `server.log`.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.

| Step | Observable check |
|------|------------------|
| Confirm the operator's answers of 2026-09-28 are recorded | `grep -c 'Operator answer: pending' spec.md` prints 0 |
| Back up `deem-ctl` | `cmp ~/.local/share/deem/bin/deem-ctl ~/.local/share/deem/bin/deem-ctl.bak-2026-09-28` exits 0 before the edit |
| Switch the access log on (Q2) | After one `/health` request and one restart, the request's line is still in `server.log` |
| Confirm the Q1 acceptance | Q1's answer line names the revisit trigger, and a `/health` response still carries `Access-Control-Allow-Origin: *` |
| Copy the edited `deem-ctl` (Q4 option B) | `cmp ~/.local/share/deem/bin/deem-ctl ../007-classifier-deep-research/context/deem-ctl` exits 0 |
| Point the fact sheet here | `grep -n '016-deem-local-hardening' ../007-classifier-deep-research/context/deem-local.md` returns one line |
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

`deem-ctl` has no test suite, so each changed surface gets a happy path and one edge case as live checks.

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | `deem-ctl` syntax and quoting after the edit | `shellcheck`, `bash -n` |
| Integration | Access log. Happy path: one `GET /health` writes one line. Edge case: the line survives `deem-ctl stop` then `deem-ctl start` | `curl`, `grep -c` on `server.log` |
| Integration | The reviewed copy. Happy path: `cmp` of the live file and the copy exits 0. Edge case: after the rollback rehearsal puts the new version back, `cmp` still exits 0 | `cmp` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| The operator's answers to Q1 to Q4 | Internal | Green | Answered on 2026-09-28 and recorded in `spec.md` section 10 |
| The served Deem instance at `8cbabbb` and `7cf293f` (source `6755b30` at planning, moved by the scheduled update of 2026-09-28T00:15:57Z) | External | Green | The live checks cannot run. `deem-ctl start` brings it up |
| `shellcheck` at `/opt/homebrew/bin/shellcheck` | External | Green | The syntax check falls back to `bash -n` |
| Phase 002's `--deem` order-flip rate | Internal | Yellow | Only the Q3 revisit waits on it. This phase does not |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: `deem-ctl start` exits 4, `deem-ctl status` does not print backend `torch`, `choice` p50 rises more than 5 ms or the operator withdraws an answer.
- **Procedure**: `cp -p ~/.local/share/deem/bin/deem-ctl.bak-2026-09-28 ~/.local/share/deem/bin/deem-ctl`, then `deem-ctl stop` and `deem-ctl start`. The rehearsal of 2026-09-28 ran it as stop, restore and start, and it restored through a temp copy and `mv -f` so a scheduled run never reads a half-written script (`spec.md` section 6). For Q4, revert the commit that added `../007-classifier-deep-research/context/deem-ctl`. Q1's answer C changed nothing, so it needs no rollback. The appended lines in `server.log` are harmless and stay.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup (answers, backup) ──► Core (log, then the reviewed copy) ──► Verify (live checks)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core |
| Core | Setup | Verify |
| Verify | Core | None |

No Config step runs, because Q1's answer is C and nothing needs an `Origin` check.
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 30 minutes |
| Core Implementation | Low | 30 minutes for the log and the copy |
| Verification | Low | 30 minutes |
| **Total** | | **1.5 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Backup created (if data changes). `deem-ctl.bak-2026-09-28`, `cmp` exit 0 against the live file before the edit
- [x] Feature flag configured. `DEEM_ACCESS_LOG=1` in `start_server`, `grep -c` prints 1
- [ ] Monitoring alerts set. No alert exists. The monitoring below is manual

The backup is the dated copy of `deem-ctl`. The feature flag is `DEEM_ACCESS_LOG` itself. The monitoring is `deem-ctl status` and the tail of `update.log`.

### Rollback Procedure
1. Stop the server: `deem-ctl stop`.
2. Restore the backup: `cp -p ~/.local/share/deem/bin/deem-ctl.bak-2026-09-28 ~/.local/share/deem/bin/deem-ctl`. Q1 added no launcher or proxy file.
3. Verify: `deem-ctl start`, then `deem-ctl status` exits 0 and prints backend `torch`.
4. Tell the operator which answer was rolled back and why, and set that answer back to pending in `spec.md` section 10.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A. `server.log` only gains lines.
<!-- /ANCHOR:enhanced-rollback -->

---
