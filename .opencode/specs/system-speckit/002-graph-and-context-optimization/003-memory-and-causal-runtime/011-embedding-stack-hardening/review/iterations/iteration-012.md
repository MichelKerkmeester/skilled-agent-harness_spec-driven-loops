# Deep Review Iteration 012

## Dimension

model-server-supervision + bridge lease/lifecycle deep: re-examined `model-server-supervision.cjs` give-up/cooldown/idle-evict/reclaim paths and `launcher-ipc-bridge.cjs` probe behavior, with specific adjudication of LEASE-1 and LEASE-2 severity.

## Files Reviewed

- `.opencode/bin/lib/model-server-supervision.cjs:324` - process-tree reap helper builds descendant candidates.
- `.opencode/bin/lib/model-server-supervision.cjs:591` - respawn-lock stale predicate.
- `.opencode/bin/lib/model-server-supervision.cjs:811` - model-server launch assigns child process.
- `.opencode/bin/lib/model-server-supervision.cjs:817` - launch can return false for no child pid.
- `.opencode/bin/lib/model-server-supervision.cjs:1031` - idle monitor tick entry.
- `.opencode/bin/lib/model-server-supervision.cjs:1055` - idle eviction obtains supervisor.
- `.opencode/bin/lib/model-server-supervision.cjs:1057` - idle eviction calls `reapProcessTree(pid)`.
- `.opencode/bin/lib/model-server-supervision.cjs:1058` - idle eviction clears shared model-server pid.
- `.opencode/bin/lib/model-server-supervision.cjs:1065` - idle eviction attempts lazy listener re-arm.
- `.opencode/bin/lib/model-server-supervision.cjs:1082` - demand listener release before spawn.
- `.opencode/bin/lib/model-server-supervision.cjs:1153` - long-lived demand respawn lock contract.
- `.opencode/bin/lib/model-server-supervision.cjs:1198` - demand-triggered spawn path.
- `.opencode/bin/lib/model-server-supervision.cjs:1225` - EADDRINUSE reclaim guard.
- `.opencode/bin/lib/launcher-ipc-bridge.cjs:123` - daemon JSON-RPC probe.
- `.opencode/bin/lib/launcher-ipc-bridge.cjs:226` - model-server health probe.
- `.opencode/bin/lib/launcher-ipc-bridge.cjs:275` - ready health accepted alive.
- `.opencode/bin/lib/launcher-ipc-bridge.cjs:290` - loading health accepted alive within bound.
- `.opencode/skills/system-spec-kit/mcp_server/tests/embedders/launcher-model-server-idle-eviction.vitest.ts:142` - idle eviction regression test.
- `.opencode/skills/system-spec-kit/mcp_server/tests/embedders/launcher-model-server-idle-eviction.vitest.ts:172` - idle test process rows include only the root pid.
- `.opencode/skills/system-spec-kit/mcp_server/tests/embedders/launcher-model-server-idle-eviction.vitest.ts:185` - idle test asserts probe call.
- `.opencode/skills/system-spec-kit/mcp_server/tests/embedders/launcher-model-server-idle-eviction.vitest.ts:186` - idle test asserts pid cleared.
- `.opencode/skills/system-spec-kit/mcp_server/tests/embedders/launcher-model-server-idle-eviction.vitest.ts:188` - idle test asserts listener re-armed.
- `.opencode/skills/system-spec-kit/mcp_server/tests/embedders/launcher-model-server-cross-launcher.vitest.ts:317` - explicit respawn reap path signals root process.
- `.opencode/skills/system-spec-kit/mcp_server/tests/launcher-watchdog.vitest.ts:237` - stale lock test preserves current live-aged lock behavior.

## Findings by Severity

### P0

None.

### P1

#### DR-012-P1-001 [P1] Idle eviction clears ownership without terminating the model-server root process

