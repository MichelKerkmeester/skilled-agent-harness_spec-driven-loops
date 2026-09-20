---
title: "Implementation Plan: Gemini 3.7 Flash High Dispatch Support (cli-cursor + cli-devin)"
description: "Additive edits to the two hand-synced enforcement points (executor-config.ts arrays + fanout-run.cjs Sets), their vitest fixtures, and every doc/count that would otherwise go stale, verified by the deep-loop unit suite and validate.sh --strict."
trigger_phrases:
  - "gemini 3.7 flash high plan"
  - "gemini phase 004 plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/043-roster-update-luna-deepseek-glm-gemini/004-gemini-3-7-flash-high"
    last_updated_at: "2026-08-15T13:00:00Z"
    last_updated_by: "pi"
    recent_action: "Authored implementation plan; executed with dispatch-test evidence on 2026-08-15"
    next_safe_action: "None; phase complete"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts"
      - ".opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "impl-043-phase-parent"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Gemini 3.7 Flash High Dispatch Support (cli-cursor + cli-devin)

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
| **Testing** | `vitest run` on executor-config / fanout-run / combo-matrix + two live dispatch probes |

### Overview
The cli-cursor and cli-devin rosters live in two hand-synced places pinned to each other by a guard test: `CURSOR_SUPPORTED_MODELS` / `DEVIN_SUPPORTED_MODELS` (TS source of truth) and `CURSOR_ALLOWED_MODELS` / `DEVIN_ALLOWED_MODELS` (JS Set mirrors in `fanout-run.cjs`). Gemini 3.7 Flash High joins both as a pure additive superset: `gemini-3.7-flash-high` on cursor (display name "Gemini 3.7 Flash"), `gemini-3-7-flash-high` on devin. High tier only. Evidence: list-verified AND dispatch-tested on 2026-08-15.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Every added id list-verified against a live CLI listing (2026-08-15)
- [x] Dependencies identified (both CLIs installed and authenticated)

### Definition of Done
- [x] All acceptance criteria met
- [x] Deep-loop vitest passing
- [x] Both ids dispatch-tested end-to-end (receipts on file)
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
| `providers-and-models.md` ×2 + honesty-sweep docs | roster catalog + count/family claims | update | grep sweep for residual stale claims |
| `smart-routing.md` | devin roster mention | update | grep |

Required inventories:
- Consumers of the arrays: `rg -n 'CURSOR_SUPPORTED_MODELS|DEVIN_SUPPORTED_MODELS|CURSOR_ALLOWED_MODELS|DEVIN_ALLOWED_MODELS' .opencode/skills/system-deep-loop`.
- Stale-claim producers: `rg -n '20-id|20 ids|five families|Claude / Gemini / Kimi' .opencode/skills/cli-external-orchestration`.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Evidence
- [x] Capture verbatim live listings (cursor + devin) into `evidence/live-listings.txt`
- [x] Dispatch-test both ids (probe prompts, exit 0, marker echo) → receipts in `evidence/`

### Phase 2: Code
- [x] `executor-config.ts`: +1 cursor id, +1 devin uid, sorted; honest dispatch-tested comments
- [x] `fanout-run.cjs`: mirror both Sets

### Phase 3: Tests + Docs
- [x] Update cursor/devin vitest fixtures (+1 each, negatives for sibling tiers)
- [x] Two `providers-and-models.md` rosters + honesty sweep + out-of-scope wording + changelogs + version bumps
- [x] Hub + runtime changelogs; smart-routing mention

### Phase 4: Verification
- [x] Deep-loop vitest green
- [x] Residual grep clean
- [x] `validate.sh --strict` on phase 004 + `--recursive --strict` on parent
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | allowlist arrays + fanout command builders | vitest |
| Integration | cross-check (ALLOWED≡SUPPORTED), combo-matrix derivation | vitest |
| Live | id presence + end-to-end dispatchability | cursor-agent / devin probe dispatches |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| cursor-agent / devin CLIs | External | Green | Cannot list-verify or dispatch-test |
| deep-loop runtime vitest | Internal | Green | Cannot prove allowlist parity |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A new id lists but does not resolve, or a mirror-drift test fails.
- **Procedure**: Remove the added ids from both arrays, both Sets, the vitest fixtures, the doc rows, and the count/family wording; revert changelogs and version bumps. Pure superset — removal is clean, no data migration.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Evidence) ──► Phase 2 (Code) ──► Phase 3 (Tests + Docs) ──► Phase 4 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Evidence | None | Code |
| Code | Evidence | Tests + Docs |
| Tests + Docs | Code | Verify |
| Verify | Tests + Docs | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Evidence | Low | ~30 min (two live dispatches) |
| Code | Low | ~20 min |
| Tests + Docs | Med | ~2 hours (honesty sweep dominates) |
| Verification | Low | ~30 min |
| **Total** | | **~3 hours** |
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
