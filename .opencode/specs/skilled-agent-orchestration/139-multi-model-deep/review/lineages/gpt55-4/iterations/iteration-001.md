# Iteration 001: Correctness And Security Boundary Review

## Focus

Reviewed recent daemon-reliability and hook-portability work with emphasis on single-writer correctness, live-test isolation, and hook path portability.

## Scorecard

- Dimensions covered: correctness, security
- Files reviewed: 8
- New findings: P0=0 P1=1 P2=1
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 1.00

## Findings

### P0, Blocker

- None.

### P1, Required

- **F001**: Stale owner-lease reclaim is not an atomic claim. `acquireOwnerLeaseFile()` uses `writeOwnerLeaseFile(lease)` after classifying an existing owner lease as stale, then only rereads the file to see whether its pid is present [SOURCE: .opencode/bin/mk-spec-memory-launcher.cjs:443-480]. That is not an atomic claim: two launchers can both read the same stale owner lease, each overwrite it, and each pass the reread depending on interleaving. The later stale PID lease branch then treats the earlier owner-lease acquisition as the spawn mutex while reaping a recorded child before replacement [SOURCE: .opencode/bin/mk-spec-memory-launcher.cjs:1476-1502], but the normal post-build path still writes the PID lease and launches the daemon without a respawn lock in this branch [SOURCE: .opencode/bin/mk-spec-memory-launcher.cjs:1507-1529]. Existing tests prove only the no-existing-owner case lets exactly one concurrent launcher own the owner lease [SOURCE: .opencode/skills/system-spec-kit/mcp_server/tests/launcher-lease.vitest.ts:287-311]; they do not cover two launchers racing an existing stale owner lease. Fix by making stale owner-lease takeover a real atomic claim, for example rename the stale file to a process-unique claimed path before writing the replacement owner lease, or guard the stale takeover plus stale PID lease reap/spawn with the same exclusive respawn lock used by dead-socket recovery.

#### Claim Adjudication Packet: F001

```json
{
  "findingId": "F001",
  "claim": "The stale owner-lease reclaim path can let two launchers believe they own the owner lease because it overwrites an existing stale owner lease and only rereads the result, rather than atomically claiming it with exclusive create or rename.",
  "evidenceRefs": [
    ".opencode/bin/mk-spec-memory-launcher.cjs:443-480",
    ".opencode/bin/mk-spec-memory-launcher.cjs:1476-1502",
    ".opencode/bin/mk-spec-memory-launcher.cjs:1507-1529",
    ".opencode/skills/system-spec-kit/mcp_server/tests/launcher-lease.vitest.ts:287-311"
  ],
  "counterevidenceSought": "Checked release shutdown path and saw normal re-election SIGTERM removes the owner lease before exit; checked launcher lease tests and found coverage for no-owner concurrent startup, but not for two launchers racing an existing stale owner lease.",
  "alternativeExplanation": "If stale owner leases are rare and normal release clears ownership, the practical frequency is lower than the fresh-session-after-disposal path; however crash or SIGKILL recovery is exactly the stale-owner case, so exclusive ownership still matters.",
  "finalSeverity": "P1",
  "confidence": 0.84,
  "downgradeTrigger": "Downgrade if acquireOwnerLeaseFile already has an external process-wide mutex for existing stale owner leases, or if a regression test proves only one of two stale-owner reclaimers can reach writeLeaseFile and launchServer.",
  "transitions": [
    {
      "iteration": 1,
      "from": null,
      "to": "P1",
      "reason": "Initial discovery with direct code evidence and missing stale-owner race coverage"
    }
  ]
}
```

### P2, Suggestion

- **F002**: Live adoption test interpolates temp paths into shell commands. `pgrepContains()` builds `pgrep -f "${needle}"` with shell interpolation, and `sqliteOpenerPids()` builds `lsof +D "${dbDir}" | awk ...` the same way [SOURCE: .opencode/skills/system-spec-kit/mcp_server/stress_test/durability/daemon-reelection-adoption-live.vitest.ts:50-62]. Those values are derived from OS temp paths created in `buildFakeRoot()` [SOURCE: .opencode/skills/system-spec-kit/mcp_server/stress_test/durability/daemon-reelection-adoption-live.vitest.ts:69-88]. Normal macOS temp paths are safe enough, but hostile or unusual `TMPDIR` values containing quotes or shell metacharacters can break the test command or execute unintended shell syntax. Use `execFileSync`/`spawnSync` argument arrays for `pgrep` and `lsof`, or shell-escape every interpolated path before invoking `execSync`.

## Cross-Reference Results

| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | partial | hard | `.opencode/specs/skilled-agent-orchestration/138-portable-cross-machine/spec.md:65-83`; `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability/028-live-session-reelection-validation/spec.md:65-83`; `.opencode/specs/skilled-agent-orchestration/139-multi-model-deep/spec.md:53-78` | Implemented packet specs map to concrete files; fan-out packet 139 is scaffold-only. |
| checklist_evidence | partial | hard | `.opencode/specs/skilled-agent-orchestration/139-multi-model-deep/checklist.md:50-88` | The active fan-out packet checklist is unverified scaffold content. |

## Assessment

- New findings ratio: 1.00
- Dimensions addressed: correctness, security
- Novelty justification: F001 is a distinct stale-owner concurrency path not covered by the single fresh-session live test; F002 is a test harness hardening issue.

## Ruled Out

- Hook command portability: `.codex/hooks.json`, `.devin/hooks.v1.json`, and `.claude/settings.local.json` use runtime project-dir env vars with `$PWD` fallback and PATH `node`; no hardcoded hook path finding recorded.
- Normal owner-disposal release path: the shutdown release branch removes the process exit cleanup and explicitly clears only the owner lease before exiting, which explains why the single fresh-session live test is valid for normal SIGTERM disposal.

## Dead Ends

- Broad JSON grep surfaced generated database owner files with absolute paths. Those are runtime state, not tracked hook configs, so they were not counted against the portability fix.

## Recommended Next Focus

Run a second iteration on maintainability and traceability: inspect docs/catalog/playbook claims for the final daemon behavior, and design a regression test for concurrent stale-owner takeover.

Review verdict: CONDITIONAL
