---
title: "Decision Record: MCP-server directory and manifest closure (032 subtree 008 phase 001)"
description: "Design decisions for the package-root rename and its npm workspace, lockfile, manifest, and entrypoint closure."
trigger_phrases:
  - "mcp-server closure decisions"
  - "system-spec-kit workspace rename"
  - "phase 001 decision record"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/008-component-migration/008-system-spec-kit/001-mcp-server-dir-and-manifest-closure"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/008-component-migration/008-system-spec-kit/001-mcp-server-dir-and-manifest-closure"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Recorded MCP closure decisions"
    next_safe_action: "Execute the root closure on the pinned baseline"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

# Decision Record: MCP-server directory and manifest closure

<!-- ANCHOR:context -->
## Context

The package root is a TypeScript workspace at mcp_server. Its package name is already @spec-kit/mcp-server, but package-lock.json and package scripts use the filesystem path mcp_server. The migration needs an atomic path closure while preserving tool-facing manifest filenames, package identity, Python exemptions, and executable entrypoints.
<!-- /ANCHOR:context -->

<!-- ANCHOR:decisions -->
## Decisions

### DR-001 — Rename the package root semantically
Use the single source-to-target mapping mcp_server -> mcp-server. Do not perform a character substitution over descendants; inner directories are separate phase 002 map entries.

### DR-002 — Update path values, not contracts
Rewrite workspace arrays, package keys, link targets, and file:../mcp_server path values in the same closure. Keep package.json, package-lock.json, tsconfig.json, vitest config filenames, and the @spec-kit/mcp-server package name unchanged.

### DR-003 — Keep entrypoint basenames stable
The dist entrypoints context-server.js, cli.js, and spec-memory-cli.js retain their names. Only the containing filesystem path and path-valued launcher references change.

<!-- /ANCHOR:decisions -->

<!-- ANCHOR:consequences -->
## Consequences

- The package becomes resolvable under mcp-server without changing its published identity.
- The lockfile is touched only for path values required by the workspace move; it is not renamed or manually reformatted.
- A failure in collision or install checks blocks the root move rather than allowing a mixed old/new workspace.
<!-- /ANCHOR:consequences -->

<!-- ANCHOR:references -->
## References

- Program policy and exemptions: sk-doc/020-hyphen-naming-convention/001-convention-policy-and-scope/decision-record.md.
- Workspace evidence: .opencode/skills/system-spec-kit/package-lock.json and mcp_server/package.json.
- Phase specification: spec.md.
<!-- /ANCHOR:references -->

