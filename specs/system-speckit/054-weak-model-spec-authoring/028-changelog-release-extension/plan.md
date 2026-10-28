---
title: "Implementation Plan: Phase 28: changelog-release-extension"
description: "Add an open-release check to the /create:changelog contract so a skilled run extends an untagged latest entry, carried by the skill, both workflow YAMLs and the playbook, and drop the runnable /doc:quality wording from sk-create-quality-control."
trigger_phrases:
  - "changelog release extension plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 28: changelog-release-extension

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown workflow contracts and command YAML |
| **Framework** | sk-doc `/create:changelog` command and sk-create-changelog skill |
| **Storage** | None |
| **Testing** | pytest (command asset tests), sk-doc script tests, `validate-playbook-package.cjs`, `validate_document.py` |

### Overview
Step 3 of the changelog workflow gains a tag check for the `skilled` line: with no tag on origin for the latest version, the run keeps that version and later steps fold the work into the existing entry. The skill, both YAMLs, the presentation, README, references and playbook all state the same rule. The quality-control fix is four prose lines in SKILL.md and one table row in the workflows reference.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] `git ls-remote --exit-code --tags origin refs/tags/v4.0.0.16` exits 2 and the same for v4.0.0.15 exits 0
- [x] Every place that forbids reusing a version is listed by `rg -n 'no file exists|strictly greater|never overwrite|already exists'` over the skill and command assets
- [x] The `/doc:quality` lines to change are listed by `grep -n`

### Definition of Done
- [x] All acceptance criteria met
- [x] `python3 -m pytest -q .skilled/commands/create/assets/tests` prints `13 passed`, and the sk-doc script tests print `all sk-doc script tests passed`
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Contract branch in a workflow step.

### Key Components
- **`sk-create-changelog/SKILL.md` section 7**: the authoritative workflow, which states the rule.
- **`create-changelog-{auto,confirm}.yaml` steps 3 to 6**: the executable steps, which set and act on `entry_mode`.

### Data Flow
Step 3 reads the latest version, checks origin for its tag and sets `entry_mode`. Step 4 reads the open entry as its base when extending. Step 5 checks the version against the mode, and step 6 edits in place or writes a new file. Step 7 tags `v{next_version}`, which is the open release's version when extending.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `create-changelog-auto.yaml` and `-confirm.yaml` | Number and write the entry | update | YAML parse, command asset tests |
| `sk-create-changelog/SKILL.md`, README, `references/version-bump-rules.md` | State the versioning contract | update | `validate_document.py` 0 issues |
| Playbook CHG-008 and new CHG-013 | Operator scenarios for the release line | update | `validate-playbook-package.cjs` PASS |
| `create-changelog-presentation.txt` | Result report | update | Report names the entry mode |
| `.skilled/commands/create/changelog.md` | Command router | not a consumer | It names no versioning rule |
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. Setup measures the tag check and lists the lines to change, Implementation edits the contract and the quality-control prose, and Verification runs the validators, the suites and a fresh review.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Command asset contract tests | `python3 -m pytest -q .skilled/commands/create/assets/tests` |
| Integration | sk-doc scripts, playbook package, document validation | `run-script-tests.sh`, `validate-playbook-package.cjs`, `validate_document.py` |
| Manual | The tag check against the live origin | `git ls-remote --exit-code --tags origin refs/tags/v<version>` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `git ls-remote` against origin | External | Green | The run numbers a new entry and says the check failed |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a `skilled` run edits a tagged release or deletes another session's content.
- **Procedure**: revert the phase commit with `git revert`, which restores the always-number-a-new-entry behavior.
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
| Setup | Phase 027 landed on main | Implementation |
| Implementation | The listed lines and the measured exit codes | Verification |
| Verification | Every edit made | Phase close |
<!-- /ANCHOR:phase-deps -->

---
