---
title: "Checklist: code-quality filesystem names (020 phase 008/003)"
description: "Blocking SOL verification contract for the code-quality rename and quality-mode path closure."
trigger_phrases:
  - "code-quality naming checklist"
  - "quality mode rename verification"
  - "quality checklist path verification"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/008-component-migration/001-sk-code/003-code-quality"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/008-component-migration/001-sk-code/003-code-quality"
    last_updated_at: "2026-07-14T18:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored code-quality SOL checklist"
    next_safe_action: "Verify the quality packet closure against BASE"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Checklist: code-quality filesystem names

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking SOL verifier contract for the code-quality child. The report pins candidate SHA, BASE SHA, frozen-map hash, commands, exit codes, candidate counts, quality resource loads, benchmark paths, and exemption results. Zero discovered resources or scenarios is a failure, and verification must leave no unexpected tracked mutation.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] The candidate is on the pinned BASE worktree with preceding handoffs, a clean isolated index, and baseline quality evidence attached.
- [ ] CHK-002 [P2] The report records the map hash, pre-change candidate count, quality resource list, and benchmark output classification.
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-003 [P1] Changes are limited to code-quality and its declared shared/surface path closure.
- [ ] CHK-004 [P0] Quality rules, check IDs, executable scripts, identifiers, keys, frontmatter fields, exact names, generated output, and frozen history retain their contracts.
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-005 [P0] Every checklist, playbook, benchmark, and reference candidate has one disposition and every renamed target is kebab-case.
- [ ] CHK-006 [P0] Quality-mode SKILL.md, README.md, checklist links, shared references, playbook paths, and benchmark paths resolve.
- [ ] CHK-007 [P0] Quality resource loading and gate outcomes match the BASE logical resource set and scenario evidence.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-008 [P1] No in-scope snake_case filesystem name remains under code-quality, and no old active basename remains in its path consumers.
- [ ] CHK-009 [P1] The final report records generated-output classification and all cross-component references for the subtree gate.
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-010 [P2] Quality gate enforcement, tool restrictions, path guards, and comment-hygiene behavior are unchanged beyond path literals.
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-011 [P2] Quality-mode docs, resource indexes, and the child packet record the final paths and evidence.
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-012 [P1] The quality-mode closure is path-scoped and dependency-closed, with no review, Webflow, or hub-playbook cleanup.
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

Accept the child only when every P0 check passes, quality resource and gate parity is proven, all links resolve, exemptions are intact, and the final diff is scope-clean.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

The SOL verifier signs off only after the pinned evidence report is complete and git diff-index --quiet HEAD -- shows no unexpected tracked mutation after verification.
<!-- /ANCHOR:sign-off -->
