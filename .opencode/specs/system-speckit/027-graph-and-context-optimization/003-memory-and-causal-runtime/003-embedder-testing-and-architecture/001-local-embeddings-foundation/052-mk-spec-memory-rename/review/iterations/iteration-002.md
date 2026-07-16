# Deep Review: Iteration 002

**Dimensions**: integration+documentation
**Timestamp**: 2026-05-15T05:35:29Z
**Files Reviewed**: opencode.json, .claude/mcp.json, .codex/config.toml, .gemini/settings.json, .opencode/bin/mk-spec-memory-launcher.cjs, .gemini/scripts/mk-spec-memory.sh, .opencode/skills/system-spec-kit/mcp_server/context-server.ts, .opencode/skills/system-spec-kit/mcp_server/dist/context-server.js, .opencode/skills/system-spec-kit/mcp_server/database/.mk-spec-memory-launcher.json, .opencode/skills/system-spec-kit/mcp_server/handlers/save/spec-folder-mutex.ts, .opencode/skills/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts, .opencode/skills/system-spec-kit/mcp_server/tests/shared-daemon-runner-helpers.vitest.ts, .opencode/skills/system-spec-kit/mcp_server/stress_test/substrate/run-substrate-stress-harness.mjs, _sandbox/24--local-llm-query-intelligence/evidence/run-mcp-direct.mjs, .opencode/commands/doctor.md, .opencode/commands/doctor/update.md, .opencode/commands/doctor/_routes.yaml, .opencode/commands/memory/manage.md, .opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-local-llama-cpp/052-mk-spec-memory-rename/spec.md, .opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-local-llama-cpp/052-mk-spec-memory-rename/plan.md, .opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-local-llama-cpp/052-mk-spec-memory-rename/tasks.md, .opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-local-llama-cpp/052-mk-spec-memory-rename/implementation-summary.md, .opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-local-llama-cpp/052-mk-spec-memory-rename/resource-map.md, .opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-local-llama-cpp/052-mk-spec-memory-rename/description.json, .opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-local-llama-cpp/052-mk-spec-memory-rename/graph-metadata.json

## SCOPE VIOLATIONS


## Findings

| ID | Severity | Title | Location (file:line) | Category | Recommendation |
|----|----------|-------|----------------------|----------|----------------|
| 017-iter002-P1-001 | P1 | Operational sweep points extracted code/advisor tools at mk-spec-memory | .opencode/commands/doctor.md:4, .opencode/commands/doctor/update.md:4, .opencode/commands/doctor/_routes.yaml:128, .opencode/commands/memory/manage.md:4 | integration | Re-route extracted tool references to their owning servers: `code_graph_*`, `detect_changes`, and `ccc_*` to `mcp__mk_code_index__*`; `advisor_*` and `skill_graph_*` to `mcp__mk_skill_advisor__*`. Then grep for `mcp__mk_spec_memory__(code_graph|detect_changes|ccc|advisor|skill_graph)_` in active docs. |
| 017-iter002-P1-002 | P1 | Spec acceptance criteria grep for the new prefix while claiming zero matches | .opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-local-llama-cpp/052-mk-spec-memory-rename/spec.md:159, .opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-local-llama-cpp/052-mk-spec-memory-rename/spec.md:175 | documentation | Change REQ-004 and SC-001 to require zero active `mcp__spec_kit_memory__` matches, not zero active `mcp__mk_spec_memory__` matches. Keep the documented archival exclusions explicit. |

## Assessment

Integration: The runtime config keys, quoted Codex TOML table, launcher path, source/dist server identity, state file, Gemini script, smoke harness mapping, and JS helper syntax all align with the intended `mk-spec-memory` cutover. The remaining integration gap is in operational command docs: the broad prefix sweep preserved some tools under the memory server even though code graph, CCC, advisor, and skill graph surfaces have standalone MCP servers.

Documentation: Prior iteration 001 already recorded the unfilled plan template, stale status metadata, stale graph status, and open-question drift; those are not duplicated here. The new documentation issue is narrower but blocking for validation: the spec's REQ-004 and SC-001 accidentally assert zero matches for the new prefix, contradicting the implementation summary/resource map and the active command docs that intentionally use `mcp__mk_spec_memory__memory_*` and `deep_loop_graph_*`.

## findings_summary

```json
{ "p0": 0, "p1": 2, "p2": 0, "new_findings": 2 }
```
