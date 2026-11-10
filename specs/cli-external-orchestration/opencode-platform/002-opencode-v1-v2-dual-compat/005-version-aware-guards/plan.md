---
title: "Implementation Plan: Phase 5: version-aware-guards"
description: "Widen the dispatch classifier to opencode2, give each hard rule an applicability list, and add one memoised version resolver that the rule engine calls."
trigger_phrases:
  - "version aware guards plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 5: version-aware-guards

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JavaScript ES modules (`.mjs`) and JSON. Node built-ins only. |
| **Framework** | None. The guard libraries are dependency-free by design. |
| **Storage** | None. The resolver keeps an in-memory cache for one process. |
| **Testing** | `node --test` for `dispatch-rule-checks.test.mjs`. Vitest for `dispatch-audit.test.mjs`, the Codex and Pi tests. The runner for each file is listed in tasks.md CHK-002. |

### Overview
The classifier stops matching the exact name `opencode`, and it matches `opencode\d*` instead. Each hard rule gains an `appliesTo` list. One memoised resolver reports `v1`, `v2` or `unknown` from parsed `--version` output. The rule engine calls that resolver when the caller passes no version, and it evaluates only the rules that fit the result. The v2 slash-prompt rule warns instead of blocking.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] The 001 baseline or the T002 counts exist for every guard suite.
- [ ] Open questions Q1 to Q5 in spec.md have an answer or the stated default.
- [ ] The backup of each file to change exists under `scratch/backup/`.

### Definition of Done
- [ ] Every acceptance criterion in acceptance-criteria.md is Met or Waived with an ADR.
- [ ] Every guard suite in CHK-002 exits 0 at or above its baseline count.
- [ ] The cross-family review has no open P0 or P1 finding.
- [ ] The scoped diff touches only the files named in spec.md section 3.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
A pure rule engine with one memoised probe at its edge. The probe is the only process spawn, and it is injected so the parser tests run without a binary.

### Key Components
- **Classifier** (`dispatch-audit.mjs`): finds the executor token in a command. It admits `opencode\d*` by predicate.
- **Resolver** (`opencode-version.mjs`): parses `--version` output into `v1`, `v2` or `unknown`. It caches the result by realpath, size and mtime.
- **Rule engine** (`dispatch-rule-checks.mjs`): filters the rules by `appliesTo` against the resolved version, then runs each check.
- **Rule sidecar** (`hard-rules.json`): declares each rule with its `appliesTo` list and severity.

### Data Flow
A command reaches the classifier. The classifier returns the executor token. The engine asks the resolver for the version of that token, and the resolver returns the cached result or runs one probe. The engine keeps the rules whose `appliesTo` includes the result, or both versions on `unknown`, and runs them. A blocking verdict comes back only from an error-severity rule that applies.

### Applicability matrix (required rows, listed before implementation)

| Row | Name | Probe output | Resolved | Rules evaluated |
|-----|------|--------------|----------|-----------------|
| R1 | `opencode` | `1.19.3` | v1 | v1 and both-version rules |
| R2 | `opencode2` | `opencode v2.0.32` | v2 | v2 and both-version rules |
| R3 | `opencode2` | `1.19.3` | v1 | The name is ignored. v1 rules run. |
| R4 | `opencode` | `opencode v2.0.32` | v2 | The name is ignored. v2 rules run. |
| R5 | `opencode2` | empty or unparsable | unknown | Both-version rules at their own severity, version-specific rules at warn |
| R6 | `opencode` | probe times out | unknown | Both-version rules at their own severity, version-specific rules at warn |
| R7 | `/abs/path/opencode` | not probed | unknown | Both-version rules at their own severity, version-specific rules at warn (Q4) |
| R8 | `opencode2` | probe fails to spawn | unknown | Both-version rules at their own severity, version-specific rules at warn |

