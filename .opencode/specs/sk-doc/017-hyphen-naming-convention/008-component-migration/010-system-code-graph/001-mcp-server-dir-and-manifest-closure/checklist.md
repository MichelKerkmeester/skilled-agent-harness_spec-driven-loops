---
title: "Checklist: system-code-graph MCP server directory and manifest closure"
description: "Blocking SOL acceptance contract for the code-graph package-boundary rename, manifest/entrypoint closure, exemption preservation, and runtime parity."
trigger_phrases:
  - "system-code-graph mcp-server closure checklist"
  - "code graph package root checklist"
  - "mcp-server entrypoint verification"
importance_tier: "critical"
contextType: "planning"
parent: "sk-doc/017-hyphen-naming-convention/008-component-migration/010-system-code-graph/001-mcp-server-dir-and-manifest-closure"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-hyphen-naming-convention/008-component-migration/010-system-code-graph/001-mcp-server-dir-and-manifest-closure"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored package-boundary SOL contract"
    next_safe_action: "Run the checklist centrally after package rename"
    blockers: []
    key_files:
      - ".opencode/skills/system-code-graph/mcp_server"
      - ".opencode/bin/mk-code-index-launcher.cjs"
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "This authoring pass does not rename the package or run verification commands."
---

# Checklist: system-code-graph MCP server directory and manifest closure

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking SOL verifier contract for phase 001. Every item is checked against the candidate SHA,
BASE SHA, and rename-map hash. The report records commands, exit codes, file/discovery counts, package-manifest state,
mode and symlink receipts, and fails on zero tests/scenarios or unexpected tracked mutation.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] The package-boundary inventory and candidate map are pinned to candidate/BASE/map receipts
- [ ] CHK-002 [P0] Package-lock, package.json presence/absence, TypeScript/Vitest config, launcher, CLI, plugin, and
  test-magic consumers are recorded
- [ ] CHK-003 [P2] Direct package-layout candidates and preserved exemptions have an explicit disposition
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-004 [P1] Changes are limited to the MCP package boundary and its live path closure; no adjacent cleanup is included
- [ ] CHK-005 [P0] No Python filename/package directory, code identifier, data key, generated output, lockfile filename,
  test-magic name, or tool-mandated name was renamed
- [ ] CHK-006 [P1] Compiler, test, launcher, CLI, plugin, and runtime-config references use one consistent kebab-case root
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-007 [P0] One mcp-server root exists and plugin-bridges/stress-test have the recorded targets
- [ ] CHK-008 [P0] Launcher, CLI, TypeScript/Vitest config, runtime configs, plugin bridge, tests, docs, and helpers
  contain no stale live mcp_server path
- [ ] CHK-009 [P0] Typecheck/build, launcher/CLI smoke, plugin smoke, and ordinary/stress discovery pass with BASE counts
- [ ] CHK-010 [P1] File, symlink, executable-bit, and ordinary permission receipts match BASE
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-011 [P0] The package root, permitted direct directories, manifest state, and every live path consumer are covered
  by the map or old-name disposition ledger
- [ ] CHK-012 [P1] Generated output is rebuilt or refreshed through its owner workflow and was not hand-edited as source
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-013 [P1] Stable launcher, database containment, trust boundaries, executable bits, symlink targets, and
  fail-safe doctor behavior are unchanged
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-014 [P1] README, INSTALL_GUIDE, ARCHITECTURE, SKILL, runtime configs, plugin docs, and helper docs point to
  the same package root
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-015 [P1] The rename is dependency-closed and path-scoped; no stray implementation summary or scratch
  directory remains in this leaf
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase passes only when all P0 checks pass, candidate/BASE/map and manifest-state receipts are pinned,
runtime/discovery counts match BASE, and no unexpected tracked mutation remains after verification.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the SOL verifier confirms the P0 contract and the candidate diff contains only the package-boundary
rename, its path closure, and the recorded verification evidence.
<!-- /ANCHOR:sign-off -->

