# Deep Review Iteration 016

## Dimension

scripts: daemon-detect lease-path resolution + isProcessAlive; workflow Step 11.5 daemon guard + lock semantics. Re-examined SEC-2 workflow-lock fail-open and daemon-detect path/edge cases under correctness, security, and traceability.

## Files Reviewed

- `.opencode/skills/system-spec-kit/scripts/core/daemon-detect.ts:54` - lease PID selection ignores additive child/model-server fields.
- `.opencode/skills/system-spec-kit/scripts/core/daemon-detect.ts:64` - process liveness helper.
- `.opencode/skills/system-spec-kit/scripts/core/daemon-detect.ts:92` - default lease path resolver.
- `.opencode/skills/system-spec-kit/scripts/core/workflow.ts:411` - workflow filesystem lock acquisition.
- `.opencode/skills/system-spec-kit/scripts/core/workflow.ts:481` - per-folder description lock acquisition.
- `.opencode/skills/system-spec-kit/scripts/core/workflow.ts:594` - Step 11.5 daemon liveness check.
- `.opencode/skills/system-spec-kit/scripts/core/workflow.ts:615` - standalone `reindexSpecDocs` call after daemonStatus false.
- `.opencode/skills/system-spec-kit/scripts/core/workflow.ts:686` - daemon/index contention warning fallback.
- `.opencode/bin/lib/model-server-supervision.cjs:688` - shared launcher lease payload schema with additive `childPid`.
- `.opencode/bin/mk-spec-memory-launcher.cjs:389` - launcher writes lease with current context-server child PID.
- `.opencode/bin/mk-spec-memory-launcher.cjs:764` - context-server child spawn.
- `.opencode/bin/mk-spec-memory-launcher.cjs:843` - normal signal path clears lease after child shutdown.
- `.opencode/skills/system-spec-kit/scripts/tests/daemon-detect.vitest.ts:35` - daemon-detect coverage.
- `.opencode/skills/system-spec-kit/scripts/tests/workflow-step115-daemon-guard.vitest.ts:18` - Step 11.5 daemon guard coverage.

## Findings by Severity

### P0

None.

### P1

#### DR-016-P1-001 [P1] Step 11.5 daemon guard ignores live childPid in a stale launcher lease

- File: `.opencode/skills/system-spec-kit/scripts/core/daemon-detect.ts:54`
- Claim: `isSpecMemoryDaemonAlive` only checks the launcher lease `pid`/`ownerPid`. The launcher lease also records `childPid` for the context-server daemon, but Step 11.5 ignores it, so a hard-killed launcher can leave a live context-server child holding the daemon database while standalone save concludes `daemonStatus.alive=false` and starts `reindexSpecDocs` as a second writer.
- Evidence: `readLeasePid()` returns `parsed.pid` or `parsed.ownerPid` only at `daemon-detect.ts:54`; `isSpecMemoryDaemonAlive()` probes only that PID before returning false at `daemon-detect.ts:107-112`. The lease schema includes additive `childPid` at `model-server-supervision.cjs:688-700`, and the memory launcher writes the spawned context-server child into that field at `mk-spec-memory-launcher.cjs:389-392` and `mk-spec-memory-launcher.cjs:764-770`. Step 11.5 then calls `reindexSpecDocs(specFolderName)` when daemonStatus is false at `workflow.ts:594-615`.
- Counterevidence sought: Normal shutdown is partially covered. Signal handlers kill children and clear the lease at `mk-spec-memory-launcher.cjs:804-844`, and `uncaughtException` clears the lease at `mk-spec-memory-launcher.cjs:857-864`. Current tests cover live launcher pid, dead launcher pid, missing lease, and canonical path resolution at `daemon-detect.vitest.ts:35-71`, plus daemon-up skip and SQLITE_BUSY fallback at `workflow-step115-daemon-guard.vitest.ts:18-68`. I did not find a test or guard for `lease.pid` dead with `lease.childPid` live.
- Alternative explanation: A clean launcher shutdown should clear the lease and stop the child. The remaining case is hard launcher death before cleanup, where the child process can continue independently and the lease already carries the child PID needed to detect it.
- Final severity: P1. This reopens the second-writer/corruption-risk class that Step 11.5 is supposed to prevent, but requires a stale/hard-death launcher condition, so it is not P0.
- Confidence: 0.82.
- Downgrade trigger: Downgrade if the context-server child is proven unable to survive launcher hard death on supported runtimes, or if Step 11.5 is otherwise protected by an exclusive writer lease that covers the live child process before `reindexSpecDocs` runs.
- Finding class: cross-consumer.
- Scope proof: `rg -n "childPid|isSpecMemoryDaemonAlive|reindexSpecDocs|mk-spec-memory-launcher"` ties the lease producer, detector, Step 11.5 consumer, and tests; no childPid-aware detector branch was found.
- Affected surface hints: ["daemon lease", "Step 11.5 auto-index", "standalone save", "single-writer guard"]
- Recommendation: Treat a live `childPid` as daemon-alive when `pid` is dead, ideally with command/identity validation or a health probe before allowing standalone indexing. Add a regression test with `pid` dead and `childPid` live.

### P2

None.

## Traceability Checks

- `spec_code`: partial. The canonical lease path now resolves to `system-spec-kit/mcp_server/database`, and Step 11.5 skips when the primary lease pid is alive. The lease schema/code contract is not fully consumed because `childPid` is ignored by the detector.
- `checklist_evidence`: partial. Tests cover live/dead primary pid and SQLITE_BUSY fallback, but not the hard-death stale launcher lease with live child.
- `agent_cross_runtime`: partial. This is process-lifecycle behavior; no live runtime kill/reparent test was executed in this iteration.
- `feature_catalog_code`: partial. The daemon guard aligns with the single-writer feature only for the primary launcher pid case.
- `playbook_capability`: partial. Existing guard tests diagnose daemon contention, but the childPid stale-lease case needs a playbook/test row.

## Verdict

FAIL. One new P1 was found. SEC-2/DR-002-P1-002 remains an existing open P1 and was not re-reported; the workflow locks still fail open at `workflow.ts:424`, `workflow.ts:436`, `workflow.ts:463`, `workflow.ts:513`, and `workflow.ts:527`. The daemon lease path regression itself is ruled out by the current resolver and test coverage.

## Next Dimension

Continue adversarial convergence on the single-writer workstream. The next useful pass is implementation-readiness grouping: SEC-2 fail-closed locks plus DR-016 childPid-aware daemon detection should be remediated together or explicitly split by writer boundary.
