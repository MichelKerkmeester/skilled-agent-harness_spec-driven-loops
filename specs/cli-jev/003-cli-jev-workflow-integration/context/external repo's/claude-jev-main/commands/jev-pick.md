---
description: Compare implementation options with Jev before recommending one
argument-hint: <the decision, and the options if you already have them>
---

Decide this with Jev's help: $ARGUMENTS

1. State the decision in one sentence and the requirement the winner has to
   satisfy.
2. Write 2-6 options, each with a short label and a one or two sentence summary.
   If the options are not given, derive them from the code first.
3. Call `jev_pick_option` with the options and the `sources` they would live in.
4. Show the three answers - best, safest, simplest - with their confidences and
   the risk score per option, then give your own recommendation.

When the three answers disagree, that disagreement is the finding: name the
trade-off instead of picking silently.
