---
title: "Checklist: sk-prompt manual-testing-playbook trees (032 phase 004.004)"
description: "Blocking SOL verifier contract for phase 004 of the sk-prompt kebab-case program: two playbook trees, active link closure, and scenario coverage parity."
trigger_phrases:
  - "sk-prompt manual testing playbook checklist"
  - "sk-prompt phase 004 verifier"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/032-hyphen-naming-convention/008-component-migration/004-sk-prompt/004-manual-testing-playbook"
_memory:
  continuity:
    packet_pointer: "sk-doc/032-hyphen-naming-convention/008-component-migration/004-sk-prompt/004-manual-testing-playbook"
    last_updated_at: "2026-07-14T18:04:33Z"
    last_updated_by: "codex"
    recent_action: "Authored the SOL verifier contract for both sk-prompt playbook trees"
    next_safe_action: "Run the checklist against the candidate phase commit"
    blockers: []
    key_files:
      - ".opencode/skills/sk-prompt/manual_testing_playbook/"
      - ".opencode/skills/sk-prompt/prompt-improve/manual_testing_playbook/"
      - ".opencode/skills/sk-prompt/SKILL.md"
      - ".opencode/skills/sk-prompt/prompt-improve/SKILL.md"
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "The hub playbook has four SP scenarios and prompt-improve has 27 scenarios."
---
# Checklist: sk-prompt manual-testing-playbook trees

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking SOL verifier contract for phase 004. The verifier pins candidate and BASE SHAs, records
the two-tree path map and scenario-manifest hash, captures commands and exit codes, and fails on missing scenarios,
stale active links, unknown dispositions, zero-file scans, or mutations outside playbook ownership.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Phase 003 handoff is complete and the candidate worktree is clean and pinned to BASE
- [ ] CHK-002 [P2] Candidate SHA, BASE SHA, path-map hash, and scenario-manifest hash are recorded in the verifier report
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-003 [P1] The diff is limited to the hub and prompt-improve playbook trees and their active consumers
- [ ] CHK-004 [P0] Scenario content, IDs, category semantics, identifiers, data keys, and tool-mandated names remain unchanged
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-005 [P0] Both roots, hub `hub_routing/`, seven prompt-improve categories, and every underscore-separated scenario file have one kebab-case target
- [ ] CHK-006 [P0] Both indexes, both skill docs, both READMEs, and active scenario cross-references resolve with no stale source path
- [ ] CHK-007 [P0] Hub SP-001–SP-004 and the prompt-improve 27-scenario set match BASE by ID, count, and category membership
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-008 [P1] Frozen changelog references and generated benchmark paths are dispositioned without being rewritten
- [ ] CHK-009 [P1] The two-tree source-to-target map is bijective and covers all active playbook consumers
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-010 [P2] No executable policy, prompt-routing allowlist, secret, or acceptance rule changed beyond path-valued references
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-011 [P2] The phase docs record the two roots, seven categories, scenario-ID contract, and frozen/generated boundary
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-012 [P1] The two-tree rename is path-scoped and dependency-closed; no scratch directory or implementation-summary scaffold artifact remains
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase is complete when all P0 checks pass, both playbook roots and active references resolve, and scenario coverage
matches BASE exactly by identifier and category.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the SOL verifier confirms the P0 contract, central validation is green, and `git diff-index --quiet HEAD --`
shows no unexpected tracked mutation after verification.
<!-- /ANCHOR:sign-off -->
