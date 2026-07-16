---
title: "Checklist: sk-code changelog and version verification (032 phase 008/008)"
description: "Blocking SOL verification contract for the sk-code changelog entry, rename-set coverage, version coherence, exemption boundary, and non-mutating handoff to phase 009."
trigger_phrases:
  - "sk-code changelog verification checklist"
  - "sk-code release evidence verifier"
  - "sk-code version coherence checklist"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/032-hyphen-naming-convention/008-component-migration/001-sk-code/008-changelog-verify"
_memory:
  continuity:
    packet_pointer: "sk-doc/032-hyphen-naming-convention/008-component-migration/001-sk-code/008-changelog-verify"
    last_updated_at: "2026-07-14T18:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored changelog SOL checklist"
    next_safe_action: "Verify the sk-code release evidence"
    blockers: []
    key_files:
      - ".opencode/skills/sk-code/changelog/"
      - ".opencode/skills/sk-code/SKILL.md"
      - ".opencode/skills/sk-code/README.md"
      - "../009-skill-gate/checklist.md"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Checklist: sk-code changelog and version verification

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking SOL verifier contract for phase 008. The verifier pins candidate and BASE SHAs, the
rename-map hash, the 001-007 evidence matrix, the candidate version, commands, and exit codes. Missing release
coverage, stale claims, version drift, historical mutation, or any filesystem rename fails the phase and blocks 009.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Phases 001-007 have completed checklist evidence and handoffs, and the candidate is tied to the pinned BASE worktree.
- [ ] CHK-002 [P1] Candidate SHA, BASE SHA, rename-map hash, BASE version `4.1.0.0`, candidate version/date, and history baseline are recorded.
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-003 [P0] A new append-only changelog entry exists; an old historical entry is not misidentified as the migration release.
- [ ] CHK-004 [P0] The entry covers the actual 001-007 rename surfaces, path/reference repair, and the 032 Python/package, tool-mandated, generated/lockfile, key/frontmatter, and frozen exemptions.
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-005 [P0] The candidate version is greater than `4.1.0.0` and agrees across the changelog, `SKILL.md`, `README.md`, and every active declared metadata surface.
- [ ] CHK-006 [P0] Changelog claims match the 001-007 handoffs and include the applicable validation, discovery, parity, and reference-repair evidence.
- [ ] CHK-007 [P1] Existing historical changelog files and narratives are byte-for-byte unchanged from BASE.
- [ ] CHK-008 [P1] The evidence matrix records inspected paths, commands, exit codes, version values, coverage verdicts, and all unresolved findings.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-009 [P1] No 001-007 concern is absent from the release entry, and no changelog claim exceeds the recorded migration scope.
- [ ] CHK-010 [P1] Missing coverage, version mismatch, or stale evidence is fail-closed and handed to 009 rather than silently repaired here.
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-011 [P2] Verification did not alter executable policy, tool allowlists, code identifiers, data keys, frontmatter fields, generated output, or frozen provenance.
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-012 [P1] The release-evidence matrix identifies every inspected changelog/version file and gives 009 a complete pass/block handoff.
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-013 [P1] The verification pass performs no filesystem rename, unrelated changelog rewrite, scratch creation, or implementation-summary scaffold retention.
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase passes only when the new entry covers the complete 001-007 rename set, preserves the exemption boundary,
matches active version metadata above BASE, leaves frozen history unchanged, and supplies a reproducible handoff to 009.
Otherwise the release-evidence result is blocking.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the SOL verifier records coherent release evidence, central validation is green, and
`git diff-index --quiet HEAD --` shows no unexpected tracked mutation beyond the authorized packet documentation.
This phase performs no rename or changelog repair.
<!-- /ANCHOR:sign-off -->

