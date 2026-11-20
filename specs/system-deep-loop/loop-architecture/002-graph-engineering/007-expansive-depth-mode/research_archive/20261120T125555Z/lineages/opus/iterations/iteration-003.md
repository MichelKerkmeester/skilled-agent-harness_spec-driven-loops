# Iteration 3: Prior art on frontier growth, stuck detection, stop rules and multi-executor fan-out

## Focus
Frontier node F-1-005 (depth 1, scope web sources on agentic deep-research and code-review systems, compared against .skilled/skills/system-deep-loop): Prior art: how do other agentic research and code-review systems handle frontier growth, stuck detection, stop rules and multi-executor fan-out, and which of their ideas would simplify or harden this program? Cite source URLs.

## Actions Taken
1. Seven web searches covering:
   - recursive deep-research trees (dzhng/deep-research, GPT Researcher, Static-DRA)
   - STORM/Co-STORM
   - Anthropic's multi-agent research system
   - the LangGraph recursion limit
   - the OpenHands stuck detector
   - mini-swe-agent limits (no usable result)
   - Inspect AI eval sets
2. Fetched the Anthropic engineering post with `curl` and extracted the passages on synchronous execution and resume.
3. No personal data went into any query.

## Findings
1. **Frontier growth elsewhere is two scalars, not admission checks.**
   - **dzhng/deep-research:** the reference implementation, under 500 lines, recurses on `breadth` and `depth` with no per-proposal admission [SOURCE: https://github.com/jamisonl/deep-research] [SOURCE: https://docsearch.algolia.com/mcp/docs/repo/dzhng/deep-research].
   - **GPT Researcher:** halves breadth per level with a floor of 2 and decrements depth, at defaults breadth 4, depth 2, concurrency 4 [SOURCE: https://docs.gptr.dev/docs/gpt-researcher/gptr/deep_research] [SOURCE: https://docs.gptr.dev/blog/2025/02/26/deep-research].
   - **Static-DRA:** a node at the depth limit is researched directly rather than split [SOURCE: https://arxiv.org/html/2512.03887v2].
   - **This program, by contrast:**
     - six ordered checks (`frontier-admit.cjs:732-804`)
     - per-node and run-wide caps
     - a 50/35/15 band split whose projection closes nodes `exhausted:budget` (`frontier-admit.cjs:360-396`)
   - That projection-time close is the mechanism D-011-10 had to work around.
   - **Change to evaluate, not adopt blindly:** replace the band split with a geometric child cap, `maxChildren(depth) = max(2, ceil(maxChildrenPerNode / 2^(depth-1)))`, enforced at admission. Then the tree is shaped before growth, and no node is closed retroactively for budget.
   - Keep relevance, dedupe and cycle, which the scalar systems lack and which matter for a model-proposed tree.
   - Value M, effort M, risk medium: the band budget is wired into both reducers and the stop veto.
   [INFERENCE: based on the cited breadth-halving designs and frontier-admit.cjs:360-396]
2. **Stuck detection elsewhere keys on observable repetition, not a self-reported ratio.**
   - **OpenHands:** its stuck detector is on by default. It fires on:
     - the same action producing the same observation 4+ times
     - an action-observation ping-pong over 6+ cycles
     - repeated errors
     - agent monologues
   - Its thresholds are hard-coded, which an open issue asks to make configurable [SOURCE: https://docs.openhands.dev/sdk/guides/agent-stuck-detector] [SOURCE: https://github.com/OpenHands/software-agent-sdk/issues/762].
   - **This program:** research stuck counting uses the leaf's own `newInfoRatio < convergenceThreshold` (`convergence.cjs:1460-1465`). A model that inflates its ratio is therefore never stuck.
   - **Change:** in `deriveLoopCounters`, treat a node-bound pass as no-progress also when its `sourcesQueried` set and its finding ids repeat the previous pass on that node, whatever ratio it reported.
   - Value M (hardening against ratio inflation), effort S, risk low.
   [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:1460] [SOURCE: https://docs.openhands.dev/sdk/guides/agent-stuck-detector]
3. **Prior art confirms the hard cap as a pure safety cap, separate from the real exit.**
   - **LangGraph:** `recursion_limit` (default 25) raises `GraphRecursionError` and is documented as a guard against non-terminating loops. Termination belongs in the routing logic [SOURCE: https://langchain-ai.github.io/langgraph/how-tos/recursion-limit] [SOURCE: https://python.langchain.com/docs/troubleshooting/errors/GRAPH_RECURSION_LIMIT].
   - **This program:** it already orders `maxIterationsReached` first and lets it bypass every veto (deep-research.yaml:1264, convergence order step 1). That matches the prior art, so no change is needed.
   - **Anthropic:** it embeds effort-scaling rules in the prompt, because agents misjudge effort [SOURCE: https://www.anthropic.com/engineering/multi-agent-research-system]. The rules: 1 agent and 3-10 calls for fact-finding, 2-4 subagents and 10-15 calls each for comparisons, 10+ for complex research.
   - That supports keeping the expansive budget a deterministic function of the seed, as `frontier-admit.cjs budget` does, rather than a model choice.
   [SOURCE: .skilled/commands/deep/assets/deep-research.yaml:1264]
4. **Multi-executor reruns elsewhere are idempotent per output directory.**
   - **Inspect AI:** re-running `eval_set` on the same log directory is a no-op once every task is done. `eval_retry` resumes interrupted tasks and keeps completed samples. Retries are automatic with a configurable count [SOURCE: https://inspect.aisi.org.uk/eval-sets.html] [SOURCE: https://inspect.aisi.org.uk/reference/inspect_eval-retry.html] [SOURCE: https://hawk.metr.org/user-guide/eval-set-config-reference/].
   - This is the design iteration 2 derived for fan-out: classify each lineage directory before spawn and skip the complete ones.
   - **Change:** make `fanout-run.cjs` re-entrant on the same `lineages/` directory:
     - complete lineages are skipped
     - failed or partial ones resume under their stored session id (`fanout-run.cjs:763-778` already keeps it for non-complete configs)
     - merge runs over the union
   - Value H, effort S-M, risk low.
   [SOURCE: https://inspect.aisi.org.uk/eval-sets.html] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:763]
5. **Anthropic's lessons on cost and failure map onto three existing choices: two are confirmed and one is open.** The post reports:
   - multi-agent runs cost about 15× the tokens of chat
   - a synchronous lead waiting on each subagent wave is a bottleneck
   - restarting from the beginning after an error is "expensive and frustrating", so they resume from the failure point
   - vague subagent briefs cause duplicated searches [SOURCE: https://www.anthropic.com/engineering/multi-agent-research-system]

   How each lands here:
   - Disjoint depth-1 nodes dealt per lineage (`frontier_scope`) are the right division of labor. Confirmed.
   - Resume from the stored session is right. Confirmed.
   - The open gap is that each lineage re-reads and re-executes the 2.4k-line workflow YAML at init, transcribing inline programs. This lineage spent its first several turns on that. Moving those programs into scripts (iteration 1, Finding 7) is the cost lever this prior art points at.
   - Value H, effort M.
   [INFERENCE: based on the Anthropic post and this lineage's own init transcript]
6. **Co-STORM offers no automatic stop rule to borrow.** Its session ends when the user asks for the report, and its dynamic hierarchical mind map is shared state comparable to the frontier node store [SOURCE: https://raw.githubusercontent.com/stanford-oval/storm/HEAD/README.md] [SOURCE: https://arxiv.org/pdf/2408.15232v1.pdf]. Recorded as ruled out for stop-rule prior art.

## Questions Answered
- F-1-005: prior art on all four axes, with three adoptable changes (Findings 2, 4 and 5) and one candidate to evaluate (Finding 1).

## Questions Remaining
- F-1-001 part B.

## Ruled Out
- Co-STORM as a source of stop rules (user-terminated).
- mini-swe-agent limits: the search returned no primary source.

## Dead Ends
- The mini-swe-agent `step_limit` and `cost_limit` search returned no mini-swe-agent docs.

## Edge Cases
- Ambiguous input: none.
- Contradictory evidence: GPT Researcher's docs disagree on the breadth default (4 versus 3). Not load-bearing here.
- Missing dependencies: none.
- Partial success: the mini-swe-agent search failed. Other sources covered the same axis.

## Sources Consulted
- https://github.com/jamisonl/deep-research
- https://docsearch.algolia.com/mcp/docs/repo/dzhng/deep-research
- https://docs.gptr.dev/docs/gpt-researcher/gptr/deep_research
- https://docs.gptr.dev/blog/2025/02/26/deep-research
- https://arxiv.org/html/2512.03887v2
- https://docs.openhands.dev/sdk/guides/agent-stuck-detector
- https://github.com/OpenHands/software-agent-sdk/issues/762
- https://langchain-ai.github.io/langgraph/how-tos/recursion-limit
- https://python.langchain.com/docs/troubleshooting/errors/GRAPH_RECURSION_LIMIT
- https://www.anthropic.com/engineering/multi-agent-research-system
- https://inspect.aisi.org.uk/eval-sets.html
- https://inspect.aisi.org.uk/reference/inspect_eval-retry.html
- https://hawk.metr.org/user-guide/eval-set-config-reference/
- https://raw.githubusercontent.com/stanford-oval/storm/HEAD/README.md
- https://arxiv.org/pdf/2408.15232v1.pdf
- .skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs:360-396, 732-804
- .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:1460-1465
- .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:763-778

## Assessment
- New information ratio: 0.75
- Questions addressed: F-1-005
- Questions answered: F-1-005

## Reflection
- What worked and why: searching for named systems rather than generic terms returned primary docs (OpenHands, Inspect, Anthropic).
- What did not work and why: the generic limits search for mini-swe-agent drifted to unrelated crates.
- What I would do differently: fetch the OpenHands `stuck_detector.py` source to cite exact thresholds rather than the docs page.

## Recommended Next Focus
F-1-001 part B:
- the fanout-run.cjs adapter table and synthesis-name tolerance
- the size of convergence.cjs
- the YAML confirm and dry-run scaffolding
