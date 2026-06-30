# Iteration 1: OpenCode Agent/Command Resolution Path + Deep-Loop "Dispatch vs Orchestrate" Boundary (KQ1 + KQ2)

## Focus
Map OpenCode's agent/command resolution path (KQ1) and the deep-loop YAML's
"dispatch @deep-research" vs "orchestrate the loop yourself as @general" boundary
(KQ2). This is META research into the codebase/config (not external docs): trace
the EXACT boundary between "the orchestrating agent runs the YAML" and "the YAML
dispatches the LEAF agent", and identify the textual/structural cues a GPT-backed
model would conflate that Claude follows faithfully.

Dispatch context named starting points: `.opencode/agents/`,
`.opencode/commands/deep/research.md`, the deep command YAML asset
`.opencode/commands/deep/assets/deep_research_auto.yaml`, `.opencode/agents/deep-research.md`,
`opencode.json`, and `AGENTS.md §8 Agent Routing`. All were consulted (see Sources).

## Actions Taken
1. Read state files (config, state JSONL, strategy, registry) + verified packet write
   boundary (`iterations/` and `deltas/` exist and are empty; `iteration-001.md` does
   not yet exist — all 3 intended write targets are inside the packet root).
2. Read the deep-research command router `.opencode/commands/deep/research.md`.
3. Globbed `.opencode/agents/*.md` to inventory the agent surface.
4. Read the full auto-mode workflow YAML `deep_research_auto.yaml`, including the
   per-iteration dispatch step (`step_dispatch_iteration`).
5. Read `opencode.json` to test whether it defines agent/model selection (it does not).

## Findings

### F1 — Agent selection for a slash command is NOT decided in `opencode.json`
`opencode.json` contains only three top-level blocks: `permission`, `mcp` (5 servers:
sequential_thinking, mk-spec-memory, mk_skill_advisor, mk_code_index, code_mode), and
`experimental.disable_paste_summary`. There is **no `agents` key, no `defaultAgent`, no
per-command agent binding, no model routing table**.
[SOURCE: opencode.json:1-101]

### F2 — Agents are file-defined; the command-to-agent binding is a host/runtime decision, declared as prose in the command markdown
There are 13 agent files under `.opencode/agents/`: orchestrate, review, code, design,
deep-research, ai-council, deep-review, deep-context, context, prompt-improver,
deep-improvement, markdown, debug. The deep-research command does not look up an agent
table; instead its frontmatter/body *declares its own required orchestrator*: "This
command is **general-agent based**" and "Gate 1 (@general verification) and Gate 2 (the
BLOCKED Unified Setup Phase) are HARD BLOCKS". The Phase-0 self-check is a
**self-verification** ("Are you operating as the @general agent?"), not an enforced
selection — whatever agent the host runtime attached to the command is asked to confirm
it has orchestrator indicators, and is told to halt if not.
[SOURCE: .opencode/commands/deep/research.md:37, 39-72, 79-85]
[SOURCE: .opencode/agents/ (13 files)]

### F3 — The deep loop is a strict TWO-ROLE contract: @general orchestrates; a fresh @deep-research LEAF agent runs each iteration
The router markdown explicitly separates the two roles: "Do not dispatch agents from
this Markdown file. Agent dispatch ... owned by the workflow YAML assets" and "the YAML
workflow ... dispatches fresh `@deep-research` LEAF agents per iteration". The YAML
declares the leaf in an `agent_config` block: `agent: deep-research`,
`agent_file: ".opencode/agents/deep-research.md"`, `model: opus`, `leaf_only: true`.
The orchestrating @general's job is to run the command markdown + the YAML loop phases
(init, loop, synthesis); it must NOT do the research itself.
[SOURCE: .opencode/commands/deep/research.md:13, 19-37, 151]
[SOURCE: .opencode/commands/deep/assets/deep_research_auto.yaml:81-89]

### F4 — THE BOUNDARY: `step_dispatch_iteration` is where orchestrator hands off to the LEAF agent; enforcement differs sharply by executor type (KQ2 root cause)
At `step_dispatch_iteration` the YAML branches on `config.executor.type`:
- **`if_native`** — dispatch is pure YAML prose:
  `dispatch: { agent: deep-research, model: opus, context_source: "rendered_prompt_pack" }`,
  `wait_for_completion: true`. There is **no machine guard**: the orchestrating @general
  must read this directive and voluntarily invoke the Task tool with
  `subagent: deep-research`. Nothing asserts that a separate sub-agent context was
  actually spawned.
