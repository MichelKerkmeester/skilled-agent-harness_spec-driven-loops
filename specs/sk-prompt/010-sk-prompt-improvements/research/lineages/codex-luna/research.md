# Independent Research Synthesis — Rebuilding sk-prompt without DEPTH

**Lineage:** codex-luna (cli-codex / gpt-6-luna) · **Session:** fanout-codex-luna-1793341043045-95ijm9 · **Spec:** specs/sk-prompt/010-sk-prompt-improvements · **Iterations:** 1 of 1 · **Stop reason:** maxIterationsReached

## 1. Research Metadata

| Field | Value |
|---|---|
| Objective | Independently recheck REQ-002 through REQ-011 and the four caller build items in the prior synthesis |
| Method | One inline research iteration; repository/source review, current primary-source checks, and read-only execution of the sibling router fixture suite |
| Scope | Research only; all artifacts in this lineage directory |
| Iteration findings | 14; reducer reports one completed iteration and zero corruption |
| Evidence limits | No local prompt-improver command was executed end to end; retry behavior is therefore a source-contract comparison, not runtime observation |

## 2. Executive Summary

The proposed redesign remains sound as a **default one-pass checklist** with a simple-change early exit, deliver-first behavior for answerable requests, and evaluation against representative inputs where the target prompt can actually be run. The checklist should mark components present, missing, or not needed with a short reason; it should not require every prompt to contain every component. Keep CLEAR as a concise explanation of structural gaps, not as numeric proof that a prompt works.

A single flexible component skeleton is a reasonable product decision, but the cited evidence does not prove that all framework labels should be collapsed. The public guides share components but do not prescribe a universal skeleton, and the sibling skill still mandates DEPTH and framework selection. Keep any task-specific presets as optional aliases until tests show they add no value.

The prior synthesis is directionally useful but needs corrections: its broad claim that no surveyed improver specifies multi-round, multi-perspective work conflicts with the sibling skill; its wording on Evals should say the read-only date is scheduled for October 31, 2026; exact word-for-word preservation is stronger than the OpenAI source; and the sibling router benchmark is at the project root above the skill directory. The benchmark does pass 32/32 fixtures and a kernel/router parity check, but that proves routing behavior, not prompt quality.

## 3. Research Question & Objectives

The question was how to rebuild sk-prompt without the five-stage DEPTH process while preserving useful prompt quality, routing, handoff, and model-specific guidance. This pass independently assessed each REQ, checked the prior report's four caller couplings, and looked for repository and primary-source claims that were overstated or incomplete.

## 4. Method

Read the current sk-prompt skill, router, DEPTH and CLEAR references, framework registry, prompt-improver agent, prompt command YAMLs and presentation, spec, source ledger, and earlier research synthesis. Compared them with the sibling skill and its project-level router test suite. Inspected the runner for filesystem writes before running it with bytecode disabled; it reported PASSED 32/32 fixtures and passed its kernel parity gate. Rechecked official OpenAI prompt-generation and prompt-optimizer pages, Anthropic prompting guidance and Opus 5.5 guidance, and Gemini prompting strategies.

The external research suite and the prompt-generation guides are separate evidence: deterministic route fixtures cannot establish whether a prompt yields better model outputs. Citations below distinguish repository observations from design inferences.

## 5. Current sk-prompt Contract and Coupling Surface

The local skill routes most intents through DEPTH and advertises seven named frameworks, multiple energy levels, CLEAR thresholds, and an ask-first interactive rule. The agent parses target_cli and complexity_hint, selects among seven frameworks, chooses DEPTH energy, and returns a structured package with FRAMEWORK, CLEAR_SCORE, RATIONALE, ENHANCED_PROMPT, and ESCALATION_NOTES. The auto and confirm command assets repeat phases, checkpoints, retry rules, and score fields; the presentation prints DEPTH Rounds. These are real caller contracts, not only prose to delete. [SOURCE: .skilled/skills/sk-prompt/SKILL.md:75] [SOURCE: .skilled/agents/prompt-improver.md:85] [SOURCE: .skilled/agents/prompt-improver.md:226] [SOURCE: .skilled/commands/prompt/assets/prompt_improve_presentation.txt:140]

CLEAR is specified both in patterns-evaluation and in depth-framework. If DEPTH is removed, leave one scoring definition in patterns-evaluation (or a deliberately chosen new canonical file) and remove the duplicate rather than letting callers choose between two rubrics. The registry JSON is code-task benchmark scaffolding for five frameworks; it is not the runtime seven-framework selection matrix. [SOURCE: .skilled/skills/sk-prompt/references/patterns-evaluation.md:602] [SOURCE: .skilled/skills/sk-prompt/references/depth-framework.md:257] [SOURCE: .skilled/skills/sk-prompt/assets/framework-registry.json:3]

