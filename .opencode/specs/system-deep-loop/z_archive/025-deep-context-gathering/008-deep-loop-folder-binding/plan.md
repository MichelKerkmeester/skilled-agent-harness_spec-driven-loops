---
title: "Implementation Plan: Fix deep-loop spec-folder binding: extract a named spec-folder path from the positional scope and add a fail-closed standalone guard across the /deep:* command family [template:level_2/plan.md]"
description: "Add a Tier-1 positional-scope spec-folder extraction source plus a fail-closed standalone guard to the shared auto-mode contract, then reconcile the three /deep:* commands to it."
trigger_phrases:
  - "implementation plan"
  - "deep loop folder binding"
  - "scope extract plan"
  - "plan core"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/025-deep-context-gathering/008-deep-loop-folder-binding"
    last_updated_at: "2026-06-07T10:30:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Plan executed; all phases complete"
    next_safe_action: "Commit via sk-git when ready"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/references/workflows/auto_mode_contract.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "ctx-fix-008-deep-loop-folder-binding"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Fix deep-loop spec-folder binding: extract a named spec-folder path from the positional scope and add a fail-closed standalone guard across the /deep:* command family

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown + YAML prompt-contract artifacts (AI-interpreted) |
| **Framework** | spec-kit `/deep:*` command family + shared `auto_mode_contract.md` |
| **Storage** | N/A |
| **Testing** | Deterministic node dry-run + `validate.sh --strict` |

### Overview
Add a Tier-1 "positional-scope spec-folder extraction" source and a fail-closed standalone/fallback guard to the shared `auto_mode_contract.md`, then reconcile deep-context (command + 2 YAML preflights + skill/loop_protocol) and the deep-research/deep-review tables to it. The agent is unchanged.
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
- [x] Tests passing (dry-run + validate)
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Shared-contract-then-consumers: the resolution rule lives once in `auto_mode_contract.md`; commands cite it.

### Key Components
- **auto_mode_contract.md §1**: the Tier-1 extraction source + fail-closed fallback guard (source of truth).
- **/deep:* command §0 + tables**: consume the source; deep-context also guards Q1 + preflight.

### Data Flow
Scope text → §0 `find` discovery → canonicalized path match → bind `spec_folder` + strip token → `{spec_folder}/<loop>/`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `auto_mode_contract.md` §1/§3 | Shared Tier-1 resolution source-of-truth | update (add source + guard) | grep shows new source + guard |
| `start-context-loop.md` table + §0 + Q1 | deep-context setup | update (bind + guard E) | dry-run binds 026, suppresses E |
| `deep_start-context-loop_{auto,confirm}.yaml` preflight | fail gate before writes | update (fail-closed) | grep shows fail-closed clause |
| `deep-context` SKILL.md + loop_protocol.md | host guidance | update (guard line) | grep shows guard sentence |
| `start-research-loop.md` + `start-review-loop.md` tables | sibling setup | update (cite source) | grep shows scope-extract |
| `agents/deep-context.md` | read-only analyzer seat | unchanged (not a consumer) | byte-identical; never sets location |

Inventories run:
- Consumers of the standalone affordance: `rg -n 'spec_folder_is_within|standalone run dir' .opencode/commands/deep` (only deep-context allows standalone).
- Same-class producer: the gap is the contract's Tier-1 source list; fixed at source.
- Algorithm invariant: bind only when a scope token `realpath`-equals an existing folder under `specs/`|`.opencode/specs/`; adversarial cases = trailing punctuation, symlink form, non-existent path.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Root cause located (two Explore passes + source confirmation)
- [x] Fix scope chosen (whole /deep:* family)
- [x] Tracking packet allocated (029, Level 2)

### Phase 2: Core Implementation
- [x] Shared contract: scope-extract source + fail-closed guard
- [x] deep-context: table + §0 bind + Q1 guard + 2 preflights + skill/loop_protocol
- [x] deep-research + deep-review: table parity

### Phase 3: Verification
- [x] Manual testing complete (node dry-run)
- [x] Edge cases handled (symlink, punctuation, no-match)
- [x] Documentation updated
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | N/A (no executable code added) | N/A |
| Integration | Dry-run of patched §0 against original failing scope | node + `find`/`realpath` |
| Manual | `validate.sh --strict` on 029; grep each edited contract | bash |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `auto_mode_contract.md` | Internal (shared) | Green | None; change is additive |
| `resolveArtifactRoot()` | Internal | Green | Unchanged; already maps folder → `{folder}/context/` |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: extraction binds a wrong folder, or a command regresses.
- **Procedure**: `git revert`/`git checkout` the 8 edited files; they are independent prose/YAML edits.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──► Phase 2 (Core: contract → commands) ──► Phase 3 (Verify)
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
| Setup | Low | ~0.5 hour |
| Core Implementation | Low | ~1 hour |
| Verification | Low | ~0.5 hour |
| **Total** | | **~2 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Backup created (if data changes) — N/A, git-tracked edits
- [x] Feature flag configured — N/A
- [x] Monitoring alerts set — N/A

### Rollback Procedure
1. `git checkout -- <the 8 edited files>`
2. Confirm `grep` no longer shows the scope-extract source
3. No data reversal needed

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->
