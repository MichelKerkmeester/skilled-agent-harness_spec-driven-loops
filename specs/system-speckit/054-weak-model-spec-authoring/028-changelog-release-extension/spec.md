---
title: "Feature Specification: Phase 28: changelog-release-extension"
description: "/create:changelog can only number a new entry, so work that lands before a Skilled release is tagged either opens a second untagged release or is added to the open one by hand. sk-create-quality-control also still describes the retired /doc:quality command as runnable."
trigger_phrases:
  - "changelog release extension"
  - "phase 28 changelog release extension"
  - "extend the open release"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 28: changelog-release-extension

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-10-28 |
| **Branch** | `worktrees/217-weak-model-spec-authoring` |
| **Parent Spec** | ../spec.md |
| **Phase** | 28 of 28 |
| **Predecessor** | 027-alignment-preexisting-gaps |
| **Successor** | None |
| **Handoff Criteria** | Every row of `acceptance-criteria.md` is Met with evidence, and the phase validates strict |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 28** of packet 054. It carries two follow-ups the operator approved on 2026-10-28 after the v4.0.0.16 notes were extended by hand.

**Scope Boundary**: the `/create:changelog` workflow contract (skill, command YAMLs, presentation, README, references, playbook) and the prose of `sk-create-quality-control`. No validator or script code changes.

**Dependencies**:
- Phase 025, which made changelogs global only.
- Phase 027, which removed `/doc:quality` from the quality-control README.

**Deliverables**:
- An "extend the open release" rule for the `skilled` release line, carried by the skill and both workflow YAMLs.
- A playbook scenario for the rule.
- Quality-control prose that no longer presents `/doc:quality` as runnable.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`/create:changelog` increments the version while a file exists, so a run for the `skilled` line after untagged notes were written opens a second untagged release, and adding the work to the open entry was a hand edit outside the workflow. Separately, `sk-create-quality-control/SKILL.md` lines 22, 145, 408 and 434 and `references/workflows.md` line 49 still describe `/doc:quality` as runnable, while line 12 of the same SKILL.md says the command does not exist.

