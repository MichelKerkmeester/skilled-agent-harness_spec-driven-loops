DEEP-RESEARCH

# Deep-Research Iteration Prompt Pack — iter 15 of 20 (ADVERSARIAL: PRIORITY CHALLENGE)

## STATE

state_summary: Iter 15 of 20. Iter 14 adversarial shifted RQ5 verdict from pure HYBRID to HYBRID-with-Anchor (sentinel sk-small-model with enhances edges + pattern index; real patterns stay distributed). Now adversarially challenge the §Follow-on Packets Index priority assignments.

Iteration: 15 of 20

Focus Area: **ADVERSARIAL — Challenge each P0/P1/P2 priority assignment in research.md §Follow-on Packets Index (12 packets).** For each packet, argue from the OPPOSITE direction (P0 down to P1, P1 up to P0, etc.) and decide if the current priority holds. Look specifically at:
- Is 010-cli-opencode-permissions-matrix really P0 (RM-8 prevention is critical), or could it be P1 because the four-layer prose mitigation is already shipped?
- Is 012-rq5-cross-cutting really P0 (advisor routing prerequisite), or could it be P1 because pure-HYBRID works without it (now revisited as HYBRID-with-Anchor)?
- Are the 3 P1 packets (002, 005, 006) really equal-priority, or should one come first?
- Is 011-cli-opencode-two-stage-routing genuinely P4 (lowest), or does its overlap with mcp-code-mode justify dropping entirely?
- Do any P2/P3 packets actually deserve P1 status (high-impact-but-undervalued)?

Also: with HYBRID-with-Anchor verdict from iter 14, do we need a NEW packet (say 013-sk-small-model-sentinel) for creating the thin sentinel skill? Or is that part of 012-rq5-cross-cutting?

Last 3 Iterations:
- iter 12: synthesis research.md (0.05 complete)
- iter 13: self-audit (0.12 insight)
- iter 14: adversarial verdict → HYBRID-with-Anchor (0.18 insight)

## STATE FILES

- Read: `research/research.md` §Follow-on Packets Index + per-RQ deltas, iter-014.md (HYBRID-with-Anchor verdict)
- Write iteration narrative: `.../research/iterations/iteration-015.md`
- Write delta: `.../research/deltas/iter-015.jsonl`

## CONSTRAINTS

- LEAF agent. Max 12 tool calls. 3-5 actions.
- Be willing to keep priorities unchanged if the adversarial case fails. Don't change for change's sake.

## SOURCE BOUNDARIES

- Primary: research.md §Follow-on Packets Index + §RQ1-RQ4 deltas + iter-014.md HYBRID-with-Anchor
- Cross-ref: spec.md §6 RISKS & DEPENDENCIES, §11 USER STORIES (priority guidance)

## OUTPUT CONTRACT

1. **iteration-015.md** — Per-packet priority audit:

   | Packet ID | Current Priority | Adversarial Argument | Verdict | New Priority |
   |---|---|---|---|---|

   + Recommended priority adjustments + NEW packet recommendation if HYBRID-with-Anchor sentinel skill warrants its own packet
   + Updated §Follow-on Packets Index table (if any changes)

2. **state.jsonl APPEND**: `{"type":"iteration","iteration":15,"newInfoRatio":<0..1>,"status":"insight","focus":"Adversarial — priority challenge for follow-on packets","graphEvents":[]}`. Ratio 0.10-0.25.

3. **deltas/iter-015.jsonl**: one iter record + one finding per priority adjustment.

## EXECUTION

1. Pre-plan (3 steps):
   a. Read research.md Follow-on Packets Index + per-packet rationale + iter-014.
   b. For each of 12 packets: argue counter-priority.
   c. Author audit table + adjustments + NEW packet recommendation if applicable.
2. Execute. Stop after step c.
3. Append JSONL + delta.
