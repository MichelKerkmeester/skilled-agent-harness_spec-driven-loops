---
title: "Checklist: create-agent resource names"
description: "Blocking SOL verifier contract for the create-agent resource rename phase."
trigger_phrases:
  - "create-agent resource checklist"
  - "agent template rename verification"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/008-component-migration/003-sk-doc/003-create-packets/003-create-agent"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/008-component-migration/003-sk-doc/003-create-packets/003-create-agent"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored create-agent checklist"
    next_safe_action: "Run the create-agent verifier"
    blockers: []
    key_files: [".opencode/skills/sk-doc/create-agent/assets/", ".opencode/skills/sk-doc/create-agent/references/"]
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Checklist: create-agent resource names

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking SOL verifier contract for create-agent phase 003. The report pins BASE, candidate SHA, and rename-map hash, records target-resolution evidence, and fails on unknown paths or unexpected tracked mutation.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] The three resource rows and routed consumers are recorded.
- [ ] CHK-002 [P1] BASE SHA and component rename-map hash are pinned.
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-003 [P0] Only create-agent paths and path consumers changed.
- [ ] CHK-004 [P0] Permission fields, identifiers, mandated names, and existing hyphenated resources are unchanged.
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-005 [P0] `agent_template.md`, `common_pitfalls.md`, and `permission_design.md` each have one kebab-case target.
- [ ] CHK-006 [P0] Scaffold and routed reference loading resolve the renamed targets.
- [ ] CHK-007 [P1] Old live path search is empty and resource discovery matches BASE.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-008 [P1] Direct links, route resource values, basename joins, and examples are dispositioned.
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-009 [P2] No permission allowlist, executable mode, or sandbox boundary changed.
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-010 [P1] Phase docs and manifest agree on the create-agent-only scope.
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-011 [P1] Changes are component-scoped and no implementation-summary or scratch artifact remains.
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase passes when all P0 checks pass, agent resource loading is stable, and no permission or mandated-name drift appears in the diff.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Sign-off requires candidate/BASE/map receipts, successful resource loading, and a clean scoped diff.
<!-- /ANCHOR:sign-off -->
