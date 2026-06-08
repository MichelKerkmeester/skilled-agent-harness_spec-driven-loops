# Deep Review Report: gpt55-6

## Executive Summary

Verdict: **CONDITIONAL**. This lineage reviewed the recent daemon-reliability and hook-portability files and found no P0 blockers, two active P1 correctness findings, and one P2 test hardening advisory. The hook config portability files parse and no active hardcoded-path finding was recorded, but the stale-reclaim handoff still has race/fail-open gaps before release-ready confidence is justified.

Scope: 12-file fan-out target from the root review config. Stop reason: `maxIterationsReached` after 1 iteration. `hasAdvisories`: true.

## Planning Trigger

Plan remediation before treating the daemon re-election/reap work as release-ready. Both active P1s affect the same safety boundary: only one launcher/daemon should own the handoff from a stale owner lease to a replacement daemon.

## Active Finding Registry

| ID | Severity | Dimension | Title | Evidence | Status |
|----|----------|-----------|-------|----------|--------|
| F001 | P1 | correctness | Stale owner-lease takeover is not an atomic claim | `.opencode/bin/mk-spec-memory-launcher.cjs:359-374`; `.opencode/bin/mk-spec-memory-launcher.cjs:443-480`; `.opencode/bin/mk-spec-memory-launcher.cjs:1476-1502`; `.opencode/skills/system-spec-kit/mcp_server/tests/launcher-lease.vitest.ts:287-311` | active |
| F002 | P1 | correctness | Post-SIGKILL reap result is ignored before replacement spawn | `.opencode/bin/mk-spec-memory-launcher.cjs:691-726`; `.opencode/bin/mk-spec-memory-launcher.cjs:1491-1500`; `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability/028-live-session-reelection-validation/spec.md:143-145` | active |
| F003 | P2 | security | Live adoption test interpolates temp paths into shell commands | `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/daemon-reelection-adoption-live.vitest.ts:50-62`; `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/daemon-reelection-adoption-live.vitest.ts:69-88` | active |

## Remediation Workstreams

| Workstream | Findings | Action |
|------------|----------|--------|
| Atomic stale-owner takeover | F001 | Replace stale owner-lease rename+reread takeover with an exclusive claim or guard stale takeover plus reap/spawn with a cross-process lock. Add a regression with two fresh launchers racing a planted stale owner lease. |
| Fail-closed child reap | F002 | Capture the post-SIGKILL `waitForPidExit()` result and return `allowed:false` when the pid remains live. Add a regression that stubs or simulates post-SIGKILL survival. |
| Shell-safe test helpers | F003 | Replace shell interpolation with `execFileSync`/`spawnSync` argv arrays or a shell-escape helper. |

## Spec Seed

- Add an acceptance criterion to the daemon reliability packet: stale owner-lease takeover must be serialized under a concrete atomic claim, including a two-launcher stale-owner race regression.
- Add an acceptance criterion: replacement spawn must be blocked if the recorded child remains live after SIGKILL and the final wait window.
- Add a test NFR: live durability helpers must not interpolate temp paths into shell strings.

## Plan Seed

1. Implement an atomic stale-owner takeover path and keep the normal no-owner `O_EXCL` behavior unchanged.
2. Gate stale-reclaim spawn on confirmed child exit after both SIGTERM and SIGKILL waits.
3. Add focused regression tests for F001 and F002.
4. Convert the live test's `pgrep`/`lsof` helpers to argv-based process execution.
5. Re-run the launcher lease suite and the daemon re-election live durability test.

## Traceability Status

| Protocol | Status | Gate | Notes |
|----------|--------|------|-------|
| spec_code | partial | hard | Concrete daemon and portability packets exist, but packet 139 itself is scaffold-only. |
| checklist_evidence | partial | hard | Packet 139 checklist is unfilled; lineage evidence is direct file review. |
| feature_catalog_code | partial | advisory | Not exhaustively audited in max-1 pass. |
| playbook_capability | partial | advisory | Not exhaustively audited in max-1 pass. |

## Deferred Items

- Run the full durability suite after fixes land.
- Consider a separate traceability pass over changelog, ENV_REFERENCE, feature catalog, and manual testing playbook wording.
- F003 is advisory unless the test environment allows hostile `TMPDIR` values.

## Audit Appendix

| Check | Result |
|-------|--------|
| Iteration file exists and final verdict line is exact | PASS |
| JSON config parses | PASS |
| JSONL state lines parse | PASS |
| Findings registry parses | PASS |
| `node --check` launcher/proxy/bridge/supervision/code-index scripts | PASS |
| `bash -n .opencode/scripts/session-cleanup.sh` | PASS |
| Hook config JSON parsing | PASS |

Convergence replay: max iterations reached at 1/1, so synthesis is legal even though active P1 findings remain. Final verdict follows severity contract: no P0, active P1 > 0 means `CONDITIONAL`.
