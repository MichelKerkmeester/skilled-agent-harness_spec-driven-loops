# RCAF DEEP RESEARCH — ITERATION 5 — adversarial sweep on deep-research artifacts

## ROLE
Adversarial reviewer. Probe deep-research's actual code + docs for hidden defects. P0/P1/P2 with file:line evidence.

## CONTEXT

Iter 5 of 10. Prior:
- Iter-1..3: cataloged 47 changes from 118; 27 ALREADY-DONE confirmed; 10 uplift candidates from 118 apply path
- Iter-4: 5 deep-research-specific gaps (DR-001..005)

Cumulative uplift candidates: **15** (10 from 118 mapping + 5 deep-research-specific).

This iter is an **adversarial pass on the actual deep-research code/docs/artifacts** to surface defects that wouldn't have been caught by iter-1..4's mapping/gap surveys.

## ACTION

**Step 1: Adversarial code review**

Sample deep-research-specific code:
- `.opencode/skills/deep-research/scripts/reduce-state.cjs` — read end-to-end; look for:
  - Off-by-one errors in iteration counters
  - Stale state-key references
  - Race conditions in state mutation
  - Missing error handling
- `.opencode/skills/deep-research/assets/*.yaml` configs — check schema validity
- `.opencode/skills/deep-research/assets/prompt_pack_iteration.md.tmpl` — verify all placeholders match the renderer

Find at least 2 real defects (not just style/cosmetic).

**Step 2: Adversarial docs review**

- `.opencode/skills/deep-research/SKILL.md` (v1.12.0.0) — read body; look for stale claims (e.g. references to `mcp__mk_spec_memory__deep_loop_graph_*` tools that were removed in 118)
- `.opencode/skills/deep-research/changelog/v1.12.0.0.md` (just-shipped) — verify factual accuracy against actual arc 118 changes
- `.opencode/skills/deep-research/README.md` — does it reference deep-loop-runtime?
- Any inconsistency between SKILL.md trigger phrases and actual usage patterns?

**Step 3: Adversarial YAML review**

`.opencode/commands/spec_kit/assets/spec_kit_deep-research_auto.yaml` + `_confirm.yaml`:
- After 118's MCP→script cutover, are all bash invocations correct?
- Are output bindings still mapped correctly?
- Any orphaned/dead steps that referenced removed tools?

**Step 4: Adversarial test review**

If deep-research has tests under `.opencode/skills/deep-research/tests/` or referenced from `mcp_server/tests/`, audit:
- Coverage of research-specific paths (claim adjudication, single-dimension enforcement)
- Test isolation (no shared state between test runs)
- Fixture realism (use recent research packets as references)

**Step 5: Write findings (DR-006+) + delta JSONL**

`.../iterations/iteration-005.md` + `.../deltas/iter-005.jsonl`. Same format as iter-4.

After both files:
`ITER-5 DONE: <P0>/<P1>/<P2>, dimensions=adversarial-on-deep-research`
