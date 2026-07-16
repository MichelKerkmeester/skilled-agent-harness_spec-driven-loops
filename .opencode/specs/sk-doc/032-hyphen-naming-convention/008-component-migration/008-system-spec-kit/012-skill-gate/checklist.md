---
title: "Checklist: System-spec-kit skill gate (032 subtree 008 phase 012)"
description: "This rollup gate aggregates phases 001-011 and verifies that the complete system-spec-kit naming surface is kebab-clean outside the declared exemption set. It adds no migration work: acceptance depends on sibling evidence, a scope-aware whole-tree scan, reference closure, and coherent release evidence."
trigger_phrases:
  - "system-spec-kit skill gate"
  - "system-spec-kit subtree naming gate"
  - "kebab-clean system-spec-kit"
  - "system-spec-kit phase 012"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/032-hyphen-naming-convention/008-component-migration/008-system-spec-kit"
_memory:
  continuity:
    packet_pointer: "sk-doc/032-hyphen-naming-convention/008-component-migration/008-system-spec-kit/012-skill-gate"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored system-spec-kit gate checklist"
    next_safe_action: "Aggregate phases 001-011 and run the scope-aware naming gate"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Checklist: System-spec-kit skill gate

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking SOL verifier contract for phase 012. The verifier records candidate/base SHA, sibling status, scan roots and exclusions, commands, exit codes, unresolved-reference output, exemption ledger, and release evidence before accepting the subtree.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Phases 001-011 have complete evidence-pinned checklists and ledgers.
- [ ] CHK-002 [P0] Candidate/base context and the canonical exemption set are pinned.
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-003 [P0] Sibling statuses are reconciled with no stale or contradictory result.
- [ ] CHK-004 [P0] The whole-tree scan separates filesystem names from identifiers, keys, prose, and declared exemptions.
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-005 [P0] Every sibling phase 001-011 has a passing acceptance result.
- [ ] CHK-006 [P0] No in-scope snake_case filesystem name remains under system-spec-kit.
- [ ] CHK-007 [P0] No unresolved active path, link, registry, manifest, runner, or path-valued consumer remains.
- [ ] CHK-008 [P0] Every residual underscore-bearing name is an allowed exemption; unknown dispositions fail the gate.
- [ ] CHK-009 [P1] Phase 010 zero-candidate and phase 011 changelog/version evidence are included.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-010 [P0] The sibling-status matrix covers all 12 phases, including this rollup gate.
- [ ] CHK-011 [P0] The final scan and reference ledger have zero unresolved active findings.
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-012 [P2] The rollup does not broaden scope by treating generated, lockfile, vector/checkpoint, Python, test-magic, tool, or frozen names as candidates.
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-013 [P1] Final scan output, sibling matrix, exemption ledger, unresolved-reference report, and release evidence are retained for the parent handoff.
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-014 [P1] Phase 012 adds no migration or source-file changes; the rollup consists of evidence only.
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

Accept only when all sibling phases pass, the whole system-spec-kit naming surface is kebab-clean within the exemption set, active references resolve, and no unknown disposition remains.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the SOL verifier confirms the 008 system-spec-kit subtree is clean, referenced, disposition-complete, and ready for the parent packet.
<!-- /ANCHOR:sign-off -->

