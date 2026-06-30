# GOAL PROMPT — Deep-Agent Router & Orchestration Hardening for GPT-backed OpenCode

> Seeds a `/deep:research:auto` run in this spec folder. The research loop should use this document as its initial scope, key questions, and known context. Target spec folder: `.opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/001-deep-agent-router-and-orchestration`

---

## 1. OBJECTIVE

Investigate how to make GPT-backed OpenCode reliably invoke deep skills (deep-research, deep-review, deep-context, deep-ai-council) on the first dispatch — correctly, quickly, and without sacrificing the flexibility that Claude naturally exhibits. The deliverable is an evidence-backed implementation design for three structural changes:

1. A **DEEP primary agent** that routes to the correct deep sub-agent (analogous to the `deep-loop-workflows` mode-registry router).
2. **Orchestrate agent hardening** so deep-loop dispatch through `@orchestrate` matches the DEEP primary agent's routing.
3. **Command & skill refinement** so GPT adheres to the loop contract without becoming slow, while staying as flexible as Claude.

This is the **structural-invocation** counterpart to the prior **detection** research (validator hardening). Do NOT re-derive the validator patch; build on it.

---

## 2. ROOT CAUSE (from prior research — treat as confirmed, do not re-prove)

- The native deep-loop dispatch path relies on prose/prompt contracts, not a hard runtime identity boundary (`deep_research_auto.yaml` resolves to `agent: deep-research`, `wait_for_completion: true`, but enforcement ≠ process boundary).
- `@orchestrate` dispatches every custom agent through `subagent_type: "general"`; specialized identity is prompt-injected, not enforced by a dedicated runtime type.
- GPT-backed models absorb the LEAF role, re-dispatch incorrectly, or advance state without a real leaf. Claude is more faithful because it weights the role/protocol contract more strongly.
- Three mis-route modes: A (general/build absorbs leaf role), B (leaf re-dispatches from injected prose), C (loop advances on fabricated JSONL without a canonical narrative file).

Prior research packet: `.opencode/specs/deep-loops/030-agent-loops-improved/010-gpt-deep-agent-routing/research/research.md` (read it; it is the evidence base).

---

## 3. KEY QUESTIONS

Each question is a research thread. Prioritize in order; answer with file:line evidence.

**KQ1 — DEEP agent form factor.** Should the DEEP primary agent be (a) a new standalone `.opencode/agents/deep.md` primary agent, (b) an enhancement to the `deep-loop-workflows` skill's mode-registry router, or (c) both (agent file = runtime identity, skill = logic)? What does OpenCode's agent dispatch model actually support — can a primary agent dispatch to named sub-agents with a specialized `subagent_type`, or is `general` the only real runtime type? Cite the agent frontmatter schema, the `task` tool's `subagent_type` contract, and `orchestrate.md`.

**KQ2 — subagent_type specialization feasibility.** Can OpenCode agent files declare a per-agent `subagent_type` that survives dispatch as a hard runtime identity, or is every dispatch normalized to `general`? If it cannot be specialized today, what is the smallest host-runtime change that would enable it, and is that change in scope or a mandatory dependency/follow-up? Cite the opencode agent spec and `orchestrate.md` §ILLEGAL NESTING.

**KQ3 — Orchestrate hardening boundary.** How much can `.opencode/agents/orchestrate.md` change its deep-loop dispatch behavior WITHOUT breaking Claude Code parity and Claude's existing adaptive flexibility? What specifically in orchestrate.md carries the deep dispatch today, and what would an explicit deep-target dispatch look like? Cite orchestrate.md sections.

**KQ4 — GPT slowness mechanism.** WHY is GPT slower than Claude even in fast mode when using deep skills? Is it (a) runtime role-negotiation overhead (GPT re-reads YAML/state/reducer/prompt-pack each iteration instead of isolating to a fresh leaf), (b) prompt verbosity, (c) redundant context carriage, or (d) something else? Find evidence in the deep command YAMLs (how much context is injected per dispatch), the executor dispatch prose, and any latency notes. Quantify if possible.

**KQ5 — Pre-route vs. negotiate.** What concrete prompt-structure changes convert "runtime role negotiation" into "up-front pre-routing"? Where in the deep command YAMLs / skill SKILL.md files is the role currently negotiated, and what would a pre-resolved target look like? Propose specific, minimal edits.

**KQ6 — ai-council dual reachability.** `deep-ai-council` must be reachable both (a) as a sub-agent target of the DEEP primary agent and (b) directly as its own primary agent. Today `ai-council.md` is `mode: primary`. How should the DEEP router include council without breaking direct invocability? Cite `.opencode/agents/ai-council.md`.

**KQ7 — Cross-runtime parity.** What must be mirrored across `.opencode/agents/`, `.claude/agents/`, and `.codex/agents/`? Is there a generation/sync convention, or are these hand-mirrored? What breaks if they drift?

