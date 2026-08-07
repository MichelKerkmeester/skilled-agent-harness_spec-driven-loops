---
title: "Checklist: code-webflow filesystem names (020 phase 008/005)"
description: "Blocking SOL verification contract for the code-webflow rename and Webflow asset/reference closure."
trigger_phrases:
  - "code-webflow naming checklist"
  - "Webflow packet rename verification"
  - "Webflow asset link verification"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/008-component-migration/001-sk-code/005-code-webflow"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/008-component-migration/001-sk-code/005-code-webflow"
    last_updated_at: "2026-07-14T18:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored code-webflow SOL checklist"
    next_safe_action: "Verify the Webflow packet closure against BASE"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Checklist: code-webflow filesystem names

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking SOL verifier contract for the code-webflow child. The report pins candidate SHA, BASE SHA, frozen-map hash, commands, exit codes, asset/reference/scenario counts, symlink results, browser/resource outcomes, and benchmark paths. Zero discovered resources or scenarios is a failure, and verification must leave no unexpected tracked mutation.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] The candidate is on the pinned BASE worktree with Webflow/Motion.dev baseline evidence, prior handoffs, and a clean isolated index.
- [ ] CHK-002 [P2] The report records the map hash, pre-change candidate count, resource/scenario inventory, symlink manifest, and generated-output classification.
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-003 [P1] Changes are limited to code-webflow and its declared shared/mode/root path closure.
- [ ] CHK-004 [P0] Webflow runtime semantics, selectors/identifiers, exact names, keys, frontmatter fields, generated output, Python/package exemptions, and frozen history retain their contracts.
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-005 [P0] Every asset, playbook, reference, symlink, and benchmark candidate has one disposition and every renamed target is kebab-case.
- [ ] CHK-006 [P0] SKILL.md, README.md, asset indexes, deep reference links, playbook links, workflow symlinks, and benchmark paths resolve.
- [ ] CHK-007 [P0] WEBFLOW, Motion.dev, language/resource, and scenario discovery plus relevant browser/runtime smoke match BASE.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-008 [P1] No in-scope snake_case filesystem name remains under code-webflow and no asset/scenario/reference was lost or duplicated.
- [ ] CHK-009 [P1] The final report records all cross-component edges and the symlink target/mode comparison for the subtree gate.
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-010 [P2] Asset loading boundaries, browser/runtime safety checks, deployment guidance, and tool restrictions are unchanged beyond path literals.
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-011 [P2] Webflow-mode docs, indexes, asset/reference links, and the child packet record final paths and evidence.
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-012 [P1] The Webflow closure is path-scoped and dependency-closed, with no unrelated mode or root-playbook cleanup.
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

Accept the child only when every P0 check passes, Webflow/Motion.dev resource and scenario parity is proven, all links and symlinks resolve, exemptions are intact, and the final diff is scope-clean.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

The SOL verifier signs off only after the evidence report pins the map and baseline and git diff-index --quiet HEAD -- shows no unexpected tracked mutation after verification.
<!-- /ANCHOR:sign-off -->
