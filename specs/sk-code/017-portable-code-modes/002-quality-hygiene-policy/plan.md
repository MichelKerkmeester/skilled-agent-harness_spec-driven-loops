---
title: "Implementation Plan: Phase 2: quality-hygiene-policy"
description: "Add a --disable-rule flag to the comment-hygiene checker and a commentHygiene.disableRules config key that maps to it, refuse fixed and unknown ids, and route the pre-commit hook and CI job through the same loader."
trigger_phrases:
  - "quality hygiene policy plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 2: quality-hygiene-policy

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Python 3 (checker), Node.js CommonJS (config, runner, doctor), bash (hooks, CI) |
| **Framework** | None |
| **Storage** | None |
| **Testing** | `node --test`, the bash suites beside the checker and the pre-commit hook |

### Overview

The checker gains `--disable-rule`, which drops a core pattern and refuses any id the shared contract fixes. The config module validates `commentHygiene.disableRules` against the checker's own rule table and the contract, and one function builds the checker flags. The runner, a new flag helper for the pre-commit hook and CI job, and the doctor all reach the config through that module.
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
- [x] The quality node suite prints `pass 127` and `fail 0`
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

One loader, two flag builders: the full set for the runner and the disabled rules alone for pre-commit and CI.

### Key Components
- **`check-comment-hygiene.sh`**: `--disable-rule` resolves a bare or `hygiene.`-qualified name, refuses an id the contract fixes (exact or by class wildcard) and refuses a name its table lacks.
- **`quality-config.cjs`**: `readHygieneRules` parses the checker's `VIOLATION_PATTERNS` block, `disabledHygieneRule` applies the same refusals, `mergeConfig` normalizes the list, `hygieneDisableFlags` builds the `--disable-rule` argv and `hygieneCheckerFlags` adds the additions in front of it for the runner.
- **`hygiene-config-flags.cjs`**: loads the config with `loadConfig` and prints the `--disable-rule` flags alone, NUL-separated, exit 3 on a config fault.
- **`quality-gate.cjs`**: `hygieneFlags` delegates to `hygieneCheckerFlags`, and `configSummary` adds `hygiene.disabled`.

### Data Flow

`.sk-code/quality.json` is discovered and validated by `loadConfig`. The runner passes the merged flags to the checker and reports the disabled ids in its verdict. The pre-commit hook and CI job call the helper for the disabled rules alone, read its NUL-separated output into an array and place it before `--` on the checker call. A helper exit other than 0 prints a warning and the checker runs with no flag.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Comment-hygiene checker | 21 fixed rules | update: `--disable-rule` | bash suite `All comment hygiene test cases passed` |
| Quality config and runner | Add-only hygiene keys | update: `disableRules`, `config.hygiene` | `node --test` pass 126 |
| Pre-commit hook and legacy helper | Never read the config | update: read the disabled rules through the helper | `pre-commit.test.sh` 152 passed |
| CI hygiene job | Never read the config | update: read flags through the helper | `actionlint` exit 0, local replay of its run block |
| `/doctor:sk-code quality` | Config, trust, tools | update: disabled list and init suggestion | doctor suite pass 11 |
| Post-edit hook | Advisory warning | not a consumer, by decision | its suite still passes |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. Setup reads the checker, the config module and the callers, Implementation writes the flag, the key and the wiring, and Verification runs each new test against HEAD and against the final source.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Config validation of unknown and fixed ids, the rule list, the flag builder | `node --test` |
| Integration | The runner on a foreign fixture with and without the key, the pre-commit hook in a throwaway repository, the doctor as a process | `node --test`, `pre-commit.test.sh` |
| Manual | The CI run block replayed in a scratch repository with no config, a valid config and an invalid one | bash |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `shared/references/universal/rule-overrides.json` and `loadContract` | Internal | Green | A missing file fails closed in both readers |
| `node` on the CI runner and in the hook's PATH | External | Green | Without node the layer keeps every core rule |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A layer disables a rule it should not, or a hook or CI run breaks.
- **Procedure**: Revert the phase commit. No repository in this tree sets the key, so reverting changes no verdict here.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation | Phase close |
<!-- /ANCHOR:phase-deps -->