Each row maps to one test name in the dispatch test files.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This phase fixes a fail-open hole. The surfaces below come from a same-class search.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `dispatch-audit.mjs` `EXECUTOR_BASENAMES` (line 51), the `directExecutor` test (line 210) and the membership test (line 244) | The exact-name admission of executors | update to the `opencode\d*` predicate | `rg -n 'EXECUTOR_BASENAMES' .skilled/hooks` shows only the predicate |
| `dispatch-audit.mjs` evidence regex (lines 28 and 248) | Matches `opencode run` with a word boundary | update to `opencode\d*` | `rg -n 'opencode\s+run' .skilled/hooks/dispatch/lib/dispatch-audit.mjs` returns no line without `\d*` |
| `dispatch-rule-checks.mjs` regexes (lines 36, 128 and 137) | The same literal in the stdin and pipe checks | update to `opencode\d*` | `rg -n 'opencode\s+run' .skilled/hooks/dispatch/lib/dispatch-rule-checks.mjs` returns no line without `\d*` |
| `dispatch-preflight-lint.mjs` in `claude/`, `codex/` and `devin/` | Callers of `evaluate` | unchanged source, because `evaluate` resolves the version itself | CHK-002 runs the Codex test. REQ-007 tests the verdicts. |
| `dispatch-preflight-lint.ts` in `pi/` | Caller of `inspectDispatch` | unchanged source | Pi vitest file in CHK-002 |
| `.opencode/plugins/cli-dispatch-audit.js` | Runtime audit plugin that imports the same libraries | unchanged source, because plugins are 002 and 003 | `.opencode/plugins/tests/source-root-consumers.test.cjs` in CHK-002 |
| `hard-rules.json` readers | `readHardRules` and the sidecar tests | a rule without `appliesTo` reads as both versions | the reader test in `dispatch-rule-checks.test.mjs` |

Required inventories:
- Same-class producers: `rg -n 'opencode\s+run|EXECUTOR_BASENAMES' .skilled/hooks .skilled/skills/cli-external-orchestration/cli-opencode`.
- Consumers of changed symbols: `rg -l 'hard-rules|dispatch-rule-checks|dispatch-audit' .skilled/hooks .skilled/commands .opencode/plugins`. The result is the consumer list above. The `git-setup-check.cjs` match reads the sk-git sidecar, so it is out of scope.
- Matrix axes: binary name, probe result, and rule `appliesTo`. The rows are R1 to R8 above.
- Algorithm invariant: the version comes from parsed output only. A probe failure or an unparsable line returns `unknown`. The resolver never returns `v1` or `v2` from the name. The adversarial table below covers the parser.

Adversarial table for the parser and resolver (tests in the red set, T004):

| Case class | Input | Expected |
|------------|-------|----------|
| Delimiter | `1.19.3\r\n` (CRLF) and a trailing space | `v1` |
| Joined input | `opencode v2.0.32 1.19.3` on one line | `v2`, the first version token wins. The tail is ignored. |
| Outside root | a path-qualified binary, such as `/tmp/x/opencode` | `unknown`, with no probe call |
| No-op | empty output | `unknown` |
| Fallback | the probe throws or times out | `unknown`, and the rule engine runs both-version rules |
| Hostile env | `OPENCODE_BIN` set to a value with spaces and shell metacharacters | the value is used as a single argv entry, never through a shell |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification checkboxes and their state.

### 4.1 Ordered steps

1. **Baseline (Orchestrator).** Record the pass and fail counts of every suite in CHK-002, and save the output under `scratch/`. Rollback: none, because this step only reads.
2. **Backup (Orchestrator).** Copy each file to change into `scratch/backup/`. Rollback: this step creates the backups. Each later step restores from them.
3. **Red tests (Luna).** Add the failing cases to the two test files, covering R1 to R8, the adversarial table and the v2 slash fixture. Rollback: restore both test files from `scratch/backup/`.
4. **Red run (Orchestrator).** Run the new cases and record the first failing assertion for each one. This is the negative control. Rollback: none, because this step only reads.
5. **Resolver (Luna).** Create `opencode-version.mjs` with a pure parser, an injectable probe, and a cache keyed by realpath, size and mtime. Rollback: delete the new file.
6. **Sidecar (Luna).** Add `appliesTo` to the five rules and add the v2 slash-prompt rule. Rollback: restore `hard-rules.json` from `scratch/backup/`.
7. **Classifier (Luna).** Replace the exact-name tests with the predicate and widen the evidence regexes in `dispatch-audit.mjs`. Rollback: restore `dispatch-audit.mjs` from `scratch/backup/`.
8. **Rule engine (Luna).** Widen the regexes in `dispatch-rule-checks.mjs`, filter by `appliesTo` inside `evaluate`, add the v2 slash check, and let `evaluate` call the resolver when no version is passed. Rollback: restore `dispatch-rule-checks.mjs` from `scratch/backup/`.
9. **Green run (Orchestrator).** Rerun the new cases, then every suite in CHK-002. Compare the counts with step 1. Rollback: none, because this step only reads.
10. **Cross-family review (DeepSeek).** Review the full diff findings first, against `sk-code/sk-code-opencode`. Make no edits. Rollback: none.
11. **Fixes (Luna).** Fix each P0 and P1 finding that the orchestrator confirms against the real symptom. Before each fix, copy the file to `scratch/backup/fix-<n>/`. Rollback: restore from that copy.
12. **Final state (Orchestrator).** Run the same-class search again, check `git status` for the scoped files, and confirm no other file changed. Delete `scratch/backup/` after the final green run. Rollback: none, because this step only reads and deletes scratch files.

