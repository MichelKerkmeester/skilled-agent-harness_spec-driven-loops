---
title: "Decision Record: system-code-graph MCP server directory and manifest closure"
description: "Phase-specific decisions for moving the system-code-graph MCP package boundary to kebab-case while preserving Python, generated, lockfile, test-magic, and tool-mandated names and closing all live entrypoint references atomically."
trigger_phrases:
  - "system-code-graph mcp-server decision record"
  - "code graph package boundary decisions"
  - "manifest closure decisions"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/008-component-migration/010-system-code-graph/001-mcp-server-dir-and-manifest-closure"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/008-component-migration/010-system-code-graph/001-mcp-server-dir-and-manifest-closure"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Recorded package-boundary decisions"
    next_safe_action: "Review decisions against pinned package inventory"
    blockers: []
    key_files:
      - ".opencode/skills/system-code-graph/mcp_server"
      - ".opencode/skills/system-code-graph/package-lock.json"
      - ".opencode/skills/system-code-graph/tsconfig.json"
      - ".opencode/bin/mk-code-index-launcher.cjs"
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "The root package directory and ordinary non-Python direct layout directories are filesystem rename targets."
      - "Generated/tool-mandated/test-magic/Python names are preserved or classified before any move."
      - "The current visible package root has no package.json; the migration records that fact instead of synthesizing a manifest."
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

# Decision Record: system-code-graph MCP server directory and manifest closure

<!-- ANCHOR:context -->
## Context

The current system-code-graph package root is mcp_server/. Its ordinary non-Python direct layout also includes
plugin_bridges/ and stress_test/, while tests/__fixtures__/, generated dist/, and package-manager/tool names have
their own contracts. The root is referenced by the TypeScript compiler, Vitest, stable launchers, CLI shim, runtime
configurations, plugin bridge, git/worktree helpers, tests, guides, and topology documentation. A root-only move would
break those consumers, while a mechanical sweep could rename test magic, generated paths, or identifiers.

The current visible surface includes package-lock.json but no package.json at the skill root. The migration needs a
recorded manifest state, not an invented package file.
<!-- /ANCHOR:context -->

<!-- ANCHOR:decisions -->
## Decisions

### DR-001 — Use a semantic package-boundary map

Map mcp_server/ to mcp-server/, plugin_bridges/ to plugin-bridges/, and stress_test/ to stress-test/. Apply these
targets only to ordinary filesystem path segments in the pinned inventory; do not perform a character substitution
across source text, identifiers, or generated output.

### DR-002 — Preserve language, tool, generated, and test contracts

Keep Python .py filenames and Python import-package directories unchanged. Keep package-lock.json, tsconfig.json,
vitest.config.ts, generated dist/node_modules, and tests/__fixtures__/ under their owner contracts. Keep MCP tool IDs,
server identity, config keys, code identifiers, data keys, and frontmatter fields unchanged.

### DR-003 — Close entrypoints and manifests in one dependency-closed change

Update compiler/test paths, source path construction, launchers, CLI, runtime configs, plugin bridge, helpers, tests,
and documentation against the same map. The package-lock remains package-manager-owned; if a refresh is required, the
executor regenerates it from the renamed package layout rather than hand-editing dependency output.

### DR-004 — Record missing manifest state instead of synthesizing one

The executor records whether a package manifest is present at the pinned BASE and includes any discovered manifest in
the consumer closure. If the current absence persists, the phase does not create package.json as migration scope.
<!-- /ANCHOR:decisions -->

<!-- ANCHOR:consequences -->
## Consequences

The runtime package boundary becomes readable in filesystem paths, and all live launchers, configuration, plugin,
test, and documentation consumers can be checked against one target root. The phase carries more than a directory
move because the database path, compiled entrypoint, stress discovery, and plugin bridge must change together.

Preserving lockfile, generated, test-magic, and identifier contracts means the final tree can still contain approved
underscores. The rollup gate must use the classification ledger rather than a raw underscore search. A missing package
manifest remains an explicit baseline fact and may block package execution if the central build environment confirms it.
<!-- /ANCHOR:consequences -->

<!-- ANCHOR:references -->
## References

- Program policy and exemption boundary: sk-doc/020-hyphen-naming-convention/001-convention-policy-and-scope/decision-record.md
- Parent component map: sk-doc/020-hyphen-naming-convention/008-component-migration/010-system-code-graph/spec.md
- Runtime package surface: .opencode/skills/system-code-graph/mcp_server/
- Package lock and build/test configuration: .opencode/skills/system-code-graph/package-lock.json,
  .opencode/skills/system-code-graph/tsconfig.json, and vitest.config.ts
- Stable entrypoints: .opencode/bin/mk-code-index-launcher.cjs and .opencode/bin/code-index.cjs
<!-- /ANCHOR:references -->