The sibling's deterministic router benchmark sits in ../../AI Systems/AI Systems/Prompt Improver/benchmark/router, one directory above sk-prompt-improver. Its 32/32 pass and parity check are independently reproduced in this run. That benchmark is a good model for route tests, not an eval of prompt outputs. [SOURCE: ../../AI Systems/AI Systems/Prompt Improver/benchmark/router/run_fixtures.sh:13] [SOURCE: ../../AI Systems/AI Systems/Prompt Improver/benchmark/router/README.md:5]

## 6. What Replaces DEPTH — One-Pass Checklist

Use one pass with one line per component: present, absent, or not needed, followed by a short reason. Draft once, then check against explicit success criteria. A practical checklist is:

1. Task and requested outcome.
2. Audience or role, only when it changes the response.
3. Necessary context and source facts, preserving user-provided meaning and scope.
4. Hard constraints, priorities, and conflict resolution.
5. Steps, tools, or process guidance only when the task needs them.
6. Output format and any schema or length limits.
7. Examples when they clarify behavior or style.
8. Success criteria, edge cases, or a verification method.
9. Contradictions, assumptions, and missing information.
10. Target model or tool constraints, when known.

This is a synthesized screen, not a vendor-prescribed checklist. Role, examples, detailed steps, and even success criteria can be omitted with a reason when they do not improve the prompt. Avoid replacing DEPTH with another required multi-stage acronym. [INFERENCE: based on .skilled/skills/sk-prompt/references/depth-framework.md:45, https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices, and https://developers.openai.com/api/docs/guides/prompt-generation]

## 7. The Framework Skeleton Question

A single default skeleton—task, context, constraints, output format, optional examples, and success criteria—is a reasonable simplification because vendor guides use overlapping components. The leap from that overlap to “all seven named frameworks must collapse” is inference: the guides do not instruct teams to retire frameworks, and the sibling skill retains framework selection. Keep one default skeleton and optional task presets or aliases; measure whether presets improve outputs before removing them. Do not retire framework-registry.json as proof of this change: it is a separate code-task scaffold. [SOURCE: https://developers.openai.com/api/docs/guides/prompt-generation] [SOURCE: https://ai.google.dev/gemini-api/docs/prompting-strategies] [SOURCE: ../../AI Systems/AI Systems/Prompt Improver/sk-prompt-improver/SKILL.md:191]

## 8. How Quality Should Be Judged

For executable prompts, representative output tests and explicit graders or human criteria are stronger evidence than a self-assigned CLEAR number. The proposed two or three local smoke inputs are useful when a target model is available, but they are not a statistically robust eval set. OpenAI's dataset-backed optimizer requires at least three response rows and a grader result or human annotation for each; it recommends testing and allows repeated optimization with feedback. CLEAR can remain a short structural screen that names missing coverage, but the answer should say NOT RUN when behavioral tests were unavailable and should not imply the score proves effectiveness. [SOURCE: specs/sk-prompt/010-sk-prompt-improvements/spec.md:107] [SOURCE: https://developers.openai.com/api/docs/guides/prompt-optimizer] [SOURCE: https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices]

OpenAI Evals timing matters: the official optimizer page schedules read-only status for 2026-10-31 and shutdown for 2026-11-30. On this run date, 2026-10-30, that transition has not happened yet. Keep the local test workflow portable and do not make it depend on Evals. [SOURCE: https://developers.openai.com/api/docs/guides/prompt-optimizer]

## 9. Deliver-First, Ask-First, and Early Exit

Deliver a useful draft when the goal and source prompt are sufficient; put defaults and assumptions in numbered open items after it. Ask one consolidated question only when the prompt or task is absent, or when an unresolved choice would materially change the deliverable. For a prompt that already meets the request, preserve it or make only the small change requested and say no broader improvement was needed. This combines the local spec's deliver-first proposal, the sibling's soft-gap handling, and OpenAI's simple-change guidance without copying its hard-question wait rule into soft gaps. [SOURCE: specs/sk-prompt/010-sk-prompt-improvements/spec.md:98] [SOURCE: specs/sk-prompt/010-sk-prompt-improvements/spec.md:104] [SOURCE: ../../AI Systems/AI Systems/Prompt Improver/sk-prompt-improver/SKILL.md:109] [SOURCE: https://developers.openai.com/api/docs/guides/prompt-generation]

## 10. What the Callers Need

Keep the agent's dispatch-ready output envelope stable until every consumer is migrated. If FRAMEWORK remains, define it as the selected component preset or a compatibility alias rather than claiming one of seven frameworks was scored. Add target_model or a versioned model identifier separately from target_cli; CLI names identify execution surfaces, not necessarily the model. Define a single effort input such as quick, standard, or thorough with observable meaning: checklist breadth and whether a behavioral test is attempted, not a hidden count of thinking rounds.

The four previously identified caller items are confirmed: replace confirm checkpoints named after_discover, after_prototype, and after_test; replace the DEPTH Rounds field and DEPTH-dependent menu language; choose one retry policy across command YAMLs, agent, and reference; and define one canonical CLEAR rubric. The command YAMLs declare up to three repair cycles while the agent and depth reference say one retry. This pass did not run the command end to end, so the actual invocation behavior remains unverified; choose a policy and test the joined caller path when implementing. [SOURCE: specs/sk-prompt/010-sk-prompt-improvements/spec.md:124] [SOURCE: .skilled/commands/prompt/assets/prompt_improve_confirm.yaml:19] [SOURCE: .skilled/commands/prompt/assets/prompt_improve_auto.yaml:98] [SOURCE: .skilled/agents/prompt-improver.md:88] [SOURCE: .skilled/skills/sk-prompt/references/depth-framework.md:165]

One additional caller text surface is the command description and agent description: both still advertise frameworks/DEPTH. Update them with the replacement terminology. Preserve or jointly migrate the structured output fields FRAMEWORK, CLEAR_SCORE, RATIONALE, ENHANCED_PROMPT, and ESCALATION_NOTES so the command does not expect metadata the agent has stopped returning. [SOURCE: .skilled/commands/prompt/improve.md:2] [SOURCE: .skilled/agents/prompt-improver.md:3] [SOURCE: .skilled/agents/prompt-improver.md:226]

## 11. Recommendations — Per-REQ Verdicts

| REQ | Independent verdict | Recommended interpretation |
|---|---|---|
| REQ-002 | Validated; refine | Replace DEPTH with the one-pass, reasoned present/absent/not-needed checklist in Section 6. It is a default completeness screen, not a fixed output template. |
| REQ-003 | Validated | Add a simple-change pass-through for already-good prompts. |
| REQ-004 | Validated with boundary | Deliver first for soft gaps; ask only for missing essentials or a material ambiguity. |
| REQ-005 | Validated | Strip pasted prompt content before route detection and preserve the sibling's command/token semantics. |
| REQ-006 | Validated with path correction | Add route fixtures under sk-prompt; the sibling's project-root suite passes 32/32 plus parity, but does not score generated prompts. |
| REQ-007 | Validated with caveats | Prefer observable output tests when executable; CLEAR is an explanatory structural check, not a substitute for testing. Keep tests portable beyond the Evals transition. |
| REQ-008 | Partial; inference | Use a single flexible default skeleton and optional task presets; do not claim public sources prove the seven labels must collapse. |
| REQ-009 | Re-scope | Check contradictions and use examples when helpful. Avoid an unconditional 3–5 example count or universal ban on explicit capitalized constraints. |
| REQ-010 | Validated; version-gate | Add optional model-version input and keep model profiles short, conditional, and current. |
| REQ-011 | Partial; re-scope | Report edits and preserve intent, facts, and constraints; honor verbatim requirements when requested. Treat 3x as an optional warning, not a proven universal cap. |

## Eliminated Alternatives

- Keeping DEPTH's phase names while merely reducing the number of rounds: command checkpoints and output fields would remain coupled to the removed process.
- Replacing DEPTH with another mandatory multi-perspective or acronym sequence: no evidence in this pass shows that such a ritual improves prompt outcomes.
- Requiring every prompt to contain every skeleton component or a fixed number of examples: optional content is task-dependent and can overfit.
- Treating CLEAR or a successful route fixture run as behavioral proof of prompt quality.
- Treating OpenAI Evals as a durable required runtime dependency.
- Applying a universal word-for-word rule or three-times length cap without user or task requirements.

## Divergence Map

No graph pivots or saturation events were recorded. This iteration triangulated four angles: the local skill and caller contracts; the sibling skill plus its executable router suite; official vendor prompt guidance; and the prior synthesis/ledger. The strongest divergence is between the sibling's explicit DEPTH/framework process and the prior synthesis's claim that no surveyed improver specifies such a process. The retry ceiling is a repository contract conflict, not a disagreement resolved by source quality. The remaining frontier is end-to-end command behavior and version-specific profile validation.

## 12. Open Questions

1. Which retry ceiling should become canonical: one retry or up to three cycles? The current source contracts conflict; an end-to-end run is needed after a choice is made.
2. Which target model identifiers and versions will the profile sections support, and who will refresh them as vendor guidance changes?

## 13. Risks & Caveats

- The sibling router benchmark's 32/32 result proves only the fixture contract and duplicated-router parity.
- Public guidance supports shared prompt components and evaluation practices, but does not explicitly prescribe the proposed checklist or collapsing frameworks; those remain design inferences.
- The source survey labels several community and vendor claims as delegated or unverified. This pass rechecked primary vendor claims that affect the recommendations but did not re-audit every listed community source.
- No local prompt-improver command was run, and no implementation was performed.

## 14. Convergence Report

- Stop reason: maxIterationsReached
- Total iterations: 1
- Questions answered: 4 / 4
- Remaining tracked questions: 0; two implementation decisions are carried forward in Section 12
- Last iteration: independent second opinion on REQ-002 through REQ-011 and caller contracts (newInfoRatio 0.68)
- Convergence threshold: 0.05
- Divergence summary: no formal pivots; sibling workflow, route tests, and vendor evaluation guidance were compared

## 15. References

### Local repository

- specs/sk-prompt/010-sk-prompt-improvements/spec.md
- specs/sk-prompt/010-sk-prompt-improvements/scratch/prompt-improver-survey.md
- specs/sk-prompt/010-sk-prompt-improvements/research/research.md
- .skilled/skills/sk-prompt/SKILL.md
- .skilled/skills/sk-prompt/ROUTER.md
- .skilled/skills/sk-prompt/references/depth-framework.md
- .skilled/skills/sk-prompt/references/patterns-evaluation.md
- .skilled/skills/sk-prompt/assets/framework-registry.json
- .skilled/agents/prompt-improver.md
- .skilled/commands/prompt/assets/prompt_improve_auto.yaml
- .skilled/commands/prompt/assets/prompt_improve_confirm.yaml
- .skilled/commands/prompt/assets/prompt_improve_presentation.txt
- .skilled/commands/prompt/improve.md

### Sibling project

- ../../AI Systems/AI Systems/Prompt Improver/sk-prompt-improver/SKILL.md
- ../../AI Systems/AI Systems/Prompt Improver/benchmark/router/README.md
- ../../AI Systems/AI Systems/Prompt Improver/benchmark/router/run_fixtures.sh
- ../../AI Systems/AI Systems/Prompt Improver/benchmark/router/fixtures.json

### Primary public sources

- https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices
- https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-opus-5-5
- https://claude.com/blog/prompt-improver
- https://developers.openai.com/api/docs/guides/prompt-generation
- https://developers.openai.com/api/docs/guides/prompt-optimizer
- https://developers.openai.com/api/docs/guides/prompt-engineering
- https://ai.google.dev/gemini-api/docs/prompting-strategies

## 16. Orchestrator Verification

- Opening config event: gateway accepted; receipt sequence 1; state projection refreshed.
- Iteration event: gateway accepted; receipt sequence 2; state projection refreshed.
- Required reducer command exited 0, reported iterationsCompleted=1, corruptionCount=0, and registry keyFindings=14.
- Opening config event: gateway accepted at ledger receipt sequence 1 and refreshed the state projection.
- Iteration event: gateway accepted at receipt sequence 2; the submitted record and delta row carry findingsCount=14, with 14 cited finding rows.
- Required reducer command exited 0, reported iterationsCompleted=1 and corruptionCount=0, and produced 14 registry findings.
- Synthesis closeout exited 0; the staged terminal event and projected state record carry stopReason=maxIterationsReached, totalIterations=1, and answeredCount=4.
- Terminal gateway append was accepted at receipt sequence 3; config status is complete and the lineage lock was released.

## 17. Workflow and Scope Deviations

- The YAML's main loop phase is named phase_loop; it was executed inline as the user's requested phase_main_loop because this process is the bound fan-out executor.
- Skipped pre-init spec mutation, post-synthesis spec writeback, resource-map emission, recursive validation, continuity generation, and git staging because each would write outside the authorized lineage. The iteration narrative records these scope violations.
- Resource-map emission was disabled in the lineage config; no resource-map file was written.
