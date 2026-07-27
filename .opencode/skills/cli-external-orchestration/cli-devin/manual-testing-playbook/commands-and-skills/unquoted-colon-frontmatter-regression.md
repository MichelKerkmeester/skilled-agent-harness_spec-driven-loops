---
title: "DV-016 -- Unquoted-colon frontmatter regression"
description: "Verify the strict Devin skills parser does not silently accept a malformed unquoted-colon description and hide the fixture."
version: 1.0.0.0
---

# DV-016 -- Unquoted-colon frontmatter regression

This document captures the realistic user-testing contract, execution flow, source anchors, and validation criteria for `DV-016`.

## 1. OVERVIEW

Reproduce the latent parser defect in an isolated workspace: a `description:` value containing an unquoted colon is invalid YAML, and Devin's strict parser silently drops the file while lenient parsers accept it.

### Why This Matters

The defect hid 12 of 36 commands until fixed. A roster test that only checks a lenient parser or the source files can report false parity.

## 2. SCENARIO CONTRACT

- Objective: Confirm a malformed fixture is excluded or reported by the strict parser, while a quoted control fixture remains visible.
- Real user request: `Regression-test command discovery with one malformed frontmatter file and one corrected control file.`
- Prompt: `In this isolated workspace, report whether the malformed and corrected fixture skills are visible to Devin. Do not edit the parent repository.`
- Expected execution process: Create a temporary `.devin/skills/` directory with one `description: Broken: value` fixture and one quoted control; run `devin skills list`; compare the output with a lenient YAML parse.
- Expected signals: The malformed fixture is not silently counted as a valid command; the corrected fixture is visible; the discrepancy is named as a strict-parser failure, not a missing symlink.
- Desired user-visible outcome: A regression guard against reintroducing unquoted-colon command descriptions.
- Pass/fail: PASS when the malformed fixture is rejected or explicitly diagnosed and the control remains visible; FAIL when the malformed fixture is accepted as valid or silently treated as a usable command; SKIP only when the installed parser cannot be isolated safely.

## 3. TEST EXECUTION

1. `DV016_DIR=$(mktemp -d /tmp/cli-devin-dv016.XXXXXX); mkdir -p "$DV016_DIR/.devin/skills/bad-fixture" "$DV016_DIR/.devin/skills/good-fixture"`
2. Write fixtures only under `$DV016_DIR`: the bad file uses an unquoted colon in `description: Broken: value`; the control quotes the same value. Do not modify `.devin/skills/` in the repository.
3. `cd "$DV016_DIR" && devin skills list > skills.txt 2>&1; echo "exit=$?" >> skills.txt`
4. Compare the strict list with a lenient YAML parse and record both fixture outcomes.

| Feature ID | Exact command | Expected signal | Verdict |
|---|---|---|---|
| DV-016 | Isolated fixture workspace plus `devin skills list` | Bad YAML rejected; quoted control visible | PASS/FAIL/SKIP |

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Isolated-config and parser-regression policy |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../SKILL.md` | Verified 36-command surface and discovery behavior |
| `../../../../.devin/skills/` | Real registration layout |

## 5. SOURCE METADATA

- Group: Commands and Skills
- Playbook ID: DV-016
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `commands-and-skills/unquoted-colon-frontmatter-regression.md`
