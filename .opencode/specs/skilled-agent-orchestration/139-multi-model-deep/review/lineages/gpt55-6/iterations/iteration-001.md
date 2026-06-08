# Iteration 001: Daemon Re-Election Correctness And Portability Breadth

## Focus

Single-iteration review of the recent daemon re-election/reap work, hook portability configs, launcher proxy/bridge support, session cleanup, and live durability tests. The root fan-out config, not packet 139's scaffold docs, defines the actual 12-file files target.

## Scorecard

- Dimensions covered: correctness, security, traceability, maintainability
- Files reviewed: 12 target files plus concrete daemon/portability spec evidence
- New findings: P0=0 P1=2 P2=1
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 1.00

## Findings

### P0, Blocker

- None.

### P1, Required

- **F001**: Stale owner-lease takeover is not an atomic claim. `acquireOwnerLeaseFile()` correctly uses `writeOwnerLeaseFileExclusive()` only when no owner lease exists [SOURCE: .opencode/bin/mk-spec-memory-launcher.cjs:455-467]. When an existing owner lease is classified stale, it switches to `writeOwnerLeaseFile(lease)`, which writes a temp file and renames it over the current owner lease [SOURCE: .opencode/bin/mk-spec-memory-launcher.cjs:359-374], then only rereads to check that the file currently contains this launcher's pid [SOURCE: .opencode/bin/mk-spec-memory-launcher.cjs:469-480]. That does not serialize stale takeover: launcher A can overwrite+reread+pass, then launcher B can overwrite+reread+pass before A reaches `launchServer()` or before A's heartbeat detects the lost owner file. Both can then enter the stale-reclaim path and operate on the same released daemon/DB handoff [SOURCE: .opencode/bin/mk-spec-memory-launcher.cjs:1476-1502]. Existing concurrency coverage proves only the no-existing-owner `O_EXCL` path [SOURCE: .opencode/skills/system-spec-kit/mcp_server/tests/launcher-lease.vitest.ts:287-311], not a planted stale owner lease race. Fix by making stale takeover itself a real atomic claim, for example rename the stale file to a process-unique claimed path or guard stale takeover and subsequent reap/spawn with an exclusive respawn lock.

```json
{
  "findingId": "F001",
  "claim": "Stale owner-lease takeover uses non-exclusive rename-plus-reread, so two fresh launchers can both pass takeover in sequence and proceed into stale-reclaim work.",
  "evidenceRefs": [
    ".opencode/bin/mk-spec-memory-launcher.cjs:359-374",
    ".opencode/bin/mk-spec-memory-launcher.cjs:443-480",
    ".opencode/bin/mk-spec-memory-launcher.cjs:1476-1502",
    ".opencode/skills/system-spec-kit/mcp_server/tests/launcher-lease.vitest.ts:287-311"
  ],
  "counterevidenceSought": "Checked the exclusive no-existing-owner path, the stale-owner path, the launchServer owner-file guard, and launcher-lease tests for a stale-owner concurrent takeover regression.",
  "alternativeExplanation": "The reread guard does catch an overwrite that happens before the first launcher rereads, but it does not protect the interleaving where the first launcher rereads and proceeds before another stale taker overwrites.",
  "finalSeverity": "P1",
  "confidence": 0.84,
  "downgradeTrigger": "Downgrade if stale owner-lease takeover becomes an atomic claim or is guarded by a cross-process exclusive lock, and a regression plants a stale owner lease then proves exactly one fresh launcher can reach stale reclaim/spawn.",
  "transitions": [
    { "iteration": 1, "from": null, "to": "P1", "reason": "Initial discovery" }
  ]
}
```

- **F002**: Post-SIGKILL reap result is ignored before replacement spawn. `reapLeaseChildBeforeRespawn()` waits for the released daemon to exit after SIGTERM [SOURCE: .opencode/bin/mk-spec-memory-launcher.cjs:705-708]. If that times out, it sends SIGKILL and awaits `waitForPidExit(childPid, 1000)` [SOURCE: .opencode/bin/mk-spec-memory-launcher.cjs:710-713], but discards the returned boolean and still returns `{ allowed: true }` [SOURCE: .opencode/bin/mk-spec-memory-launcher.cjs:721-726]. The stale-reclaim branch treats only `allowed:false` as the fail-closed condition before replacement spawn [SOURCE: .opencode/bin/mk-spec-memory-launcher.cjs:1491-1500]. In the rare but real case where the child remains alive after SIGKILL wait, the launcher can still spawn a replacement while the old daemon may hold the WAL DB, contrary to the spec's single-writer/fail-closed claim for uncertain reaps [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability/028-live-session-reelection-validation/spec.md:143-145]. Fix by capturing the second wait result and returning `allowed:false` when the child remains live.

