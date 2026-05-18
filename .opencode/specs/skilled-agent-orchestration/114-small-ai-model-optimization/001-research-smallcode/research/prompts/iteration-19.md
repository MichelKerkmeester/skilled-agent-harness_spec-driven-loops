DEEP-RESEARCH

# Deep-Research Iteration Prompt Pack — iter 19 of 20 (OPERATIONAL CONCERNS)

## STATE

state_summary: Iter 19 of 20. Audit/adversarial passes 13-18 completed. Now: operational impact assessment — what infrastructure (validators, indexing, hooks, CI) needs updating to accommodate the 41 artifacts + HYBRID-with-Anchor sentinel skill.

Iteration: 19 of 20

Focus Area: **OPERATIONAL CONCERNS — Infrastructure impact assessment.** For the 12 follow-on packets + sentinel skill, identify infrastructure-level changes needed:
- **Spec-kit validator** (`system-spec-kit/scripts/spec/validate.sh` + `mcp_server/lib/validation/`): any new validation rules needed? E.g. permissions-matrix.schema.json conformance check? sk-small-model sentinel structure check?
- **Memory indexing** (`system-spec-kit/scripts/dist/memory/generate-context.js` + `mcp_server/lib/memory/`): any new memory categories? Cross-skill memory linking changes?
- **Skill-advisor** (`system-skill-advisor/mcp_server/lib/scorer/`): does the addition of sk-small-model + new enhances edges require advisor re-indexing? Threshold tuning? New keywords in the lexical lane?
- **Code-graph** (`system-code-graph/`): does the cross-skill enhances structure need representation? New node types?
- **CI checks**: does GitHub Actions or pre-commit need new validators (e.g. permissions-matrix schema check, sk-small-model sentinel-only constraint)?
- **AGENTS.md hook**: does the new "Small-model dispatch rule" need a parsing entry in CLAUDE.md / OpenCode hooks?

Output: per-system change list with effort estimates + sequencing constraints (e.g. "validator update must ship before 010-permissions-matrix packet").

Last 3 Iterations:
- iter 16: implementability (0.15)
- iter 17: risk audit (0.15)
- iter 18: sequencing

## STATE FILES

- Read: research.md + iters 14-18 (verdict, priorities, implementability, risks, sequencing)
- Cross-ref: `.opencode/skills/system-spec-kit/` (validator + indexing surfaces), `.opencode/skills/system-skill-advisor/` (advisor surfaces), `.opencode/skills/system-code-graph/` (graph surfaces)
- Write iteration narrative: `.../research/iterations/iteration-019.md`
- Write delta: `.../research/deltas/iter-019.jsonl`

## CONSTRAINTS

- LEAF agent. Max 12 tool calls. 3-5 actions.
- Focus on infrastructure-LEVEL changes; per-skill content changes are already in the 12 packet list.
- Flag any infrastructure change that is a PREREQUISITE for a follow-on packet (e.g. "012-rq5-cross-cutting can't ship until advisor re-indexing is in place").

## SOURCE BOUNDARIES

- Primary: research.md §RQ5 cross-cutting + iter-018 sequencing
- Cross-ref: relevant infrastructure SKILL.md files for current capability surface

## OUTPUT CONTRACT

1. **iteration-019.md** — Operational impact table:

   | Infrastructure System | Required Change | Effort | Sequencing Constraint | Risk |
   |---|---|---|---|---|

   + Cross-system dependency notes (e.g. "advisor re-indexing depends on graph-metadata.json updates from packet 012")
   + Pre-implementation infrastructure prerequisite list

2. **state.jsonl APPEND**: `{"type":"iteration","iteration":19,"newInfoRatio":<0..1>,"status":"insight","focus":"Operational — infrastructure impact of 12 packets","graphEvents":[]}`. Ratio 0.10-0.20.

3. **deltas/iter-019.jsonl**: one iter record + one finding per infrastructure prerequisite.

## EXECUTION

1. Pre-plan (3 steps):
   a. Read research.md §RQ5 cross-cutting + iter-018 sequencing.
   b. Survey infrastructure surfaces (system-spec-kit validator + memory, system-skill-advisor scorer, system-code-graph).
   c. Compile operational impact table + dependency notes + prerequisite list.
2. Execute. Stop after step c.
3. Append JSONL + delta.
