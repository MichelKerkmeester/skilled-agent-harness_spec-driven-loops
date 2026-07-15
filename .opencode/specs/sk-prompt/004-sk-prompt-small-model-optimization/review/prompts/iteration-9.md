DEEP-REVIEW

# Deep-Review Iteration Prompt Pack — iter 9 of 20

## STATE

state_summary: 4 dims covered, 2 P1 (sec-deny-precedence, sec-abs-path) confirmed, 10 P2 advisory. Iter 9: cross-cutting integration — sentinel HYBRID-with-Anchor architecture compliance + advisor wiring.

Review Iteration: 9 of 20
Mode: review
Dimension: **integration** (cross-cutting)
Review Target: sk-prompt/004-sk-prompt-small-model-optimization
Running findings: P0=0, P1=2, P2=10

## ITERATION 9 FOCUS — SENTINEL + ADVISOR INTEGRATION

### Check 1: HYBRID-with-Anchor compliance

Read `001-research-smallcode/research/research.md` §7 (or wherever the HYBRID-with-Anchor architecture verdict is detailed). Identify the specification: what must the sentinel SKILL.md contain? What's the distributed pattern (pattern-index.md pointing to canonical refs in cli-devin/, cli-opencode/, sk-prompt/)?

Then read `.opencode/skills/sk-small-model/SKILL.md` end-to-end. Verify:
- It functions as an ANCHOR (thin, routing-focused, no deep prose duplicated from references)
- Trigger phrases in `description.json` cover the small-model dispatch use cases
- pattern-index.md table lists pointers to the 3 canonical references (cli-devin context-budget, cli-devin output-verification, cli-devin quota-fallback / cli-opencode permissions-matrix, sk-prompt model-profiles)

Flag P2 if SKILL.md duplicates pattern content from references (the anchor should be thin).

### Check 2: enhances-edge wiring

Read `.opencode/skills/sk-small-model/graph-metadata.json`. Verify the `enhances` edges:
- Target `cli-devin` with weight ≥ 0.4 (research mentioned 0.4-0.5)
- Target `cli-opencode` with weight ≥ 0.4
- Both edges should declare the relationship (small-model knowledge enhances small-model executor skills)

### Check 3: pattern-index.md cross-reference resolution

Read `.opencode/skills/sk-small-model/references/pattern-index.md`. For every row in the table that points to a file path, verify the file exists. Use Bash `ls` to batch-check.

Expected entries should point to:
- `cli-devin/references/context-budget.md`
- `cli-devin/references/output-verification.md`
- `cli-devin/references/quota-fallback.md`
- `cli-opencode/references/permissions-matrix.md`
- `cli-opencode/references/context-budget.md`
- `sk-prompt/references/model-profiles.md`

Flag P1 if any path is broken; P2 if missing rows for known patterns.

### Check 4: Advisor lane-scorer reasoning smoke

Read `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts` (or wherever the 5-lane scorer lives) — specifically the explicit_author, lexical, derived_generated, semantic_shadow, graph_causal lanes. Check if sk-small-model's `description.json` trigger_phrases would match a typical small-model dispatch prompt like "dispatch SWE-1.6 with context budget" or "cli-opencode deepseek with permissions matrix".

This is a reasoning check, not a runtime test — just trace mentally whether the description.json keywords would surface in the lexical lane.

### Check 5: Reverse cross-reference — do consumers cite the sentinel?

For each canonical reference doc (context-budget, output-verification, quota-fallback, permissions-matrix, model-profiles), grep for `sk-small-model` or `pattern-index`. The canonical refs SHOULD know they're part of the sentinel pattern. If they don't reference back, that's a P2.

## STATE FILES

- Write iteration narrative to: `.opencode/specs/sk-prompt/004-sk-prompt-small-model-optimization/review/iterations/iteration-009.md`
- Write per-iteration delta file to: `.opencode/specs/sk-prompt/004-sk-prompt-small-model-optimization/review/deltas/iter-009.jsonl`
- State Log: `.opencode/specs/sk-prompt/004-sk-prompt-small-model-optimization/review/deep-review-state.jsonl`

## CONSTRAINTS

- LEAF agent. Soft max 12, hard max 13 tool calls.
- Read-only.
- ALLOWED WRITE PATHS: iter md, state.jsonl, delta jsonl (this iter only).
- Use absolute paths.

## OUTPUT CONTRACT

1. **iteration-009.md** — Per-check sections + findings + verdict + next focus.
2. **state.jsonl APPEND** — single line with new findings counts.
3. **deltas/iter-009.jsonl** — multi-line.

## EXECUTION

1. sequential_thinking 5+ thoughts.
2. Read research.md §HYBRID, sk-small-model SKILL.md, graph-metadata.json.
3. Read pattern-index.md + Bash ls on referenced paths.
4. Read fusion.ts for advisor scorer.
5. Grep canonical refs for sk-small-model mentions.
6. Compose iter + delta + state. Stop.
