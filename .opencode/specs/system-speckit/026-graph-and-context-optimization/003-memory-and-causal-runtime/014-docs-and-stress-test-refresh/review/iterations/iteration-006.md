## Dimension

Security pass 2: stress isolation boundaries, secret/credential leakage in docs, and operator-recovery safety claims.

## Files Reviewed

- `.opencode/skills/sk-code-review/references/review_core.md:18` -- severity doctrine loaded before final calls.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/014-docs-and-stress-test-refresh/review/deep-review-config.json:104` -- review scope manifest.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/014-docs-and-stress-test-refresh/review/deep-review-findings-registry.json:154` -- prior security pass and active registry checked for duplicate avoidance.
- `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/checkpoint-v2-contention-stress.vitest.ts:12` -- temp database isolation boundary.
- `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/checkpoint-v2-contention-stress.vitest.ts:143` -- temp tree cleanup.
- `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/checkpoint-v2-contention-stress.vitest.ts:202` -- restore barrier stress assertion.
- `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/daemon-recycle-transparency-stress.vitest.ts:18` -- pure proxy-helper isolation boundary.
- `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/daemon-recycle-transparency-stress.vitest.ts:43` -- proxy testing export only; no live daemon socket.
- `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/daemon-recycle-transparency-stress.vitest.ts:162` -- replay partition checks read vs unsafe tool classification.
- `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/enrichment-marker-backfill-stress.vitest.ts:13` -- in-memory DB and mocked enrichment runtime.
- `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/index-scan-coalescing-stress.vitest.ts:14` -- in-memory DB injected into `db-state`.
- `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/README.md:15` -- domain-level no production DB/socket claim.
- `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/README.md:43` -- isolation boundary operator-safety claim.
- `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md:148` -- heap snapshot sensitivity warning and file modes.
- `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md:154` -- IPC socket directory perimeter hardening.
- `.opencode/skills/system-spec-kit/mcp_server/README.md:42` -- embedding provider cascade documents env var names, not values.
- `.opencode/skills/system-spec-kit/mcp_server/README.md:254` -- front-proxy recycle lifecycle guardrail.
- `.opencode/skills/system-spec-kit/README.md:55` -- local-first embedding guidance with API key names only.
- `.opencode/skills/system-spec-kit/README.md:89` -- example JSON mentions password validation text, not a credential value.
- `.opencode/skills/system-spec-kit/manual_testing_playbook/lifecycle/checkpoint-v2-file-snapshot-roundtrip.md:14` -- sandbox-only restore guidance.
- `.opencode/skills/system-spec-kit/manual_testing_playbook/lifecycle/checkpoint-v2-file-snapshot-roundtrip.md:71` -- scratch-copy restore command guidance.
- `.opencode/skills/system-spec-kit/manual_testing_playbook/pipeline-architecture/front-proxy-reconnect-and-backend-only.md:14` -- `-32001` retryable recycle guidance.
- `.opencode/skills/system-spec-kit/manual_testing_playbook/pipeline-architecture/front-proxy-reconnect-and-backend-only.md:102` -- `-32002` fail-closed guidance.
- `.opencode/skills/system-spec-kit/feature_catalog/lifecycle/checkpoint-creation-checkpointcreate.md:40` -- v2 snapshot creation mechanics.
- `.opencode/skills/system-spec-kit/feature_catalog/lifecycle/checkpoint-creation-checkpointcreate.md:42` -- sanitized checkpoint names and dir-aware cleanup claim.
- `.opencode/skills/system-spec-kit/feature_catalog/lifecycle/checkpoint-restore-checkpointrestore.md:42` -- restore barrier claim.
- `.opencode/skills/system-spec-kit/feature_catalog/lifecycle/checkpoint-restore-checkpointrestore.md:50` -- close/swap/reopen restore coordinator claim.
- `.opencode/skills/system-spec-kit/feature_catalog/lifecycle/checkpoint-restore-checkpointrestore.md:52` -- two-phase journal claim.
- `.opencode/skills/system-spec-kit/feature_catalog/lifecycle/checkpoint-restore-checkpointrestore.md:54` -- manifest guard and sentinel claim.
- `.opencode/skills/system-spec-kit/feature_catalog/bug-fixes-and-data-integrity/error-code-reference.md:28` -- retry semantics table.
- `.opencode/skills/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:2535` -- restore barrier acquired before v2 restore mutation.
- `.opencode/skills/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:2639` -- journal advanced to `swap-done` after snapshot files are in place.
- `.opencode/skills/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:2730` -- restore barrier released in `finally`.
- `.opencode/skills/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:561` -- `getRestoreBarrierStatus()` returns the active barrier code only during restore.
- `.opencode/bin/lib/launcher-session-proxy.cjs:18` -- retryable recycle code.
- `.opencode/bin/lib/launcher-session-proxy.cjs:43` -- unsafe tool set includes destructive tools.
- `.opencode/bin/lib/launcher-session-proxy.cjs:595` -- replay snapshot refuses non-replayable pending requests.
- `.opencode/bin/lib/launcher-session-proxy.cjs:607` -- protocol mismatch fails closed on re-handshake drift.

