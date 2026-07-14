---
title: "Checklist: system-skill-advisor changelog verification"
description: "Blocking SOL acceptance contract for verifying the rename-set changelog entry, exemption boundary, sibling evidence, and matching version bump without migration edits."
trigger_phrases:
  - "changelog verification checklist"
  - "advisor release evidence checklist"
  - "version bump verification"
importance_tier: "critical"
contextType: "planning"
parent: "sk-doc/017-hyphen-naming-convention/008-component-migration/009-system-skill-advisor/007-changelog-verify"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-hyphen-naming-convention/008-component-migration/009-system-skill-advisor/007-changelog-verify"
    last_updated_at: "2026-07-14T18:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored the changelog SOL verifier contract"
    next_safe_action: "Run the checklist centrally after sibling migration evidence exists"
    blockers: []
    key_files:
      - ".opencode/skills/system-skill-advisor/changelog"
      - ".opencode/skills/system-skill-advisor/SKILL.md"
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "This authoring pass does not create a changelog entry or select the release version."
---

# Checklist: system-skill-advisor changelog verification

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking SOL verifier contract for phase 007. The report pins the candidate SHA, BASE SHA,
rename-map hash, release-entry path, canonical version source, sibling receipts, commands, and exit codes. Missing
release evidence or any migration mutation is a failure.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Sibling 001–006 checklists and phase 008 gate evidence are available and pinned
- [ ] CHK-002 [P0] The canonical skill version source, newest changelog entry, and release convention are identified
- [ ] CHK-003 [P2] Current changelog/version drift is recorded before comparison
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-004 [P1] Verification reads release evidence only and does not change source, paths, or unrelated history
- [ ] CHK-005 [P0] Every changelog claim maps to a sibling checklist or subtree-gate receipt
- [ ] CHK-006 [P1] Preserved exemptions and intentional historical mentions are distinguished from live migration debt
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-007 [P0] A newest changelog entry exists and names the MCP root, scripts, references, hooks, catalog, and playbook outcomes
- [ ] CHK-008 [P0] The entry states Python/package, tool-mandated/generated/lockfile, and identifier/key exemptions
- [ ] CHK-009 [P0] Changelog version/date/links agree with the canonical skill version and release decision
- [ ] CHK-010 [P1] The entry cites compatibility, link, discovery, and subtree-gate evidence with no unsupported claim
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-011 [P0] The release entry accounts for every sibling outcome, including the hooks no-rename/audit result when applicable
- [ ] CHK-012 [P1] The verification report names the exact release-entry path and each compared receipt
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-013 [P1] No verification step edits release history or bypasses the release owner's version decision
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-014 [P1] Changelog, SKILL, README, INSTALL_GUIDE, and packet evidence tell the same release story
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-015 [P1] The phase contains evidence only and no stray implementation summary or scratch directory remains in this leaf
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase passes only when the release entry exists, matches all sibling evidence and the canonical version source,
states the exemption boundary, and contains no unsupported migration claim.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the SOL verifier confirms release evidence parity and confirms that phase 007 performed no rename.
<!-- /ANCHOR:sign-off -->
