---
title: "Checklist: Design-md-generator (020 phase 006)"
description: "Blocking SOL verification contract for Design-md-generator in the 020 sk-design naming subtree."
trigger_phrases:
  - "design-md-generator verification"
  - "sk-design design-md-generator checklist"
  - "020 design-md-generator gate"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/008-component-migration/002-sk-design/006-design-md-generator"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/008-component-migration/002-sk-design/006-design-md-generator"
    last_updated_at: "2026-07-14T16:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored design-md-generator checklist"
    next_safe_action: "Execute phase on pinned worktree"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/design-md-generator/SKILL.md"
      - ".opencode/skills/sk-design/design-md-generator/references/"
      - ".opencode/skills/sk-design/design-md-generator/backend/"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Checklist: Design-md-generator (020 phase 006)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking SOL verifier contract for phase 006. Every item is a check the paired verify agent runs BEFORE the candidate phase is accepted; the report pins the candidate SHA and BASE SHA, records commands, exit codes, counts, and evidence, and fails on zero tests/scenarios or unexpected tracked mutation.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-006 [P0] The pinned BASE, phase boundary, and isolated worktree are recorded before path execution
- [ ] CHK-007 [P2] The phase source→target map and candidate/exemption counts are attached to the report
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-008 [P1] Changes are limited to design-md-generator; no adjacent cleanup or sibling-phase rename is included
- [ ] CHK-009 [P2] No code identifier, JSON-YAML-TOML key, frontmatter field, Python path, or tool-mandated name was altered
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-001 [P0] The map includes INSTALL_GUIDE.md, md-generator assets, design-system-extraction.md, reference directories/files, and the backend boundary
- [ ] CHK-002 [P0] design-md-generator/SKILL.md, README.md, extraction procedure citations, and backend documentation resolve the target paths
- [ ] CHK-003 [P0] The non-catalog/playbook documentation tree is clean and backend TypeScript modules, generated names, and tool-mandated files are unchanged
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-004 [P1] The phase checklist evidence includes stale-reference, broken-target, parity, and clean-worktree results
- [ ] CHK-005 [P1] The next sibling receives the final map, changed-path list, exemption list, and unresolved-question list
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-010 [P2] No executable behavior, transport surface, audit policy, or allowlist changed beyond path/reference updates
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-011 [P2] SKILL.md/README.md and phase-owned documentation point at the target paths where applicable
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-012 [P1] Renames are dependency-closed and path-scoped, with no scratch or unexpected tracked artifact left behind
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase is complete only when every P0 check passes, the evidence is pinned to the candidate/base context, and the applicable path/reference/benchmark gate is green. For phases 011 and 012, the report is read-only and must prove that no tracked mutation occurred.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the SOL verifier confirms the P0 contract and `git diff-index --quiet HEAD --` shows no unexpected tracked mutation after verification.
<!-- /ANCHOR:sign-off -->
