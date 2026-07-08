---
title: "Verification Checklist: External Reference Migration"
description: "Verification checklist for migrating every deep-loop-workflows/deep-loop-runtime reference. Not yet executed."
trigger_phrases:
  - "external reference migration checklist"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/052-deep-loop-unification/003-external-reference-migration"
    last_updated_at: "2026-07-08T00:00:00Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Authored checklist, not yet executed"
    next_safe_action: "Wait for 002 to land, then execute"
    blockers:
      - "Depends on 002-hub-rename-and-runtime-nesting landing first"
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "deep-loop-unification-052-003-scaffold"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Verification Checklist: External Reference Migration

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|--------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Stage-A baseline captured: `rg` inventory + `score-routing-corpus.py` accuracy numbers
- [ ] CHK-002 [P0] 002-hub-rename-and-runtime-nesting confirmed landed (`system-deep-loop/` exists as real target)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] `parent-skill-check.cjs`'s own `GLOBAL_MAP_OWNER`/`DEFAULT_TARGET` fixed first
- [ ] CHK-011 [P1] `MERGED_DEEP_SKILL_ID` updated in both `skill_advisor.py` and `aliases.ts` (unguarded duplicate pair)
- [ ] CHK-012 [P1] Compiled `.contract.md` files regenerated via `compile-command-contracts.cjs`, never hand-edited
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] Residual-grep sweep clean (`rg -l 'deep-loop-workflows|deep-loop-runtime'`, excluding specs/worktrees/node_modules/dist, minus explicit allowlist)
- [ ] CHK-021 [P0] `routing-registry-drift-guard.vitest.ts` passes
- [ ] CHK-022 [P0] `score-routing-corpus.py --min-advisor-accuracy <Stage-A baseline>` passes — accuracy held, not just "didn't crash"
- [ ] CHK-023 [P0] `local-native-divergence-ratchet.vitest.ts` passes with reviewed, non-mechanical `reason` updates
- [ ] CHK-024 [P1] `check-agent-mirror-sync.cjs` passes for both `.opencode/agents/**` and `.claude/agents/**`
- [ ] CHK-025 [P1] Full vitest suite for `system-skill-advisor` and `system-spec-kit` passes
- [ ] CHK-026 [P2] `create:skill-parent` smoke check confirms the grandfather-example caveat renders correctly
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-P0-001 [P0] Every Stage C-I item from plan.md is confirmed applied via its own listed verification command, not assumed complete from the stage table alone
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P2] No tool-surface or permission change introduced — reference/metadata edits only
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Root README + 6 other READMEs updated
- [ ] CHK-041 [P1] Grandfather-example files (`parent_skills_nested_packets.md`, `skill-parent.md` + 2 asset YAMLs) updated with the prefix-exception caveat
- [ ] CHK-042 [P1] Sibling `graph-metadata.json` edges collapsed to one per skill (not duplicated)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Pre-commit hook + GitHub Actions workflow updated as a matched pair
- [ ] CHK-051 [P2] Temporary compat symlinks removed once residual-grep is clean
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 9 | 0/9 |
| P1 Items | 8 | 0/8 |
| P2 Items | 3 | 0/3 |

**Verification Date**: Not yet executed
<!-- /ANCHOR:summary -->
