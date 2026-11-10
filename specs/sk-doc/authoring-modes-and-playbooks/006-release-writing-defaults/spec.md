---
title: "Feature Specification: Release writing defaults: changelog detail, short sentences and release sync without being asked"
description: "Release notes for v4.0.2.1 needed four operator requests for detail, short sentences and a release that matched its entry. Those become the default in sk-create-changelog."
trigger_phrases:
  - "release writing defaults"
  - "release writing defaults changelog detail short sentences"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Release writing defaults: changelog detail, short sentences and release sync without being asked

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-10 |
| **Branch** | `worktrees/339-release-writing-defaults` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The v4.0.2.1 release notes needed four operator requests. The first draft left out how the feature works, the fixes and the testing. The rewrite had long sentences. The published release then had to be deleted and republished twice, because it still showed the older text. Nothing in `sk-create-changelog` asked for any of this, and its rules banned test results outright.

### Purpose
A changelog written through `sk-create-changelog` carries feature detail, every fix, testing evidence and short plain sentences by default, and a published release follows its entry without a request.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior

### Measured Behavior

```text
$ python3 <shape check at HEAD> .skilled/changelog/skilled/v4.0.1.0.md
PASS .skilled/changelog/skilled/v4.0.1.0.md
SUMMARY files=1 pass=1 fail=0
```

The check at HEAD has no sentence rule and no rule for testing evidence. The entry above averages 13.7 words a sentence and holds 20 sentences past 22 words. The accepted v4.0.2.1 entry averages 7.8 words with a longest sentence of 18. The two rejected v4.0.2.1 drafts average 11.7 and 11.1 words, with longest sentences of 27 and 30.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add three rules to `check_changelog_shape.py`: a required `## How It Was Checked` section in an expanded entry, a 22-word sentence ceiling and a 10-word average ceiling.
- Let `validate_document.py` accept test results inside `## How It Was Checked` and nowhere else.
- Rewrite the template and `SKILL.md` so feature detail, a named fix list, testing evidence and short plain sentences are required, with v4.0.2.1 as a third model entry.
- Replace the amend path with a step that keeps a published release in step with its entry and always reports the release URL.
- Align both `/create:changelog` workflows, the packet READMEs and playbook scenario CHG-015.

### Out of Scope
- Rewriting entries published before v4.0.2.1 - they are history, and nothing reruns the shape check on them.
- Moving a published tag without a yes - `AGENTS.md` makes that wait mandatory and says no rule file relaxes it.
- Repairing `test_readme_verdict_parity.py` - it fails the same way before this change, on README paths an earlier regrouping moved.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/sk-doc/sk-create-changelog/scripts/check_changelog_shape.py` | Modify | Three new rules |
| `.skilled/skills/sk-doc/shared/scripts/validate_document.py` | Modify | Test results allowed in one section |
| `.skilled/skills/sk-doc/scripts/tests/test_check_changelog_shape.py`, `test_changelog_validator.py` | Modify | Cover the new rules |
| `.skilled/skills/sk-doc/sk-create-changelog/SKILL.md`, `assets/changelog-template.md` | Modify | The new defaults and the in-step release procedure |
| `.skilled/skills/sk-doc/sk-create-changelog/README.md`, `scripts/README.md`, `references/README.md`, `manual-testing-playbook/` | Modify | Rule lists, model entries and CHG-015 |
| `.skilled/commands/create/assets/create-changelog-auto.yaml`, `create-changelog-confirm.yaml` | Modify | Draft rules and release step 7 |
| `.skilled/skills/sk-doc/sk-create-changelog/changelog/v1.5.0.0.md`, `.skilled/skills/sk-doc/changelog/v2.9.8.0.md` | Create | Component entries, with the hub version carriers raised to 2.9.8.0 |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

REQ ids run in one sequence across the P0 and P1 tables.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The shape check fails an expanded entry with no `## How It Was Checked` section | `test_check_changelog_shape.py` has a failing fixture that prints `[checked-section]` |
| REQ-002 | The shape check fails a sentence past 22 words and an average above 10 | The same test file covers each ceiling at the limit and one past it |
| REQ-003 | The accepted v4.0.2.1 entry passes every gate | `check_changelog_shape.py .skilled/changelog/skilled/v4.0.2.1.md` prints `PASS`, and `validate_document.py` prints `Total issues: 0` |
| REQ-004 | Moving a published tag still waits for the operator | `SKILL.md` section 8 says the republish needs the operator's yes each time |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | An edit to a published entry updates the release body without a request | `SKILL.md` section 8 and step 7 of both workflows run `gh release edit` and report the URL |
| REQ-006 | The hub stays canon-clean | `parent-skill-check.cjs .skilled/skills/sk-doc` ends `all hard invariants passed, 0 warnings` |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `python3 -m pytest -q test_check_changelog_shape.py test_changelog_validator.py test_build_release_notes.py` prints `42 passed`.
- **SC-002**: Both new component entries pass the shape check, the HVR scan with 0 hard blockers and `validate_document.py` with 0 issues.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `gh` for the release body edit | The release stays stale when `gh` is missing | Step 7 reports it and the entry is still written |
| Risk | The sentence ceilings block a legitimate entry | Med | The ceilings sit above the accepted entry (7.8 mean, 18 max) and below both rejected drafts. A code span counts as one word, and tables and blockquotes are skipped |
| Risk | An agent reads the in-step rule as leave to move a tag | High | The text separates the body edit from the republish and requires a yes for the second each time |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---


