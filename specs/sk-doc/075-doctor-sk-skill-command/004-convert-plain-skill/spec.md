---
title: "Feature Specification: Phase 4: convert-plain-skill"
description: "A plain agent skill has no version, ROUTER.md, graph-metadata.json or leaf-manifest config, and its sections do not follow the Skilled shape, so it fails the strict format gate and the advisor cannot see it. This phase extends convert with steps V1 and V3(a) to V8, bounded by a preservation check that fails when any original body line is lost."
trigger_phrases:
  - "convert plain skill"
  - "phase 4 convert plain skill"
  - "plain agent skill preservation check"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 4: convert-plain-skill

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-30 |
| **Branch** | `worktrees/281-doctor-skill-command` |
| **Parent Spec** | ../spec.md |
| **Phase** | 4 of 10 |
| **Predecessor** | 003-convert-legacy-skilled |
| **Successor** | 005-integration |
| **Handoff Criteria** | The plain fixture ends strict PASS and root-metadata exit 0 with the preservation check passing; a dropped-line fixture fails it |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 4** of the Doctor skill command: check and convert a skill to the Skilled format and wire it into the advisor specification.

**Scope Boundary**: Convert for input (a), a plain agent skill: V1 stage, V3(a) router render, V4 sections with the preservation check, V5 resource docs, V6 metadata, V7 generated files and V8 format gate. Integration rows I1 to I6 are phase 005.

**Dependencies**:
- Phase 003: `sk-skill-convert.cjs`, the transforms library, backups and exclusive create.
- `init_skill.py` (`.skilled/skills/sk-doc/sk-create-skill/scripts/init_skill.py:87-105, 276-307, 310-466`), `ci-skill-root-metadata.cjs`, `regenerate-skill-derived.cjs`, `package_skill.py`, `validate_skill_package.py`.

**Deliverables**:
- Steps V1, V3(a), V4 to V8 in `sk-skill-convert.cjs` and `lib/sk-skill-convert-transforms.cjs`
- `sk-skill-convert.cjs preserve --snapshot <dir>`
- Plain and dropped-line fixtures with tests in `sk-skill-convert.test.cjs`

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Class S needs only two authored files beyond `SKILL.md`, `graph-metadata.json` and `leaf-manifest.config.json` (`skill-root-metadata-contract.md:167-169`), but a plain skill also lacks the section shape, the resource-doc frontmatter and the router file the strict gate expects. Reshaping the sections is authored prose, so a script cannot prove it alone, and an unbounded rewrite could drop content silently.

### Purpose
Convert stages a plain skill under its frontmatter name, renders its router and metadata from the scaffolder, lets the workflow's agent reshape the prose, and refuses the result unless every original non-blank, non-heading body line survives and the strict gate passes.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ ls .skilled/commands/doctor/scripts/lib/sk-skill-convert-transforms.cjs .skilled/commands/doctor/scripts/sk-skill-convert.cjs
ls: .skilled/commands/doctor/scripts/lib/sk-skill-convert-transforms.cjs: No such file or directory
ls: .skilled/commands/doctor/scripts/sk-skill-convert.cjs: No such file or directory
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- V1 stage: a source outside `.skilled/skills` is copied, never moved, to `.skilled/skills/<frontmatter-name>/`; refuse if that folder exists. Stage under the frontmatter name, since `name` must equal the folder (`package_skill.py:1364`).
- V3(a) router: render `ROUTER.md` with one intent whose keywords are the approved phrases and whose `RESOURCE_MAP` lists the `references/` docs the body already links, in body order (template `skill-router-template.md:58-64`); the plan shows the map for approval.
- V4 sections: the agent step shapes SKILL.md into WHEN TO USE, SMART ROUTING (at most 12 lines and 180 words, `skill-md-template.md:514-535`), HOW IT WORKS, RULES with ALWAYS/NEVER/ESCALATE IF, REFERENCES (`package_skill.py:67-73`), following `sk-create-skill/SKILL.md:81-87`; `preserve --snapshot <dir>` checks every original non-blank, non-heading body line appears in the new SKILL.md, ROUTER.md or a `references/` file.
- V5 resource docs: add the five-field frontmatter plus `version` to `references/` and `assets/` markdown (`package_skill.py:242-245`); rename non-kebab paths and rewrite their links, shown file by file.
- V6 metadata: run `init_skill.py <name> --path <tmp>` and copy only absent files (`graph-metadata.json`, `leaf-manifest.config.json`, `manual-testing-playbook/`, `benchmark/`); replace slug defaults with at least 8 approved phrases (`ci-skill-root-metadata.cjs:605-611`).
- V7 generated files: `ci-skill-root-metadata.cjs --fix --skills-dir .skilled/skills --skill <name>`, then `regenerate-skill-derived.cjs --root <dir> --write`.
- V8 format gate: `package_skill.py <dir> --check --strict`, then `validate_skill_package.py <dir>`; stop on fail, no integration.

