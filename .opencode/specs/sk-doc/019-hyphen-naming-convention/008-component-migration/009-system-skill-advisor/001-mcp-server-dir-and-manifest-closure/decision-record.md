---
title: "Decision Record: MCP server directory and manifest closure"
description: "Phase-specific decisions for moving the system-skill-advisor MCP package boundary to kebab-case while preserving Python, generated, lockfile, test-magic, and tool-mandated names and closing all live entrypoint references atomically."
trigger_phrases:
  - "mcp-server directory decision record"
  - "advisor package boundary decisions"
  - "manifest closure decisions"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/019-hyphen-naming-convention/008-component-migration/009-system-skill-advisor/001-mcp-server-dir-and-manifest-closure"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-hyphen-naming-convention/008-component-migration/009-system-skill-advisor/001-mcp-server-dir-and-manifest-closure"
    last_updated_at: "2026-07-14T18:00:00Z"
    last_updated_by: "codex"
    recent_action: "Recorded package-boundary mapping and atomic-closure decisions"
    next_safe_action: "Review the decisions against the pinned package inventory before execution"
    blockers: []
    key_files:
      - ".opencode/skills/system-skill-advisor/mcp_server"
      - ".opencode/skills/system-skill-advisor/mcp_server/package-lock.json"
      - ".opencode/skills/system-skill-advisor/mcp_server/skill-advisor-cli-manifest.ts"
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "The root package directory and ordinary non-Python direct layout directories are filesystem rename targets."
      - "Generated/tool-mandated/test-magic/Python names are preserved or classified before any move."
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

# Decision Record: MCP server directory and manifest closure

<!-- ANCHOR:context -->
## Context

The current advisor package root is mcp_server/. Its ordinary non-Python direct layout also includes plugin_bridges/
and stress_test/, while nested test-magic directories and Python package/file names use underscores for tool or
language reasons. The package root is referenced by the CLI, build/test configuration, stable launchers, doctor assets,
plugin bridge, guides, and generated-runtime expectations. A root-only move would break those consumers, while a
mechanical sweep could rename tool contracts or Python names.

The current visible surface includes package-lock.json and the TypeScript CLI manifest, but no package.json file at
the inspected package root. The migration needs a recorded manifest state, not an invented package file.
<!-- /ANCHOR:context -->

<!-- ANCHOR:decisions -->
## Decisions

### DR-001 — Use a semantic package-boundary map

Map mcp_server/ to mcp-server/. Map plugin_bridges/ to plugin-bridges/ and stress_test/ to stress-test/ when the
pinned inventory confirms they are ordinary non-Python directories. Do not perform a character substitution across the
whole package tree.

### DR-002 — Preserve language, tool, generated, and test contracts

Keep Python .py filenames and Python import-package directories unchanged. Keep package-lock.json, TypeScript/Vitest
tool configuration names, generated dist/node_modules output, and test-magic directories unchanged unless their actual
tool contract explicitly permits a different disposition. Keep code identifiers, tool IDs, keys, and fields unchanged.

### DR-003 — Close entrypoints and manifests in one dependency-closed change

Update path-valued launcher, doctor, CLI, TypeScript configuration, plugin bridge, test, and documentation references
against the same map. The package-lock remains tool-managed; if a package-manager refresh is required, regenerate it
from the renamed package root rather than hand-editing generated dependency data.

### DR-004 — Record missing manifest state instead of synthesizing one

The executor records whether a package manifest is present at the pinned BASE and includes any discovered manifest in
the consumer closure. If the current absence persists, the phase does not create package.json as migration scope.
<!-- /ANCHOR:decisions -->

<!-- ANCHOR:consequences -->
## Consequences

The runtime package boundary becomes readable in filesystem paths, and all live launchers/configuration/docs can be
checked against one target root. The phase carries more than a directory move because plugin bridge, stress discovery,
doctor probes, and generated entrypoint expectations must be updated together.

Preserving lockfile/tool/test-magic names means the final tree can still contain approved underscores. The rollup gate
must therefore use the classification ledger rather than a raw zero-underscore string search. A missing package
manifest remains an explicit baseline fact and may block package execution if the central build environment confirms it.
<!-- /ANCHOR:consequences -->

<!-- ANCHOR:references -->
## References

- Program policy and exemption boundary: sk-doc/019-hyphen-naming-convention/001-convention-policy-and-scope/decision-record.md
- Parent component map: sk-doc/019-hyphen-naming-convention/008-component-migration/009-system-skill-advisor/spec.md
- Runtime package surface: .opencode/skills/system-skill-advisor/mcp_server/
- Package lock and CLI manifest: .opencode/skills/system-skill-advisor/mcp_server/package-lock.json and skill-advisor-cli-manifest.ts
<!-- /ANCHOR:references -->
