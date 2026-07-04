# Deep Research Strategy - Deep-Agent Router & Orchestration Hardening (GPT-backed OpenCode)

## 1. OVERVIEW

Session tracking for the deep-research loop seeded by `research-prompt.md`. Topic: make GPT-backed OpenCode reliably invoke deep skills (research/review/context/ai-council) on first dispatch, quickly, without sacrificing Claude's flexibility. Deliverable = evidence-backed implementation design for three structural changes (DEEP primary agent, orchestrate hardening, command/skill refinement).

## 2. TOPIC

Deep-agent router & orchestration hardening for GPT-backed OpenCode.

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [ ] DEEP agent form factor: new standalone .opencode/agents/deep.md, enhancement to deep-loop-workflows mode-registry router, or both? What does OpenCode's agent dispatch model support for primary-agent dispatch to named sub-agents / specialized subagent_type?
- [ ] Can agent files declare a per-agent subagent_type that survives dispatch as hard runtime identity, or is every dispatch normalized to 'general'? Smallest host-runtime change to enable it; in scope or follow-up?
- [ ] How much can orchestrate.md change deep-loop dispatch behavior without breaking Claude Code parity and Claude's adaptive flexibility? What specifically carries deep dispatch today?
- [ ] Why is GPT slower than Claude even in fast mode with deep skills? Role-negotiation overhead, prompt verbosity, redundant context carriage, or other? Quantify from YAMLs and dispatch prose.
- [ ] What concrete prompt-structure changes convert runtime role-negotiation into up-front pre-routing? Where is the role negotiated today; what does pre-resolved target look like?
- [ ] How should DEEP router include ai-council without breaking its direct invocability, given ai-council.md is mode: primary today?
- [ ] What must be mirrored across .opencode/agents/, .claude/agents/, .codex/agents/? Sync convention or hand-mirrored? What breaks on drift?
- [ ] Under what conditions does the agent-layer fix prove insufficient and FIX-5 (native->CLI subprocess executor) becomes mandatory? Give a clear decision criterion.
- [ ] What specific Claude-flexible behaviors must NOT be constrained away? Identify adaptive behaviors so GPT refinements target mis-invocation signals, not legitimate flexibility.
- [ ] How to measure 'GPT invokes the correct deep agent on the first dispatch'? Dispatch provenance observable, or need a probe? Minimal before/after test.
- [ ] KQ1 — DEEP agent form factor (standalone agent vs mode-registry enhancement vs both); OpenCode dispatch model support for specialized subagent_type. Cite agent frontmatter schema, Task tool subagent_type contract, orchestrate.md.
- [ ] KQ2 — subagent_type specialization feasibility (hard runtime identity vs normalized to general); smallest host-runtime change; in scope or follow-up. Cite opencode agent spec, orchestrate.md ILLEGAL NESTING.
- [ ] KQ3 — Orchestrate hardening boundary: what can change without breaking Claude parity/flexibility; what carries deep dispatch today.
- [ ] KQ4 — GPT slowness mechanism (role-negotiation overhead vs verbosity vs context carriage vs other). Quantify from deep command YAMLs and dispatch prose.
- [ ] KQ5 — Pre-route vs negotiate: concrete prompt-structure edits; where role is negotiated today; pre-resolved target shape.
- [ ] KQ6 — ai-council dual reachability (DEEP sub-agent target AND directly invocable primary). Cite ai-council.md.
- [ ] KQ7 — Cross-runtime parity (.opencode/.claude/.codex agents); sync convention or hand-mirrored; drift breakage.
- [ ] KQ8 — FIX-5 decision criterion: when does the agent-layer fix prove insufficient and FIX-5 (native->CLI subprocess, process isolation) become mandatory.
- [ ] KQ9 — Claude flexibility preservation: identify adaptive behaviors to NOT constrain away.
- [ ] KQ10 — Verification strategy: how to measure first-dispatch correctness; minimal before/after test.

<!-- /ANCHOR:key-questions -->

## 4. NON-GOALS

- Do not implement code; this research produces a design, not a patch.
- Do not re-derive the root cause (soft identity boundary) — treated as operator-asserted axiom per research-prompt section 2.
- Do not over-constrain Claude — goal is GPT adherence WITHOUT losing Claude flexibility.
- Do not investigate the validator hardening patch (cited phase does not exist on disk).
- Do not build new benchmark/telemetry tooling — measure with what exists.

