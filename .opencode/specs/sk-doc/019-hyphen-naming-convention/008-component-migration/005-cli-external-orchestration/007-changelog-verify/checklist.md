---
title: "Checklist: cli-external-orchestration changelog and version verification (017 phase 005.007)"
description: "Blocking SOL verifier contract for the cli-external-orchestration release phase: entry existence, rename-set coverage, version coherence, frozen-history protection, and phase 008 handoff."
trigger_phrases:
  - "cli-external changelog verification checklist"
  - "cli-external release evidence verifier"
  - "cli-external phase 007 acceptance"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/019-hyphen-naming-convention/008-component-migration/005-cli-external-orchestration/007-changelog-verify"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-hyphen-naming-convention/008-component-migration/005-cli-external-orchestration/007-changelog-verify"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored changelog verifier"
    next_safe_action: "Run the release-evidence checklist"
    blockers: []
    key_files:
      - ".opencode/skills/cli-external-orchestration/changelog/"
      - ".opencode/skills/cli-external-orchestration/cli-opencode/changelog/"
      - ".opencode/skills/cli-external-orchestration/cli-claude-code/changelog/"
      - ".opencode/skills/cli-external-orchestration/cli-codex/changelog/"
      - ".opencode/skills/cli-external-orchestration/description.json"
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "The root 1.1.0.0 metadata versus v1.2.0.0 history mismatch is a known baseline finding to verify or block."
---
# Checklist: cli-external-orchestration changelog and version verification

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking SOL verifier contract for phase 007. The verifier pins candidate and BASE SHAs, records the four-surface release-evidence matrix and command exit codes, compares new entries with phases 001–006, and fails on missing coverage, stale rename claims, unresolved version drift, historical-file mutation, or any migration edit.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Phases 001–006 have passed their blocking checklist contracts and final maps/evidence are available
- [ ] CHK-002 [P1] Candidate release date/version values, candidate SHA, BASE SHA, and historical changelog baselines are recorded
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-003 [P0] A new migration entry exists for the hub, cli-opencode, cli-claude-code, and cli-codex surfaces; old history is not misidentified as new evidence
- [ ] CHK-004 [P0] Each entry's rename list, exemption boundary, and file references match phases 001–006 without claiming code/data-key changes
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-005 [P0] Each new filename/version matches its active `SKILL.md`/descriptor metadata; root `description.json` and the current 1.1.0.0 versus v1.2.0.0 mismatch are explicitly resolved or blocking
- [ ] CHK-006 [P0] Entries cover the hub boundary, three component maps, four playbook trees, benchmark result, and preserved Python/package/tool/generated/frozen exemptions
- [ ] CHK-007 [P1] Historical changelog files and narratives are byte-for-byte unchanged from BASE
- [ ] CHK-008 [P1] The release-evidence matrix records commands, exit codes, paths, versions, coverage verdicts, and unresolved findings
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-009 [P1] No phase 001–006 concern is absent from release evidence, and no entry claims a path outside its recorded map
- [ ] CHK-010 [P1] Any missing entry or version mismatch is fail-closed and handed to the release owner; this phase performs no changelog repair or rename
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-011 [P2] Verification did not alter executable policy, tool allowlists, data keys, frontmatter fields, generated output, or historical provenance
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-012 [P1] The release-evidence matrix and phase 008 handoff identify every inspected changelog and active metadata file
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-013 [P1] The verification pass adds no migration edit, scratch directory, or implementation-summary scaffold artifact to the assigned packet
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase passes only when all four surfaces have new entries covering the actual rename set, versions are coherent, and historical files remain unchanged. Otherwise it returns a blocking release-evidence result to phase 008.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the SOL verifier records coherent release evidence for all four surfaces, central validation is green, and phase 008 has received the pass/block matrix. This phase performs no rename or changelog repair.
<!-- /ANCHOR:sign-off -->

