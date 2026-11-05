---
title: "Create Changelog Scripts: changelog shape gate"
description: "A Python gate that fails a global changelog entry whose length, item count, glance list or spec-folder line breaks the changelog template's ceilings."
version: 1.0.0.0
---

# Create Changelog Scripts

---

## 1. OVERVIEW

`sk-create-changelog/scripts/` holds the shape gate for the `/create:changelog` workflow. `check_changelog_shape.py` reads a changelog entry and fails it, one line per broken rule, when its shape breaks a ceiling that [`../assets/changelog-template.md`](../assets/changelog-template.md) sets. The workflow runs it on the draft before writing, so an entry that runs long never reaches `.skilled/changelog/`.

An entry is expanded when it carries an H4 item or an `## Upgrade Notes` section, and compact otherwise. Lines inside a fenced code block are never read, so a template skeleton quoted in a fence does not count.

| Rule | Fails when | Applies to |
|---|---|---|
| `file-total` | The entry runs past 240 lines below its frontmatter, blank lines included | Expanded |
| `h4-items` | The entry carries more than 26 H4 items | Expanded |
| `glance-bullets` | `## What's New at a Glance` holds more than 12 bullets | Both |
| `glance-order` | A tagged glance bullet comes before a bullet whose section sits earlier in the body, a tag names no topical section or one bullet lacks the tag the others carry | Expanded |
| `spec-line` | A `> Spec folder:` line carries a level label such as `(Level 2)` | Both |

The order rule reads the `({Topical Domain})` tag after a bullet's bold sentence, which names a topical H2 exactly as the heading spells it, letter case aside. When no bullet carries a tag the rule is skipped and the output says so, because an untagged bullet does not say which section it summarizes.

---

## 2. CONTENTS

| File | Purpose |
|------|---------|
| `check_changelog_shape.py` | Gate for the expanded file total, the H4 item ceiling, the glance bullet ceiling, the glance order and the spec-folder line. |

---

## 3. ENTRYPOINTS

| Entrypoint | Flags | Exit codes |
|---|---|---|
| `check_changelog_shape.py <entry.md> [...]` | None | 0 every entry passes, 1 an entry breaks a rule, 2 no path given or a file cannot be read |

---

## 4. VALIDATION

Run from the repository root.

```bash
python3 .skilled/skills/sk-doc/sk-create-changelog/scripts/check_changelog_shape.py .skilled/changelog/skilled/v4.0.1.0.md
```

Expected result: `PASS`, a note that the order rule was skipped and `SUMMARY files=1 pass=1 fail=0`, exit 0.

The sk-doc suite covers each rule at its ceiling and one past it in `test_check_changelog_shape.py`:

```bash
bash .skilled/skills/sk-doc/scripts/tests/run-script-tests.sh
```

Expected result: `all sk-doc script tests passed` and exit 0.

---

## 5. RELATED

- [`SKILL.md`](../SKILL.md), whose validation section runs this gate.
- [`changelog-template.md`](../assets/changelog-template.md), which sets the ceilings this gate holds.
- [`scripts/tests/`](../../scripts/tests/), the sk-doc suite that tests the gate.
