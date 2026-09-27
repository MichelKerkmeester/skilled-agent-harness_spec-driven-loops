---
title: "Feature Specification: Phase 16: deem-local-hardening"
description: "The local Deem server answers any web page with Access-Control-Allow-Origin: * and no authentication, its access log is off, DEEM_N_ORDERS has no recorded decision and deem-ctl exists only as one unversioned file. This phase puts each of the four to the operator as a decision with a rollback and carries out only what the operator approves."
trigger_phrases:
  - "deem cors exposure"
  - "deem access log"
  - "deem-ctl versioning"
  - "deem n orders decision"
  - "deem local hardening"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 16: deem-local-hardening

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-09-27 |
| **Branch** | `worktrees/069-cli-jev-workflow-integration` |
| **Parent Spec** | ../spec.md |
| **Phase** | 16 of 17 |
| **Predecessor** | 015-fanout-merge-and-steering-fixes |
| **Successor** | 017-deem-search-narrowing-arm |
| **Handoff Criteria** | Section 10 records the operator's answer to each of the four decisions, each approved change passes its check in `acceptance-criteria.md` and `validate.sh --strict` passes on this phase |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 16** of the Owner fixes and follow-ups found during the classifier research specification.

**Scope Boundary**: The local Deem install under `~/.local/share/deem/`, which sits outside every repository: `bin/deem-ctl`, `server.log` and, only on the operator's yes, a patch or proxy in front of `src/serve/deem_server.py`. Inside the repository, this folder and one pointer line in `../007-classifier-deep-research/context/deem-local.md`. No classifier, no model call and no change to any skill.

**Dependencies**:
- The operator's answers to the four decisions in section 10. Nothing under `~/.local/share/deem/` changes before them.
- The served Deem instance, for the build's live checks only. The orchestrator runs `deem-ctl`, never a feature.
- Phase 002's `--deem` result, for the `DEEM_N_ORDERS` revisit only. This phase does not wait on it.

**Deliverables**:
- Four recorded operator decisions, each with its options and rollbacks (section 10).
- `deem-ctl` that starts the server with its access log on and keeps the log across restarts.
- The approved CORS option carried out and checked, or the accepted exposure recorded with its revisit trigger.
- `deem-ctl` in the versioned home the operator picks, or a recorded choice to leave it unversioned.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The local Deem server sends `Access-Control-Allow-Origin: *` on every answer (`serve/deem_server.py:809`) and on every preflight (`:837`) and checks no credential, so any web page open in the operator's browser can post questions to `127.0.0.1:8300` and read the answers. That exposes compute, not data. Nobody can tell after the fact who called the server, because the access log is off unless `DEEM_ACCESS_LOG` is set (`deem_server.py:794-800`) and `deem-ctl` overwrites `server.log` on every start (`deem-ctl:120`), which is why the research left open question 52 UNKNOWN (`research.md:1175`). `DEEM_N_ORDERS` stays at its default of 1 with no recorded decision, and `deem-ctl` lives only at `~/.local/share/deem/bin/deem-ctl` with no version history.

### Purpose
Each of the four gaps has an operator decision on record with a named rollback, and the server log can answer whether anything called Deem during a given window.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### Owners

| Surface | Owner | Contract the build follows |
|---------|-------|----------------------------|
| `~/.local/share/deem/bin/deem-ctl` | This packet. The orchestrator wrote it on 2026-09-27 | Its own header (`deem-ctl:1-18`): usage, exit codes 0 to 4. `shellcheck` clean, as `deem-local.md:69` records |
| `~/.local/share/deem/src/` (`serve/deem_server.py` and the rest) | LibertAI, GitHub `Libertai/deem`, checked out at `6755b30` (2026-09-25) | Not edited without the operator's permission. `deem-ctl update` moves this checkout with `git checkout --detach` (`deem-ctl:138`) |
| `~/Library/LaunchAgents/com.skilled.deem-update.plist` | This packet | Unchanged by this phase |
| `../007-classifier-deep-research/context/deem-local.md` | This packet | The fact sheet phase 008 cites. One pointer line only |

### Collision check

