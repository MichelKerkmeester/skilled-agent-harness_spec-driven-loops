---
title: "Feature Specification: Phase 3: quality-floor-and-style-split"
description: "The universal quality floor lets a surface only add rules and carries house rules, and the always-loaded style guide and three default JavaScript and CSS checklists are this repository's own style. This phase gives every floor rule an id and an override mark and moves the house style into sk-code-skilled."
trigger_phrases:
  - "quality floor and style split"
  - "phase 3 quality floor rule ids"
  - "skilled style split"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 3: quality-floor-and-style-split

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-27 |
| **Branch** | `worktrees/240-node20-test-fixes` |
| **Parent Spec** | ../spec.md |
| **Phase** | 3 of 12 |
| **Predecessor** | `001-shared-rule-contract` |
| **Successor** | `004-quality-resolver` (planned) |
| **Handoff Criteria** | Every floor rule carries an id and a mark that matches the contract's floor list, the house style sits in sk-code-skilled, SKILLED files reach the same checklists as before, every sk-code suite and drift guard passes and this folder validates with `RESULT: PASSED` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 3** of the Make sk-code quality, review and CI portable to any repository specification.

**Scope Boundary**: the universal floor `code-quality-standards.md`, the quality style guide, the quality defaults' checklist rows, the three JavaScript and CSS checklists, the sk-code-skilled references and checklists that receive moved content, the Iron Law 3 text in `phase-detection.md` and `stack-detection.md`, the quality mode's SKILL.md, README and playbook rows that pinned the moved content, the hub router and leaf manifest that route the moved files, the tests that pinned them and the changelogs. The hygiene checker and config (phase 002) and the `--explain` code path (phase 004) are not touched.

**Dependencies**:
- `001-shared-rule-contract`: the id grammar, the hard floor list and the linter.

**Deliverables**:
- Floor rule ids with FIXED or overridable marks, and a test that keeps the marks equal to `rule-overrides.json`.
- A universal style guide, with the SKILLED house style in sk-code-skilled's shared references and checklists.
- The JavaScript and CSS checklists under `sk-code-skilled/assets/checklists/js-css-style/`, declared as SKILLED rows.
- The checklist map in `sk-code-skilled/SKILL.md` with its relocated test.

**Changelog**:
- `.skilled/skills/sk-code/changelog/v3.9.9.0.md`, `sk-code-quality/changelog/v1.13.5.0.md` and `sk-code-skilled/changelog/v2.1.7.0.md`.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The universal floor says a surface checklist "adds rules to it without removing any" (`code-quality-standards.md:79`), so no repository can drop or replace a floor rule, and the rules carry no id an override could name. The floor also carries this repository's house rules: docstrings on public APIs, strict TypeScript without `any`, Python hints, camelCase and snake_case naming and this repository's hook wiring presented as universal. The always-loaded style guide describes itself as SKILLED's and carries file-size, line-length, test-layout, formatter and header rules that break other languages' conventions. Three default checklist rows hand Webflow-style JavaScript and CSS checks to every `.js` and `.css` file in any repository, while `SKILL.md:91` calls them surface-neutral.

### Purpose

The universal floor and style guide hold only rules that hold in any codebase, each floor rule names itself with an id and says whether it may be overridden, and this repository's house style lives in sk-code-skilled, where it is visibly one surface's choice.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior

Before this phase a JavaScript file in a repository with no surface, and the floor tables, read as follows.

