---
title: "Implementation Plan: Migrate system-spec-kit (Wave A) [133/003/plan]"
description: "Apply the phase-002 tool to the system-spec-kit catalog + playbook in per-category batches via MiMo (1M context), with scoped commits and per-category verification, resolving the two collisions first."
trigger_phrases:
  - "133 phase 003 plan"
  - "system-spec-kit migration batches"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/133-catalog-playbook-snippet-denumbering/003-migrate-system-spec-kit"
    last_updated_at: "2026-06-06T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored phase 003 plan during 133 scaffold"
    next_safe_action: "Generate per-category tasks from the 002 manifest on entry"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Migrate system-spec-kit (Wave A)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Executor** | cli-opencode → MiMo-v2.5-pro (1M context handles the 673-file tree) |
| **Tool** | phase-002 `denumber-snippets --tree <...> --apply` |
| **Git** | dedicated worktree `.worktrees/NNNN-snippet-denumbering` (D3); per-category scoped commits IN the worktree; merge to `main` after phase 006 |

### Overview
Resolve the 2 collisions first, then run the tool per category folder across both system-spec-kit packages. MiMo verifies each category (link-check + count) and commits it scoped before moving on, keeping the git-index blast radius small.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Phase 002 dry-run on system-spec-kit green; collision resolution approved

### Definition of Done
- [ ] Zero numbered snippet files under system-spec-kit (REQ-001)
- [ ] Count reconciliation + link-check pass (REQ-002/004)
- [ ] `validate.sh` playbook root green (REQ-005)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

> Runs in the dedicated worktree (D3); MiMo is the single writer for this wave, so per-category scoped commits inside the worktree are race-free.

### Batch order
1. **Collisions first**: apply the resolution to `manual_testing_playbook/16--tooling-and-scripts/` (4 files) so the tool no longer aborts that tree.
2. **feature_catalog** categories (01--…→24--…), one commit per category.
3. **manual_testing_playbook** categories, one commit per category.

### Verification per category
- `rg --files <category> | rg '/[0-9]{2,3}-[a-z]'` = 0
- neighbor/self link-check inside the category
- root-doc link rewrite confirmed for that category's entries
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| catalog/playbook snippet files | numbered | `git mv` de-number | grep clean per category |
| root `feature_catalog.md` / `manual_testing_playbook.md` | link to snippets | rewrite links | link-check 0 broken |
| `16--tooling-and-scripts` collision files | duplicate slugs | apply resolution | content preserved, distinct names |

Required inventories:
- Manifest from phase 002 is the authoritative rename + reference edit list for this tree.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Collisions
- [ ] Apply approved resolution to the 4 collision files

### Phase 2: feature_catalog (308)
- [ ] Run + verify + scoped-commit each catalog category

### Phase 3: manual_testing_playbook (365)
- [ ] Run + verify + scoped-commit each playbook category
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Guard | No numbered files remain | `rg --files | rg` per category |
| Reconciliation | root entries == feature files | count script |
| Structural | playbook root validates | `validate.sh` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 002 tool + manifest | Internal | Pending | Required to run |
| Decision D3 (commit policy) | Internal | Pending | Sets commit/worktree shape |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a category's verification fails.
- **Procedure**: `git reset --soft HEAD~1` (that category's scoped commit) or `git checkout -- <category>`; re-run after fixing the tool/manifest. `git mv` is reversible.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Collisions ──► feature_catalog ──► manual_testing_playbook
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Collisions | Phase 002 decision | catalog/playbook runs on `16--` tree |
| feature_catalog | Phase 002 tool | Wave-A done |
| manual_testing_playbook | Phase 002 tool | Wave-A done |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Collisions | Low | 1 inspection + apply |
| feature_catalog | Med | batched MiMo runs |
| manual_testing_playbook | Med | batched MiMo runs |
| **Total** | | **largest single wave** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Dispatch brief invariants
- MiMo: `--model xiaomi-token-plan-ams/mimo-v2.5-pro --variant high --format json --dir <repo-root>`; no `--agent`; `</dev/null`.
- `Spec folder: .../133-.../003-migrate-system-spec-kit (pre-approved, skip Gate 3)`.
- `ALLOWED WRITE PATHS: system-spec-kit/{feature_catalog,manual_testing_playbook}/** + the supplied referrer list.`
- `BANNED: git add -A; touching category-folder names; editing other skills.`

### Rollback Procedure
1. Identify the failing category's scoped commit.
2. `git reset --soft HEAD~1` or targeted `git checkout`.
3. Re-run that category after correcting tool/manifest.
<!-- /ANCHOR:enhanced-rollback -->
