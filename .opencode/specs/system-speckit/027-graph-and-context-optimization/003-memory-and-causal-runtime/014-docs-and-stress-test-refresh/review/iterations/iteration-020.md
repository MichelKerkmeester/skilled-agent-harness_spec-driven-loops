# Iteration 020

## Dimension

Traceability final completeness sweep: enumerate unanchored doc claims, shipped source behavior not documented in the assigned slice, and confirm `-32001` live / `-32002` fail-closed framing.

## Files Reviewed

- `.opencode/skills/sk-code-review/references/review_core.md:18`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/014-docs-and-stress-test-refresh/review/deep-review-config.json:104`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/014-docs-and-stress-test-refresh/review/deep-review-findings-registry.json:98`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/014-docs-and-stress-test-refresh/review/deep-review-findings-registry.json:127`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/014-docs-and-stress-test-refresh/review/deep-review-findings-registry.json:329`
- `.opencode/skills/system-spec-kit/feature_catalog/bug-fixes-and-data-integrity/error-code-reference.md:30`
- `.opencode/skills/system-spec-kit/feature_catalog/bug-fixes-and-data-integrity/error-code-reference.md:42`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:355`
- `.opencode/skills/system-spec-kit/mcp_server/lib/errors/core.ts:101`
- `.opencode/skills/system-spec-kit/README.md:383`
- `.opencode/bin/lib/launcher-session-proxy.cjs:18`
- `.opencode/bin/lib/launcher-session-proxy.cjs:23`
- `.opencode/bin/lib/launcher-session-proxy.cjs:607`
- `.opencode/skills/system-spec-kit/feature_catalog/bug-fixes-and-data-integrity/error-code-reference.md:31`
- `.opencode/skills/system-spec-kit/feature_catalog/bug-fixes-and-data-integrity/error-code-reference.md:32`
- `.opencode/skills/system-spec-kit/mcp_server/README.md:254`
- `.opencode/skills/system-spec-kit/mcp_server/README.md:255`
- `.opencode/skills/system-spec-kit/README.md:384`
- `.opencode/skills/system-spec-kit/README.md:385`
- `.opencode/skills/system-spec-kit/manual_testing_playbook/pipeline-architecture/front-proxy-reconnect-and-backend-only.md:14`
- `.opencode/skills/system-spec-kit/manual_testing_playbook/pipeline-architecture/front-proxy-reconnect-and-backend-only.md:15`
- `.opencode/skills/system-spec-kit/mcp_server/context-server.ts:1014`
- `.opencode/skills/system-spec-kit/mcp_server/package.json:3`
- `.opencode/skills/system-spec-kit/mcp_server/context-server.ts:2126`
- `.opencode/skills/system-spec-kit/manual_testing_playbook/pipeline-architecture/front-proxy-reconnect-and-backend-only.md:17`
- `.opencode/skills/system-spec-kit/feature_catalog/feature_catalog.md:48`
- `.opencode/skills/system-spec-kit/feature_catalog/feature_catalog.md:60`

## Findings By Severity

### P0

None.

### P1

#### R20-P1-001 [P1] Error-code catalog still documents active `E429` scan-rate-limit rejections after coalesced success replaced them

- File: `.opencode/skills/system-spec-kit/feature_catalog/bug-fixes-and-data-integrity/error-code-reference.md:30`
- Claim: The refreshed error-code reference says `E429` is the `memory_index_scan` lease/cooldown rejection, carries `lease_active` or `cooldown`, and should be retried after the returned wait.
- Evidence: The live `memory_index_scan` handler treats `!lease.acquired` as a successful coalesced response, returning `createMCPSuccessResponse` with `success: true`, `coalesced: true`, `status: 'coalesced'`, `reason: lease.reason`, and wait metadata. The root README already frames `E429` as legacy for routine overlapping scans. [SOURCE: `.opencode/skills/system-spec-kit/feature_catalog/bug-fixes-and-data-integrity/error-code-reference.md:30`] [SOURCE: `.opencode/skills/system-spec-kit/feature_catalog/bug-fixes-and-data-integrity/error-code-reference.md:42`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:355`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:359`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:363`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:365`] [SOURCE: `.opencode/skills/system-spec-kit/README.md:383`]
- Counterevidence sought: `ErrorCodes.RATE_LIMITED` still exists as a legacy code, but the reviewed handler path for `memory_index_scan` lease/cooldown does not emit it. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/errors/core.ts:101`]
- Alternative explanation: The catalog could be describing the historical code registry rather than current `memory_index_scan` behavior, but the wording explicitly says the scan rejection carries `lease_active` or `cooldown` and is retryable after the wait, which is now the coalesced success envelope.
- Finding class: matrix/evidence
- Scope proof: Exact search for `RATE_LIMITED`, `coalesced`, `lease_active`, and `cooldown` found the active scan handler branch and the root README's legacy framing; no source read in this pass showed `memory_index_scan` returning an `E429` error for that branch.
- Affected surface hints: error-code reference, feature catalog, operator retry guidance, memory_index_scan docs
- Recommendation: Update the error-code catalog and aggregate catalog wording so `E429` remains a legacy/registered code where appropriate, while routine `memory_index_scan` lease/cooldown behavior is documented as a `coalesced: true` success response.
- Final severity: P1
- Confidence: 0.88
- Downgrade trigger: Downgrade to P2 only if another in-scope live `memory_index_scan` branch is shown to emit `E429` for lease/cooldown in the current implementation.

### P2

None.

## Traceability Checks

- `spec_code`: Fail for the new `E429` doc/source mismatch above. `memory_index_scan` source returns coalesced success for lease/cooldown, while the refreshed error-code reference describes an active `E429` rejection.
- `checklist_evidence`: Existing serverInfo and tool-count traceability failures remain deduped under `R3-P1-001` and `R3-P1-002`; this iteration did not re-report them.
- `skill_agent`: Pass for `-32001` / `-32002` framing. Source defines `RETRYABLE_RECYCLE_ERROR` as `-32001` with `retryable: true`; source defines `PROTOCOL_MISMATCH_ERROR` as `-32002` with `retryable: false`; source transitions protocol drift to terminal `CLOSED`; refreshed README, MCP README, feature catalog, and playbook wording match.
- `agent_cross_runtime`: Pass for backend-only documentation in the assigned slice. Source gates stdio transport on `SPECKIT_BACKEND_ONLY === '1'`, and the playbook describes the same backend-only mode.
- `feature_catalog_code`: Fail for `E429` in `error-code-reference.md`; pass for `-32001` live and `-32002` fail-closed semantics.
- `playbook_capability`: Pass for EX-040 front-proxy framing. The playbook distinguishes transparent retryable recycle from protocol mismatch fail-closed behavior and cites the matching source anchors.
- Graph status: stale. Structural graph was not trusted for relationship expansion; this pass used graphless fallback with exact search plus direct reads.

## Verdict

CONDITIONAL for this iteration because one new P1 traceability finding was found. Overall session remains conditional with prior active P1/P2 findings still owned by the registry.

## Next Dimension

Final sweep complete. The orchestrator should merge this delta, keep existing active findings deduped, and include `R20-P1-001` in synthesis/remediation.
Review verdict: CONDITIONAL
