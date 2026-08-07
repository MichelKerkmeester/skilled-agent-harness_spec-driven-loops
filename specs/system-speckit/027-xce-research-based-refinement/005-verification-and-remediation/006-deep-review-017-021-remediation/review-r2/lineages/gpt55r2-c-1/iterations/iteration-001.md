# Iteration 1: Server Infrastructure Scope C

## Focus
Security, correctness, and traceability review of checkpoint request handlers/storage scope matching plus daemon IPC TCP override behavior. Scope source: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/006-deep-review-017-021-remediation/review-r2/scopes/C-rest-of-server/spec.md:6-14`.

## Scorecard
- Dimensions covered: correctness, security, traceability
- Files reviewed: 7
- New findings: P0=0 P1=2 P2=0
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 1.00

## Findings

### P0, Blocker
- None.

### P1, Required
- **F001**: Scoped checkpoint callers can match unscoped checkpoints. The storage predicate returns true whenever the requested scoped field is undefined or equal, but it does not require the checkpoint metadata to carry the requested scope; an unscoped `{}` metadata object therefore matches any `tenantId`, `userId`, or `agentId` scope [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1270-1281`]. The same predicate gates `listCheckpoints()` [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:2858-2886`], `getCheckpoint()` [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:2910-2922`], `restoreCheckpoint()` [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:2951-2958`], and `deleteCheckpoint()` [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:3287-3304`]. The handler-level mirror has the same wildcard behavior (`return actual === undefined || actual === expected`) [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/checkpoints.ts:256-265`], so the restore/delete mismatch branches do not protect scoped callers from unscoped checkpoint access. Impact: governed checkpoint boundaries can be bypassed for unscoped checkpoint rows, including destructive restore/delete operations.
- **F002**: Server IPC resolver breaks the documented `tcp://` socket override. `resolveIpcSocketPath()` always applies `path.resolve(process.env.SPECKIT_IPC_SOCKET_DIR)` and then appends `daemon-ipc.sock` [SOURCE: `.opencode/skills/system-spec-kit/shared/ipc/socket-server.ts:201-211`]. The CLI/launcher bridge preserves `tcp://` verbatim [SOURCE: `.opencode/bin/lib/launcher-ipc-bridge.cjs:80-88`] and the CLI skips filesystem perimeter setup for `tcp://` [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/spec-memory-cli.ts:795-803`], while the environment reference explicitly says `SPECKIT_IPC_SOCKET_DIR` accepts `tcp://host:port` [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md:180`]. Verified locally: `path.resolve('tcp://127.0.0.1:65535')` becomes `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/tcp:/127.0.0.1:65535`, so the backend binds a Unix-socket path while clients probe TCP. Impact: documented TCP IPC mode cannot connect and can leave launcher/daemon state split between incompatible socket paths.

### P2, Suggestion
- None.

## Claim Adjudication Packets
```json
[
  {
    "findingId": "F001",
    "claim": "Scoped checkpoint operations can match unscoped checkpoint metadata because missing metadata fields are treated as matches.",
    "evidenceRefs": [
      ".opencode/skills/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1270-1281",
      ".opencode/skills/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:2858-2886",
      ".opencode/skills/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:2910-2922",
      ".opencode/skills/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:2951-2958",
      ".opencode/skills/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:3287-3304",
      ".opencode/skills/system-spec-kit/mcp_server/handlers/checkpoints.ts:256-265"
    ],
    "counterevidenceSought": "Checked both handler-level checkpointMatchesScope and storage-level checkpointMetadataMatchesScope plus list/get/restore/delete call sites for a stricter scope filter; none requires actual metadata fields to exist when a scoped caller supplies them.",
    "alternativeExplanation": "The wildcard may be intended to let scoped callers see legacy unscoped checkpoints, but the tool contract exposes tenant/user/agent boundaries and destructive restore/delete paths, so legacy compatibility should require explicit unscoped access or migration rather than implicit scoped access.",
    "finalSeverity": "P1",
    "confidence": 0.88,
    "downgradeTrigger": "Downgrade if a documented policy explicitly allows scoped callers to access unscoped checkpoints and restore/delete are constrained elsewhere by caller authority beyond the shown scope predicates.",
    "transitions": [
      {
        "iteration": 1,
        "from": null,
        "to": "P1",
        "reason": "Initial discovery"
      }
    ]
  },
  {
    "findingId": "F002",
    "claim": "The server-side IPC resolver does not preserve tcp:// SPECKIT_IPC_SOCKET_DIR values, while the launcher and CLI do, so documented TCP IPC mode is split-brain.",
    "evidenceRefs": [
      ".opencode/skills/system-spec-kit/shared/ipc/socket-server.ts:201-211",
      ".opencode/bin/lib/launcher-ipc-bridge.cjs:80-88",
      ".opencode/skills/system-spec-kit/mcp_server/spec-memory-cli.ts:795-803",
      ".opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md:180"
    ],
    "counterevidenceSought": "Checked the launcher bridge and CLI socket handling for tcp:// preservation and ran node path.resolve on a tcp URL to confirm the backend resolver transformation.",
    "alternativeExplanation": "TCP support might be intended only for model-server sockets, but the memory MCP ENV reference names the daemon IPC socket directory and includes mcp_server/lib/ipc/socket-server.ts as a source, so the memory daemon resolver is part of the documented contract.",
    "finalSeverity": "P1",
    "confidence": 0.9,
    "downgradeTrigger": "Downgrade if TCP IPC is removed from the spec-memory daemon contract and ENV_REFERENCE is corrected to document filesystem directories only.",
    "transitions": [
      {
        "iteration": 1,
        "from": null,
        "to": "P1",
        "reason": "Initial discovery"
      }
    ]
  }
]
```

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | partial | hard | `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/006-deep-review-017-021-remediation/review-r2/scopes/C-rest-of-server/spec.md:6-14` | Scope claims checked against checkpoint handlers/storage and IPC daemon paths only. |
| checklist_evidence | partial | hard | `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/006-deep-review-017-021-remediation/review-r2/scopes/C-rest-of-server/spec.md:1-17` | No checklist.md exists in this scope packet. |

## Assessment
- New findings ratio: 1.00
- Dimensions addressed: correctness, security, traceability
- Novelty justification: Both findings are distinct root causes with direct file:line evidence and separate remediation lanes.

## Ruled Out
- `context-server.js` source review: scope text names `.js`, but live source is `context-server.ts`; launcher spawns compiled `dist/context-server.js`.

## Dead Ends
- Full handler/provider coverage: maxIterations=1 ended the lineage before complete breadth.

## Recommended Next Focus
Replay checkpoint scope isolation and TCP IPC tests after remediation, then cover maintainability and remaining provider/daemon lifecycle breadth.
Review verdict: CONDITIONAL
