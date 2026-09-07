---
title: "Implementation Plan: Phase 2: multiplexed-rule-split"
description: "Extract check-canonical-save.sh's five-case switch into five standalone scripts and remove orchestrator.ts's basename special case, without touching the ts:spec-doc-structure family."
trigger_phrases:
  - "canonical save script extraction"
  - "validator registry one to one"
  - "orchestrator special case removal"
  - "registry coverage regression plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 2: multiplexed-rule-split

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Bash (`rules/*.sh`) sourced by `orchestrator.ts`'s generated wrapper, plus Node `.cjs` helper modules |
| **Framework** | None. The validator-registry.json + orchestrator.ts dispatch contract |
| **Storage** | None |
| **Testing** | Vitest (`cli/tests/*.vitest.ts`) |

### Overview
Split `check-canonical-save-helper.cjs`'s five-case switch (`118-226`) into five standalone Node modules behind five new `rules/check-canonical-save-*.sh` wrappers, extract the shared helpers (`1-117`) into one required-by-all module, re-point the five registry rows and delete the orchestrator's basename special case since every script now identifies its own rule.
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
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
One-script-per-rule, matching the 34 already-1:1 registry rows (e.g. `check-toc-policy.sh`, `check-frontmatter.sh`). The five new scripts follow the exact `run_check(folder, level)` signature `orchestrator.ts`'s `REGISTRY_SHELL_RULE_WRAPPER` already calls for every non-multiplexed row.

### Key Components
- **`check-canonical-save-shared.cjs`**: the constants and pure helpers (`readJson`, `normalizePacketId`, `derivePacketIdFromPath`, `readContinuityPacketPointer`, `emit`, `CANONICAL_SAVE_CUTOFF`, `CANONICAL_SAVE_FRESHNESS_SLACK_MS`) every one of the five new scripts requires.
- **Five `check-canonical-save-<name>.sh` + `.cjs` pairs**: each pair owns exactly one registry row's `run_check` and one switch case's logic.
- **`orchestrator.ts`**: loses the `check-canonical-save.sh` basename branch (`146-149`). Every row now goes through the same plain `run_check "$folder" "$level"` call every other shell row already uses.

### Data Flow
`validate.sh` reads `validator-registry.json` -> for each `CANONICAL_SAVE_*` row, `orchestrator.ts` resolves its own `script_path` -> the generated wrapper sources that script and calls `run_check "$folder" "$level"` -> the script's own `run_check` shells out to its own `.cjs` module -> the `.cjs` module requires `check-canonical-save-shared.cjs` for the common reads -> the module emits `rule\t...`/`status\t...`/`message\t...` lines the wrapper already parses.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|---------------|
| `cli/rules/check-canonical-save-helper.cjs` | Multiplexed switch for 5 rule ids | Delete: logic moves into 1 shared + 5 dedicated modules | `git status` shows the file removed, `rg` for its old path returns no references |
| `cli/lib/validator-registry.json` | Names each row's `script_path` | Update: 5 rows get 5 distinct paths | `validate-runs-every-registry-rule.vitest.ts` |
| `lib/validation/orchestrator.ts` | Special-cases `check-canonical-save.sh` by basename | Update: remove the branch, since it has no target left | `rg -n "check-canonical-save.sh" lib/validation/orchestrator.ts` returns nothing |
| `cli/tests/canonical-save-validation.vitest.ts` | Exercises each row via `SPECKIT_RULES` filtering | Not a consumer of the removed env var. Unchanged | Suite passes unmodified |
| `cli/tests/validate-runs-every-registry-rule.vitest.ts` | Confirms every registry row fires | Not modified. Its coverage now spans 5 real scripts instead of 1 multiplexed one | Suite passes unmodified |
| `ts:spec-doc-structure`'s 5 rows (`FRONTMATTER_MEMORY_BLOCK` etc.) | Own dispatch-per-function inside one TS module | Not a consumer of this phase's change. Documented as already sound | `lib/validation/spec-doc-structure.ts:1249-1264` shows 5 distinct function calls |
| `cli/rules/README.md` | Documents the rule-to-script map | Update: file tree and description table | Doc review |

