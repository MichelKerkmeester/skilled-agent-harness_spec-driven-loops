DEEP-RESEARCH

# Deep-Research Iteration Prompt Pack — iter 14 of 20 (ADVERSARIAL: VERDICT CHALLENGE)

## STATE

state_summary: Iter 14 of 20. Iter 13 self-audit ratio 0.12 (research.md mostly accurate, minor issues). Now adversarial: argue AGAINST HYBRID verdict in favor of a new sk-small-model skill. If the adversarial case is compelling, update research.md; if not, document why HYBRID still wins.

Iteration: 14 of 20

Focus Area: **ADVERSARIAL — Challenge the HYBRID verdict.** Iter 5 + iter 12 (research.md §RQ5) concluded HYBRID (distributed refs + enhances edges, NO new skill). Steelman the OPPOSITE: a dedicated `sk-small-model` skill is BETTER than HYBRID. Make the strongest case you can:
- What advantages would a dedicated skill provide that HYBRID misses?
- How would `system-skill-advisor` routing differ (e.g. is HYBRID's discovery friction higher because patterns are spread across 5+ skills)?
- Does the user-stated goal ("when you call cli-devin it will also automatically prompt to check skill that has logic, workflows etc for smaller models") map better to a dedicated skill than to distributed refs + enhances edges?
- What's the maintenance cost of HYBRID vs dedicated skill?
- If the adversarial case wins, name 2-3 specific patterns that ONLY work cleanly as a unified skill (not as distributed refs).

Then steelman HYBRID back. Verdict at the end of the iter: STICK with HYBRID, FLIP to dedicated skill, or HYBRID-with-Anchor (a sentinel small-model skill that holds ONLY enhances edges + AGENTS.md rule pointer + 1-2 paragraph philosophy, with all actual patterns staying distributed).

Last 3 Iterations:
- iter 11: gap audit (0.15 exhausted)
- iter 12: synthesis (0.05 complete)
- iter 13: self-audit (0.12 insight)

## STATE FILES

- Read: `research/research.md` §RQ5, iter-005.md (original HYBRID verdict), iter-010.md (cross-cutting wiring), iter-011.md (gap audit verdict on dropped-RQs)
- Cross-ref: `.opencode/skills/sk-prompt/SKILL.md` + `sk-prompt/graph-metadata.json` (existing enhances precedent), `.opencode/skills/system-skill-advisor/SKILL.md`, `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts` (line 41-200)
- Write iteration narrative: `.../research/iterations/iteration-014.md`
- Write delta: `.../research/deltas/iter-014.jsonl`

## CONSTRAINTS

- LEAF agent. Max 12 tool calls. 3-5 actions.
- Steelman both sides equally. Don't pre-decide the outcome. If HYBRID is genuinely better, say so explicitly.
- Verdict must include the user's original framing as a constraint: "automatically prompt to check skill that has logic for smaller models". Show which option (HYBRID vs dedicated vs HYBRID-with-Anchor) best satisfies that goal.

## SOURCE BOUNDARIES

- Primary: research.md §RQ5 + §Executive Summary
- Spot-check: iter-005, iter-010, iter-011 verdicts
- Cross-ref: sk-prompt enhances structure as the precedent template

## OUTPUT CONTRACT

1. **iteration-014.md**:
   - Steelman PRO-new-skill (≥5 specific advantages)
   - Steelman PRO-HYBRID rebuttal
   - User-goal mapping table (does HYBRID/dedicated/HYBRID-with-Anchor best satisfy "auto-prompt small-model logic on cli-devin call"?)
   - Final verdict: STICK / FLIP / HYBRID-with-Anchor
   - If FLIP or HYBRID-with-Anchor: what specific changes to research.md? (Draft the edits.)

2. **state.jsonl APPEND**: `{"type":"iteration","iteration":14,"newInfoRatio":<0..1>,"status":"<insight|exhausted>","focus":"Adversarial — verdict challenge HYBRID vs new skill","graphEvents":[]}`. Ratio 0.10-0.30 (if verdict shifts, higher; if confirms, lower).

3. **deltas/iter-014.jsonl**: one iter record + one observation per material verdict element.

## EXECUTION

1. Pre-plan (3 steps):
   a. Read research.md §RQ5 + supporting iters carefully. Re-read user goal from spec.md §2 Purpose.
   b. Cross-ref sk-prompt enhances precedent + advisor scorer behavior.
   c. Author steelman PRO + steelman CONTRA + verdict + (if shift) research.md edit list.
2. Execute. Stop after step c.
3. Append JSONL + delta.
