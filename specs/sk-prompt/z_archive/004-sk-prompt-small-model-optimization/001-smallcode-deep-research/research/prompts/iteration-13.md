DEEP-RESEARCH

# Deep-Research Iteration Prompt Pack — iter 13 of 20 (SELF-AUDIT)

## STATE

state_summary: Iter 13 of 20 (post-convergence). Convergence fired iter 11 (all_questions_answered, 5/5 resolved, 389 keyFindings). Synthesis iter 12 produced research/research.md (1009 lines, HYBRID verdict). User-requested all 20 iters → 8 more audit/adversarial passes (iters 13-20).

Iteration: 13 of 20

Focus Area: **SELF-AUDIT — Read research/research.md against iters 1-11, flag inaccuracies, duplicates, hand-waving, or omitted findings.** This is a sober quality audit, not adversarial argument. Output is a P0/P1/P2 issue list against research.md. Flag specifically:
- Patterns claimed in research.md that don't trace to an actual iter finding
- Iter findings that DIDN'T make it into research.md (overlooked deltas)
- Inconsistencies between per-RQ section claims and the §Follow-on Packets Index priority/scope
- Acceptance criteria that aren't executable (vague "ensure X works" without measurable signal)
- Citations in research.md §Citations Index that don't appear in the body (or vice versa)
- Confidence tags missing or hand-waved

Outcome: P0 issues require research.md amendment now; P1 issues recommended; P2 noted but not blocking.

Last 3 Iterations:
- iter 10: cross-cutting AGENTS.md (0.25 insight)
- iter 11: gap audit (0.15 exhausted, Outcome B coverage confirmed)
- iter 12: SYNTHESIS research.md (0.05 complete, 1009 lines)

## STATE FILES

- Read inputs: `.opencode/specs/.../research/research.md` (1009 lines) + spot-check iter-001..011.md
- Write iteration narrative: `.opencode/specs/.../research/iterations/iteration-013.md`
- Write per-iteration delta: `.opencode/specs/.../research/deltas/iter-013.jsonl`
- State Log: `.opencode/specs/.../research/deep-research-state.jsonl`

## CONSTRAINTS

- LEAF agent. Max 12 tool calls. 3-5 actions.
- Already-shipped 113 items: DO NOT re-propose.
- Be honest: if research.md is high-quality with no material issues, report so with ratio 0.03-0.10. If significant issues surface, ratio 0.15-0.30.

## SOURCE BOUNDARIES

- Primary: `research/research.md` (full read)
- Cross-reference: iter-001..011.md (spot-check claimed findings)
- Optional: preflight context-card.md (any pattern in preflight not in iters or research.md)

## OUTPUT CONTRACT (REQUIRED — all 3 artifacts)

1. **iteration-013.md** — Audit findings table:

   | Issue ID | Severity (P0/P1/P2) | Location in research.md | Type (inaccuracy/duplicate/omission/inconsistency/hand-waving) | Description | Recommended fix |
   |---|---|---|---|---|---|

   + Summary paragraph + recommendation (research.md amendment list OR confirm acceptable as-is).

2. **state.jsonl APPEND**: `{"type":"iteration","iteration":13,"newInfoRatio":<0..1>,"status":"<insight|exhausted>","focus":"Self-audit — research.md quality review","graphEvents":[]}`. Ratio 0.03-0.30 depending on issue count.

3. **deltas/iter-013.jsonl**: one iter record + one finding per P0/P1 issue.

## EXECUTION

1. Pre-plan (3 steps):
   a. Read research.md end-to-end.
   b. Spot-check 5-8 random claimed patterns against the originating iter md.
   c. Author audit table + summary verdict.
2. Execute. Stop at step c.
3. Append JSONL + delta.
