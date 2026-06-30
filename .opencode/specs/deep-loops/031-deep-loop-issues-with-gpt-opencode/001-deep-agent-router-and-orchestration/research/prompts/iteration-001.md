DEEP-RESEARCH

# Deep-Research Iteration 1 — Deep-Agent Router & Orchestration Hardening (GPT-backed OpenCode)

## STATE

Segment: 1 | Iteration: 1 of 8
Questions: 0/10 answered | Last focus: none yet
Last 2 ratios: N/A -> N/A | Stuck count: 0
Resource map: resource-map.md not present; skipping coverage gate.
Memory context refresh: none loaded yet.
Next focus: Map the current dispatch surfaces and answer the foundational STRUCTURAL questions (KQ1, KQ2, KQ3, KQ6, KQ7). Determine whether `subagent_type` is a hard runtime identity or prompt-injected, because every downstream KQ depends on that answer.

Research Topic: Deep-agent router & orchestration hardening for GPT-backed OpenCode
Iteration: 1 of 8
Focus Area: Foundational structural mapping — OpenCode agent dispatch model, subagent_type contract, orchestrate deep-dispatch path, ai-council dual reachability, cross-runtime mirror conventions.
Remaining Key Questions: KQ1-KQ10 (see strategy.md section 3).
Carried-Forward Open Questions: [None yet]
Last 3 Iterations Summary: none (first iteration).

## STATE FILES

All paths relative to repo root.

- Config: .opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/001-deep-agent-router-and-orchestration/research/deep-research-config.json
- State Log: .opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/001-deep-agent-router-and-orchestration/research/deep-research-state.jsonl
- Strategy: .opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/001-deep-agent-router-and-orchestration/research/deep-research-strategy.md
- Registry: .opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/001-deep-agent-router-and-orchestration/research/deep-research-findings-registry.json
- Write iteration narrative to: .opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/001-deep-agent-router-and-orchestration/research/iterations/iteration-001.md
- Write per-iteration delta file to: .opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/001-deep-agent-router-and-orchestration/research/deltas/iter-001.jsonl

## CONSTRAINTS

- You are a LEAF agent. Do NOT dispatch sub-agents. Max 12 tool calls total.
- Write ALL findings to files. Do not hold in context.
- The workflow reducer owns strategy machine-owned sections, registry, and dashboard synchronization.
- Do not implement fixes during research. Report findings only; implementation is a separate follow-up step.
- Cite every load-bearing claim with file:line evidence (use the `file:line` convention). Mark inferred vs confirmed explicitly.
- When emitting the iteration JSONL record, include an optional `graphEvents` array if you discover coverage-graph nodes/edges.

## EVIDENCE-BASE NOTE (read carefully)

research-prompt section 2 treats the root cause as CONFIRMED and says do not re-prove it. The cited prior research (`030/.../010-gpt-deep-agent-routing/research/research.md`, `../001-gpt-deep-agent-routing`) DOES NOT EXIST on disk — verified by the orchestrator. Therefore treat the following as OPERATOR-ASSERTED AXIOMS, not findings you can cross-validate:
- Root cause: native deep-loop dispatch relies on prose/prompt contracts, not a hard runtime identity boundary.
- `@orchestrate` dispatches every custom agent through `subagent_type: "general"`; specialized identity is prompt-injected.
- Three mis-route modes: A (general/build absorbs leaf role), B (leaf re-dispatches from injected prose), C (loop advances on fabricated JSONL without a canonical narrative file).
- FIX-5 = native->CLI subprocess executor (process isolation); the structural-prevention ceiling.

Your job is NOT to re-prove these. Your job is to answer KQ1-KQ10 against the CURRENT on-disk surfaces, with file:line evidence. Flag explicitly in your findings where an axiom is vs is not corroborated by what you actually read.

## FOCUS FOR THIS ITERATION (answer these with file:line evidence)

