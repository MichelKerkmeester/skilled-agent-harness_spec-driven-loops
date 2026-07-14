---
title: "GIT-035 -- Orphan-daemon reporting stays report-only unless --reap-daemons"
description: "This scenario validates orphan-daemon reporting for `GIT-035`. It focuses on prove the reaper only reports a daemon whose worktree DB directory no longer exists, unless --reap-daemons is explicitly passed, and never touches a daemon whose worktree still exists."
version: 1.0.0.0
---

# GIT-035 -- Orphan-daemon reporting stays report-only unless --reap-daemons

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `GIT-035`.

---

## 1. OVERVIEW

This scenario validates orphan-daemon reporting for `GIT-035`. It focuses on prove the reaper only REPORTS (never kills) a daemon whose worktree DB directory no longer exists, unless `--reap-daemons` is explicitly passed, and never touches a daemon whose worktree still exists.

### Why This Matters

Daemon killing is opt-in specifically to protect live sessions from a false-positive orphan classification. The default-safe behavior and the explicit opt-in must both be provably correct on their own.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `GIT-035` and confirm the expected signals without contradictory evidence.

- Objective: prove the reaper only REPORTS a daemon whose worktree DB directory no longer exists, unless `--reap-daemons` is explicitly passed, and never touches a daemon whose worktree still exists.
- Real user request: `Tell me about any leftover MCP daemons from deleted worktrees, but don't kill anything unless I ask you to.`
- Prompt: `Run the worktree reaper's orphan-daemon scan against a fixture with one live-worktree daemon and one gone-worktree daemon, first without --reap-daemons and then with it, and confirm the live daemon is always left alone.`
- Expected execution process: Fake `pgrep`/`ps` to report two `context-server.js` PIDs, one whose command line references an existing worktree path and one referencing a removed path; run the reaper without `--reap-daemons` (expect report-only for the orphan) and then with `--reap-daemons --dry-run` (expect the orphan named for a `kill -TERM`, the live one still skipped).
- Expected signals: the default run logs `orphan daemon (report only; use --reap-daemons to kill) pid=<gone-pid>`; with `--reap-daemons` (dry-run), stdout contains `DRY_RUN would: kill -TERM <gone-pid>` and never `kill -TERM <live-pid>`.
- Desired user-visible outcome: A concise PASS, PARTIAL, FAIL, or SKIP verdict with the evidence needed for release review.
- Pass/fail: PASS if the live-worktree daemon is never targeted in either run and the orphan is only ever reported by default, only ever a kill target when `--reap-daemons` is explicitly passed. FAIL if the live daemon is ever targeted, or if the orphan is killed without `--reap-daemons` being passed.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request and confirm the scenario ID.
2. Confirm the repository is on the intended branch and the working tree is safe for the scenario.
3. Execute or document the command sequence exactly as written.
4. Capture the expected signals and evidence artifacts.
5. Return a concise user-facing verdict with failure triage if needed.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| GIT-035 | Orphan-daemon reporting stays report-only unless --reap-daemons | prove the reaper only reports a daemon whose worktree DB directory no longer exists, unless `--reap-daemons` is explicitly passed, and never touches a daemon whose worktree still exists. | `Run the worktree reaper's orphan-daemon scan against a fixture with one live-worktree daemon and one gone-worktree daemon, first without --reap-daemons and then with it, and confirm the live daemon is always left alone.` | 1. `bash: <fake pgrep/ps returning one live-path pid and one gone-path pid>` -> 2. `bash: bash .opencode/bin/worktree-reaper.sh` -> 3. `bash: bash .opencode/bin/worktree-reaper.sh --reap-daemons --dry-run` | Step 2 logs `orphan daemon (report only...)` for the gone-path pid only; step 3 shows `DRY_RUN would: kill -TERM <gone-pid>` and never mentions the live-path pid. | Both runs' full stdout/stderr, specifically the `orphan daemon` report line and the `DRY_RUN would: kill -TERM` line. | PASS if the live-worktree daemon is never targeted in either run and the orphan is only ever reported by default, only ever a kill target when `--reap-daemons` is explicitly passed. FAIL if the live daemon is ever targeted, or if the orphan is killed without `--reap-daemons` being passed. | Review `_daemon_cmdline_is_orphan`/`_daemon_worktree_path_from_cmdline` in `worktree-reaper.sh §5`, then `bin/tests/worktree-reaper.test.sh`'s fake pgrep/ps daemon case. |

### Optional Supplemental Checks

Re-run step 3 without `--dry-run` in a fully isolated fixture to confirm the real `kill -TERM` only ever targets the gone-path PID, never the live one, before trusting the flag in a shared environment.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |

No `feature-catalog/` package exists for sk-git; see `manual-testing-playbook.md` §14 for the direct-anchor exception.

### Implementation Anchors

| File | Role |
|---|---|
| `../../../../bin/worktree-reaper.sh` | Orphan-daemon detection and `--reap-daemons` opt-in gate |
| `../../../../bin/tests/worktree-reaper.test.sh` | Regression coverage: fake pgrep/ps live-vs-gone daemon classification |

---

## 5. SOURCE METADATA

- Group: Owner-First Worktree Tooling
- Playbook ID: GIT-035
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `owner_first_worktree_tooling/reaper_orphan_daemon_report_only.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.
