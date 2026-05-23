# Iteration 5: Q5 skill advisor routing

## Focus

Answer Q5: decide whether the Skill Advisor should include `multi-ai-council` token or phrase boosts, or whether direct agent dispatch remains sufficient.

## Actions Taken

- Confirmed iteration number from `deep-research-state.jsonl`; four prior iteration records make this iteration 5.
- Read the strategy, findings registry, and iteration 4 narrative to preserve the Q1-Q4 decisions and follow §11 Next Focus.
- Searched the Skill Advisor corpus and scorer paths for `multi-ai-council`, `multi ai council`, and `council`.
- Inspected the Skill Advisor runtime discovery path, explicit scorer boosts, orchestrator agent-routing table, and the `multi-ai-council` agent body.
- Ran the advisor directly against a council prompt: `python3 .opencode/skills/system-spec-kit/mcp_server/skill_advisor/scripts/skill_advisor.py "Use multi-ai-council to produce a planning council for this architecture decision" --threshold 0.8`, which returned `[]`.

## Findings

### 1. Skill Advisor discovery is skill-first, not agent-first

The Python compatibility path discovers `SKILL.md` files under the top-level skill directory at `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/scripts/skill_advisor_runtime.py:153` and builds records with `kind: "skill"` and `source: "skill"` at `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/scripts/skill_advisor_runtime.py:191`.

That means `multi-ai-council` is outside the normal advisor corpus because it is an agent definition, not a `SKILL.md` file. Its frontmatter lives in `.opencode/agents/multi-ai-council.md:1`, and the agent declares a planning-only role at `.opencode/agents/multi-ai-council.md:27`.

### 2. The explicit scorer has no council lane today, and adding one would target the wrong kind of entity

The explicit scorer's hard-coded token boosts are skill IDs such as `sk-code-review`, `sk-git`, `system-spec-kit`, and `mcp-chrome-devtools` at `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/lib/scorer/lanes/explicit.ts:8`. Its phrase boosts similarly map command or domain phrases to skills or skill commands, including `/speckit:deep-research`, `/speckit:deep-review`, and `/memory:save` at `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/lib/scorer/lanes/explicit.ts:90`.

There is no existing phrase or token boost for `multi-ai-council`, `council`, or `planning council`. A direct `rg` over the advisor graph, scorer fixtures, and routing corpus found no `multi-ai-council` or `council` entries. The live advisor invocation for a clear council prompt returned no recommendation, which is consistent with the current architecture.

Adding a boost from `council` to `multi-ai-council` would blur the advisor contract: the returned object would look like a skill recommendation, but the actionable target is an agent. Adding a boost from `council` to `system-spec-kit` would be safer mechanically, but too noisy: council runs are planning agents, not necessarily spec-kit command workflows.

### 3. Direct dispatch already has a stronger routing home

The orchestrator's agent table explicitly routes "Multi-strategy planning and architecture synthesis" to `@multi-ai-council` at `.opencode/agents/orchestrate.md:97`. The same table marks it LEAF alongside `@context`, `@code`, `@create`, `@review`, `@debug`, `@deep-research`, and `@deep-review` at `.opencode/agents/orchestrate.md:112`.

The agent body also owns the relevant runtime behavior directly: Depth 0 can dispatch distinct council seats, while Depth 1 uses `sequential_thinking` inline without sub-dispatch at `.opencode/agents/multi-ai-council.md:37`. Its output protocol is likewise agent-owned, with `ai-council/` artifact requirements at `.opencode/agents/multi-ai-council.md:579`.

This makes the clean boundary: Skill Advisor routes skills and skill-owned commands; orchestrator/direct user dispatch routes agents. `multi-ai-council` should not be smuggled into Skill Advisor as a pseudo-skill while ADR-001 keeps it out of `.opencode/skills/`.

### 4. The landable follow-on is a guardrail test, not a boost

Packet 081 should avoid adding `TOKEN_BOOSTS.council` or `PHRASE_BOOSTS["multi-ai-council"]` unless the advisor grows a first-class agent recommendation surface.

The useful work is a small routing regression fixture:

- A prompt like "Use multi-ai-council to produce a planning council for this architecture decision" should either abstain from skill routing or return only a low-confidence note that direct agent dispatch is required, depending on the available advisor API.
- A prompt like "implement the multi-ai-council persistence helper" should still route to `sk-code` / `system-spec-kit` because the requested work is implementation on a system-code surface.
- A prompt like "run deep research on the council protocol" should keep routing to `deep-research`, because the user requested a skill-owned loop, not the council agent.

This prevents accidental over-routing while preserving direct dispatch for the agent itself.

## Questions Answered

- Q5 answered: do not add Skill Advisor token/phrase boosts for `multi-ai-council` in the current architecture. Direct dispatch via user request or `@orchestrate` is sufficient and cleaner. Add a regression/fixture only if packet 081 touches advisor routing, so council prompts do not get misclassified as skill invocations.

## Questions Remaining

- Q6 remains: four-runtime mirror-sync automation still needs investigation.
- Q7 remains: state.jsonl forward-compat policy is separate from advisor routing.
- Q8 remains: `/memory:save` council-completion anchoring still needs a separate decision.
- Q9 remains: ADD-1..ADD-6 risks need a combined mitigation pass after Q6-Q8 sharpen the operational boundaries.
- Q10 remains: lightweight-bound revisit conditions should be answered after Q6-Q9 expose the remaining maintenance cost.

## Next Focus

Iteration 6 should answer Q6: investigate whether four-runtime mirror-sync for `multi-ai-council` can be automated or checked at commit/test time, and decide whether the follow-on should use a general agent mirror checker or a council-specific stopgap.
