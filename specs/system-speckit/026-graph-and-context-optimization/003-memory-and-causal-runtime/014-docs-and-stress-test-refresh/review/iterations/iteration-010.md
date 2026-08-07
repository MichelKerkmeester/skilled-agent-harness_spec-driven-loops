# Iteration 010

## Dimension

Traceability - README cluster: `README.md`, `mcp_server/README.md`, and `mcp_server/ENV_REFERENCE.md` against source anchors for `serverInfo` 1.8.0, `TOOL_DEFINITIONS.length`, `SPECKIT_BACKEND_ONLY`, error codes, and schema v28-v30.

## Files Reviewed

- `.opencode/skills/sk-code-review/references/review_core.md:18` - severity doctrine loaded before classification.
- `.opencode/skills/system-spec-kit/README.md:45` - 36-tool summary claim.
- `.opencode/skills/system-spec-kit/README.md:363` - schema v28-v30 narrative.
- `.opencode/skills/system-spec-kit/README.md:377` - front-proxy replay wording.
- `.opencode/skills/system-spec-kit/README.md:650` - `SPECKIT_BACKEND_ONLY` row.
- `.opencode/skills/system-spec-kit/mcp_server/README.md:168` - schema v28-v30 source summary.
- `.opencode/skills/system-spec-kit/mcp_server/README.md:254` - front-proxy replay/error-code row.
- `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md:151` - `SPECKIT_BACKEND_ONLY` row.
- `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:670` - canonical tool registry.
- `.opencode/skills/system-spec-kit/mcp_server/context-server.ts:1014` - serverInfo version `1.8.0`.
- `.opencode/skills/system-spec-kit/mcp_server/context-server.ts:2126` - `SPECKIT_BACKEND_ONLY` guard.
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:438` - `SCHEMA_VERSION = 30`.
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1336` - migration v28.
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1367` - migration v29.
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1385` - migration v30.
- `.opencode/bin/lib/launcher-session-proxy.cjs:18` - `RETRYABLE_RECYCLE_ERROR`.
- `.opencode/bin/lib/launcher-session-proxy.cjs:23` - `PROTOCOL_MISMATCH_ERROR`.
- `.opencode/bin/lib/launcher-session-proxy.cjs:28` - replayable tool allow-list.
- `.opencode/bin/lib/launcher-session-proxy.cjs:113` - replay classification.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/014-docs-and-stress-test-refresh/review/deep-review-findings-registry.json:40` - prior serverInfo finding, not re-reported.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/014-docs-and-stress-test-refresh/review/deep-review-findings-registry.json:69` - prior tool-count finding, not re-reported.

## Findings by Severity

### P0

None.

### P1

#### R10-P1-001 [P1] README proxy replay boundary is mislabeled as read-only

- File: `.opencode/skills/system-spec-kit/mcp_server/README.md:254`
- Claim: The README cluster tells operators that the front-proxy transparently replays read-only tools across a recycle.
- Evidence: `mcp_server/README.md:254` says the proxy "transparently replays read-only tools". The skill README repeats the same boundary at `README.md:377` with "Read-only replayable tools". Source contradicts that boundary: `launcher-session-proxy.cjs:28-42` includes `memory_save` in `REPLAYABLE_TOOL_NAMES`, and `launcher-session-proxy.cjs:113-126` returns replayable for allow-listed tools while explicitly noting `memory_save` idempotency remains a known follow-up.
- Counterevidence sought: Checked the two README surfaces in the assigned cluster and the proxy allow-list/classifier. No README caveat names `memory_save` or says the replay boundary includes non-read mutating calls.
- Alternative explanation: `memory_save` may be intended to be safe or idempotent enough for replay, and the source excludes more destructive tools via `UNSAFE_TOOL_NAMES`. That still does not make it read-only, and the source comment calls secondary-index idempotency a known follow-up.
- Final severity: P1.
- Confidence: 0.88.
- Downgrade trigger: Downgrade to P2 if maintainers define `memory_save` replay as read-only-equivalent in the operator docs, or if the source allow-list removes `memory_save` so the README boundary becomes literally true.
- Finding class: cross-consumer.
- Scope proof: Exact search plus direct reads found read-only replay wording in both README surfaces and a non-read replayable `memory_save` entry in the shared proxy source.
- Affected surface hints: front-proxy operator docs, `memory_save` replay, recycle safety model.
- Recommendation: Replace "read-only" with "replayable/idempotent" wording and explicitly mention `memory_save`, or remove `memory_save` from `REPLAYABLE_TOOL_NAMES` if the intended contract is truly read-only replay.

### P2

None.

## Traceability Checks

- `serverInfo` version: Source is `1.8.0` at `context-server.ts:1014`. The assigned README cluster did not introduce a new `1.7.2` citation. Prior stale spec-doc citation remains covered by `R3-P1-001` and was not re-reported.
- Tool count: The assigned README cluster uses `36` for the mk-spec-memory server at `README.md:45`, `README.md:256`, `README.md:581`, `README.md:1001`, and `README.md:1036`. `TOOL_DEFINITIONS` lists 36 registrations from `tool-schemas.ts:670-716`. Prior non-README count drift remains covered by `R3-P1-002` and was not re-reported.
- `SPECKIT_BACKEND_ONLY`: README and ENV rows point to the server boot guard, and source uses `process.env.SPECKIT_BACKEND_ONLY === '1'` before connecting stdio at `context-server.ts:2126-2131`.
- Error codes: README cluster describes `E429`, live `-32001`, and non-retryable `-32002`. Source has `RETRYABLE_RECYCLE_ERROR` code `-32001` at `launcher-session-proxy.cjs:18-22` and `PROTOCOL_MISMATCH_ERROR` code `-32002` at `launcher-session-proxy.cjs:23-27`, with terminal `CLOSED` handling at `launcher-session-proxy.cjs:607-621`.
- Schema v28-v30: README cluster names v28, v29, and v30. Source confirms `SCHEMA_VERSION = 30` at `vector-index-schema.ts:438`, migration v28 at `:1336`, migration v29 at `:1367`, and migration v30 at `:1385`.
- New replay-boundary drift: The source replay allow-list includes a mutation (`memory_save`) while both README surfaces call replay read-only. Recorded as `R10-P1-001`.

## Verdict

CONDITIONAL. One new P1 traceability finding was identified in the assigned README-cluster slice. No new P0 or P2 findings were found.

## Next Dimension

Continue traceability only if the orchestrator wants a follow-up pass on metadata outside the assigned README cluster, such as package descriptions or catalog counts. Do not re-open the already-recorded serverInfo/tool-count findings unless remediation changes their evidence.
Review verdict: CONDITIONAL
