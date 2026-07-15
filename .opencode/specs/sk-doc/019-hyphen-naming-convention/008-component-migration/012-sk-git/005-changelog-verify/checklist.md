---
title: "Checklist: sk-git changelog verification (017 phase 008/012/005)"
description: "Blocking SOL verification contract for the read-only sk-git migration changelog and version-bump phase."
trigger_phrases:
  - "sk-git changelog checklist"
  - "017 version bump verification"
  - "migration release evidence acceptance"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/019-hyphen-naming-convention/008-component-migration/012-sk-git/005-changelog-verify"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-hyphen-naming-convention/008-component-migration/012-sk-git/005-changelog-verify"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored the SOL verifier contract for the changelog verification phase"
    next_safe_action: "Run the read-only checklist after sibling phases land"
    blockers: []
    key_files:
      - ".opencode/skills/sk-git/changelog/"
      - ".opencode/skills/sk-git/SKILL.md"
      - ".opencode/skills/sk-git/README.md"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Checklist: sk-git changelog verification

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking SOL verifier contract for phase 005. The verifier pins the candidate SHA and sibling evidence hashes, records read-only commands and exit codes, and fails on missing release evidence, contradictory claims, or any phase mutation.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Sibling phases 001 through 004 have final evidence reports and their map/scope counts are recorded.
- [ ] CHK-002 [P0] The current version sources and expected changelog path are recorded before comparison: SKILL.md/README.md at 1.3.1.0, target entry at v1.3.2.0.
- [ ] CHK-003 [P1] The phase is explicitly read-only and has no rename, edit, release, tag, or version-bump mutation authority.
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-004 [P0] The changelog's source/target, scope, and exemption claims match sibling evidence; no generic or unsupported summary passes.
- [ ] CHK-005 [P1] Version values are compared literally across changelog/v1.3.2.0.md, SKILL.md, and README.md.
- [ ] CHK-006 [P1] The entry does not claim Python, package, tool-mandated, key, field, frozen, or other excluded names were renamed.
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-007 [P0] changelog/v1.3.2.0.md exists and has a v1.3.2.0 heading that identifies the sk-git kebab-case migration.
- [ ] CHK-008 [P0] The entry names references, assets, manual-testing-playbook, and benchmark work and matches all four sibling maps/checklists.
- [ ] CHK-009 [P0] SKILL.md and README.md expose version 1.3.2.0, matching the changelog entry.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-010 [P1] Every changelog path claim is reconciled to a sibling evidence path or explicit exemption; no phase is omitted.
- [ ] CHK-011 [P1] The candidate report proves phase 005 made no tracked mutation before or after verification.
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-012 [P2] No release credential, tag, remote, version file, or executable behavior was changed during verification.
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-013 [P1] spec.md, plan.md, tasks.md, and the candidate evidence report agree that this phase is read-only.
- [ ] CHK-014 [P2] The phase outcome is linked from the parent map and the 017 convention remains the only naming-policy source.
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-015 [P1] Verification is run against the pinned candidate with an empty phase diff; no changelog or scratch artifact is authored by this leaf.
- [ ] CHK-016 [P1] No implementation-summary.md or scratch/ remains in this leaf.
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase is complete only when all P0 checks pass, the v1.3.2.0 entry matches the four sibling phases and version consumers, the exemption boundary is accurate, and the read-only no-mutation proof is clean.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the SOL verifier confirms changelog/version consistency, evidence parity, exemption accuracy, and zero mutation from phase 005.
<!-- /ANCHOR:sign-off -->
