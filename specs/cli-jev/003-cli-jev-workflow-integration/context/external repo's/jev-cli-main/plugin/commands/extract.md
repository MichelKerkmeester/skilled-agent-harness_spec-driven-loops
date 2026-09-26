---
description: Pull specific values (emails, amounts, dates, ids) out of text without hallucination (jev extract)
argument-hint: <fields> from <text or @file>
allowed-tools: Bash(jev:*), Bash(npx jevctl:*), Read
---

Use the `jev` skill's `extract` command for: $ARGUMENTS

1. Identify the document (write it to a temp file, pass `@file`) and the fields wanted. Map each
   to a builtin (`email`, `phone`, `url`, `amount`, `date`, `percent`, `number`) or a custom
   `name=/regex/:description`. When two fields share a pattern (two emails, two dates), alias the
   builtin with distinct descriptions, e.g. `--want sender=email:the sender --want cc=email:the cc`.
   Add `--context` describing the document type.
2. Run `jev extract @file --want ... --json` and parse `fields`.
3. Report each field's `value` and `normalized` form. For `review`, show the confidence and the
   candidate count. For `none` with zero candidates, say the pattern did not match and offer to
   adjust the regex.
