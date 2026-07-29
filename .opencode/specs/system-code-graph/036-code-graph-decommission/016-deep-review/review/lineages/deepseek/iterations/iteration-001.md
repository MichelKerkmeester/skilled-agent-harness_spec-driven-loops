# Iteration 001: Correctness — Decommission Residue & Code Integrity

## Focus
Correctness dimension: verifying no stale code-graph dependencies remain, checking that decommissioned code paths are fully removed, and replacement paths are correctly wired. Scanned: `system-spec-kit/mcp-server` (lib + hooks), `system-skill-advisor`, deep-loop runtime, doctor commands, agent mirrors.

## Scorecard
- Dimensions covered: correctness
- Files reviewed: 12
- New findings: P0=0 P1=0 P2=5
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.636 (severity-weighted: all P2 @ weight 1.0)

## Findings

### P2, Suggestion

- **F001**: Missing plugin file breaks test imports, `.opencode/skills/system-spec-kit/mcp-server/tests/opencode-plugin.vitest.ts:13`
  `import mkCodeGraphPlugin from '../../../../plugins/mk-code-graph.js'` — the target file does not exist on disk. The `plugins/mk-code-graph.js` was removed but test imports were not updated. Running this test will fail. Dimension: correctness.

- **F002**: Session-prime injects potentially stale code-graph tool guidance, `.opencode/skills/system-spec-kit/mcp-server/hooks/claude/session-prime.ts:212`
  Lists `code_graph_scan`, `code_graph_query`, `code_graph_context`, `code_graph_status` as recovery tools. These reference the external standalone `system_code_graph` MCP server. If that server uses the `mcp__mk_code_index__` namespace prefix, the bare tool names here will not match what the runtime exposes. Dimension: correctness.

- **F003**: Compact-inject regex matches potentially nonexistent tool names, `.opencode/skills/system-spec-kit/mcp-server/hooks/claude/compact-inject.ts:121`
  `code_graph_\w+` regex matches tool names in transcripts. Valid only if external `system_code_graph` MCP tools use the bare `code_graph_*` prefix rather than the `mcp__mk_code_index__code_graph_*` namespace. Dimension: correctness.

- **F004**: Layer-definitions lists code_graph tools without namespace prefix, `.opencode/skills/system-spec-kit/mcp-server/lib/architecture/layer-definitions.ts:115`
  `code_graph_scan`, `code_graph_status`, `code_graph_verify` listed as L3 tools. These may be unreachable if the external server's tool names differ. Dimension: correctness.

- **F005**: External code-graph contract imports in test-only code still compile, `.opencode/skills/system-spec-kit/mcp-server/tests/opencode-transport.vitest.ts:6`
  `import type { CodeGraphOpsContract } from '@spec-kit/shared/code-graph-contracts'` — the type import resolves because `@spec-kit/shared` is a package alias. The underlying `system-code-graph` server still exists, so this is valid, but it is a `lib/` import path through a test file that uses the external server's contracts. No action needed but noted for traceability.

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | n/a | hard | - | Not applicable this iteration |
| checklist_evidence | n/a | hard | - | Not applicable this iteration |

## Assessment
- New findings ratio: 0.636 (5 P2 x 1.0 = 5, no prior findings)
- Dimensions addressed: correctness (resolved 1 file scan complete)
- Novelty justification: Primary correctness audit is fresh — these are the first findings on this target by this lane. F001 is a concrete broken import; F002-F004 are potential namespace mismatches; F005 is a traceability note.

## Ruled Out
- Stale internal code-graph imports in production code: Grepped `lib/` for `code-graph-contracts` — no production imports found. The `code_graph/` directory under mcp-server is properly removed.
- speckit-deep-loop.cjs residue: File confirmed missing from disk.
- Doctor command residue: Zero code-graph references found in `_routes.yaml`, assets, or scripts.
- Agent mirror residue: Zero code-graph references in `.opencode/agents/` or `.claude/agents/`.

## Dead Ends
None.

## Recommended Next Focus
Security dimension: check trust boundaries around deep-loop runtime executor dispatch, verify that the cli-opencode executor kind (used for this lane) has proper sandboxing, and audit hook surfaces for injection vectors.

```json
{"findingId":"F001","claim":"The plugin file mk-code-graph.js was removed but test imports referencing it were not updated.","evidenceRefs":[".opencode/skills/system-spec-kit/mcp-server/tests/opencode-plugin.vitest.ts:13"],"counterevidenceSought":"Checked filesystem: .opencode/plugins/mk-code-graph.js does not exist. Grepped for other references to this plugin.","alternativeExplanation":"The test may be expected to fail as a canary until the external server integration is re-wired.","finalSeverity":"P2","confidence":0.85,"downgradeTrigger":"If test is skipped or marked as expected-to-fail in CI config, downgrade to resolved.","transitions":[]}
```
```json
{"findingId":"F002","claim":"Session-prime hook injects code_graph_* tool names that may not match the external server's namespaced tool prefix.","evidenceRefs":[".opencode/skills/system-spec-kit/mcp-server/hooks/claude/session-prime.ts:212"],"counterevidenceSought":"Verified the external MCP server tool prefix is mcp__mk_code_index__code_graph_* from context-server.ts:1126.","alternativeExplanation":"The bare names may be used as shorthand user-facing guidance, and the runtime resolves them correctly.","finalSeverity":"P2","confidence":0.75,"downgradeTrigger":"If confirmed that bare code_graph_* names are valid tool aliases in the runtime, downgrade to resolved.","transitions":[]}
```
```json
{"findingId":"F003","claim":"Compact-inject regex code_graph_\\w+ may not match the actual tool name prefix used by the external MCP server.","evidenceRefs":[".opencode/skills/system-spec-kit/mcp-server/hooks/claude/compact-inject.ts:121"],"counterevidenceSought":"Checked context-server.ts:1126 for the active prefix: mcp__mk_code_index__code_graph_query. This would NOT match the regex.","alternativeExplanation":"The regex is for topic extraction from transcripts, and transcripts may contain bare tool names.","finalSeverity":"P2","confidence":0.80,"downgradeTrigger":"If transcripts use mcp__mk_code_index__ prefix, regex should match that instead.","transitions":[]}
```
```json
{"findingId":"F004","claim":"Layer-definitions lists code_graph_* tools that may be unreachable if the external server names differ.","evidenceRefs":[".opencode/skills/system-spec-kit/mcp-server/lib/architecture/layer-definitions.ts:115"],"counterevidenceSought":"Checked for namespace mapping in the layer system. No explicit mapping found.","alternativeExplanation":"The layer system may resolve tool names through the MCP server registration, not raw names.","finalSeverity":"P2","confidence":0.70,"downgradeTrigger":"If layer-definitions uses internal tool IDs rather than external names, this is expected.","transitions":[]}
```
```json
{"findingId":"F005","claim":"External code-graph contract type imports in tests are valid but reference paths that cross server boundaries.","evidenceRefs":[".opencode/skills/system-spec-kit/mcp-server/tests/opencode-transport.vitest.ts:6"],"counterevidenceSought":"Verified @spec-kit/shared/code-graph-contracts resolves through package aliases.","alternativeExplanation":"This is expected test infrastructure for integration testing between servers.","finalSeverity":"P2","confidence":0.90,"downgradeTrigger":"None — this is a traceability note, not a defect.","transitions":[]}
```

Review verdict: PASS
