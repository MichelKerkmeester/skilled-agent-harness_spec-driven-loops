# RCAF DEEP RESEARCH — ITERATION 5 — adversarial sweep on deep-agent-improvement artifacts

## ROLE
Adversarial reviewer. Probe deep-agent-improvement's actual code + docs + asset templates for hidden defects. P0/P1/P2 with file:line evidence.

## CONTEXT

Iter 5 of 10. Prior:
- Iter-1..3: cataloged 36 patterns; 8 APPLY + 4 ALREADY-DONE-confirmed
- Iter-4: 7 DAI-specific gaps (DAI-001..007)

Cumulative actionable: ~13-15 items pending adversarial sweep + adjudication.

This iter focuses on **adversarial review of actual deep-agent-improvement code/docs** to find defects iters 1-4's mapping/gap surveys wouldn't catch.

## ACTION

**Step 1: Adversarial code review**

Sample 3-4 of:
- `.opencode/skills/deep-agent-improvement/scripts/*.cjs` (or `.ts`) — read end-to-end
- Look for: off-by-one in iteration counters, race conditions, missing error handling, stale path refs, broken JSONL parsing
- 5-dim scoring logic: is each dimension's score reproducible from inputs? Any silent NaN/null fallbacks?
- Promotion gate logic: is the gate value parameterized? Hardcoded? Drifted from docs?

**Step 2: Adversarial docs review**

Read end-to-end:
- `.opencode/skills/deep-agent-improvement/SKILL.md` (look for stale tool refs from arc 118 — any `mcp__mk_spec_memory__deep_loop_graph_*` survivors?)
- `.opencode/skills/deep-agent-improvement/changelog/` (latest entry — factual accuracy)
- `.opencode/skills/deep-agent-improvement/README.md` — does it reference deep-loop-runtime? Should it?

**Step 3: Adversarial YAML review (if exists)**

Find any `improve_agent` or `deep-agent-improvement` related YAML at:
- `.opencode/commands/deep/*.{md,yaml}`
- `.opencode/commands/speckit/assets/*.yaml`

For each YAML:
- After 118's MCP→script cutover, are bash invocations correct?
- Output bindings correctly mapped?

**Step 4: Adversarial test review**

If deep-agent-improvement has tests under `tests/`:
- Coverage of 5-dim scoring edge cases?
- Tests of guarded-promotion threshold boundary?
- Multi-runtime A/B test coverage (Claude vs Codex vs Gemini)?

**Step 5: Write findings (DAI-008+) + delta JSONL**

`.../iterations/iteration-005.md` + `.../deltas/iter-005.jsonl`.

After both:
`ITER-5 DONE: <P0>/<P1>/<P2>, dimensions=adversarial-on-DAI`
