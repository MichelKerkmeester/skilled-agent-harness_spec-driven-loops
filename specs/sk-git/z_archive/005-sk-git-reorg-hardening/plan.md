---
title: "Implementation Plan: sk-git Large-Reorg + Worktree Hardening [sk-git/z_archive/005-sk-git-reorg-hardening/plan]"
description: "Harden the sk-git skill against five failure modes from the 026 wave-4 reorg by adding worktree caveats, scoped-staging discipline, rename-heavy merge verification, and a large-reorg runbook."
trigger_phrases:
  - "sk-git reorg hardening plan"
  - "git worktree gitignored deps"
  - "rename-heavy merge guidance"
  - "scoped staging discipline"
  - "large reorg playbook"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-git/z_archive/005-sk-git-reorg-hardening"
    last_updated_at: "2026-07-15T04:22:47Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored plan.md for completed sk-git hardening"
    next_safe_action: "Author tasks/checklist/implementation-summary and validate"
    blockers: []
    key_files:
      - "plan.md"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: sk-git Large-Reorg + Worktree Hardening

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown documentation (sk-git skill) |
| **Framework** | OpenCode skill bundle |
| **Storage** | None |
| **Testing** | `validate.sh --strict` on the packet; manual doc review |

### Overview
Harden the `sk-git` skill so large rename/reorg + worktree workflows avoid the five failure modes hit during the 026 wave-4 reorg. The work updates four existing reference docs plus SKILL.md and adds one new runbook. This plan documents already-completed work.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] Tests passing (validate.sh --strict)
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Documentation hardening: concise SKILL.md pointers plus deep guidance in `references/`.

### Key Components
- **worktree_workflows.md §8b**: leftover-cruft cleanup, fresh-worktree dep gap, per-worktree DB caveat.
- **commit_workflows.md §3 Step 7**: scoped-staging discipline with deny-pattern assertion and `git reset --mixed HEAD~1` recovery.
- **shared_patterns.md §10**: rename-heavy merge verification (disjointness, renameLimit, `git ls-files`, R-status).
- **large_reorg_playbook.md**: step-ordered runbook for the whole flow.

### Data Flow
A reorg runs in a worktree, merges to main, and the toolchain/DB ops run on main post-merge. The docs route the operator through each failure mode in order.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `references/worktree_workflows.md` | Worktree setup/teardown guidance | update (§8b added) | section present, scan one-liner cited |
| `references/commit_workflows.md` | Commit/staging discipline | update (§3 Step 7 added) | deny-pattern assertion + recovery present |
| `references/shared_patterns.md` | Shared merge/verify patterns | update (§10 added, old §10 -> §11) | R-status + disjointness steps present |
| `references/large_reorg_playbook.md` | New runbook | create | file exists with steps 0-5 |
| `SKILL.md` | Skill index/routing | update (pointers added) | discoverability pointers to §3 Step 7 and §10 |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Capture incident lessons from the 026 wave-4 reorg
- [x] Split scope across two sibling agents (worktree/playbook vs commit/merge)
- [x] Confirm sk-git reference doc structure

### Phase 2: Core Implementation
- [x] Add worktree caveats and leftover-cruft detection (worktree_workflows.md §8b)
- [x] Add scoped-staging discipline (commit_workflows.md §3 Step 7)
- [x] Add rename-heavy merge verification (shared_patterns.md §10)
- [x] Add the large-reorg runbook (large_reorg_playbook.md)

### Phase 3: Verification
- [x] Add SKILL.md discoverability pointers
- [x] Cross-link the two sibling sections
- [x] Run validate.sh --strict on the packet
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Validation | Packet doc structure | `validate.sh --strict` |
| Manual | Section presence + cross-links | grep + Read |
| Manual | Pointer discoverability | SKILL.md review |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| sk-git reference docs | Internal | Green | Edits must stay coherent across files |
| spec-kit validator | Internal | Green | Cannot confirm packet structure |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Guidance proves wrong or conflicts with real git behavior.
- **Procedure**: `git revert` the doc commit; sections are additive so removal is clean.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──────► Phase 2 (Core) ──► Phase 3 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core |
| Core | Setup | Verify |
| Verify | Core | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | ~30 min |
| Core Implementation | Med | ~2-3 hours |
| Verification | Low | ~30 min |
| **Total** | | **~3-4 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Edits scoped to sk-git docs only
- [x] No code or runtime behavior touched
- [x] Sibling-agent sections cross-linked

### Rollback Procedure
1. `git revert` the doc commit.
2. Confirm sk-git references return to prior state.
3. Re-run validate.sh on any affected packet.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->