## 5. STOP CONDITIONS

- Stop when KQ1-KQ8 have evidence-backed answers with file:line citations.
- Stop if subagent_type specialization proves infeasible at the agent layer AND the host-runtime change is clearly out of scope (then FIX-5 becomes the documented ceiling).
- Stop at max iterations (8) if novelty ratio does not converge.

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
[None yet]

<!-- /ANCHOR:answered-questions -->

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- Reading the dispatch contract before broader inference isolated the load-bearing fact: `subagent_type: "general"` is explicitly documented as the runtime wrapper, so downstream design can stop treating custom `subagent_type` specialization as available today. [SOURCE: .opencode/agents/orchestrate.md:174] (iteration 1)
- Measuring the rendered prompt pack separately from the workflow YAML prevented a false conclusion that the 1,510-line YAML is injected into every leaf; the dispatch lines show the leaf receives a rendered prompt pack. [SOURCE: .opencode/commands/deep/assets/deep_research_auto.yaml:825] [SOURCE: .opencode/commands/deep/assets/deep_research_auto.yaml:856] (iteration 2)
- Reusing iterations 1-2 kept this pass from re-deriving the soft-identity and role-overhead findings, so the new work could turn them into an observable escalation criterion. [SOURCE: .opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/001-deep-agent-router-and-orchestration/research/iterations/iteration-001.md:16] [SOURCE: .opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/001-deep-agent-router-and-orchestration/research/iterations/iteration-002.md:16] (iteration 3)
- Reusing iterations 1-3 avoided re-litigating the soft identity boundary and allowed the iteration to spend its budget on a concrete, reviewable `deep.md` draft. [SOURCE: .opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/001-deep-agent-router-and-orchestration/research/iterations/iteration-001.md:16] [SOURCE: .opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/001-deep-agent-router-and-orchestration/research/iterations/iteration-003.md:20] (iteration 4)
- Walking every failure signal against a concrete artifact shape exposed the difference between schema/artifact correctness and semantic route correctness; that separated a real blind spot from the trigger cases that already fire. [SOURCE: .opencode/commands/deep/assets/deep_research_auto.yaml:957] [SOURCE: .opencode/commands/deep/assets/deep_research_auto.yaml:968] (iteration 5)
- Splitting “frontmatter/config/dispatch primitive” into separate possibilities prevented a frontmatter-only false fix; the inspected contract surfaces show hard identity must be bound at dispatch, not just declared in Markdown. [SOURCE: .opencode/agents/orchestrate.md:174] [SOURCE: opencode.json:2] (iteration 6)

<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- Cross-runtime comparison could not include Codex because the directory and TOML mirrors were absent, and mirror docs conflict on the expected TOML location. [SOURCE: .opencode/skills/deep-loop-runtime/SKILL.md:259] (iteration 1)
- The requested files did not contain direct GPT-vs-Claude wall-clock logs, so latency remains mechanism-level rather than benchmark-level. [SOURCE: .opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/001-deep-agent-router-and-orchestration/research/prompts/iteration-002.md:47] (iteration 2)
- Current-packet `observability-events.jsonl` was not present, so the strategy uses the existing emission path and validator/state records rather than a current observability sample. [SOURCE: .opencode/commands/deep/assets/deep_research_auto.yaml:432] (iteration 3)
- The operator-requested example fields `model`/`color` were not present in the actual frontmatter samples, so the draft excluded them to match verified conventions rather than inferred style. [SOURCE: .opencode/agents/orchestrate.md:1] [SOURCE: .opencode/agents/ai-council.md:1] (iteration 4)
- Context and council do not mirror research/review's simple prompt-template-plus-CLI-branch shape, so their pre-route edits require mode-specific placement rather than copy-paste. [SOURCE: .opencode/commands/deep/assets/deep_context_auto.yaml:379] [SOURCE: .opencode/commands/deep/assets/deep_ai-council_auto.yaml:117] (iteration 5)
- Host implementation internals are outside this workspace, so effort estimation remains contract-surface based rather than code-diff based. [SOURCE: .opencode/skills/cli-opencode/SKILL.md:390] (iteration 6)

