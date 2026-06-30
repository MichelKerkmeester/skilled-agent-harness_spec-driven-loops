DEEP-RESEARCH

# Deep-Research Iteration Prompt Pack

## STATE

Segment: 1 | Iteration: 1 of 20
Questions: 0/6 answered | Last focus: none yet
Last 2 ratios: N/A -> N/A | Stuck count: 0
Resource map: resource-map.md not present; skipping coverage gate.
Memory context refresh: none loaded yet.
Next focus: KQ1 + KQ2 — Map OpenCode's agent/command resolution path and the deep-loop YAML "dispatch @deep-research vs orchestrate as @general" boundary.

Research Topic: GPT-backed OpenCode deep skills (deep-research, deep-review, deep-context, deep-ai-council, deep-improvement) mis-route to the general/build agent instead of dedicated deep LEAF agents, run slower than under Claude, and drift from the workflow YAML contracts. Reproduces via @orchestrate dispatch AND from the build primary agent.
Iteration: 1 of 20
Focus Area: KQ1+KQ2 — Where is the "which agent runs this command" decision made in OpenCode, and how does the deep-loop command YAML + agent-file contract express "dispatch the dedicated deep LEAF agent" vs "orchestrate the loop yourself as @general"? Find the exact code/docs that GPT-backed execution would misread.
Remaining Key Questions:
- KQ1: agent/command resolution path — why general/build wins over named deep LEAF agent
- KQ2: "dispatch @deep-research vs orchestrate as @general" boundary in the YAML/agent contract
- KQ3: slowness root causes
- KQ4: which workflow-contract steps GPT skips/mutates
- KQ5: @orchestrate vs build-primary reproduction surface diff
- KQ6: concrete fixes
Carried-Forward Open Questions:
[None yet]
Last 3 Iterations Summary: none yet

## STATE FILES

All paths are relative to the repo root (/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public).

- Config: .opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/010-gpt-deep-agent-routing/research/deep-research-config.json
- State Log: .opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/010-gpt-deep-agent-routing/research/deep-research-state.jsonl
- Strategy: .opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/010-gpt-deep-agent-routing/research/deep-research-strategy.md
- Registry: .opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/010-gpt-deep-agent-routing/research/deep-research-findings-registry.json
- Write iteration narrative to: .opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/010-gpt-deep-agent-routing/research/iterations/iteration-001.md
- Write per-iteration delta file to: .opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/010-gpt-deep-agent-routing/research/deltas/iter-001.jsonl

## CONSTRAINTS

- You are a LEAF agent. Do NOT dispatch sub-agents.
- Target 3-5 research actions. Max 12 tool calls total.
- Write ALL findings to files. Do not hold in context.
- The workflow reducer owns strategy machine-owned sections, registry, and dashboard synchronization.
- Do not implement fixes during research. Report findings only; implementation is a separate follow-up step.
- When emitting the iteration JSONL record, include an optional `graphEvents` array representing coverage graph nodes/edges discovered this iteration. Omit when none.

## FOCUS GUIDANCE (iteration 1)

This is META research: you are investigating why THIS skill's dispatch mis-routes under GPT. Investigate the ACTUAL OpenCode codebase and config, not external docs:
- How does OpenCode decide which agent runs a slash command? Look for agent-resolution / command-routing logic, agent inventories, and any "subagent_type" / agent-selection code or docs. Start with: .opencode/agents/, .opencode/commands/deep/research.md, the deep command YAML assets, .opencode/agents/deep-research.md, opencode.json, AGENTS.md §8 (Agent Routing).
- The deep command YAML's Phase-0 self-check ("Are you operating as the @general agent?") vs the dispatch step (agent: deep-research). Trace the exact boundary between "the orchestrating agent runs the YAML" and "the YAML dispatches the LEAF agent". Cite file:line.
- Where would a GPT-backed model conflate these two roles and run everything as @general instead of dispatching @deep-research?

## OUTPUT CONTRACT

You MUST produce THREE artifacts per iteration. The YAML-owned post_dispatch_validate step emits a schema_mismatch conflict event if any is missing or malformed.

1. **Iteration narrative markdown** at the iteration path above. Structure: Focus, Actions Taken, Findings, Questions Answered, Questions Remaining, Next Focus (Ruled Out, Dead Ends, Edge Cases, Sources Consulted, Assessment, Reflection).

2. **Canonical JSONL iteration record** APPENDED to the state log. The record MUST use `"type":"iteration"` EXACTLY. Required schema: type, iteration, run, status, focus, findingsCount, newInfoRatio, noveltyJustification, keyQuestions, answeredQuestions, ruledOut, toolsUsed, sourcesQueried, timestamp, durationMs. Append via single-line JSON with newline terminator (echo >> file). Do NOT pretty-print. It MUST land in the state log file.

3. **Per-iteration delta file** at the delta path above: one `{"type":"iteration",...}` record (same content as the state-log append) plus per-event structured records (one per finding, invariant, observation, edge, ruled_out direction). Each record on its own JSON line.

All three artifacts are REQUIRED.
