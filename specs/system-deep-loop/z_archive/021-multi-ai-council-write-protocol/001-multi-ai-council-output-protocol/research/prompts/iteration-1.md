# Deep-Research Iteration Prompt Pack — Iteration 1 of 10

## STATE

STATE SUMMARY (auto-generated):
Segment: 1 | Iteration: 1 of 10
Questions: 0/10 answered | Last focus: none yet
Last 2 ratios: N/A -> N/A | Stuck count: 0
Resource map: resource-map.md not present; skipping coverage gate.
Next focus: Iteration 1: Answer Q1 — propose a concrete shape for the persist-artifacts.sh helper. Include path, CLI args, parser strategy (markdown §-header extraction), exit codes, fixture-test layout, and the strict-required vs optional section contract. Reference how deep-research's reduce-state.cjs and deep-review's reducer handle similar parsing, then propose an explicitly simpler equivalent for council (no graph, no convergence math, just §-header parsing + write artifacts). Output should be sufficient for packet 081 to start coding from.

Research Topic: How to further improve the multi-ai-council agent and the ai-council/ output protocol convention introduced in packet 080. Reference deep-research and deep-review skill patterns as inspiration but do not promote multi-ai-council into a dedicated skill folder unless lightweight bound (ADR-001) provably fails. Investigate concrete improvements (helper script shape, §17 caller protocol, §8 shared schema artifact, validator hints, advisor wiring, state.jsonl forward-compat, mirror-sync automation), check whether existing spec-kit integration is solid, and surface risks of round-2 amendments (ADD-1..ADD-6).

Iteration: 1 of 10
Focus Area: Q1 helper script concrete shape
Remaining Key Questions:
- [ ] Q1: What concrete shape should the persist-artifacts.sh helper take?
- [ ] Q2: Should §17 be added to agent body or live in a reference file?
- [ ] Q3: How should the §8 OUTPUT FORMAT shared schema artifact be expressed?
- [ ] Q4: Does validator need explicit ai-council/ awareness?
- [ ] Q5: Should skill advisor scoring include multi-ai-council triggers?
- [ ] Q6: How to automate 4-runtime mirror-sync?
- [ ] Q7: state.jsonl forward-compat / versioning strategy?
- [ ] Q8: Should /memory:save anchor council-completion events?
- [ ] Q9: ADD-1..ADD-6 risk mitigation specifics?
- [ ] Q10: Lightweight-bound revisit conditions?
Last 3 Iterations Summary: (none yet)

## STATE FILES (relative to repo root)

- Config: .opencode/specs/skilled-agent-orchestration/080-multi-ai-council-output-protocol/research/deep-research-config.json
- State Log: .opencode/specs/skilled-agent-orchestration/080-multi-ai-council-output-protocol/research/deep-research-state.jsonl
- Strategy: .opencode/specs/skilled-agent-orchestration/080-multi-ai-council-output-protocol/research/deep-research-strategy.md
- Registry: .opencode/specs/skilled-agent-orchestration/080-multi-ai-council-output-protocol/research/findings-registry.json
- Write iteration narrative to: .opencode/specs/skilled-agent-orchestration/080-multi-ai-council-output-protocol/research/iterations/iteration-001.md
- Write per-iteration delta file to: .opencode/specs/skilled-agent-orchestration/080-multi-ai-council-output-protocol/research/deltas/iter-001.jsonl

## CONSTRAINTS

- You are a LEAF agent. Do NOT dispatch sub-agents.
- Target 3-5 research actions. Max 12 tool calls total.
- Write ALL findings to files. Do not hold in context.

## REPO CONTEXT

Working directory: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public

Key files for context:
- .opencode/agents/multi-ai-council.md (683 LOC, §0-§16, §12-§15 are the new packet-080 sections)
- .opencode/skills/deep-research/scripts/reduce-state.cjs (sibling reducer pattern to study)
- .opencode/skills/deep-research/scripts/runtime-capabilities.cjs
- .opencode/specs/skilled-agent-orchestration/080-multi-ai-council-output-protocol/ai-council/council-report.md (round-2 amended; contains 6 ADDs)
- .opencode/specs/skilled-agent-orchestration/080-multi-ai-council-output-protocol/decision-record.md (ADR-001..ADR-004)
- .opencode/skills/system-spec-kit/references/multi-ai-council/ (4 reference files)
- .opencode/skills/system-spec-kit/scripts/tests/multi-ai-council-validator.vitest.ts (regression test pattern)

## OUTPUT CONTRACT

Produce THREE artifacts:

1. **Iteration narrative markdown** at `.opencode/specs/skilled-agent-orchestration/080-multi-ai-council-output-protocol/research/iterations/iteration-001.md`
   Structure: headings for Focus, Actions Taken, Findings, Questions Answered, Questions Remaining, Next Focus.

2. **JSONL iteration record** APPENDED to state log, exactly:
   ```
   {"type":"iteration","iteration":1,"newInfoRatio":<0.0-1.0>,"status":"<string>","focus":"<string>","graphEvents":[/* optional */]}
   ```
   Use single-line JSON. Append via:
   `echo '<single-line-json>' >> .opencode/specs/skilled-agent-orchestration/080-multi-ai-council-output-protocol/research/deep-research-state.jsonl`

3. **Per-iteration delta file** at `.opencode/specs/skilled-agent-orchestration/080-multi-ai-council-output-protocol/research/deltas/iter-001.jsonl`
   First line: same iteration JSON as #2.
   Subsequent lines: one record per finding/invariant/observation/edge/ruled_out direction.

## TASK FOR ITERATION 1

Answer Q1 concretely. Required contents in iteration-001.md Findings section:

- Helper script proposed path (e.g. `.opencode/skills/system-spec-kit/scripts/multi-ai-council/persist-artifacts.{sh|cjs|ts}`).
- Language choice (bash / Node CJS / Node TS) with rationale referencing existing scripts/ conventions.
- CLI args: `<packet-spec-folder>`, optional `--round NNN`, `--input-file` or stdin, `--strict-output` (per ADD-2 graceful degradation).
- Parser strategy: how to extract from markdown §-headers (Council Composition, per-seat sections, Recommended Plan, Plan Confidence as strict-required; others optional). Reference reduce-state.cjs's parsing approach.
- Exit codes: 0 success, 1 strict-required parse error, 2 partial-write recovery needed.
- Fixture-test layout: where the test lives, what fixture inputs look like (sample council report markdown), what assertions cover.
- Reducer-derived simplifications: the council helper does NOT need findings-registry.json, does NOT need dashboard, does NOT need graph events, does NOT need convergence vote — only parse + write artifacts. State this explicitly so packet 081 doesn't over-engineer.

Write the answer with code examples (stub function signatures, expected I/O, fixture skeleton). 200-400 LOC range in iteration-001.md is reasonable.

End with:
- Questions Answered: [Q1]
- Questions Remaining: [Q2..Q10]
- Next Focus: pick the next-most-load-bearing question (likely Q3 §8 schema artifact since Q2 §17 placement depends on it).
- newInfoRatio: estimate 0.6-0.9 since this is the first iteration and Q1 is concrete.
- status: "insight"
