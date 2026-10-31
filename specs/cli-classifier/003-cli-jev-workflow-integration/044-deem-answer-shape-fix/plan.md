---
title: "Implementation Plan: Phase 44: deem-answer-shape-fix"
description: "Make each reader follow the real tools: cli-deem passes noul and score through in the server's shape, and 027's and 026's scorers read answers.answer. Workers write the code, the session reruns every suite, checks the client against the local server and commits each fix on its own."
trigger_phrases:
  - "deem answer shape plan"
  - "cli-deem translate fix plan"
  - "judgment envelope depth plan"
  - "deem score shape plan"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 44: deem-answer-shape-fix

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js ESM and CommonJS scripts |
| **Framework** | None |
| **Storage** | None |
| **Testing** | `node --test` for cli-deem, vitest for 027 and 026 |

### Overview
Two workers run in parallel on disjoint files: Luna 6 max on cli-codex fixes `cli-deem`'s `translateAnswer` and its fake answers, and SWE 2 max on cli-devin fixes the two scorers' parse depth and their stubs. The session reruns each suite, checks the client against the local Deem server, then has the cli-deem docs updated and corrects 043's record. One DeepSeek V4.1 Flash review covers the changes.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented. Evidence: `spec.md` sections 2 and 3, from two local server calls and a sweep of every scorer's parser.
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
Other: a local CLI client and offline scorers, each changed in place.

### Key Components
- **`cli-deem.mjs`**: posts one question to the local server and prints the envelope.
- **`score-stop-rater.cjs`**: 027's census and its Jev and Deem `score` arms.
- **`score-completion-claims.mjs`**: 026's audit and its Deem `noul` arm.

### Data Flow
A scorer spawns `cli-deem` or `jev`, which prints `{model, answers: {answer: {...}}}`. The scorer reads the number at `answers.answer`, and an answer it cannot read counts as unmeasured.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `translateAnswer()` in `cli-deem.mjs` | Reads `value` and `level` | Update | `cli-deem.test.mjs`, then three local server calls |
| 027 `score` arms | Read `parsed.score` | Update | `score-stop-rater.vitest.ts` |
| 026 `parseNoul()` | Reads `parsed.noul` | Update | `completion-claim-audit.vitest.ts` |
| Other Jev and Deem scorers | Read `answers.answer` | Unchanged | The parser sweep |
| cli-deem docs | Describe the old shapes | Update | `validate_document.py` |

Required inventories: `git grep -nP "(parsed|result|json|body|answer)\??\.(score|noul|choice)(?![A-Za-z])"` over `.skilled` and `.opencode` lists every reader. Only 027 and 026 read at the top level.
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
| Unit | `translateAnswer()`, the two parsers | `node --test`, vitest |
| Integration | `cli-deem noul`, `choice` and `score` against the local server | Terminal |
| Manual | A live scorer run, only on the operator's yes | Terminal, `--out` outside the repository |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Local Deem server | Internal | Green | The integration check waits |
| Luna 6 max and SWE 2 max | External | Green | Either takes the other's brief |
| DeepSeek V4.1 Flash on cli-pi | External | Green | The review waits |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a fix breaks a suite that passed at its baseline, or the client misreads a real answer.
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
| Core Implementation | Low | Two worker runs in parallel |
| Verification | Med | Suite reruns, local calls, docs and one review |
| **Total** | | **One session** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Backup created (if data changes). Evidence: no data changes, and every fix is its own commit.
- [x] Feature flag configured. Evidence: the scorers' model arms run only behind `--jev` or `--deem`.
- [x] Monitoring alerts set. Evidence: not applicable to offline scripts.

### Rollback Procedure
1. `git revert <commit>` for the fix at fault.
2. Rerun that fix's suite from the reverted state.
3. Record the revert in `goal.md`'s log.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---
