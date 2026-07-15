---
title: "Checklist: sk-doc hub root and shared backbone"
description: "Blocking SOL verifier contract for the sk-doc hub/shared kebab-case rename phase."
trigger_phrases:
  - "sk-doc hub shared checklist"
  - "shared backbone rename verification"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/019-hyphen-naming-convention/008-component-migration/003-sk-doc/001-hub-root-and-shared"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-hyphen-naming-convention/008-component-migration/003-sk-doc/001-hub-root-and-shared"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored hub shared checklist"
    next_safe_action: "Run the hub shared verifier"
    blockers: []
    key_files: [".opencode/skills/sk-doc/shared/", ".opencode/skills/sk-doc/scripts/"]
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Checklist: sk-doc hub root and shared backbone

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking SOL verifier contract for phase 001. The verifier pins BASE, candidate SHA, and the phase rename-map hash, records commands and exit codes, checks discovery-count parity, and fails on an unknown path class or unexpected tracked mutation.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] BASE census records every shared asset/reference/script candidate and every root facade symlink target.
- [ ] CHK-002 [P1] The eleven non-exempt target rows and their consumer search terms are recorded before renames.
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-003 [P0] Only the scoped shared paths and their path consumers changed; no adjacent packet cleanup is present.
- [ ] CHK-004 [P1] Python names, Python package directories, tool-mandated names, keys, identifiers, and frontmatter fields are unchanged.
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-005 [P0] The manifest accounts for `changelog_template.md`, `frontmatter_templates.md`, `llmstxt_templates.md`, `skill_contract.json`, `template_rules.json`, `core_standards.md`, `evergreen_packet_id_rule.md`, `frontmatter_versioning.md`, `hvr_rules.md`, `quick_reference.md`, and `skill_contract.cjs` exactly once.
- [ ] CHK-006 [P0] Searches find no stale live reference to an old shared path, and every target resolves from hub and create-* consumers.
- [ ] CHK-007 [P1] Facade symlink targets, link modes, and representative dispatch behavior match BASE.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-008 [P1] Every changed path has a semantic target, collision result, and reference-closure evidence in the verifier report.
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-009 [P2] No executable permission, sandbox boundary, or allowlist changed outside the intended shared path updates.
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-010 [P1] `spec.md`, `plan.md`, `tasks.md`, the decision record, and the candidate rename manifest agree on the same eleven-name scope.
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-011 [P1] The rename and reference changes are in a path-scoped, dependency-closed commit with no scratch artifacts.
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase passes only when all P0 checks pass, all eleven non-exempt names are accounted for, facade parity is proven, and the report records zero unknown classifications or unexpected tracked mutations.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Sign-off requires the SOL verifier's candidate/BASE/map receipts and a clean scoped diff after verification.
<!-- /ANCHOR:sign-off -->