### Purpose
A `skilled` run folds new work into an untagged latest release, and the quality-control docs describe only the audit that exists.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ git ls-remote --exit-code --tags origin refs/tags/v4.0.0.16 >/dev/null; echo "exit=$?"
exit=2
$ git ls-remote --exit-code --tags origin refs/tags/v4.0.0.15 >/dev/null; echo "exit=$?"
exit=0
$ grep -n "doc:quality" .skilled/skills/sk-doc/sk-create-quality-control/SKILL.md .skilled/skills/sk-doc/sk-create-quality-control/references/workflows.md | wc -l
8
$ ls .skilled/commands
assets  create  deep  design  doctor  goal-opencode.md  local-skilled-alignment.md  prompt  README.txt  scripts  speckit  vision.md
```
Before this phase, v4.0.0.16 had notes but no tag, step 3 of both YAMLs incremented past any existing file, and there is no `doc` command folder.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add the open-release check to `sk-create-changelog/SKILL.md` section 7 steps 3 to 6, section 9 checks 1 and 2 and the never-reuse rule.
- Carry the same rule through steps 3 to 6 and the rules list of `create-changelog-auto.yaml` and `create-changelog-confirm.yaml`, and name the entry mode in the result report.
- Align the README, `references/version-bump-rules.md` and the playbook, and add scenario CHG-013.
- Replace the runnable `/doc:quality` wording in the quality-control SKILL.md and workflows reference, keeping it as trigger vocabulary.
- Record both changes in skill changelog entries.

### Out of Scope
- Tagging or publishing v4.0.0.16 - a publish needs the operator's explicit go-ahead.
- Extending a skill component's entry - skill versions carry no release tags, so they keep numbering a new entry.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/sk-doc/sk-create-changelog/SKILL.md` | Modify | Open-release rule, validation exceptions, version 1.3.7.0 |
| `.skilled/commands/create/assets/create-changelog-auto.yaml` | Modify | Tag check, extend branch, version checks, write step |
| `.skilled/commands/create/assets/create-changelog-confirm.yaml` | Modify | Same rule, checkpoint wording |
| `.skilled/commands/create/assets/create-changelog-presentation.txt` | Modify | Entry mode in the result report |
| `.skilled/skills/sk-doc/sk-create-changelog/README.md` | Modify | How It Works and troubleshooting row |
| `.skilled/skills/sk-doc/sk-create-changelog/references/version-bump-rules.md` | Modify | The release-line exception |
| `.skilled/skills/sk-doc/sk-create-changelog/manual-testing-playbook/` | Modify, Create | Index, CHG-008 objective, new CHG-013 |
| `.skilled/skills/sk-doc/sk-create-changelog/changelog/v1.3.7.0.md` | Create | Release entry |
| `.skilled/skills/sk-doc/sk-create-quality-control/SKILL.md` | Modify | Four prose lines |
| `.skilled/skills/sk-doc/sk-create-quality-control/references/workflows.md` | Modify | Mode table row |
| `.skilled/skills/sk-doc/sk-create-quality-control/changelog/v1.0.4.0.md` | Create | Records the SKILL.md and reference fixes, version 1.0.4.0 |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | For `skilled`, when `git ls-remote --exit-code --tags origin refs/tags/v{latest}` exits 2, both YAMLs set `entry_mode = "extend"`, keep the latest version and skip the bump and collision check. Exit 0 keeps numbering a new entry. |
| REQ-002 | No line in the skill, either YAML, the README or the references still forbids the extension it allows, and both YAMLs carry the same rule. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | When the tag check exits with any code other than 0 or 2, the run numbers a new entry and says the check failed. A chosen bump that an open release leaves unapplied is named in the report, and an open entry that exists only upstream stops the run with a merge or rebase request. |
| REQ-004 | Playbook scenario CHG-013 covers the rule, and `validate-playbook-package.cjs` passes the package. |
| REQ-005 | `grep -n "doc:quality"` over the quality-control SKILL.md and `references/workflows.md` prints only SKILL.md lines 12, 30 and 65, the historical note and the routing vocabulary. |
| REQ-006 | Changelog entries record both changes as new versions, never by editing a pushed skill entry, and pass `validate_document.py` with 0 issues. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Both YAMLs parse, and their step 3 blocks for the open-release check are identical.
- **SC-002**: The command asset tests, the sk-doc script tests and the playbook package validator pass.
- **SC-003**: The REQ-005 grep prints exactly three lines.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | A reachable origin for the tag check | Without it the run cannot tell an open release from a shipped one | Number a new entry and say the check failed, since a stale local tag list could lead to editing shipped notes |
| Risk | A run extends the open entry by rewriting another session's text | Med | The extend branch keeps existing content and only adds or corrects untrue sentences, and CHG-013 fails a run that deletes sections |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: N/A. The change adds one `git ls-remote` call to a `skilled` run, and no service runs.

### Security
- **NFR-S01**: N/A. The tag check only reads refs from origin.

### Reliability
- **NFR-R01**: A tag check that cannot reach origin never blocks the run. It falls back to local tags.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a `skilled` folder with no entries skips the tag check, so the run numbers the first entry as before.
- Maximum input: the latest entry in a generation folder such as `v3+/` is found with `find -L`, and the run edits it where it sits.
- Failure path: `git ls-remote` exiting with a code other than 0 or 2 numbers a new entry and says the check failed. An open entry that exists only upstream stops the run.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | Eleven doc and YAML files, about 150 lines, one skill and one command |
| Risk | 6/25 | A workflow contract change, with no code and no breaking change for other components |
| Research | 4/20 | The tag-check exit codes and the YAML steps, both read and tested in this phase |
| **Total** | **18/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---