```text
$ grep -n "adds rules" .skilled/skills/sk-code/shared/references/universal/code-quality-standards.md
79:The universal floor is sections 3 to 5 of this file. Every surface gets it, UNKNOWN included, and a surface checklist adds rules to it without removing any.

$ node --test --test-name-pattern="every universal floor rule" .../check-rule-overrides.test.cjs   (against the old floor)
AssertionError [ERR_ASSERTION]: the universal floor tables carry no Id column

$ F21 against the old quality defaults: a foreign specs/demo/notes.js was handed
  hub:sk-code/sk-code-quality/assets/code-quality-checklist/overview-header-and-comments.md
  hub:sk-code/sk-code-quality/assets/code-quality-checklist/naming-init-formatting-and-css.md
  hub:sk-code/sk-code-quality/assets/code-quality-checklist/verification-quick-reference-and-related.md
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Give every floor rule an id in the `floor.<name>` grammar, or the runner's `syntax.*`, `conflict.*` and `secret.*` classes, each marked FIXED or overridable, and replace the add-only sentence with the contract's precedence.
- Move the house rows out of the floor into sk-code-skilled's `universal-checklist.md`, and the repository wiring text into the quality SKILL.md as "this repository's wiring".
- Keep the ticket-id rule as the overridable `floor.ephemeral-pointers`, mapped to the runner's `hygiene.*` ids.
- Cut the style guide to universal rules, add the history-comment rule, make the ceiling marker opt-in and move the house style into sk-code-skilled's shared references.
- Retire the three JavaScript and CSS default rows, move their files under sk-code-skilled and declare them as SKILLED rows, so SKILLED files keep them.
- Update Iron Law 3 in `phase-detection.md` and `stack-detection.md`, the floor's UNKNOWN row and `SKILL.md:91`.
- Move the target map to sk-code-skilled, point quality at `--explain <path>` and relocate its test.
- Fix every link, playbook row and test that pinned moved content, regenerate the leaf manifest and the Hermes copies and write the changelogs.
- Count a file reached through the hub's `.skilled/plugins` link as hub code in the runner's `fileFacts`. This item is pulled forward from the later integration child, `009-integration-fixes`, because retiring the default rows would otherwise drop the plugin files to the floor alone.

### Out of Scope

- The hygiene checker, `commentHygiene.disableRules` and its config wiring. Phase 002 owns them.
- The `--explain` code path. Phase 004 owns it.
- The private web surface's own checklist rows. They live outside this repository, and the exact rows it needs are recorded in `implementation-summary.md` for the operator.
- The trigger index rebuild, which the conductor runs after landing.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/sk-code/shared/references/universal/code-quality-standards.md` | Modify | Floor ids, marks, precedence, house rows and wiring moved out |
| `.skilled/skills/sk-code/shared/references/phase-detection.md`, `stack-detection.md` | Modify | Iron Law 3 sources |
| `.skilled/skills/sk-code/shared/scripts/tests/check-rule-overrides.test.cjs` | Modify | Floor id and mark test |
| `.skilled/skills/sk-code/sk-code-quality/references/code-style-guide.md` | Modify | Universal rules only |
| `.skilled/skills/sk-code/sk-code-quality/assets/quality-defaults.json` | Modify | Three default rows retired |
| `.skilled/skills/sk-code/sk-code-quality/SKILL.md`, `README.md`, playbook files | Modify | Pointers, wiring label, explain pointer |
| `.skilled/skills/sk-code/sk-code-quality/scripts/quality-gate.cjs` | Modify | `fileFacts` only: a real path inside the hub's plugins link target counts as inside the hub |
| `.skilled/skills/sk-code/sk-code-quality/scripts/tests/quality-gate.test.cjs` | Modify | F21, F21a, F21b and the style constant, the target map case lifted out |
| `.skilled/skills/sk-code/sk-code-skilled/assets/checklists/js-css-style/*.md` | Move | The three JavaScript and CSS checklists |
| `.skilled/skills/sk-code/sk-code-skilled/assets/checklists/universal-checklist.md` | Modify | Docs, typing and helper-doc rows |
| `.skilled/skills/sk-code/sk-code-skilled/references/shared/**` | Modify | Naming, comment marker, file order, size, formatter and test layout |
| `.skilled/skills/sk-code/sk-code-skilled/SKILL.md`, `scripts/tests/quality-checklist-map.test.cjs` | Modify, Create | Checklist map and its test |
| `.skilled/skills/sk-code/mode-registry.json`, `ROUTER.md`, `leaf-manifest.json` | Modify | SKILLED rows, routes, regenerated manifest |
| `.skilled/skills/sk-code/manual-testing-playbook/**` | Modify | The ceiling scenario points at the SKILLED marker |
| Changelogs and version carriers, `.hermes/skills/sk-code*/SKILL.md` | Create, Modify | Three entries, carriers, regenerated copies |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Every floor rule in sections 3 to 5 carries an id and a FIXED or overridable mark, the FIXED ids equal the contract's non-review floor ids and a test fails when they differ |
| REQ-002 | The add-only sentence is replaced by the contract's precedence, and the floor holds no docstring, strict-typing or naming-scheme house rule and no repository wiring |
| REQ-003 | SKILLED files reach the same checklists before and after, shown by `quality-gate.cjs --explain` on a sample |
| REQ-004 | A `.js` file in a foreign repository gets only the universal floor, and the quality defaults hold no extension row |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-005 | The style guide keeps only universal rules, carries CHK-CMT-07 and lets a surface define a ceiling marker, and sk-code-skilled defines `ceiling:` |
| REQ-006 | Iron Law 3, the floor's UNKNOWN row and `SKILL.md:91` match the parent's ADR-002 |
| REQ-007 | The target map lives in sk-code-skilled with its test, and quality points at `--explain <path>` |
| REQ-008 | Every link to moved content resolves: the drift guards, verify-doc-claims and the playbook validator pass |
| REQ-009 | The three changelog entries validate with 0 issues, the carriers are stepped and the Hermes copies are in sync |
| REQ-010 | A file reached through the `.skilled/plugins` link resolves to SKILLED and keeps every JavaScript and CSS house row, and a SKILLED `.js` and `.css` file list them too |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The floor id test, F21 and the checklist map tests fail before the change and pass after it.
- **SC-002**: The quality suite, the sk-code-skilled suite, the shared suite, the shell suites and the four drift guards pass, and `validate.sh` on this folder prints `RESULT: PASSED`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A SKILLED file loses a checklist when the default rows retire | A check silently stops applying in this repository | The rows move to SKILLED declarations, and `--explain` on a sample shows the same checklist set before and after |
| Risk | Files reached through the `.skilled/plugins` link resolved to no surface, so they would lose the JavaScript and CSS rows | 43 tracked plugin files and links would get only the floor | `fileFacts` counts the link target as hub code, pulled forward from the integration child, and `--explain` on all 43 lists a superset of the old checklists |
| Dependency | Phase 002 adds `commentHygiene.disableRules` | The style guide and floor name the key before it exists | The text names the key only as the way the runner's check changes, which the contract already states |
| Risk | Links to the style guide's §3 and §4 break | Readers land on a missing section | Section numbers stay, and verify-doc-claims checks every link |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: N/A. The change moves documentation and declaration rows, and adds no runtime work.

### Security
- **NFR-S01**: The hard floor, secrets, conflict markers and parse faults, stays FIXED and is never overridable.

### Reliability
- **NFR-R01**: With no new key set, this repository's SKILLED files keep the same checklists, and the runner's exit codes and verdict fields are unchanged.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a repository with no surface and no config gets the universal floor alone for a `.js` file.
- Maximum input: a SKILLED `.js` file gets the floor, the SKILLED house checklist, the JavaScript checklist and the three JavaScript and CSS house checks.
- Failure path: a floor id marked FIXED that the contract does not fix, or a floor row with no id, fails the linter suite.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | About thirty files across the hub, two modes and one surface, most of them documentation |
| Risk | 9/25 | A wrong row drops a checklist silently. The explain comparison and the map test guard it |
| Research | 4/20 | The investigation summary settled the design |
| **Total** | **27/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->
