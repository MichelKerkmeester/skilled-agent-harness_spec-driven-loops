---
title: Pi Remote Doc Quality Gate
description: Run the DQI scorer on any app markdown file, enforce the quality bar, hit the per-type score targets, and apply the gate before a docs change lands.
trigger_phrases:
  - 'doc quality gate'
  - 'run dqi scorer'
  - 'extract structure script'
  - 'dqi score target'
  - 'docs change gate'
  - 'dqi score regression check'
importance_tier: normal
contextType: implementation
version: 1.1.0.0
---

# Pi Remote Doc Quality Gate

Every markdown file shipping with Pi Remote passes a deterministic quality gate before a docs change lands.

---

## 1. OVERVIEW

### Core Principle

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

New files must reach the target for their class. Existing files at or above the bar may land as they are, but a change must never lower a file's own score.

---

## 5. GATE APPLICATION

The gate runs in review, before a docs change lands. The reviewer runs the extractor on every markdown file the change adds or edits and applies three checks in order:

1. The DQI is 70 or higher. Below 70 blocks the change.
2. The DQI is not lower than the score the same file produces at the base revision. A regression blocks the change.
3. A new file reaches the target for its class, or the change carries a documented plan that names the file and the score gap.

Check 2 is measured, not looked up. Because the scorer is deterministic, the reviewer reads the base revision of the file and runs the extractor on it:

```bash
git show HEAD:path/to/file.md > /tmp/base.md
python3 .opencode/skills/sk-doc/scripts/extract_structure.py /tmp/base.md
```

The comparison is against the file's own prior revision, never against a stored score table. A checked-in table drifts the moment a doc changes outside the gate; re-measuring the base revision cannot.

---

## 6. WHAT THE SCORER REWARDS

The document shape itself is defined once, by the create-skill templates, and is not restated here:

| Document class | Canonical template |
| -------------- | ------------------ |
| Skill reference file | `.opencode/skills/sk-doc/sk-create-skill/assets/skill/skill-reference-template.md` |
| Skill asset file | `.opencode/skills/sk-doc/sk-create-skill/assets/skill/skill-asset-template.md` |
| README | `.opencode/skills/sk-doc/sk-create-readme/` |

What belongs here is only the part the templates do not carry: how the scorer converts that shape into points. The style component is worth 30 and breaks down as follows.

| Element | Points | How it is scored |
| ------- | ------ | ---------------- |
| Every H2 in the form `## N. SECTION NAME`, numbered and ALL CAPS | 12 | Pro rata: the rate of numbered plus ALL-CAPS H2s across all H2s. A file with no H2 at all forfeits nothing. |
| `---` divider between H2 sections | 6 | Full marks once the divider count reaches one fewer than the H2 count; below that, pro rata. |
| Style-issue budget | 8 | Starts at 8 and loses 2 per style issue, floored at 0. Four issues zero it. |
| Intro paragraph between H1 and the first H2 | 4 | All or nothing. |

Changelogs are exempt from the H2 rule and are granted the full 12: the changelog template uses unnumbered Title-Case headings, so scoring them against the numbered ALL-CAPS house style would cap a correct changelog in the acceptable band.

Placeholder markers such as `[TODO]` and `{{PLACEHOLDER}}` are blocking errors, not point deductions.

Run the extractor and read `dqi.breakdown` to see which of these a specific file lost. The keys are `h2_format_score`, `divider_score`, `style_issue_score`, and `intro_score`.

---

## 7. FAILURE RESPONSE

A blocked file needs a fix before the change can land. Work the fix in the same order the score is built.

1. Structure first. Fix frontmatter, the intro paragraph, H2 numbering, ALL CAPS headings, and section dividers.
2. Content next. Bring word count into range, balance heading density, add language-tagged code examples, tables, and links.
3. Style last. Confirm the intro paragraph exists and no style issues remain.

Re-run the extractor after each pass. The `dqi.breakdown` object names the exact checks that lost points, so the fix targets the right component. Open a docs issue with the file path and the DQI output when a score cannot be raised.
