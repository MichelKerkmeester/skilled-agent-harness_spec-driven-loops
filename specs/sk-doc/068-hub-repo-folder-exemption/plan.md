---
title: "Implementation Plan: Hub repo folder exemption"
description: "Adds a repo-root-hub extension to mode-registry.json. The parent-hub checker and the package validator read its repoPaths list and skip those top-level entries, and 3f refuses a list that would hide the skill."
trigger_phrases:
  - "hub repo folder exemption plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Hub repo folder exemption

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js CommonJS checker, Python 3.9 validator |
| **Framework** | None |
| **Storage** | None, the extension lives in each hub's `mode-registry.json` |
| **Testing** | `node --test` for the checker, pytest for the validator |

### Overview
A hub that is also a repository root declares `repo-root-hub` with a `repoPaths` list in its registry. Both checkers read the list once, skip the named top-level entries in every walk and read the hub id from the folder name in kebab case. A hub without the declaration takes the same code path as before.
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
- [x] Tests passing
- [x] Docs updated (spec, plan, tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
A named registry extension, the same shape the doctrine's other extensions use.

### Key Components
- **`readRepoRootHub(target)` in `parent-skill-check.cjs`**: reads the list into the check context, so the identity walk, the 1b name check and the 6a child-directory check all see one set
- **`repoRootHubIssues` under 3f**: refuses an empty list, a nested or dotted name, a packet name or a hub-owned file
- **`_repo_root_hub`, `repo_root_paths` and `skill_folder_id` in `package_skill.py`**: the same reading for the name check, the naming walk, the version walk, the catalog-root scan and the zip
- **`validate_skill_package.py`**: imports `skill_folder_id` so the compiled-routing check gets the kebab-case hub id

### Data Flow
`mode-registry.json` → the extension's `repoPaths` → a set of top-level names → every walk prunes those names at the hub root only. A name deeper in the tree is never skipped.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `parent-skill-check.cjs` | Walks the hub for identities and child folders | Update | 109 invariant tests pass |
| `package_skill.py` | Name check, version and naming walks, zip | Update | 26 regression tests pass |
| `validate_skill_package.py` | Compiled-routing readiness for hubs | Update | `--strict` exit 0 on Product Owner |
| `parent-skills-nested-packets.md` | Doctrine extension table | Update | Row present, version 1.2.4.0 |
| Hubs without the extension | Consumers of both checkers | Unchanged | Existing suites pass unchanged |

Required inventories:
- Same-class producers: every walk in both scripts that reads the hub root was found with `rg -n "rglob|os.walk|readdirSync|collectFilesNamed"` in the two files and each one prunes the declared set
- Matrix axes: declared or not, entry exists or not, entry valid or invalid (empty, nested, dotted, packet, hub file)
- Algorithm invariant: a declared name hides only a top-level entry that is neither a packet nor a hub-owned file
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
| Unit | Five repo-root cases in the checker, three in the validator | `node --test`, pytest |
| Integration | Product Owner's real repository root through both checkers | `parent-skill-check.cjs`, `validate_skill_package.py --strict` |
| Regression | The full sk-doc pytest suite and every checker suite | pytest, `node --test` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Peer sessions on the shared tree | Internal | Yellow | A suite can fail on churn, so a clean clone settles a failing test |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a hub that does not declare the extension changes verdict
- **Procedure**: restore the four scripts and two tests from git, and drop the doctrine row
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
| Setup | Low | 30 minutes |
| Core Implementation | Med | 2 hours |
| Verification | Med | 1 hour |
| **Total** | | **3.5 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Backups of the three scripts kept outside the tree before the edit
- [x] No feature flag needed, since the extension is opt-in per hub
- [x] No monitoring applies to a local checker

### Rollback Procedure
1. `git checkout --` the four scripts, the two tests and the doctrine file
2. Rerun the checker suites to confirm the old behavior
3. A hub that declared the extension then fails again and must remove it or move its hub

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->
