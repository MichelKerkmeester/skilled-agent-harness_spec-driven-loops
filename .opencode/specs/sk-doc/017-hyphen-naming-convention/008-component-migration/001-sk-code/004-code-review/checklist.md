---
title: "Checklist: code-review filesystem names (017 phase 008/004)"
description: "Blocking SOL verification contract for the code-review rename and review-scenario path closure."
trigger_phrases:
  - "code-review naming checklist"
  - "review mode rename verification"
  - "review scenario path verification"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/017-hyphen-naming-convention/008-component-migration/001-sk-code/004-code-review"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-hyphen-naming-convention/008-component-migration/001-sk-code/004-code-review"
    last_updated_at: "2026-07-14T18:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored code-review SOL checklist"
    next_safe_action: "Verify the review packet closure against BASE"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Checklist: code-review filesystem names

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking SOL verifier contract for the code-review child. The report pins candidate SHA, BASE SHA, frozen-map hash, commands, exit codes, asset/category/scenario counts, benchmark paths, and exemption results. A zero scenario discovery result fails the phase, and verification must leave no unexpected tracked mutation.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] The candidate is on the pinned BASE worktree with the review baseline, prior handoffs, and clean isolated index attached.
- [ ] CHK-002 [P2] The report records the map hash, pre-change review candidate count, scenario IDs/counts, and benchmark classification.
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-003 [P1] Changes are limited to code-review and its declared shared/surface path closure.
- [ ] CHK-004 [P0] Review rules, findings identifiers, security criteria, exact names, generated output, keys, frontmatter fields, and frozen history retain their contracts.
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-005 [P0] Every review asset, category, scenario, reference, and benchmark candidate has one disposition and every renamed target is kebab-case.
- [ ] CHK-006 [P0] SKILL.md, README.md, indexes, scenario links, shared/surface references, and benchmark paths resolve with no active old basename.
- [ ] CHK-007 [P0] Scenario IDs/discovery counts and findings-first, security, correctness, and review-state behavior match BASE.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-008 [P1] No in-scope snake_case filesystem name remains under code-review and no scenario was lost or duplicated.
- [ ] CHK-009 [P1] The final report records every cross-component edge for the 009 subtree gate.
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-010 [P0] Security/correctness minimums and review path boundaries remain unchanged; no security scenario is silently excluded.
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-011 [P2] Review-mode docs, scenario indexes, resource references, and the child packet record final paths and evidence.
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-012 [P1] The review closure is path-scoped and dependency-closed, with no unrelated quality, Webflow, or hub-playbook cleanup.
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

Accept the child only when every P0 check passes, review scenario parity is proven, security and findings behavior are unchanged, all links resolve, and the final diff is scope-clean.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

The SOL verifier signs off only after the evidence report pins the map and baseline and git diff-index --quiet HEAD -- shows no unexpected tracked mutation after verification.
<!-- /ANCHOR:sign-off -->
