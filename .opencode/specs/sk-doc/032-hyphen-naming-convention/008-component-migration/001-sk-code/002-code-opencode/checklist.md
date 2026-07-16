---
title: "Checklist: code-opencode filesystem names (032 phase 008/002)"
description: "Blocking SOL verification contract for the code-opencode rename and resource-reference closure."
trigger_phrases:
  - "code-opencode naming checklist"
  - "OpenCode packet rename verification"
  - "OpenCode exemption verification"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/032-hyphen-naming-convention/008-component-migration/001-sk-code/002-code-opencode"
_memory:
  continuity:
    packet_pointer: "sk-doc/032-hyphen-naming-convention/008-component-migration/001-sk-code/002-code-opencode"
    last_updated_at: "2026-07-14T18:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored code-opencode SOL checklist"
    next_safe_action: "Verify the OpenCode packet closure against BASE"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Checklist: code-opencode filesystem names

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking SOL verifier contract for the code-opencode child. The report pins candidate SHA, BASE SHA, frozen-map hash, commands, exit codes, candidate counts, resource-load results, and exemption manifests. A zero-file or zero-scenario result fails the phase, and verification must leave no unexpected tracked mutation.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] The candidate is on the pinned BASE worktree with the 001 shared handoff, clean isolated index, and OpenCode baseline attached.
- [ ] CHK-002 [P2] The report records the map hash, pre-change candidate count, .py/package exemption list, symlink manifest, and benchmark path list.
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-003 [P1] Changes are limited to code-opencode and its declared cross-component reference closure.
- [ ] CHK-004 [P0] SKILL.md, README.md, manifests, Python files/package directories, generated output, keys, identifiers, frontmatter fields, and frozen history retain their contracts.
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-005 [P0] Every asset, playbook, reference, symlink, and benchmark candidate has exactly one disposition and every renamed target is kebab-case.
- [ ] CHK-006 [P0] All OpenCode markdown/config/resource links and workflow symlinks resolve with no active old basename.
- [ ] CHK-007 [P0] TypeScript, Python, shell, Rust, JavaScript, and config discovery loads the same logical resources as BASE.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-008 [P1] The nested benchmark labels and manual-playbook paths resolve, and no in-scope snake_case name remains under code-opencode.
- [ ] CHK-009 [P1] The final path/reference manifest records every cross-component edge for the 009 subtree gate.
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-010 [P2] Resource guards, path traversal boundaries, allowed tool surfaces, and Python/package import behavior are unchanged beyond path literals.
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-011 [P2] Code-opencode SKILL.md, README.md, resource indexes, and the child packet contain the final paths and evidence.
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-012 [P1] The component rename/reference closure is path-scoped and dependency-closed, with no adjacent component cleanup.
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

Accept the child only when every P0 check passes, OpenCode resource discovery is at BASE parity, all exemptions are proven, all links resolve, and the final diff is scope-clean.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

The SOL verifier signs off only after the evidence report pins the map and baseline and git diff-index --quiet HEAD -- shows no unexpected tracked mutation after verification.
<!-- /ANCHOR:sign-off -->