**KQ8 — FIX-5 boundary.** The structural-prevention "ceiling" is FIX-5 (native→CLI subprocess executor, process isolation). This research attempts the agent-layer fix first (smaller blast radius). Under what conditions does the agent-layer fix prove insufficient and FIX-5 becomes mandatory? Give a clear decision criterion.

**KQ9 — Claude flexibility preservation.** What specific behaviors make Claude "flexible" with deep skills today that we must NOT constrain away? Identify the adaptive behaviors (e.g., choosing tools dynamically, re-reading context) so the GPT-adherence refinements target mis-invocation signals, not legitimate flexibility.

**KQ10 — Verification strategy.** How do we measure "GPT invokes the correct deep agent on the first dispatch"? Is there dispatch provenance we can observe, or do we need a probe? What's the minimal before/after test that proves the fix without building new benchmark tooling?

---

## 4. KNOWN CONTEXT (read these; do not re-discover)

**Agent surfaces (OpenCode profile):**
- `.opencode/agents/orchestrate.md` — primary orchestrator; dispatches LEAF agents via `task`; `mode: primary`; enforces single-hop (max depth 2).
- `.opencode/agents/deep-research.md`, `deep-review.md`, `deep-context.md` — deep LEAF sub-agents.
- `.opencode/agents/ai-council.md` — `mode: primary` council agent.
- `.opencode/agents/CONTEXT.md` — context agent (LEAF, read-only retrieval).
- **No `deep.md` primary agent exists yet** — this is the proposed addition.

**Command surfaces:**
- `.opencode/commands/deep/research.md` / `review.md` / `context.md` — thin routers, general-agent based, load workflow YAMLs.
- `.opencode/commands/deep/assets/deep_*_auto.yaml` / `deep_*_confirm.yaml` — own dispatch, state, convergence, post-dispatch validation.

**Skill surfaces:**
- `.opencode/skills/deep-loop-workflows/SKILL.md` — mode-registry router (research/review/context/council/improvement). The DEEP primary agent should mirror this routing logic.
- `.opencode/skills/deep-loop-runtime/` — shared executor/state/validator runtime.

**Prior research:** `.opencode/specs/deep-loops/030-agent-loops-improved/010-gpt-deep-agent-routing/research/research.md` — 10-iteration synthesis with mis-route taxonomy and fix ranking.

**Prior plan:** `.opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/001-deep-agent-router-and-orchestration/spec.md` — the implementation spec this research informs.

---

## 5. RESEARCH BOUNDARIES

**In scope:**
- OpenCode agent dispatch model and what `subagent_type` actually enforces.
- The orchestrate agent's deep-dispatch path and how to harden it.
- Deep command YAML / skill SKILL.md prompt structure and where role-negotiation happens.
- GPT-vs-Claude behavioral diff on deep-skill invocation and latency.
- The DEEP primary agent design (form factor, routing, council dual-reachability).
- Cross-runtime mirror conventions.

**Out of scope (do not investigate deeply; cite prior research):**
- The validator hardening patch (owned by phase 002 / `010-gpt-deep-agent-routing` FIX-4a).
- Deep-context and deep-ai-council validator design (deferred).
- Building new benchmark/telemetry tooling (measure with what exists).

---

## 6. NON-GOALS

- Do not implement code; this research produces a design, not a patch.
- Do not re-derive the root cause (confirmed in prior research).
- Do not over-constrain Claude — the goal is GPT adherence WITHOUT losing Claude flexibility.

---

## 7. STOP CONDITIONS

- Stop when KQ1–KQ8 have evidence-backed answers with file:line citations.
- Stop if `subagent_type` specialization proves infeasible at the agent layer AND the host-runtime change is clearly out of scope (then FIX-5 becomes the documented ceiling and the research scopes to "agent-layer best effort + FIX-5 recommendation").
- Stop at max iterations if novelty ratio does not converge (cap recommended: 8–10).

---

## 8. EXPECTED SYNTHESIS OUTPUT

The `research/research.md` synthesis should deliver:
1. A **DEEP primary agent design** — concrete form factor, routing logic, frontmatter, and how it maps to the mode-registry.
2. An **orchestrate hardening design** — specific edits to `orchestrate.md` and their Claude-parity safety argument.
3. A **command/skill refinement list** — specific prompt-structure edits that pre-route for GPT without slowing it or constraining Claude.
4. A **latency root-cause** — the dominant GPT-slow mechanism with evidence.
5. A **FIX-5 decision criterion** — when the agent-layer fix is insufficient.
6. A **verification approach** — how to prove first-dispatch correctness.
7. Explicit deferrals with residual-risk wording.

---

## 9. SUGGESTED RUN CONFIG

```
/deep:research:auto "Deep-agent router & orchestration hardening for GPT-backed OpenCode — see research-prompt.md in this spec folder" :auto --max-iterations=8 --convergence=0.05
```

Spec folder: `.opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/001-deep-agent-router-and-orchestration`
