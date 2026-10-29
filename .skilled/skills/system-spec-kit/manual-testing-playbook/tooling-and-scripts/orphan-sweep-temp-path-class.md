---
title: "487 -- Orphan Sweep Temp-Path Class"
description: "Manual check for the temp-path orphan kill class, the Darwin session-tree pgrep fix and the advisor preserve rules, combining the automated class matrix with a live dry run inside a working session."
version: 1.0.0.0
id: tooling-and-scripts-orphan-sweep-temp-path-class
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# 487 -- Orphan Sweep Temp-Path Class

## 1. OVERVIEW

This scenario validates the temp-path orphan class in the orphan sweeper, together with the two rules that decide what the class must never touch. A temp-path orphan is a process whose parent is pid 1, owned by the current user, not a zombie, at least `ORPHAN_TEMP_PROCESS_AGE_HOURS` old, and whose command line points into the user temp directory, `/tmp/claude-<uid>/` or a worktree scratch folder. Scenario 419 covers MCP leak prevention in dry-run mode, and its commands stay green while this class is broken, so the class needs its own proof.

The check runs in three legs. The automated suite walks the full class matrix with a stubbed process table. A live dry run inside a working session proves the preserve rules on real processes, because the session's own MCP helpers and the shared skill-advisor launcher must survive a sweep that runs from inside that session. A parentless fixture created in the temp directory then proves the age gate on the real process table.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm the sweeper classifies a parentless temp-path process as a kill candidate, preserves the live session tree and the advisor launcher, and keeps the `pgrep` ancestor flag platform-correct.
- Real user request: `Leftover test processes keep running from my temp folder for days. Did the cleaner learn to reap them, and will it still leave my open session and the shared advisor daemon alone?`
- Prompt: `Validate the temp-path orphan class, the session-tree preserve rule and the advisor preserve rule, then report cited pass/fail evidence.`
- Expected execution process: Run the automated class matrix first, then a verbose dry run from inside a live Claude or OpenCode session, then create a parentless fixture in the temp directory and rerun the dry run to observe the age gate. Read every signal against the expected list.
- Expected signals: the suite passes every test. The dry run marks the session's MCP helpers with `reason=live-session-tree` and each advisor launcher with `reason=advisor-self-idle-timeout`, and no `action=kill` line names either. The advisor server whose launcher is its parent is marked `reason=advisor-launcher-child`. The fixture shows parent pid 1 in `ps`, and no dry-run line names it while it is younger than the age threshold.
- Desired user-visible outcome: An operator sees the class covered by an automated matrix, sees the live session and the advisor daemon survive a sweep started inside the session, and sees the age gate hold a young parentless fixture back.
- Pass/fail: PASS if the suite passes, every preserve decision above is present with no kill line contradicting it, the fixture reports parent pid 1 and stays unnamed in the dry run, and cleanup removes the fixture.

---

## 3. TEST EXECUTION

### Prompt

```text
Validate the temp-path orphan class, the session-tree preserve rule and the advisor preserve rule, then report cited pass/fail evidence.
```

### Commands

Run every command from the repository root unless the command changes directory itself. Command 2 must run inside a live Claude or OpenCode session, because the session tree it inspects is the one that started it.

1. `cd .skilled/skills/system-spec-kit/runtime && npx vitest run orphan-sweeper-temp-path`
2. `bash .skilled/scripts/orphan-mcp-sweeper.sh --dry-run --verbose --log-path "${TMPDIR%/}/orphan-sweeper-review.log"`
3. `mkdir -p "${TMPDIR%/}/scratch-orphan" && : > "${TMPDIR%/}/scratch-orphan/stay.log"`
4. `(cd "${TMPDIR%/}/scratch-orphan" && nohup tail -f "${TMPDIR%/}/scratch-orphan/stay.log" >/dev/null 2>&1 &)`
5. `ps -o pid=,ppid=,stat=,etime=,command= -ax | grep "scratch-orphan/stay.log" | grep -v grep`
6. `bash .skilled/scripts/orphan-mcp-sweeper.sh --dry-run --verbose --log-path "${TMPDIR%/}/orphan-sweeper-review.log" | grep -c "scratch-orphan/stay.log"`
7. `pkill -f "scratch-orphan/stay.log"`
8. `rm -rf "${TMPDIR%/}/scratch-orphan" "${TMPDIR%/}/orphan-sweeper-review.log"`

The fixture in command 4 carries the absolute temp path in its command line, because the class matches on the command line and a bare `sleep` carries no path at all. Command 6 prints `0` for a fresh fixture and would print the matching line count once the fixture is older than the threshold.

### Expected

- Command 1 passes every test in one file. The matrix covers the old parentless temp-path process, the young one, the zombie, the AppTranslocation exclusion, the TCP listener exception, the `pgrep -a` flag on Darwin, the absent flag on Linux, and the advisor parentage rules.
- Command 2 prints `action=start` with `dry_run=true` and ends with an `action=summary` line. Any line matching `class=mcp-code-mode` or `class=mcp-code-mode-launcher` that belongs to the calling session carries `reason=live-session-tree`. Every `class=system-skill-advisor-launcher` line carries `reason=advisor-self-idle-timeout`, and its `class=skill-advisor-server` child carries `reason=advisor-launcher-child`. No `action=kill` line names a pid that appeared in a preserve line.
- Command 5 shows parent pid `1` and a command line that contains the temp directory, which is the shape the class requires.
- Command 6 prints `0`. The expected boundary is stated rather than waited for: the same fixture becomes a candidate only after its elapsed time reaches `ORPHAN_TEMP_PROCESS_AGE_HOURS`, which defaults to 6. The script rejects a value below 1 and falls back to 6, so the shortest honest wait is one hour.
- Command 7 empties the process table of the fixture, and command 8 removes the fixture folder and the review log.

