---
title: "Create Changelog Scripts: shape gate and release notes builder"
description: "A Python gate that fails a global changelog entry whose shape breaks the template's ceilings, and a builder that turns an entry into its GitHub release body."
version: 1.0.8.0
---

# Create Changelog Scripts

---

## 1. OVERVIEW

`sk-create-changelog/scripts/` holds the shape gate and the release notes builder for the `/create:changelog` workflow. `check_changelog_shape.py` reads a changelog entry and fails it, one line per broken rule, when its shape breaks a ceiling that [`../assets/changelog-template.md`](../assets/changelog-template.md) sets. The workflow runs it on the draft before writing, so an entry that runs long never reaches `.skilled/changelog/`.

An entry is expanded when it carries an H4 item or an `## Upgrade Notes` section, and compact otherwise. Lines inside a fenced code block are never read, so a template skeleton quoted in a fence does not count.

| Rule | Fails when | Applies to |
|---|---|---|
| `glance-order` | A tagged glance bullet comes before a bullet whose section sits earlier in the body, a tag names no topical section or one bullet lacks the tag the others carry | Expanded |
| `spec-line` | A `> Spec folder:` line carries a level label such as `(Level 2)` | Both |
| `checked-section` | The entry has no `## How It Was Checked` section | Expanded |
| `sentence-max` | A prose sentence runs past 22 words | Both |
| `sentence-mean` | The prose sentences average more than 10 words | Both |

The sentence rules read prose only. Headings, tables, blockquotes, HTML tag lines such as `<details>` and fenced blocks are skipped, and a code span counts as one word. Lines wrapped inside one paragraph or list item are joined first, a list number is not a word and a colon does not end a sentence.

The order rule reads the Section column of the glance table, one name per row. An older entry may use bullets instead, each with a trailing `<!-- section: {Topical Domain} -->` comment or a visible `({Topical Domain})` tag after its bold sentence. Each one names a topical H2 exactly as the heading spells it, letter case aside. When no row or bullet names a section the rule is skipped and the output says so.

The spec-position rule accepts a spec-folder line folded inside a closing `<details>` block, so a list of several folders can stay collapsed.

---

## 2. CONTENTS

| File | Purpose |
|------|---------|
| `check_changelog_shape.py` | Gate for the glance order, the spec-folder line and its place at the end of the entry, the How It Was Checked section and the sentence length. |
| `build_release_notes.py` | Builds a GitHub release body from an entry. It drops the frontmatter and the title H1 and appends the `Full changelog` pointer. The publish step uses it, and so does the step that keeps a published release in step with its entry. |

---

## 3. ENTRYPOINTS

| Entrypoint | Flags | Exit codes |
|---|---|---|
| `check_changelog_shape.py <entry.md> [...]` | None | 0 every entry passes, 1 an entry breaks a rule, 2 no path given or a file cannot be read |
| `build_release_notes.py <entry.md>` | `--out <file>`, else stdout | 0 notes written, 2 a usage error or an entry that cannot be read |

---

## 4. VALIDATION

Run from the repository root.

```bash
python3 .skilled/skills/sk-doc/sk-create-changelog/scripts/check_changelog_shape.py .skilled/changelog/skilled/v4.0.2.1.md
```

Expected result: `PASS` and `SUMMARY files=1 pass=1 fail=0`, exit 0. Entries published before v4.0.2.1 predate the sentence rules and fail them.

The sk-doc suite covers each rule at its ceiling and one past it in `test_check_changelog_shape.py`, and the release body in `test_build_release_notes.py`:

```bash
bash .skilled/skills/sk-doc/scripts/tests/run-script-tests.sh
```

Expected result: `all sk-doc script tests passed` and exit 0.

---

## 5. RELATED

- [`SKILL.md`](../SKILL.md), whose validation section runs the gate and whose release notes section uses the builder.
- [`changelog-template.md`](../assets/changelog-template.md), which sets the ceilings this gate holds.
- [`scripts/tests/`](../../scripts/tests/), the sk-doc suite that tests the gate.