```json
{
  "findingId": "F002",
  "claim": "After SIGKILL, reapLeaseChildBeforeRespawn ignores whether the child actually exited and can authorize replacement spawn while the old child remains live.",
  "evidenceRefs": [
    ".opencode/bin/mk-spec-memory-launcher.cjs:691-726",
    ".opencode/bin/mk-spec-memory-launcher.cjs:1491-1500",
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability/028-live-session-reelection-validation/spec.md:143-145"
  ],
  "counterevidenceSought": "Checked the EPERM branch, dead-child branch, clean-close logging, and stale-reclaim caller; no branch uses the post-SIGKILL wait result to block spawn.",
  "alternativeExplanation": "SIGKILL usually terminates ordinary processes quickly, so many runs will be safe in practice; the issue is the explicit fail-open path when the bounded wait still reports live.",
  "finalSeverity": "P1",
  "confidence": 0.87,
  "downgradeTrigger": "Downgrade if the post-SIGKILL wait result gates `allowed:false` and a regression stubs waitForPidExit to remain false after SIGKILL.",
  "transitions": [
    { "iteration": 1, "from": null, "to": "P1", "reason": "Initial discovery" }
  ]
}
```

### P2, Suggestion

- **F003**: Live adoption test interpolates temp paths into shell commands. `pgrepContains()` builds `pgrep -f "${needle}"` via `execSync()` [SOURCE: .opencode/skills/system-spec-kit/mcp_server/stress_test/durability/daemon-reelection-adoption-live.vitest.ts:50-54], and `sqliteOpenerPids()` builds an `lsof +D "${dbDir}" | awk ...` shell pipeline the same way [SOURCE: .opencode/skills/system-spec-kit/mcp_server/stress_test/durability/daemon-reelection-adoption-live.vitest.ts:57-62]. Both values come from temp paths created by `mkdtempSync(join(tmpdir(), ...))` [SOURCE: .opencode/skills/system-spec-kit/mcp_server/stress_test/durability/daemon-reelection-adoption-live.vitest.ts:69-88]. Normal macOS temp dirs are safe, but hostile or unusual `TMPDIR` values containing quotes or shell metacharacters can break the test command or execute unintended shell syntax. Use `spawnSync`/`execFileSync` argv arrays for `pgrep` and `lsof`, or quote via a shell-escape helper before interpolation.

## Cross-Reference Results

| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | partial | hard | `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability/028-live-session-reelection-validation/spec.md:121-123`; `.opencode/specs/skilled-agent-orchestration/138-portable-cross-machine/spec.md:65-83`; `.opencode/specs/skilled-agent-orchestration/139-multi-model-deep/spec.md:53-78` | Concrete prior packets map to behavior, but packet 139 is scaffold-only. |
| checklist_evidence | partial | hard | `.opencode/specs/skilled-agent-orchestration/139-multi-model-deep/checklist.md:50-88` | Packet 139 checklist is unfilled. |
| resource-map-coverage | skipped | advisory | `.opencode/specs/skilled-agent-orchestration/139-multi-model-deep/` directory listing | No `resource-map.md` or `applied/` directory existed at init. |

## Assessment

- New findings ratio: 1.00
- Dimensions addressed: correctness, security, traceability, maintainability
- Novelty justification: both P1s are distinct fail-open / race classes in the stale-reclaim handoff, and F003 is a separate test harness hardening issue.
- Lightweight verification: `node --check` passed for the launcher, proxy, bridge, supervision, and code-index launcher files; `bash -n` passed for session cleanup; JSON parsing passed for the three hook configs.

## Ruled Out

- Hook absolute-path regression: `.claude/settings.local.json`, `.codex/hooks.json`, and `.devin/hooks.v1.json` use runtime project-dir fallbacks and PATH `node`; no hardcoded Public cd or `/opt/homebrew/bin/node` finding was recorded in active hook configs.
- Packet 139 scaffold incompleteness as a release blocker: recorded as traceability partial, not as a daemon/hook code defect.

## Dead Ends

- Code graph structural queries were not used because direct code reads were sufficient and the current graph status was known stale from local readiness artifacts surfaced during grep.
- Full live durability tests were not run in this max-1 lineage.

## Recommended Next Focus

Add a stale-owner concurrent takeover regression and a post-SIGKILL still-live regression before treating the daemon handoff as release-ready.
Review verdict: CONDITIONAL
