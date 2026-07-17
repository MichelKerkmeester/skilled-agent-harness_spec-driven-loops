---
title: "Checklist: MCP-server consumer rewrites (032 subtree 008 phase 003)"
description: "Renaming the MCP package and its inner directories changes path-valued references across the skill, sibling skills, scripts, manifests, hooks, and documentation. This phase rewrites every consumer and import/config path without renaming exempt Python targets or changing the @spec-kit/mcp-server package identity."
trigger_phrases:
  - "mcp-server consumer rewrites"
  - "mcp_server import references"
  - "system-spec-kit path consumers"
  - "kebab-case phase 003"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/008-component-migration/008-system-spec-kit"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/008-component-migration/008-system-spec-kit/003-mcp-server-consumer-rewrites"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored SOL verifier checklist"
    next_safe_action: "Execute the repository-wide MCP consumer sweep after the tree is stable"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Checklist: MCP-server consumer rewrites

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking SOL verifier contract for phase 003. The verifier records candidate SHA, BASE SHA, rename-map hash, commands, exit codes, discovery counts, and disposition-ledger evidence before accepting the phase.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Phases 001 and 002 maps and handoff reports are available.
- [ ] CHK-002 [P0] Active, frozen, and generated search-root boundaries are recorded before rewriting.
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-003 [P1] Rewrites are path-semantic and do not alter identifiers, keys, fields, or package names.
- [ ] CHK-004 [P0] No broad replacement is used without a line-level disposition.
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-005 [P0] Consumer scan finds files and reports zero unknown matches after classification.
- [ ] CHK-006 [P0] Static imports, requires, links, shell sources, globs, registry paths, and launchers resolve.
- [ ] CHK-007 [P0] Dynamic path sites are individually dispositioned and target-resolvable.
- [ ] CHK-008 [P1] Frozen changelog and completed-history references are preserved and labeled historical.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-009 [P1] Every active old MCP path is rewritten or explicitly exempted.
- [ ] CHK-010 [P1] Script-tree handoff lists remaining script filename references for phase 004.
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-011 [P2] No launcher, shell, or plugin boundary is broadened by path rewrites.
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-012 [P2] Consumer inventory, resolver receipts, and disposition ledger are retained in phase evidence.
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-013 [P1] Change is limited to active consumers of the approved MCP path map.
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

Accept only when the active consumer graph resolves completely, dynamic sites have no unknown disposition, and the exemptions/frozen boundary is evidenced.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the SOL verifier confirms zero broken active MCP path consumers and a complete phase 004 handoff.
<!-- /ANCHOR:sign-off -->