Required inventories:
- Same-class producers: `rg -n "CANONICAL_SAVE_" cli/lib/validator-registry.json` finds exactly the 5 rows in scope. No sixth row shares the old script.
- Consumers of changed symbols: `rg -n "check-canonical-save" .opencode/skills/system-spec-kit` finds `cli/rules/README.md`, `orchestrator.ts` and the registry itself. All three are in the Files to Change table.
- Matrix axes: 5 rule ids x 1 change each (new script path) = 5 rows. No cross-product beyond that, since each row's logic is independent of the others.
- Algorithm invariant: N/A - this phase moves code, it does not change a path/redaction/parser algorithm. The equivalent invariant is behavioral: each new script's pass/fail/message output for a given input folder must be byte-identical to the old switch case's output for the same input, verified by the unmodified `canonical-save-validation.vitest.ts` assertions.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Each new `check-canonical-save-<name>.cjs` module's pass/fail branches | Manual `node` invocation against the fixture folders `canonical-save-validation.vitest.ts` already builds |
| Integration | Registry-driven dispatch for all 5 rows | `validate-runs-every-registry-rule.vitest.ts` |
| Regression | Per-row message and grandfathering/slack behavior | `canonical-save-validation.vitest.ts` |
| Coverage | Whole-registry help output and rule count | `validate-help-lists-every-rule.vitest.ts`, `validator-registry-doc-count.vitest.ts` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|--------------------|
| `validate-runs-every-registry-rule.vitest.ts` | Internal | Green | Confirmed present. This is the primary regression floor |
| `canonical-save-validation.vitest.ts` | Internal | Green | Confirmed present at 219 lines with per-row tests already scoped by `SPECKIT_RULES` |
| `@spec-kit/shared/frontmatter/parse-frontmatter.js` (used by `readContinuityPacketPointer`) | Internal | Green | Must resolve identically from the new shared module's location |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: `validate-runs-every-registry-rule.vitest.ts` or `canonical-save-validation.vitest.ts` regresses, or `validate.sh --help`'s rule count changes.
- **Procedure**: `git revert` the split commit(s). `check-canonical-save.sh` and `check-canonical-save-helper.cjs` are only deleted after the five new scripts are confirmed working, so a revert restores the exact prior multiplexed file pair with no registry-schema migration to unwind.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup (read helper.cjs + orchestrator.ts wrapper) ──┐
                                                      ├──► Core (shared module, 5 new pairs, registry update, orchestrator cleanup) ──► Verify (4 named suites + --help diff)
Config (confirm run_check(folder, level) 2-arg shape) ┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core, Config |
| Config | Setup | Core |
| Core | Setup, Config | Verify |
| Verify | Core | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|-------------------|
| Setup | Low | 0.5 hour |
| Core Implementation | Medium | 3-4 hours (1 shared module + 5 script/module pairs + registry + orchestrator edit) |
| Verification | Low | 1 hour |
| **Total** | | **4.5-5.5 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] No data migration. `validator-registry.json` is the only schema-shaped file touched, and its shape (`rule_id`, `script_path`, `severity`, `category`, `description`) is unchanged, only values
- [ ] No feature flag needed
- [ ] Old files stay in place until the five new scripts pass their tests, so the split can be aborted mid-way without a broken state

### Rollback Procedure
1. `git revert` the commit(s).
2. Confirm `check-canonical-save.sh` and `check-canonical-save-helper.cjs` are back and `validator-registry.json`'s five rows point at the old path again.
3. Rerun `validate-runs-every-registry-rule.vitest.ts` and `canonical-save-validation.vitest.ts` to confirm the revert is clean.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: N/A.
<!-- /ANCHOR:enhanced-rollback -->

---
