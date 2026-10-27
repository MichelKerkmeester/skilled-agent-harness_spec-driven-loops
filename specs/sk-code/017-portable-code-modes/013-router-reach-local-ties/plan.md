---
title: "Implementation Plan: Router reach check scores the shipped fleet and notes operator-local ties"
description: "Drop private-surface recommendations before the reach check judges a declaring hub, report a private surface ranked ahead of the shipped leader as a non-failing note, and prove it against the main checkout's advisor."
trigger_phrases:
  - "router reach local ties plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Router reach check scores the shipped fleet and notes operator-local ties

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js CommonJS |
| **Framework** | None |
| **Storage** | None |
| **Testing** | Self-running `node:assert` script with a stand-in advisor, plus live runs against the main and worktree advisors |

### Overview
The reach check splits each probe's passing recommendations into the shipped fleet and private surfaces by the private-skill prefix, and judges the declaring hub on the shipped list only. A private surface that sat ahead of the shipped leader becomes an `operator-local` note carrying its confidence and never its name. The proof is the same check, run from the main checkout against the main advisor, turning from `RESULT: FAILED` into `RESULT: PASSED` at one advisor generation.
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
- [x] `node .skilled/skills/sk-doc/sk-create-skill/scripts/tests/ci-router-vocabulary-reach.test.cjs` exits 1 on the unchanged check and prints `router reach shipped-fleet ranking passed` with exit 0 on the changed one
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Filter before judging.

### Key Components
- **`isOperatorLocal`**: the private-skill prefix test, the same prefix every advisor reader uses for a followable top-level link.
- **`rankShippedFleet`**: hit, presence and the top two from the shipped list, plus every private surface ranked ahead of the shipped leader.
- **`NON_FAILING`**: the one set of row kinds that never fail the run: `no-reach`, `allowed` and `operator-local`.

### Data Flow
The probe still asks the live advisor. Its passing recommendations go through `rankShippedFleet`. `main` turns a shipped hit with private surfaces ahead of it into a note row, turns a shipped miss into the existing wrong-hub, outranked, no-reach or allowed row, and fails the run on any kind outside `NON_FAILING`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `ci-router-vocabulary-reach.cjs` | Produces the reach verdict | update | the new test, and live runs on the main and worktree advisors |
| `router-reach-allowlist.json` | Pins a shipped winner for a known dispute | unchanged, it now matches against the shipped winner | main-checkout run still reports `allowed=4` |
| `doctor-router-reach.yaml` | The doctor workflow that runs and reports the check | update, new row kind | YAML parses; the kind is listed with its handling |
| Router-reach playbook scenario | Manual check of the doctor target | update, new row kind | `validate_document.py` 0 issues |
| Advisor runtime and scorer | Answers the probes | not a consumer, unchanged | advisor vitest counts equal the baseline |
| `--json` consumers of the reach report | None found | not a consumer | `rg -n "probe-error=|outranked="` outside the script finds nothing |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. Setup reproduces the failure and attributes the tie, Implementation changes the check and its contract docs, and Verification reruns the check from the main checkout and the advisor suites.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | The check driven by a stand-in advisor: a private tie, the JSON report, a shipped winner behind a private surface, a trailing private surface | `node ci-router-vocabulary-reach.test.cjs` |
| Integration | The whole fleet against the main advisor (private links present) and the worktree advisor (none) | `ci-router-vocabulary-reach.cjs` with `ROUTER_REACH_ADVISOR` |
| Regression | Advisor vitest suite, advisor Python tests, doctor phrase probe, every sk-create-skill script test | `npx vitest run`, `python3 test_skill_advisor.py`, `doctor-phrase-reach.cjs` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| The main checkout's advisor daemon with its private links | Internal | Green | No proof against the machine where the failure appears |
| `ROUTER_REACH_ADVISOR` override in the check | Internal | Green | No stand-in advisor for the unit cases |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A shipped routing loss stops failing the check, or CI's reach verdict changes.
- **Procedure**: Revert the commit that carries the reach script, its test and the two contract docs. No advisor rebuild is needed.
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
| Verification | Implementation | Closure |
<!-- /ANCHOR:phase-deps -->

---
