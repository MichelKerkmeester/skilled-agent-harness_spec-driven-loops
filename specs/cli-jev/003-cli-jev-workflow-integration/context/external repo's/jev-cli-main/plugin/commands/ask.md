---
description: Ask Jev typed yes/no, multiple-choice, or rating questions about text (jev ask)
argument-hint: <question(s)> about <text or @file>
allowed-tools: Bash(jev:*), Bash(npx jevctl:*), Read
---

Use the `jev` skill's `ask` command for: $ARGUMENTS

1. Identify the content (the state) and the question or questions. Write long content to a temp
   file and pass `@file`; use `--state-json` if it is JSON.
2. Turn each question into the right primitive:
   - yes/no → `--noul id="Question?"`
   - pick one of a set → `--choice id="Question?|optionA,optionB:short description,optionC"`,
     adding an `other` or `none` option when nothing may fit
   - degree on a scale → `--score id="Question?|lowest level,...,highest level"` with levels that
     describe concrete situations
   Ask all independent questions in one call.
3. Run `jev ask @file --json ...` and parse `answers`.
4. Report each answer with its probability or confidence. For choices, show the top two options
   when confidence is below about 0.7 so the user sees the alternative.
