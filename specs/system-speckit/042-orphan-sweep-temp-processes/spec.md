---
title: "Feature Specification: Orphan sweeper: reap abandoned temp and scratch processes and install the LaunchAgent"
description: "Abandoned test fixtures, benchmark browsers and scratch repros outlive their parent and run for days from temp folders, and the orphan sweeper only knows MCP daemons and was never scheduled. This adds a temp-path orphan class, fixes the sweeper reaping its own calling session's MCP helpers on macOS, and installs the LaunchAgent live."
trigger_phrases:
  - "orphan sweep temp processes"
  - "orphan sweeper reap abandoned temp and scratch processes"
  - "temp-path orphan"
  - "orphan sweep launchagent install"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Orphan sweeper: reap abandoned temp and scratch processes and install the LaunchAgent

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-29 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Processes whose parent has exited keep running out of temp and scratch folders for days: two headless Chrome instances from a benchmark crawl (14 days, about 650 MB), a `python -m http.server`, `node -e` test fixtures and `node --check` children stuck on a FIFO. `.skilled/scripts/orphan-mcp-sweeper.sh` only classifies MCP and advisor daemons, its LaunchAgent template was never installed and runs in dry-run mode, and on macOS a sweep started from inside a session cannot see that session, so it would reap the session's own MCP helpers.

### Purpose
A sweep that runs every 10 minutes reaps leftover temp-path processes after 6 hours and never touches a live session's helpers.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ ps -axo pid,ppid,etime,command | awk '$2==1' (abridged, 2026-10-29)
 7135     1 14-21:16:23 Google Chrome --headless=new ... --user-data-dir=/private/var/folders/.../T/pi-playbook-bench-.../udd4
93565     1 14-20:56:20 Python -m http.server 8099   (cwd in /var/folders/.../T/pi-playbook-bench-...)
90686     1    11:41:45 node --check /var/folders/.../T/parallel-node-check-EczyU9/blocking.js
43103     1 01-10:44:55 tail -n +1 -f /private/tmp/claude-501/.../scratchpad/fix/r2-L4-cli-test.log

$ launchctl list | grep -i orphan
(no output)

$ /bin/bash .skilled/scripts/orphan-mcp-sweeper.sh --dry-run --verbose   (run from inside a Claude session)
[DRY-RUN] action=kill signal=TERM pid=86738 class=mcp-code-mode-launcher ... command=node .skilled/bin/mcp-code-mode-launcher.cjs
$ ps -o ppid= -p 86738  ->  86640 = claude --resume d1e4fb9c-...   (the calling session itself)
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add a `temp-path-orphan` class to the sweeper: parent exited, at least `ORPHAN_TEMP_PROCESS_AGE_HOURS` (default 6) old, owned by this user, not a zombie, command line inside the user temp dir, `/tmp/claude-<uid>/` or `~/worktrees/*/.scratch-*`, excluding `AppTranslocation`.
- Recheck that shape before each signal, and do not let a TCP listener preserve a temp-path orphan.
- Make the session tree include pgrep's own ancestors on macOS (`pgrep -a`), so an in-session sweep sees its own session.
- Preserve the shared skill-advisor launcher, which exits on its own 30-minute idle timeout, and its server while that launcher is its parent. A dry run showed the existing rule would kill the in-use advisor on every scheduled sweep, because hooks hold no client socket between prompts.
- Add vitest regressions for the new class and the macOS ancestor flag.
- Install the LaunchAgent at `~/Library/LaunchAgents/com.michelkerkmeester.orphan-sweep.plist` without `--dry-run`.

### Out of Scope
- Changing the repo template's `--dry-run` posture - the template README documents that only the installed copy drops it.
- Fixing the benchmark or repro scripts that started the orphans - their sources are not in the repo.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/scripts/orphan-mcp-sweeper.sh` | Modify | Temp-path orphan class, pre-signal recheck, macOS ancestor flag, advisor preserve rule |
| `.skilled/skills/system-spec-kit/runtime/tests/orphan-sweeper-temp-path.vitest.ts` | Create | Regression for the class and the listener rule |
| `~/Library/LaunchAgents/com.michelkerkmeester.orphan-sweep.plist` | Create (outside repo) | Live install of the template without `--dry-run` |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | A sweep started inside a live session never selects that session's MCP helpers. | `--dry-run` run from this Claude session prints `reason=live-session-tree` for pid 86738 and no `kill` line for it. |
| REQ-002 | Only an old, parentless, own-user, non-zombie process running from a temp or scratch root is classed `temp-path-orphan`. | `npx vitest run orphan-sweeper-temp-path` passes its classification matrix. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | The LaunchAgent runs the live sweep every 600 seconds. | `launchctl list com.michelkerkmeester.orphan-sweep` succeeds and the installed plist has no `--dry-run`. |
| REQ-004 | Existing sweeper behavior is unchanged. | `npx vitest run orphan-sweeper launcher-stop-hook-orphan-sweep` passes all suites. |
| REQ-005 | A scheduled sweep never kills the in-use shared skill-advisor daemon. | `--dry-run` prints `reason=advisor-self-idle-timeout` for the launcher and `reason=advisor-launcher-child` for its server, and no `kill` line for either. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A `--dry-run` sweep from inside a session proposes no kill of any process descended from a live `claude`, `opencode` or `codex` session.
- **SC-002**: A temp-path orphan older than 6 hours is listed as `action=kill` by a dry run and killed by the live agent.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | macOS `pgrep -a`, `ps -o uid=`, `getconf DARWIN_USER_TEMP_DIR` | The new rule cannot classify without them | Linux skips `-a`; an empty temp root falls back to `TMPDIR`, and a shared `/tmp` never qualifies |
| Risk | Going live also enables the existing MCP-daemon kills | Med | Dry-run against the live process list first; preserve rules for session trees and IPC peers stay in force |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None
<!-- /ANCHOR:questions -->

---
