---
title: "Checklist: sk-prompt changelog and version verification (017 phase 004.006)"
description: "Blocking SOL verifier contract for phase 006 of the sk-prompt kebab-case program: release-entry existence, rename-set coverage, version coherence, and frozen-history protection."
trigger_phrases:
  - "sk-prompt changelog verification checklist"
  - "sk-prompt release evidence verifier"
  - "sk-prompt phase 006 acceptance"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/019-hyphen-naming-convention/008-component-migration/004-sk-prompt/006-changelog-verify"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-hyphen-naming-convention/008-component-migration/004-sk-prompt/006-changelog-verify"
    last_updated_at: "2026-07-14T18:04:33Z"
    last_updated_by: "codex"
    recent_action: "Authored the SOL verifier contract for changelog and version evidence"
    next_safe_action: "Run the checklist against the post-migration release candidate"
    blockers: []
    key_files:
      - ".opencode/skills/sk-prompt/changelog/"
      - ".opencode/skills/sk-prompt/prompt-improve/changelog/"
      - ".opencode/skills/sk-prompt/prompt-models/changelog/"
      - ".opencode/skills/sk-prompt/SKILL.md"
      - ".opencode/skills/sk-prompt/prompt-models/description.json"
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "The current prompt-models version metadata mismatch is a known baseline condition that must be resolved or explicitly block sign-off."
---

# Checklist: sk-prompt changelog and version verification

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking SOL verifier contract for phase 006. The verifier pins candidate and BASE SHAs, records
the release-evidence matrix and command exit codes, compares new entries with phases 001–005, and fails on missing
release coverage, stale rename claims, unresolved version drift, or historical-file mutation.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Phases 001–005 have passed their blocking checklist contracts and their final maps/evidence are available
- [ ] CHK-002 [P1] Candidate release date, version values, candidate SHA, BASE SHA, and historical changelog baseline are recorded
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-003 [P0] A new changelog entry exists for the hub, prompt-improve, and prompt-models release surfaces; an old history file is not misidentified as the migration entry
- [ ] CHK-004 [P0] Each entry's rename list, exemption boundary, and file references match the phase 001–005 maps without claiming code/data-key changes
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-005 [P0] Each new changelog filename/version matches the corresponding active `SKILL.md` and descriptor metadata, including the prompt-models version comparison
- [ ] CHK-006 [P0] The release entries explicitly cover the completed kebab-case rename set and the preserved Python, package-directory, tool-mandated, generated, and frozen exemptions
- [ ] CHK-007 [P1] Historical changelog files and historical narratives are byte-for-byte unchanged from BASE
- [ ] CHK-008 [P1] The release-evidence matrix records commands, exit codes, paths, versions, coverage verdicts, and all unresolved findings
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-009 [P1] No phase 001–005 concern is absent from the release evidence, and no changelog claim exceeds the recorded migration scope
- [ ] CHK-010 [P1] Any missing entry or version mismatch is fail-closed and handed to the release owner rather than silently corrected in this phase
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-011 [P2] Verification did not alter executable policy, tool allowlists, data keys, frontmatter fields, or historical provenance
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-012 [P1] The release-evidence matrix and phase 007 handoff identify every inspected changelog and metadata file
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-013 [P1] The verification pass adds no migration edits, scratch directory, or implementation-summary scaffold artifact to the skill surface
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase passes only when all P0 checks prove new entries exist, cover the actual rename set, agree with active version
metadata, and leave frozen history unchanged. Otherwise it returns a blocking release-evidence result to phase 007.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the SOL verifier records coherent release evidence for all three surfaces, central validation is green,
and phase 007 has received the pass/block matrix. This phase performs no rename or changelog repair.
<!-- /ANCHOR:sign-off -->