**KQ1 — DEEP agent form factor.** Should the DEEP primary agent be (a) a new standalone `.opencode/agents/deep.md` primary agent, (b) an enhancement to the `deep-loop-workflows` skill's mode-registry router, or (c) both (agent file = runtime identity, skill = logic)? What does OpenCode's agent dispatch model actually support — can a primary agent dispatch to named sub-agents with a specialized `subagent_type`, or is `general` the only real runtime type? Cite: the agent frontmatter schema (read several `.opencode/agents/*.md` files), the `task` tool's `subagent_type` contract (read orchestrate.md and any agent that documents dispatch), and orchestrate.md.

**KQ2 — subagent_type specialization feasibility.** Can OpenCode agent files declare a per-agent `subagent_type` that survives dispatch as a hard runtime identity, or is every dispatch normalized to `general`? If it cannot be specialized today, what is the smallest host-runtime change that would enable it, and is that change in scope or a mandatory dependency/follow-up? Cite the opencode agent spec (if one exists on disk — check `.opencode/` and any docs) and orchestrate.md sections on nesting/illegal nesting.

**KQ3 — Orchestrate hardening boundary.** How much can `.opencode/agents/orchestrate.md` change its deep-loop dispatch behavior WITHOUT breaking Claude Code parity and Claude's existing adaptive flexibility? What specifically in orchestrate.md carries the deep dispatch today, and what would an explicit deep-target dispatch look like? Cite orchestrate.md sections by heading/line.

**KQ6 — ai-council dual reachability.** `deep-ai-council` must be reachable both (a) as a sub-agent target of the DEEP primary agent and (b) directly as its own primary agent. Today `ai-council.md` is `mode: primary`. How should the DEEP router include council without breaking direct invocability? Cite `.opencode/agents/ai-council.md`.

**KQ7 — Cross-runtime parity.** What must be mirrored across `.opencode/agents/`, `.claude/agents/`, and `.codex/agents/`? Is there a generation/sync convention, or are these hand-mirrored? What breaks if they drift? List the actual agent files present in each directory and compare.

## FILES TO INVESTIGATE (confirmed on disk)

Agents (OpenCode): `.opencode/agents/orchestrate.md`, `deep-research.md`, `deep-review.md`, `deep-context.md`, `ai-council.md`, `CONTEXT.md` (and list whatever else `.opencode/agents/` contains).
Agents (Claude mirror): `.claude/agents/` — list and compare.
Agents (Codex mirror): `.codex/agents/` — list and compare; note format (.toml vs .md).
Skill router: `.opencode/skills/deep-loop-workflows/SKILL.md` and `mode-registry.json`.
Command routers: `.opencode/commands/deep/research.md` (dispatch section), and skim `review.md`, `context.md`, `ai-council.md` dispatch sections.

## OUTPUT CONTRACT

You MUST produce THREE artifacts. The post_dispatch_validate step fails the iteration if any is missing/malformed.

1. **Iteration narrative markdown** at the iteration-001 path above. Structure: headings for Focus, Actions Taken, Findings (with file:line citations and confirmed-vs-inferred markers), Questions Answered (which KQs this iteration resolved and the answer), Questions Remaining, Next Focus (recommend iteration-2 focus).

2. **Canonical JSONL iteration record** APPENDED to the state log path above. MUST use `"type":"iteration"` EXACTLY (not "iteration_delta"). Required schema:
   `{"type":"iteration","iteration":1,"newInfoRatio":<0..1>,"status":"<complete|insight|thought>","focus":"<one-line>","findingsCount":<n>,"keyQuestions":["KQ1",...],"answeredQuestions":["KQ1",...],"durationMs":<n>,"graphEvents":[],"timestamp":"2026-06-30T...Z","sessionId":"031-001-res-1782823402","generation":1}`
   Append via single-line JSON with newline terminator. Since this is iteration 1 (all net-new), newInfoRatio should be high (e.g. 0.85-1.0) if you gathered substantial novel evidence; use your judgment.

3. **Per-iteration delta file** at `deltas/iter-001.jsonl`. One `{"type":"iteration",...}` record (same as state-log append) PLUS per-finding/observation/ruled_out structured records, one per line. Example shapes in the prompt_pack_iteration.md.tmpl.

All three artifacts are REQUIRED.
