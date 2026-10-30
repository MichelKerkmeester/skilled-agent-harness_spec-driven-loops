---
name: brindle-lantern
description: Helps inspect lantern sample records and decide whether the evidence supports a clear review.
---

# Brindle Lantern

## WHEN TO USE

A lantern review begins by checking the sample record.

## SMART ROUTING

Read the field notes before choosing a review path.
Load `references/field-notes.md` for written observations.
The machine router lives in [ROUTER.md](./ROUTER.md).
The router uses `discover_markdown_resources` to find reference files.
`_guard_in_skill` keeps every loaded path inside this skill folder.

## HOW IT WORKS

Keep the source sample unchanged while comparing marks.
If the record is unclear, ask for a second observation.
Use the marked route when a matching note exists.

## RULES

### ALWAYS

Keep the source sample unchanged while comparing marks.

### NEVER

Do not invent a note when no source mark exists.

### ESCALATE IF

If the record is unclear, ask for a second observation.

## REFERENCES

See [field notes](<references/field-notes.md>) before proceeding.
<!-- keywords: lantern sample review, inspect lantern records, compare field marks, read observation notes, choose lantern path, review sample evidence, verify record clarity, route lantern requests -->

## SUCCESS CRITERIA

A review is ready when each sample mark has a clear observation.

## INTEGRATION POINTS

The review uses the field notes beside the skill.

## RELATED RESOURCES

The linked field notes provide the review details.
