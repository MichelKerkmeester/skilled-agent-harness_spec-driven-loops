DEEP-RESEARCH

# Deep-Research Iteration Prompt Pack — iter 17 of 20 (RISK AUDIT)

## STATE

state_summary: Iter 17 of 20. Audit/adversarial passes 13-16 completed. Now: per-artifact risk audit focused on POST-IMPLEMENTATION failure modes (what goes wrong AFTER the delta lands in production).

Iteration: 17 of 20

Focus Area: **RISK AUDIT — Post-implementation failure modes.** For each P0/P1 artifact (focus 10-15 most-impactful), assess:
- Worst-case failure mode AFTER implementation (e.g. "context-budget eviction silently drops critical system prompt context, model produces wrong output without warning")
- Detection latency (how fast does the failure become visible? immediate exception, next iter, only on user feedback, silent forever)
- Blast radius (single-user / single-session / single-skill / cross-skill / repo-wide)
- Existing mitigations available (memory rules, validator checks, sk-code patterns)
- New mitigations recommended (CI checks, schema validation, monitoring hooks)

Cross-cutting concerns:
- Does the HYBRID-with-Anchor sentinel skill introduce new failure modes (e.g. stale pattern-index when actual patterns move)?
- Does the permissions-matrix schema have any escape hatch that could re-enable RM-8 class incidents?
- Does the model-profile registry create a SPOF for cli-* skills if the registry has a typo?

Last 3 Iterations:
- iter 14: HYBRID-with-Anchor verdict (0.18)
- iter 15: priority audit (0.18)
- iter 16: implementability review

## STATE FILES

- Read: `research/research.md` + iter-013/014/015/016 audit findings
- Cross-ref: `cli-opencode/references/destructive_scope_violations.md` (RM-8 lessons), `cli-devin/SKILL.md` ALWAYS rules
- Write iteration narrative: `.../research/iterations/iteration-017.md`
- Write delta: `.../research/deltas/iter-017.jsonl`

## CONSTRAINTS

- LEAF agent. Max 12 tool calls. 3-5 actions.
- Be paranoid but realistic — flag low-probability HIGH-impact failures explicitly; don't manufacture them.

## SOURCE BOUNDARIES

- Primary: research.md + iter-016 implementability table
- Cross-ref: RM-8 incident doc for failure-pattern precedent

## OUTPUT CONTRACT

1. **iteration-017.md** — Per-artifact risk audit table:

   | Artifact | Worst-case Failure | Detection Latency | Blast Radius | Existing Mitigations | New Mitigations | Risk Score (1-10) |
   |---|---|---|---|---|---|---|

   + Cross-cutting concerns (sentinel skill staleness, permissions-matrix escape hatches, model-profile SPOF)
   + Recommended pre-implementation checks (CI validators, schema lints, monitoring hooks)

2. **state.jsonl APPEND**: `{"type":"iteration","iteration":17,"newInfoRatio":<0..1>,"status":"insight","focus":"Risk audit — post-implementation failure modes","graphEvents":[]}`. Ratio 0.10-0.25.

3. **deltas/iter-017.jsonl**: one iter record + one finding per risk-score ≥ 7 artifact.

## EXECUTION

1. Pre-plan (3 steps):
   a. Read research.md + iter-016 implementability table.
   b. For each P0/P1 artifact: identify worst-case post-impl failure + detection latency + blast radius.
   c. Compile risk audit table + cross-cutting concerns + mitigations.
2. Execute. Stop after step c.
3. Append JSONL + delta.
