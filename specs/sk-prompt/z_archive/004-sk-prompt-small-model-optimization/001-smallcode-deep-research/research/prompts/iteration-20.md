DEEP-RESEARCH

# Deep-Research Iteration Prompt Pack — iter 20 of 20 (FINAL CONSOLIDATION)

## STATE

state_summary: FINAL iter (20 of 20). Iters 13-19 added audit/adversarial/implementability/risk/sequencing/operational layers on top of synthesis iter 12. Now: APPEND consolidation sections to research/research.md so a maintainer reading it sees the complete picture: original synthesis + audit findings + verdict updates + execution playbook.

Iteration: 20 of 20 (final consolidation)

Focus Area: **FINAL CONSOLIDATION — Amend research.md with iters 13-19 conclusions.** Read research.md + iter-013..019.md. Append (NOT replace) the following NEW sections at the bottom of research.md, before §Citations Index:

1. **§ Iters 13-19 Audit Summary** — One-paragraph rollup per iter (13-19): what it audited, what it found, did it change anything material in the synthesis?
2. **§ Updated RQ5 Verdict (HYBRID-with-Anchor)** — Replace or supersede the original HYBRID-only verdict in §RQ5 with the refined HYBRID-with-Anchor (sentinel sk-small-model skill with enhances edges + pattern index, real patterns stay distributed). Include the rationale from iter 14. Note the original §RQ5 text remains (don't delete) but a "Refined Verdict (iter 14)" subsection takes precedence.
3. **§ Implementation Risk Matrix** — Top 5-10 HIGH-risk artifacts from iter 17 risk audit + their mitigation. Cite iter-017 with line refs.
4. **§ Execution Playbook** — Recommended order from iter 18 sequencing: which packets ship in batch 1, batch 2, etc. Critical path identified.
5. **§ Infrastructure Prerequisites** — From iter 19 operational concerns: what infrastructure changes must ship BEFORE each follow-on packet. Validator updates, advisor re-indexing, memory schema changes.
6. **§ Final Recommendation** — One-page summary the user can read in 90 seconds to decide which packet to start with.

Also update the §Executive Summary section near the top of research.md to reflect:
- The verdict refinement (HYBRID → HYBRID-with-Anchor)
- The audit confirmed (no major issues, see iter 13)
- 12 + 1 (new sentinel) = 13 follow-on packets (if iter 15 recommended a 13th)

DO NOT remove the original synthesis content. Only ADD new sections.

Last 3 Iterations:
- iter 17: risk audit (0.15)
- iter 18: sequencing (0.15)
- iter 19: operational concerns

## STATE FILES

- Read: research/research.md + iter-013..019.md
- Modify (append + update §Executive Summary): research/research.md
- Write iteration narrative: `.../research/iterations/iteration-020.md`
- Write delta: `.../research/deltas/iter-020.jsonl`

## CONSTRAINTS

- LEAF agent. Max 12 tool calls. ~5 actions.
- This is a CONSOLIDATION pass — output is largely DERIVATIVE of iters 13-19. New info ratio should be LOW (0.03-0.10).
- The 6 new sections + Executive Summary update must reference back to specific iter findings (iter-014.md, iter-017.md, etc.).

## OUTPUT CONTRACT (REQUIRED — all 3 artifacts)

1. **research/research.md amendment** — Append 6 new sections (Iters 13-19 Audit Summary, Updated RQ5 Verdict, Implementation Risk Matrix, Execution Playbook, Infrastructure Prerequisites, Final Recommendation) BEFORE the existing §Citations Index. Update §Executive Summary to reflect HYBRID-with-Anchor verdict + 13 follow-on packets (if iter 15 added a 13th).

2. **iteration-020.md** — Brief summary of what was added to research.md (which sections, total LOC added, key references).

3. **state.jsonl APPEND**: `{"type":"iteration","iteration":20,"newInfoRatio":0.05,"status":"complete","focus":"Final consolidation — research.md amendment with iters 13-19","graphEvents":[]}`. Status=complete signals loop done.

4. **deltas/iter-020.jsonl**: one iter record + one observation summarizing the amendment.

## EXECUTION

1. Pre-plan (3 steps):
   a. Read research.md (full) + iter-013..019.md (skim).
   b. Compose the 6 new sections in your head + Executive Summary update.
   c. Write the amendment to research.md (append sections + edit Executive Summary).
2. Execute. Stop after step c.
3. Write iteration-020.md summary + append JSONL + delta.
