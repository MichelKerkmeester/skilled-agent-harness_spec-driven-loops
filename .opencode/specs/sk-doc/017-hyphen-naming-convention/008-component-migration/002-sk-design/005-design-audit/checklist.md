---
title: "Checklist: Design-audit (017 phase 005)"
description: "Blocking SOL verification contract for Design-audit in the 017 sk-design naming subtree."
trigger_phrases:
  - "design-audit verification"
  - "sk-design design-audit checklist"
  - "017 design-audit gate"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/017-hyphen-naming-convention/008-component-migration/002-sk-design/005-design-audit"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-hyphen-naming-convention/008-component-migration/002-sk-design/005-design-audit"
    last_updated_at: "2026-07-14T16:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored design-audit checklist"
    next_safe_action: "Execute phase on pinned worktree"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/design-audit/SKILL.md"
      - ".opencode/skills/sk-design/design-audit/assets/ai_fingerprint_fixtures/"
      - ".opencode/skills/sk-design/design-audit/references/"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Checklist: Design-audit (017 phase 005)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking SOL verifier contract for phase 005. Every item is a check the paired verify agent runs BEFORE the candidate phase is accepted; the report pins the candidate SHA and BASE SHA, records commands, exit codes, counts, and evidence, and fails on zero tests/scenarios or unexpected tracked mutation.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-006 [P0] The pinned BASE, phase boundary, and isolated worktree are recorded before path execution
- [ ] CHK-007 [P2] The phase source→target map and candidate/exemption counts are attached to the report
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-008 [P1] Changes are limited to design-audit; no adjacent cleanup or sibling-phase rename is included
- [ ] CHK-009 [P2] No code identifier, JSON-YAML-TOML key, frontmatter field, Python path, or tool-mandated name was altered
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-001 [P0] The map covers ai-fingerprint-fixtures, all ten ai-fingerprint fixture directories, the registry/card/tell paths, audit procedures/references, and Python script exemptions
- [ ] CHK-002 [P0] Fixture links, registry-adjacent path values, design-audit/SKILL.md, README.md, and audit references resolve the renamed paths
- [ ] CHK-003 [P0] All audit fixture clean/tell pairs remain present, fixture_id values and JSON keys are unchanged, and Python scripts remain exact
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
