DEEP-RESEARCH

# Deep-Research Iteration Prompt Pack — iter 3 of 20

## STATE

state_summary: Iter 3 of 20. Iter 1 → RQ1 budget engine (5 patterns, newInfoRatio 0.85). Iter 2 → RQ2 verification pipeline (newInfoRatio 0.78). Focus now advances to RQ3.

Research Topic: Mine smallcode-master MIT corpus for small-model output-quality runtime patterns (5 RQs)

Iteration: 3 of 20

Focus Area: **RQ3 — Per-Model Profiles & Escalation.** Read smallcode's per-model profile system (`src/model/profiles.ms`), bayesian tool scorer (`src/governor/tool_scorer.ms`), and local→cloud escalation (`bin/escalation.js`) via preflight context-card §RQ3 (~34 citations). Identify 3–5 reusable patterns: per-model profile schema, bayesian scoring with Laplace smoothing, tool-demotion thresholds, escalation decision matrix, conversation-format conversion across providers. For each pattern emit: (a) smallcode primitive (file:line + code quote), (b) candidate target path in our skill tree (new `model-profile.json` shared asset, or `cli-devin/references/`, or `mcp-code-mode/` extension), (c) one-line patch shape, (d) acceptance criteria.

Remaining Key Questions (3):
- [x] RQ1 — Context Budget Engine (iter 1, 5 patterns)
- [x] RQ2 — Output Verification Pipeline (iter 2, see iter-002.md)
- [ ] RQ3 — Per-Model Profiles & Escalation ← current focus
- [ ] RQ4 — Structured Scope/Permissions
- [ ] RQ5 — Skill Architecture (synthesis)

Last 3 Iterations Summary:
- iter 1: RQ1 — Context Budget Engine (ratio 0.85, 5 patterns)
- iter 2: RQ2 — Output Verification Pipeline (ratio 0.78, status insight)

## STATE FILES

All paths relative to repo root.

- Config: `.opencode/specs/skilled-agent-orchestration/114-small-ai-model-optimization/001-smallcode-deep-research/research/deep-research-config.json`
- State Log: `.opencode/specs/skilled-agent-orchestration/114-small-ai-model-optimization/001-smallcode-deep-research/research/deep-research-state.jsonl`
- Strategy: `.opencode/specs/skilled-agent-orchestration/114-small-ai-model-optimization/001-smallcode-deep-research/research/deep-research-strategy.md`
- Registry: `.opencode/specs/skilled-agent-orchestration/114-small-ai-model-optimization/001-smallcode-deep-research/research/findings-registry.json`
- Write iteration narrative to: `.opencode/specs/skilled-agent-orchestration/114-small-ai-model-optimization/001-smallcode-deep-research/research/iterations/iteration-003.md`
- Write per-iteration delta file to: `.opencode/specs/skilled-agent-orchestration/114-small-ai-model-optimization/001-smallcode-deep-research/research/deltas/iter-003.jsonl`

## CONSTRAINTS

- LEAF agent. No sub-agent dispatch. Max 12 tool calls. 3–5 research actions.
- Write all findings to files; do NOT hold in context.
- Already-shipped findings from packet 113 (DO NOT re-propose): RCAF default, medium pre-plan, standard bundle-gate, anti-hallucination secondary, sequential_thinking 2-layer, SWE-1.6 free-tier disclosure, RM-8 four-layer mitigation. Cite as "shipped".

## SOURCE BOUNDARIES

- Read-only across `.opencode/specs/.../external/smallcode-master/`
- Primary sources iter 3: `external/smallcode-master/src/model/profiles.ms`, `external/smallcode-master/src/governor/tool_scorer.ms`, `external/smallcode-master/bin/escalation.js`
- Optional cross-references: `external/smallcode-master/src/model/adapter.ms`, `external/smallcode-master/src/model/streaming.ms` (only if profile schema needs disambiguation)
- Preflight evidence base (cite first): `.opencode/specs/.../preflight/context-card.md` §RQ3
- Read-only refs (skill tree to map deltas against): `.opencode/skills/cli-devin/SKILL.md` (Model Selection table §3), `.opencode/skills/cli-opencode/SKILL.md` (Model Selection §3), `.opencode/skills/mcp-code-mode/SKILL.md`, `.opencode/skills/system-skill-advisor/SKILL.md`

## OUTPUT CONTRACT (REQUIRED — all 3 artifacts)

1. **iteration-003.md** — Focus/Actions Taken/Findings/Questions Answered/Questions Remaining/Next Focus structure. 3–5 patterns with file:line + code quote + candidate target path + patch shape + acceptance criteria.

2. **state.jsonl APPEND** — single line:
```json
{"type":"iteration","iteration":3,"newInfoRatio":<0..1>,"status":"<insight|progress|exhausted|blocked>","focus":"RQ3 — Per-Model Profiles & Escalation","graphEvents":[]}
```
Expected newInfoRatio 0.65–0.85 (fresh RQ ground).

3. **deltas/iter-003.jsonl** — one iter record + N finding records (3–5).

## EXECUTION

1. Pre-plan (medium, 3 steps):
   a. Read preflight context-card §RQ3 for the structured pattern map of profiles + bayesian scoring + escalation.
   b. Read `src/model/profiles.ms` end-to-end (line ranges per card; ~150 lines) for profile schema. Read key sections of `src/governor/tool_scorer.ms` for bayesian + demotion logic. Read `bin/escalation.js` for local→cloud trigger + format conversion.
   c. For each of 3–5 patterns: write a section to iteration-003.md (primitive + target path + patch shape + acceptance criteria). Suggest where the model-profile registry should live (sk-small-model asset vs sk-prompt asset vs mcp-code-mode config).
2. Execute. Stop at 5 patterns max.
3. Append JSONL + write delta. Stop.
