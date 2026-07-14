---
title: "GIT-027 -- Top-level session isolates into its own worktree, branch, and databases"
description: "This scenario validates Top-level session isolation for `GIT-027`. It focuses on prove a top-level launch of worktree-session.sh allocates a brand-new worktree, a work/<runtime>/<slug> branch, and per-session MCP database and socket directories distinct from the main checkout."
version: 1.0.0.0
---

# GIT-027 -- Top-level session isolates into its own worktree, branch, and databases

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `GIT-027`.

---

## 1. OVERVIEW

This scenario validates Top-level session isolation for `GIT-027`. It focuses on prove a top-level (non-child) launch of `worktree-session.sh` allocates a brand-new worktree, a `work/<runtime>/<slug>` branch, and per-session MCP database and socket directories distinct from the main checkout.

### Why This Matters

Concurrent sessions on different runtimes must never share a working tree or contend on the single-writer MCP database lease. Isolation only holds if every path the wrapper prints is provably new and provably outside the main checkout.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `GIT-027` and confirm the expected signals without contradictory evidence.

- Objective: prove a top-level launch of `worktree-session.sh` allocates a brand-new worktree, a `work/<runtime>/<slug>` branch, and per-session MCP database and socket directories distinct from the main checkout.
- Real user request: `I aliased claude to launch through the worktree wrapper — show me it actually isolates a new session into its own worktree and databases instead of touching my main checkout.`
- Prompt: `Launch a session through worktree-session.sh in dry-run mode and report the planned worktree path, branch name, database directories, and socket directory, confirming none collide with the main checkout.`
- Expected execution process: Run `worktree-session.sh --dry-run <runtime>` from the main checkout and inspect the printed plan (worktree path, branch, `SPEC_KIT_DB_DIR`, `SPECKIT_CODE_GRAPH_DB_DIR`, `SPECKIT_IPC_SOCKET_DIR`, session-marker path, and shared-path symlink list) without launching anything.
- Expected signals: the branch matches `work/<runtime_id>/<slug>`; the worktree path is under `.worktrees/`; both DB directories are nested inside the new worktree, not the main checkout; the socket directory is short and under `$HOME/.spk-wt-sock/`.
- Desired user-visible outcome: A concise PASS, PARTIAL, FAIL, or SKIP verdict with the evidence needed for release review.
- Pass/fail: PASS if the dry-run plan shows a new worktree/branch pair distinct from any existing one and DB/socket paths scoped to that session. FAIL if the plan reuses the main checkout's paths, omits the branch/base, or shows a DB directory outside the new worktree.

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
| GIT-027 | Top-level session isolates into its own worktree, branch, and databases | prove a top-level launch of `worktree-session.sh` allocates a brand-new worktree, a `work/<runtime>/<slug>` branch, and per-session MCP database and socket directories distinct from the main checkout. | `Launch a session through worktree-session.sh in dry-run mode and report the planned worktree path, branch name, database directories, and socket directory, confirming none collide with the main checkout.` | 1. `bash: git symbolic-ref --short HEAD` -> 2. `bash: bash .opencode/bin/worktree-session.sh --dry-run claude` -> 3. `bash: grep -E "worktree \|branch \|SPEC_KIT_DB_DIR\|SPECKIT_CODE_GRAPH_DB_DIR\|SPECKIT_IPC_SOCKET_DIR" <dry-run output>` | The dry-run plan names a new `.worktrees/` path, a `work/claude/...` branch based on the live branch, and DB/socket paths nested under that new path. | Full dry-run plan output, with each printed path compared against the main checkout's own paths to confirm no overlap. | PASS if the dry-run plan shows a new worktree/branch pair distinct from any existing one and DB/socket paths scoped to that session. FAIL if the plan reuses the main checkout's paths, omits the branch/base, or shows a DB directory outside the new worktree. | Compare printed plan fields against `worktree-session.sh §4-§6`, then the "Launch-Wrapper Worktrees vs the In-Session Ask-First Rule" section of `SKILL.md`. |

### Optional Supplemental Checks

Re-run with `SPECKIT_AUTOSYNC=0` and confirm the printed plan reflects the operator override, and re-run from a detached-HEAD main checkout to confirm the plan reports no live branch and disables autosync wiring.

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
| `../../../../bin/worktree-session.sh` | Launch wrapper: worktree/branch allocation, per-session DB/socket directory wiring |
| `../../../../bin/tests/worktree-session.test.sh` | Regression coverage: dry-run plan assertions |
| `../../SKILL.md` | "Launch-Wrapper Worktrees vs the In-Session Ask-First Rule" and Continuous Integration sections |
| `../../references/continuous-integration.md` | Live-branch autosync model wired by the wrapper |

---

## 5. SOURCE METADATA

- Group: Owner-First Worktree Tooling
- Playbook ID: GIT-027
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `owner_first_worktree_tooling/top_level_session_isolation.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.
