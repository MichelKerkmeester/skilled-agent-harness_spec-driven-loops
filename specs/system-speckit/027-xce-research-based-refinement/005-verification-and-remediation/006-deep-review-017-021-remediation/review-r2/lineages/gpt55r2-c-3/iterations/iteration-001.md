# Iteration 001: IPC Configuration Contract

## Focus
Correctness and security review of the daemon-backed IPC endpoint path across the CLI shim, daemon-backed CLI, launcher bridge, context-server startup, and canonical IPC bridge resolver.

## Scorecard
- Dimensions covered: correctness, security
- Files reviewed: 7
- New findings: P0=0 P1=1 P2=0
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 1.00

## Findings

### P0, Blocker
None.

### P1, Required
- **F001**: `tcp://` IPC configuration is accepted by clients but ignored by the daemon resolver. The CLI shim explicitly treats `SPECKIT_IPC_SOCKET_DIR` values starting with `tcp://` as valid non-filesystem endpoints and returns without socket-dir setup [SOURCE: `.opencode/bin/spec-memory.cjs:103-114`]. The launcher bridge likewise returns `SPECKIT_IPC_SOCKET_DIR` unchanged when it starts with `tcp://` [SOURCE: `.opencode/bin/lib/launcher-ipc-bridge.cjs:80-88`]. But the daemon starts its secondary bridge with `resolveIpcSocketPath(DATABASE_DIR)` [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/context-server.ts:2319-2321`], and that resolver path-resolves the env var before appending `daemon-ipc.sock` [SOURCE: `.opencode/skills/system-spec-kit/shared/ipc/socket-server.ts:201-211`]. With `SPECKIT_IPC_SOCKET_DIR=tcp://127.0.0.1:NNNN`, clients probe/connect to TCP while the daemon binds a filesystem path derived from `tcp:/...`, so warm-only calls report retryable backend unavailable and non-warm calls can spawn a daemon that never satisfies the client endpoint.

Typed claim adjudication packet:

```json
{
  "findingId": "F001",
  "claim": "The spec-memory client and launcher preserve tcp:// SPECKIT_IPC_SOCKET_DIR endpoints, but the daemon bridge resolver path-resolves the same value into a filesystem socket path, so the client and daemon use different IPC endpoints.",
  "evidenceRefs": [
    ".opencode/bin/spec-memory.cjs:103-114",
    ".opencode/bin/lib/launcher-ipc-bridge.cjs:80-88",
    ".opencode/skills/system-spec-kit/mcp_server/context-server.ts:2319-2321",
    ".opencode/skills/system-spec-kit/shared/ipc/socket-server.ts:201-211"
  ],
  "counterevidenceSought": "Read the daemon-backed CLI connection path, launcher bridge getIpcSocketPath implementation, context-server startup bridge call, canonical shared IPC resolver, and launcher IPC bridge tests for tcp:// coverage.",
  "alternativeExplanation": "tcp:// support might be intended only for low-level tests, but the public CLI shim, bridge, and usage/error text all preserve or document tcp:// endpoint handling, so silently diverging at daemon startup remains a shipped contract failure.",
  "finalSeverity": "P1",
  "confidence": 0.91,
  "downgradeTrigger": "Downgrade if product policy declares tcp:// unsupported and the CLI shim, bridge, tests, and user-facing recovery text are changed to reject it consistently before daemon startup.",
  "transitions": [
    { "iteration": 1, "from": null, "to": "P1", "reason": "Initial discovery" }
  ]
}
```

### P2, Suggestion
None.

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
| --- | --- | --- | --- | --- |
| spec_code | partial | hard | `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/006-deep-review-017-021-remediation/review-r2/scopes/C-rest-of-server/spec.md:7-14` | Scope targets IPC/socket handling; F001 covers one concrete implementation drift. |
| checklist_evidence | skipped | hard | `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/006-deep-review-017-021-remediation/review-r2/scopes/C-rest-of-server/spec.md:1-17` | No checklist file exists in the scope folder. |

## Assessment
- New findings ratio: 1.00
- Dimensions addressed: correctness, security
- Novelty justification: F001 links four independently read code paths and identifies a client/server endpoint mismatch not already present in this lineage's state.

## Ruled Out
- Checkpoint scope mismatch: inspected handler and storage paths; storage-level scope filtering rejects mismatched metadata before restore/delete mutation, so no finding was recorded.

## Dead Ends
- Full provider/handler breadth: not attempted because `config.maxIterations` is 1 and IPC lifecycle was the highest-risk slice reached in this iteration.

## Recommended Next Focus
If another lineage continues this scope, review owner-lease re-election and provider retry shutdown behavior, then complete traceability and maintainability passes.

Review verdict: CONDITIONAL
