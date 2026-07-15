---
title: "Checklist: create-manual-testing-playbook resource names"
description: "Blocking SOL verifier contract for the create-manual-testing-playbook resource rename phase."
trigger_phrases:
  - "create playbook resource checklist"
  - "manual testing template rename verification"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/019-hyphen-naming-convention/008-component-migration/003-sk-doc/003-create-packets/006-create-manual-testing-playbook"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-hyphen-naming-convention/008-component-migration/003-sk-doc/003-create-packets/006-create-manual-testing-playbook"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored create-playbook checklist"
    next_safe_action: "Run the create-playbook verifier"
    blockers: []
    key_files: [".opencode/skills/sk-doc/create-manual-testing-playbook/assets/", ".opencode/skills/sk-doc/create-manual-testing-playbook/references/"]
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Checklist: create-manual-testing-playbook resource names

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking SOL verifier contract for create-manual-testing-playbook phase 006. The report pins BASE, candidate SHA, and rename-map hash, records target and boundary evidence, and fails on unknown paths or unexpected tracked mutation.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] The four packet-owned resource rows and root-playbook boundary are recorded.
- [ ] CHK-002 [P1] BASE SHA and component rename-map hash are pinned.
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-003 [P0] Only create-manual-testing-playbook paths and path consumers changed.
- [ ] CHK-004 [P0] Scenario IDs, fields, keys, mandated names, and root playbook paths are unchanged.
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-005 [P0] Both asset and both reference filenames have one kebab-case target.
- [ ] CHK-006 [P0] Packet template/reference links resolve and old packet-owned path search is empty.
- [ ] CHK-007 [P1] Root playbook remains outside the diff and packet resource discovery matches BASE.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-008 [P1] Direct links, examples, basename consumers, and root cross-references are dispositioned.
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-009 [P2] No executable mode, scenario allowlist, or sandbox boundary changed.
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-010 [P1] Phase docs and manifest agree on the packet-only scope.
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-011 [P1] Changes are component-scoped and no implementation-summary or scratch artifact remains.
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase passes when all P0 checks pass, packet resources resolve, root ownership is respected, and playbook semantics remain stable.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Sign-off requires candidate/BASE/map receipts, resource-resolution evidence, and a clean scoped diff.
<!-- /ANCHOR:sign-off -->