<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### Building a new benchmark/probe harness was ruled out because the workflow already has state-log append validation, delta-file validation, observability envelopes, and executor audit/failure records. [SOURCE: .opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/001-deep-agent-router-and-orchestration/research/prompts/iteration-003.md:43] [SOURCE: .opencode/commands/deep/assets/deep_research_auto.yaml:940] -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Building a new benchmark/probe harness was ruled out because the workflow already has state-log append validation, delta-file validation, observability envelopes, and executor audit/failure records. [SOURCE: .opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/001-deep-agent-router-and-orchestration/research/prompts/iteration-003.md:43] [SOURCE: .opencode/commands/deep/assets/deep_research_auto.yaml:940]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Building a new benchmark/probe harness was ruled out because the workflow already has state-log append validation, delta-file validation, observability envelopes, and executor audit/failure records. [SOURCE: .opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/001-deep-agent-router-and-orchestration/research/prompts/iteration-003.md:43] [SOURCE: .opencode/commands/deep/assets/deep_research_auto.yaml:940]

### Creating the real `.opencode/agents/deep.md` was ruled out because this iteration's prompt explicitly made implementation a non-goal and required the draft to live inside `iteration-004.md`. [SOURCE: .opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/001-deep-agent-router-and-orchestration/research/prompts/iteration-004.md:38] -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Creating the real `.opencode/agents/deep.md` was ruled out because this iteration's prompt explicitly made implementation a non-goal and required the draft to live inside `iteration-004.md`. [SOURCE: .opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/001-deep-agent-router-and-orchestration/research/prompts/iteration-004.md:38]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Creating the real `.opencode/agents/deep.md` was ruled out because this iteration's prompt explicitly made implementation a non-goal and required the draft to live inside `iteration-004.md`. [SOURCE: .opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/001-deep-agent-router-and-orchestration/research/prompts/iteration-004.md:38]

### No new blocked dead end. The iteration avoided retrying the blocked `subagent_type` specialization search from iteration 1 and used that result only as prior context. [SOURCE: .opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/001-deep-agent-router-and-orchestration/research/iterations/iteration-001.md:40] -- BLOCKED (iteration 2, 1 attempts)
- What was tried: No new blocked dead end. The iteration avoided retrying the blocked `subagent_type` specialization search from iteration 1 and used that result only as prior context. [SOURCE: .opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/001-deep-agent-router-and-orchestration/research/iterations/iteration-001.md:40]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No new blocked dead end. The iteration avoided retrying the blocked `subagent_type` specialization search from iteration 1 and used that result only as prior context. [SOURCE: .opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/001-deep-agent-router-and-orchestration/research/iterations/iteration-001.md:40]

### No new blocked implementation dead end. The iteration avoided re-searching the already-blocked custom `subagent_type` specialization path and used it only as prior context. [SOURCE: .opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/001-deep-agent-router-and-orchestration/research/deep-research-strategy.md:82] -- BLOCKED (iteration 3, 1 attempts)
- What was tried: No new blocked implementation dead end. The iteration avoided re-searching the already-blocked custom `subagent_type` specialization path and used it only as prior context. [SOURCE: .opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/001-deep-agent-router-and-orchestration/research/deep-research-strategy.md:82]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No new blocked implementation dead end. The iteration avoided re-searching the already-blocked custom `subagent_type` specialization path and used it only as prior context. [SOURCE: .opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/001-deep-agent-router-and-orchestration/research/deep-research-strategy.md:82]

### No new blocked path. Host internals are not inspectable from this workspace, so the host change is specified at the contract surface and recommended as an upstream/FIX-5-alternative follow-up rather than packet-local implementation. [SOURCE: opencode.json:2] [SOURCE: .opencode/skills/cli-opencode/SKILL.md:390] -- BLOCKED (iteration 6, 1 attempts)
- What was tried: No new blocked path. Host internals are not inspectable from this workspace, so the host change is specified at the contract surface and recommended as an upstream/FIX-5-alternative follow-up rather than packet-local implementation. [SOURCE: opencode.json:2] [SOURCE: .opencode/skills/cli-opencode/SKILL.md:390]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No new blocked path. Host internals are not inspectable from this workspace, so the host change is specified at the contract surface and recommended as an upstream/FIX-5-alternative follow-up rather than packet-local implementation. [SOURCE: opencode.json:2] [SOURCE: .opencode/skills/cli-opencode/SKILL.md:390]

