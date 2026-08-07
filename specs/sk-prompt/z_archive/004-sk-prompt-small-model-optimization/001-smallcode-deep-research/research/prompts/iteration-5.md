DEEP-RESEARCH

# Deep-Research Iteration Prompt Pack — iter 5 of 20 (SYNTHESIS PASS)

## STATE

state_summary: Iter 5 of 20. RQ1–4 surfaced in iters 1–4 (ratios 0.85, 0.78, 0.72, 0.68 — steady decline). Now: synthesize RQ5 architecture verdict.

Research Topic: Mine smallcode-master MIT corpus for small-model output-quality runtime patterns (5 RQs).

Iteration: 5 of 20

Focus Area: **RQ5 — Skill Architecture (SYNTHESIS).** Given RQ1–4 deltas (read iter-001/002/003/004.md), determine: do they land as (a) a NEW `sk-small-model` skill with `enhances` edges to cli-devin/cli-opencode, (b) per-skill `references/` files inside existing skills, (c) cross-cutting refs in sk-code/mcp-code-mode, or (d) hybrid? Produce an EXPLICIT VERDICT — no hedging ("further investigation needed" is unacceptable per spec.md SC-003).

If verdict is "new skill" or "hybrid (incl. new skill)":
- Draft full frontmatter for `.opencode/skills/sk-small-model/SKILL.md` (name, description, allowed-tools, version, keywords)
- Draft `.opencode/skills/sk-small-model/graph-metadata.json` `enhances` edges to cli-devin and cli-opencode (weight 0.3–0.5), plus derived.trigger_phrases, derived.key_topics, derived.key_files
- Draft AGENTS.md addition (sibling to existing CLI dispatch rule §1 line 39, OR new top-level "Small-Model Dispatch" section)
- Simulate skill-advisor 5-lane score: would the new skill pass the 0.8 confidence threshold (`fusion.ts:41`) on small-model prompts?

If verdict is "distributed":
- List target paths inside cli-devin/references/, cli-opencode/references/, sk-prompt/assets/ for each of the RQ1–4 deltas
- Describe how skill-advisor would still co-surface them on small-model dispatch (via `enhances` edges from existing skills back to each other, or via shared trigger phrases)

Remaining Key Questions (1):
- [x] RQ1 — Context Budget Engine (iter 1, 5 patterns)
- [x] RQ2 — Output Verification Pipeline (iter 2)
- [x] RQ3 — Per-Model Profiles & Escalation (iter 3)
- [x] RQ4 — Structured Scope/Permissions (iter 4)
- [ ] RQ5 — Skill Architecture (SYNTHESIS) ← current focus

Last 3 Iterations Summary:
- iter 2: RQ2 (ratio 0.78 insight)
- iter 3: RQ3 (ratio 0.72 progress)
- iter 4: RQ4 (ratio 0.68 complete)

## STATE FILES

- Config: `.opencode/specs/sk-prompt/004-sk-prompt-small-model-optimization/001-smallcode-deep-research/research/deep-research-config.json`
- State Log: `.opencode/specs/sk-prompt/004-sk-prompt-small-model-optimization/001-smallcode-deep-research/research/deep-research-state.jsonl`
- Strategy: `.opencode/specs/sk-prompt/004-sk-prompt-small-model-optimization/001-smallcode-deep-research/research/deep-research-strategy.md`
- Registry: `.opencode/specs/sk-prompt/004-sk-prompt-small-model-optimization/001-smallcode-deep-research/research/findings-registry.json`
- Write iteration narrative to: `.opencode/specs/sk-prompt/004-sk-prompt-small-model-optimization/001-smallcode-deep-research/research/iterations/iteration-005.md`
- Write per-iteration delta file to: `.opencode/specs/sk-prompt/004-sk-prompt-small-model-optimization/001-smallcode-deep-research/research/deltas/iter-005.jsonl`

## CONSTRAINTS

- LEAF agent. No sub-agent dispatch. Max 12 tool calls. 3–5 research actions.
- Already-shipped 113 items: RCAF default, medium pre-plan, standard bundle-gate, anti-hallucination secondary, sequential_thinking 2-layer, SWE-1.6 free-tier, RM-8 four-layer mitigation. DO NOT re-propose; cite as "shipped".
- SC-003 from spec.md: RQ5 verdict MUST be explicit. "Further investigation" is unacceptable.

## SOURCE BOUNDARIES

- Read prior iterations FIRST: `.opencode/specs/.../research/iterations/iteration-001.md` through `iteration-004.md`
- Preflight evidence base (architecture context): `.opencode/specs/.../preflight/context-card.md` §RQ5 (~11 citations)
- Read-only refs for architecture decision: `.opencode/skills/system-skill-advisor/SKILL.md`, `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts` (line 41-42 for threshold logic), `.opencode/skills/sk-prompt/graph-metadata.json` (existing `enhances` precedent for cli-* skills, weight 0.4)
- Read-only refs (skill tree map): all of `.opencode/skills/cli-devin/`, `cli-opencode/`, `sk-prompt/`, `sk-code/`, `mcp-code-mode/`, `system-skill-advisor/` for current state; `AGENTS.md` for dispatch rules
- DO NOT read smallcode-master source this iter (already mined in iters 1–4)

## OUTPUT CONTRACT (REQUIRED — all 3 artifacts)

1. **iteration-005.md** — Focus/Actions Taken/Findings/Questions Answered/Questions Remaining/Next Focus. Findings section MUST include:
   - The explicit architecture verdict (new skill / distributed / hybrid)
   - Rationale (3–5 sentences citing iters 1–4 + preflight §RQ5 + sk-prompt's existing `enhances` precedent)
   - If verdict involves new skill: complete frontmatter draft + graph-metadata draft + AGENTS.md addition draft
   - If verdict involves distributed: target-path list per RQ1–4 delta
   - Either way: skill-advisor scoring simulation (would the routing work?)

2. **state.jsonl APPEND**: `{"type":"iteration","iteration":5,"newInfoRatio":<0..1>,"status":"insight|convergence","focus":"RQ5 — Skill Architecture (SYNTHESIS)","graphEvents":[]}`. Expected ratio 0.50–0.75 (synthesis over fresh ground).

3. **deltas/iter-005.jsonl** — one iter record + N finding records. At minimum: one P0 finding for the architecture verdict + one finding per delta-bearing recommendation.

## EXECUTION

1. Pre-plan (medium, 3 steps):
   a. Read iter-001..004.md (~250 lines each) to compile the cross-RQ delta inventory.
   b. Read preflight context-card §RQ5 + skim system-skill-advisor SKILL.md + sk-prompt/graph-metadata.json `enhances` precedent (5-lane scorer mechanics).
   c. Decide architecture verdict + draft the chosen-path artifacts. If new skill or hybrid: write the SKILL.md frontmatter + graph-metadata edges + AGENTS.md addition. If distributed: write the target-path list. Either way: simulate the advisor score.
2. Execute. Stop after step c.
3. Append JSONL + delta. Stop.

Verification: iteration-005.md contains the verdict in plain text + chosen-path artifact drafts + advisor scoring rationale.
