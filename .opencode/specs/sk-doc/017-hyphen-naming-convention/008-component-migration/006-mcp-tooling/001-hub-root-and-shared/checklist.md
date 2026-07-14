---
title: "Checklist: mcp-tooling hub root and shared naming closure (017 phase 001)"
description: "Blocking SOL verifier contract for the mcp-tooling hub root and shared naming phase."
trigger_phrases:
  - "mcp-tooling hub root checklist"
  - "mcp-tooling shared naming verification"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/017-hyphen-naming-convention/008-component-migration/006-mcp-tooling/001-hub-root-and-shared"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-hyphen-naming-convention/008-component-migration/006-mcp-tooling/001-hub-root-and-shared"
    last_updated_at: "2026-07-14T16:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored the phase 001 SOL verifier contract"
    next_safe_action: "Verify root/shared ownership before execution"
    blockers: []
    key_files:
      - ".opencode/skills/mcp-tooling/SKILL.md"
      - ".opencode/skills/mcp-tooling/hub-router.json"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Checklist: mcp-tooling Hub Root and Shared Naming Closure

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking SOL verifier contract for phase 001. Every item is a check the paired
verify agent runs BEFORE the candidate commit lands; each SOL report pins the candidate SHA, BASE SHA, and rename-map
hash, records commands + exit codes + discovery counts, and fails on zero tests/scenarios or unexpected tracked mutation.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Candidate SHA, BASE SHA, and frozen rename-map hash are recorded before the root/shared scan
- [ ] CHK-002 [P2] The report records that .opencode/skills/mcp-tooling/shared/ is absent at the baseline, if it remains absent
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-003 [P1] The diff is limited to root/shared paths and root-owned path references; delegated component, playbook, and benchmark trees are untouched
- [ ] CHK-004 [P2] SKILL.md, mode-registry.json, routing keys, JSON keys, frontmatter fields, and code identifiers remain unchanged
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-005 [P0] Every root/shared candidate is classified exactly once — the scoped census has non-zero output and no unknown class
- [ ] CHK-006 [P0] Root-owned Markdown and router path values resolve to existing canonical resources — attach resolver output and parent-skill-check.cjs exit code
- [ ] CHK-007 [P0] No in-scope root/shared snake_case filesystem name remains — attach the post-change find/git ls-files result
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-008 [P1] The semantic map covers every root/shared rename and every reference to those paths, including path-valued metadata
- [ ] CHK-009 [P1] No synthetic shared directory or cross-phase rename was introduced
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-010 [P2] No executable behavior, allowed tool, routing policy, or sandbox boundary changed beyond path-value repair
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-011 [P2] Root navigation and phase ownership remain documented with the canonical hyphenated paths
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-012 [P1] Renames are path-scoped and reversible; verification leaves git diff-index --quiet HEAD -- with no unexpected tracked mutation
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase is complete when all P0 checks pass, the root/shared census is attached, the hub route check discovers real resources, and the candidate report records the SHA, BASE SHA, map hash, commands, exit codes, and discovery counts.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the SOL verifier confirms the P0 contract and the root/shared boundary shows no delegated-tree drift.
<!-- /ANCHOR:sign-off -->