### No new blocked research path. The pass avoided implementing runtime files and stayed on evidence-backed pre-route edits and validator analysis. [SOURCE: .opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/001-deep-agent-router-and-orchestration/research/prompts/iteration-005.md:29] -- BLOCKED (iteration 5, 1 attempts)
- What was tried: No new blocked research path. The pass avoided implementing runtime files and stayed on evidence-backed pre-route edits and validator analysis. [SOURCE: .opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/001-deep-agent-router-and-orchestration/research/prompts/iteration-005.md:29]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No new blocked research path. The pass avoided implementing runtime files and stayed on evidence-backed pre-route edits and validator analysis. [SOURCE: .opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/001-deep-agent-router-and-orchestration/research/prompts/iteration-005.md:29]

### No new dead-end research path. The iteration produced a concrete artifact from existing evidence rather than reopening prior blocked approaches. [SOURCE: .opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/001-deep-agent-router-and-orchestration/research/deep-research-strategy.md:157] -- BLOCKED (iteration 4, 1 attempts)
- What was tried: No new dead-end research path. The iteration produced a concrete artifact from existing evidence rather than reopening prior blocked approaches. [SOURCE: .opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/001-deep-agent-router-and-orchestration/research/deep-research-strategy.md:157]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No new dead-end research path. The iteration produced a concrete artifact from existing evidence rather than reopening prior blocked approaches. [SOURCE: .opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/001-deep-agent-router-and-orchestration/research/deep-research-strategy.md:157]

### Retrying the blocked custom `subagent_type` specialization path was ruled out; this iteration only used the prior finding that all custom-agent dispatches use `general`. [SOURCE: .opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/001-deep-agent-router-and-orchestration/research/deep-research-strategy.md:94] [SOURCE: .opencode/agents/orchestrate.md:162] -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Retrying the blocked custom `subagent_type` specialization path was ruled out; this iteration only used the prior finding that all custom-agent dispatches use `general`. [SOURCE: .opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/001-deep-agent-router-and-orchestration/research/deep-research-strategy.md:94] [SOURCE: .opencode/agents/orchestrate.md:162]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Retrying the blocked custom `subagent_type` specialization path was ruled out; this iteration only used the prior finding that all custom-agent dispatches use `general`. [SOURCE: .opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/001-deep-agent-router-and-orchestration/research/deep-research-strategy.md:94] [SOURCE: .opencode/agents/orchestrate.md:162]

### Searching for a current hard custom-agent `subagent_type` field in `.opencode/` produced only orchestrator prose, archived/spec references, and `mode:` frontmatter; no current live agent schema evidence supported custom specialized `subagent_type` declarations. [SOURCE: .opencode/agents/orchestrate.md:162] [SOURCE: .opencode/agents/orchestrate.md:207] -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Searching for a current hard custom-agent `subagent_type` field in `.opencode/` produced only orchestrator prose, archived/spec references, and `mode:` frontmatter; no current live agent schema evidence supported custom specialized `subagent_type` declarations. [SOURCE: .opencode/agents/orchestrate.md:162] [SOURCE: .opencode/agents/orchestrate.md:207]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Searching for a current hard custom-agent `subagent_type` field in `.opencode/` produced only orchestrator prose, archived/spec references, and `mode:` frontmatter; no current live agent schema evidence supported custom specialized `subagent_type` declarations. [SOURCE: .opencode/agents/orchestrate.md:162] [SOURCE: .opencode/agents/orchestrate.md:207]

### Treating `.codex/agents/` as confirmed-present was ruled out by direct read failure and zero TOML matches. [SOURCE: .codex/agents Read result: file not found] [SOURCE: Glob **/agents/*.toml result: no files found] -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Treating `.codex/agents/` as confirmed-present was ruled out by direct read failure and zero TOML matches. [SOURCE: .codex/agents Read result: file not found] [SOURCE: Glob **/agents/*.toml result: no files found]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating `.codex/agents/` as confirmed-present was ruled out by direct read failure and zero TOML matches. [SOURCE: .codex/agents Read result: file not found] [SOURCE: Glob **/agents/*.toml result: no files found]

