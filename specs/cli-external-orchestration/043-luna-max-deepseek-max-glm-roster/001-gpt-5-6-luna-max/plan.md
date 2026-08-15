---
title: "Implementation Plan: GPT-5.6 Luna Max Dispatch Support (cli-cursor + cli-devin)"
description: "Additive edits to the two hand-synced enforcement points (executor-config.ts arrays + fanout-run.cjs Sets), their vitest fixtures, and every doc/count that would otherwise go stale, verified by the deep-loop unit suite and validate.sh --strict."
trigger_phrases:
  - "luna max roster plan"
  - "luna max phase 001 plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/043-luna-max-deepseek-max-glm-roster/001-gpt-5-6-luna-max"
    last_updated_at: "2026-08-15T09:00:00Z"
    last_updated_by: "pi"
    recent_action: "Authored implementation plan; executed as part of the combined 2026-08-14 roster change"
    next_safe_action: "None; phase complete"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts"
      - ".opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "impl-043-luna-max-deepseek-max-glm-roster"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: GPT-5.6 Luna Max Dispatch Support (cli-cursor + cli-devin)

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
The cli-cursor and cli-devin rosters live in two hand-synced places pinned to each other by a guard test: `CURSOR_SUPPORTED_MODELS` / `DEVIN_SUPPORTED_MODELS` (TS source of truth) and `CURSOR_ALLOWED_MODELS` / `DEVIN_ALLOWED_MODELS` (JS Set mirrors in `fanout-run.cjs`). Luna Max joins both as a pure additive superset: `gpt-5.6-luna-max` / `gpt-5.6-luna-max-fast` on cursor, `gpt-5-6-luna-max` / `gpt-5-6-luna-max-priority` on devin (Devin's Fast suffix is `-priority`). Executed together with phase 002 (DeepSeek max) in one combined change on 2026-08-14.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Every added id list-verified against a live CLI listing (2026-08-14)
- [x] Dependencies identified (both CLIs installed)

### Definition of Done
- [x] All acceptance criteria met
- [x] Deep-loop vitest passing
- [x] Docs (rosters + honesty sweep + changelogs) updated
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Dual hand-synced allowlist (TS source of truth + CJS runtime mirror) with a cross-check test enforcing byte-parity.

### Key Components
- **`executor-config.ts` arrays**: type-level source of truth; a hard-rejecting `is*ModelAllowed` gate.
- **`fanout-run.cjs` Sets**: synchronous runtime gate used during fanout command construction.

### Data Flow
A fanout lineage names a model → the builder checks the Set → rejects off-list ids before a command is built.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `CURSOR_SUPPORTED_MODELS` / `DEVIN_SUPPORTED_MODELS` | allowlist source of truth | update (additive) | vitest sorted-array assertion |
| `CURSOR_ALLOWED_MODELS` / `DEVIN_ALLOWED_MODELS` | runtime mirror | update (additive) | `ALLOWED ≡ SUPPORTED` cross-check |
| `combo-matrix.vitest.ts` | exercises every model in the arrays | unchanged (auto-derives) | derivation assertion passes |
| `providers-and-models.md` ×2 + honesty-sweep docs | roster catalog + count claims | update | grep sweep for residual stale counts |

Required inventories:
- Consumers of the arrays: `rg -n 'CURSOR_SUPPORTED_MODELS|DEVIN_SUPPORTED_MODELS|CURSOR_ALLOWED_MODELS|DEVIN_ALLOWED_MODELS' .opencode/skills/system-deep-loop`.
- Stale-count producers: `rg -n '18-id|10 allowed' .opencode/skills/cli-external-orchestration`.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Code
- [x] `executor-config.ts`: +2 cursor ids, +2 devin luna uids, sorted; honest comments
- [x] `fanout-run.cjs`: mirror both Sets

### Phase 2: Tests + Docs
- [x] Update cursor/devin vitest fixtures (luna rows)
- [x] Two `providers-and-models.md` rosters + honesty sweep + changelogs + version bumps

### Phase 3: Verification
- [x] Deep-loop vitest green
- [x] Residual-count grep clean
- [x] `validate.sh --strict`
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | allowlist arrays + fanout command builders | vitest |
| Integration | cross-check (ALLOWED≡SUPPORTED), combo-matrix derivation | vitest |
| Manual | live `--list-models` / `models list` id verification | cursor-agent / devin |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| cursor-agent / devin CLIs | External | Green | Cannot list-verify new ids |
| deep-loop runtime vitest | Internal | Green | Cannot prove allowlist parity |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A new id lists but does not resolve, or a mirror-drift test fails.
- **Procedure**: Remove the added ids from both arrays, both Sets, the vitest fixtures, and the doc rows; revert the count/family wording and changelogs. Pure superset — removal is clean, no data migration.
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
| Code | Low | ~20 min |
| Tests + Docs | Med | ~90 min (honesty sweep dominates) |
| Verification | Low | ~30 min |
| **Total** | | **~2.5 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] No data migrations involved
- [x] Change is a pure superset (existing dispatch unaffected)
- [x] Guard tests assert the exact id sets

### Rollback Procedure
1. Revert the two allowlist arrays and two Set mirrors.
2. Revert the vitest fixtures.
3. Revert the doc rows, count/family wording, and changelogs.
4. Re-run the deep-loop vitest to confirm the pre-change baseline.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->