## Findings by Severity

### P0

None.

### P1

None.

### P2

None.

## Traceability Checks

- `stress_isolation_boundary`: PASS. The stress files use `mkdtemp` or `:memory:` databases, mocked/pure helpers, and temp cleanup; the domain README's no-production-DB/no-live-socket statement matches those anchors. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/checkpoint-v2-contention-stress.vitest.ts:12`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/enrichment-marker-backfill-stress.vitest.ts:13`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/index-scan-coalescing-stress.vitest.ts:14`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/daemon-recycle-transparency-stress.vitest.ts:18`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/README.md:43`]
- `secret_or_credential_disclosure`: PASS. Exact credential-pattern searches over the 014 packet docs, feature-catalog docs, and playbook docs returned no files; sampled API-key mentions are environment variable names and local-first fallback prose, not values. Heap snapshots are explicitly documented as sensitive and mode-restricted. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/README.md:42`] [SOURCE: `.opencode/skills/system-spec-kit/README.md:55`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md:148`]
- `operator_restore_safety_claims`: PASS. The operator playbook says restore validation is sandbox-only and scratch-copy based, while source restore takes a maintenance barrier, validates schema/embedder compatibility, journals `swap-pending` to `swap-done`, and releases the barrier in `finally`. [SOURCE: `.opencode/skills/system-spec-kit/manual_testing_playbook/lifecycle/checkpoint-v2-file-snapshot-roundtrip.md:14`] [SOURCE: `.opencode/skills/system-spec-kit/manual_testing_playbook/lifecycle/checkpoint-v2-file-snapshot-roundtrip.md:71`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:2535`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:2639`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:2730`]
- `front_proxy_recovery_safety`: PASS. The proxy keeps unsafe mutations out of the replay set and fails protocol-version drift closed with `-32002`; docs match those source semantics. [SOURCE: `.opencode/bin/lib/launcher-session-proxy.cjs:18`] [SOURCE: `.opencode/bin/lib/launcher-session-proxy.cjs:43`] [SOURCE: `.opencode/bin/lib/launcher-session-proxy.cjs:595`] [SOURCE: `.opencode/bin/lib/launcher-session-proxy.cjs:607`] [SOURCE: `.opencode/skills/system-spec-kit/manual_testing_playbook/pipeline-architecture/front-proxy-reconnect-and-backend-only.md:102`]
- `code_graph`: BLOCKED. `code_graph_status` reports stale readiness because git HEAD changed and stale-file/deleted-file thresholds were exceeded; this pass used graphless fallback through direct reads and exact searches.

## Verdict

PASS for this iteration. No new P0/P1/P2 findings were supported. The overall review loop remains CONDITIONAL because prior active P1 findings remain open in the registry.

## SCOPE VIOLATIONS

None.

## Next Dimension

All configured dimensions have coverage. Recommended next loop action is reducer-driven stabilization/synthesis planning, with attention on the existing open P1s rather than re-emitting security duplicates.

Review verdict: PASS