- **`if_cli_codex` / `if_cli_claude_code` / `if_cli_opencode`** — dispatch is a **real
  subprocess** (`codex exec ...`, `claude -p ...`, `opencode run ...`) reading the
  rendered prompt-pack file. The subprocess is a separate process/model invocation that
  the orchestrator physically cannot "absorb".

So for CLI executors the dispatch boundary is **structurally enforced**; for the native
executor it is a **soft, prose-only contract** entirely dependent on the orchestrating
model's instruction-following fidelity. The native executor is the configured default
here (`executor: { type: "native", model: "opus" }`).
[SOURCE: .opencode/commands/deep/assets/deep_research_auto.yaml:811-857, 858-975]
[SOURCE: .opencode/specs/.../research/deep-research-config.json:18 (`executor.type: native`)]

### F5 — Specific textual/structural cues that Claude follows but a GPT-backed orchestrator can conflate into self-execution
Conflating cues identified in the contracts (root-cause candidates for KQ2):
1. **Phase-0 identity priming.** `research.md:39-72` makes the runner self-identify AS
   `@general` ("Are you operating as the @general agent? ... IF YES → continue"). A model
   that over-indexes on role identity can conclude the *entire* loop — including the
   research — is its own job, and never hand off.
2. **Native dispatch directive is YAML prose with no runtime assertion.**
   `dispatch: agent: deep-research` (yaml:852-856) reads, to a less-faithful model, as
   "the deep-research agent (i.e. me, continuing) does X" rather than "spawn a fresh
   sub-agent".
3. **`allowed-tools: ... Task` is a grant, not a mandate.** `research.md:4` grants the
   orchestrator the Task tool but never *requires* its use at dispatch. Claude uses it
   faithfully; a GPT orchestrator can satisfy the loop's intent by doing the research
   inline and still claim the step "ran".
