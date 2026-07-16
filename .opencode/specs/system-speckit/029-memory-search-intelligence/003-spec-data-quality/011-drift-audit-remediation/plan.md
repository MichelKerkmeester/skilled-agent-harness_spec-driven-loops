---
title: "Implementation Plan: 028 Drift Audit Remediation"
description: "Worktree-isolated, multi-model fix pipeline: MiMo v2.5 Pro Hyperspeed (ultraspeed) does the edits, GPT-5.5-fast (high) verifies them."
trigger_phrases:
  - "028 drift remediation plan"
  - "mimo fix dispatch"
  - "gpt-5.5 verify dispatch"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/029-memory-search-intelligence/003-spec-data-quality/011-drift-audit-remediation"
    last_updated_at: "2026-07-04T17:11:49.048Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Drafted the fix pipeline plan"
    next_safe_action: "Execute Phase 2 (investigate) then Phase 3 (fix) via Workflow"
    blockers: []
    key_files: ["plan.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-01-028-drift-audit-remediation"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Implementation Plan: 028 Drift Audit Remediation

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Executor (fix)** | `opencode run --model xiaomi/mimo-v2.5-pro-ultraspeed --variant high` |
| **Executor (verify)** | `opencode run --model openai/gpt-5.5-fast --variant high` |
| **Isolation** | git worktree cut from HEAD (`aca0f7eb8b`), not the live repo root |
| **Sync-back** | file copy of touched paths only, left uncommitted in the live tree |

### Overview
Bundle the 75 findings into 42 per-directory fix tasks plus 4 code-gap investigation tasks. Investigate first, dispatch MiMo-ultraspeed to make the actual edits inside an isolated worktree, then dispatch GPT-5.5-fast to independently re-read each edited path and confirm the original finding is resolved. Sync verified changes back to the live tree as uncommitted diffs.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] 75 findings enumerated with file/severity/category/summary/evidence (prior audit pass)
- [x] Findings grouped into 42 unique directories to avoid concurrent-write collisions on shared files
- [x] Worktree isolation confirmed necessary (`opencode.json` sets `edit: allow, bash: allow` globally - no per-call permission gate on a live-root dispatch)

### Definition of Done
- [x] All 24 confirmed findings independently re-verified as fixed
- [x] All 4 code-gap findings have an investigation verdict recorded
- [x] Live tree diff reviewed and left for operator to commit
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Pipeline (per directory): investigate (4 items only) -> fix (MiMo-ultraspeed, worktree-scoped) -> verify (GPT-5.5-fast, read-only against worktree) -> retry-once-on-failure -> sync back.

### Key Components
- **Investigation dispatch**: MiMo-ultraspeed does a repo-wide `grep`/`glob` search for the 4 code-gap claims before any doc edit happens, so the fix step knows whether to correct a stale doc or flag a real implementation gap.
- **Fix dispatch**: one `opencode run` per directory (not per finding) to avoid two dispatches racing on the same file; each prompt bundles every confirmed + unverified finding for that directory plus the investigation verdict where applicable.
- **Verify dispatch**: independent GPT-5.5-fast read-back per directory that was actually changed, confirming the specific finding no longer reproduces.

### Data Flow
Findings JSON (from prior audit) -> grouped by directory (42) -> Workflow pipeline stages -> edited worktree files -> verified subset -> copied into live tree as uncommitted changes.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|---------------|
| Parent phase-map docs (root spec.md, 000/001/002/005/006/007 spec.md) | Child count / status claims | Update counts and statuses to match on-disk reality | Re-read post-edit, count matches `find <dir> -maxdepth 1 -type d \| wc -l` |
| Child spec.md/checklist.md/implementation-summary.md pairs with internal self-contradictions | Status claims | Reconcile to one true status per child | Re-read post-edit, no remaining "complete" vs "pending" contradiction in the same doc set |
| 4 code files/claims (hybrid-search.ts, seeded-PPR, C4 shadow-weight, outcome-weighted store/rerank) | Implementation claims | Correct the claim to match investigation verdict, or cite the renamed/moved path found | Investigation evidence (grep command + result) attached to the fix |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Git worktree cut from HEAD at `/Users/michelkerkmeester/MEGA/Development/Code_Environment/028-drift-remediation-wt`
- [x] This spec folder scaffolded inside the worktree
- [x] Provider pre-flight confirmed (Xiaomi Direct + OpenAI both configured)

### Phase 2: Core Implementation
- [ ] Investigate 4 code-gap findings (parallel, MiMo-ultraspeed)
- [ ] Fix 42 directories (parallel, MiMo-ultraspeed, worktree-scoped)
- [ ] Verify 42 directories (parallel, GPT-5.5-fast, read-only)
- [ ] Retry once for any directory that fails verification

### Phase 3: Verification
- [ ] Sync verified changes back to live tree as uncommitted diffs
- [ ] `git diff --stat` reviewed, confirms only expected paths touched
- [ ] Update this packet's checklist.md and implementation-summary.md
- [ ] `validate.sh 045-drift-audit-remediation --strict`
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Independent re-verification | Every directory actually edited | GPT-5.5-fast (high) read-back against original finding |
| Diff scope check | Live tree after sync-back | `git diff --stat` compared against the 42-directory task list |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Xiaomi Direct API (`xiaomi/mimo-v2.5-pro-ultraspeed`) | External | Configured | Fix dispatches cannot run; fall back to GPT-5.5 or MiMo standard tier only with operator approval |
| OpenAI (`openai/gpt-5.5-fast`) | External | Configured | Verification cannot run; would need to fall back to manual read-back |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Any verify pass reports "new problem introduced" or the live-tree diff includes unexpected paths outside the 42-directory task list.
- **Procedure**: Nothing is committed until the operator reviews `git diff`. Discard any unwanted file with `git checkout -- <path>` in the live tree; the isolated worktree can simply be deleted (`git worktree remove --force`) with zero impact on the live tree, since the sync-back step only ever copies files in, never merges/commits.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──► Phase 2 (Investigate + Fix + Verify) ──► Phase 3 (Sync + Validate)
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
| Setup | Low | Worktree cut + spec scaffold, minutes |
| Core (investigate + fix + verify, 42 directories) | High | ~86 external dispatches (4 investigate + 42 fix + up to 42 verify), ~73 minutes wall-clock |
| Retry + manual finish (6 partial + 11 false-passed directories) | Medium | One automated retry round, then direct manual edit for 16 directories informed by verifier evidence |
| Sync + validate | Low | File copy + `validate.sh --strict`, minutes |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Worktree isolation in place (no live-tree exposure during fix dispatch)
- [x] Recovery baseline commit recorded: `aca0f7eb8b`

### Rollback Procedure
1. Do not commit the synced-back diff.
2. `git checkout -- <path>` per unwanted file, or discard the whole batch.
3. Re-run the specific directory's fix+verify pair if a partial re-run is preferred over a full discard.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A - this pass only edits markdown/JSON spec docs and, contingent on investigation, source doc/comment text.
<!-- /ANCHOR:enhanced-rollback -->
