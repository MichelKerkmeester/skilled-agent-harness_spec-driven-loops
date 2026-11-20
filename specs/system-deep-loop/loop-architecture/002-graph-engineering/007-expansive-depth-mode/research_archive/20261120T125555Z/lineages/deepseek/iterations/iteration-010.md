# Iteration 10: Q6 — prior art for frontier growth, stuck detection, stop rules and fan-out

## Focus

How do other agentic research and code-review systems handle frontier growth, stuck detection, stop rules and multi-executor fan-out?

## Findings

1. **Anthropic's production research system is the same orchestrator-worker shape, with explicit effort-scaling rules and checkpointed resume.** The lead agent spawns 3-5 subagents in parallel, each with an objective, an output format, tool guidance and task boundaries; effort is scaled by query complexity (simple fact-finding: 1 agent, 3-10 tool calls; direct comparison: 2-4 subagents, 10-15 calls each; complex research: more than 10 subagents). It reports multi-agent runs at about 15× the tokens of a chat, and names synchronous subagent execution as a bottleneck. The concrete transfer: add an effort-scaling table to `research.md` and `review.md` (simple / comparison / complex → lineages × iterations × tool calls), which this runtime lacks; its floors are per-kind, not per-complexity. Value: an operator sizes a run without arithmetic. Effort S. Risk low. [SOURCE: https://www.anthropic.com/engineering/multi-agent-research-system]

2. **LangChain's Open Deep Research exposes per-researcher limits and a published cost table.** Its supervisor-researcher graph caps researcher iterations, runs researchers in parallel, and its README reports total cost and tokens per benchmark run ($45.98 / 58.0M tokens for the default, $187.09 / 138.9M for Claude Sonnet 4). The concrete transfer: put a `budget` block on each lineage (`maxIterations`, `maxToolCalls`, estimated cost) and print it before spawn, so the operator sees the price the way LangChain's table shows it. Value: makes cost a first-class parameter instead of a post-hoc surprise. Effort S/M. Risk low. [SOURCE: https://github.com/langchain-ai/open_deep_research]

3. **Tree of Thoughts makes search explicit: generate candidates, self-evaluate, then expand or backtrack.** ToT's contribution is deliberate search over coherent thoughts with evaluation and backtracking, not a fixed left-to-right chain. This runtime's frontier grows by structural admission only (relevance, dedupe, depth, fan-out, budget, cycle) and its focus order is shallowest → least visited → oldest; neither step scores expected value. The concrete transfer: add an optional `priority` (or `expectedValue`) field to `frontier_proposal` and rank focus by it after depth, so a high-value child is not queued behind an older low-value one. Value: growth follows value, not arrival order. Effort M. Risk medium (a model-authored priority must not be trusted over the caps). [SOURCE: https://arxiv.org/abs/2305.10601]

4. **STORM gets breadth from distinct perspectives, not from more questions in one voice.** STORM discovers diverse perspectives and simulates writers who pose questions from each, then curates an outline; its evaluation attributes coverage gains to that multi-perspective asking. This runtime's seed asks for 3-6 sub-questions that "together cover the topic", with no perspective requirement and a text-based dedupe key. The concrete transfer: require each seed question to name a distinct perspective or role and dedupe on that perspective, which also gives the proposal admission a semantic axis that plain text comparison lacks. Value: less near-duplicate seeding, broader first-pass coverage. Effort S. Risk low. [SOURCE: https://arxiv.org/abs/2402.14207]

## Ruled Out

- Copying Anthropic's synchronous lead-agent loop: this runtime already has the fan-out pool and per-lineage state, so the transferable part is the effort-scaling table and the checkpoint/resume discipline, not the topology.
- Adopting a full MCTS search (LATS-style) for the frontier: the measured runs are 10-24 iterations, too shallow for tree search to pay for its branching overhead; a priority field is the cheap 80%.

## Dead Ends

- Looking for a published stuck-detection rule in these systems: Anthropic handles failure with retries and checkpoints, LangChain with iteration caps, ToT with evaluation; none publishes a per-node stuck counter, so this runtime's per-node counter is ahead of the public prior art and should be kept.

## Edge Cases

- Ambiguous input: "frontier growth" could mean breadth (more depth-1 nodes) or depth (children). Both are covered: STORM for breadth, ToT for depth ordering.
- Contradictory evidence: none.
- Missing dependencies: no access to the systems' internal code; the public engineering write-ups and papers are the evidence.
- Partial success: none.

## Sources Consulted

- https://www.anthropic.com/engineering/multi-agent-research-system
- https://github.com/langchain-ai/open_deep_research
- https://arxiv.org/abs/2305.10601
- https://arxiv.org/abs/2402.14207

## Assessment

- New information ratio: 1.0
- Questions addressed: Q6 prior art
- Questions answered: Q6: four transferable practices (effort-scaling table, per-lineage budget/cost, proposal priority, perspective-based seeding).

## Reflection

- What worked and why: reading the production write-up beside this runtime's own seed and admission rules made the missing effort-scaling table obvious.
- What did not work and why: searching for a published per-node stuck rule found none; the local per-node counter is already the stronger design.
- What I would do differently: fetch the systems' configuration docs, not only their READMEs, if a future pass needs exact parameter names.

## Recommended Next Focus

Synthesis: rank the recommendations by value over effort, merge duplicates, and state the one change that buys the most for the least.
