# Iteration 1: Foundational Structural Mapping

## Focus
This iteration answered KQ1, KQ2, KQ3, KQ6, and KQ7 by reading the current on-disk OpenCode agent files, command routers, workflow YAML, mode registry, and runtime mirror evidence. The selected interpretation was structural: determine what the runtime surfaces actually encode today, especially whether `subagent_type` is a hard custom-agent identity or a generic wrapper with prompt-injected behavior.

Deferred alternatives: KQ4/KQ5 performance and pre-route prompt edits, KQ8 FIX-5 criteria, KQ9 Claude flexibility details, and KQ10 verification design remain for later iterations.

## Actions Taken
1. Read required state first: prompt pack, config, state log, strategy, and findings registry. [SOURCE: .opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/001-deep-agent-router-and-orchestration/research/prompts/iteration-001.md:21]
2. Enumerated `.opencode/agents/`, `.claude/agents/`, and attempted `.codex/agents/`; `.codex/agents` was not present despite the prompt pack saying it was confirmed on disk. [SOURCE: .opencode/agents/README.txt:8] [SOURCE: .codex/agents Read result: file not found]
3. Read the actual OpenCode deep-agent frontmatter and orchestration dispatch contract. [SOURCE: .opencode/agents/deep-research.md:1] [SOURCE: .opencode/agents/orchestrate.md:157]
4. Read deep command routers and YAML dispatch sites for research/context/review/council. [SOURCE: .opencode/commands/deep/research.md:11] [SOURCE: .opencode/commands/deep/assets/deep_research_auto.yaml:81]
5. Read the mode registry and deep-loop workflow integration notes. [SOURCE: .opencode/skills/deep-loop-workflows/mode-registry.json:18] [SOURCE: .opencode/skills/deep-loop-workflows/README.md:58]