### Treating `subagent_type` as a current per-agent declaration was ruled out for the sampled live agent files: the evidence found `mode` fields and orchestrator-mandated `subagent_type: "general"`, not per-agent `subagent_type` declarations. [SOURCE: .opencode/agents/deep-research.md:1] [SOURCE: .opencode/agents/orchestrate.md:162] -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Treating `subagent_type` as a current per-agent declaration was ruled out for the sampled live agent files: the evidence found `mode` fields and orchestrator-mandated `subagent_type: "general"`, not per-agent `subagent_type` declarations. [SOURCE: .opencode/agents/deep-research.md:1] [SOURCE: .opencode/agents/orchestrate.md:162]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating `subagent_type` as a current per-agent declaration was ruled out for the sampled live agent files: the evidence found `mode` fields and orchestrator-mandated `subagent_type: "general"`, not per-agent `subagent_type` declarations. [SOURCE: .opencode/agents/deep-research.md:1] [SOURCE: .opencode/agents/orchestrate.md:162]

### Treating a new agent frontmatter field such as `subagent_type: deep-research` as sufficient was ruled out: current files use `mode`, and a frontmatter-only field would not bind runtime identity unless the host resolver enforces it. [SOURCE: .opencode/agents/deep-research.md:4] [SOURCE: .opencode/agents/orchestrate.md:162] [INFERENCE: runtime enforcement is required] -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Treating a new agent frontmatter field such as `subagent_type: deep-research` as sufficient was ruled out: current files use `mode`, and a frontmatter-only field would not bind runtime identity unless the host resolver enforces it. [SOURCE: .opencode/agents/deep-research.md:4] [SOURCE: .opencode/agents/orchestrate.md:162] [INFERENCE: runtime enforcement is required]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating a new agent frontmatter field such as `subagent_type: deep-research` as sufficient was ruled out: current files use `mode`, and a frontmatter-only field would not bind runtime identity unless the host resolver enforces it. [SOURCE: .opencode/agents/deep-research.md:4] [SOURCE: .opencode/agents/orchestrate.md:162] [INFERENCE: runtime enforcement is required]

### Treating council as native-only was ruled out: the YAML has `executor.cli` input, but the actual CLI dispatch is indirect via `orchestrate-session.cjs`, not a YAML `if_cli_opencode` branch. [SOURCE: .opencode/commands/deep/assets/deep_ai-council_auto.yaml:24] [SOURCE: .opencode/commands/deep/assets/deep_ai-council_auto.yaml:119] -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Treating council as native-only was ruled out: the YAML has `executor.cli` input, but the actual CLI dispatch is indirect via `orchestrate-session.cjs`, not a YAML `if_cli_opencode` branch. [SOURCE: .opencode/commands/deep/assets/deep_ai-council_auto.yaml:24] [SOURCE: .opencode/commands/deep/assets/deep_ai-council_auto.yaml:119]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating council as native-only was ruled out: the YAML has `executor.cli` input, but the actual CLI dispatch is indirect via `orchestrate-session.cjs`, not a YAML `if_cli_opencode` branch. [SOURCE: .opencode/commands/deep/assets/deep_ai-council_auto.yaml:24] [SOURCE: .opencode/commands/deep/assets/deep_ai-council_auto.yaml:119]

### Treating FIX-5 as mandatory merely because `subagent_type` cannot specialize was ruled out: prior evidence makes that the structural ceiling, but KQ8 needs an observable post-fix failure trigger, not just the existence of a soft identity boundary. [SOURCE: .opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/001-deep-agent-router-and-orchestration/research/iterations/iteration-001.md:21] -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Treating FIX-5 as mandatory merely because `subagent_type` cannot specialize was ruled out: prior evidence makes that the structural ceiling, but KQ8 needs an observable post-fix failure trigger, not just the existence of a soft identity boundary. [SOURCE: .opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/001-deep-agent-router-and-orchestration/research/iterations/iteration-001.md:21]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating FIX-5 as mandatory merely because `subagent_type` cannot specialize was ruled out: prior evidence makes that the structural ceiling, but KQ8 needs an observable post-fix failure trigger, not just the existence of a soft identity boundary. [SOURCE: .opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/001-deep-agent-router-and-orchestration/research/iterations/iteration-001.md:21]

