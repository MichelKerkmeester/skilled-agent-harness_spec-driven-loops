---
title: "Checklist: sk-doc changelog and version verification"
description: "Blocking SOL verifier contract for the sk-doc migration changelog and version-bump evidence."
trigger_phrases:
  - "sk-doc changelog verification checklist"
  - "sk-doc version bump verification"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/032-hyphen-naming-convention/008-component-migration/003-sk-doc/006-changelog-verify"
_memory:
  continuity:
    packet_pointer: "sk-doc/032-hyphen-naming-convention/008-component-migration/003-sk-doc/006-changelog-verify"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored changelog verify checklist"
    next_safe_action: "Run the changelog evidence verifier"
    blockers: []
    key_files: [".opencode/skills/sk-doc/changelog/", ".opencode/skills/sk-doc/SKILL.md"]
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Checklist: sk-doc changelog and version verification

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking SOL verifier contract for phase 006. The report pins BASE, candidate SHA, sibling-evidence set, and resolved version, records commands and exit codes, and fails if release evidence is missing, inconsistent, or accompanied by migration mutation from this phase.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Direct/nested sibling reports and the baseline latest changelog `v1.8.1.0` are collected.
- [ ] CHK-002 [P1] Candidate changelog path and resolved four-part version are pinned.
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-003 [P0] This phase changed only its documentation; no rename, `SKILL.md`, or release-file mutation was performed here.
- [ ] CHK-004 [P1] Historical changelog entries remain untouched and cited paths are treated as evidence, not rewritten during verification.
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-005 [P0] Exactly one new sk-doc changelog entry exists with a valid four-part version greater than `v1.8.1.0`.
- [ ] CHK-006 [P0] Entry scope covers the hub/shared, scripts, create-packet, root playbook, benchmark, and rollup evidence actually reported by siblings.
- [ ] CHK-007 [P1] Entry version matches post-migration `SKILL.md`, all cited paths resolve, and no old path is presented as live.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-008 [P1] Every release bullet maps to a sibling checklist/report and any omitted or unverified phase is explicit.
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-009 [P2] No release permission, executable mode, or sandbox boundary changed during verification.
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-010 [P1] The phase docs, changelog entry, sibling evidence, and `SKILL.md` version agree.
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-011 [P1] No implementation-summary or scratch artifact remains and no historical changelog file was rewritten.
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase passes only when changelog existence, scope, version synchronization, path accuracy, and no-mutation evidence all pass.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Sign-off requires the pinned release evidence, sibling reconciliation, and a clean documentation-only diff for this phase.
<!-- /ANCHOR:sign-off -->
