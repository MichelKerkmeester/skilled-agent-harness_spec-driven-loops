DEEP-RESEARCH

# Deep-Research Iteration 4 (DEEPENING) — Draft Concrete `deep.md` (KQ1 deepen)

## STATE

Segment: 1 | Iteration: 4 of 8 (DEEPENING ARC — operator-directed; novelty governs, not coverage)
Questions: 10/10 answered (coverage closed in iter 3); this iteration DEEPENS KQ1 to produce a concrete artifact.
Last 3 ratios: 0.95 -> 0.75 -> 0.58 | Stuck count: 0
Next focus: Draft the ACTUAL `.opencode/agents/deep.md` — frontmatter, route table, body. Make deliverable #1 (DEEP primary agent design) concrete and reviewable, not a sketch.

## WHY THIS ITERATION (deepening rationale)

Iterations 1-3 answered KQ1 ("form factor = both") at the design-direction level. But the synthesis (`research/research.md` §1) only SKETCHED `deep.md`. The operator wants concrete artifacts. This iteration produces a full draft of `deep.md` that the plan/implement phase can review and land with minimal editing. It must be faithful to the CONFIRMED dispatch model (subagent_type=general, identity prompt-injected) and align with `mode-registry.json` as the logic source of truth.

## PRIOR RESULTS (build on, do not re-derive)

- subagent_type normalized to "general"; identity prompt-injected from agent files (iter 1, CONFIRMED).
- DEEP = both agent file (first-dispatch identity) + mode-registry.json (logic source of truth) (iter 1, INFERRED).
- orchestrate.md single-hop, max depth 2, requires agent file loaded before dispatch (iter 1, CONFIRMED).
- ai-council is mode: all (NOT mode: primary as prompt claimed); stays directly invocable (iter 1, CONFIRMED).
- Pre-route edits: add "Resolved route"/"Deep Route" header at 3 seams (iter 2).
- Claude flexibility to preserve: dynamic pre-dispatch planning, evidence-responsive iteration, advisory metadata + depth-aware council (iter 3, CONFIRMED).
Read iterations/iteration-001.md, iteration-002.md, iteration-003.md and research/research.md for full citations.

## STATE FILES

- State Log: .opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/001-deep-agent-router-and-orchestration/research/deep-research-state.jsonl
- Strategy: .opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/001-deep-agent-router-and-orchestration/research/deep-research-strategy.md
- Registry: .opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/001-deep-agent-router-and-orchestration/research/findings-registry.json
- Write iteration narrative to: .opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/001-deep-agent-router-and-orchestration/research/iterations/iteration-004.md
- Write delta to: .opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/001-deep-agent-router-and-orchestration/research/deltas/iter-004.jsonl

## CONSTRAINTS

- LEAF agent. No sub-agents. Max 12 tool calls.
- Cite file:line for structural claims. Mark CONFIRMED vs INFERRED.
- Do NOT create the actual `.opencode/agents/deep.md` file (implementation is a non-goal; this is research). Put the DRAFT artifact inside iteration-004.md as a fenced code block for the plan phase to land.
- Do NOT write/modify research.md (orchestrator-owned). Only iteration-004.md + state-log append + delta file.

## FOCUS — produce a concrete, reviewable `deep.md` draft

Read the ACTUAL agent files to match conventions exactly, then draft `deep.md`. Your draft must:

1. **Frontmatter** — match the conventions of existing primary agents. Read `.opencode/agents/orchestrate.md:1` (mode: primary) and `.opencode/agents/ai-council.md:1` (mode: all) for the frontmatter schema actually in use (description, mode, tools, model, color, etc.). Use `mode: primary` for deep.md (it is an entry-point router). Cite the frontmatter fields you're mirroring.

2. **Route table** — mirror `mode-registry.json` (`workflowMode → agent` mapping). Read `.opencode/skills/deep-loop-workflows/mode-registry.json` and reproduce the four deep modes (research/review/context/ai-council) → target agent + command + packet. The route table in deep.md MUST agree with the registry (do NOT fork the mapping into prose; reference the registry as source of truth and show the resolved table). Cite the registry lines.

3. **Body logic** — the router behavior, in this order:
   - Classify the requested mode (from the `/deep:*` command or skill dispatch).
   - Resolve the target through mode-registry.json (NOT a hardcoded copy).
   - Emit the `Deep Route:` header (per iter 2's pre-route edit) in the dispatch package.
   - Dispatch the named sub-agent with `subagent_type: "general"` (CONFIRMED constraint — do NOT pretend hard identity exists) AND the loaded agent definition.
   - FORBID: absorbing a leaf role (mis-route mode A), re-dispatching from injected prose (mode B), advancing state without a canonical leaf narrative (mode C). Reference the operator-asserted mis-route taxonomy.
   - Preserve ai-council dual reachability (do not convert council to subagent-only).
   - Respect single-hop (orchestrate.md:42) — DEEP routes one level to a deep sub-agent; it does not chain further.

4. **Claude-flex safety** — annotate which body clauses target mis-invocation (GPT) vs which preserve Claude flexibility (iter 3's three preservation targets). Each constraint clause should say what signal it narrows.

5. **Cross-runtime mirror note** — state that `.claude/agents/deep.md` mirror is required (REQ-006) and the Codex mirror is blocked on the TOML-location doc contradiction (iter 1/§8).

## OUTPUT CONTRACT

1. Iteration narrative iterations/iteration-004.md. Structure: Focus, Actions Taken, Findings (the structural conventions confirmed), **Proposed Artifact** (the full `deep.md` draft in a fenced ```yaml/markdown block — frontmatter + route table + body, ready for the plan phase), Rationale (why each clause, citing prior iterations), Claude-flex annotation, Questions Remaining (none new), Next Focus.
2. Canonical `{"type":"iteration","iteration":4,...}` APPENDED to deep-research-state.jsonl (single-line, newline-terminated, type exactly "iteration"). newInfoRatio should reflect net-new CONCRETE artifact value beyond the iter-1 sketch (likely moderate, e.g. 0.45-0.6 — this deepens an answered KQ with a ready-to-land artifact). Include status "insight" (concrete breakthrough on a low-novelty pass), focus, findingsCount, keyQuestions ["KQ1"], answeredQuestions ["KQ1"], durationMs, timestamp "2026-06-30T...Z", sessionId "031-001-res-1782823402", generation 1.
3. Delta file deltas/iter-004.jsonl (iteration record + per-finding records).

All three REQUIRED.
