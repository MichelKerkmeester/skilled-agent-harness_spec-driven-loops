---
title: "Implementation Plan: Drop the Grok 4.5 and 4.6 model families from the cli-devin skill and its executor roster; Grok is a Cursor-hosted model and its presence in devin's roster caused a misroute"
description: "Remove 7 bare devin-scoped Grok ids from the executor allowlists (executor-config.ts, fanout-run.cjs) and all cli-devin skill docs. Update the test fixture to match. Preserve all cursor-grok-* entries."
trigger_phrases:
  - "grok devin roster plan"
  - "drop grok devin implementation"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Drop the Grok 4.5 and 4.6 model families from the cli-devin skill and its executor roster; Grok is a Cursor-hosted model and its presence in devin's roster caused a misroute

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (executor-config.ts), CJS (fanout-run.cjs), Markdown |
| **Framework** | Vitest 4.1.x (tests) |
| **Storage** | None |
| **Testing** | Vitest — `runtime/tests/unit/fanout-run.vitest.ts` |

### Overview
Remove the 7 bare devin-scoped Grok ids from the executor allowlist constants in `executor-config.ts` and `fanout-run.cjs`. Update the corresponding allowlist fixture in `fanout-run.vitest.ts`. Remove all Grok table rows, prose, and examples from the four cli-devin skill docs. Replace Grok model recommendations with their appropriate devin-hosted alternatives (deepseek-v4-pro-max, gpt-5-6-luna-max).
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
- [x] Tests passing (112/112, exit 0)
- [x] Docs updated (spec/plan/tasks/acceptance-criteria/implementation-summary)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Data edit — no architectural pattern change.

### Key Components
- **`DEVIN_SUPPORTED_MODELS`** (`executor-config.ts`): TypeScript const array that defines the cli-devin allowlist enforced at runtime.
- **`DEVIN_ALLOWED_MODELS`** (`fanout-run.cjs`): Hand-duplicated CJS mirror of the allowlist used in the fan-out script (both must stay in sync).
- **Allowlist fixture** (`fanout-run.vitest.ts`): Unit test that iterates every model id in the fixture and asserts the command builder accepts it — must match the runtime arrays.

### Data Flow
A dispatch prompt names a model id → `buildDevinLineageCommand()` in `fanout-run.cjs` checks the id against `DEVIN_ALLOWED_MODELS` → rejects with `inputError` if not in the list → the same check is mirrored by `isDevinSupportedModel()` in `executor-config.ts`. Removing the bare Grok ids from both arrays makes the allowlist tell the truth.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `executor-config.ts` `DEVIN_SUPPORTED_MODELS` | TypeScript allowlist constant | Remove 7 bare Grok ids | `rg -n 'grok-4-[56]-' executor-config.ts` returns 0 hits |
| `fanout-run.cjs` `DEVIN_ALLOWED_MODELS` | CJS allowlist mirror | Remove 7 bare Grok ids | `rg -n 'grok-4-[56]-' fanout-run.cjs` returns 0 hits |
| `fanout-run.vitest.ts` allowlist fixture | Unit test consumer | Remove 7 bare Grok ids from fixture array | 112 tests pass, exit 0 |
| `providers-and-models.md` | Model table and roster notes | Remove 7 table rows, update family count and notes | No bare grok table rows; family count = 5 |
| `SKILL.md` | Model selection table, curated family list, selection strategy, rule 7 | Remove all bare Grok references | `rg 'grok' SKILL.md` returns no in-scope hits |
| `README.md` | FAQ model recommendation | Replace grok with deepseek-v4-pro-max | `rg 'grok' README.md` returns 0 hits |
| `cli-reference.md` | Usage examples, selection table, env var reference | Replace grok model ids | `rg 'grok' cli-reference.md` returns 0 hits |
| `cli-devin/changelog/` | Historical record | Unchanged — out of scope | Not touched |
| `cursor-grok-*` entries everywhere | Cursor executor allowlist | Unchanged — safety constraint | Count = 8/8 in both runtime files |
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`; it owns the Setup, Implementation, and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Allowlist fixture in `fanout-run.vitest.ts` — all ids accepted/rejected | Vitest 4.1.x |
| Grep | Bare grok id absence in runtime and skill docs | `rg` |
| Grep | Cursor-grok survival (count must equal baseline 8) | `rg -c` |
| Spec | Packet docs completeness and placeholder fill | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Vitest 4.1.x | Internal | Green | Test suite cannot run |
| None external | — | — | — |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A cursor-grok entry was accidentally removed (count drops below 8 in either runtime file).
- **Procedure**: `git diff` to identify removed lines; restore via `git checkout -- <file>` on the affected runtime file and re-verify count.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──────┐
                      ├──► Phase 2 (Core) ──► Phase 3 (Verify)
Phase 1.5 (Config) ───┘
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
|-------|------------|------------------|
| Setup | Low | 15 min (baseline grep counts) |
| Core Implementation | Low | 30 min (7 file edits) |
| Verification | Low | 15 min (tests + grep checks + validate.sh) |
| **Total** | | **~1 hour** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] No data migrations — allowlist-only change
- [x] No feature flag needed
- [x] No monitoring alerts needed

### Rollback Procedure
1. `git diff` to identify the exact lines removed.
2. Restore affected file: `git checkout -- <file>`.
3. Rerun `npx vitest run` and cursor-grok count checks.
4. No stakeholder notification required (internal tooling only).

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---

