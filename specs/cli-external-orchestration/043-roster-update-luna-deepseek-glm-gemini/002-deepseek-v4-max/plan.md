---
title: "Implementation Plan: DeepSeek V4 Max Tier Dispatch Support (cli-devin)"
description: "Additive edits to the devin allowlist source and mirror, the devin vitest fixtures, and the cli-devin docs that would otherwise go stale, verified by the deep-loop unit suite and validate.sh --strict."
trigger_phrases:
  - "deepseek max devin plan"
  - "deepseek max phase 002 plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/043-roster-update-luna-deepseek-glm-gemini/002-deepseek-v4-max"
    last_updated_at: "2026-08-15T13:00:00Z"
    last_updated_by: "pi"
    recent_action: "Authored implementation plan; executed as part of the combined 2026-08-14 roster change"
    next_safe_action: "None; phase complete"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts"
      - ".opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "impl-043-roster-update-luna-deepseek-glm-gemini"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: DeepSeek V4 Max Tier Dispatch Support (cli-devin)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (executor-config), CommonJS (fanout-run), Markdown docs |
| **Framework** | Vitest (deep-loop runtime unit suite) |
| **Storage** | None |
| **Testing** | `vitest run` on executor-config / fanout-run / combo-matrix |

### Overview
`DEVIN_SUPPORTED_MODELS` (TS source of truth) and `DEVIN_ALLOWED_MODELS` (JS Set mirror in `fanout-run.cjs`) gain the DeepSeek max tiers `deepseek-v4-flash-max` and `deepseek-v4-pro-max` as a pure additive superset. Executed together with phase 001 (Luna Max) in one combined change on 2026-08-14.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Every added id list-verified against a live CLI listing (2026-08-14)
- [x] Dependencies identified (devin CLI installed)

### Definition of Done
- [x] All acceptance criteria met
- [x] Deep-loop vitest passing
- [x] Docs (roster + family sweep + changelog) updated
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Dual hand-synced allowlist (TS source of truth + CJS runtime mirror) with a cross-check test enforcing byte-parity.

### Key Components
- **`executor-config.ts` array**: type-level source of truth; a hard-rejecting `isDevinModelAllowed` gate.
- **`fanout-run.cjs` Set**: synchronous runtime gate used during fanout command construction.

### Data Flow
A fanout lineage names a devin model → the builder checks the Set → rejects off-list uids before a command is built.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `DEVIN_SUPPORTED_MODELS` | allowlist source of truth | update (additive) | vitest sorted-array assertion |
| `DEVIN_ALLOWED_MODELS` | runtime mirror | update (additive) | `ALLOWED ≡ SUPPORTED` cross-check |
| `combo-matrix.vitest.ts` | exercises every model in the arrays | unchanged (auto-derives) | derivation assertion passes |
| `providers-and-models.md` (devin) + family claims | roster catalog + curated family list | update | grep sweep for residual stale claims |

Required inventories:
- Consumers of the arrays: `rg -n 'DEVIN_SUPPORTED_MODELS|DEVIN_ALLOWED_MODELS' .opencode/skills/system-deep-loop`.
- Stale-family producers: `rg -n 'DeepSeek|five families' .opencode/skills/cli-external-orchestration/cli-devin`.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Code
- [x] `executor-config.ts`: +2 devin uids, sorted; honest comments
- [x] `fanout-run.cjs`: mirror the Set

### Phase 2: Tests + Docs
- [x] Update devin vitest fixtures (max-tier rows)
- [x] Devin `providers-and-models.md` roster + family sweep + changelog + version bump

### Phase 3: Verification
- [x] Deep-loop vitest green
- [x] Residual grep clean
- [x] `validate.sh --strict`
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | allowlist array + fanout command builder | vitest |
| Integration | cross-check (ALLOWED≡SUPPORTED), combo-matrix derivation | vitest |
| Manual | live `devin models list` id verification | devin |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| devin CLI | External | Green | Cannot list-verify new ids |
| deep-loop runtime vitest | Internal | Green | Cannot prove allowlist parity |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A new uid lists but does not resolve, or a mirror-drift test fails.
- **Procedure**: Remove the added uids from the array, the Set, the vitest fixtures, and the doc rows; revert the family wording and changelog. Pure superset — removal is clean, no data migration.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Code) ──► Phase 2 (Tests + Docs) ──► Phase 3 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Code | None | Tests + Docs |
| Tests + Docs | Code | Verify |
| Verify | Tests + Docs | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Code | Low | ~15 min |
| Tests + Docs | Low-Med | ~60 min |
| Verification | Low | ~20 min |
| **Total** | | **~1.5 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] No data migrations involved
- [x] Change is a pure superset (existing dispatch unaffected)
- [x] Guard tests assert the exact id sets

### Rollback Procedure
1. Revert the allowlist array and the Set mirror.
2. Revert the vitest fixtures.
3. Revert the doc rows and family wording.
4. Re-run the deep-loop vitest to confirm the pre-change baseline.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->
