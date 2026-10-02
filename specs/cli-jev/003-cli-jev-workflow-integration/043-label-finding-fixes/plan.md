---
title: "Implementation Plan: Phase 43: label-finding-fixes"
description: "Three fixes, each in the file that owns its defect: 027's gold counts every cited file, goal-core's verifier judges the tail of long evidence, and 006's scorer gains the Jev and Deem arms its spec defines. Workers write the code, the session reruns every suite and commits each fix on its own."
trigger_phrases:
  - "label finding fixes plan"
  - "stop rater gold fix plan"
  - "goal verifier clamp fix plan"
  - "goal lint model arm plan"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 43: label-finding-fixes

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js CommonJS scripts |
| **Framework** | None |
| **Storage** | JSONL files, plus each run's `--out` folder |
| **Testing** | vitest for 027, `node --test` for 003 and 006 |

### Overview
Each defect gets a short brief to one worker, Luna 6 max on cli-codex or SWE 2 max on cli-devin, naming the file, the change and the suite to pass. The session reruns that suite and the neighboring ones, updates the doc that describes the behavior, and commits that fix alone. One DeepSeek V4.1 Flash review covers all three at the end.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented. Evidence: `spec.md` sections 2 and 3, from phase 042's decisions logs.
- [x] Success criteria measurable. Evidence: `goal.md` section 3 names a command and a count for each.
- [x] Dependencies identified. Evidence: `spec.md` Phase Context.

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Other: offline scorers and a shared library, each changed in place.

### Key Components
- **`score-stop-rater.cjs`**: derives 027's gold iteration from delta files and filters the lineage set.
- **`goal-core.cjs`**: holds the heuristic verifier every runtime but OpenCode uses.
- **`score-goal-lint.cjs`**: scores 006's lexical lint against labels, and gains the model arms.

### Data Flow
027 reads tracked lineage configs and delta files and prints a census. goal-core reads a turn's transcript text and returns a verdict. 006's scorer joins the label file to the lint's records by id and text hash, and with `--jev` or `--deem` asks the backend about each joined criterion.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `deriveGold()` and `isMovable()` | Produce 027's gold and sample | Update | `score-stop-rater.vitest.ts`, then the census |
| 027's feature catalog entry | Describes the gold rule | Update | `validate_document.py` |
| `verifyGoalHeuristic()` | Produces the verdict for Pi, Cursor, Devin and Claude | Update | goal-core, goal-pi and labeled-set suites |
| `.opencode/plugins/opencode-goal.js` | Holds its own copy of the clamp | Unchanged, out of scope | `clamp_defects` still counts its cases |
| `score-goal-lint.cjs` | Scores the lint | Update | `score-goal-lint.test.cjs` |
| `lint-goal-criteria.cjs` and `check-goal.cjs` | Share the rule patterns | Unchanged | Their suites pass unchanged |

Required inventories: `rg -n 'verifyGoalHeuristic' .skilled` lists goal-core, its tests, the Pi adapter, the fixture builder and the 003 scorer. `rg -n 'Evidence appears truncated' .skilled .opencode` lists goal-core, the OpenCode plugin and three reason maps that only read the string.
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
| Unit | `findingSources()`, `isMovable()`, `verifyGoalHeuristic()`, the 006 gate and verdict | vitest, `node --test` |
| Integration | 027's census on the real tree, the 003 scorer on the real labeled set, 006's arm against a stub `jev` | Terminal |
| Manual | A live 006 run, only on the operator's yes | Terminal, `--out` outside the repository |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Luna 6 max on cli-codex | External | Green | SWE 2 max takes the brief |
| SWE 2 max on cli-devin | External | Green | Luna takes the brief |
| DeepSeek V4.1 Flash on cli-pi | External | Green | The review waits |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a fix breaks a suite that passed at its baseline, or the review finds a P0 the session cannot fix.
- **Procedure**: `git revert` that fix's commit. Each fix is its own commit.
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
| Setup | Low | Baselines and briefs |
| Core Implementation | Med | Three worker runs, the 006 arm the largest |
| Verification | Med | Suite reruns, census reruns and one review |
| **Total** | | **One session** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Backup created (if data changes). Evidence: no data changes, and every fix is its own commit.
- [x] Feature flag configured. Evidence: 006's arms run only behind `--jev` or `--deem`.
- [x] Monitoring alerts set. Evidence: not applicable to offline scripts.

### Rollback Procedure
1. `git revert <commit>` for the fix at fault.
2. Rerun that fix's suite from the reverted state.
3. Rerun the 003 scorer or 027's census when either changed.
4. Record the revert in `goal.md`'s log.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---
