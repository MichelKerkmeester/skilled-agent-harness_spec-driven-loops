DEEP-RESEARCH

# Deep-Research Iteration Prompt Pack — iter 2 of 20

## STATE

state_summary: Iter 2 of 20. Iter 1 surfaced 5 patterns for RQ1 (Context Budget Engine): percentage-based budget allocation, tool result truncation with informative suffix, priority-based eviction, file summarization threshold, usage tracking/display. newInfoRatio=0.85. Focus now advances to RQ2.

Research Topic: Mine smallcode-master MIT corpus for small-model output-quality runtime patterns (5 RQs: budget engine, output verification pipeline, per-model profiles + escalation, structured permissions, skill architecture)

Iteration: 2 of 20

Focus Area: **RQ2 — Output Verification Pipeline.** Read smallcode's verifier (`src/governor/verifier.ms`) + hard-fail gatekeeper (`src/governor/hard_fail.ms`) + governor entry (`bin/governor.js`) via the preflight context-card pointer (`../preflight/context-card.md` §RQ2, ~45 prior citations). Identify 3–5 reusable patterns for the verification pipeline + hard-fail analog. For each pattern emit: (a) the smallcode primitive (file:line + 3–10 line code quote), (b) candidate target path in our skill tree (e.g. `cli-devin/references/output-verification.md` or extensions to `cli-devin/assets/agent-config-deep-research-iter.json`), (c) one-line "patch shape", (d) acceptance criteria executable by a follow-on packet.

Remaining Key Questions (4):
- [x] RQ1 — Context Budget Engine (5 patterns, iter 1)
- [ ] RQ2 — Output Verification Pipeline ← current focus
- [ ] RQ3 — Per-Model Profiles & Escalation
- [ ] RQ4 — Structured Scope/Permissions
- [ ] RQ5 — Skill Architecture (synthesis)

Last 3 Iterations Summary: iter 1: RQ1 — Context Budget Engine (newInfoRatio 0.85, 5 patterns surfaced)

## STATE FILES

All paths are relative to the repo root.

- Config: `.opencode/specs/skilled-agent-orchestration/114-small-ai-model-optimization/001-research-smallcode/research/deep-research-config.json`
- State Log: `.opencode/specs/skilled-agent-orchestration/114-small-ai-model-optimization/001-research-smallcode/research/deep-research-state.jsonl`
- Strategy: `.opencode/specs/skilled-agent-orchestration/114-small-ai-model-optimization/001-research-smallcode/research/deep-research-strategy.md`
- Registry: `.opencode/specs/skilled-agent-orchestration/114-small-ai-model-optimization/001-research-smallcode/research/findings-registry.json`
- Write iteration narrative to: `.opencode/specs/skilled-agent-orchestration/114-small-ai-model-optimization/001-research-smallcode/research/iterations/iteration-002.md`
- Write per-iteration delta file to: `.opencode/specs/skilled-agent-orchestration/114-small-ai-model-optimization/001-research-smallcode/research/deltas/iter-002.jsonl`

## CONSTRAINTS

- You are a LEAF agent (SWE-1.6 deep-research iter worker). Do NOT dispatch sub-agents.
- Target 3-5 research actions. Max 12 tool calls total.
- Write ALL findings to files. Do not hold in context.
- Already-shipped findings from packet 113 (DO NOT re-propose): RCAF default, medium pre-plan, standard bundle-gate, anti-hallucination secondary, sequential_thinking 2-layer, SWE-1.6 free-tier disclosure, RM-8 four-layer mitigation. Cite as "shipped" if relevant.

## SOURCE BOUNDARIES

- Read-only across `.opencode/specs/skilled-agent-orchestration/114-small-ai-model-optimization/external/smallcode-master/` (MIT corpus)
- Primary sources for iter 2: `external/smallcode-master/src/governor/verifier.ms`, `external/smallcode-master/src/governor/hard_fail.ms`, `external/smallcode-master/bin/governor.js`, `external/smallcode-master/bin/smallcode.js` (only for context on how governor is wired into the agent loop)
- Preflight evidence base (cite first, drill to source only for specifics): `.opencode/specs/skilled-agent-orchestration/114-small-ai-model-optimization/preflight/context-card.md` §RQ2
- Read-only refs (skill tree to map deltas against): `.opencode/skills/cli-devin/SKILL.md`, `.opencode/skills/cli-devin/assets/agent-config-deep-research-iter.json`, `.opencode/skills/cli-devin/references/deep-loop-iter-contract.md`, `.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/post-dispatch-validate.ts` (the existing post-dispatch validation surface for analogy)

## OUTPUT CONTRACT (REQUIRED — all 3 artifacts)

1. **Iteration narrative markdown** at `.../research/iterations/iteration-002.md`. Structure with headings: Focus, Actions Taken, Findings, Questions Answered, Questions Remaining, Next Focus. Include 3-5 patterns with file:line citations + code quotes + candidate target path + patch shape + acceptance criteria per pattern.

2. **Canonical JSONL iteration record** APPENDED to `.../research/deep-research-state.jsonl`. Single line, `"type":"iteration"` EXACTLY. Schema:
```json
{"type":"iteration","iteration":2,"newInfoRatio":<0..1>,"status":"<insight|progress|exhausted|blocked>","focus":"RQ2 — Output Verification Pipeline","graphEvents":[]}
```
newInfoRatio for iter 2 should still be high (0.65-0.85) since RQ2 is fresh ground. Append via: `echo '<single-line-json>' >> <state-log-path>`.

3. **Per-iteration delta file** at `.../research/deltas/iter-002.jsonl`. Multiple records, one per line:
- One `{"type":"iteration",...}` matching the state-log append
- One `{"type":"finding","id":"f-iter002-NNN","severity":"P1|P2|P3","label":"...","iteration":2}` per pattern (3-5 entries)
- Optional `{"type":"observation",...}` or `{"type":"ruled_out",...}` records

ALL THREE artifacts are required. Missing or malformed artifacts fail the iter.

## EXECUTION

1. Pre-plan (medium density, 3 ordered steps):
   a. Read preflight context-card §RQ2 (line ranges in card; cites ~45 smallcode source refs) for the structured pattern map of the verification pipeline (compile → execute → smoke-test → lint) + confidence scoring + hard-fail gatekeeper.
   b. Read `external/smallcode-master/src/governor/verifier.ms` end-to-end + key sections of `hard_fail.ms` (~100-200 lines each) to confirm patterns and extract code quotes. Cross-reference with `bin/governor.js` (governor entry, ~10KB) for how verification is invoked in the agent loop.
   c. For each of 3-5 patterns: write a section to iteration-002.md with smallcode primitive (file:line + code quote), candidate target path in our skill tree (think: would this be a new ref doc, a section in cli-devin/references/deep-loop-iter-contract.md, an addition to agent-config-deep-research-iter.json system_instructions, or an extension to post-dispatch-validate.ts?), one-line patch shape, acceptance criteria.
2. Execute the plan. Stop after step c when 3-5 patterns are documented.
3. Append the JSONL iteration record + write the delta file. Stop.

Verification: confirm iteration-002.md is non-empty with all required sections, JSONL line was appended to state-log, delta file has the iteration record + N finding records.
