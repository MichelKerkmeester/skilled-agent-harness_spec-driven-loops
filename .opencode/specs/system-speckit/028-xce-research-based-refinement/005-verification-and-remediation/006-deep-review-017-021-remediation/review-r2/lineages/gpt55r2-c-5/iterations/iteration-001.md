# Iteration 1: Correctness and Security Review of Daemon IPC Routing

## Focus
Reviewed the scope-C daemon IPC/client front-door path, with emphasis on `SPECKIT_IPC_SOCKET_DIR`, launcher bridging, CLI connection behavior, and HF model-server endpoint resolution.

## Scorecard
- Dimensions covered: correctness, security
- Files reviewed: 6
- New findings: P0=0 P1=1 P2=0
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.50

## Findings

### P0, Blocker
- None.

### P1, Required
- **F001**: Documented `tcp://` IPC override is split between incompatible endpoint resolvers. The MCP context server resolves `SPECKIT_IPC_SOCKET_DIR` through `path.resolve()` and appends `daemon-ipc.sock`, so `tcp://127.0.0.1:65535` becomes a filesystem path before binding [SOURCE: .opencode/skills/system-spec-kit/shared/ipc/socket-server.ts:201-211]. The launcher/CLI bridge preserves the same env var as a raw TCP endpoint for mk-spec-memory clients [SOURCE: .opencode/bin/lib/launcher-ipc-bridge.cjs:80-87], and the daemon-backed CLI obtains that path before probing/calling the MCP daemon [SOURCE: .opencode/skills/system-spec-kit/mcp_server/spec-memory-cli.ts:963-972]. The HF model-server resolver also consumes `SPECKIT_IPC_SOCKET_DIR` as a raw TCP endpoint [SOURCE: .opencode/bin/lib/model-server-supervision.cjs:441-450], and the launcher starts the model-server demand listener after wiring the session proxy [SOURCE: .opencode/bin/mk-spec-memory-launcher.cjs:1782-1784]. Result: the documented TCP override can point clients at a TCP endpoint the MCP daemon did not bind, or at the HF HTTP demand listener instead of the MCP JSON-RPC bridge. This is a P1 availability/configuration correctness defect for the daemon-backed CLI and multi-client bridge.

#### Claim Adjudication Packet: F001
```json
{
  "findingId": "F001",
  "claim": "When SPECKIT_IPC_SOCKET_DIR is a tcp:// endpoint, the MCP context server path-resolves it as a filesystem directory while launcher/CLI code uses the raw TCP endpoint and the HF model-server resolver can also consume that same TCP endpoint, so the documented TCP IPC mode cannot route clients to the MCP daemon reliably.",
  "evidenceRefs": [
    ".opencode/skills/system-spec-kit/shared/ipc/socket-server.ts:201-211",
    ".opencode/bin/lib/launcher-ipc-bridge.cjs:80-87",
    ".opencode/bin/lib/model-server-supervision.cjs:441-450",
    ".opencode/skills/system-spec-kit/mcp_server/spec-memory-cli.ts:963-972",
    ".opencode/bin/mk-spec-memory-launcher.cjs:1782-1784"
  ],
  "counterevidenceSought": "Checked startIpcSocketServer TCP support and the CLI/launcher resolver behavior. startIpcSocketServer can listen on tcp when handed tcp:// directly, but context-server calls resolveIpcSocketPath first, while CLI/launcher and HF model-server resolvers preserve the raw tcp:// endpoint.",
  "alternativeExplanation": "The tcp:// support could be intended only for the HF model server, but ENV_REFERENCE documents SPECKIT_IPC_SOCKET_DIR as the daemon IPC socket override and the CLI bridge uses it for mk-spec-memory, so this alternative is rejected.",
  "finalSeverity": "P1",
  "confidence": 0.88,
  "downgradeTrigger": "Downgrade if tcp:// is explicitly removed from the daemon IPC contract or separate MCP and HF TCP endpoint variables are enforced with tests proving no client/server mismatch.",
  "transitions": [
    { "iteration": 1, "from": null, "to": "P1", "reason": "Initial discovery" }
  ]
}
```

### P2, Suggestion
- None.

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| `spec_code` | partial | hard | .opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/006-deep-review-017-021-remediation/review-r2/scopes/C-rest-of-server/spec.md:7-11 | Scope includes daemon IPC and CLI front door; F001 is within scope. |
| `checklist_evidence` | partial | hard | .opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/006-deep-review-017-021-remediation/review-r2/scopes/C-rest-of-server/spec.md:13-14 | No checklist exists in this scope folder; scope spec drove evidence selection. |

## Assessment
- New findings ratio: 0.50
- Dimensions addressed: correctness, security
- Novelty justification: The finding arises from cross-file resolver disagreement, not a single local line smell.
- Adversarial self-check: P0 was rejected because no data-loss, destructive mutation, or privilege escalation was proven. P1 remains because documented TCP daemon IPC can become unusable or misrouted.

## Ruled Out
- Treating `startIpcSocketServer` TCP support as sufficient: rejected because the context server passes the output of `resolveIpcSocketPath`, which does not preserve `tcp://`.
- Treating the TCP endpoint as HF-only: rejected because mk-spec-memory launcher/CLI bridge uses the same env var as the MCP daemon endpoint.

## Dead Ends
- Full provider/handler sweep: not completed within one iteration.

## Recommended Next Focus
Add or inspect a regression test that sets `SPECKIT_IPC_SOCKET_DIR=tcp://127.0.0.1:<port>` and proves the context server, launcher bridge, CLI, and HF sidecar use distinct compatible endpoints.
Review verdict: CONDITIONAL