- File: `.opencode/bin/lib/model-server-supervision.cjs:1057`
- Claim: The idle eviction path treats the model server as evicted after calling `reapProcessTree(pid)`, clearing the shared pid, nulling the supervisor, and attempting lazy re-arm, but `reapProcessTree` only signals descendants and explicitly excludes the root `childPid`.
- Evidence: `reapProcessTreeGroups` builds candidates from descendants and filters out `childPid` at `.opencode/bin/lib/model-server-supervision.cjs:324-340`. The idle tick calls `supervisor.reapProcessTree(pid)`, then immediately clears the shared pid and supervisor at `.opencode/bin/lib/model-server-supervision.cjs:1055-1059`, and re-arms the listener at `.opencode/bin/lib/model-server-supervision.cjs:1065`. The existing idle test uses a process table containing only the root child pid at `.opencode/skills/system-spec-kit/mcp_server/tests/embedders/launcher-model-server-idle-eviction.vitest.ts:172`, then only asserts pid clearing and re-arm at lines 185-188; it never asserts a root signal. By contrast, the explicit respawn path does signal the root pid and tests for SIGTERM/SIGKILL at `.opencode/skills/system-spec-kit/mcp_server/tests/embedders/launcher-model-server-cross-launcher.vitest.ts:317-318`.
- Impact: A launcher can clear `hf-embed.pid` and drop supervision while the original model-server process continues to own the socket. Subsequent idle ticks see no supervisor pid, sibling launchers no longer see a recorded live pid, and the system can end up with an unsupervised resident or a later reclaim/bind race after the anonymous old listener survives path unlink/rebind.
- Finding class: cross-consumer
- Scope proof: The review compared idle eviction (`tickIdleMonitor`) against the explicit `reapBeforeRespawn` path and the idle/cross-launcher tests. The root-kill behavior exists in respawn reaping, not in idle eviction.
- Affected surface hints: ["idle eviction", "model-server supervision", "shared pid lease", "lazy listener re-arm"]
- Recommendation: Make idle eviction use the same root-aware termination path as `reapBeforeRespawn` or otherwise signal/wait the model-server root before clearing the pid and re-arming the lazy listener; add a regression test that asserts the root pid receives termination before ownership is cleared.
- Claim adjudication:
  - claim: Idle eviction can clear model-server ownership without killing the model-server root process.
  - evidenceRefs: `.opencode/bin/lib/model-server-supervision.cjs:324`, `.opencode/bin/lib/model-server-supervision.cjs:1057`, `.opencode/bin/lib/model-server-supervision.cjs:1058`, `.opencode/skills/system-spec-kit/mcp_server/tests/embedders/launcher-model-server-idle-eviction.vitest.ts:172`, `.opencode/skills/system-spec-kit/mcp_server/tests/embedders/launcher-model-server-cross-launcher.vitest.ts:317`
  - counterevidenceSought: Checked whether `reapProcessTree` signals the root, whether `clearTimers` kills the child, whether idle tests assert root termination, and whether bridge probing prevents stale ownership clearing.
  - alternativeExplanation: The helper name suggests process-tree reaping, and descendant process groups may be enough for RSS cleanup, but the implementation deliberately excludes the root pid and idle eviction never sends a separate signal to it.
  - finalSeverity: P1
  - confidence: 0.9
  - downgradeTrigger: Downgrade only if another production mechanism proves the root model-server process exits before `writeModelServerPid(null)` in every idle eviction path.

### P2

None new.

## Traceability Checks

- `spec_code`: fail. Phase 005 requires safe idle eviction with lazy demand re-arm; the code re-arms after clearing ownership without proving the root process is gone.
- `checklist_evidence`: partial. The idle eviction test asserts the re-arm surface but misses the root termination invariant.
- `skill_agent`: partial. The lifecycle review target was covered; no sub-agent dispatch used.
- `agent_cross_runtime`: partial. Cross-launcher pid and lock behavior were checked through existing unit tests and direct reads, not a live two-launcher run.
- `feature_catalog_code`: partial. Bridge probe behavior was checked as counterevidence; no new bridge-only finding.
- `playbook_capability`: partial. The finding maps to the single-writer/lease hardening remediation workstream.

## Verdict

FAIL. One new P1 was found in idle eviction lifecycle ownership. LEASE-1 and LEASE-2 remain correctly classified as P1, not P0: both can break availability/single-writer guarantees, but the evidence does not show destructive data loss or an exploitable auth bypass. No additional bridge-probe race was found beyond the existing lease/lifecycle findings.

## Next Dimension

Continue with line-level adversarial verification around live two-launcher transitions after idle eviction: root termination, pid-file clearing, socket unlink/rebind, and sibling launcher backoff.
