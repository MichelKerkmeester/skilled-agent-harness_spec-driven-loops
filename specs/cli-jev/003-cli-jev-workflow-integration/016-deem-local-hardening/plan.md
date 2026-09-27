---
title: "Implementation Plan: Phase 16: deem-local-hardening"
description: "Ask the operator four decisions about the local Deem install in one message, then carry out only the approved ones: an access log switched on through deem-ctl's environment, the chosen CORS option and a versioned home for deem-ctl. Each change starts from a dated backup and ends with a live check the orchestrator runs."
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
| **Language/Stack** | Bash (`deem-ctl`), Python 3.12 standard library (Deem's server, any launcher or proxy) |
| **Framework** | None. Deem serves through `http.server.ThreadingHTTPServer` (`deem_server.py:65`, `:910`) |
| **Storage** | `~/.local/share/deem/server.log`, append-only after this phase |
| **Testing** | `shellcheck`, then live `curl` checks against `127.0.0.1:8300` run by the orchestrator |

### Overview
Every item is an operator decision first. The build asks Q1 to Q4 from `spec.md` section 10 in one message and records the answers. Only then does it touch the install: it backs up `deem-ctl`, adds `DEEM_ACCESS_LOG=1` and an appending redirect to `start_server`, applies the CORS option the operator picked and places `deem-ctl` where Q4 says. Deem's server already reads `DEEM_ACCESS_LOG` (`deem_server.py:794-800`), so the log needs no patch to LibertAI's code.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Other: a local service run by one control script, with a launchd schedule that updates it.

### Key Components
- **`deem-ctl`**: starts, stops, updates and rolls back the server. Its `start_server` (`deem-ctl:109-125`) sets the server's environment and redirects its output, so it is the one place the access log is switched on.
- **`serve/deem_server.py`**: LibertAI's server. `DeemHandler.log_message` writes the access line only when `DEEM_ACCESS_LOG` is set (`:794-800`). `_send_json` and `do_OPTIONS` send the wildcard CORS header (`:809`, `:837`).
- **`com.skilled.deem-update`**: runs `deem-ctl update` every 21,600 s and at login. It reaches `start_server`, so it inherits the access-log setting with no change of its own.

### Data Flow
A caller posts to `127.0.0.1:8300`. The handler answers and, with the log on, writes `127.0.0.1 - - [time] "<request line>" <status> -` to stderr, which `deem-ctl` appends to `server.log`. Under option A or B of Q1, a request carrying a foreign `Origin` gets 403 before any inference runs.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `deem-ctl` `start_server` (`:109-125`) | Sets the server's environment and overwrites `server.log` | Update: add `DEEM_ACCESS_LOG=1`, change `>` to `>>` | `grep -n 'DEEM_ACCESS_LOG=1' deem-ctl` returns one line. `shellcheck deem-ctl` exits 0 |
| `deem_server.py` `log_message` (`:794-800`) | Writes the access line when the variable is set | Unchanged | `git -C ~/.local/share/deem/src status --porcelain` prints nothing |
| `deem_server.py` CORS headers (`:809`, `:837`) | Allows every origin | Update only under Q1 option A or B, and never by an in-place edit unless the operator picks that form | The foreign-`Origin` `curl` in `acceptance-criteria.md` |
| `deem-ctl` `update` and `rollback` (`:145-225`) | Restart the server through `start_server` | Unchanged. They inherit the setting | A restart keeps the earlier log lines |
| Phase 008's lifecycle reference (Planned) | Documents `deem-ctl` commands | Not a consumer of the change. No command or exit code changes | `git diff --stat -- ../008-cli-classifier-hub` is empty |
| `deem-local.md` (`:73`) | States that closing the exposure is the operator's call | Update: one pointer line to section 10 of this phase | `grep -n '016-deem-local-hardening' deem-local.md` returns one line |

Required inventories:
- Same-class producers: `rg -n 'Access-Control-Allow-Origin' ~/.local/share/deem/src/serve` finds `deem_server.py:809` and `:837` only. `deem_mcp.py` is a separate MCP server that `deem-ctl` never starts, so it is out of scope.
- Consumers of changed symbols: `rg -n 'SERVER_LOG|server\.log' ~/.local/share/deem/bin/deem-ctl` lists every reader of the log before the redirect changes.
- Matrix axes: the request's `Origin` header (absent, foreign) by the request method (`GET`, `POST`, `OPTIONS`). Six rows under option A or B. Server restart (none, one) for the log.
- Algorithm invariant: under option A or B, no request with a foreign `Origin` reaches inference, and every request without `Origin` behaves exactly as today.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.

| Step | Observable check |
|------|------------------|
| Ask Q1 to Q4 in one message and record the answers | `grep -c 'Operator answer: pending' spec.md` prints 0 |
| Back up `deem-ctl` | `cmp ~/.local/share/deem/bin/deem-ctl ~/.local/share/deem/bin/deem-ctl.bak-<date>` exits 0 before the edit |
| Switch the access log on | After one `/health` request and one restart, the request's line is still in `server.log` |
| Apply the Q1 option | The foreign-`Origin` and no-`Origin` `curl` pair, or the recorded acceptance |
| Place `deem-ctl` per Q4 | `cmp` of the live file and the copy exits 0, or the recorded choice to leave it |
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
| Integration | Q1 option A or B. Happy path: no `Origin` gets 200. Edge case: a foreign `Origin` on `POST` and on `OPTIONS` gets 403 with no `Access-Control-Allow-Origin` | `curl -s -D -` |
| Manual | Whether Node's `fetch` sends an `Origin` header, before choosing A or B | `nc -l 9999` and one `node -e` fetch to it |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| The operator's answers to Q1 to Q4 | Internal | Yellow | Nothing under `~/.local/share/deem/` changes. REQ-001 can still close |
| The served Deem instance at `8cbabbb` and `6755b30` | External | Green | The live checks cannot run. `deem-ctl start` brings it up |
| `shellcheck` at `/opt/homebrew/bin/shellcheck` | External | Green | The syntax check falls back to `bash -n` |
| Phase 002's `--deem` order-flip rate | Internal | Yellow | Only the Q3 revisit waits on it. This phase does not |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: `deem-ctl start` exits 4, `deem-ctl status` does not print backend `torch`, `choice` p50 rises more than 5 ms or the operator withdraws an answer.
- **Procedure**: `cp -p ~/.local/share/deem/bin/deem-ctl.bak-<date> ~/.local/share/deem/bin/deem-ctl`, then `deem-ctl stop` and `deem-ctl start`. For Q1 option A, also delete the launcher, or run `git -C ~/.local/share/deem/src checkout -- serve/deem_server.py` for the in-place form. For option B, also stop the proxy process and delete its script. The appended lines in `server.log` are harmless and stay.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup (answers, backup) ──► Core (log, CORS option, deem-ctl home) ──► Verify (live checks)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core, Config |
| Config | Setup | Core |
| Core | Setup, Config | Verify |
| Verify | Core | None |

Config here is the Q1 option choice and the Node `Origin` check. It runs only when Q1 is A or B.
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 30 minutes, plus the operator's reply |
| Core Implementation | Low for C, Med for A or B | 30 minutes for the log alone, 2 hours with a launcher or proxy |
| Verification | Low | 30 minutes |
| **Total** | | **1.5 to 3 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Backup created (if data changes)
- [ ] Feature flag configured
- [ ] Monitoring alerts set

The backup is the dated copy of `deem-ctl`. The feature flag is `DEEM_ACCESS_LOG` itself. The monitoring is `deem-ctl status` and the tail of `update.log`.

### Rollback Procedure
1. Stop the server: `deem-ctl stop`.
2. Restore the backup: `cp -p ~/.local/share/deem/bin/deem-ctl.bak-<date> ~/.local/share/deem/bin/deem-ctl`, and remove any launcher or proxy file Q1 added.
3. Verify: `deem-ctl start`, then `deem-ctl status` exits 0 and prints backend `torch`.
4. Tell the operator which answer was rolled back and why, and set that answer back to pending in `spec.md` section 10.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A. `server.log` only gains lines.
<!-- /ANCHOR:enhanced-rollback -->

---
