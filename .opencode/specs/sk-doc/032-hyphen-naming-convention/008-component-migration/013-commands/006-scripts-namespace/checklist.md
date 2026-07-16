---
title: "Checklist: scripts command namespace naming (032 phase 008/013/006)"
description: "Blocking SOL verification contract for the scripts namespace audit, negative fixture preservation, and no-rename disposition."
trigger_phrases:
  - "scripts namespace naming checklist"
  - "command checker audit verification"
  - "scripts fixture preservation verification"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/032-hyphen-naming-convention/008-component-migration/013-commands/006-scripts-namespace"
_memory:
  continuity:
    packet_pointer: "sk-doc/032-hyphen-naming-convention/008-component-migration/013-commands/006-scripts-namespace"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored scripts namespace checklist"
    next_safe_action: "Verify scripts audit receipts"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Checklist: Scripts command namespace naming

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking SOL verifier contract for the scripts child. The report pins candidate SHA, BASE SHA, inventory counts, frozen-map hash, self-test output, live-scan output, and path-scoped diff. A no-rename result without these receipts is a failure.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] The candidate includes the scripts handoff, isolated inventory, and one disposition row for every file and directory.
- [ ] CHK-002 [P2] The report records the pre-change counts, BASE SHA, candidate SHA, and frozen-map hash.
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-003 [P1] The child contains no checker redesign, fixture rewrite, or sibling command-family change.
- [ ] CHK-004 [P0] No live command path, tool contract, data key, generated output, Python/package exemption, or intentionally broken fixture value was silently altered.
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-005 [P0] The scripts subtree name scan finds zero in-scope snake_case filesystem names.
- [ ] CHK-006 [P0] `validate-command-references.cjs --self-test` reports the expected three broken fixture classes and exits successfully.
- [ ] CHK-007 [P0] The default live-tree checker scan resolves cleanly, with output and exit status pinned.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-008 [P1] Every underscore-bearing fixture string has a documented negative-test or non-filesystem disposition.
- [ ] CHK-009 [P1] The final manifest, inventory, and scoped diff prove that zero physical rename rows were omitted.
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-010 [P2] Script executable bits, runtime roots, sandbox assumptions, and checker failure semantics are unchanged.
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-011 [P2] The phase packet records the no-rename disposition, fixture boundary, command outputs, and rollup handoff.
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-012 [P1] No scratch, implementation-summary, unrelated, or out-of-scope files remain in the child or its scoped evidence.
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

Accept the child only when every P0 check passes, the fixture still proves the failing path, the live scan is clean, and the no-rename result is backed by a complete inventory.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

The SOL verifier signs off only after the report contains all receipts and `git diff-index --quiet HEAD --` shows no unexpected tracked mutation after verification.
<!-- /ANCHOR:sign-off -->
