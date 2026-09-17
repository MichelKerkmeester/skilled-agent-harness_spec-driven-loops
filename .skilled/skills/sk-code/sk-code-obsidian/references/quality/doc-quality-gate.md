---
title: sk-code-obsidian Doc Quality Gate
description: Run the sk-doc DQI scorer on any file this packet or the plugin's spec-doc tree ships, enforce the quality bar, hit the per-type score targets, and apply the gate before a docs change lands.
trigger_phrases:
  - "sk-code-obsidian doc quality gate"
  - "run dqi scorer obsidian packet"
  - "extract structure script obsidian"
  - "dqi score target reference file"
  - "docs change gate obsidian surface"
importance_tier: normal
contextType: implementation
version: 0.1.0.0
---

# sk-code-obsidian Doc Quality Gate

Every markdown file this packet ships passes the same deterministic quality gate every other
`sk-code` surface uses — the gate is hub infrastructure, not per-surface. This page states the
scorer invocation, the quality bar, and the per-document-type targets as they apply here.

---

## 1. PURPOSE

The gate keeps this packet's documentation machine-checkable and consistent with the rest of
`sk-code`. It runs the sk-doc structure extractor, reads the Document Quality Index (DQI) from
its JSON output, and blocks any file that scores below the bar. The score is fully deterministic
— two runs on the same file produce the same number.

---

## 2. SCORER AND INVOCATION

The extractor is `extract_structure.py` in the sk-doc skill, reachable from the hub root:

```bash
python3 .opencode/skills/sk-doc/scripts/extract_structure.py \
  .opencode/skills/sk-code/sk-code-obsidian/references/obsidian-plugin-api.md
```

The command prints one JSON object to stdout. The DQI sits in `dqi.total`, the band name in
`dqi.band`, and `dqi.components` breaks the score into structure, content, and style.
`dqi.breakdown` names every contributing check. A sweep over this packet's references:

```bash
for f in .opencode/skills/sk-code/sk-code-obsidian/references/*.md \
         .opencode/skills/sk-code/sk-code-obsidian/references/{operations,quality,release,setup,standards}/*.md
do
  python3 .opencode/skills/sk-doc/scripts/extract_structure.py "$f"
done
```

---

## 3. QUALITY BAR

The minimum DQI to land a docs change is **70**, applied identically to this packet:

| Band | Range | Meaning |
| --- | --- | --- |
| excellent | 90–100 | Production ready |
| good | 75–89 | Minor improvements recommended |
| acceptable | 60–74 | Several areas need attention |
| needs_work | below 60 | Significant improvements required |

A file at 70 or higher passes; a file at 69 or lower fails.

---

## 4. SCORE TARGETS BY DOCUMENT TYPE

| Document class | Target DQI | Bar | Notes |
| --- | --- | --- | --- |
| Reference docs under `references/` | 90 | 70 | Frontmatter, intro paragraph, numbered ALL-CAPS H2 sections, dividers, language-tagged code blocks |
| `README.md` | 80 | 70 | H1 plus blockquote description, table of contents, numbered H2 sections |

New files this packet adds must reach the target for their class. A change must never lower a
file's own score relative to its base revision.

---

## 5. GATE APPLICATION

Run in review order:

1. The DQI is 70 or higher — below blocks the change.
2. The DQI is not lower than the same file's base-revision score. Measure it, do not look it up
   in a stored table:

```bash
git show HEAD:path/to/file.md > /tmp/base.md
python3 .opencode/skills/sk-doc/scripts/extract_structure.py /tmp/base.md
```

3. A new file reaches its class target, or the change carries a documented plan naming the file
   and the score gap.

---

## 6. WHAT THE SCORER REWARDS

| Element | Points | How it is scored |
| --- | --- | --- |
| Every H2 in the form `## N. SECTION NAME`, numbered and ALL CAPS | 12 | Pro rata across all H2s |
| `---` divider between H2 sections | 6 | Full marks once dividers reach one fewer than H2 count |
| Style-issue budget | 8 | Starts at 8, −2 per issue, floored at 0 |
| Intro paragraph between H1 and first H2 | 4 | All or nothing |

Placeholder markers (`[TODO]`, `{{PLACEHOLDER}}`) are blocking errors, not point deductions.

---

## 7. FAILURE RESPONSE

Fix structure first (frontmatter, intro, H2 numbering, dividers), then content (word count,
heading density, code examples, tables, links), then style (intro paragraph, remaining style
issues). Re-run the extractor after each pass and read `dqi.breakdown` for the exact checks lost.

---

## 8. RELATED REFERENCES

- `../comment-grammar.md` — the code-side counterpart of this doc-side quality discipline.
- `../folder-docs.md` — the folder-scope threshold this packet's own `references/` layout
  satisfies by mirroring `sk-code-mobile-cli`.
