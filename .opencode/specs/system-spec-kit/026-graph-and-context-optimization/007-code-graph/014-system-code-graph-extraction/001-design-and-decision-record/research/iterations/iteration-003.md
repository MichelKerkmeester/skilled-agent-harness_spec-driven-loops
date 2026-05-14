# Iteration 3: Plugin Bridge, DB, Docs & Config Details

[SOURCE: glob .opencode/plugins/, read .opencode/plugins/spec-kit-compact-code-graph.js, glob feature_catalog/22--*, glob manual_testing_playbook/22--*]

## Plugin Bridges (Q6)

3 files under `mcp_server/plugin_bridges/`:
1. `spec-kit-opencode-message-schema.mjs` — shared message schema (used by multiple plugins, NOT code-graph specific)
2. `spec-kit-compact-code-graph-bridge.mjs` — code-graph specific bridge
3. `spec-kit-skill-advisor-bridge.mjs` — skill-advisor specific (not code-graph)

1 file under `.opencode/plugins/`:
4. `spec-kit-compact-code-graph.js` — PLUGIN_ID = 'spec-kit-compact-code-graph', imports bridge via fileURLToPath

The message schema (file 1) is shared infrastructure — stays in system-spec-kit.
The bridge .mjs (file 2) and plugin .js (file 4) are code-graph specific — move with code-graph.
The plugin resolves the bridge path at runtime — post-move, the bridge + plugin MUST both move or the plugin path resolution breaks.

## Category-22 Docs in system-spec-kit/feature_catalog

33 files total. Content split analysis:

**Code-graph core docs (move):**
- 07-structural-code-indexer.md
- 08-code-graph-storage-query.md
- 09-cocoindex-bridge-context.md
- 11-working-set-tracker.md
- 13-tree-sitter-wasm-parser.md
- 14-query-intent-classifier.md
- 15-code-graph-auto-trigger.md
- 24-code-graph-readiness-contract.md
- 30-coverage-graph-query.md

**Mixed/context docs (stay-and-rewire):**
- 01-category-overview.md (references both code-graph + context)
- 06-runtime-detection.md (shared utility)
- 10-budget-allocator.md (shared utility)
- 12-compact-merger.md (shared utility)
- 16-mcp-auto-priming.md (context/hook)
- 17-session-health-tool.md (context/hook)
- 18-session-resume-tool.md (context/hook)
- 19-query-intent-routing.md (context/hook)
- 20-passive-context-enrichment.md (context/hook)
- 21-gemini-cli-hooks.md (context/hook)
- 23-tool-routing-enforcement.md (context/hook)
- 25-resource-map-template.md (shared doc infra)
- 26-skill-graph-scan.md (skill_advisor)
- 27-skill-graph-query.md (skill_advisor)
- 28-skill-graph-status.md (skill_advisor)
- 29-skill-graph-validate.md (skill_advisor)
- 02-precompact-hook.md (context/hook)
- 03-session-start-priming.md (context/hook)
- 04-stop-token-tracking.md (context/hook)
- 05-cross-runtime-fallback.md (context/hook)
- 22-context-preservation-metrics.md (context/hook)

Approximately 9 move, 24 stay (shared context/hooks/skill_advisor).

## Category-22 Docs in system-spec-kit/manual_testing_playbook

30 files. Similar split — code-graph core tests move, context/hook tests stay:
- ~10 code-graph specific playbook entries (move)
- ~20 context/hooks/shared entries (stay)

## vitest.config.ts (lines 19-21)

```typescript
include: [
  'mcp_server/tests/**/*.{vitest,test}.ts',
  'mcp_server/code_graph/tests/**/*.{vitest,test}.ts',
  'mcp_server/stress_test/code-graph/doctor-apply-mode-stress.vitest.ts',
  ...
]
```

Lines 20-21 directly reference code_graph paths. Post-extraction, this config must:
1. Remove the code_graph test paths (they move to new skill's vitest config)
2. Keep the external test files that import code-graph (those are under `mcp_server/tests/` which stays)

## opencode.json

Note #8 (`_NOTE_8_CODE_GRAPH_SCOPE`) documents code-graph scope configuration. Update post-extraction.

## DB Schema (code-graph.sqlite)

7 exclusive tables:
1. `code_nodes` — indexed code symbols (functions, classes, imports, calls)
2. `code_edges` — relationships between nodes
3. `code_scope` — scope fingerprint metadata
4. `parse_diagnostics` — parse error tracking
5. `edge_drift_log` — edge drift audit
6. `apply_audit_log` — apply-mode operations audit
7. `gold_verification_results` — gold query battery results

DB size: ~55 MB live index at repo root; individual workspace graphs are smaller.
DB file + WAL + SHM = 3 files that move.
