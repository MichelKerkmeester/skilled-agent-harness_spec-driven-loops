---
title: "Implementation Plan: Release writing defaults: changelog detail, short sentences and release sync without being asked"
description: "Add three shape rules and one validator exception, rewrite the changelog template and skill around them and align both workflows. Prove it with the sk-doc tests and the gates on the v4.0.2.1 entry."
trigger_phrases:
  - "release writing defaults plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Release writing defaults: changelog detail, short sentences and release sync without being asked

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Python 3, Markdown, YAML workflows |
| **Framework** | None |
| **Storage** | None |
| **Testing** | pytest through `run-script-tests.sh` |

### Overview
The shape check gains three rules, and the document validator stops flagging test results inside one named section. The template, `SKILL.md` and both `/create:changelog` workflows then state the same defaults. The accepted v4.0.2.1 entry is the calibration target: it must pass, and both rejected drafts must fail.
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
- [x] `python3 -m pytest -q test_check_changelog_shape.py test_changelog_validator.py test_build_release_notes.py` prints `42 passed`
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Gate plus contract.

### Key Components
- **`check_changelog_shape.py`**: the gate both workflows run on a draft before writing it.
- **`validate_document.py`**: the omission rules, now with one section exempt from the test-count rule.
- **`changelog-template.md` and `SKILL.md`**: the contract an agent reads before it writes.
- **`create-changelog-auto.yaml` and `create-changelog-confirm.yaml`**: the workflows, including release step 7.

### Data Flow
An agent drafts an entry from the template. The workflow runs the shape check, the HVR scan and the validator on the draft. Step 7 publishes a new release, or edits the body of a release that already exists for the entry, and the report carries the URL.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

`bash .skilled/skills/sk-doc/scripts/tests/run-script-tests.sh` runs the whole sk-doc suite. `node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/sk-doc` checks the hub and its version carriers.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

`python3`, `pytest` and `node`. No new package.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Trigger: a correct entry fails the sentence rules. Revert the one commit. The gates return to their earlier state and no published entry changes.
<!-- /ANCHOR:rollback -->

---

