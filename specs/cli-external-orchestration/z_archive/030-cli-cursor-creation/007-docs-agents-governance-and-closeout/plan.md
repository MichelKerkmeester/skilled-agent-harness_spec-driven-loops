---
title: "Implementation Plan: docs, agents, governance and closeout"
description: "Plan for adding cli-cursor mentions across rosters/governance/cross-skill docs (touch-list from the current tree) and running full recursive closeout validation."
trigger_phrases: ["cli-cursor closeout plan"]
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/030-cli-cursor-creation/007-docs-agents-governance-and-closeout"
    last_updated_at: "2026-07-24T04:16:30Z"
    last_updated_by: "claude-code"
    recent_action: "All 3 phases complete; whole packet validate --recursive --strict 0/0"
    next_safe_action: "Write implementation-summary.md, commit"
    blockers: []
    key_files: ["spec.md", "checklist.md"]
    session_dedup: { fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "cli-cursor-creation-implementation", parent_session_id: null }
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: docs, agents, governance and closeout

<!-- ANCHOR:summary -->
## 1. SUMMARY
Grep the current tree for every roster/governance/cross-skill surface that enumerates the 3 sibling CLI executors, add a symmetric `cli-cursor` entry to each, resolve the root-`AGENTS.md`-as-Cursor-rules question, and run full closeout validation (`validate.sh --recursive --strict` + both hub skill validators) confirming the 4th mode is fully and consistently integrated with zero regressions.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES
- [x] Touch-list built from a fresh grep of the current tree, not a replayed template.
- [x] No surface left in a "3-of-4" state (a grep sweep confirms `cli-cursor` wherever all 3 siblings appear).
- [x] `validate.sh --recursive --strict` on the packet returns 0/0.
- [x] `parent-skill-check.cjs` + `validate_skill_package.py` against the hub both return 0 fails.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
No new components — this phase adds symmetric peer mentions across existing roster/governance/cross-skill surfaces and runs the closeout validators. The touch-list is discovered, not prescribed: `rg -l 'cli-codex|cli-claude-code|cli-opencode'` over `.opencode/agents/`, `.claude/agents/`, `.codex/agents/`, `AGENTS.md`, `CLAUDE.md`, `README.md`, and cross-skill docs yields the exact surfaces to edit.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES
| Surface | Current Role | Action | Verification |
|---|---|---|---|
| Agent rosters (`context`/`deep-research`/`deep-review`/`deep-improvement`, 3 runtimes) | Executor enumerations | Add `cli-cursor` peer | Grep sweep shows 4-of-4 |
| `AGENTS.md`/`CLAUDE.md`/`README.md` | Governance / hub-mode enumeration | Add `cli-cursor`; resolve AGENTS.md-rules question | Grep sweep + recorded decision |
| Cross-skill sibling docs | Sibling-mode mentions | Add `cli-cursor` peer | Grep sweep |
| Whole packet `030-cli-cursor-creation` | Spec docs | Validate | `validate.sh --recursive --strict` 0/0 |
| `cli-external-orchestration` hub | Skill package | Validate | Both skill validators 0 fails |
<!-- /ANCHOR:affected-surfaces -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Ran `rg -l 'cli-codex|cli-claude-code|cli-opencode'` over rosters/governance/cross-skill trees; narrowed to live surfaces (excluding historical spec docs/changelogs/archives).
- [x] Decided the root-`AGENTS.md`-as-Cursor-rules question: executor-agnostic.

### Phase 2: Core Implementation
- [x] Added a symmetric `cli-cursor` mention to each grep-identified surface: `.opencode/agents/deep-improvement.md` + `.claude` mirror, root `README.md`, `cli-external-orchestration/README.md`.
- [x] Reconciled completion metadata across the packet (001-006 all Complete — implemented this session, not deferred; 007 Complete).

### Phase 3: Verification
- [x] Ran `validate.sh --recursive --strict` on the packet; 0/0 across parent + all 7 children.
- [x] Ran `parent-skill-check.cjs` and `validate_skill_package.py` against the hub; 0 fails (fixed a stale compiled-routing bookkeeping hash to get there).
- [x] Grep sweep: confirmed `cli-cursor` present wherever all 3 siblings are.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
Primary evidence is three greps and three validators: (1) the touch-list grep before editing, (2) the coverage-sweep grep after editing (confirming 4-of-4 wherever siblings appear), and (3) `validate.sh --recursive --strict` + `parent-skill-check.cjs` + `validate_skill_package.py`. No runtime behavior is tested because none is changed.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
| Dependency | Type | Status | Impact if Blocked |
|---|---|---|---|
| Phases 002-006 | Internal | Green (all Complete, committed and pushed) | Their surfaces exist and their mentions are added |
| Clean tree on governance docs | External | Green — verified clean before each edit | Avoided editing a concurrently-dirty file |
| Hub skill validators | Internal | Green (0/0 after the manifest-hash fix) | Closeout confirmed done |
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
Revert the roster/governance/cross-skill edits via `git checkout` of the specific grep-identified paths. This phase adds only peer mentions; reverting them returns each surface to its 3-sibling state with no other effect.
<!-- /ANCHOR:rollback -->

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES
Runs last; depends on phases 002-006 for the surfaces it references.
<!-- /ANCHOR:phase-deps -->

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION
| Phase | Complexity | Estimated Effort |
|---|---|---|
| Setup (grep touch-list) | Low | 20 min |
| Core implementation | Medium | 1-2 hours (many small symmetric edits) |
| Verification | Low | 30 min (validators + sweep) |
<!-- /ANCHOR:effort -->

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK
Docs-only, low-blast: symmetric peer mentions across existing files, each reversible via `git checkout` of its path. No data migration.
<!-- /ANCHOR:enhanced-rollback -->

---

## RELATED DOCUMENTS
- `spec.md`, `tasks.md`, `checklist.md`
- `../../029-cli-devin-revival/007-docs-agents-governance-and-closeout/plan.md` (sibling closeout precedent)
