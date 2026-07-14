---
title: "Implementation Plan: sk-git Worktree Convention (wt/NNNN-name) + Skill-Advisor Routing Optimization"
description: "Edit the sk-git skill docs to adopt branch wt/NNNN-name + dir .worktrees/NNNN-name, add a changelog entry, sharpen advisor triggers and rebuild the index, then restructure existing feature worktrees."
trigger_phrases:
  - "sk-git worktree plan"
  - "wt/ convention plan"
  - "advisor reindex sk-git"
  - "worktree restructure"
  - "plan core"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/103-sk-git-worktree-convention-and-advisor-routing"
    last_updated_at: "2026-06-02T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Authored Level 2 plan for sk-git wt/ convention + advisor routing"
    next_safe_action: "Edit sk-git docs, add changelog, rebuild advisor index, restructure worktrees"
    blockers: []
    key_files:
      - ".opencode/skills/sk-git/SKILL.md"
      - ".opencode/skills/sk-git/README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-128-sk-git-worktree"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: sk-git Worktree Convention (wt/NNNN-name) + Skill-Advisor Routing Optimization

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown skill docs + shell (git worktree) + skill-advisor MCP |
| **Framework** | OpenCode skill system (sk-git) and the mk_skill_advisor index |
| **Storage** | Repo-local `.worktrees/` (gitignored); advisor index store |
| **Testing** | grep assertions on sk-git docs + advisor routing checks on representative prompts |

### Overview
Edit the four sk-git skill docs so the named-feature-worktree convention is branch `wt/{NNNN}-{name}` plus directory `<repo>/.worktrees/{NNNN}-{name}`, with `NNNN` allocated as `max(existing NNNN) + 1`. Add a sk-git changelog entry, sharpen the SKILL trigger phrases/keywords for git/worktree intent while reducing overlap with system-spec-kit and sk-code, rebuild the advisor index, then restructure existing feature worktrees and prune stale ones (deferring the two in-flight worktrees).
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing (grep assertions + advisor routing checks)
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Documentation + convention change with a metadata-driven routing rebuild (no application code).

### Key Components
- **sk-git skill docs**: `worktree_workflows.md`, `README.md`, `SKILL.md`, `assets/worktree_checklist.md` carry the human-readable convention.
- **sk-git changelog**: records the convention adoption and the routing change.
- **skill-advisor index**: consumes SKILL trigger phrases/keywords; rebuilt so routing reflects the sharpened metadata.
- **Worktree filesystem layout**: `<repo>/.worktrees/{NNNN}-{name}` with branch `wt/{NNNN}-{name}`.

### Data Flow
A user git/worktree prompt enters the advisor, which scores skills from SKILL trigger metadata; after the rebuild it selects sk-git, whose docs instruct creating `wt/{NNNN}-{name}` in `.worktrees/{NNNN}-{name}` with the global-counter rule.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Inventory current feature worktrees and existing NNNN values under `.worktrees/`
- [ ] Confirm `.worktrees/` is gitignored and identify the two in-flight worktrees to defer
- [ ] Capture the baseline advisor routing margins for git/worktree prompts

### Phase 2: Core Implementation
- [ ] Update `worktree_workflows.md` to `wt/{NNNN}-{name}` + `.worktrees/{NNNN}-{name}` with the global-counter rule
- [ ] Update `README.md` Worktree Directory Convention section and document the ephemeral-wrapper exception
- [ ] Update `SKILL.md` branch-naming guidance and add the new worktree-convention trigger phrases
- [ ] Update `assets/worktree_checklist.md` to the numbered convention
- [ ] Add a `.opencode/skills/sk-git/changelog/` entry
- [ ] Rebuild the advisor index

### Phase 3: Verification
- [ ] grep the sk-git skill for leftover `type/{short-desc}` / unnumbered feature-worktree examples (expect none)
- [ ] Run representative git/worktree/branch/commit/PR/merge/finish prompts through the advisor and confirm sk-git wins
- [ ] Restructure existing feature worktrees, prune stale ones, defer the two in-flight worktrees
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Doc-string assertions: convention strings present, legacy strings absent | `rg` over `.opencode/skills/sk-git/` |
| Integration | Advisor routing on representative git/worktree prompts | skill-advisor MCP recommend after rebuild |
| Manual | Worktree restructure + stale prune on the real `.worktrees/` tree | `git worktree list` / `git worktree prune` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| skill-advisor MCP (mk_skill_advisor) | Internal | Green | Routing change does not take effect until rebuilt |
| Two in-flight implementation dispatches | Internal | Yellow | Their worktrees must finish before they can be restructured |
| git worktree CLI | External | Green | Restructure and prune steps cannot run |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Advisor routing regresses, or a doc edit introduces an inconsistent convention.
- **Procedure**: Revert the sk-git doc edits and the changelog entry, then rebuild the advisor index from the prior SKILL metadata.
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
| Setup | Low | 0.5-1 hour |
| Core Implementation | Med | 2-3 hours |
| Verification | Med | 1-2 hours |
| **Total** | | **3.5-6 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Snapshot of current sk-git docs captured (git working tree)
- [ ] Baseline advisor routing margins recorded
- [ ] List of feature worktrees and their target NNNN recorded

### Rollback Procedure
1. Revert the sk-git doc and changelog edits in the working tree
2. Rebuild the advisor index from the reverted SKILL metadata
3. Re-run representative git/worktree prompts to confirm prior routing behavior
4. Leave any already-restructured worktrees in place (rename is non-destructive)

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: Worktree renames are reversible via `git worktree move`; no data store changes occur.
<!-- /ANCHOR:enhanced-rollback -->
