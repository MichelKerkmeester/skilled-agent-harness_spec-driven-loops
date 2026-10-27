---
title: "Feature Specification: Phase 1: shared-rule-contract"
description: "A repository cannot drop or replace a sk-code rule today. This phase writes the one override contract quality and review will both read, a machine-readable hard floor and a linter that refuses any floor id."
trigger_phrases:
  - "shared rule contract"
  - "phase 1 shared rule contract"
  - "rule overrides linter"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 1: shared-rule-contract

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
| **Branch** | `worktrees/239-portable-rule-contract` |
| **Parent Spec** | ../spec.md |
| **Phase** | 1 of 12 |
| **Predecessor** | None |
| **Successor** | `002-quality-hygiene-policy` (planned) |
| **Handoff Criteria** | The contract reference, its floor JSON and the linter exist, the linter suite reports `fail 0`, and this folder and the parent validate with `RESULT: PASSED` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 1** of the Make sk-code quality, review and CI portable to any repository specification.

**Scope Boundary**: The shared contract, its floor list, the linter, the linter's tests and their CI step, the shared folder's README, the hub changelog and the hub's version carriers. No quality or review behavior changes in this phase.

**Dependencies**:
- None. The later quality and review phases depend on this one.

**Deliverables**:
- `.skilled/skills/sk-code/shared/references/universal/rule-overrides.md`, the contract.
- `.skilled/skills/sk-code/shared/references/universal/rule-overrides.json`, the hard floor.
- `.skilled/skills/sk-code/shared/scripts/check-rule-overrides.cjs` and its `node --test` suite.

**Changelog**:
- The hub entry `.skilled/skills/sk-code/changelog/v3.9.7.0.md` records this phase.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

A repository cannot drop or replace any sk-code rule. The quality config merge only appends, the universal floor says a surface adds rules without removing any (`code-quality-standards.md:79`), and review reads no repository rules at all. Two modes that each grew their own override format would let a rule switched off in quality come back as a review finding.

### Purpose

One contract, one floor list and one linter exist before either mode reads an override, so phases 002 to 006 build on the same format.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior

Before this phase the shared folder held no override contract and no script folder.

```text
$ ls .skilled/skills/sk-code/shared/ .skilled/skills/sk-code/shared/references/universal
.skilled/skills/sk-code/shared/:
README.md
references

.skilled/skills/sk-code/shared/references/universal:
code-quality-standards.md
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Write the contract reference: the optional `## Rule overrides` section, its row format, the `<class>.<name>` id grammar with `review.<name>` lens ids, the fixed and overridable ids, precedence, where a section may live and how quality and review record an override.
- Write the hard floor once as JSON beside the reference.
- Add the linter `check-rule-overrides.cjs`, which reads that JSON, and its `node --test` suite.
- Run the linter suite in the sk-code Script Tests workflow.
- Add the linter and the contract to the shared README, write the hub changelog entry and step the hub's version carriers.

### Out of Scope

- Any change to `sk-code-quality` or `sk-code-review` behavior files. Phases 002 to 006 make each mode read overrides.
- Any CI workflow other than `sk-code-script-tests.yml`, and any change to that job's switch condition, timeout, permissions or path filters.
- Rule ids for the overridable floor rows and the review lens. Phases 003 and 005 assign them in the grammar this phase fixes.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/sk-code/shared/references/universal/rule-overrides.md` | Create | The contract |
| `.skilled/skills/sk-code/shared/references/universal/rule-overrides.json` | Create | The hard floor list |
| `.skilled/skills/sk-code/shared/scripts/check-rule-overrides.cjs` | Create | The linter |
| `.skilled/skills/sk-code/shared/scripts/tests/check-rule-overrides.test.cjs` | Create | The linter suite |
| `.skilled/skills/sk-code/shared/README.md` | Modify | Index the new files |
| `.skilled/skills/sk-code/changelog/v3.9.7.0.md` | Create | Hub changelog entry |
| `.skilled/skills/sk-code/SKILL.md`, `description.json`, `hub-router.json`, `mode-registry.json` | Modify | Version carriers to 3.9.7.0 |
| `.hermes/skills/sk-code/SKILL.md` | Modify | Regenerated Hermes copy |
| `.github/workflows/sk-code-script-tests.yml` | Modify | One step that runs the shared suite |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The contract reference defines the section, the row format, the id grammar, the fixed ids, the machine-checked classes, precedence, the three seats, the single reading path and each outcome for both modes |
| REQ-002 | The fixed ids and the machine-checked classes live in one JSON file that the linter reads, and a test fails when the reference and the JSON differ |
| REQ-003 | The linter exits 1 with a message naming the rule for a fixed id, an unknown action or a malformed row, and exits 0 on a valid or absent section |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | The hub changelog entry validates with 0 issues, the carriers read 3.9.7.0 and the Hermes copies are in sync |
| REQ-005 | No quality or review behavior file changes |
| REQ-006 | The sk-code Script Tests workflow runs the shared suite, and its YAML parses, passes `actionlint` and keeps path parity |
| REQ-007 | `lintOverrides` is the only exported reading path, and it refuses a `replace:` row on a machine-checked id |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `node --test .skilled/skills/sk-code/shared/scripts/tests/check-rule-overrides.test.cjs` reports `fail 0`, and fails before the linter exists.
- **SC-002**: `validate.sh` on this folder and on the parent prints `RESULT: PASSED`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phases 003 and 005 assign the overridable ids | A later id could clash with a fixed one | The fixed list uses the `floor` and `review` classes with names the later phases reuse, and the linter refuses a fixed id wherever it appears |
| Risk | The reference and the JSON drift | A mode could honor a floor override | The linter reads only the JSON, and a test compares the reference table with it |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: N/A. The linter reads one small markdown file per argument.

### Security
- **NFR-S01**: The linter reads only the files it is given and writes nothing.

### Reliability
- **NFR-R01**: An unreadable file or floor list exits 2 with a message, never 0.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a checklist with no `## Rule overrides` section exits 0 and says so. A fenced example of the section is not read as one.
- Maximum input: two sections in one file, or one id named twice, are refused.
- Failure path: no argument or an unreadable file exits 2 with usage or the read error.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | Four new files in one shared folder, one README and the version carriers |
| Risk | 6/25 | No reader yet, so no behavior change. The floor list is the one contract later phases rely on |
| Research | 4/20 | The investigation summaries settled the design |
| **Total** | **18/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->
