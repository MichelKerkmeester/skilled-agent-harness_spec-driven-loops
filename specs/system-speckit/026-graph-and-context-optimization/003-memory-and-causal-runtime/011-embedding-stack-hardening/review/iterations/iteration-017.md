# Deep Review Iteration 017

## Dimension
embedder-status handler + shared/types contract + bridge probe health field: status payload correctness, ProviderMetadata optionality, additive-field back-compat contracts.

## Files Reviewed
- .opencode/skills/system-spec-kit/mcp_server/handlers/embedder-status.ts:55
- .opencode/skills/system-spec-kit/mcp_server/handlers/embedder-status.ts:69
- .opencode/skills/system-spec-kit/mcp_server/handlers/embedder-status.ts:73
- .opencode/skills/system-spec-kit/shared/types.ts:70
- .opencode/skills/system-spec-kit/shared/types.ts:80
- .opencode/skills/system-spec-kit/shared/types.ts:81
- .opencode/skills/system-spec-kit/shared/embeddings/providers/hf-local.ts:655
- .opencode/skills/system-spec-kit/shared/embeddings/providers/hf-local.ts:678
- .opencode/skills/system-spec-kit/shared/embeddings/providers/hf-local.ts:684
- .opencode/skills/system-spec-kit/shared/embeddings/providers/hf-local.ts:962
- .opencode/bin/hf-model-server.cjs:569
- .opencode/bin/hf-model-server.cjs:619
- .opencode/bin/hf-model-server.cjs:621
- .opencode/bin/lib/launcher-ipc-bridge.cjs:244
- .opencode/bin/lib/launcher-ipc-bridge.cjs:280
- .opencode/bin/lib/model-server-supervision.cjs:1037
- .opencode/skills/system-spec-kit/mcp_server/tests/embedder-status.vitest.ts:30
- .opencode/skills/system-spec-kit/mcp_server/tests/embedders/hf-model-server.vitest.ts:181

## Findings by Severity

### P0
None.

### P1

#### DR-017-P1-001: embedder_status drops live model-server load timestamps because the shared metadata contract uses the wrong type
- File: .opencode/skills/system-spec-kit/shared/embeddings/providers/hf-local.ts:678
- Severity: P1
- Finding class: cross-consumer
- Evidence: The live model server writes loadStartedAt/loadProgressAt as Date.now() numbers and returns them directly from /api/health (.opencode/bin/hf-model-server.cjs:569, .opencode/bin/hf-model-server.cjs:619, .opencode/bin/hf-model-server.cjs:620). The bridge probe also treats those fields as numeric millisecond markers when deciding whether a loading server is wedged (.opencode/bin/lib/launcher-ipc-bridge.cjs:280, .opencode/bin/lib/launcher-ipc-bridge.cjs:286). But ProviderMetadata declares both fields as string|null (.opencode/skills/system-spec-kit/shared/types.ts:80, .opencode/skills/system-spec-kit/shared/types.ts:81), and HfLocalProvider.applyHealthMetadata only copies them when typeof payload.loadStartedAt/loadProgressAt is string (.opencode/skills/system-spec-kit/shared/embeddings/providers/hf-local.ts:678, .opencode/skills/system-spec-kit/shared/embeddings/providers/hf-local.ts:684). embedder_status then returns hfLocal.getMetadata() as modelServer (.opencode/skills/system-spec-kit/mcp_server/handlers/embedder-status.ts:69, .opencode/skills/system-spec-kit/mcp_server/handlers/embedder-status.ts:73), so the MCP status payload loses the live progress timestamps.
- Scope proof: rg over loadStartedAt/loadProgressAt shows the same fields are produced numerically by hf-model-server, consumed numerically by the bridge, and parsed/string-typed only in ProviderMetadata/HfLocalProvider. The embedder_status unit test masks the mismatch by mocking ISO strings (.opencode/skills/system-spec-kit/mcp_server/tests/embedder-status.vitest.ts:30), while the live model-server test asserts numbers (.opencode/skills/system-spec-kit/mcp_server/tests/embedders/hf-model-server.vitest.ts:181).
- Affected surface hints: ["embedder_status", "ProviderMetadata", "hf-local health parser", "hf-model-server health", "launcher bridge probe"]
- Recommendation: Canonicalize the health timestamp contract. Either type ProviderMetadata loadStartedAt/loadProgressAt as number|null and return numbers from embedder_status, or convert /api/health numeric timestamps into ISO strings in one layer. Add an integration-shaped test that feeds the real numeric health payload through HfLocalProvider.healthCheck() and asserts embedder_status preserves the fields.