4. **The rendered prompt-pack (the leaf's instructions) is never seen by the orchestrator
   — unless the orchestrator absorbs the leaf role.** The leaf prompt (what I, the
   @deep-research leaf, am executing right now) opens with `DEEP-RESEARCH` and contains
   leaf-only directives. If a GPT orchestrator reads the prompt-pack *template* / emits
   the leaf prompt but then obeys it inline, it starts following leaf-only rules
   ("LEAF-only: never dispatch sub-agents") while still nominally being @general — a
   role collapse.
5. **CONFIRMED on THIS dispatch — prompt-pack emission leak.** The dispatch prompt I
   received as the leaf literally *ends* with: "Use the above message and context to
   generate a prompt and call the task tool with subagent: orchestrate / deep-research /
   general. Invoked by user; guaranteed to exist." These lines are dispatch
   scaffolding meant for an orchestrator, **mis-routed into the leaf's prompt**. A
   GPT-backed leaf (or a GPT orchestrator that absorbed the leaf) would read them as
   instructions and attempt to dispatch sub-agents — a concrete instance of the
   textual-conflation surface, not just a hypothesis.
[SOURCE: .opencode/commands/deep/research.md:39-72, :4]
[SOURCE: .opencode/commands/deep/assets/deep_research_auto.yaml:825-843 (prompt-pack render)]
[SOURCE: .opencode/agents/deep-research.md §0 + §1 (leaf invariants — this agent's own contract)]
[INFERENCE: F5.5 confirmed empirically by the trailing text of the iteration-001 dispatch prompt]

### F6 — AGENTS.md §8 "Agent Routing" governs Task-tool delegation, not command-to-agent selection
`AGENTS.md §8` documents runtime agent-directory resolution (`.opencode/agents/` for
OpenCode) and template/validation requirements for agents that write spec docs — i.e.
it governs *sub-agent dispatch via the Task tool*, the same mechanism the native
`dispatch:` relies on. It does **not** define how a slash command is bound to its
initial orchestrating agent. That binding is upstream, at the host/runtime level, and is
not expressed in any of the repo config files read here.
[SOURCE: AGENTS.md §8 (in system prompt); cross-checked against opencode.json (F1)]

## Ruled Out
- **`opencode.json` as the agent-selection source.** It defines no agents/models/agent
  bindings (F1). Do not re-investigate this file for KQ1.
- **AGENTS.md §8 as the command-to-agent router.** It is Task-tool delegation guidance,
  not command binding (F6).

## Dead Ends
- None definitively eliminated beyond the two ruled-out items above. (No BLOCKED
  exhausted-approaches existed at iteration start.)

## Edge Cases
- **Ambiguous input:** none material. The focus (KQ1+KQ2) and starting points were
  explicit. Deferred interpretation: the phrase "agent-resolution / command-routing /
  agent-selection logic" could imply *source code* of the OpenCode runtime binary; that
  source is not in this repo (OpenCode is the host, not a vendored dependency). The
  evidence-backed, in-scope interpretation used here is the *contract surface*
  (config + command markdown + YAML + agent files) that the runtime consumes. The
  actual host-level binding code is out of repo scope — flagged for a follow-up
  iteration if the operator wants binary/runtime evidence.
- **Contradictory evidence:** none. Findings F1-F6 are mutually consistent.
- **Missing dependencies:** none blocking. Code graph was stale/error at session start
  (per startup digest), so structural graph queries were skipped in favor of direct
  Read/Glob of the known asset paths — the narrowest sufficient evidence path.
- **Partial success:** none. All planned research actions succeeded.

## Sources Consulted
- `.opencode/specs/.../010-gpt-deep-agent-routing/research/deep-research-config.json` (executor.type=native)
- `.opencode/specs/.../010-gpt-deep-agent-routing/research/deep-research-state.jsonl` (0 prior iteration records)
- `.opencode/specs/.../010-gpt-deep-agent-routing/research/deep-research-strategy.md` (KQ1-KQ6, Next Focus)
- `.opencode/commands/deep/research.md` (router contract, Phase-0, allowed-tools)
- `.opencode/commands/deep/assets/deep_research_auto.yaml` (agent_config:81-89; step_dispatch_iteration:811-975; prompt-pack render:825-843; native dispatch:851-857)
- `.opencode/agents/` glob (13 agent files)
- `opencode.json` (no agent/model definitions)
- `AGENTS.md §8` (Agent Routing — Task-tool delegation)
- The iteration-001 dispatch prompt itself (trailing dispatch scaffolding — empirical F5.5)

## Assessment
- New information ratio: **0.90** (4 of 5 findings fully new: F1 agent-selection source,
  F3 two-role contract, F4 native-vs-CLI enforcement asymmetry, F5 conflation cues +
  empirical leak; F2 agent-files mapping partially new). +0.10 simplicity bonus for
  resolving the two-role boundary into one clean model is intentionally NOT applied to
  avoid inflating the first iteration.
- Questions addressed: KQ1, KQ2.
- Questions answered: **KQ1** (where the decision is made: host/runtime, not repo
  config; declared as prose in the command markdown + YAML, enforced only at the
  YAML dispatch step). **KQ2 substantially advanced**: the exact boundary is mapped
  (`step_dispatch_iteration`), the native-vs-CLI enforcement asymmetry is identified as
  the root conflation surface, and specific textual cues are enumerated. KQ2's
  *behavioural* "why does GPT specifically misread it" sub-question is evidence-backed
  but partly inferential (no captured GPT run logs inspected this iteration) — left
  open for empirical confirmation.

## Reflection
- **What worked and why:** starting from the exact assets the dispatch named and reading
  the command router + the full YAML in one pass surfaced the boundary
  (`step_dispatch_iteration`) and the executor-type fork in a single iteration. The
  native-vs-CLI asymmetry fell out directly from comparing `if_native` (prose) to
  `if_cli_*` (subprocess).
- **What did not work and why:** the code graph was stale/error at startup, so a
  structural `calls_to`/`imports_to` query on the dispatch step was unavailable; I
  compensated with direct Read of the known YAML path, which was sufficient here.
- **What I would do differently:** capture the prompt-pack *template*
  (`prompt_pack_iteration.md.tmpl`) and the actual rendered `prompts/iteration-1.md` to
  see precisely which cues are injected into the leaf prompt vs the orchestrator — this
  would tighten F5 from "cues identified" to "exact prompt text that triggers the
  conflation".

## Recommended Next Focus
- **KQ2 close-out + KQ3 bridge:** inspect the rendered prompt-pack template and a real
  rendered `prompts/iteration-N.md` to confirm exactly which role-identity / dispatch
  wording lands in the leaf prompt vs the orchestrator, and whether any wording
  contradicts the leaf-only invariants. Then begin KQ3 (why GPT-backed loops run
  *slower*: native dispatch = serial in-process sub-agent turn + full re-Read of state
  each iteration; CLI dispatch = subprocess spawn + cold model load) — the
  native-vs-CLI fork found in F4 directly explains a latency component.
- Secondary: KQ4 (which contract steps GPT skips) — the F5 conflation cues predict
  specific likely skips (no real Task dispatch → no fresh context → findings held in
  orchestrator context → reducer refresh skipped).
