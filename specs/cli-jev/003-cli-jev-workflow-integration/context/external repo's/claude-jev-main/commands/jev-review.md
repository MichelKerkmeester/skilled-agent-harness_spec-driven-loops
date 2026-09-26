---
description: Review code and let Jev filter the findings before you report them
argument-hint: [diff | branch | file | PR number]
---

Review this target, defaulting to the uncommitted changes when none is given:
$ARGUMENTS

1. Read the change and collect candidate findings yourself. For each one write a
   short id, the file, the line, a one-sentence claim naming the defect, and the
   concrete inputs that produce the wrong result.
2. Call `jev_review_findings` with those findings, the `sources` they live in as
   paths with line ranges, and the intent of the change.
3. Report the findings Jev kept, worst consequence first, each with its numbers.
   List what was dropped in one line so nothing disappears silently.
4. Say plainly when Jev dropped something you still believe in, and why.

Do not report a finding you have not passed through Jev, and do not treat a kept
finding as confirmed: the number says how likely it is, not that it is real.
