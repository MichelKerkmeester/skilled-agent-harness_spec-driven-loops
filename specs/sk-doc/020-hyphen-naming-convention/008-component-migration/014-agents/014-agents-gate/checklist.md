---
title: "Checklist: agents surface rollup gate (020 phase 014)"
description: "Checklist for phase 014 of the 020 agents component migration: aggregate sibling evidence and close the agents naming gate."
trigger_phrases:
  - "agents surface rollup gate checklist"
  - "agents naming gate checklist"
  - "020 phase 014 agents checklist"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/008-component-migration/014-agents"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/008-component-migration/014-agents/014-agents-gate"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored agents gate docs"
    next_safe_action: "Execute agents rollup gate"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Checklist: Agents Surface Rollup Gate

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking SOL verifier contract for phase 014. Every item is a check the paired
verify agent runs BEFORE the candidate commit lands; each SOL report pins the candidate SHA, BASE SHA, and rename-map
hash, records commands + exit codes + discovery counts, and fails on zero tests/scenarios or unexpected tracked mutation.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] All 13 sibling checklists and the pinned BASE are available for rollup
- [ ] CHK-002 [P2] The rollup report records the pinned BASE SHA and rename-map hash
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-003 [P1] The gate is limited to sibling evidence and the three assigned runtime roots; no adjacent migration work is added
- [ ] CHK-004 [P2] No agent content, frontmatter field, TOML key, code identifier, or non-filesystem value is altered
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-005 [P0] All 13 sibling checklists have path-level P0 evidence and are represented in the rollup
- [ ] CHK-006 [P0] The runtime inventory accounts for exactly 39 definition paths: 13 .md files in each Markdown runtime and 13 .toml files in Codex
- [ ] CHK-007 [P0] The union of all sibling rename-candidate sets is exactly ∅
- [ ] CHK-008 [P0] The recursive agents-directory scan finds no in-scope snake_case filesystem name outside the exemption set
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-009 [P1] Any missing path, extra definition, non-empty candidate set, or sibling disagreement is recorded as a blocker rather than silently waived
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-010 [P2] No executable behavior or allowlist changed beyond the intended rollup evidence; sandbox and gate posture preserved
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-011 [P2] The parent phase map, all sibling evidence references, and the rollup result use the same 13-component inventory
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-012 [P1] Only assigned subtree documentation changes; .opencode/agents, .claude/agents, and .codex/agents remain unmodified
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The subtree is complete when every P0 verifier check passes, all 39 definition paths and 13 sibling candidate
sets are reconciled, the aggregate candidate set is ∅, and the gate shows no unexpected tracked mutation.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the SOL verifier confirms the P0 contract and git diff-index --quiet HEAD -- shows no unexpected
tracked mutation after verification.
<!-- /ANCHOR:sign-off -->
