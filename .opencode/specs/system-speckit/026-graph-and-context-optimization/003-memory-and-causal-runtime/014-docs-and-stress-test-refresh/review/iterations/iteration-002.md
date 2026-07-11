# Deep Review Iteration 002

## Dimension

Security

## Files Reviewed

- `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/checkpoint-v2-contention-stress.vitest.ts:12`
- `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/checkpoint-v2-contention-stress.vitest.ts:135`
- `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/checkpoint-v2-contention-stress.vitest.ts:202`
- `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/daemon-recycle-transparency-stress.vitest.ts:18`
- `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/daemon-recycle-transparency-stress.vitest.ts:60`
- `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/daemon-recycle-transparency-stress.vitest.ts:162`
- `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/enrichment-marker-backfill-stress.vitest.ts:13`
- `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/enrichment-marker-backfill-stress.vitest.ts:67`
- `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/index-scan-coalescing-stress.vitest.ts:14`
- `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/index-scan-coalescing-stress.vitest.ts:29`
- `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/README.md:15`
- `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/README.md:43`
- `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md:147`
- `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md:154`
- `.opencode/skills/system-spec-kit/mcp_server/README.md:42`
- `.opencode/skills/system-spec-kit/mcp_server/README.md:254`
- `.opencode/skills/system-spec-kit/README.md:55`
- `.opencode/skills/system-spec-kit/manual_testing_playbook/lifecycle/checkpoint-v2-file-snapshot-roundtrip.md:14`
- `.opencode/skills/system-spec-kit/manual_testing_playbook/pipeline-architecture/front-proxy-reconnect-and-backend-only.md:12`
- `.opencode/skills/system-spec-kit/mcp_server/context-server.ts:2126`
- `.opencode/bin/lib/launcher-session-proxy.cjs:18`
- `.opencode/bin/lib/launcher-session-proxy.cjs:43`
- `.opencode/bin/lib/launcher-session-proxy.cjs:595`
- `.opencode/bin/lib/launcher-session-proxy.cjs:607`
- `.opencode/skills/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:2185`
- `.opencode/skills/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:2535`

## Findings by Severity

### P0

- None.

### P1

- None.

### P2

- None.

## Traceability Checks

- `secret_or_credential_disclosure`: PASS. The reviewed docs describe API keys as opt-in operator-provided environment inputs and local-first defaults, not literal credentials. Heap snapshot docs warn that snapshots can contain sensitive memory and document restrictive modes. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/README.md:42`] [SOURCE: `.opencode/skills/system-spec-kit/README.md:55`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md:148`]
- `production_db_or_socket_access_in_stress`: PASS. The stress tests use `mkdtemp` or `:memory:` databases and pure proxy helpers; the durability README explicitly states the domain never touches the production DB or live daemon socket. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/checkpoint-v2-contention-stress.vitest.ts:12`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/enrichment-marker-backfill-stress.vitest.ts:13`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/index-scan-coalescing-stress.vitest.ts:14`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/daemon-recycle-transparency-stress.vitest.ts:18`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/README.md:43`]
- `unsafe_destructive_restore_guidance`: PASS. The checkpoint-v2 playbook marks restore testing sandbox-only and requires a disposable scratch copy; the implementation path uses restore barriers, manifest/schema/embedder guards, and a two-phase journal before file swap. [SOURCE: `.opencode/skills/system-spec-kit/manual_testing_playbook/lifecycle/checkpoint-v2-file-snapshot-roundtrip.md:14`] [SOURCE: `.opencode/skills/system-spec-kit/manual_testing_playbook/lifecycle/checkpoint-v2-file-snapshot-roundtrip.md:71`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:2535`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:2600`]
- `unsafe_mutation_replay`: PASS for security scope. The proxy keeps destructive tool names in the unsafe set and emits the retryable recycle error for non-replayable pending requests instead of replaying them. The existing correctness finding `R1-P1-001` still covers the stress test model-vs-production gap, but no additional security-severity finding was supported in this pass. [SOURCE: `.opencode/bin/lib/launcher-session-proxy.cjs:43`] [SOURCE: `.opencode/bin/lib/launcher-session-proxy.cjs:113`] [SOURCE: `.opencode/bin/lib/launcher-session-proxy.cjs:595`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/daemon-recycle-transparency-stress.vitest.ts:162`]
- `protocol_mismatch_fail_open`: PASS. The proxy records the negotiated protocol version and transitions to terminal `CLOSED` with `-32002` on version drift rather than retrying a mismatched backend. [SOURCE: `.opencode/bin/lib/launcher-session-proxy.cjs:23`] [SOURCE: `.opencode/bin/lib/launcher-session-proxy.cjs:607`] [SOURCE: `.opencode/skills/system-spec-kit/manual_testing_playbook/pipeline-architecture/front-proxy-reconnect-and-backend-only.md:99`]
- `backend_only_transport_bypass`: PASS. `SPECKIT_BACKEND_ONLY=1` skips stdio connection and still starts the IPC socket path, matching the documented backend-mode boundary. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/context-server.ts:2126`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/context-server.ts:2141`] [SOURCE: `.opencode/skills/system-spec-kit/manual_testing_playbook/pipeline-architecture/front-proxy-reconnect-and-backend-only.md:68`]
- Code graph: BLOCKED for structural graph traversal because `code_graph_status` reported stale readiness. This iteration used graphless fallback with direct reads and exact searches.

## Verdict

PASS for the security dimension: no new P0/P1/P2 security findings were found. Overall review remains CONDITIONAL because prior correctness finding `R1-P1-001` is still active.

## Next Dimension

Traceability.
Review verdict: PASS
