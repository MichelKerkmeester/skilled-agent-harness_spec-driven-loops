---
title: "Implementation Plan: Router version parity"
description: "Remove ROUTER.md from the 13a follower list with one test, drop it from the changelog workflow's version-copy list, and correct the versioning standard's enforcement paragraph."
trigger_phrases:
  - "router version parity plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Router version parity

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js CommonJS, YAML command assets, Markdown |
| **Framework** | None |
| **Storage** | None |
| **Testing** | `node --test` on `parent-skill-check-invariants.test.cjs`; the doctor `run-all.sh`; six hub doctor runs |

### Overview
One line leaves the 13a follower list, one test pins the new behavior, one line leaves each changelog twin, and one paragraph of the versioning standard is corrected. It mirrors the 13c retirement in `../../024-readme-freshness-fixes/` (commit 0e2b905e9f).
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
- [x] Tests passing (if applicable)
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Narrow a check to the artifacts its rule covers

### Key Components
- **`checkVersionParity`** in `parent-skill-check.cjs`: builds a `followers` list of `ROUTER.md` and three JSON files and soft-fails 13a on any mismatch with `SKILL.md`
- **The global branch of `/create:changelog`**: sets each version carrier in a hub root to the release version, then runs the doctor
- **`frontmatter-versioning.md` section 7**: what each gate enforces and what nothing enforces

### Data Flow
A release runs `/create:changelog`, which moves the version carriers and runs the doctor; 13a then compares the carriers with `SKILL.md`. With `ROUTER.md` out of both lists, its version moves only through the pre-commit gate's per-doc bump.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| 13a follower list | Release-version parity | Update | T1; criterion 1 |
| create-changelog twins | Move version copies | Update | Criterion 1 |
| `frontmatter-versioning.md` section 7 | Standard text | Update | Criterion 2; `validate_document.py` |
| `root-router-contract.cjs:509` | ROUTER.md version presence and format | Unchanged | The six hub doctors |

Required inventories:
- Same-class claims: `grep -rnE "ROUTER\.md[^|]{0,80}version|version[^|]{0,60}ROUTER\.md" .skilled/commands .skilled/skills/sk-doc .skilled/skills/system-skill-advisor` lists every place that ties `ROUTER.md` to the release version; at planning it found only the two YAML lines and `frontmatter-versioning.md:122`.
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
| Unit | T1 and the existing 13a cases | `node --test` |
| Integration | The doctor suites and six hubs | `run-all.sh`, `parent-skill-check.cjs` |
| Doc | `frontmatter-versioning.md` | `validate_document.py` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 002 finished branch | Internal | Upstream | This phase cannot branch until 002's criteria pass |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A hub doctor fails after the change.
- **Procedure**: Revert this phase's commits.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core |
| Core | Setup | Verify |
| Verify | Core | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | Worktree from 002, inventory |
| Core Implementation | Low | Four small edits and one test |
| Verification | Low | Suites, six hubs, a five-iteration review |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] The six hub doctor results recorded before the change

### Rollback Procedure
1. Revert the phase commits.
2. Rerun the six hub doctors.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A; every change is a tracked file
<!-- /ANCHOR:enhanced-rollback -->
