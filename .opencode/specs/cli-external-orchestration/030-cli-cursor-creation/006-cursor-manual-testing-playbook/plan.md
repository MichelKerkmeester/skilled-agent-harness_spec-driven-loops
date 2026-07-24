---
title: "Implementation Plan: Cursor manual-testing playbook"
description: "Plan for authoring the Cursor-native manual-testing playbook (root + 9 category folders, ~15-20 CU-NNN scenarios) mirroring the cli-codex split-document template."
trigger_phrases: ["cursor manual testing playbook plan"]
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/030-cli-cursor-creation/006-cursor-manual-testing-playbook"
    last_updated_at: "2026-07-24T04:16:30Z"
    last_updated_by: "claude-code"
    recent_action: "Authored plan.md for phase 006"
    next_safe_action: "Author tasks.md, checklist.md"
    blockers: ["scenario EXECUTION gated on cursor-agent login"]
    key_files: ["spec.md"]
    session_dedup: { fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "cli-cursor-creation-authoring", parent_session_id: null }
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Cursor manual-testing playbook

<!-- ANCHOR:summary -->
## 1. SUMMARY
Author a Cursor-native manual-testing playbook mirroring the cli-codex split-document template (root file + category folders, universal per-feature scenario template, `CU-NNN` IDs), reframing the category set against Cursor's live-verified 2026-07 surface: 9 categories, ~15-20 scenarios, execution gated on `cursor-agent login`.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES
- [ ] 9 categories present; total scenarios 15-20; `CU-NNN` IDs gap-free.
- [ ] Cursor-unique categories (execution-modes, worktree-isolation, cloud-worker) authored fresh, not ported.
- [ ] Global Preconditions gate EXECUTION on `cursor-agent login`; fail-closed-without-auth noted.
- [ ] `validate_document.py` reports 0 structural errors on every playbook file.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
Split-document catalog under `cli-cursor/manual-testing-playbook/`: a root `manual-testing-playbook.md` (policy banners + numbered sections + a Feature Catalog Cross-Reference Index) plus 9 category subdirectories each holding `CU-NNN` scenario files on the universal per-feature template. Mirrors the confirmed cli-codex structure; category set is Cursor-native.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES
| Surface | Current Role | Action | Verification |
|---|---|---|---|
| `cli-cursor/manual-testing-playbook/manual-testing-playbook.md` | (new) root playbook | Create | Section set mirrors cli-codex |
| `cli-cursor/manual-testing-playbook/<9 categories>/*.md` | (new) scenarios | Create | 15-20 CU-NNN files |
| `cli-cursor/SKILL.md` | Packet skill (phase 003) | Update | Playbook cross-reference added |
<!-- /ANCHOR:affected-surfaces -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Read cli-codex's root playbook file + one scenario file as the structural template.
- [ ] Resolve the 3 open questions (hallucination-flag choice, worktree dry-run vs. real, cloud-worker SKIP vs. live).

### Phase 2: Core Implementation
- [ ] Author the root `manual-testing-playbook.md` (banners + sections + preconditions gating on `cursor-agent login`).
- [ ] Author the 9 category folders with 15-20 `CU-NNN` scenarios, including the hallucination-fixture scenario.

### Phase 3: Verification
- [ ] Run `validate_document.py` on every playbook file; confirm 0 structural errors.
- [ ] Confirm CU-NNN sequence is gap-free; confirm the cross-reference into `cli-cursor/SKILL.md`.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
Structural validation only (no scenario execution — execution is auth-gated). Run `validate_document.py` on each file. Verify category count (9), scenario count (15-20), and CU-NNN gap-freeness by extracting the IDs. Confirm the root file's Global Preconditions gate EXECUTION on `cursor-agent login`. This phase's own `validate.sh --strict` must pass 0/0.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
| Dependency | Type | Status | Impact if Blocked |
|---|---|---|---|
| Phase 003 (skill packet) | Internal | Planned | SKILL.md cross-reference target must exist |
| Phase 004 (hook adapters) | Internal | Planned | `hooks` category exact event/paths depend on it |
| Phase 005 (Composer profile) | Internal | Planned | model-roster note in the root file |
| `cursor-agent login` | External | Red — operator-only | Blocks scenario EXECUTION, not authoring |
| cli-codex playbook | Internal | Green (live) | Structural template |
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
Delete `cli-cursor/manual-testing-playbook/`; revert the one cross-reference line in `cli-cursor/SKILL.md`. No runtime code touched.
<!-- /ANCHOR:rollback -->

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES
Follows phase 005; needs phase 003's SKILL.md for the cross-reference and phase 004's events for the `hooks` category.
<!-- /ANCHOR:phase-deps -->

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION
| Phase | Complexity | Estimated Effort |
|---|---|---|
| Setup | Low | 30 min |
| Core implementation | Medium | 3-4 hours (root + 15-20 scenarios) |
| Verification | Low | 30 min |
<!-- /ANCHOR:effort -->

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK
Docs-only, low-blast: delete the playbook directory and revert one SKILL.md line. No data migration; fully reversible via `git`.
<!-- /ANCHOR:enhanced-rollback -->

---

## RELATED DOCUMENTS
- `spec.md`, `tasks.md`, `checklist.md`
- `.opencode/skills/cli-external-orchestration/cli-codex/manual-testing-playbook/manual-testing-playbook.md` (structural precedent)
- `../../029-cli-devin-revival/006-devin-manual-testing-playbook/plan.md` (sibling precedent)
