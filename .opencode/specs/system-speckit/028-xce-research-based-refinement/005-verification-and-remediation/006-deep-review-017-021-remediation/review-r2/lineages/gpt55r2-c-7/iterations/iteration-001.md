# Iteration 001: Correctness, Security, and Daemon Concurrency

## Focus
Reviewed the C-rest-of-server scope: MCP server infrastructure outside the search pipeline and store/index lifecycle surfaces, with emphasis on daemon lifecycle races, IPC trust boundaries, provider wrappers, and fail-closed behavior.

Code graph status was stale, so this pass used direct Glob/Grep/Read evidence only.

## Scorecard
- Dimensions covered: correctness, security, traceability
- Files reviewed: 14
- New findings: P0=0 P1=2 P2=0
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 1.00

## Findings

### P0, Blocker
No P0 findings.

### P1, Required
- **F001**: Documented `tcp://` IPC override is split-brain between server and launcher. The env reference says `SPECKIT_IPC_SOCKET_DIR` "Also accepts `tcp://host:port`" [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md:180`], and the CLI shim explicitly lets `tcp://` pass through [SOURCE: `.opencode/bin/spec-memory.cjs:107-108`]. The launcher-side bridge then treats that env value as the actual TCP endpoint [SOURCE: `.opencode/bin/lib/launcher-ipc-bridge.cjs:80-87`]. The backend server, however, starts its IPC bridge from `resolveIpcSocketPath(DATABASE_DIR)` [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/context-server.ts:2319-2320`], and that resolver always applies `path.resolve()` to `SPECKIT_IPC_SOCKET_DIR`, canonicalizes it as a filesystem directory, and appends `daemon-ipc.sock` [SOURCE: `.opencode/skills/system-spec-kit/shared/ipc/socket-server.ts:201-212`]. Result: the documented TCP fallback cannot connect the front door to the backend; clients target TCP while the server binds a Unix-socket path derived from the literal `tcp://...` string.
- **F002**: Session proxy replays `memory_save` despite an acknowledged non-idempotent secondary-index gap. `memory_save` is in the replayable tool set [SOURCE: `.opencode/bin/lib/launcher-session-proxy.cjs:33-47`]. The adjacent comment says primary rows are protected but explicitly records a "KNOWN GAP" where a commit-then-die that finished primary insert but not secondary-index write can replay and append duplicate secondary-index rows because no request-id/dedup key reaches the save handler [SOURCE: `.opencode/bin/lib/launcher-session-proxy.cjs:146-153`]. The replay path sends every pending request whose classifier marked it replayable back to the fresh backend, while non-replayable requests receive retryable errors instead [SOURCE: `.opencode/bin/lib/launcher-session-proxy.cjs:649-663`]. Result: daemon recycle can duplicate secondary index rows for `memory_save`, violating mutation replay idempotency and risking retrieval/index skew after backend recycle.

### P2, Suggestion
No P2 findings.

## Claim Adjudication Packets
```json
{
  "findingId": "F001",
  "claim": "The documented tcp IPC override is unusable for mk-spec-memory because launcher-side clients preserve tcp:// while the backend server resolves the same env value as a filesystem directory and appends daemon-ipc.sock.",
  "evidenceRefs": [
    ".opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md:180",
    ".opencode/bin/spec-memory.cjs:107-108",
    ".opencode/bin/lib/launcher-ipc-bridge.cjs:80-87",
    ".opencode/skills/system-spec-kit/mcp_server/context-server.ts:2319-2320",
    ".opencode/skills/system-spec-kit/shared/ipc/socket-server.ts:201-212"
  ],
  "counterevidenceSought": "Checked the CLI shim, launcher bridge getIpcSocketPath, backend context-server startIpcSocketServer call, and shared resolveIpcSocketPath implementation for a tcp:// preservation branch on the server side; none was present in the bind path.",
  "alternativeExplanation": "The env row may be intended only for launcher client probing, but ENV_REFERENCE names mcp_server/lib/ipc/socket-server.ts as an owner of the same tcp-support contract, so the server-side mismatch remains a shipped contract drift.",
  "finalSeverity": "P1",
  "confidence": 0.9,
  "downgradeTrigger": "Downgrade if another startup layer transforms SPECKIT_IPC_SOCKET_DIR before context-server.ts:2319 so resolveIpcSocketPath receives a real tcp:// endpoint or if the env contract is narrowed to disallow tcp for mk-spec-memory IPC.",
  "transitions": [
    { "iteration": 1, "from": null, "to": "P1", "reason": "Initial discovery" }
  ]
}
```

```json
{
  "findingId": "F002",
  "claim": "The session proxy can replay memory_save after backend recycle even though the code documents that this replay can duplicate secondary-index rows.",
  "evidenceRefs": [
    ".opencode/bin/lib/launcher-session-proxy.cjs:33-47",
    ".opencode/bin/lib/launcher-session-proxy.cjs:146-153",
    ".opencode/bin/lib/launcher-session-proxy.cjs:649-663"
  ],
  "counterevidenceSought": "Checked the replay classifier and replaySnapshot path for an exclusion of memory_save or a request-id/idempotency token before replay; the classifier keeps memory_save replayable and the code comment states the token is not threaded into the save handler.",
  "alternativeExplanation": "Primary-row content-hash dedup may make the main memory row safe, but the comment explicitly separates that from the secondary-index duplicate gap, so this is still a required fix for replay safety.",
  "finalSeverity": "P1",
  "confidence": 0.88,
  "downgradeTrigger": "Downgrade if memory_save is removed from the replayable set or a request idempotency token is persisted through all secondary-index writes with regression coverage for commit-then-die replay.",
  "transitions": [
    { "iteration": 1, "from": null, "to": "P1", "reason": "Initial discovery" }
  ]
}
```

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
| --- | --- | --- | --- | --- |
| spec_code | partial | hard | `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/006-deep-review-017-021-remediation/review-r2/scopes/C-rest-of-server/spec.md:6-14` | Scope mapped to server/daemon files; two P1 issues found. |
| checklist_evidence | pass | hard | `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/006-deep-review-017-021-remediation/review-r2/scopes/C-rest-of-server/spec.md:1-17` | No checklist exists in the scope packet. |

## Assessment
- New findings ratio: 1.00
- Dimensions addressed: correctness, security, traceability
- Novelty justification: F001 is an IPC transport contract drift; F002 is a mutation replay idempotency gap. They are independent root causes.
- Verdict basis: P1 findings present and no P0 findings found, so iteration verdict is CONDITIONAL.

## Ruled Out
- UDS socket hijack via symlink/foreign-owned directory: shared socket server checks owner/mode/symlink before binding or reclaiming, and the CLI connection path refuses symlinked or foreign/writable socket directories.
- Local provider implementation bug in `mcp_server/lib/providers/embeddings.ts`: this file is only an explicit re-export surface; canonical provider logic lives in shared embeddings.

## Dead Ends
- Code graph structural query: stale readiness made it unsuitable as evidence for this audit.

## Recommended Next Focus
Fix F001 and F002, then rerun with at least one pass over maintainability and broader request-handler validation.
Review verdict: CONDITIONAL