### Evidence

Command 1:

```text
$ cd .skilled/skills/system-spec-kit/runtime && npx vitest run orphan-sweeper-temp-path
 ✓ runtime/tests/orphan-sweeper-temp-path.vitest.ts (7 tests) 156ms

 Test Files  1 passed (1)
      Tests  7 passed (7)
   Start at  11:05:11
   Duration  237ms
```

The vitest banner line is omitted from that transcript because it prints an absolute machine path.

Command 2, excerpt of the preserve decisions (session helpers and advisor daemon):

```text
2026-10-29T11:05:14+0100 action=start dry_run=true verbose=true age_min_sec=300 tmp_age_hours=24
2026-10-29T11:05:15+0100 action=preserve reason=advisor-self-idle-timeout pid=80911 class=system-skill-advisor-launcher rss_kb=15632 age_sec=14904
2026-10-29T11:05:15+0100 action=preserve reason=advisor-launcher-child pid=80912 class=skill-advisor-server rss_kb=76832 age_sec=14904
2026-10-29T11:05:16+0100 action=preserve reason=live-session-tree pid=86748 class=mcp-code-mode-launcher rss_kb=42448 age_sec=7924
2026-10-29T11:05:16+0100 action=preserve reason=live-session-tree pid=87190 class=mcp-code-mode rss_kb=64624 age_sec=7923
2026-10-29T11:05:16+0100 action=preserve reason=live-session-tree pid=91085 class=mcp-code-mode-launcher rss_kb=3552 age_sec=413247
2026-10-29T11:05:17+0100 action=summary candidates=20 kills=6 exit_code=0
```

That run logged every kill line against an MCP helper pid, and no pid that appeared in a preserve line appeared in a kill line, so no preserve decision was contradicted. Which helpers are young enough to be kill candidates changes between runs, which is why the count on the summary line moves.

Commands 3 to 6, the parentless fixture and the age gate:

```text
$ ps -o pid=,ppid=,stat=,etime=,command= -ax | grep "scratch-orphan/stay.log" | grep -v grep
44032     1 SN   01:42 tail -f /var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/scratch-orphan/stay.log

$ bash .skilled/scripts/orphan-mcp-sweeper.sh --dry-run --verbose --log-path "${TMPDIR%/}/orphan-sweeper-review.log" | grep -c "scratch-orphan/stay.log"
0

$ bash .skilled/scripts/orphan-mcp-sweeper.sh --dry-run --verbose | grep -E "44032|action=summary"
2026-10-29T11:07:56+0100 action=summary candidates=14 kills=0 exit_code=0
```

The fixture reported parent pid `1` at an elapsed time of one minute forty-two seconds, and the sweeper named it nowhere because six hours had not passed.

### Pass / Fail

- **PASS**: the suite passed 7 tests in 1 file, the dry run marked every calling-session helper with `reason=live-session-tree` and every advisor launcher with `reason=advisor-self-idle-timeout` without a contradicting kill line, the fixture reported parent pid `1` and stayed unnamed in the dry run, and cleanup removed the fixture and the log.

### Failure Triage

If the suite fails, read the failing case name before touching the script, because the matrix names the exact rule that broke: the age gate, the parent gate, the owner gate, the zombie gate, the AppTranslocation exclusion, the listener exception, the platform flag or the advisor parentage. If a live run reaps the calling session's own helpers, check the Darwin `pgrep -a` branch first, because macOS `pgrep` otherwise hides its own ancestors and the session tree comes back empty. If the advisor launcher is reaped, check the launcher preserve rule and the launcher's own idle timeout before the age gate. If the fixture is named before the age threshold, check the `is_temp_path_orphan` age comparison. If the fixture is never named at the threshold, check that its command line holds the absolute root the sweeper derives from `getconf DARWIN_USER_TEMP_DIR`, since a relative path or a bare `sleep` never matches.

### Optional Supplemental Checks

To watch the class produce a kill line without waiting six hours, run command 2 with `ORPHAN_TEMP_PROCESS_AGE_HOURS=1` against a fixture that has already been running for more than one hour. The dry run then prints `[DRY-RUN] action=kill signal=TERM` with `class=temp-path-orphan` for that fixture. A value of `0` cannot be used for this, because the script rejects anything below `1` and falls back to the default of six hours.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |
| `../../feature-catalog/tooling-and-scripts/orphan-mcp-sweeper-and-launchagent-template.md` | Feature-catalog source describing the sweeper contract and the temp-path class |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.skilled/scripts/orphan-mcp-sweeper.sh` | Primary implementation anchor |
| `runtime/tests/orphan-sweeper-temp-path.vitest.ts` | Class matrix, listener exception, platform `pgrep` flag and advisor parentage |
| `runtime/tests/orphan-sweeper-ipc-preserve.vitest.ts` | Preserve rules for MCP classes and listeners |

Provenance: runtime/tests/orphan-sweeper-temp-path.vitest.ts

---

## 5. SOURCE METADATA

- Group: Tooling and Scripts
- Playbook ID: 487
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `tooling-and-scripts/orphan-sweep-temp-path-class.md`
