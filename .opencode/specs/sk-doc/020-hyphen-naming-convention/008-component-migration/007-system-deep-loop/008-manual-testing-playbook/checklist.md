---
title: "Checklist: system-deep-loop manual-testing-playbook names (020 phase 007/008)"
description: "Blocking SOL verification contract for the root manual-testing-playbook tree, its five categories, scenario corpus, and reference closure."
trigger_phrases:
  - "system-deep-loop manual testing playbook checklist"
  - "manual-testing-playbook naming verification"
  - "deep loop scenario rename"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/008-component-migration/007-system-deep-loop/008-manual-testing-playbook"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/008-component-migration/007-system-deep-loop/008-manual-testing-playbook"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored playbook checklist"
    next_safe_action: "Verify playbook tree"
    blockers: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Checklist: System-deep-loop manual-testing-playbook names

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking SOL verifier contract for the root manual-testing-playbook child. The report pins the candidate SHA, BASE SHA, frozen-map hash, commands, exit codes, the root plus five category directories, the 20 underscore-bearing files, and the 19-scenario corpus. Verification must leave no unexpected tracked mutation.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] The candidate is on the pinned BASE worktree with a clean isolated index and root manual-testing-playbook ownership is attached.
- [ ] CHK-002 [P2] The report records BASE SHA, candidate SHA, frozen-map hash, category/scenario manifest, index ownership, and protected-name manifest.
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-003 [P1] The change is limited to the root manual-testing-playbook tree and its dependency-closed references; component-local playbooks are not pulled into this phase.
- [ ] CHK-004 [P0] Scenario identifiers, headings, step text, expected results, tool-mandated names, Python/package names, and other non-filesystem content were not changed as part of the rename.
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-005 [P0] Every one of the 20 candidate files and all five category directories has exactly one rename, exempt, frozen, or tool-mandated disposition with no unknown row or collision.
- [ ] CHK-006 [P0] The playbook index, every scenario path, category link, root benchmark reference, and router reference resolves after the rename.
- [ ] CHK-007 [P0] The scenario corpus remains complete at 19 scenarios, scenario IDs/categories remain stable, and manual checks execute non-trivially with D5 coverage where applicable.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-008 [P1] All old in-scope playbook basenames in links, indexes, scripts, and documentation have an explicit disposition; no stale root-playbook basename remains.
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-009 [P2] Scenario content, prompt boundaries, tool permissions, and any destructive-operation guard remain unchanged except for required path values.
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-010 [P2] The category/scenario map, exemption decisions, path evidence, and final corpus count are recorded in the phase report and packet docs.
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-011 [P1] The rename/reference change is one dependency-closed root-playbook batch with no nested component playbook files and no unrelated scenario edits.
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

Accept this child only when every P0 item passes, all 19 scenarios remain reachable and stable, the five-category tree is complete, and the final diff is scope-clean.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

The SOL verifier signs off only after the report contains the required receipts and git diff-index --quiet HEAD -- shows no unexpected tracked mutation after verification.
<!-- /ANCHOR:sign-off -->