`git log -5` on `../007-classifier-deep-research/context/deem-local.md` shows `00480a8d5c`, `506e4e6430` and `525ec8244a`, all 2026-09-27 and all round-3 research commits. `../008-cli-classifier-hub/` shows only `00480a8d5c`. Nothing under `~/.local/share/deem/` is in a repository, so git has no history for it. The in-flight work to avoid is the launchd schedule, which runs `deem-ctl update` every 21,600 s and at login (the plist's `StartInterval`) and can restart the server or move `src/` mid-build. The parent `../spec.md` has uncommitted edits from its own leaf. This phase never touches it.

### In Scope
- Put the CORS exposure to the operator as one decision with three options, each with its rollback: patch Deem's server, put a local proxy in front or accept it.
- Turn on the server's own access log through `deem-ctl` and stop the log from being overwritten on restart.
- Record `DEEM_N_ORDERS` at 1 as a decision tied to phase 002's `--deem` result.
- Decide where a reviewed copy of `deem-ctl` lives, if anywhere.

### Out of Scope
- Any patch to Deem's code or any install before the operator's yes. Parent decisions require both.
- Log rotation. The log grows by about 70 bytes per request (an estimate from the line format in section 10), and no live caller exists yet. Section 6 records the growth risk.
- The `stop` then `start` port race that `research.md:293` infers from `deem-ctl:127-132`. It is a separate defect and not one of the four items.
- Any change to phase 008's frozen scope. `cli-deem` documents `deem-ctl` and never reimplements it (`../008-cli-classifier-hub/spec.md:98`, `:151`).
- Raising `DEEM_N_ORDERS`. The decision is to hold it.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `~/.local/share/deem/bin/deem-ctl` | Modify | Add `DEEM_ACCESS_LOG=1` to the server's environment in `start_server` (`:118-120`) and append to `server.log` instead of overwriting it. Only after the operator's yes, and only after a backup copy |
| `~/.local/share/deem/bin/deem-ctl.bak-<date>` | Create | The backup the rollback restores. Removed at close once the operator confirms |
| `~/.local/share/deem/src/serve/deem_server.py`, a launcher beside it or a proxy script | Modify or Create | Only when the operator picks option A or B in Q1. Section 10 names the file for each |
| `../007-classifier-deep-research/context/deem-local.md` | Modify | One line after the Exposure paragraph (`:73`) that points to this phase's recorded decisions |
| A reviewed copy of `deem-ctl` | Create | Only when the operator picks a versioned home in Q4 |
| `spec.md`, `tasks.md`, `acceptance-criteria.md`, `goal.md`, `implementation-summary.md` in this folder | Modify | Record the answers and the evidence |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance |
|----|-------------|------------|
| REQ-001 | Each of the four items goes to the operator as a decision with its options and rollbacks, and nothing under `~/.local/share/deem/` changes before the answer | Section 10 holds four answers and no `Operator answer: pending`. `git -C ~/.local/share/deem/src status --porcelain` prints nothing unless Q1 chose the in-place patch |
| REQ-002 | `deem-ctl` turns on the server's access log with no patch to Deem's code, and the log survives a restart | `start_server` exports `DEEM_ACCESS_LOG=1`, which `deem_server.py:795` already reads, and redirects with `>>`. After one `/health` request and one restart, `server.log` still holds that request's line |
| REQ-003 | Every change to the install has a backup and a rehearsed rollback | A dated backup of `deem-ctl` exists before the first edit. `shellcheck` on `deem-ctl` exits 0. Restoring the backup and restarting brings `deem-ctl status` back to exit 0 with backend `torch` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance |
|----|-------------|------------|
| REQ-004 | The CORS option the operator picks is carried out and checked | Option A or B: a request with a foreign `Origin` gets 403 and no `Access-Control-Allow-Origin`, and a request with no `Origin` gets 200. Option C: the header is unchanged, and section 10 records the acceptance with its revisit trigger |
| REQ-005 | `DEEM_N_ORDERS` stays at 1 as a recorded decision tied to phase 002's `--deem` result | `deem-ctl` never sets `DEEM_N_ORDERS`, so the server default of 1 holds (`deem_server.py:985`). Section 10 names the result that reopens it |
| REQ-006 | `deem-ctl` has the versioned home the operator picks, without widening phase 008 | For a copy, `cmp` of the live file and the copy exits 0. `git diff --stat` on `../008-cli-classifier-hub/` is empty either way |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A later run can answer "did anything call Deem between T1 and T2" by counting access-log lines in that window of `server.log`, which research open question 52 could not.
- **SC-002**: The operator has one recorded answer per decision, and every change made on those answers can be undone with the named rollback in one step.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The operator's answers | Every change waits. REQ-001 alone can still close | Ask all four in one message. The access log does not depend on the CORS answer |
| Dependency | The served instance for live checks | The build's live checks cannot run | The orchestrator starts it with `deem-ctl start`. No feature calls it |
| Risk | The six-hourly update restarts the server or moves `src/` during the build | Med | Read the tail of `update.log` first. Write the new `deem-ctl` to a temp file and `mv` it into place, so a scheduled run never reads a half-written script |
| Risk | An in-place patch to `deem_server.py` meets an upstream change to the same file | High for option A in place | `switch_to` sets `models/current` before `git checkout --detach` (`deem-ctl:137-138`). A checkout refused over a local edit would stop `update` under `set -e` with the server already stopped (inferred from `deem-ctl:20`, `:177-178`, not tested). Section 10 prefers a launcher over an in-place edit for that reason |
| Risk | An `Origin` refusal blocks a legitimate caller | Low | `curl`, Python `urllib` and the planned Node client are not browsers. Whether Node's `fetch` sends `Origin` is UNKNOWN, so the build checks it against a local listener before choosing A or B. Deem's own playground (`src/playground/index.html:910`, `:1075`) runs in a browser and would need its origin allowed if the operator ever serves it |
| Risk | `server.log` grows without bound | Low | About 70 bytes per request. Revisit when `du -k` passes 10,240 KB or when a live hook starts calling Deem |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The access log adds no measurable latency to a `choice`. The build compares `choice` p50 over 50 calls before and after against the 60 to 65 ms in `deem-local.md:36`, `:85`, and a rise over 5 ms reverts the log.
- **NFR-P02**: `deem-ctl start` still reaches a healthy server inside its 120-try wait (`deem-ctl:72-81`).

### Security
- **NFR-S01**: The access log records only the client address, time, request line, status and size (the standard library's `log_request` format). It never records a request body.
- **NFR-S02**: No option adds a credential, key or token to any file.

### Reliability
- **NFR-R01**: Every change keeps `deem-ctl`'s exit codes 0 to 4 and their meanings (`deem-ctl:13-18`).
- **NFR-R02**: A failed change leaves the previous `deem-ctl` restorable from its dated backup in one `cp`.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: a request with no `Origin` header is never refused under option A or B. Every non-browser caller sends none.
- Maximum length: the access log has no line cap beyond the request line the standard library already bounds.
- Invalid format: a malformed request line is logged through `log_error`, which also goes through `log_message` and so also obeys `DEEM_ACCESS_LOG`.

### Error Scenarios
- External service failure: if the server fails to start after the `deem-ctl` edit, `deem-ctl start` exits 4 and the rollback restores the backup.
- Network timeout: not applicable. Every check here targets `127.0.0.1`.
- Concurrent access: `deem-ctl`'s own health polling and the update smoke decision (`deem-ctl:85-89`) also write log lines. A window count must subtract the `update.log` entries at the same timestamps.

### State Transitions
- Partial completion: REQ-001 can close with every answer recorded even when the operator approves no change. Each approved change is independent.
- Session expiry: an update that lands mid-build restarts the server through `start_server`, which then already carries the access-log setting.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 7/25 | One shell script outside the repository, one pointer line, at most one proxy or launcher file |
| Risk | 12/25 | A live local service and an unversioned script, with a scheduled updater that can run mid-build |
| Research | 5/20 | The server code was read. The Node `Origin` behavior is the one open fact |
| **Total** | **24/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

These are the four operator decisions. The build asks them in one message and writes each answer in place of `Operator answer: pending`.

- **Q1 CORS exposure.** The server answers any origin (`deem_server.py:809`, `:837`) and checks no credential. Dropping the header alone would stop a page from reading answers. But a simple cross-origin POST needs no preflight, and `_read_body` parses the body whatever its content type (`deem_server.py:821-831`, `:875`). So a page could still spend compute blind (inferred from the Fetch standard's simple-request rule, not tested). The fix that closes both refuses any request that carries an `Origin` header outside an allowlist, which starts empty.
  - A. Patch Deem's server behavior. Preferred form: a launcher script beside `src/` that imports `deem_server`, subclasses `DeemHandler` to refuse a foreign `Origin` with 403 and drop the wildcard. `deem-ctl` starts it in place of `serve/deem_server.py`. It leaves the git checkout clean, so updates never meet a local edit, but it breaks if upstream renames the handler, which the update smoke decision would catch. The in-place edit is the other form and carries the update risk in section 6. Needs the operator's permission to change Deem's behavior. Rollback: restore the `deem-ctl` backup, delete the launcher, restart.
  - B. Local proxy. Deem moves to another port and a standard-library Python proxy in Deem's own venv listens on 8300 and refuses foreign origins. No package is installed, but it adds a second process, so the parent's install rule applies. Rollback: stop the proxy, restore the `deem-ctl` backup so Deem listens on 8300 again, delete the proxy script.
  - C. Accept. No change. Every planned Deem caller is an offline arm run by hand (002, 017). Revisit trigger: before any hook calls Deem live, because a page holding the single inference lock (`deem_server.py:201`, `:236`) would push a hook past its deadline. Rollback: none needed.
  - Recommendation (judgment): C now, with A's launcher as the plan when the revisit trigger fires. The exposure is compute only, and each fix adds a part the six-hourly update must survive.
  - Operator answer: pending
- **Q2 Access log.** No patch is needed: the server writes an access line to stderr when `DEEM_ACCESS_LOG` is set (`deem_server.py:794-800`), and `deem-ctl` already sends stderr to `server.log` (`deem-ctl:120`). The change is `DEEM_ACCESS_LOG=1` in `start_server`'s environment plus `>>` in place of `>`. Each line reads `127.0.0.1 - - [time] "POST /v1/systemone HTTP/1.1" 200 -`. Every caller shows as `127.0.0.1`, so the log proves whether and when calls happened, not which process made them. A caller's own record, such as phase 002's `calls.jsonl`, is what attributes a call. Rollback: restore the `deem-ctl` backup and restart.
  - Operator answer: pending
- **Q3 `DEEM_N_ORDERS`.** Hold at 1. Measured p50 at 1, 2 and 4 orders: about 60, 94 to 100 and 166 to 168 ms (`deem-local.md:93-97`). The setting is server-wide and permutes `choice` questions only (`deem_server.py:665-671`), so it cannot change R21's accuracy, which phase 002 measures with `noul` calls. The result that reopens it is phase 002's `--deem` order-flip rate over its three caller-side rotations: above the 0.10 that `keep` allows, averaging may help, and a caller can still send its own permuted requests, as research row 102 recommends. Rollback: none needed.
  - Operator answer: pending
- **Q4 Versioned home for `deem-ctl`.** Two versions are confirmed, a 208-line pre-run copy and the 250-line live file (`research.md:164`). The count of three changes on 2026-09-27 is the orchestrator's and is not confirmed here.
  - A. Leave it unversioned. The dated backups from this phase are the only history.
  - B. A reviewed copy in this packet beside the fact sheet, at `../007-classifier-deep-research/context/deem-ctl`, with a `cmp` check against the live file. It stays documentation, so phase 008's scope is untouched.
  - C. A copy as an asset of `cli-deem`. This amends phase 008's frozen file list, even though a copy does not reimplement `deem-ctl`.
  - Recommendation (judgment): B. It records each reviewed version in git at the cost of one `cmp` per change, and it needs no amendment to phase 008.
  - Operator answer: pending
<!-- /ANCHOR:questions -->

---

