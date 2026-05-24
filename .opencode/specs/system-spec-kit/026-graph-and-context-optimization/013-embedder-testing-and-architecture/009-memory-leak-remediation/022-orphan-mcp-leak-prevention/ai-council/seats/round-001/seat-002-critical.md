---
round: 1
seat: seat-002-critical
executor: opencode-deepseek-v4-pro
lens: Critical
status: complete
timestamp: "2026-05-24T23:00:00Z"
simulated: false
---

# Seat 002: Critical Safety Analysis

## Proposed Plan

The implementation is functionally correct but has documentation gaps and untested edge cases that should be addressed before LaunchAgent activation. The sweeper's substring-based process classification and the Stop hook timeout interaction are the most notable concerns. Recommend conditional approval with P1 validation gates.

## Reasoning

### Sweeper Classification Safety
The `classify_command()` function uses substring matching on full process command lines. A process containing "mk-spec-memory-launcher.cjs" in its path or arguments will be classified as an MCP helper. While the preserve_reason() function runs before any kill, and dry-run provides operator review, the fragility of substring matching is not acknowledged in the docs.

### Stop Hook Timeout Interaction
The settings.local.json Stop hook has `timeout: 10` and chains two commands: `session-stop.js` then `claude-session-cleanup.sh`. If the combined execution exceeds 10 seconds, Claude may kill the chain. The behavior (partial cleanup) is a graceful degradation but the timeout boundary is undocumented. This is P2, not P0 — there is no evidence of actual failures.

### Claude Session PID Resolution
When `CLAUDE_SESSION_PID` is not set, the cleanup falls back to `PPID`. The PPID of the Stop hook process should be the Claude session, but if intermediate processes exist in the process tree, the cleanup could walk the wrong tree. The script checks PID existence before walking, which provides some safety.

### Idle Timeout Shutdown Race
In `createLauncherIdleMonitor`, `checkIdle()` sets `stopped=true` then calls `onIdle()`. A simultaneous stdin `data` event could fire `markActivity()` before the listener is removed. The worst case is a double-log message — no data corruption risk.

### Missing Test Coverage
The sweeper has `bash -n` syntax checks but no behavioral unit tests. There are no automated tests for: malformed ps output, empty pgrep results, edge cases in etime_to_seconds parsing, or the preserve_reason logic. The dry-run transcript is manual evidence, not an automated test.

### Sweeper Race Condition
`terminate_candidates()` sends SIGTERM, sleeps 5 seconds, then sends SIGKILL. During that window, a process preserved during `scan_processes()` could age past the threshold. A concurrent sweep could target it. macOS PID randomization reduces but doesn't eliminate this risk.

### ClickUp Pattern Coverage
The sweeper classifies both `npm exec @taazkareem/clickup-mcp-server` (wrapper) and `clickup-mcp-server` (server). The Claude cleanup only matches `clickup-mcp-server`. This is intentional (Claude cleanup is session-scoped and doesn't need the full taxonomy) but the mismatch is not documented.

### Handover Commit Gap
The handover is uncommitted while the implementation is pushed. A fresh git clone would receive the code but not the continuity context. This is a process-level P1.

## Risks & Trade-offs

| Risk | Severity | Mitigation |
|------|----------|------------|
| Substring-based process classification | Low | Dry-run review catches false positives |
| Stop hook timeout kills chain mid-cleanup | Low-Medium | Graceful degradation, P2 doc gap |
| Sweeper 5-second race window | Low | macOS PID randomization, dry-run review |
| Missing sweeper behavioral tests | Low-Medium | bash -n covers syntax, not behavior |
| Claude session PID resolution edge case | Low | PID existence check before walking |
| Uncommitted handover — continuity loss | Medium | Commit immediately (P1) |

## Assumptions and Evidence Gaps

- Assumption: Claude Stop hook timeout (10s) applies to the entire bash -c chain, not individual commands. Unverified.
- Evidence gap: No real Claude session exit has been tested with the chained Stop hook.
- Evidence gap: Sweeper has no automated behavioral tests beyond syntax checks.
- Evidence gap: The freshest-young-instance preserve path was not observed in the final dry-run (acknowledged in implementation-summary limitation #3).

## Alternative Challenged

Alternative: Escalate Stop hook timeout to P0 blocker. Rejected because there is no evidence of actual failure. The timeout interaction is a documentation gap (P2), not a code defect.

## Confidence

**82/100**: The implementation is correct but has more unresolved edge cases and documentation gaps than the analytical seat acknowledges. The critical findings are process/documentation concerns, not code defects. Confidence would rise to 88+ after: handover committed, real Claude exit tested, and sweeper behavioral tests added.
