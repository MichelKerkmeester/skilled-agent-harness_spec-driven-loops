---
title: "Implementation Plan: Drift Audit Deep History Correction"
description: "Dispatch GPT-5.5-fast to apply 5 pass-2 correction items across 4 feature areas, citing real commit hashes and benchmark numbers verified during planning."
trigger_phrases:
  - "028 pass 2 plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/004-memory-search-intelligence/002-spec-data-quality/046-drift-audit-deep-history-correction"
    last_updated_at: "2026-07-04T17:11:46.692Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Drafted the pass-2 correction plan"
    next_safe_action: "Dispatch the 5 correction items"
    blockers: []
    key_files: ["plan.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-01-028-deep-history-correction"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Implementation Plan: Drift Audit Deep History Correction

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Executor (fix)** | `opencode run --model openai/gpt-5.5-fast --variant high` |
| **Executor (verify)** | `opencode run --model openai/gpt-5.5-fast --variant high` (independent read-back) |
| **Isolation** | git worktree `028-deep-research-wt`, cut from HEAD `aca0f7eb8b`, carrying pass 1's uncommitted fixes forward |

### Overview
Five correction items, each bundled by target directory to avoid concurrent-write collisions, dispatched sequentially, then independently re-verified.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] All 4 features' real history verified against actual git commits (hashes confirmed to exist, commit messages read in full)
- [x] Pass 1's existing correction-note convention identified and will be matched (distinct pass-2 date-stamped label)

### Definition of Done
- [x] All 5 correction items applied and independently re-verified
- [x] `validate.sh --strict` passes on this folder
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Sequential per-directory dispatch (fix -> verify), same pattern as the prior remediation pass.

### Key Components
- **Fix dispatch**: one `opencode run` per directory, bundling every correction item for that directory's docs.
- **Verify dispatch**: independent re-read confirming the commit hash/numbers are actually present and correctly cited.

### Data Flow
Verified facts (from planning phase) -> per-directory fix prompts -> edited worktree files -> verified subset -> synced to live tree.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|---------------|
| Pass-1 correction notes (already present in several of these docs) | Established "GENUINELY_ABSENT" framing | Supplement with pass-2 note, do not delete | Re-read post-edit, both notes present, distinct dates/labels |
| "Never committed" claims in C4 promoter and outcome-weighted ranking docs | Factually wrong per git history | Replace with built-then-deleted + commit hashes | Re-read post-edit, claim corrected |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Worktree cut and pass-1 fixes carried forward
- [x] This spec folder scaffolded

### Phase 2: Core Implementation
- [ ] Dispatch 5 correction items (per tasks.md)
- [ ] Verify each independently

### Phase 3: Verification
- [ ] Sync to live tree
- [ ] `validate.sh --strict`
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Independent re-verification | Every corrected doc | GPT-5.5-fast read-back against the real commit hash/numbers |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `002-code-graph/010-edge-confidence-and-ppr-revisit` | Internal (parallel work) | In progress | Seeded-PPR's docs stay at "forward-pointer" stage, not a final verdict, until that work completes |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A correction introduces a new factual error or contradicts pass 1's still-valid framing.
- **Procedure**: Nothing committed until reviewed; `git checkout --` per file in the live tree, or discard the whole worktree.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) --> Phase 2 (Correct + Verify) --> Phase 3 (Sync + Validate)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core |
| Core | Setup | Verify |
| Verify | Core | Sync/Validate |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|-------------------|
| Setup | Low | Minutes |
| Core (5 correction items) | Low-Medium | 5 sequential dispatches, ~2-5 min each |
| Sync + validate | Low | Minutes |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Worktree isolation in place
- [x] Recovery baseline commit recorded: `aca0f7eb8b`

### Rollback Procedure
1. Do not commit the synced-back diff without review.
2. `git checkout -- <path>` per unwanted file.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A - markdown/JSON only.
<!-- /ANCHOR:enhanced-rollback -->