### Treating FIX-5 as the immediate next step was ruled out for this phase: iteration 5's blind spot first calls for route-proof fields in current validators, while hard host identity and process isolation remain follow-ups if GPT still misroutes. [SOURCE: .opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/001-deep-agent-router-and-orchestration/research/iterations/iteration-005.md:50] -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Treating FIX-5 as the immediate next step was ruled out for this phase: iteration 5's blind spot first calls for route-proof fields in current validators, while hard host identity and process isolation remain follow-ups if GPT still misroutes. [SOURCE: .opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/001-deep-agent-router-and-orchestration/research/iterations/iteration-005.md:50]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating FIX-5 as the immediate next step was ruled out for this phase: iteration 5's blind spot first calls for route-proof fields in current validators, while hard host identity and process isolation remain follow-ups if GPT still misroutes. [SOURCE: .opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/001-deep-agent-router-and-orchestration/research/iterations/iteration-005.md:50]

### Treating full `deep_research_auto.yaml` or sibling YAML size as the direct per-leaf injected payload was ruled out for native research dispatch: the YAML renders a prompt pack and sends `context_source: "rendered_prompt_pack"`. [SOURCE: .opencode/commands/deep/assets/deep_research_auto.yaml:825] [SOURCE: .opencode/commands/deep/assets/deep_research_auto.yaml:856] -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Treating full `deep_research_auto.yaml` or sibling YAML size as the direct per-leaf injected payload was ruled out for native research dispatch: the YAML renders a prompt pack and sends `context_source: "rendered_prompt_pack"`. [SOURCE: .opencode/commands/deep/assets/deep_research_auto.yaml:825] [SOURCE: .opencode/commands/deep/assets/deep_research_auto.yaml:856]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating full `deep_research_auto.yaml` or sibling YAML size as the direct per-leaf injected payload was ruled out for native research dispatch: the YAML renders a prompt pack and sends `context_source: "rendered_prompt_pack"`. [SOURCE: .opencode/commands/deep/assets/deep_research_auto.yaml:825] [SOURCE: .opencode/commands/deep/assets/deep_research_auto.yaml:856]

### Treating state-log carriage as the dominant prompt payload was ruled out: the prompt pack carries file paths and summaries while state remains externalized in config/state/strategy files. [SOURCE: .opencode/skills/deep-loop-workflows/deep-research/assets/prompt_pack_iteration.md.tmpl:19] [SOURCE: .opencode/commands/deep/assets/deep_research_auto.yaml:477] -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Treating state-log carriage as the dominant prompt payload was ruled out: the prompt pack carries file paths and summaries while state remains externalized in config/state/strategy files. [SOURCE: .opencode/skills/deep-loop-workflows/deep-research/assets/prompt_pack_iteration.md.tmpl:19] [SOURCE: .opencode/commands/deep/assets/deep_research_auto.yaml:477]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating state-log carriage as the dominant prompt payload was ruled out: the prompt pack carries file paths and summaries while state remains externalized in config/state/strategy files. [SOURCE: .opencode/skills/deep-loop-workflows/deep-research/assets/prompt_pack_iteration.md.tmpl:19] [SOURCE: .opencode/commands/deep/assets/deep_research_auto.yaml:477]

### Treating the FIX-5 trigger as complete just because it catches schema/artifact failures was ruled out; it misses semantically wrong-mode but schema-correct artifacts. [INFERENCE: based on finding 5 and `.opencode/commands/deep/assets/deep_research_auto.yaml:940-968`] -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Treating the FIX-5 trigger as complete just because it catches schema/artifact failures was ruled out; it misses semantically wrong-mode but schema-correct artifacts. [INFERENCE: based on finding 5 and `.opencode/commands/deep/assets/deep_research_auto.yaml:940-968`]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the FIX-5 trigger as complete just because it catches schema/artifact failures was ruled out; it misses semantically wrong-mode but schema-correct artifacts. [INFERENCE: based on finding 5 and `.opencode/commands/deep/assets/deep_research_auto.yaml:940-968`]

