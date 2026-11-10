---
title: "Feature Specification: Phase 15: frontmatter-yaml-validity"
description: "An unquoted ': ' in the quality skill's description made its frontmatter unparseable, and the validator reported nothing because it read frontmatter key by key. A strict scan of every tracked .skilled Markdown block rejected 29 files; they are quoted now and the validator blocks a block that does not parse."
trigger_phrases:
  - "frontmatter yaml validity"
  - "phase 15 frontmatter yaml validity"
  - "frontmatter is not valid yaml"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 15: frontmatter-yaml-validity

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-28 |
| **Branch** | `worktrees/253-frontmatter-yaml-validity` |
| **Parent Spec** | ../spec.md |
| **Phase** | 15 of 15 |
| **Predecessor** | 014-advisor-phrase-calibration |
| **Successor** | None |
| **Handoff Criteria** | The strict scan of every tracked `.skilled` Markdown frontmatter reports only the deliberate non-YAML fixture |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 15** of the Frontmatter YAML validity and the unused author field specification.

**Scope Boundary**: the frontmatter of every tracked `.skilled` Markdown file, and the sk-doc validator's verdict on a block that does not parse. Documents under `specs/` and archived logs keep whatever they carry.

**Dependencies**:
- None new. PyYAML is present on the system interpreter and absent on the Homebrew one, so the check has to stand without it.

**Deliverables**:
- 28 frontmatter blocks that a strict parser rejected, repaired without rewording a value.
- One blocking validator issue, `frontmatter_invalid_yaml`, with a parser-free fallback.
- A unit test for the check and a fleet test over every tracked `.skilled` block.
- 24 changelog entries with their version carriers, and the unused `author` line removed.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The operator opened the quality skill and found its frontmatter was not valid YAML: `description` held a sentence with `: ` in it, unquoted, so a strict parser read the rest of the line as a nested mapping. The same report asked why nine `SKILL.md` files carried `author: OpenCode`, a line that is neither true nor read by anything. `validate_document.py` reported 0 issues on the broken file, because every one of its frontmatter checks reads keys line by line and none of them parsed the block.

### Purpose
Every tracked `.skilled` frontmatter block parses as YAML, the validator blocks one that does not, and the header states only the fields a tool reads.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
# Every tracked .skilled Markdown file whose first line is '---', its block through yaml.safe_load,
# at base commit 65bafca332: 29 blocks rejected. The first, last and a list-only case:
  .skilled/commands/create/goal.md:2: mapping values are not allowed here
  .skilled/skills/sk-code/sk-code-quality/SKILL.md:3: mapping values are not allowed here
  .skilled/skills/sk-doc/manual-testing-playbook/unknown-fallback/disambiguation-required.md:15: mapping values are not allowed here
  .skilled/skills/sk-doc/sk-create-skill/assets/parent-skill/scaffold/hub-skill-scaffold.md:2: found unhashable key
  .skilled/skills/system-spec-kit/references/memory/memory-system.md:3: mapping values are not allowed here
  .skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/grep-convention/non-yaml.md:2: expected a comment or a line break, but found 'C'

# The same scan over the working tree: 1 block rejected, the fixture above.

$ python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py <the base version of the quality SKILL.md> --json
  "total_issues": 0, "valid": true

$ python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py <the same block, once the check exists> --json
  "total_issues": 1
  frontmatter_invalid_yaml blocking line 3: Frontmatter is not valid YAML at line 3: mapping values are not allowed here

$ git ls-tree -r --name-only HEAD -- .skilled | <frontmatter blocks carrying an author key>
  9, all of them SKILL.md files of the form 'author: OpenCode'
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Quote the value in the 27 frontmatter blocks a strict parser rejected, without rewording any of them.
- Move the one `version:` line that sat inside a list to the end of its frontmatter, as its siblings have it.
- Add a blocking `frontmatter_invalid_yaml` issue to `validate_document.py`, with a line check standing in where PyYAML is missing.
- Add a unit test for the check and a fleet test over every tracked `.skilled` block, with the fixture excluded by name.
- Remove `author: OpenCode` from the nine `SKILL.md` metadata blocks and from the hand-authored plugin manifest.
- Write one changelog entry for each touched skill and mode, and step its version carriers.

