---
title: "Implementation Plan: Phase 4: alignment-fixes"
description: "Fix each finding the alignment critic upheld at its producer, commit per skill, then recheck the run. The proof is the program's own gate set plus the alignment recheck and probe replay."
trigger_phrases:
  - "alignment fixes plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 4: alignment-fixes

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Python 3, Node.js (CommonJS), Markdown |
| **Framework** | None |
| **Storage** | None |
| **Testing** | pytest, `node --test` |

### Overview
Each upheld finding is fixed where it is produced: the doctor transform and fixtures, the guard and validator, the routers and the docs that carry stale text. Each skill is committed on its own with a changelog and a hub bump. The alignment recheck and the probe replay prove the run's findings are closed.
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
- [x] `bash .skilled/commands/doctor/scripts/tests/run-all.sh` prints `7 suite(s) passed, 0 failed`, and pytest over `sk-doc/scripts/tests/` prints `407 passed`
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Fix at producer.

### Key Components
- **`doc-rewrite-guard.py`**: resolves a cited path from the citing doc's folder or the repository root, and matches a bare name only to a sibling or the one same-named doc in the skill.
- **`sk-skill-convert-transforms.cjs`**: builds a converted reference's description from its section names.

### Data Flow
A citation line is tokenized, each `.md` token resolves to at most one owner path, and the guard compares that owner's sections at base and at HEAD.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `doc-rewrite-guard.py` | Producer of citation findings | update | 28 guard tests pass, and the four new ones fail on the old guard |
| `validate_document.py` `_SECTION_REFERENCE` | Producer of section-reference findings | update | `test_citation_through_a_link_or_code_span_is_resolved` passes, README verdict parity is empty |
| `package_skill.py --strict` | Consumer of render findings | unchanged | strict sweep 55 PASS |
| Hermes router mirrors | Consumer of `ROUTER.md` | update | `sync-skills-hermes.cjs --check` prints 66 in sync |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES
Follow the ordered tasks in `tasks.md`. Setup reads the run report, Implementation fixes each finding, Verification reruns the gates and the recheck.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Guard, validator, convert transform | pytest, `node --test` |
| Integration | Package validation of 13 skills, strict sweep, doctor run-all, router reach | `validate_skill_package.py`, `sweep.sh`, `ci-router-vocabulary-reach.cjs` |
| Manual | The alignment recheck and probe replay | `recheck.cjs`, `run-probes.cjs` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Skill advisor index | Internal | Green | Routing probes cannot pass until it is rebuilt |
| Alignment run `20261105T151115Z` | Internal | Green | No recheck baseline |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a gate that passed at `0e88ba257b` fails after these commits.
- **Procedure**: `git revert` the failing skill's commit; each skill is committed on its own, so the revert touches only that skill.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Run `20261105T151115Z` | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation | Closing the phase |
<!-- /ANCHOR:phase-deps -->

---
