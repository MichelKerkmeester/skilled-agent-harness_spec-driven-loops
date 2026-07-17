---
title: "Checklist: Shared and runtime (032 subtree 008 phase 007)"
description: "The shared/runtime part of system-spec-kit contains an underscore-bearing shared/mcp_server directory even though its TypeScript/shared-package surface can use kebab-case. This phase verifies the runtime tree, renames the permitted shared directory, updates its references, and preserves package manifests, tool names, generated databases, and Python package directories."
trigger_phrases:
  - "system-spec-kit shared runtime"
  - "shared/mcp_server rename"
  - "runtime path cleanup"
  - "kebab-case phase 007"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/008-component-migration/008-system-spec-kit"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/008-component-migration/008-system-spec-kit/007-shared-and-runtime"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored SOL verifier checklist"
    next_safe_action: "Execute the shared/mcp-server path closure after reference assets are stable"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Checklist: Shared and runtime

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking SOL verifier contract for phase 007. The verifier records candidate SHA, BASE SHA, rename-map hash, commands, exit codes, discovery counts, and disposition-ledger evidence before accepting the phase.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Phase 006 reference/asset handoff is available.
- [ ] CHK-002 [P0] Shared/runtime and database ownership are classified before moving paths.
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-003 [P1] Only the shared directory closure is changed.
- [ ] CHK-004 [P0] Database payload and generated exemptions are not mutated.
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-005 [P0] Complete scan identifies the shared candidate and runtime result.
- [ ] CHK-006 [P0] Active references resolve through shared/mcp-server.
- [ ] CHK-007 [P0] Database bytes/modes and tool names are preserved.
- [ ] CHK-008 [P1] Zero-candidate or remaining-map handoff is explicit.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-009 [P1] No permitted shared/runtime underscore name remains.
- [ ] CHK-010 [P1] No unknown old-path match remains.
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-011 [P2] Database lock and runtime package boundaries are unchanged.
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-012 [P2] Ownership and preservation evidence are retained for catalog migration.
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-013 [P1] Batch contains only shared/runtime path closure and active references.
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

Accept only when the shared/runtime inventory, semantic map, reference resolution, database preservation, and exemption audit are evidenced.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the SOL verifier confirms a clean shared/runtime surface.
<!-- /ANCHOR:sign-off -->

