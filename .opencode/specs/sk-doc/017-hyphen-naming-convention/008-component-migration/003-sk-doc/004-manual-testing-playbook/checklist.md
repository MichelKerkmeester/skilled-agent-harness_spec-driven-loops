---
title: "Checklist: sk-doc manual-testing-playbook tree"
description: "Blocking SOL verifier contract for the root manual-testing-playbook rename phase."
trigger_phrases:
  - "sk-doc manual playbook checklist"
  - "manual playbook rename verification"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/017-hyphen-naming-convention/008-component-migration/003-sk-doc/004-manual-testing-playbook"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-hyphen-naming-convention/008-component-migration/003-sk-doc/004-manual-testing-playbook"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored manual playbook checklist"
    next_safe_action: "Run the root playbook verifier"
    blockers: []
    key_files: [".opencode/skills/sk-doc/manual_testing_playbook/"]
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Checklist: sk-doc manual-testing-playbook tree

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking SOL verifier contract for phase 004. The report pins BASE, candidate SHA, and rename-map hash, records tree/link/discovery counts, and fails on an unknown path, broken scenario, or unexpected tracked mutation.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Full root/category/scenario inventory and index-link map are recorded.
- [ ] CHK-002 [P1] BASE SHA and complete tree rename-map hash are pinned.
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-003 [P0] Only root playbook paths and their path consumers changed.
- [ ] CHK-004 [P0] Scenario IDs, prompts, outcomes, fields, and unrelated playbooks are unchanged.
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-005 [P0] The root directory, index, six category directories, and eighteen underscore-bearing scenario files each have one kebab-case target; already-kebab scenarios remain unchanged.
- [ ] CHK-006 [P0] Root/category/scenario links resolve and old live path search is empty.
- [ ] CHK-007 [P1] Category/scenario discovery counts and content parity match BASE.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-008 [P1] Direct links, category navigation, globs, basename consumers, and cross-skill references are dispositioned.
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-009 [P2] No scenario execution permission, test allowlist, or sandbox boundary changed.
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-010 [P1] Phase docs, root index map, and rename manifest agree on the complete playbook scope.
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-011 [P1] Changes are root-playbook-scoped and no implementation-summary or scratch artifact remains.
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase passes when all P0 checks pass, every scenario remains reachable, counts/content match BASE, and no unrelated playbook changed.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Sign-off requires candidate/BASE/map receipts, link and count evidence, and a clean scoped diff.
<!-- /ANCHOR:sign-off -->