### Out of Scope
- Rewording a frontmatter value - the description that started this is the routing text the trigger index reads, and its wording is unchanged.
- The deliberate non-YAML fixture - `fixtures/grep-convention/non-yaml.md` is a Markdown table, which is the shape the retrieval tests must see.
- The `author: OpenCode` text inside old changelog entries and archived logs - those are records of what was written at the time, not live headers.
- `quick_validate.py`, which still reads frontmatter with regexes - the fleet test is what covers every file regardless of which checker runs.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/sk-doc/shared/scripts/validate_document.py` | Modify | `validate_frontmatter_yaml`, `_frontmatter_block`, `_unquoted_colon_line`, and the call from `validate_document` |
| `.skilled/skills/sk-doc/scripts/tests/test_frontmatter_yaml.py` | Create | 17 checks on the issue, its line, its hint, and the two verdicts under either interpreter |
| `.skilled/skills/sk-doc/scripts/tests/test_frontmatter_fleet.py` | Create | The fleet gate over every tracked `.skilled` block, and the live-exclusion assertion |
| 27 tracked `.skilled/**` Markdown files | Modify | The rejected value quoted; no value reworded |
| `.skilled/skills/sk-doc/manual-testing-playbook/unknown-fallback/disambiguation-required.md` | Modify | The `version:` line moved out of a list to the end of the block |
| Nine `SKILL.md` files: cli-external-orchestration, mcp-tooling, sk-code, sk-code-ci, sk-code-quality, sk-code-review, sk-code-skilled, sk-design, sk-doc | Modify | The unused `author` line removed; `family` and `packetKind` kept |
| `.hermes/plugins/repo-guards/plugin.yaml`, `.hermes/skills/*/SKILL.md` | Modify | The hand-authored plugin manifest loses the line; the mirrors are regenerated by the Hermes sync |
| `.skilled/skills/*/changelog/*.md`, 24 entries | Create | One entry per touched skill and mode |
| 24 `SKILL.md` version lines, plus the five hubs' `description.json`, `hub-router.json` and `mode-registry.json` | Modify | Version carriers stepped in lockstep |
| `.skilled/bin/lib/compiled-routing/**/manifest.json`, `.skilled/skills/system-skill-advisor/runtime/scripts/skill-graph.json` | Modify | Compiled manifests refreshed and the skill graph exported |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Every tracked `.skilled` Markdown file that opens with a frontmatter fence parses through `yaml.safe_load`, except `fixtures/grep-convention/non-yaml.md`, which the scan names and the test excludes. |
| REQ-002 | `validate_document.py` reports one blocking `frontmatter_invalid_yaml` issue, carrying the parser's line, for a block a strict parser rejects; it reports 0 issues on the repaired file and 1 on the base version of it. |
| REQ-003 | The same verdict holds where PyYAML is not importable, through a line check for a top-level unquoted value holding `: `. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | No frontmatter value is reworded and no body text moves: 0 changed values between the base commit and the working tree, apart from the two version steps and the inner quotes two `cupt` examples had to escape. |
| REQ-005 | No tracked `SKILL.md` or plugin manifest carries an `author` field, and no code reads `metadata.author`. |
| REQ-006 | Each touched skill and mode has a changelog entry with 0 validator issues, and its carriers state the version the entry names. |
| REQ-007 | `test_frontmatter_yaml.py` prints 17/17 under both interpreters, `test_frontmatter_fleet.py` passes its two tests, and the whole sk-doc script suite passes. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The strict scan reports one rejected block, `fixtures/grep-convention/non-yaml.md`, and 0 others.
- **SC-002**: `validate_document.py <base version of the quality SKILL.md> --json` prints `"total_issues": 0`, and the same command on the repaired file prints `frontmatter_invalid_yaml` with `"severity": "blocking"` at line 3.
- **SC-003**: `test_frontmatter_yaml.py` prints `17/17 passed` under `/usr/bin/python3` and under the Homebrew interpreter, and the suite prints `all sk-doc script tests passed`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | PyYAML on the interpreter that runs the validator | Without it a call raises | The import is optional, and a line check stands in with the same verdict; the test runs both verdicts under both interpreters |
| Risk | Quoting a description rewords it, and the advisory router matches on that text | Med | Every value was compared before and after: 0 changed values apart from version steps and the escaped inner quotes of two `cupt` examples |
| Risk | A fleet test that fails on an intentional fixture | Med | The fixture is excluded by name with its reason, and a second test fails when the exclusion stops being needed |
| Risk | The new blocking issue stops an unrelated document from validating | Low | It fires only on a block a strict parser rejects, which is a file that was already unparseable to every other YAML reader |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: The check adds one parse of one block per document; the fleet test over 4,651 blocks runs in 3.96s.

### Security
- **NFR-S01**: The parser reads the text the validator was already handed. No file the validator was not given is opened, and no network or credential is touched.

### Reliability
- **NFR-R01**: The same scan gives the same verdict on repeated runs, and the fleet test asserts its exclusion still fails so a repaired fixture cannot go quiet.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a file with no frontmatter block, or with a thematic break that carries no key line, returns no issue.
- Maximum input: a 4,651-block fleet; one block lists `expected_leaf_resources` before its moved `version:` line and parses as a mapping with equal values.
- Failure path: a file the fleet test cannot read as UTF-8 is skipped rather than failed, and a block that opens the file with `---` is read as frontmatter there even where the validator's key-line guard would not.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | 28 frontmatter blocks, one validator function, two tests, 24 carriers |
| Risk | 5/25 | No value changes; one new blocking issue |
| Research | 7/20 | Why the validator missed the block, and which interpreter has PyYAML |
| **Total** | **20/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---
