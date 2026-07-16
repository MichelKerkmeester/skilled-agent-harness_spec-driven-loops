---
title: "Decision Record: mcp-server path closure (032 component 011 phase 001)"
description: "The design choices for moving the embedded mcp_server directory to mcp-server without changing Python exemptions, tool-mandated package filenames, package identifiers, or the Node entrypoint contract."
trigger_phrases:
  - "mcp-server path decision record"
  - "mcp-code-mode package closure decisions"
  - "mcp_server to mcp-server decision"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/032-hyphen-naming-convention/008-component-migration/011-mcp-code-mode/001-mcp-server-dir-and-manifest-closure"
_memory:
  continuity:
    packet_pointer: "sk-doc/032-hyphen-naming-convention/008-component-migration/011-mcp-code-mode/001-mcp-server-dir-and-manifest-closure"
    last_updated_at: "2026-07-14T16:30:00Z"
    last_updated_by: "codex"
    recent_action: "Recorded package closure decisions"
    next_safe_action: "Use the semantic map during execution"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

# Decision Record: mcp-server path closure

<!-- ANCHOR:context -->
## Context

The embedded Node MCP server is stored in mcp_server, and active shell, guide, diagnostic, metadata, and configured-entrypoint
paths refer to that directory. The 032 policy requires permitted filesystem names to use kebab-case, but it explicitly
exempts Python names, tool-mandated filenames, generated/lockfile content, identifiers, and frozen history. The package
directory therefore has to move without turning a filesystem rename into a package-contract rewrite.
<!-- /ANCHOR:context -->

<!-- ANCHOR:decisions -->
## Decisions

### DR-001 — Rename the package directory, not its tool-mandated children

The execution map changes mcp_server to mcp-server. It keeps package-lock.json, tsconfig.json, .nvmrc, index.ts, and
scripts/check-node.cjs with their existing names; package identifiers and JSON keys remain data contracts. A mechanical
rename of every underscore-bearing token would violate the 032 exemption boundary and could change npm or TypeScript
behavior.

### DR-002 — Move the full path consumer closure atomically

The directory rename and all active installer, doctor, guide, metadata, command, working-directory, and dist/index.js
path values land as one dependency-closed unit. A partial rename can leave npm installation and the MCP launch command
pointing at different roots, so a directory-only commit is not acceptable.

### DR-003 — Treat a missing package manifest as an inventory fact, not a reason to invent one

The current tree contains package-lock.json but no package.json, while generated graph metadata names a package.json
path. Execution must classify that discrepancy against the pinned tree and update only the actual active path contract.
This phase does not create a manifest or rewrite generated metadata by assumption.
<!-- /ANCHOR:decisions -->

<!-- ANCHOR:consequences -->
## Consequences

- Active consumers use one kebab-case package root and the dist/index.js entrypoint remains the launch contract.
- Exemption handling is explicit, so the package lock, tool filenames, Python files, identifiers, and frozen records do not
  receive accidental filesystem or content changes.
- The closure requires a complete consumer inventory and a stronger verification report than a directory rename alone.
- If graph metadata is generated, it must be regenerated through its owning path rather than hand-edited during execution.
<!-- /ANCHOR:consequences -->

<!-- ANCHOR:references -->
## References

- Program convention and exemption decisions: sk-doc/032-hyphen-naming-convention/001-convention-policy-and-scope/decision-record.md
- Program scope and sequencing: sk-doc/032-hyphen-naming-convention/spec.md
- Live package surface: .opencode/skills/mcp-code-mode/mcp_server/
- Active package consumers: .opencode/skills/mcp-code-mode/scripts/install.sh, scripts/doctor.sh, and INSTALL_GUIDE.md
<!-- /ANCHOR:references -->
