---
title: "Implementation Plan: Phase 4: vocabulary-single-source"
description: "Remove the one copy that is prose. Extend the existing router-sync guard to compare the rest as sets. Prove it by mutating one keyword and reading the exit status."
trigger_phrases:
  - "vocabulary single source plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 4: vocabulary-single-source

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|---|---|
| **Language/Stack** | Node 24 CommonJS, JSON, Markdown |
| **Framework** | `node:test` |
| **Storage** | None |
| **Testing** | `node --test` and a mutation run |

### Overview
Remove the one copy that is prose. Extend the existing router-sync guard to compare the rest as sets. Prove it by mutating one keyword and reading the exit status.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] `spec.md` section 2 states the problem and section 3 lists the files to change
- [ ] Every requirement in `spec.md` section 4 names a command and its expected output
- [ ] The predecessor phase's handoff criteria are met, or this is phase 1

### Definition of Done
- [ ] Every row in `acceptance-criteria.md` is `Met`, `Waived` or `Superseded`
- [ ] `node --test .skilled/skills/sk-code/sk-code-skilled/scripts/tests/verify-router-sync.test.cjs` passes
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/hub-architecture/006-sk-code-audit-remediation/004-vocabulary-single-source --strict --quiet` prints `RESULT: PASSED`
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Guarded duplicate sources

### Key Components
- **`verify-router-sync.cjs`**: Gains one leg that compares vocabulary copies
- **`sk-code-frontend/ROUTER.md` section 2**: Stops restating the keywords

### Data Flow
The guard reads the vocabulary classes, the hub intent rows and the packet intent rows. It compares them as sets per surface. Any difference prints the keyword and the two files and fails the run.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---|---|---|---|
| `verify-router-sync.cjs` | Owns router consistency checks | update | `node --test` on its test file |
| `run-all-drift-guards.sh` | Runs the guard | unchanged | Router-sync leg prints PASS |
| `sk-code-setup-check.cjs` drift-guards leg | Reports the guard result | not a consumer of the new leg's detail | Battery output |
| `sk-code-ci` vocabulary copies | Copied the same way | unchanged | The new leg passes for CI |

Required inventories:
- Same-class producers: every ledger row this phase owns is one producer, listed by id in `tasks.md`.
- Consumers of changed files: the rows above name each one and what proves it is unaffected.
- Matrix axes: the ledger verdict (`Confirmed`, `Changed`, `Refuted`, `Judgment`) is the one input axis, and each task states which verdicts it acts on.
- Algorithm invariant: N/A, this phase changes no parser, resolver or security path.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup reads the guard and lists the pairs it already compares. Implementation removes the prose copy, states the aliases rule and adds the leg with its test. Verification mutates one keyword and runs the guards.

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|---|---|---|
| Unit | The new guard leg, one passing tree and one mutated tree | `node --test` |
| Integration | All drift guards | `run-all-drift-guards.sh` |
| Manual | N/A: the mutation run is scripted | None |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|---|---|---|---|
| Phase 002 | Internal | Yellow | The leg would fail on today's drift |
| `node:test` | External | Green | No test run |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The guard fails on the unmodified tree.
- **Procedure**: Revert the phase commit with `git revert <sha>`. The prose list returns with it.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|---|---|---|
| Setup | The predecessor phase's handoff criteria | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation | Closing this phase and starting `005-hub-router-alignment` |
<!-- /ANCHOR:phase-deps -->

---

