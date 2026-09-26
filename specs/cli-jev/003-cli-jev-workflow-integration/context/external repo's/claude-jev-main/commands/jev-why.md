---
description: Rank the possible causes of a failure with Jev
argument-hint: <the symptom, plus any logs or error output>
---

Work out what is causing this: $ARGUMENTS

1. Write the symptom as observed, and collect the evidence already available:
   logs, stack traces, measurements.
2. Write at least two hypotheses, each a one-sentence cause with a short id. If
   you only have one, look for a competing explanation before continuing.
3. Call `jev_rank_hypotheses` with the symptom, the evidence, the hypotheses and
   the `sources` that would show the cause.
4. Investigate the top hypothesis using the next check Jev suggested, and say
   which numbers sent you there.

Report a cause as confirmed only after the check actually confirmed it.
