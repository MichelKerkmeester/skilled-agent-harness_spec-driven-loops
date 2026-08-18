---
title: Pi Remote Doc Quality Gate
description: Run the DQI scorer on any app markdown file, enforce the quality bar, hit the per-type score targets, and apply the gate before a docs change lands.
trigger_phrases:
  - 'doc quality gate'
  - 'run dqi scorer'
  - 'extract structure script'
  - 'dqi score target'
  - 'docs change gate'
  - 'dqi baseline table'
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# Pi Remote Doc Quality Gate

Every markdown file that ships with Pi Remote passes a deterministic quality gate before a docs change lands. The gate runs the sk-doc structure extractor, reads the Document Quality Index (DQI) from its JSON output, and blocks any file that scores below the bar. This page defines the scorer invocation, the quality bar, the per-document-type targets, and the exact gate check that a reviewer applies.

---

## 1. PURPOSE

The gate keeps app documentation machine-checkable and consistent. It uses the sk-doc structure extractor from the workspace skill tree, which scores structure, content, and style on a 100 point scale. The score is fully deterministic. Two runs on the same file produce the same number. The gate makes that number the entry requirement for every docs change.

---

## 2. SCORER AND INVOCATION

The extractor is `extract_structure.py` in the sk-doc skill. From the app root it resolves through the dotfile symlink at `.opencode/skills/sk-doc/scripts/extract_structure.py`.

Run it on one file:

```
python3 .opencode/skills/sk-doc/scripts/extract_structure.py docs/setup.md
```

The command prints one JSON object to stdout. The DQI sits in the `dqi.total` key and the band name in `dqi.band`. The `dqi.components` object breaks the score into structure, content, and style, and `dqi.breakdown` names every contributing check.

A full sweep over the app docs uses the same command in a loop:

```
for f in docs/*.md
do
  python3 .opencode/skills/sk-doc/scripts/extract_structure.py "$f"
done
```

The process exits with code 1 only when the file cannot be read. A valid markdown file always produces a score.

---

## 3. QUALITY BAR

The minimum DQI to land a docs change is 70. This is a hard rule. Any changed markdown file that scores below 70 is blocked and must be fixed before the change lands.

The scorer bands map to score ranges as follows:

| Band       | Range     | Meaning                           |
| ---------- | --------- | --------------------------------- |
| excellent  | 90 to 100 | Production ready                  |
| good       | 75 to 89  | Minor improvements recommended    |
| acceptable | 60 to 74  | Several areas need attention      |
| needs_work | below 60  | Significant improvements required |

The bar of 70 sits inside the acceptable band. A file at 70 or higher passes. A file at 69 or lower fails.

---

## 4. SCORE TARGETS BY DOCUMENT TYPE

The bar applies to every markdown file the change touches. The target is higher for the two document classes that ship in this repo.

| Document class             | Target DQI | Bar | Notes                                                                                              |
| -------------------------- | ---------- | --- | -------------------------------------------------------------------------------------------------- |
| Reference docs under docs/ | 90         | 70  | Frontmatter, intro paragraph, numbered ALL-CAPS H2 sections, dividers, language-tagged code blocks |
| README files               | 80         | 70  | H1 plus blockquote description, TABLE OF CONTENTS, numbered H2 sections                            |

New files must reach the target for their class. Existing files at or above the bar may land with the score recorded in the baseline, but a change must never lower the score that dqi-baseline.md records for that file.

---

## 5. GATE APPLICATION

The gate runs in review, before a docs change lands. The reviewer runs the extractor on every markdown file the change adds or edits and applies three checks in order:

1. The DQI is 70 or higher. Below 70 blocks the change.
2. The DQI is not lower than the score recorded for that file in `docs/quality/dqi-baseline.md`. A regression blocks the change.
3. A new file reaches the target for its class, or the change carries a documented plan that names the file and the score gap.

When the checks pass, the reviewer updates `docs/quality/dqi-baseline.md` with the new score in the same change. The baseline table stays current because the gate writes to it on every pass.

---

## 6. REFERENCE TEMPLATE SHAPE

Every reference doc under docs/ follows one shape. The shape is also what the style component of the DQI rewards.

- YAML frontmatter opens the file. Required keys are `title`, `description` on a single line, `trigger_phrases` as a YAML list, `importance_tier`, `contextType`, and `version`.
- H1 title follows the frontmatter. It carries no emoji and no trailing period.
- One intro paragraph of at least 10 words sits between the H1 and the first H2. The style component grants 4 points for it.
- H2 sections use the form `## N. SECTION NAME`, with a number prefix and ALL CAPS text. The style component grants 12 points for number plus ALL CAPS on every H2.
- A `---` divider line separates H2 sections. The style component grants 6 points for it.
- Code blocks carry a language tag. Placeholder markers such as `[TODO]` and `{{PLACEHOLDER}}` are blocking errors.

Frontmatter and opening block:

```
---
title: Example Document
description: One line that states what this document covers.
trigger_phrases:
  - 'example document'
importance_tier: normal
contextType: general
version: 1.0.0.0
---

# Example Document

This paragraph is the intro. It states the scope in ten words or more.
```

Numbered ALL-CAPS H2 sections:

```
## 1. OVERVIEW

Body content for the first section.

## 2. PROCEDURE

Body content for the second section, with a language-tagged code block.
```

---

## 7. BASELINE AND TRACKING

`docs/quality/dqi-baseline.md` holds the last measured DQI for every doc and README in the app. The gate refreshes the table on every passing change. Re-run the full sweep before a release to confirm the table matches the tree.

---

## 8. FAILURE RESPONSE

A blocked file needs a fix before the change can land. Work the fix in the same order the score is built.

1. Structure first. Fix frontmatter, the intro paragraph, H2 numbering, ALL CAPS headings, and section dividers.
2. Content next. Bring word count into range, balance heading density, add language-tagged code examples, tables, and links.
3. Style last. Confirm the intro paragraph exists and no style issues remain.

Re-run the extractor after each pass. The `dqi.breakdown` object names the exact checks that lost points, so the fix targets the right component. Open a docs issue with the file path and the DQI output when a score cannot be raised.
