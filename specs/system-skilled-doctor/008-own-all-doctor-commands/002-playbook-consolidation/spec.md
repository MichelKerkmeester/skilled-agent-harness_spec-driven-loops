---
title: "Feature Specification: Phase 2: playbook-consolidation"
description: "The doctor command scenarios lived in a playbook at .skilled/manual-testing-playbook/ that no skill owned. This phase moves them into the system-skilled-doctor playbook."
trigger_phrases:
  - "playbook consolidation"
  - "phase 2 playbook consolidation"
  - "doctor playbook into system-skilled-doctor"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.4 -->
# Feature Specification: Phase 2: playbook-consolidation

<!-- SPECKIT_LEVEL: 3 -->

---

## EXECUTIVE SUMMARY

The 66 doctor command scenarios sat in `.skilled/manual-testing-playbook/`, a package outside every skill, while the skill that owns the commands kept a second playbook. The scenarios now live in `system-skilled-doctor/manual-testing-playbook/doctor-commands/`, and the two root documents are one. The playbook validator reports one package with 79 scenarios and no violations, and no live link resolves into the old folder.

**Key Decisions**: one package with one root document, not two packages side by side; moved links rewritten by resolving each target, not by pattern replacement.

**Critical Dependencies**: Phase 1, so the playbook's owner and the commands' owner are the same skill.

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-24 |
| **Branch** | `worktrees/541-own-all-doctor-commands` |
| **Parent Spec** | ../spec.md |
| **Phase** | 2 of 2 |
| **Predecessor** | 001-ownership-transfer |
| **Successor** | None |
| **Handoff Criteria** | `.skilled/manual-testing-playbook/` is gone and every gate matches the baseline |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 2** of the system-skilled-doctor owns every doctor command and holds the only doctor playbook specification.

**Scope Boundary**: the doctor scenario files, the two root documents, and every live file that links to or pins the old folder.

**Dependencies**:
- Phase 1 complete.

**Deliverables**:
- One playbook package under `system-skilled-doctor`, with no folder left at `.skilled/manual-testing-playbook/`.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The doctor scenarios lived in a package no skill owned, and the owning skill had its own playbook beside it. A reader looking for a doctor scenario had to know about a folder outside `.skilled/skills/`, and the skill's benchmark corpus left out most of the commands it owns.

### Purpose
The doctor scenarios live only in the `system-skilled-doctor` playbook.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior

```text
$ node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs   (before the change)
PASS package=.skilled/manual-testing-playbook tier=FAIL_CLOSED scenarios=66 categories=1 operator=66 routing_gold_excluded=0 violations=0 warnings=13
PASS package=system-skilled-doctor tier=FAIL_CLOSED scenarios=13 categories=2 operator=13 routing_gold_excluded=0 violations=0 warnings=0
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Move `doctor-commands/` into the skill's playbook with `git mv`, keeping file history.
- Merge the central root document into the skill's `manual-testing-playbook.md` and delete the central one.
- Rewrite every live link and path that points at the old folder, and every link in a moved file that the deeper location broke.

### Out of Scope
- The validator's generic support for a playbook root outside `.skilled/skills/`, and its regression test - it is a capability any repository can use, and nothing here depends on removing it.
- Scenarios in other skills' playbooks that test a skill mode through its doctor command - they test that skill's mode.
- History under `specs/` and `changelog/`, and the trigger index generated from it.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/manual-testing-playbook/doctor-commands/` | Move | To `.skilled/skills/system-skilled-doctor/manual-testing-playbook/doctor-commands/` |
| `.skilled/manual-testing-playbook/manual-testing-playbook.md` | Delete | Merged into the skill's root |
| `.skilled/skills/system-skilled-doctor/manual-testing-playbook/{manual-testing-playbook.md,routing/moved-command-contract.md}` | Modify | Merged root and the seventeen-command count |
| `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/playbook-failclosed-allowlist.txt` | Modify | The moved package keeps fail-closed enforcement |
| `.skilled/skills/sk-doc/scripts/tests/code-folder/{durable-directory-manifest,baseline-readme-verdicts}.json` | Modify | New README path |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/{playbook-provenance-paths,workflow-invariance}.vitest.ts` | Modify | New scenario path |
| Seven other skills' playbooks and three feature catalogs | Modify | Links and wording that named the central playbook |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `.skilled/manual-testing-playbook/` does not exist, and the skill's `doctor-commands/` holds the 66 scenarios and their README |
| REQ-002 | The playbook validator reports `package=system-skilled-doctor` with every moved scenario counted and `violations=0` |
| REQ-003 | No live Markdown link resolves into the old folder, and no link in a moved file is broken by the move |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | The spec-kit vitest and the sk-doc README manifest tests pass with the new path |
| REQ-005 | The merged root indexes every scenario once and keeps the doctor test environments and command verdict rules |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The validator prints `PASS package=system-skilled-doctor ... scenarios=79 categories=3 ... violations=0`.
- **SC-002**: A link resolver over every tracked Markdown file finds zero links into the old folder and zero broken links in the moved files.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 1 ownership | The playbook would sit in a skill that does not own its commands | Phase 1 lands first |
| Risk | Relative links break at the new depth | High | Resolve every link against the old folder and rewrite it from the new one |
<!-- /ANCHOR:risks -->

---

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: N/A - documentation and test paths only.

### Security
- **NFR-S01**: N/A - no permission or credential surface changes.

### Reliability
- **NFR-R01**: The fail-closed allowlist keeps the moved scenarios under the same enforcement tier.

---

## 8. EDGE CASES

- Empty input: a link that already resolved after the move is left unchanged.
- Maximum input: 312 broken links in the moved files and 12 inbound links were rewritten in one pass.
- Failure path: a link whose old target no longer exists is reported, not guessed; none were found.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 18/25 | Files: about 85, LOC: about 600, Systems: playbooks, validators, catalogs |
| Risk | 8/25 | Auth: N, API: N, Breaking: N |
| Research | 6/20 | Where the old path is pinned |
| Multi-Agent | 3/15 | Workstreams: 1, plus one review dispatch |
| Coordination | 5/15 | Dependencies: Phase 1 |
| **Total** | **40/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | A scenario indexed twice after the merge | M | M | The `/doctor:overlay` row points at section 8 instead of repeating `SKD-003` |
| R-002 | The moved package drops out of fail-closed enforcement | H | L | The allowlist names the skill package in the old line's place |

---

## 11. USER STORIES

### US-001: One playbook for the doctor (Priority: P0)

**As a** maintainer, **I want** every doctor scenario in the skill that owns the commands, **so that** there is one place to look and one corpus to run.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

### US-002: Nothing points at the old folder (Priority: P1)

**As a** reader following a link from another skill's playbook, **I want** it to land on the scenario, **so that** the move costs me nothing.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `tasks.md`
