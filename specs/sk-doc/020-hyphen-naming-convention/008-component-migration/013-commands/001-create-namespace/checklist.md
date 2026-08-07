---
title: "Checklist: create command namespace naming (020 phase 008/013/001)"
description: "Blocking SOL verification contract for the create command asset rename and reference closure."
trigger_phrases:
  - "create namespace naming checklist"
  - "create asset rename verification"
  - "create command path verification"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/008-component-migration/013-commands/001-create-namespace"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/008-component-migration/013-commands/001-create-namespace"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored create namespace checklist"
    next_safe_action: "Verify the create asset closure against BASE"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Checklist: Create command namespace naming

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking SOL verifier contract for the create child. The report pins the candidate SHA, BASE SHA, frozen rename-map hash, commands-reference scan, asset counts, mode outcomes, and path-scoped diff. A zero-file or zero-scenario result is a failure.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] The candidate is on the pinned BASE worktree with the create handoff, isolated index, and 30-row map attached.
- [ ] CHK-002 [P2] The report records the pre-change asset count, BASE SHA, candidate SHA, and rename-map hash.
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-003 [P1] The change is limited to `.opencode/commands/create/` and its proven path/reference closure; no sibling namespace cleanup is included.
- [ ] CHK-004 [P0] No command ID, YAML key, frontmatter field, Python/package name, generated output, tool-mandated name, or frozen history changed.
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-005 [P0] All 30 listed `create_*` asset sources have exactly one kebab-case target, every target exists, and exact/casefold/NFC collision checks pass.
- [ ] CHK-006 [P0] Every create command's auto, confirm, and presentation path resolves, and the command-reference scan reports no active old asset path or missing target.
- [ ] CHK-007 [P0] The post-change mode and presentation outcomes match the BASE evidence for agent, benchmark, changelog, command, feature-catalog, flowchart, manual-testing-playbook, readme, skill, and skill-parent workflows.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-008 [P1] The consumer inventory covers command markdown, `README.txt`, asset-local links, tests, install guides, and any dynamic path site; every non-path occurrence has a disposition.
- [ ] CHK-009 [P1] The final manifest contains no in-scope snake_case create asset and the candidate report pins the path-scoped diff.
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-010 [P2] Allowed tools, workflow gates, sandbox boundaries, and executable bits are unchanged except for required path literals.
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-011 [P2] Create command indexes, asset tables, and the phase packet record the final kebab-case paths and evidence.
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-012 [P1] The asset renames and reference rewrites land as one dependency-closed, path-scoped batch with no scratch or unrelated files.
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

Accept the child only when every P0 check passes, all 30 map rows and active references are resolved, create mode behavior matches BASE, and the final diff is scope-clean.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

The SOL verifier signs off only after the report contains the required receipts and `git diff-index --quiet HEAD --` shows no unexpected tracked mutation after verification.
<!-- /ANCHOR:sign-off -->
