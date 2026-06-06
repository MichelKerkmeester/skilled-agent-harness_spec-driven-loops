DEEP-RESEARCH

# Deep-Research Iteration Prompt Pack — iter 16 of 20 (IMPLEMENTABILITY REVIEW)

## STATE

state_summary: Iter 16 of 20. Iter 13 self-audit (0.12), iter 14 verdict→HYBRID-with-Anchor (0.18), iter 15 priority audit. Now: per-artifact implementability review.

Iteration: 16 of 20

Focus Area: **IMPLEMENTABILITY — For each P0/P1 artifact, assess realistic implementation effort + what could go wrong.** The synthesis has 41 artifacts. P0/P1 packets (010, 012, 002, 005, 006, plus possible 013-sentinel-skill) span ~25-30 artifacts. For each:
- Realistic effort estimate (Low <4 hrs, Medium 4-12 hrs, High 12-30 hrs, Very High >30 hrs)
- Top failure mode (what's the most likely way this implementation goes wrong?)
- Pre-implementation dependencies (e.g. "needs 012 enhances edges merged first")
- Testability — is there a clear pass/fail check after implementation?
- Reversibility — can this be rolled back cleanly if it breaks production?

Output: implementability table covering ≥15 artifacts (focus on P0 + P1). Flag any artifact where:
- Failure mode is severe AND testability is weak → "implementation risk: HIGH"
- Effort is Very High AND reversibility is Low → "needs spike packet first"
- Dependencies create a chicken-and-egg loop → "needs sequencing ADR"

Last 3 Iterations:
- iter 13: self-audit (0.12)
- iter 14: HYBRID-with-Anchor verdict (0.18)
- iter 15: priority audit

## STATE FILES

- Read: `research/research.md` §RQ1-4 deltas (specifically P0/P1 candidate deltas)
- Read: iter-013 audit, iter-014 verdict, iter-015 priority audit (their findings inform implementability)
- Write iteration narrative: `.../research/iterations/iteration-016.md`
- Write delta: `.../research/deltas/iter-016.jsonl`

## CONSTRAINTS

- LEAF agent. Max 12 tool calls. 3-5 actions.
- Focus on P0 + P1 artifacts only (full 41-artifact audit isn't needed).
- Be honest about effort — undercounting Effort hurts later. Overcounting wastes budget.

## SOURCE BOUNDARIES

- Primary: research.md §RQ1-4 deltas + §Follow-on Packets Index
- Cross-ref: `.opencode/skills/cli-devin/SKILL.md` + `cli-opencode/SKILL.md` for current state of each integration point
- Optional: smallcode source for sanity-checking effort claims (e.g. "is the verifier really 5-stage or 3-stage?")

## OUTPUT CONTRACT

1. **iteration-016.md** — Implementability audit table:

   | Artifact | RQ | Packet | Effort (L/M/H/VH) | Top Failure Mode | Dependencies | Testability | Reversibility | Risk Rating |
   |---|---|---|---|---|---|---|---|---|

   + Implementation-risk flags + recommended "spike packet" candidates + sequencing ADR recommendation if dependencies form a loop.

2. **state.jsonl APPEND**: `{"type":"iteration","iteration":16,"newInfoRatio":<0..1>,"status":"insight","focus":"Implementability — effort + risk per P0/P1 artifact","graphEvents":[]}`. Ratio 0.10-0.25.

3. **deltas/iter-016.jsonl**: one iter record + one finding per HIGH-risk or VH-effort artifact.

## EXECUTION

1. Pre-plan (3 steps):
   a. Read research.md focusing on P0/P1 deltas (≥15 artifacts).
   b. For each: estimate effort + failure mode + dependencies + testability + reversibility.
   c. Compile audit table + flag high-risk artifacts.
2. Execute. Stop after step c.
3. Append JSONL + delta.
