---
title: "Checklist: Skill gate (020 phase 012)"
description: "Blocking SOL verification contract for Skill gate in the 020 sk-design naming subtree."
trigger_phrases:
  - "skill-gate verification"
  - "sk-design skill gate checklist"
  - "020 skill-gate gate"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/008-component-migration/002-sk-design/012-skill-gate"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/008-component-migration/002-sk-design/012-skill-gate"
    last_updated_at: "2026-07-14T16:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored skill gate checklist"
    next_safe_action: "Execute phase on pinned worktree"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/SKILL.md"
      - ".opencode/skills/sk-design/mode-registry.json"
      - ".opencode/skills/sk-design/"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Checklist: Skill gate (020 phase 012)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking SOL verifier contract for phase 012. Every item is a check the paired verify agent runs BEFORE the candidate phase is accepted; the report pins the candidate SHA and BASE SHA, records commands, exit codes, counts, and evidence, and fails on zero tests/scenarios or unexpected tracked mutation.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-006 [P0] Sibling phases 001–011, the pinned BASE, and candidate evidence fingerprints are enumerated
- [ ] CHK-007 [P2] The complete sk-design inventory command and exemption report are recorded
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-008 [P1] The rollup is read-only and reports sibling defects instead of repairing them
- [ ] CHK-009 [P2] No code identifier, data key, frontmatter field, Python path, or tool-mandated name is treated as a filesystem candidate
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-001 [P0] Every sibling checklist has all P0 items passing and no unapproved P1 deferral
- [ ] CHK-002 [P0] The complete sk-design filesystem inventory has zero in-scope snake_case names and zero unknown dispositions
- [ ] CHK-003 [P0] Whole-surface Markdown, JSON/YAML/TOML path-value, shell-source, and registry resolution has zero stale or broken paths
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-004 [P1] The final rollup report cites the sibling evidence, exemption classification, clean-name result, and reference result
- [ ] CHK-005 [P1] Any failure names the owning sibling and exact evidence gap; the gate does not infer completion
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-010 [P2] The gate changes no executable behavior, policy, allowlist, or external state
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-011 [P2] The parent phase map and rollup handoff reflect the read-only verdict without conflicting completion claims
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-012 [P1] The rollup leaves the tracked worktree unchanged after verification
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase is complete only when every P0 check passes, the evidence is pinned to the candidate/base context, and the applicable path/reference/benchmark gate is green. For phases 011 and 012, the report is read-only and must prove that no tracked mutation occurred.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the SOL verifier confirms the P0 contract and `git diff-index --quiet HEAD --` shows no unexpected tracked mutation after verification.
<!-- /ANCHOR:sign-off -->
