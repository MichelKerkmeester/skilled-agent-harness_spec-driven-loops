# Iteration 019 - Security Sweep

## Dimension

Security sweep across the full declared embedding-stack scope: secret and credential leakage in logs/errors, path traversal, env precedence/injection, sandbox boundaries, TCP/loopback exposure, and unauthenticated surfaces.

## Files Reviewed

- `.opencode/bin/hf-model-server.cjs:81`
- `.opencode/bin/hf-model-server.cjs:146`
- `.opencode/bin/hf-model-server.cjs:629`
- `.opencode/bin/hf-model-server.cjs:688`
- `.opencode/bin/lib/model-server-supervision.cjs:431`
- `.opencode/bin/lib/model-server-supervision.cjs:461`
- `.opencode/bin/lib/model-server-supervision.cjs:1130`
- `.opencode/bin/lib/model-server-supervision.cjs:1260`
- `.opencode/bin/lib/launcher-ipc-bridge.cjs:58`
- `.opencode/bin/lib/launcher-ipc-bridge.cjs:79`
- `.opencode/bin/lib/launcher-ipc-bridge.cjs:331`
- `.opencode/bin/mk-skill-advisor-launcher.cjs:90`
- `.opencode/bin/mk-skill-advisor-launcher.cjs:150`
- `.opencode/bin/mk-skill-advisor-launcher.cjs:535`
- `.opencode/skills/system-spec-kit/shared/embeddings/providers/hf-local.ts:266`
- `.opencode/skills/system-spec-kit/shared/embeddings/providers/hf-local.ts:306`
- `.opencode/skills/system-spec-kit/shared/embeddings/providers/hf-local.ts:835`
- `.opencode/skills/system-spec-kit/shared/embeddings/factory.ts:923`
- `.opencode/skills/system-spec-kit/shared/embeddings/factory.ts:949`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/embedder-status.ts:55`
- `.opencode/skills/system-spec-kit/mcp_server/context-server.ts:1609`
- `.opencode/skills/system-spec-kit/mcp_server/context-server.ts:1665`
- `.opencode/skills/system-spec-kit/mcp_server/context-server.ts:1676`
- `.opencode/skills/system-spec-kit/mcp_server/context-server.ts:2051`
- `.opencode/skills/system-spec-kit/scripts/core/workflow.ts:411`
- `.opencode/skills/system-spec-kit/scripts/core/workflow.ts:481`

## Findings by Severity

### P0

No new P0 findings.

### P1

No new P1 findings.

Known active P1s were not re-reported as new. The sweep reconfirmed that model-server TCP exposure is already covered by `DR-002-P1-001`, and workflow fail-open locking is already covered by `DR-002-P1-002`.

### P2

No new P2 findings.

The direct binary socket-reclaim gap remains the existing P2 direct-startup-socket-unlink advisory, not a distinct new sandbox finding.

## Traceability Checks

- `spec_code`: partial. The security-relevant code paths still match the known open security findings rather than revealing a new class.
- `checklist_evidence`: partial. This pass did not inspect every packet checklist row; it focused on line-level adversarial security evidence in the declared code scope.
- `skill_agent`: not applicable for this iteration.
- `agent_cross_runtime`: not applicable for this iteration.
- `feature_catalog_code`: partial. The launcher/model-server env and TCP behavior is represented in code and tests; the unsafe model-server TCP perimeter remains the prior active finding.
- `playbook_capability`: not applicable for this iteration.

## Ruled Out Directions

- Secret leakage: provider validation and runtime errors log provider names, status/error messages, and retry text; no direct API key, token, or password value was found in the reviewed logging paths.
- New daemon-IPC TCP exposure: the bridge helper accepts `tcp://`, and tests exercise direct TCP sockets, but production `context-server` calls `resolveIpcSocketPath(DATABASE_DIR)` before `startIpcSocketServer`; that resolver path does not preserve `tcp://` from `SPECKIT_IPC_SOCKET_DIR`, so this was not promoted as a new unauthenticated production MCP surface.
- New model-server TCP finding: non-loopback unauthenticated model-server exposure remains valid, but it is already registered as `DR-002-P1-001`.
- Socket-dir sandbox/path traversal: the supervised model-server demand listener reasserts non-symlink/owner checks before mkdir/listen/reclaim. The weaker direct binary reclaim path is already tracked as P2 and did not gain new evidence for P1 escalation here.
- Env forwarding/injection: `mk-skill-advisor-launcher.cjs` uses an allowlist for child env forwarding and does not forward cloud API keys; the security-sensitive forwarded knobs are config selectors, not credentials.

## Scope Violations

None. The reviewed implementation files were read-only. This iteration wrote only its review narrative, state iteration record, and delta stream.

## Verdict

CONDITIONAL. No new security findings in iteration 019, but the review program still has active P1 findings from prior iterations.

## Next Dimension

Iteration 020 should be final convergence/synthesis: verify no state merge conflicts from parallel deltas, confirm active P1/P2 counts, and produce the remediation-ready final review summary.