## Findings
1. **CONFIRMED — `subagent_type` is not a hard specialized identity in the current OpenCode orchestration contract; it is normalized to `general` for every custom-agent dispatch.** The orchestrator selection matrix lists every custom agent row with `subagent_type` equal to `"general"`, including `@deep-research` and `@ai-council`; the mandatory loading protocol says to set `subagent_type: "general"` because all custom agents use the general subagent type; the prompt consistency guard calls that value “only the runtime wrapper.” [SOURCE: .opencode/agents/orchestrate.md:97] [SOURCE: .opencode/agents/orchestrate.md:159] [SOURCE: .opencode/agents/orchestrate.md:170]
2. **CONFIRMED — specialization is prompt-injected by loading/including the agent definition file, not by `subagent_type`.** The orchestrator requires reading the agent definition and including its content or summary before dispatch, and explains that telling a general agent “you are @debug” is not equivalent to loading the file because specialized workflow and verification discipline live in the file. [SOURCE: .opencode/agents/orchestrate.md:159] [SOURCE: .opencode/agents/orchestrate.md:164] [SOURCE: .opencode/agents/orchestrate.md:832]
3. **CONFIRMED — the OpenCode agent files declare `mode`, permissions, and tool availability, but the sampled current frontmatter does not declare any per-agent `subagent_type` field.** `orchestrate` is `mode: primary`; `deep-research`, `deep-review`, and `deep-context` are `mode: subagent`; `ai-council` is `mode: all`. [SOURCE: .opencode/agents/orchestrate.md:1] [SOURCE: .opencode/agents/deep-research.md:1] [SOURCE: .opencode/agents/deep-review.md:1] [SOURCE: .opencode/agents/deep-context.md:1] [SOURCE: .opencode/agents/ai-council.md:1]
4. **CONFIRMED — command routers are general-agent-based setup/loop entrypoints, while workflow YAML dispatches native deep seats by `agent: <name>`.** `/deep:research` says command markdown must not dispatch agents and all agent dispatching is owned by YAML; its workflow summary says YAML dispatches fresh `@deep-research` LEAF agents; the YAML dispatch site names `agent: deep-research`, but the surrounding artifact does not show a custom `subagent_type` identity. [SOURCE: .opencode/commands/deep/research.md:13] [SOURCE: .opencode/commands/deep/research.md:79] [SOURCE: .opencode/commands/deep/research.md:151] [SOURCE: .opencode/commands/deep/assets/deep_research_auto.yaml:852]
5. **INFERRED — KQ1’s safest form factor is both: a DEEP primary/runtime-facing agent for top-level routing identity plus the existing `deep-loop-workflows` mode registry as the logic source of truth.** The registry already maps each `workflowMode` to packet, command, agent, and artifact root; the README says routers read the registry and mode packets own convergence/artifacts. Because current `subagent_type` does not carry specialized identity, a DEEP agent would mainly harden first-dispatch/top-level prompt identity, while the skill registry remains the durable mode discriminator. [SOURCE: .opencode/skills/deep-loop-workflows/mode-registry.json:20] [SOURCE: .opencode/skills/deep-loop-workflows/mode-registry.json:34] [SOURCE: .opencode/skills/deep-loop-workflows/mode-registry.json:66] [SOURCE: .opencode/skills/deep-loop-workflows/README.md:58] [INFERENCE: based on findings 1-4]
6. **INFERRED — KQ2’s smallest host-runtime change is a native dispatch field that resolves a custom agent name as runtime identity and automatically loads/enforces that agent file, rather than treating all custom dispatches as `general` plus prompt text.** Current evidence shows `subagent_type: "general"` is required for all custom agents, and the safety burden is prompt consistency rather than runtime identity enforcement. [SOURCE: .opencode/agents/orchestrate.md:162] [SOURCE: .opencode/agents/orchestrate.md:174] [SOURCE: .opencode/agents/orchestrate.md:832] [INFERENCE: host support would need to move agent-file loading/identity from prompt convention into the Task/Agent dispatch boundary]
7. **CONFIRMED — KQ3 hardening can safely adjust orchestrator routing prose, selection rows, prompt consistency checks, and explicit deep-target packaging, but cannot by itself create a hard specialized runtime identity.** The orchestrator owns task decomposition and delegation, is explicitly single-hop, requires actual agent files before dispatch, and has a task format with `Agent:` and `Subagent Type: "general"`; these are prompt/contract surfaces, not host identity changes. [SOURCE: .opencode/agents/orchestrate.md:20] [SOURCE: .opencode/agents/orchestrate.md:42] [SOURCE: .opencode/agents/orchestrate.md:157] [SOURCE: .opencode/agents/orchestrate.md:196]
8. **CONFIRMED — KQ6: `ai-council` is already dual-reachable in principle because it is `mode: all`, supports direct depth-0 behavior and depth-1 inline behavior, and the registry maps deep council workflow mode to the same `ai-council` agent name.** The prompt pack’s statement that `ai-council.md` is `mode: primary` is not corroborated by the current file; current frontmatter says `mode: all`. [SOURCE: .opencode/agents/ai-council.md:1] [SOURCE: .opencode/agents/ai-council.md:53] [SOURCE: .opencode/agents/ai-council.md:57] [SOURCE: .opencode/skills/deep-loop-workflows/mode-registry.json:66]
9. **CONFIRMED — KQ7: OpenCode and Claude mirrors exist with matching deep-agent names but different frontmatter formats; Codex is absent on disk, and mirror documentation is internally inconsistent.** `.opencode/agents/README.txt` says sibling runtimes are `.claude/agents/` and `.codex/agents/` with `.codex` TOML, while the runtime skill says there should be one canonical source plus two runtime mirrors and warns that missing mirrors silently drop native seats; however it names `.opencode/agents/<name>.toml` rather than `.codex/agents/<name>.toml`, and no `**/agents/*.toml` files were found. [SOURCE: .opencode/agents/README.txt:4] [SOURCE: .opencode/agents/README.txt:8] [SOURCE: .claude/agents/orchestrate.md:1] [SOURCE: .claude/agents/deep-research.md:1] [SOURCE: .opencode/skills/deep-loop-runtime/SKILL.md:253] [SOURCE: .opencode/skills/deep-loop-runtime/SKILL.md:261]

## Questions Answered
- **KQ1 — DEEP agent form factor:** Both. Use a DEEP primary/top-level agent if the goal is first-dispatch identity, but keep mode selection and logic in `deep-loop-workflows` / `mode-registry.json`; current OpenCode dispatch does not support specialized `subagent_type` identities for named deep sub-agents. [INFERENCE: based on findings 1, 4, 5]
- **KQ2 — subagent_type specialization feasibility:** Today, every custom-agent Task dispatch is treated as `subagent_type: "general"`; specialization survives only through prompt-injected agent-definition content. Enabling hard specialization requires host-runtime support for named custom-agent identity/loading. [SOURCE: .opencode/agents/orchestrate.md:162] [SOURCE: .opencode/agents/orchestrate.md:174]
- **KQ3 — Orchestrate hardening boundary:** Orchestrate can harden routing tables, prompt consistency guards, and deep-target dispatch package construction without breaking parity, but that remains prompt-contract hardening unless the host runtime changes. [SOURCE: .opencode/agents/orchestrate.md:170] [SOURCE: .opencode/agents/orchestrate.md:196]
- **KQ6 — ai-council dual reachability:** Preserve direct invocation by keeping `ai-council` as `mode: all`; the DEEP router should reference council as a target/mode without converting it to subagent-only. [SOURCE: .opencode/agents/ai-council.md:1] [SOURCE: .opencode/skills/deep-loop-workflows/mode-registry.json:66]
- **KQ7 — Cross-runtime parity:** Mirror the same agent bodies/names across OpenCode and Claude; Codex mirror expectations are documented but not present on disk. Drift can make native seats drop in the missing runtime. [SOURCE: .opencode/skills/deep-loop-runtime/SKILL.md:255] [SOURCE: .opencode/skills/deep-loop-runtime/SKILL.md:261]

