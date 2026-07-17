# Iteration 1: Correctness / Fail-Closed Server Contracts

## Focus
Correctness-focused pass over the scope-C server infrastructure surface: IPC endpoint resolution, launcher bridge path agreement, and destructive handler contract enforcement.

## Scorecard
- Dimensions covered: correctness
- Files reviewed: 9
- New findings: P0=0 P1=2 P2=0
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 1.00

## Findings

### P0, Blocker
- None.

### P1, Required
- **F001**: `tcp://` IPC override is split between launcher clients and daemon listener. `context-server` starts the secondary IPC bridge using `resolveIpcSocketPath(DATABASE_DIR)` [SOURCE: .opencode/skills/system-spec-kit/mcp_server/context-server.ts:2319-2320]. The resolver path-resolves `SPECKIT_IPC_SOCKET_DIR` unconditionally, so `tcp://127.0.0.1:65535` becomes a filesystem path before it reaches `startIpcSocketServer` [SOURCE: .opencode/skills/system-spec-kit/shared/ipc/socket-server.ts:201-205]. `startIpcSocketServer` only takes the TCP branch when the already-resolved option still starts with `tcp://` [SOURCE: .opencode/skills/system-spec-kit/shared/ipc/socket-server.ts:330-336], while launcher clients preserve raw `tcp://` endpoint strings from the same env var [SOURCE: .opencode/bin/lib/launcher-ipc-bridge.cjs:80-87]. A documented TCP IPC override therefore makes clients probe one endpoint while the daemon listens on another. Severity P1 because it breaks a documented daemon fallback/override path without affecting the default `/tmp` socket path.
- **F002**: `memory_delete` ignores `specFolder` when `id` and `specFolder` are both provided. The public schema says callers must provide EITHER `id` or `specFolder` [SOURCE: .opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:454-463], but the Zod schema only rejects requests where both are absent and never rejects both-present requests [SOURCE: .opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:279-302]. The handler then accepts both, prioritizes the single-id branch, snapshots by id only, and deletes that id without checking that it belongs to the supplied `specFolder` [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:106-127] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:131-132]. Severity P1 because this is a destructive tool contract/scope-safety gap: a caller attempting to scope an id deletion can delete an out-of-scope row.

### P2, Suggestion
- None.

## Claim Adjudication Packets
```json
{
  "findingId": "F001",
  "claim": "The documented tcp:// IPC override cannot make spec-memory launcher clients and the daemon listener use the same endpoint because the daemon resolver path-resolves tcp:// while the launcher bridge preserves it.",
  "evidenceRefs": [
    ".opencode/skills/system-spec-kit/mcp_server/context-server.ts:2319-2320",
    ".opencode/skills/system-spec-kit/shared/ipc/socket-server.ts:201-205",
    ".opencode/skills/system-spec-kit/shared/ipc/socket-server.ts:330-336",
    ".opencode/bin/lib/launcher-ipc-bridge.cjs:80-87"
  ],
  "counterevidenceSought": "Checked startIpcSocketServer for a direct TCP branch and launcher-ipc-bridge for client-side endpoint resolution; also confirmed Node path.resolve('tcp://127.0.0.1:65535') produces a filesystem path under the workspace.",
  "alternativeExplanation": "Direct callers can pass a literal tcp:// string to startIpcSocketServer, but context-server does not do that; it calls resolveIpcSocketPath first.",
  "finalSeverity": "P1",
  "confidence": 0.88,
  "downgradeTrigger": "Downgrade if resolveIpcSocketPath preserves tcp:// endpoints and an integration test proves the launcher client and daemon listener share the same TCP endpoint.",
  "transitions": [
    { "iteration": 1, "from": null, "to": "P1", "reason": "Initial discovery" }
  ]
}
```

```json
{
  "findingId": "F002",
  "claim": "memory_delete accepts both id and specFolder even though its public contract says either/or, then deletes by id without verifying the supplied specFolder scope.",
  "evidenceRefs": [
    ".opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:454-463",
    ".opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:279-302",
    ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:106-127",
    ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:131-132"
  ],
  "counterevidenceSought": "Checked the public tool schema, the Zod validation superRefine, and the handler branch for an either/or rejection or a single-id specFolder ownership check; none was present.",
  "alternativeExplanation": "The specFolder field may have been intended only for bulk-delete mode, but the public contract advertises either/or and the validator accepts both, so a both-present call is a reachable ambiguous destructive request.",
  "finalSeverity": "P1",
  "confidence": 0.9,
  "downgradeTrigger": "Downgrade if validation rejects both-present requests or the id branch verifies the row's spec_folder equals the supplied specFolder before deleting.",
  "transitions": [
    { "iteration": 1, "from": null, "to": "P1", "reason": "Initial discovery" }
  ]
}
```

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | partial | hard | `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/006-deep-review-017-021-remediation/review-r2/scopes/C-rest-of-server/spec.md:6-14` | Scope targets handler/provider/daemon infrastructure; this pass confirmed two defects in that surface. |
| checklist_evidence | partial | hard | `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/006-deep-review-017-021-remediation/review-r2/scopes/C-rest-of-server/spec.md:1-17` | No checklist.md exists in the scope folder, so checked-item evidence cannot pass. |

## Assessment
- New findings ratio: 1.00
- Dimensions addressed: correctness
- Novelty justification: F001 comes from cross-reading daemon and launcher endpoint derivation. F002 comes from cross-reading public schema, validation schema, and destructive handler branch behavior.

## Ruled Out
- P0 escalation for F001: default `/tmp` socket path is unaffected.
- P0 escalation for F002: `confirm:true` is still required before deletion.

## Dead Ends
- None; maxIterations=1 stopped the lineage before broader security/provider lifecycle passes.

## Recommended Next Focus
Security and daemon lifecycle breadth: TCP IPC trust boundary, handler mutation authorization, provider failover, and launcher release/adoption race paths.
Review verdict: CONDITIONAL
