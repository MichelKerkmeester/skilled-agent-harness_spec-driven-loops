---
description: Assign labels to text from a set or hierarchy (jev classify)
argument-hint: <text or @file> into <labels...>
allowed-tools: Bash(jev:*), Bash(npx jevctl:*), Read
---

Use the `jev` skill's `classify` command for: $ARGUMENTS

1. Identify the content (write long content to a temp file and pass `@file`) and the label set.
   If the user gave a hierarchy, write it as nested JSON and use `--taxonomy`. If several labels
   may apply at once, use `--multi`. Otherwise use `--labels` with short `label:description`
   entries that encode the user's rules, and add `--other` unless every input is known to fit.
2. Run `jev classify @file ... --json` and parse the result.
3. Report the label (or applied labels, or path) with its confidence. If `action` is `review`
   or the label is `other`, say so and show the top two probabilities so the user sees the
   alternative.
