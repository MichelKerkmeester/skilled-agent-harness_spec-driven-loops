---
title: "Feature Specification: Quality resolver: multi-file explain with surface skill folders, checklist seats and rule overrides"
description: "The quality runner's --explain takes one path and says nothing about where a surface lives, which seat listed a checklist or what its rule overrides say, so review keeps its own detection pseudocode. This child makes --explain the one read-only resolver."
trigger_phrases:
  - "quality resolver"
  - "quality resolver multi file explain with surface skill"
  - "explain surface skill folder"
  - "explain checklist seat overrides"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Quality resolver: multi-file explain with surface skill folders, checklist seats and rule overrides

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
| **Branch** | `worktrees/232-private-guard-fixes` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`quality-gate.cjs --explain` accepts exactly one path, so a caller with a ten-file change makes ten calls, and a second path is a `USAGE` error. Its output names surface labels but not the folder a surface is loaded from, so a private surface with no `quality` block cannot be found from the label alone. It also does not say which seat listed each checklist or what the checklist's `## Rule overrides` section holds. Review therefore keeps its own `detect_surface_evidence` pseudocode and a `local-` heuristic instead of asking the runner.

### Purpose
One read-only call answers, per file, which surfaces apply, where each surface lives, which checklists apply and from which seat, and what each checklist overrides or why its overrides are refused.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
Measured with the `HEAD` runner (`6285986cd4`), copied beside the live one so it resolves the same hub:

```text
$ node quality-gate.cjs --explain README.md AGENTS.md
quality-gate: USAGE: unknown argument AGENTS.md
exit=3
$ node quality-gate.cjs --explain README.md   (top-level keys, then checklist row keys)
schema,status,exit_code,file,language,language_source,unchecked,surfaces,config,checklists,checks,errors,note
file,path,why
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Accept several paths in one `--explain` call, listed after the flag or by repeating it.
- Emit a `files` array with one entry per file, and keep the single-path top-level fields when one path is named.
- Add `surface_skills` per file: label, owner (`hub` or `outside-skill`) and folder, from the declared-surfaces reader and its trusted-root rule.
- Add `source`, `sources` and `overrides` to each checklist row, the overrides read through the shared linter's `lintOverrides`.
- Document the shape in `references/runner-contract.md`, and test it.

### Out of Scope
- Review consuming the output - child 005 owns review.
- A text form of `--explain` - the CLI documents `--explain` as JSON only, and the brief asks only that existing text output stay readable, which this child does not touch.
- The run verdict's `checklists` rows - they keep their exact shape, and only the explanation reports seats.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/sk-code/sk-code-quality/scripts/quality-gate.cjs` | Modify | Multi-path `--explain`, seats beside the checklist list, `surface_skills`, `overrides` |
| `.skilled/skills/sk-code/sk-code-quality/scripts/tests/quality-gate.test.cjs` | Modify | Six explain cases |
| `.skilled/skills/sk-code/sk-code-quality/references/runner-contract.md` | Modify | The multi-file explain shape and its fields |
| `.skilled/skills/sk-code/sk-code-quality/changelog/v1.13.3.0.md` | Create | Changelog entry |
| `.skilled/skills/sk-code/sk-code-quality/SKILL.md` | Modify | Version carrier |
| `.hermes/skills/sk-code-quality/SKILL.md` | Modify | Hermes copy resynced |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `--explain a b` and `--explain a --explain b` both exit 2 and print a `files` array with one entry per file, each with its own surfaces and checklists |
| REQ-002 | Each file entry carries `surface_skills`, one `{label, owner, folder}` row per declared surface that detected it, a trusted `local-*` link included and an untrusted one skipped |
| REQ-003 | Each checklist row carries `source` and `sources`, the seats `default`, `repo-config`, `hub-surface` or `outside-skill` that listed it for that file |
| REQ-004 | Each checklist row carries `overrides`, the `lintOverrides` result with `found`, `refused`, `rows` and `errors`, so a floor override is refused with its error |
| REQ-005 | Explain starts no check or configured command and writes no file, for one path or several |
| REQ-006 | A single-path call prints every field it printed before, in the same order and with the same values, and only gains fields |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-007 | `runner-contract.md` documents the multi-file shape and every new field |
| REQ-008 | The quality runner suite passes in full, up from 123 cases |
| REQ-009 | A changelog entry validates with 0 issues and the Hermes copies are in sync |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `node quality-gate.cjs --explain README.md AGENTS.md` exits 2 and prints two `files` entries.
- **SC-002**: The six new explain cases fail against the `HEAD` runner and pass against the changed one.
- **SC-003**: `node --test` over the quality runner tests prints `pass 129 fail 0`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `router-replay-lib.cjs` `declaredSurfaces` and the advisor's `private-skill-target.cjs` | No outside surface folder could be named without them | Reused as they are, so the explanation lists exactly what a run detects |
| Dependency | `shared/scripts/check-rule-overrides.cjs` | Without it no override could be read | Loaded from the runner's own hub; a load failure marks every section refused with the reason |
| Risk | A consumer reading top-level `file` breaks on a multi-path call | Med | The top-level fields stay for one path, and the contract tells every caller to read `files` |
| Risk | The run verdict changes shape | Low | Seats live in a map beside the checklist list, so run rows are untouched |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: One multi-path call resolves the declarations once, instead of once per path.

### Security
- **NFR-S01**: An outside folder is named only when the trusted-root rule already accepted its link.
- **NFR-S02**: The explanation is runtime output; the contract tells callers to copy labels, never private folder paths, into tracked files.

### Reliability
- **NFR-R01**: Exit code 2 for every successful explain call, 3 for a usage or file error, as before.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: `--explain` with no path is a `USAGE` error, exit 3.
- Maximum input: the same path named twice lists once, as `--files` does.
- Failure path: one missing path among several stops the call with `FILE_NOT_FOUND`, exit 3; a checklist that is not a regular file gets `overrides: null` and a `CHECKLIST_MISSING` error.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | One runner function group, one test file, one reference |
| Risk | 7/25 | Additive JSON fields on an advisory command |
| Research | 6/20 | Reading the declared-surfaces reader, the trusted-root rule and the linter |
| **Total** | **21/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---