## Questions Remaining
- KQ4 — quantify GPT slowness mechanism from prompt/YAML role negotiation and context carriage.
- KQ5 — concrete pre-route prompt edits and target shape.
- KQ8 — FIX-5 decision criterion.
- KQ9 — precise Claude-flexibility behaviors to preserve.
- KQ10 — first-dispatch correctness measurement.

## Ruled Out
- Treating `subagent_type` as a current per-agent declaration was ruled out for the sampled live agent files: the evidence found `mode` fields and orchestrator-mandated `subagent_type: "general"`, not per-agent `subagent_type` declarations. [SOURCE: .opencode/agents/deep-research.md:1] [SOURCE: .opencode/agents/orchestrate.md:162]
- Treating `.codex/agents/` as confirmed-present was ruled out by direct read failure and zero TOML matches. [SOURCE: .codex/agents Read result: file not found] [SOURCE: Glob **/agents/*.toml result: no files found]

## Dead Ends
- Searching for a current hard custom-agent `subagent_type` field in `.opencode/` produced only orchestrator prose, archived/spec references, and `mode:` frontmatter; no current live agent schema evidence supported custom specialized `subagent_type` declarations. [SOURCE: .opencode/agents/orchestrate.md:162] [SOURCE: .opencode/agents/orchestrate.md:207]

## Edge Cases
- **Ambiguous input:** The prompt pack said `ai-council.md` is `mode: primary`, but the actual OpenCode file says `mode: all`; current file evidence prevailed, and the discrepancy is recorded for reducer follow-up. [SOURCE: .opencode/agents/ai-council.md:1]
- **Contradictory evidence:** The prompt pack and README refer to `.codex/agents/`, while the runtime skill says `.opencode/agents/<name>.toml`; `.codex` was absent and no agent TOML files were found. [SOURCE: .opencode/agents/README.txt:8] [SOURCE: .opencode/skills/deep-loop-runtime/SKILL.md:257] [SOURCE: .codex/agents Read result: file not found]
- **Missing dependencies:** `.codex/agents/` was unavailable, so Codex parity could not be line-compared beyond documenting the missing surface.
- **Partial success:** None for the five targeted KQs; all targeted KQs have evidence-backed answers, with KQ7 carrying an explicit missing Codex mirror caveat.

## Sources Consulted
- `.opencode/agents/orchestrate.md:1-230`, `:800-869`
- `.opencode/agents/deep-research.md:1-80`
- `.opencode/agents/deep-review.md:1-90`
- `.opencode/agents/deep-context.md:1-80`
- `.opencode/agents/ai-council.md:1-180`
- `.opencode/agents/README.txt:1-23`
- `.claude/agents/orchestrate.md:1-40`
- `.claude/agents/deep-research.md:1-35`
- `.claude/agents/ai-council.md:1-70`
- `.opencode/commands/deep/research.md:1-153`
- `.opencode/commands/deep/review.md:1-120`
- `.opencode/commands/deep/context.md:1-118`
- `.opencode/commands/deep/ai-council.md:1-128`
- `.opencode/commands/deep/assets/deep_research_auto.yaml:70-94`, `:160-181`, `:840-869`
- `.opencode/commands/deep/assets/deep_context_auto.yaml:400-429`
- `.opencode/skills/deep-loop-workflows/mode-registry.json:1-147`
- `.opencode/skills/deep-loop-workflows/README.md:36-95`
- `.opencode/skills/deep-loop-runtime/SKILL.md:253-261`

## Assessment
- New information ratio: 0.95
- Questions addressed: KQ1, KQ2, KQ3, KQ6, KQ7
- Questions answered: KQ1, KQ2, KQ3, KQ6, KQ7
- Novelty justification: all five targeted structural questions received net-new file-backed answers; one caveat remains for missing Codex mirror evidence.

## Reflection
- What worked and why: Reading the dispatch contract before broader inference isolated the load-bearing fact: `subagent_type: "general"` is explicitly documented as the runtime wrapper, so downstream design can stop treating custom `subagent_type` specialization as available today. [SOURCE: .opencode/agents/orchestrate.md:174]
- What did not work and why: Cross-runtime comparison could not include Codex because the directory and TOML mirrors were absent, and mirror docs conflict on the expected TOML location. [SOURCE: .opencode/skills/deep-loop-runtime/SKILL.md:259]
- What I would do differently: In iteration 2, read the YAML prompt-rendering and dispatch implementation paths to separate role-negotiation overhead from dispatch identity gaps.

## Recommended Next Focus
Iteration 2 should answer KQ4 and KQ5 together: trace where deep command/YAML prompts negotiate roles versus pre-resolve targets, quantify context/verbosity cost, and propose the smallest prompt-shape changes that reduce GPT first-dispatch ambiguity without altering the host runtime.