### Out of Scope
- Integration rows I1 to I6 - phase 005.
- The convert YAML and its yes gate - phase 006.
- Mode-into-hub conversion - report only, phase 008.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/commands/doctor/scripts/sk-skill-convert.cjs` | Modify | Steps V1, V3(a), V4 to V8 and the `preserve` subcommand |
| `.skilled/commands/doctor/scripts/lib/sk-skill-convert-transforms.cjs` | Modify | Link harvest, resource-doc frontmatter insert, kebab rename with link rewrite, phrase proposal |
| `.skilled/commands/doctor/scripts/tests/sk-skill-convert.test.cjs` | Modify | Plain-fixture and dropped-line cases |
| `.skilled/commands/doctor/scripts/tests/fixtures/sk-skill-convert/` | Modify | Add a plain skill fixture and a dropped-line variant, invented names |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The converted plain fixture passes `package_skill.py --check --strict`. |
| REQ-002 | `ci-skill-root-metadata.cjs --skill <fixture>` exits 0 on the converted plain fixture. |
| REQ-003 | `sk-skill-convert.cjs preserve --snapshot <dir>` passes on the converted plain fixture. |
| REQ-004 | A fixture with one dropped body line fails the preservation check and the step writes nothing further. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-005 | With fewer than 8 approved phrases, the plan stops with `INTENT_SIGNALS_BELOW_FLOOR`; slug-only defaults are never shipped. |
| REQ-006 | A plain skill with no `allowed-tools` gets no default: the plan proposes `[Read, Grep, Glob]`, plus `Bash` when `scripts/` exists, and waits for the operator. |
| REQ-007 | A source outside `.skilled/skills` is copied, and the source folder is byte-identical afterwards. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The plain fixture ends with `package_skill.py --check --strict` PASS, `ci-skill-root-metadata.cjs --skill <fixture>` exit 0 and the preservation check passing.
- **SC-002**: The dropped-line fixture fails the preservation check.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `init_skill.py` scaffold shape | No metadata to copy | Run it into a temp path and copy only absent files |
| Risk | The agent step drops or rewrites content | High | Preservation check on every non-blank, non-heading line; a lost line fails the step (parent D6) |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: N/A: a one-skill conversion with no latency target.
- **NFR-P02**: N/A: no throughput target applies.

### Security
- **NFR-S01**: `allowed-tools` is a permission grant and is never set without operator confirmation.
- **NFR-S02**: The source of an outside skill is never modified or moved.

### Reliability
- **NFR-R01**: V8 failure stops convert before any integration write.
- **NFR-R02**: Every rename is listed in the plan before it is applied.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a plain skill with no `references/` gets a `RESOURCE_MAP` with no entries beyond the default the template requires.
- Maximum input: the description over 130 characters fails `--strict` for a standalone (`package_skill.py:239, 1504-1511`); the plan proposes a trim as its own named routing change, and without a yes convert stops before V8 (parent D1).
- Failure path: a dropped body line fails `preserve` and the step stops; V8 failure stops before integration.
- Missing `graph-metadata.json`: V6 creates it from the `init_skill.py` shape (design R4).
- Outside root: copy, never move; `key_files` paths are relative to `.skilled/skills/<name>` (`init_skill.py:394-400`, design R5).
- Kebab renames: V5 rewrites the links it can parse, the plan lists every rename, and V8 catches a dangling path (design R7).
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 15/25 | Seven steps across two scripts and the test suite |
| Risk | 15/25 | Authored prose rewrite and file renames |
| Research | 6/20 | Steps and their callees are cited in design section 2.2 |
| **Total** | **36/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None. Parent D1, D6 and D7 settle the trim, the prose author and the permission grant.
<!-- /ANCHOR:questions -->

---