<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- Searching for a current hard custom-agent `subagent_type` field in `.opencode/` produced only orchestrator prose, archived/spec references, and `mode:` frontmatter; no current live agent schema evidence supported custom specialized `subagent_type` declarations. [SOURCE: .opencode/agents/orchestrate.md:162] [SOURCE: .opencode/agents/orchestrate.md:207] (iteration 1)
- Treating `.codex/agents/` as confirmed-present was ruled out by direct read failure and zero TOML matches. [SOURCE: .codex/agents Read result: file not found] [SOURCE: Glob **/agents/*.toml result: no files found] (iteration 1)
- Treating `subagent_type` as a current per-agent declaration was ruled out for the sampled live agent files: the evidence found `mode` fields and orchestrator-mandated `subagent_type: "general"`, not per-agent `subagent_type` declarations. [SOURCE: .opencode/agents/deep-research.md:1] [SOURCE: .opencode/agents/orchestrate.md:162] (iteration 1)
- No new blocked dead end. The iteration avoided retrying the blocked `subagent_type` specialization search from iteration 1 and used that result only as prior context. [SOURCE: .opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/001-deep-agent-router-and-orchestration/research/iterations/iteration-001.md:40] (iteration 2)
- Treating full `deep_research_auto.yaml` or sibling YAML size as the direct per-leaf injected payload was ruled out for native research dispatch: the YAML renders a prompt pack and sends `context_source: "rendered_prompt_pack"`. [SOURCE: .opencode/commands/deep/assets/deep_research_auto.yaml:825] [SOURCE: .opencode/commands/deep/assets/deep_research_auto.yaml:856] (iteration 2)
- Treating state-log carriage as the dominant prompt payload was ruled out: the prompt pack carries file paths and summaries while state remains externalized in config/state/strategy files. [SOURCE: .opencode/skills/deep-loop-workflows/deep-research/assets/prompt_pack_iteration.md.tmpl:19] [SOURCE: .opencode/commands/deep/assets/deep_research_auto.yaml:477] (iteration 2)
- Building a new benchmark/probe harness was ruled out because the workflow already has state-log append validation, delta-file validation, observability envelopes, and executor audit/failure records. [SOURCE: .opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/001-deep-agent-router-and-orchestration/research/prompts/iteration-003.md:43] [SOURCE: .opencode/commands/deep/assets/deep_research_auto.yaml:940] (iteration 3)
- No new blocked implementation dead end. The iteration avoided re-searching the already-blocked custom `subagent_type` specialization path and used it only as prior context. [SOURCE: .opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/001-deep-agent-router-and-orchestration/research/deep-research-strategy.md:82] (iteration 3)
- Treating FIX-5 as mandatory merely because `subagent_type` cannot specialize was ruled out: prior evidence makes that the structural ceiling, but KQ8 needs an observable post-fix failure trigger, not just the existence of a soft identity boundary. [SOURCE: .opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/001-deep-agent-router-and-orchestration/research/iterations/iteration-001.md:21] (iteration 3)
- Creating the real `.opencode/agents/deep.md` was ruled out because this iteration's prompt explicitly made implementation a non-goal and required the draft to live inside `iteration-004.md`. [SOURCE: .opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/001-deep-agent-router-and-orchestration/research/prompts/iteration-004.md:38] (iteration 4)
- No new dead-end research path. The iteration produced a concrete artifact from existing evidence rather than reopening prior blocked approaches. [SOURCE: .opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/001-deep-agent-router-and-orchestration/research/deep-research-strategy.md:157] (iteration 4)
- Retrying the blocked custom `subagent_type` specialization path was ruled out; this iteration only used the prior finding that all custom-agent dispatches use `general`. [SOURCE: .opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/001-deep-agent-router-and-orchestration/research/deep-research-strategy.md:94] [SOURCE: .opencode/agents/orchestrate.md:162] (iteration 4)
- No new blocked research path. The pass avoided implementing runtime files and stayed on evidence-backed pre-route edits and validator analysis. [SOURCE: .opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/001-deep-agent-router-and-orchestration/research/prompts/iteration-005.md:29] (iteration 5)
- Treating council as native-only was ruled out: the YAML has `executor.cli` input, but the actual CLI dispatch is indirect via `orchestrate-session.cjs`, not a YAML `if_cli_opencode` branch. [SOURCE: .opencode/commands/deep/assets/deep_ai-council_auto.yaml:24] [SOURCE: .opencode/commands/deep/assets/deep_ai-council_auto.yaml:119] (iteration 5)
- Treating the FIX-5 trigger as complete just because it catches schema/artifact failures was ruled out; it misses semantically wrong-mode but schema-correct artifacts. [INFERENCE: based on finding 5 and `.opencode/commands/deep/assets/deep_research_auto.yaml:940-968`] (iteration 5)
- No new blocked path. Host internals are not inspectable from this workspace, so the host change is specified at the contract surface and recommended as an upstream/FIX-5-alternative follow-up rather than packet-local implementation. [SOURCE: opencode.json:2] [SOURCE: .opencode/skills/cli-opencode/SKILL.md:390] (iteration 6)
- Treating a new agent frontmatter field such as `subagent_type: deep-research` as sufficient was ruled out: current files use `mode`, and a frontmatter-only field would not bind runtime identity unless the host resolver enforces it. [SOURCE: .opencode/agents/deep-research.md:4] [SOURCE: .opencode/agents/orchestrate.md:162] [INFERENCE: runtime enforcement is required] (iteration 6)
- Treating FIX-5 as the immediate next step was ruled out for this phase: iteration 5's blind spot first calls for route-proof fields in current validators, while hard host identity and process isolation remain follow-ups if GPT still misroutes. [SOURCE: .opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/001-deep-agent-router-and-orchestration/research/iterations/iteration-005.md:50] (iteration 6)

<!-- /ANCHOR:ruled-out-directions -->

---

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. CARRIED-FORWARD OPEN QUESTIONS
- KQ8 — FIX-5 decision criterion. (iteration 1)
- KQ10 — first-dispatch correctness measurement. (iteration 1)
- KQ4 — quantify GPT slowness mechanism from prompt/YAML role negotiation and context carriage. (iteration 1)
- KQ9 — precise Claude-flexibility behaviors to preserve. (iteration 1)
- KQ5 — concrete pre-route prompt edits and target shape. (iteration 1)
- None for the original 10 KQs. Reducer still needs to mark KQ1-KQ10 resolved in strategy/registry. (iteration 3)
- None new for KQ1. Implementation still needs to land the actual `.opencode/agents/deep.md` file and mirror it to `.claude/agents/deep.md`; Codex remains blocked by the documented TOML-location contradiction. [SOURCE: .opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/001-deep-agent-router-and-orchestration/research/research.md:141] [SOURCE: .opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/001-deep-agent-router-and-orchestration/research/research.md:147] (iteration 4)
- None for the requested KQ8/KQ5 deepening pass, but implementation should add route-proof fields to validation before treating a GPT pass as decisive. [INFERENCE: based on finding 5] (iteration 5)
- None for KQ2/KQ9 deepening. Implementation still needs to choose between packet-local route-proof validation now and external host-runtime hard identity as follow-up. (iteration 6)

<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
None for KQ2/KQ9 deepening. Implementation still needs to choose between packet-local route-proof validation now and external host-runtime hard identity as follow-up.

<!-- /ANCHOR:next-focus -->

<!-- MACHINE-OWNED: END -->

## 12. KNOWN CONTEXT

**Evidence-base gap (integrity note):** research-prompt section 2/4 and spec.md cite prior research at `030/.../010-gpt-deep-agent-routing/research/research.md` and `../001-gpt-deep-agent-routing`. Neither exists on disk. The mis-route taxonomy (modes A/B/C), FIX-1..FIX-5 ranking, and "soft identity boundary" root cause are OPERATOR-ASSERTED AXIOMS (fully stated in research-prompt section 2), not recoverable findings. KQ8's FIX-5 criterion is conditioned on this.

**Surfaces on disk:** Agents `.opencode/agents/{orchestrate,deep-research,deep-review,deep-context,ai-council,CONTEXT}.md`; Commands `.opencode/commands/deep/{research,review,context,ai-council}.md` + `assets/deep_*_auto.yaml`; Skills `deep-loop-workflows/SKILL.md` + `mode-registry.json`; mirrors `.claude/agents/`, `.codex/agents/`.

**Code graph:** stale AND scoped to exclude agents/commands. Use Grep/Glob/Read.

**resource-map.md:** not present; skipping coverage gate.

## 13. RESEARCH BOUNDARIES

- Max iterations: 8 | Convergence threshold: 0.05 (newInfoRatio) | Min iterations floor: 3
- Per-iteration budget: target 8, max 12 tool calls
- Progressive synthesis: true | research/research.md ownership: workflow-owned canonical synthesis
- Current generation: 1 | Started: 2026-06-30T12:43:22Z
