---
title: "Implementation Plan: Phase 10: verification-and-release"
description: "Run the end-to-end proof over the final tree: strict checks on every shipped skill against the phase 1 baseline, the scorer and replay baselines, the doctor suite, two full scratch conversions, the setup listing and command validation, then CI on main and the framework changelog."
trigger_phrases:
  - "verification and release plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 10: verification-and-release

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Python and Node.js validators, bash test runner, GitHub Actions |
| **Framework** | sk-doc, system-skill-advisor and doctor tooling |
| **Storage** | None |
| **Testing** | The checks in spec section 4 |

### Overview
This phase changes no code. It runs every check in spec section 4 on the final tree, records each one in `scratch/after.md`, and writes the framework release changelog. CI on main after the operator's merge is the last check.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified: phases 1 to 9 closed, and the phase 1 baseline file is readable

### Definition of Done
- [ ] All acceptance criteria met
- [ ] `scratch/after.md` shows `total gold=65 scored=57 tied=3 mean_f1=0.9176 exact=50`, scorer 155/195, 49/66, 19/24, and `run-all.sh` PASS
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Baseline, rerun, compare.

### Key Components
- **Phase 1 baseline**: the strict verdict per shipped root.
- **Temp-repo harness from phase 5**: the place the two scratch conversions run, so the real tree never holds them.

### Data Flow
Each check writes its command, output and exit code to `scratch/after.md`; the phase compares them with the phase 1 baseline and the numbers in spec section 2.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

N/A: verification phase, no fix. The surfaces it reads are listed in spec section 4.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.skilled/changelog/skilled/` | Framework release history | update (one new entry) | `validate_document.py --type changelog` |
| Every shipped skill root | Read by the strict check | unchanged | `package_skill.py --check --strict` per root |

Required inventories:
- Same-class producers: N/A.
- Consumers of changed symbols: N/A.
- Matrix axes: input kind (plain, pre-migration) by result (strict verdict, changelog link).
- Algorithm invariant: no baseline number moves.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. Setup loads the baselines, Implementation runs each check and the scratch conversions, and Verification reads CI on main and writes the changelog.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Doctor scripts | `bash .skilled/commands/doctor/scripts/tests/run-all.sh` |
| Integration | Shipped skills, routing baselines, full conversions, command validation | `package_skill.py --check --strict`, `capture-scorer-eval-baseline.mjs`, `leaf-route-replay.cjs`, `validate_document.py --type command`, `route-validate.sh` |
| Manual | `/doctor:setup` shows the two rows; CI on main | Agent runtime, `gh run list --branch main` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phases 1 to 9 | Internal | Yellow | Nothing to verify |
| `gh` CLI and repository access | External | Green | REQ-008 cannot be read |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a baseline number moves, a shipped skill loses its strict PASS, or CI on main fails.
- **Procedure**: Stop the release, record the delta in `scratch/after.md`, and reopen the phase whose change caused it; revert that phase's commit if the fix is not quick.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Phases 1 to 9 closed | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation and the operator's merge | Release |
<!-- /ANCHOR:phase-deps -->

---

