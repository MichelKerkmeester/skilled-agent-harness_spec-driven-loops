---
title: "Implementation Plan: Migrate Remaining Skills (Wave C) [133/005/plan]"
description: "Parallel per-skill MiMo migration of the remaining twelve smaller skills using the phase-002 tool, with scoped per-skill commits and a global active-scope grep gate proving the migration surface is complete."
trigger_phrases:
  - "133 phase 005 plan"
  - "wave C remaining skills migration"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/133-catalog-playbook-snippet-denumbering/005-migrate-remaining-skills"
    last_updated_at: "2026-06-06T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored phase 005 plan during 133 scaffold"
    next_safe_action: "On entry, prepare 12 per-skill briefs from the 002 manifest"
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
# Implementation Plan: Migrate Remaining Skills (Wave C)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Executor** | cli-opencode → parallel MiMo agents (one per skill, batched) |
| **Tool** | phase-002 `denumber-snippets --tree <skill>/... --apply` |
| **Git** | dedicated worktree (D3); agents move+edit files only, orchestrator stages+commits each skill scoped + sequentially in the worktree; merge to `main` after 006 |

### Overview
Same per-skill parallel pattern as wave B, over the twelve remaining smaller skills. After this wave, a global active-scope grep proves no numbered snippet files remain anywhere except the frozen set (z_future/z_archive/worktrees), handing a clean surface to the phase-006 sweep.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Phase 002 tool green; per-skill manifests sliced

### Definition of Done
- [ ] All 12 skills migrated + verified
- [ ] Global active-scope numbered-snippet grep = 0 (REQ-004)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Parallel batches (one agent per skill)
- Batch 1: system-code-graph, cli-opencode, cli-devin, cli-codex, cli-claude-code
- Batch 2: sk-prompt, sk-code, sk-doc, sk-git, sk-code-review
- Batch 3: mcp-code-mode, mcp-chrome-devtools

Each agent owns one skill tree + its root docs. Cross-skill referrers deferred to phase 006. Same worktree-index reconciliation as wave B: agents move+edit only; the orchestrator stages+commits each skill scoped + sequentially in the shared worktree (D3).
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| each skill's snippet files | numbered | `git mv` de-number | per-skill grep clean |
| each skill's root docs | links | rewrite | per-skill link-check |
| global active scope | mixed | gate after wave | `rg --files | rg '/[0-9]{2,3}-[a-z]'` excluding frozen = 0 |

Required inventories:
- Per-skill manifest slices from phase 002.
- Final global gate command recorded in checklist for phase 006 handoff.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Dispatch batches (parallel)
- [ ] Run batch 1 / 2 / 3, one MiMo agent per skill

### Phase 2: Verify + commit + global gate
- [ ] Per skill verify + scoped commit; then global active-scope grep gate
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Guard | per-skill no numbered files | `rg --files | rg` |
| Reconciliation | per-skill root==files | count script |
| Global gate | all active skills clean | repo-wide `rg` excluding frozen |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 002 tool | Internal | Pending | Required |
| Waves A/B done | Internal | Pending | Global gate needs them complete |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a skill verification or the global gate fails.
- **Procedure**: revert the offending skill's scoped commit; re-dispatch that skill; re-run the global gate.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
002 ──► batch1 ║ batch2 ║ batch3 (parallel) ──► global active-scope gate ──► phase 006
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Dispatch batches | Phase 002 | Verify |
| Verify+gate | Dispatch | Phase 006 |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Dispatch batches | Low-Med | 12 parallel MiMo (batched) |
| Verify+gate | Low | 12 verifications + 1 global gate |
| **Total** | | **smallest wave** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Per-skill dispatch brief invariants
- MiMo: `--model xiaomi-token-plan-ams/mimo-v2.5-pro --variant high --format json --dir <repo-root>`; no `--agent`; `</dev/null`; `AI_SESSION_CHILD=1`.
- `Spec folder: .../133-.../005-migrate-remaining-skills (pre-approved, skip Gate 3)`.
- `ALLOWED WRITE PATHS: <this-skill> catalog/playbook + root docs ONLY.` `BANNED: git add -A; other skills; category-folder names.`

### Rollback Procedure
1. Revert the failing skill's scoped commit; re-dispatch that skill.
2. Re-run global active-scope gate before handing to phase 006.
<!-- /ANCHOR:enhanced-rollback -->
