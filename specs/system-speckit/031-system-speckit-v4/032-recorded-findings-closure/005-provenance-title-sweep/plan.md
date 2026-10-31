---
title: "Implementation Plan: Phase 5: provenance-title-sweep"
description: "A scripted literal-replacement sweep strips the provenance token from 929 in-scope titles and regenerates their metadata, landing in the same change as a new hard class in check-placeholders.sh that stops the token from returning."
trigger_phrases:
  - "provenance sweep plan"
  - "placeholder rule technical approach"
  - "title strip script"
  - "fixture parity testing strategy"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 5: provenance-title-sweep

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Bash, Node.js (existing metadata generators) |
| **Framework** | None |
| **Storage** | None. Edits land directly on committed Markdown |
| **Testing** | `tests/test-validation-extended.sh`, `tests/progressive-validation.vitest.ts`, `tests/test-validation-system.cjs`, `tests/scaffold-golden-snapshots.vitest.ts`, `npm run check` |

### Overview
A small script builds the in-scope file list from `grep -rIln '^title:.*\[template:level' specs`, filters out the four excluded groups, then rewrites each matched `title:` line with a literal regex substitution that removes the bracket token and nothing else. The same change adds a third detection block to `rules/check-placeholders.sh` mirroring the two existing hard classes, and brings the "valid" fixtures the extended suite and the progressive-validation tests treat as an unconditional pass in step with it. The sweep and the rule ship together so neither leaves the corpus in a state where `validate.sh --strict` disagrees with itself.
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
Literal-replacement sweep plus a validator-rule addition, the same shape `030-spec-kit-simplification-research/011-command-surface-contract-realignment` used for its own repo-wide rewrite: build the exact file list first, replace by exact match, assert zero residue, only then change the enforcement code.

### Key Components
- **Sweep script**: reads the exclusion list, rewrites each in-scope `title:` line, and lists every file it touched
- **`rules/check-placeholders.sh` third class**: a new grep block over the `spec.md`/`plan.md`/`tasks.md`/`decision-record.md` set the rule already scans, matching `^title:.*\[template:level`
- **Fixture parity pass**: `002-valid-level1`, `003-valid-level2`, `004-valid-level3` swept the same way as the live corpus. `072-scaffold-never-touched-violation` read and left as-is since its purpose is to model an untouched scaffold

### Data Flow
`grep` file list → exclusion filter → per-file title rewrite → per-packet `generate-description.js` + `backfill-graph-metadata.js` → rule file edit → fixture sweep → full suite run.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `rules/check-placeholders.sh` | Detects two hard placeholder classes across `spec.md`/`plan.md`/`tasks.md`/`decision-record.md` | update | isolated rule test in `test-validation-extended.sh`. `bash rules/check-placeholders.sh` against a fixture before and after the sweep |
| `spec/check-placeholders.sh` | Standalone bracket scan. Documented as the token's home but its `[A-Z]`-anchored pattern never actually matches `[template:level...]` | unchanged | this phase adds detection to the registry rule instead of fixing the standalone script's pattern, since the registry rule is the one `validate.sh --strict` runs. Noted as a discovered but out-of-scope gap |
| `test-fixtures/002-valid-level1`, `003-valid-level2`, `004-valid-level3` | Read across the extended suite, `progressive-validation.vitest.ts` and `test-validation-system.cjs` as unconditional "valid" baselines, including under `--strict` | update | every test file that references each fixture name is grepped first. The fixtures are swept before the rule change lands |
| `test-fixtures/072-scaffold-never-touched-violation` | Models a Complete-status packet whose `plan.md` still carries scaffold markers, asserted to fail with `SCAFFOLD_NEVER_TOUCHED` | not a consumer of this change | left untouched. Its title token is part of the scenario it tests, not a defect |
| 929 in-scope packet titles | Frontmatter `title:` field only | update | `grep -rIl '\[template:level' specs` returns only the four excluded groups after the sweep |
| Excluded packets (`sk-doc/052-routing-completeness`, `system-deep-loop/036-deep-loop-innovation`, `sk-design/*`) | Same defect, owned by other sessions | unchanged | named explicitly so a later strict run on those packets is understood as pre-existing, not a regression this phase introduced |

Required inventories:
- Same-class producers: `grep -rIln '^title:.*\[template:level' specs` re-run at execution time is the authoritative file list, not the count written in spec.md.
- Consumers of changed symbols: `grep -rl '\[template:level' .opencode/skills/system-spec-kit/runtime/cli/test-fixtures/` finds every fixture that needs the same sweep. `grep -rn "002-valid-level1\|003-valid-level2\|004-valid-level3" .opencode/skills/system-spec-kit/runtime/cli/tests/` finds every test that reads them.
- Matrix axes: exclusion group (system-speckit-owned vs. the four other-session groups) by token shape (hyphen `level-N` vs. underscore `level_N`). Both shapes share the `[template:level` prefix the rule matches.
- Algorithm invariant: a title's provenance token is removed if and only if the packet is not under one of the four excluded prefixes. The sweep script asserts this by re-checking the file's own path against the exclusion list at write time, not by trusting a list built earlier in the run.
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
| Unit | `PLACEHOLDER_FILLED` isolated-rule cases (existing two classes plus the new third class) | `tests/test-validation-extended.sh` |
| Integration | Full runtime and CLI vitest projects, goldens, registry-coverage, `npm run check` | vitest, `npm run check` |
| Manual | `validate.sh --strict` on a sample of touched packets across every in-scope track, plus every excluded packet spot-checked to confirm it is unchanged | `runtime/cli/spec/validate.sh` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `030-spec-kit-simplification-research/018-scaffold-placeholder-and-upgrade-truth` (scaffolder no longer writes the token) | Internal | Green, shipped | Without it, sweeping the historical backlog while the scaffolder kept writing new instances would never converge |
| The four excluded packet groups staying out of scope | Internal | Green. Explicitly bounded in this plan | If touched anyway, this phase would be editing another session's in-flight work, a SCOPE LOCK violation |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: the sweep or the rule change causes a runtime/CLI vitest failure, a goldens mismatch, or a `validate.sh --strict` regression on a packet this phase touched
- **Procedure**: `git revert` the single commit. The sweep and the rule land together so a revert restores both the pre-sweep titles and the pre-change rule in one step
<!-- /ANCHOR:rollback -->

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
| Setup | Low | Build and audit the file list against the exclusion groups |
| Core Implementation | Med | Sweep script, rule addition, fixture parity edits |
| Verification | Med | Full runtime/CLI suites, goldens, registry-coverage, strict validation across every touched packet |
| **Total** | | Scripted sweep over ~930 files plus one rule file and three fixture folders |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Backup created (if data changes) - not needed. The change is tracked in git history
- [ ] Feature flag configured - none. The rule is a hard class in an existing registry rule, not flag-gated
- [ ] Monitoring alerts set - the full test suite run is the alert

### Rollback Procedure
1. `git revert` the sweep-and-rule commit
2. Rerun `tests/test-validation-extended.sh` and the runtime/CLI vitest projects to confirm the pre-change state is restored
3. Re-run `validate.sh --strict` on the packets this phase touched

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---
