---
title: "Checklist: Manual testing playbook (017 subtree 008 phase 009)"
description: "The system-spec-kit manual_testing_playbook tree contains 440 underscore-bearing basenames: the root, 18 category directories, and 421 scenario or support files. This phase renames permitted playbook paths to kebab-case and closes every playbook link, index, runner, and path pointer while preserving scenario identity and the program exemption boundary."
trigger_phrases:
  - "system-spec-kit manual testing playbook"
  - "manual_testing_playbook to manual-testing-playbook"
  - "playbook scenario kebab-case"
  - "manual testing phase 009"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/019-hyphen-naming-convention/008-component-migration/008-system-spec-kit"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-hyphen-naming-convention/008-component-migration/008-system-spec-kit/009-manual-testing-playbook"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored SOL verifier checklist"
    next_safe_action: "Execute the manual-playbook path map after catalog evidence is available"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Checklist: Manual testing playbook

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking SOL verifier contract for phase 009. The verifier records candidate SHA, BASE SHA, rename-map hash, commands, exit codes, discovery counts, parity evidence, and disposition-ledger evidence before accepting the phase.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Phase 008 handoff and the playbook baseline are available.
- [ ] CHK-002 [P0] Candidate count 440 and the active consumer boundary are recorded before moving paths.
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-003 [P1] Root/category/scenario mappings are semantic and explicit.
- [ ] CHK-004 [P0] Scenario IDs, headings, and procedures are not changed as a side effect of path renames.
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-005 [P0] The full 440-candidate inventory has no unknown disposition.
- [ ] CHK-006 [P0] Playbook links, indexes, runner globs, READMEs, and catalog handoffs resolve.
- [ ] CHK-007 [P0] Scenario IDs, headings, procedures, frontmatter fields, identifiers, and exemptions pass the diff audit.
- [ ] CHK-008 [P1] Scenario and category parity matches the baseline.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-009 [P1] No permitted playbook root/category/scenario basename retains an underscore.
- [ ] CHK-010 [P1] Old active playbook paths have zero unresolved matches.
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-011 [P2] Manual-test runners and navigation boundaries are not broadened by wildcard or path changes.
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-012 [P2] Candidate map, parity report, consumer ledger, and exemption ledger are retained for phase 010 and the subtree gate.
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-013 [P1] The batch contains only playbook paths and their active path references.
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

Accept only when the 440-name inventory, semantic map, consumer closure, scenario invariants, and category/scenario parity are evidenced.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the SOL verifier confirms the manual-testing-playbook tree is kebab-clean and all intended scenarios remain addressable.
<!-- /ANCHOR:sign-off -->

