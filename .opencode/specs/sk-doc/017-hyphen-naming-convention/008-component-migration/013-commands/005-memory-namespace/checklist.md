---
title: "Checklist: memory command namespace naming (017 phase 008/013/005)"
description: "Blocking SOL verification contract for the memory presentation asset rename and reference closure."
trigger_phrases:
  - "memory namespace naming checklist"
  - "memory asset rename verification"
  - "memory presentation path verification"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/017-hyphen-naming-convention/008-component-migration/013-commands/005-memory-namespace"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-hyphen-naming-convention/008-component-migration/013-commands/005-memory-namespace"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored memory namespace checklist"
    next_safe_action: "Verify the memory presentation closure against BASE"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Checklist: Memory command namespace naming

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking SOL verifier contract for the memory child. The report pins candidate SHA, BASE SHA, frozen map hash, four-asset counts, flow outcomes, reference results, and path-scoped diff. A zero-file or zero-scenario result is a failure.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] The candidate includes the memory handoff, isolated index, and four-row asset map.
- [ ] CHK-002 [P2] The report records the pre-change asset count, BASE SHA, candidate SHA, and rename-map hash.
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-003 [P1] The change is limited to `.opencode/commands/memory/` and its proven path/reference closure; no sibling cleanup is included.
- [ ] CHK-004 [P0] No memory tool ID, plugin name, data/YAML key, frontmatter field, Python/package name, generated output, tool-mandated name, or frozen history changed.
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-005 [P0] All four presentation sources have exactly one kebab-case target, every target exists, and exact/casefold/NFC collision checks pass.
- [ ] CHK-006 [P0] Learn, manage, save, and search command/README presentation paths resolve with no active old asset path.
- [ ] CHK-007 [P0] Memory presentation and tool-flow outcomes match the BASE evidence for all four commands.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-008 [P1] The consumer inventory covers all four commands, README, asset-local links, tests, and dynamic path sites; each non-path occurrence has a disposition.
- [ ] CHK-009 [P1] The final manifest contains no in-scope snake_case memory presentation asset and the report pins the path-scoped diff.
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-010 [P2] Memory tool grants, plugin boundaries, mutation gates, sandbox posture, and executable bits are unchanged except for required path literals.
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-011 [P2] Memory command asset tables and the phase packet record the final kebab-case paths and evidence.
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-012 [P1] Memory asset renames and reference rewrites land as one dependency-closed, path-scoped batch with no scratch or unrelated files.
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

Accept the child only when every P0 check passes, all four map rows and active references resolve, memory behavior matches BASE, and the final diff is scope-clean.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

The SOL verifier signs off only after the report contains the required receipts and `git diff-index --quiet HEAD --` shows no unexpected tracked mutation after verification.
<!-- /ANCHOR:sign-off -->
