# Deep Review Iteration 007

## Dimension

Traceability pass 2: doc-vs-source on serverInfo `1.8.0`, exact tool count versus `TOOL_DEFINITIONS.length`, schema v28-v30, error codes, feature catalog, and playbook claims.

## Files Reviewed

- `.opencode/skills/sk-code-review/references/review_core.md:18` severity doctrine.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/014-docs-and-stress-test-refresh/review/deep-review-config.json:104` scope manifest.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/014-docs-and-stress-test-refresh/review/deep-review-strategy.md:16` traceability guardrails.
- `.opencode/skills/system-spec-kit/mcp_server/context-server.ts:1014` serverInfo `1.8.0` source.
- `.opencode/skills/system-spec-kit/mcp_server/context-server.ts:2126` `SPECKIT_BACKEND_ONLY` source guard.
- `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:670` through `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:716` `TOOL_DEFINITIONS`; count script returned `36`.
- `.opencode/skills/system-spec-kit/README.md:45` root README `36-tool` claim.
- `.opencode/skills/system-spec-kit/feature_catalog/feature_catalog.md:48` and `.opencode/skills/system-spec-kit/feature_catalog/feature_catalog.md:60` catalog `55` / `54` claims.
- `.opencode/skills/system-spec-kit/feature_catalog/08--bug-fixes-and-data-integrity/schema-version-history-v28-v30.md:18` and `.opencode/skills/system-spec-kit/feature_catalog/08--bug-fixes-and-data-integrity/schema-version-history-v28-v30.md:30` through `.opencode/skills/system-spec-kit/feature_catalog/08--bug-fixes-and-data-integrity/schema-version-history-v28-v30.md:32` schema claims.
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:438`, `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1350`, `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1375`, `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1394`, and `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1430` schema source anchors.
- `.opencode/skills/system-spec-kit/feature_catalog/08--bug-fixes-and-data-integrity/error-code-reference.md:31`, `.opencode/skills/system-spec-kit/feature_catalog/08--bug-fixes-and-data-integrity/error-code-reference.md:32`, `.opencode/bin/lib/launcher-session-proxy.cjs:18`, `.opencode/bin/lib/launcher-session-proxy.cjs:23`, and `.opencode/bin/lib/launcher-session-proxy.cjs:617` error-code docs and source.
- `.opencode/skills/system-spec-kit/manual_testing_playbook/14--pipeline-architecture/front-proxy-reconnect-and-backend-only.md:14`, `.opencode/skills/system-spec-kit/manual_testing_playbook/14--pipeline-architecture/front-proxy-reconnect-and-backend-only.md:141`, and `.opencode/skills/system-spec-kit/mcp_server/context-server.ts:2126` playbook source trace.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/014-docs-and-stress-test-refresh/002-feature-catalog-update/implementation-summary.md:109` and `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/014-docs-and-stress-test-refresh/003-readme-cluster-update/implementation-summary.md:72` prior serverInfo drift evidence.

## Findings by Severity

### P0

No new P0 findings.

### P1

No new P1 findings emitted in this iteration.

Existing active P1s were revalidated and deduped rather than duplicated:

- `R3-P1-001`: serverInfo source is `1.8.0`, but child packet evidence still cites `1.7.2`. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/context-server.ts:1014`] [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/014-docs-and-stress-test-refresh/002-feature-catalog-update/implementation-summary.md:109`] [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/014-docs-and-stress-test-refresh/003-readme-cluster-update/implementation-summary.md:72`]
- `R3-P1-002`: `TOOL_DEFINITIONS.length` is `36`; root README matches `36`, but the feature catalog still claims `55` and `54` for the same canonical source. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:670`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:716`] [SOURCE: `.opencode/skills/system-spec-kit/feature_catalog/feature_catalog.md:48`] [SOURCE: `.opencode/skills/system-spec-kit/feature_catalog/feature_catalog.md:60`]

### P2

No new P2 findings.

## Traceability Checks

- `serverInfo_1_8_0`: DEDUPED EXISTING P1. Covered by `R3-P1-001`.
- `tool_count_vs_TOOL_DEFINITIONS`: DEDUPED EXISTING P1. Covered by `R3-P1-002`.
- `schema_v28_v30`: PASS. The schema doc matches `SCHEMA_VERSION = 30`, v28 active logical-key index, v29 checkpoint snapshot columns, and v30 enrichment marker columns/index source anchors.
- `error_codes_front_proxy`: PASS. `-32001` remains retryable/live and `-32002` remains non-retryable fail-closed in docs and source.
- `playbook_capability_EX_040`: PASS for source-traceability. EX-040 source metadata maps to the live proxy constants and backend-only guard.

## Search Depth

- Scope class: complex; enforcement strict.
- Discovery methods: prior state review, direct reads, exact searches, and a read-only registry-count script.
- Graph status: unavailable for this pass; graphless fallback used direct reads and exact searches.
- Omitted high-risk targets: full 73-file line-by-line catalog/playbook sweep and full 013 changelog replay remain outside this iteration's tool budget.

## SCOPE VIOLATIONS

None.

## Verdict

PASS for this iteration. The loop remains globally conditional while active prior P1s remain unresolved.

## Next Dimension

All configured dimensions are covered. If the loop continues, the useful remaining traceability work is a narrow full-013 changelog replay or lower-risk catalog/playbook sweep; otherwise proceed toward convergence/synthesis.

Review verdict: PASS
