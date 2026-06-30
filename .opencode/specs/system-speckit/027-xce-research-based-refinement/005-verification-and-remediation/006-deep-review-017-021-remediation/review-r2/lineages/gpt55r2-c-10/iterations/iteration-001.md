# Iteration 1: MCP Server Infrastructure Correctness and Security

## Focus
Reviewed the scope C packet and sampled high-risk server infrastructure paths for daemon IPC, launcher bridge behavior, and async ingest path validation.

## Scorecard
- Dimensions covered: correctness, security, traceability
- Files reviewed: 9
- New findings: P0=0 P1=2 P2=0
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 1.00

## Findings

### P0, Blocker
- None.

### P1, Required
- **F001**: Documented tcp IPC fallback is not passed through by the daemon-side resolver. The CLI shim explicitly accepts a `SPECKIT_IPC_SOCKET_DIR` that starts with `tcp://` and even tells users to set a tcp endpoint when a Unix socket path is too long [SOURCE: .opencode/bin/spec-memory.cjs:107-113]. The launcher bridge also returns a `tcp://` env value unchanged [SOURCE: .opencode/bin/lib/launcher-ipc-bridge.cjs:80-87]. But the daemon-side resolver always applies `path.resolve(process.env.SPECKIT_IPC_SOCKET_DIR)` and canonicalizes it as a filesystem directory before joining `daemon-ipc.sock` [SOURCE: .opencode/skills/system-spec-kit/shared/ipc/socket-server.ts:201-211], and context-server uses that resolver to bind the bridge [SOURCE: .opencode/skills/system-spec-kit/mcp_server/context-server.ts:2319-2321]. A `tcp://127.0.0.1:1234` endpoint therefore becomes a Unix-path-like string such as `<cwd>/tcp:/127.0.0.1:1234`, while secondaries probe the tcp endpoint, so the documented fallback cannot work.
- **F002**: Async ingest path prevalidation falls back on missing targets and later follows whatever path exists at processing time. `memory_ingest_start` tries `fs.realpathSync(resolvedPath)` but, if the target is missing, deliberately falls back to `resolvedPath` [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-ingest.ts:198-205]. It then persists that path into the ingest job [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-ingest.ts:252-258]. The background worker later passes the saved path to `indexSingleFile` [SOURCE: .opencode/skills/system-spec-kit/mcp_server/context-server.ts:2199-2203], which calls `indexMemoryFile` and immediately parses the file path [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts:2833-2850]. The parser checks existence and reads/stats the path directly [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:251-257]. That creates a TOCTOU window where a path accepted while nonexistent can be replaced with a symlink or different target before the worker reads it, bypassing the allowed-root realpath check performed at enqueue time.

### P2, Suggestion
- None.

## Claim Adjudication Packets

```json
{
  "findingId": "F001",
  "claim": "The advertised tcp IPC fallback is split between launcher and daemon resolution, so a tcp endpoint is recorded and probed by clients but the daemon binds a normalized filesystem path instead.",
  "evidenceRefs": [
    ".opencode/bin/spec-memory.cjs:107-113",
    ".opencode/bin/lib/launcher-ipc-bridge.cjs:80-87",
    ".opencode/skills/system-spec-kit/shared/ipc/socket-server.ts:201-211",
    ".opencode/skills/system-spec-kit/mcp_server/context-server.ts:2319-2321"
  ],
  "counterevidenceSought": "Checked startIpcSocketServer tcp handling and verified with node path.resolve that tcp://127.0.0.1:1234 normalizes to a filesystem path when passed through path.resolve.",
  "alternativeExplanation": "The tcp endpoint might be considered unsupported for spec-memory, but spec-memory.cjs explicitly recommends setting a tcp:// endpoint when the Darwin Unix socket path is too long.",
  "finalSeverity": "P1",
  "confidence": 0.9,
  "downgradeTrigger": "Downgrade if resolveIpcSocketPath gains an early tcp:// pass-through before context-server binds, with a regression proving the launcher and daemon use the same endpoint.",
  "transitions": [
    {
      "iteration": 1,
      "from": null,
      "to": "P1",
      "reason": "Initial discovery"
    }
  ]
}
```

```json
{
  "findingId": "F002",
  "claim": "Async ingest validates a missing path once, stores the unresolved path, and later reads it without re-realpathing against allowed roots, allowing a symlink/replacement target to escape the enqueue-time path policy.",
  "evidenceRefs": [
    ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-ingest.ts:198-205",
    ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-ingest.ts:252-258",
    ".opencode/skills/system-spec-kit/mcp_server/context-server.ts:2199-2203",
    ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts:2833-2850",
    ".opencode/skills/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:251-257"
  ],
  "counterevidenceSought": "Followed the ingest path from handler validation to job persistence, context-server worker dispatch, indexMemoryFile, and parseMemoryFile; no later realpath/allowed-root check appears on the async worker path before reading.",
  "alternativeExplanation": "If memory_ingest_start were documented to require existing files only, the fallback could be dead code; however the handler accepts missing files by design and queues them after fallback.",
  "finalSeverity": "P1",
  "confidence": 0.84,
  "downgradeTrigger": "Downgrade if the worker revalidates fs.realpathSync(filePath) against canonical allowed roots immediately before parsing, or if missing paths are rejected at enqueue time.",
  "transitions": [
    {
      "iteration": 1,
      "from": null,
      "to": "P1",
      "reason": "Initial discovery"
    }
  ]
}
```

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | partial | hard | .opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/006-deep-review-017-021-remediation/review-r2/scopes/C-rest-of-server/spec.md:6-12 | Sampled requested daemon IPC and async ingest surfaces; findings map to scope emphasis on IPC trust and fail-closed path handling. |
| checklist_evidence | partial | hard | .opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/006-deep-review-017-021-remediation/review-r2/scopes/C-rest-of-server/spec.md:1-20 | No checklist.md exists in this scope folder. |

## Assessment
- New findings ratio: 1.00
- Dimensions addressed: correctness, security, traceability
- Novelty justification: both findings are newly recorded in this lineage and supported by direct file:line evidence.

## Ruled Out
- F001 as user misconfiguration: ruled out because the CLI shim explicitly accepts and suggests tcp endpoints, but daemon resolution does not preserve them.

## Dead Ends
- Full checklist evidence: blocked because scope folder has no checklist.md.

## Recommended Next Focus
Run a maintainability and broader handler-envelope pass if more iterations are allowed.
Review verdict: CONDITIONAL
