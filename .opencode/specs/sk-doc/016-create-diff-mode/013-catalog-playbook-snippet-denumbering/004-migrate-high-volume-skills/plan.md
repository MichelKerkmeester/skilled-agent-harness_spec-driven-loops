---
title: "Implementation Plan: Migrate High-Volume Skills (Wave B) [133/004/plan]"
description: "Dispatch one MiMo agent per skill in parallel across the seven high-volume skills, each running the phase-002 tool, rewriting its own references, and self-verifying with scoped per-skill commits."
trigger_phrases:
  - "133 phase 004 plan"
  - "parallel per-skill migration mimo"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-doc/013-catalog-playbook-snippet-denumbering/004-migrate-high-volume-skills"
    last_updated_at: "2026-06-06T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored phase 004 plan during 133 scaffold"
    next_safe_action: "On entry, prepare 7 per-skill MiMo briefs from the 002 manifest"
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
# Implementation Plan: Migrate High-Volume Skills (Wave B)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Executor** | cli-opencode → up to 7 parallel MiMo agents (one per skill) |
| **Tool** | phase-002 `denumber-snippets --tree <skill>/... --apply` |
| **Git** | dedicated worktree (D3); agents move+edit files only, orchestrator stages+commits each skill scoped + sequentially in the worktree; merge to `main` after 006 |

### Overview
The seven skills are independent units. With the operator's standing N-parallel authorization, dispatch one MiMo agent per skill concurrently; each owns exactly one skill, runs the tool over its catalog + playbook, rewrites in-skill references, self-verifies (grep + count + link-check), and reports. The orchestrator commits each skill scoped as its agent returns, and SIGKILLs each dispatcher on return per cli-opencode single-dispatch discipline (parallel exception).
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Phase 002 tool green; per-skill manifests sliced from the dry-run

### Definition of Done
- [ ] All 7 skills: zero numbered snippets, count reconciled, links intact
- [ ] 7 scoped commits verified via `git show --stat`
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Parallel unit = one skill
| Agent | Skill | Files |
|-------|-------|-------|
| A1 | mcp-click-up | 135 |
| A2 | system-skill-advisor | 86 |
| A3 | deep-review | 76 |
| A4 | deep-improvement | 71 |
| A5 | deep-ai-council | 64 |
| A6 | deep-research | 60 |
| A7 | deep-loop-runtime | 56 |

Each agent's write scope is its own skill tree + its own root docs. Cross-skill referrers (rare) are intentionally left to the phase-006 sweep so parallel agents never contend on the same file.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| each skill's snippet files | numbered | `git mv` de-number | per-skill grep clean |
| each skill's root catalog/playbook | links | rewrite | per-skill link-check |
| cross-skill referrers | rare external links | DEFER to 006 | listed, not edited here |

Required inventories:
- Per-skill rename + reference set comes from the phase-002 manifest, sliced by skill.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Dispatch (parallel)
- [ ] Launch 7 MiMo agents (one per skill) with per-skill briefs

### Phase 2: Verify + commit (as each returns)
- [ ] Per skill: grep clean + count + link-check → scoped commit → SIGKILL dispatcher
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Guard | per-skill no numbered files | `rg --files | rg` |
| Reconciliation | per-skill root==files | count script |
| Link-check | per-skill | link checker |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 002 tool | Internal | Pending | Required |
| Operator N-parallel authorization | External | Granted (user said "call multiple at a time") | Determines concurrency |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a skill's verification fails.
- **Procedure**: that skill's scoped commit is reverted independently (`git checkout -- <skill>`); other skills unaffected. Re-dispatch that one skill.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
        ┌─ A1 mcp-click-up ─┐
002 ───►├─ A2..A7 (parallel)├──► verify+commit per skill ──► Wave-B done
        └───────────────────┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Dispatch | Phase 002 | Verify |
| Verify+commit | Dispatch | Phase 006 sweep |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Dispatch | Med | 7 parallel MiMo |
| Verify+commit | Med | 7 verifications |
| **Total** | | **wall-clock ≈ slowest single skill** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Per-skill dispatch brief invariants
- MiMo: `--model xiaomi-token-plan-ams/mimo-v2.5-pro --variant high --format json --dir <repo-root>`; no `--agent`; `</dev/null`; `AI_SESSION_CHILD=1`.
- `Spec folder: .../133-.../004-migrate-high-volume-skills (pre-approved, skip Gate 3)`.
- `ALLOWED WRITE PATHS: <this-skill>/{feature_catalog,manual_testing_playbook}/** + <this-skill> root docs ONLY.`
- `BANNED: git add -A; editing any other skill; touching category-folder names; cross-skill referrers.`

### Rollback Procedure
1. Revert only the failing skill's scoped commit.
2. Re-dispatch that single skill; leave the other six intact.
<!-- /ANCHOR:enhanced-rollback -->
