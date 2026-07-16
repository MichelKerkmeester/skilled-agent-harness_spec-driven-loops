---
title: "Checklist: MCP server directory and manifest closure"
description: "Blocking SOL acceptance contract for the system-skill-advisor package-boundary rename, manifest/entrypoint closure, exemption preservation, and runtime parity."
trigger_phrases:
  - "mcp-server closure checklist"
  - "advisor package root checklist"
  - "manifest rename verification"
importance_tier: "critical"
contextType: "planning"
parent: "sk-doc/032-hyphen-naming-convention/008-component-migration/009-system-skill-advisor/001-mcp-server-dir-and-manifest-closure"
_memory:
  continuity:
    packet_pointer: "sk-doc/032-hyphen-naming-convention/008-component-migration/009-system-skill-advisor/001-mcp-server-dir-and-manifest-closure"
    last_updated_at: "2026-07-14T18:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored the package-boundary SOL verifier contract"
    next_safe_action: "Run the checklist centrally after the package-boundary phase executes"
    blockers: []
    key_files:
      - ".opencode/skills/system-skill-advisor/mcp_server"
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "This authoring pass does not execute the package rename or any verification command."
---

# Checklist: MCP server directory and manifest closure

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking SOL verifier contract for phase 001. Every item is checked against the candidate SHA,
BASE SHA, and rename-map hash. The report records commands, exit codes, file/discovery counts, mode and symlink
receipts, and fails on zero tests/scenarios or unexpected tracked mutation.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] The package-boundary inventory and candidate map are pinned to the candidate/BASE/map receipts
- [ ] CHK-002 [P0] Package manifest state, lockfile, launcher, doctor, build-config, and test-magic consumers are recorded
- [ ] CHK-003 [P2] Direct package-layout candidates and preserved exemptions have an explicit disposition
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-004 [P1] Changes are limited to the MCP package boundary and its live path closure; no adjacent cleanup is included
- [ ] CHK-005 [P0] No Python filename/package directory, code identifier, data key, generated output, lockfile filename, or tool-mandated name was renamed
- [ ] CHK-006 [P1] The package manifest/entrypoint references use one consistent kebab-case root
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-007 [P0] One mcp-server root exists and the permitted plugin-bridges/stress-test directories have the recorded targets
- [ ] CHK-008 [P0] Launcher, doctor, TypeScript config, plugin bridge, docs, and tests contain no stale live mcp_server path
- [ ] CHK-009 [P0] Typecheck/build, launcher/doctor smoke, plugin bridge smoke, and stress-test discovery pass with BASE counts
- [ ] CHK-010 [P1] File, symlink, executable-bit, and ordinary permission receipts match BASE
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-011 [P0] The package root, permitted direct directories, and every live path consumer are covered by the map
- [ ] CHK-012 [P1] Generated output is rebuilt or refreshed through its owner workflow and was not hand-edited as source
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-013 [P1] Stable launcher, trust boundary, executable bits, symlink targets, and doctor safety behavior are unchanged
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-014 [P1] README, INSTALL_GUIDE, SKILL, doctor assets, and plugin bridge docs point to the same package root
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-015 [P1] The rename is dependency-closed and path-scoped; no stray implementation summary or scratch directory remains in this leaf
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase passes only when all P0 checks pass, the candidate/BASE/map receipts are pinned, runtime/discovery counts
match BASE, and no unexpected tracked mutation remains after verification.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the SOL verifier confirms the P0 contract and the candidate diff contains only the package-boundary
rename, its path closure, and the recorded verification evidence.
<!-- /ANCHOR:sign-off -->
