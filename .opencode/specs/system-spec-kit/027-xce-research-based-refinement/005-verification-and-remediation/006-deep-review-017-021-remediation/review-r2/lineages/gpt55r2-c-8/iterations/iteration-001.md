# Iteration 001: MCP Server IPC And Launcher Review

## Focus

Reviewed the requested server-infrastructure scope with emphasis on daemon IPC path handling, secondary-client/session replay, launcher lifecycle, model-server supervision, and provider retry behavior.

## Scorecard

- Dimensions covered: correctness, security, traceability
- Files reviewed: 12
- New findings: P0=0 P1=2 P2=0
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 1.00

## Findings

### P0, Blocker

- None.

### P1, Required

- **F001**: TCP IPC endpoint is resolved as a filesystem path on the server. `resolveIpcSocketPath()` applies `path.resolve(process.env.SPECKIT_IPC_SOCKET_DIR)` and always returns `path.join(socketDir, SOCKET_FILE_NAME)`, so a configured `SPECKIT_IPC_SOCKET_DIR=tcp://host:port` becomes a local filesystem path rather than the TCP endpoint [SOURCE: .opencode/skills/system-spec-kit/shared/ipc/socket-server.ts:201-211]. The client bridge preserves `tcp://` values as socket endpoints [SOURCE: .opencode/bin/lib/launcher-ipc-bridge.cjs:80-83], and the CLI shim documents `tcp://` as the fallback for long socket paths [SOURCE: .opencode/bin/spec-memory.cjs:107-113]. This creates a client/server split where CLI clients probe TCP while the daemon binds a different filesystem socket, making the documented TCP mode unusable.

```json
{
  "findingId": "F001",
  "claim": "The server-side IPC resolver turns a configured tcp:// endpoint into a filesystem socket path while the CLI bridge preserves tcp://, so documented TCP IPC mode cannot connect.",
  "evidenceRefs": [
    ".opencode/skills/system-spec-kit/shared/ipc/socket-server.ts:201-211",
    ".opencode/bin/lib/launcher-ipc-bridge.cjs:80-83",
    ".opencode/bin/spec-memory.cjs:107-113"
  ],
  "counterevidenceSought": "Read listenOnce/startIpcSocketServer TCP branches in shared/ipc/socket-server.ts and the CLI/launcher bridge getIpcSocketPath paths; no pre-resolve tcp:// fast path exists in the server resolver.",
  "alternativeExplanation": "The CLI wrapper might be the only intended tcp:// consumer, but the server implementation also has tcp:// listen branches, and the CLI error text explicitly instructs users to set SPECKIT_IPC_SOCKET_DIR to a tcp:// endpoint.",
  "finalSeverity": "P1",
  "confidence": 0.91,
  "downgradeTrigger": "Downgrade if a separate server-side env variable or wrapper rewrites SPECKIT_IPC_SOCKET_DIR back to tcp:// before resolveIpcSocketPath is called and an integration test covers CLI/server TCP mode.",
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

- **F002**: Session proxy replays `memory_save` despite a documented non-idempotent secondary-index gap. The proxy marks `memory_save` as replayable [SOURCE: .opencode/bin/lib/launcher-session-proxy.cjs:33-47]. The same block documents that a commit-then-die replay can append duplicate secondary-index rows because that path lacks an idempotency token [SOURCE: .opencode/bin/lib/launcher-session-proxy.cjs:146-153]. The mk-spec-memory launcher routes both secondary stdio bridges through this reconnecting session proxy [SOURCE: .opencode/bin/mk-spec-memory-launcher.cjs:291-299]. A daemon recycle during `memory_save` can therefore reissue a mutating save whose primary row may dedupe while secondary indexes duplicate, corrupting downstream retrieval/metadata views.

```json
{
  "findingId": "F002",
  "claim": "The launcher session proxy can replay memory_save after backend recycle even though the code documents that the secondary-index side effects are not idempotent.",
  "evidenceRefs": [
    ".opencode/bin/lib/launcher-session-proxy.cjs:33-47",
    ".opencode/bin/lib/launcher-session-proxy.cjs:146-153",
    ".opencode/bin/mk-spec-memory-launcher.cjs:291-299"
  ],
  "counterevidenceSought": "Read the replayable and unsafe tool sets in launcher-session-proxy.cjs and the mk-spec-memory launcher bridge wiring; memory_save is replayable and is not in the unsafe set, while the comment calls out the missing secondary-index idempotency token.",
  "alternativeExplanation": "The primary memory row dedup may make the main save path appear safe, but the documented secondary-index duplicate gap means the operation is not fully replay-safe.",
  "finalSeverity": "P1",
  "confidence": 0.88,
  "downgradeTrigger": "Downgrade if memory_save is removed from the replayable set or a request idempotency token is threaded through every secondary-index write with a regression covering commit-then-die replay.",
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

### P2, Suggestion

- None.

## Cross-Reference Results

| Protocol | Status | Gate | Evidence | Notes |
| --- | --- | --- | --- | --- |
| spec_code | partial | hard | `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/006-deep-review-017-021-remediation/review-r2/scopes/C-rest-of-server/spec.md:6-14` | Requested daemon/IPC scope reviewed; two P1 implementation defects found. |
| checklist_evidence | pass | hard | `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/006-deep-review-017-021-remediation/review-r2/scopes/C-rest-of-server/spec.md:1-20` | No checklist.md exists in the scope, so this is N/A. |

## Assessment

- New findings ratio: 1.00
- Dimensions addressed: correctness, security, traceability
- Novelty justification: both findings are distinct IPC/session-replay defects with direct source evidence.

## Ruled Out

- Search pipeline internals: explicitly outside this scope.
- Store/index internals: only sampled where needed to assess the IPC replay defect.

## Dead Ends

- MCP memory trigger lookup could not be used with the provided fan-out session id because the server rejected the non-managed session id; direct file review continued.

## Recommended Next Focus

Run another pass over request-handler error taxonomy and provider failover once the one-iteration fan-out cap is lifted, then add targeted repro tests for F001 and F002.

Review verdict: CONDITIONAL
