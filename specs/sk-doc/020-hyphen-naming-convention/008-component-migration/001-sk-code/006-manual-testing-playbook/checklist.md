---
title: "Checklist: sk-code manual-testing-playbook tree (020 phase 008/006)"
description: "Blocking SOL verification contract for the hub-level sk-code playbook rename and scenario graph closure."
trigger_phrases:
  - "manual playbook naming checklist"
  - "sk-code scenario rename verification"
  - "playbook corpus parity"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/008-component-migration/001-sk-code/006-manual-testing-playbook"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/008-component-migration/001-sk-code/006-manual-testing-playbook"
    last_updated_at: "2026-07-14T18:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored manual playbook SOL checklist"
    next_safe_action: "Verify the hub playbook closure against BASE"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Checklist: sk-code manual-testing-playbook tree

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking SOL verifier contract for the hub playbook child. The report pins candidate SHA, BASE SHA, frozen-map hash, commands, exit codes, root/category/scenario counts, scenario IDs, link results, and corpus discovery. Zero scenarios or an unexpected count is a failure, and verification must leave no unexpected tracked mutation.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] The candidate is on the pinned BASE worktree with scenario baseline, component ownership handoffs, and a clean isolated index.
- [ ] CHK-002 [P2] The report records the map hash, root/category/file manifest, scenario IDs/counts, empty-category dispositions, and corpus baseline.
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-003 [P1] Changes are limited to the hub-level playbook and its declared path/reference closure.
- [ ] CHK-004 [P0] Scenario IDs, prompts, expected outcomes/resources, identifiers, keys, exact names, generated output, Python/package exemptions, and frozen history retain their contracts.
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-005 [P0] Every root, category, scenario, and empty-directory candidate has one disposition and every renamed target is kebab-case.
- [ ] CHK-006 [P0] Root/category index links, scenario links, benchmark README paths, asset entries, and cross-surface references resolve.
- [ ] CHK-007 [P0] Scenario IDs, category membership, counts, and benchmark corpus discovery match BASE with no loss or duplication.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-008 [P1] No in-scope snake_case filesystem name remains in the hub-level playbook tree and no active old basename remains in consumers.
- [ ] CHK-009 [P1] The final report hands off component-local playbook and benchmark-storage boundaries to the sibling phases.
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-010 [P2] Scenario sandbox paths, evidence requirements, tool restrictions, and manual-test safety rules are unchanged beyond path literals.
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-011 [P2] The hub docs, benchmark corpus pointer, scenario indexes, and child packet record final paths and evidence.
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-012 [P1] The playbook graph closure is path-scoped and dependency-closed, with no component-local playbook or benchmark-storage rename.
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

Accept the child only when every P0 check passes, scenario and corpus parity is proven, all links resolve, ownership/exemptions are intact, and the final diff is scope-clean.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

The SOL verifier signs off only after the evidence report pins the map and baseline and git diff-index --quiet HEAD -- shows no unexpected tracked mutation after verification.
<!-- /ANCHOR:sign-off -->