### 4.2 Dispatch plan

- **Luna, GPT-6 Luna max fast through cli-codex.** Steps 3, 5, 6, 7, 8 and 11. Code only, inside the files listed in spec.md section 3.
- **DeepSeek, DeepSeek V4.1 Flash max through cli-devin.** Step 10. Review only.
- **Orchestrator.** Steps 1, 2, 4, 9 and 12, and every test run. The codex write sandbox blocks local sockets, and the Pi and Vitest tests need the repo's `node_modules`.
- **Cross-family rule.** Luna's code gets DeepSeek's review. No DeepSeek docs are written in this phase, so no reverse review is needed.
- **Orchestrator checks.** Every `node --test`, Vitest, `node --check` and `jq empty` run, and every `rg` inventory.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Red-first unit | R1 to R8, the adversarial table, the `appliesTo` filter and the v2 slash fixture | `node --test` for the rule-checks file, Vitest for the audit file |
| Regression | Every guard suite in CHK-002, compared with the baseline | The runner each file names |
| Consumer | The Codex, Pi and `.opencode` suites that import the libraries | Vitest or `node --test`, per file |
| Syntax | Each changed `.mjs` file and `hard-rules.json` | `node --check` and `jq empty` |
| Manual | None. The guard is a pure library. | Not applicable |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 004 `agents-commands-config` landed | Internal | Green once 004 closes | The phase cannot start |
| 001 baseline counts, or the T002 counts | Internal | Green once T002 runs | No before number for "no regressions" |
| Research sections 5 and 6, iteration-010 | Internal | Green. Read. | Wrong rule validity values |
| Node 26 and the repo's `node_modules` | External | Green at planning time | Tests cannot run |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: any green run falls below its baseline, or a v1 verdict changes under REQ-007.
- **Procedure**: restore each changed file from `scratch/backup/`. Delete `opencode-version.mjs`. Rerun the CHK-002 suites and compare with the baseline. The repo has other uncommitted work, so do not use `git checkout` on these files.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Step 1 (Baseline) ──► Step 3 (Red tests) ──► Step 4 (Red run) ──► Step 5 (Resolver)
Step 2 (Backup) ──────┘                                              │
                                                                     ├──► Step 6 (Sidecar)
                                                                     ├──► Step 7 (Classifier)
                                                                     └──► Step 8 (Rule engine) ──► Step 9 (Green run) ──► Step 10 (Review) ──► Step 11 (Fixes) ──► Step 12 (Final state)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Baseline and backup | None | Red tests |
| Red tests and red run | Backup | Resolver |
| Resolver | Red run | Sidecar, classifier, rule engine |
| Green run | Sidecar, classifier, rule engine | Review |
| Final state | Fixes | Close-out |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup (steps 1 and 2) | Low | One orchestrator pass |
| Core implementation (steps 3 to 8) | Medium | About five Luna dispatches, one per file group |
| Verification (steps 9 to 12) | Medium | One DeepSeek review, one fix dispatch, and the orchestrator runs |
| **Total** | | **About eight dispatches** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Backups exist under `scratch/backup/` for each file to change (step 2).
- [ ] Baseline counts are saved under `scratch/` (step 1).
- [ ] No feature flag exists for the guard. The rollback is the restore in section 7.

### Rollback Procedure
1. Restore each changed file from `scratch/backup/`, or from the per-fix copy when the failure is in a fix.
2. Delete `opencode-version.mjs` if it exists.
3. Rerun every suite in CHK-002 and compare with the baseline.
4. Report the failing suite and its first failing assertion to the operator.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: Not applicable. The guard stores no data.
<!-- /ANCHOR:enhanced-rollback -->