Claim adjudication packet:
- Claim: The status path silently drops live model-server progress timestamps because producer/bridge use numeric milliseconds while ProviderMetadata/HfLocalProvider require strings.
- Evidence refs: .opencode/bin/hf-model-server.cjs:569, .opencode/bin/hf-model-server.cjs:619, .opencode/bin/hf-model-server.cjs:620, .opencode/bin/lib/launcher-ipc-bridge.cjs:280, .opencode/bin/lib/launcher-ipc-bridge.cjs:286, .opencode/skills/system-spec-kit/shared/types.ts:80, .opencode/skills/system-spec-kit/shared/types.ts:81, .opencode/skills/system-spec-kit/shared/embeddings/providers/hf-local.ts:678, .opencode/skills/system-spec-kit/shared/embeddings/providers/hf-local.ts:684, .opencode/skills/system-spec-kit/shared/embeddings/providers/hf-local.ts:973, .opencode/skills/system-spec-kit/mcp_server/handlers/embedder-status.ts:69, .opencode/skills/system-spec-kit/mcp_server/handlers/embedder-status.ts:73, .opencode/skills/system-spec-kit/mcp_server/tests/embedders/hf-model-server.vitest.ts:181, .opencode/skills/system-spec-kit/mcp_server/tests/embedder-status.vitest.ts:30
- Counterevidence sought: Checked whether the server emits ISO strings instead of numbers, whether the bridge treats strings as canonical, whether embedder_status bypasses HfLocalProvider metadata, and whether tests exercise the live server payload rather than a mocked provider. The server tests assert numbers, the bridge uses Number.isFinite on the fields, and embedder_status only returns HfLocalProvider.getMetadata after healthCheck.
- Alternative explanation: The strings in embedder-status.vitest could represent the intended public MCP shape, but that is not what the committed live model server emits, and no conversion layer exists between /api/health and ProviderMetadata.
- Final severity: P1
- Confidence: 0.88
- Downgrade trigger: Downgrade if loadStartedAt/loadProgressAt are explicitly non-contractual for embedder_status consumers, or if another layer not reviewed here converts the live numeric health payload into strings before HfLocalProvider.applyHealthMetadata runs.

### P2
None.

## Traceability Checks
- spec_code: partial. Reviewed committed handler/type/server/bridge code against the status payload contract implied by this iteration prompt.
- checklist_evidence: partial. Existing tests cover embedder_status and hf-model-server separately, but they encode conflicting timestamp shapes and miss the integration path.
- skill_agent: not_applicable.
- agent_cross_runtime: not_applicable.
- feature_catalog_code: partial. The additive bridge health fields were checked against idle-monitor consumers.
- playbook_capability: not_applicable.

## Ruled Out
- Provider misconfiguration crash path: collectEmbeddingsStatus catches getProviderInfo failures and keeps job status available.
- Additive bridge health back-compat: probeModelServer health is optional, and idle eviction returns when required fields are absent.
- General ProviderMetadata optionality: pre-initialization consumers reviewed here use ProviderMetadata | ProviderInfo or PartialProviderMetadata; no additional P1 found beyond timestamp type drift.

## SCOPE VIOLATIONS
None.

## Verdict
CONDITIONAL. One new P1 status payload contract bug was found; existing open P1 findings still keep the review below PASS.

## Next Dimension
Iteration 018 should verify tests/contracts around the canonical timestamp representation and check whether any downstream CLI/UI readers assume ISO strings or millisecond numbers for modelServer.loadStartedAt/loadProgressAt.
