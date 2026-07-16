---
title: "Checklist: remove transition aliases (032 phase 009)"
description: "Blocking SOL verifier contract for phase 009: remove the bounded coexistence aliases after the physical migration and prove unsupported legacy names fail closed."
trigger_phrases:
  - "remove transition aliases checklist"
  - "hyphen naming phase 009 checklist"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/032-hyphen-naming-convention/009-remove-transition-aliases"
_memory:
  continuity:
    packet_pointer: "sk-doc/032-hyphen-naming-convention/009-remove-transition-aliases"
    last_updated_at: "2026-07-14T17:28:50Z"
    last_updated_by: "codex"
    recent_action: "Defined the blocking verifier checks for alias removal and fail-closed behavior"
    next_safe_action: "Run after phase 002 closure evidence is attached"
    blockers: []
    key_files:
      - ".opencode/specs/sk-doc/032-hyphen-naming-convention/002-root-name-consumer-migration/checklist.md"
      - ".opencode/specs/sk-doc/032-hyphen-naming-convention/009-remove-transition-aliases/spec.md"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Checklist: Remove transition aliases

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking SOL verifier contract for phase 009. The report pins the candidate SHA, the program BASE SHA, the phase 002 closure evidence, and the consumer-manifest revision; it records each command, exit code, fixture result, and consumer-row disposition. A zero-test or zero-consumer scan is a failure, not a pass.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Phase 002 evidence proves the bounded coexistence window is closed and the canonical physical roots are present.
- [ ] CHK-002 [P1] The candidate report records the pinned BASE SHA, candidate SHA, and complete phase 002 consumer manifest.
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-003 [P0] Every consumer-manifest row is edited or has an explicit evidence-backed non-consumer disposition; no live underscore alias remains.
- [ ] CHK-004 [P1] The changes stay within alias removal; code identifiers, JSON/YAML/TOML keys, frontmatter fields, policy exemptions, and frozen history are unchanged.
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-005 [P0] Canonical `feature-catalog` and `manual-testing-playbook` roots and indexes classify, load, route, package, and generate successfully with the expected typed results.
- [ ] CHK-006 [P0] Old underscore roots and indexes fail with an explicit error or non-zero result; no case is reclassified as `readme`, an empty scenario set, or an unrelated category.
- [ ] CHK-007 [P0] Mismatched root/index pairs and near-match names fail closed before discovery, classification, routing, or emission.
- [ ] CHK-008 [P0] A fixture containing both canonical and legacy physical roots is rejected as a conflict before any leaf is processed.
- [ ] CHK-009 [P1] Every removed alias has a negative fixture and every canonical path has a positive fixture, with results tied to the consumer-manifest row.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-010 [P1] A residual-string review distinguishes executable alias handling from intentional negative fixtures, migration evidence, and frozen history.
- [ ] CHK-011 [P1] The phase evidence bundle is complete enough for phase 010 to consume without rerunning an undocumented setup step.
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-012 [P2] No executable allowlist, sandbox posture, or path-boundary rule changed beyond the intended removal of transition aliases.
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-013 [P2] The phase spec, plan, tasks, and checklist describe the post-window canonical-only contract and its fail-closed evidence.
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-014 [P1] Alias-removal edits land in path-scoped, dependency-closed commits and do not include physical migration or adjacent cleanup.
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase is acceptable only when all P0 checks pass, every consumer row is accounted for, canonical behavior is green, and all unsupported legacy/conflict inputs fail loudly without silent downgrade. The report must preserve the evidence needed by the phase 010 whole-repo gate.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the SOL verifier confirms the P0 contract, records the pinned SHAs and manifest revision, and observes no unexpected tracked mutation after verification.
<!-- /ANCHOR:sign-off -->
