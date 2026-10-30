# Iteration 1: Independent second opinion on the DEPTH-free rebuild

## Focus
Independent source-level adjudication of REQ-002 through REQ-011 and their caller contracts. The prior three-iteration synthesis is treated as a hypothesis; this pass rechecks the named REQs, the four declared caller items, and current primary-source claims.

## Actions Taken
- Read the current sk-prompt skill, router references, framework scaffold, prompt-improver agent, command YAMLs, presentation, spec, source ledger, and prior synthesis.
- Compared the local sibling skill and its project-level route benchmark. The benchmark was inspected for write side effects before execution; the runner was invoked with Python bytecode disabled and only read fixtures/source.
- Rechecked official OpenAI prompt-generation and optimizer guidance, Anthropic prompting best practices and Opus guidance, and Gemini prompting strategies.

## Findings
1. REQ-002 is directionally validated. Replace Discover/Engineer/Prototype/Test/Harmonize with one pass: mark task and outcome, audience or role, source facts and context, constraints and priority, necessary steps or tools, output format, examples when behavior is ambiguous, success checks, contradictions and assumptions, length, and target-model fit as present, absent, or not needed, each with a short reason; draft once and check once against explicit criteria. Components are optional when they do not serve the task, so this is a completeness screen rather than a mandatory template. This exact row set is a design inference from vendor guidance, not a quoted vendor recipe. [SOURCE: specs/sk-prompt/010-sk-prompt-improvements/spec.md:97] [SOURCE: .skilled/skills/sk-prompt/SKILL.md:82] [SOURCE: .skilled/skills/sk-prompt/references/depth-framework.md:45] [SOURCE: https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices] [SOURCE: https://developers.openai.com/api/docs/guides/prompt-generation]
2. REQ-003 is validated: add a simple-change / already-good early exit that returns the original or makes only the requested small edit, and say when no substantive improvement was needed. This prevents a checklist from becoming an excuse to expand a clean prompt. [SOURCE: specs/sk-prompt/010-sk-prompt-improvements/spec.md:98] [SOURCE: https://developers.openai.com/api/docs/guides/prompt-generation]
3. REQ-004 is validated with a hard-blocker boundary: deliver a useful draft when the goal and source prompt make one possible, then list defaults as numbered open items; ask one consolidated question only when the task or input is absent or an ambiguity changes the deliverable materially. The sibling skill supports deliver-first for soft gaps, while its own hard-question rules still wait for an answer. [SOURCE: specs/sk-prompt/010-sk-prompt-improvements/spec.md:104] [SOURCE: ../../AI Systems/AI Systems/Prompt Improver/sk-prompt-improver/SKILL.md:109] [SOURCE: https://developers.openai.com/api/docs/guides/prompt-generation]
4. REQ-005 is validated: strip pasted prompt text before intent detection and preserve exact-token matching, word boundaries, quote and prompt-label fallbacks, and explicit conflicting-command disambiguation. The sibling route contract includes a pasted prompt containing a format token as a regression case; this behavior is not merely a style preference. [SOURCE: specs/sk-prompt/010-sk-prompt-improvements/spec.md:105] [SOURCE: ../../AI Systems/AI Systems/Prompt Improver/sk-prompt-improver/SKILL.md:67] [SOURCE: ../../AI Systems/AI Systems/Prompt Improver/benchmark/router/route_contract.py:203] [SOURCE: ../../AI Systems/AI Systems/Prompt Improver/benchmark/router/fixtures.json]
5. REQ-006 is validated, with a path correction: the sibling runner lives at the Prompt Improver project root, one level above sk-prompt-improver, not inside the skill folder. Running that read-only suite returned PASSED 32/32 fixtures and a kernel/router parity pass. It tests deterministic routing and duplicated-router drift, not whether generated prompts perform well; put the new local route fixtures under sk-prompt and keep prompt-quality cases separate. [SOURCE: specs/sk-prompt/010-sk-prompt-improvements/spec.md:106] [SOURCE: ../../AI Systems/AI Systems/Prompt Improver/benchmark/router/run_fixtures.sh:13] [SOURCE: ../../AI Systems/AI Systems/Prompt Improver/benchmark/router/README.md:5] [SOURCE: ../../AI Systems/AI Systems/Prompt Improver/benchmark/router/fixtures.json]
6. REQ-007 is validated with a distinction between static review and behavioral evidence: when the target model can be run, judge the old and new prompt on a small representative set with observable criteria first; keep CLEAR only as a short explanatory coverage screen, and do not present a self-assigned number as proof. OpenAI documents dataset-backed optimization with at least three response rows and a grader result or human annotation per row, then recommends testing and optionally repeating with feedback, so two or three local smoke inputs are not equivalent to a durable eval set. [SOURCE: specs/sk-prompt/010-sk-prompt-improvements/spec.md:107] [SOURCE: https://developers.openai.com/api/docs/guides/prompt-optimizer] [SOURCE: https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices]
7. Correct the prior synthesis timeline: as of this run on 2026-10-30, OpenAI Evals is scheduled to become read-only on 2026-10-31 and shut down on 2026-11-30; it is not already read-only today. Treat it as a near-term migration constraint and keep sk-prompt evaluation local or portable rather than depending on Evals. [SOURCE: specs/sk-prompt/010-sk-prompt-improvements/research/research.md:52] [SOURCE: https://developers.openai.com/api/docs/guides/prompt-optimizer]
8. REQ-008 is an inference, not a directly sourced requirement. Public guidance shares components such as task, context, instructions, examples, and format but does not prescribe collapsing every named framework. Use one flexible default component skeleton with optional task presets or aliases; do not turn it into a rigid fill-every-slot form. Also, framework-registry.json describes five code-task benchmark scaffolds, not the runtime seven-framework selector, so retiring it is not a valid acceptance proxy. The sibling itself retains framework selection. [SOURCE: specs/sk-prompt/010-sk-prompt-improvements/spec.md:108] [SOURCE: .skilled/skills/sk-prompt/assets/framework-registry.json:3] [SOURCE: .skilled/skills/sk-prompt/references/patterns-evaluation.md:44] [SOURCE: ../../AI Systems/AI Systems/Prompt Improver/sk-prompt-improver/SKILL.md:191] [SOURCE: https://developers.openai.com/api/docs/guides/prompt-generation] [SOURCE: https://ai.google.dev/gemini-api/docs/prompting-strategies]
9. REQ-009 needs re-scoping: retain contradiction checks and use examples when they disambiguate desired behavior, but do not require three to five examples on every prompt or ban MUST/CRITICAL universally. Vendor guidance treats example count as something to experiment with and warns about overfitting; direct wording is a useful default, while a hard constraint may still need explicit emphasis. [SOURCE: specs/sk-prompt/010-sk-prompt-improvements/spec.md:109] [SOURCE: https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices] [SOURCE: https://ai.google.dev/gemini-api/docs/prompting-strategies]
10. REQ-010 is validated but should be version-scoped: the current agent accepts target_cli and complexity_hint but no target_model, so CLI is not enough to select model-specific behavior. Add an optional target_model or model-version input and keep each profile short, capability-checked, and dated; use these as conditional hints, not universal instructions for every Claude, GPT, or Gemini model. [SOURCE: specs/sk-prompt/010-sk-prompt-improvements/spec.md:110] [SOURCE: .skilled/agents/prompt-improver.md:85] [SOURCE: https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-opus-5-5] [SOURCE: https://developers.openai.com/api/docs/guides/prompt-engineering] [SOURCE: https://ai.google.dev/gemini-api/docs/prompting-strategies]
11. REQ-011 is partly validated and partly overclaimed: report additions, changes, removals, and intentionally skipped edits, and preserve user facts, constraints, placeholders, and intent; preserve text verbatim when requested. The official OpenAI prompt-generation guidance allows preserving content entirely or as closely as possible, so universal word-for-word retention is not its rule, and no primary source here justifies a hard three-times growth cap. Make size control an explicit user or task constraint, with a warning threshold if useful. [SOURCE: specs/sk-prompt/010-sk-prompt-improvements/spec.md:111] [SOURCE: https://developers.openai.com/api/docs/guides/prompt-generation] [SOURCE: https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices]
12. The four uncovered caller couplings are real: replace confirm checkpoints after_discover/after_prototype/after_test and the DEPTH Rounds display; choose one retry policy because both command YAMLs declare up to three cycles while the agent and depth reference say one retry; define a named effort control for $short, $refine, and complexity_hint; and keep one canonical CLEAR definition, preferably patterns-evaluation, deleting the duplicate in depth-framework. Do not claim the YAML/agent retry behavior is resolved until an end-to-end run confirms the selected policy. [SOURCE: specs/sk-prompt/010-sk-prompt-improvements/spec.md:124] [SOURCE: .skilled/commands/prompt/assets/prompt_improve_confirm.yaml:19] [SOURCE: .skilled/commands/prompt/assets/prompt_improve_auto.yaml:98] [SOURCE: .skilled/commands/prompt/assets/prompt_improve_auto.yaml:142] [SOURCE: .skilled/commands/prompt/assets/prompt_improve_presentation.txt:140] [SOURCE: .skilled/agents/prompt-improver.md:88] [SOURCE: .skilled/skills/sk-prompt/references/depth-framework.md:165] [SOURCE: .skilled/skills/sk-prompt/references/patterns-evaluation.md:602]
13. Correct the prior synthesis generalization that no surveyed improver specifies a multi-round, multi-perspective process: the sibling skill explicitly mandates DEPTH energy levels and a minimum three perspectives, while OpenAI describes optional repeat optimization cycles based on eval feedback. The defensible claim is narrower: public vendor guidance does not establish that seven acronym frameworks or multi-perspective rituals improve quality; it does support measured iteration for testable tasks. [SOURCE: specs/sk-prompt/010-sk-prompt-improvements/research/research.md:18] [SOURCE: ../../AI Systems/AI Systems/Prompt Improver/sk-prompt-improver/SKILL.md:75] [SOURCE: ../../AI Systems/AI Systems/Prompt Improver/sk-prompt-improver/SKILL.md:142] [SOURCE: https://developers.openai.com/api/docs/guides/prompt-optimizer]
14. One caller surface is additionally easy to miss: the /prompt:improve command description and prompt-improver agent description still advertise frameworks and DEPTH. Update both with the replacement terms, and either preserve the structured FRAMEWORK/CLEAR_SCORE/RATIONALE/ENHANCED_PROMPT/ESCALATION_NOTES contract for compatibility or migrate every consumer in the same scoped change. [SOURCE: .skilled/commands/prompt/improve.md:2] [SOURCE: .skilled/agents/prompt-improver.md:3] [SOURCE: .skilled/agents/prompt-improver.md:226]
## Questions Answered
- What one-pass checklist and component skeleton should replace DEPTH, and which elements are required versus optional?
- Which REQ-002 through REQ-011 claims are supported, overclaimed, or contradicted by repository and primary-source evidence?
- What exact caller and workflow couplings must change in the prompt-improver agent and prompt commands?
- How should quality evaluation, interaction defaults, model profiles, and effort selection work without DEPTH?

## Questions Remaining
- The authoritative retry limit remains a build decision: source files conflict, and no end-to-end prompt command was executed in this read-only pass.
- The precise model profile text should be validated against the pinned target model versions when implemented.

## Next Focus
Synthesize the accepted recommendations and corrections now that maxIterations=1 is reached; record stopReason=maxIterationsReached.

## Ruled Out
- Treating the old-vs-new route benchmark as a prompt-quality evaluation: its oracle covers route objects and copied-router parity only.
- Treating a universal three-times growth cap or verbatim-content rule as established by primary vendor evidence.

## Dead Ends
No source lookup failed. An initial path check looked only inside the skill subdirectory; checking its project parent found the runner, and the read-only suite passed.

## Edge Cases
- Contradictory evidence: command YAML declares up to three CLEAR repair cycles; agent/reference text says one retry. The conflict is surfaced, not silently adjudicated.
- Missing dependencies: none for this iteration.
- Partial success: none.

## Sources Consulted
- specs/sk-prompt/010-sk-prompt-improvements/spec.md:97
- .skilled/skills/sk-prompt/SKILL.md:82
- .skilled/skills/sk-prompt/references/depth-framework.md:45
- https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices
- https://developers.openai.com/api/docs/guides/prompt-generation
- specs/sk-prompt/010-sk-prompt-improvements/spec.md:98
- specs/sk-prompt/010-sk-prompt-improvements/spec.md:104
- ../../AI Systems/AI Systems/Prompt Improver/sk-prompt-improver/SKILL.md:109
- specs/sk-prompt/010-sk-prompt-improvements/spec.md:105
- ../../AI Systems/AI Systems/Prompt Improver/sk-prompt-improver/SKILL.md:67
- ../../AI Systems/AI Systems/Prompt Improver/benchmark/router/route_contract.py:203
- ../../AI Systems/AI Systems/Prompt Improver/benchmark/router/fixtures.json
- specs/sk-prompt/010-sk-prompt-improvements/spec.md:106
- ../../AI Systems/AI Systems/Prompt Improver/benchmark/router/run_fixtures.sh:13
- ../../AI Systems/AI Systems/Prompt Improver/benchmark/router/README.md:5
- specs/sk-prompt/010-sk-prompt-improvements/spec.md:107
- https://developers.openai.com/api/docs/guides/prompt-optimizer
- specs/sk-prompt/010-sk-prompt-improvements/research/research.md:52
- specs/sk-prompt/010-sk-prompt-improvements/spec.md:108
- .skilled/skills/sk-prompt/assets/framework-registry.json:3
- .skilled/skills/sk-prompt/references/patterns-evaluation.md:44
- ../../AI Systems/AI Systems/Prompt Improver/sk-prompt-improver/SKILL.md:191
- https://ai.google.dev/gemini-api/docs/prompting-strategies
- specs/sk-prompt/010-sk-prompt-improvements/spec.md:109
- specs/sk-prompt/010-sk-prompt-improvements/spec.md:110
- .skilled/agents/prompt-improver.md:85
- https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-opus-5-5
- https://developers.openai.com/api/docs/guides/prompt-engineering
- specs/sk-prompt/010-sk-prompt-improvements/spec.md:111
- specs/sk-prompt/010-sk-prompt-improvements/spec.md:124
- .skilled/commands/prompt/assets/prompt_improve_confirm.yaml:19
- .skilled/commands/prompt/assets/prompt_improve_auto.yaml:98
- .skilled/commands/prompt/assets/prompt_improve_auto.yaml:142
- .skilled/commands/prompt/assets/prompt_improve_presentation.txt:140
- .skilled/agents/prompt-improver.md:88
- .skilled/skills/sk-prompt/references/depth-framework.md:165
- .skilled/skills/sk-prompt/references/patterns-evaluation.md:602
- specs/sk-prompt/010-sk-prompt-improvements/research/research.md:18
- ../../AI Systems/AI Systems/Prompt Improver/sk-prompt-improver/SKILL.md:75
- ../../AI Systems/AI Systems/Prompt Improver/sk-prompt-improver/SKILL.md:142
- .skilled/commands/prompt/improve.md:2
- .skilled/agents/prompt-improver.md:3
- .skilled/agents/prompt-improver.md:226

## Assessment
- New information ratio: 0.68
- Questions addressed: all four strategy questions
- Questions answered: all four at the recommendation level; runtime retry behavior remains unverified

## Reflection
- What worked: pairing source review with the sibling's deterministic 32-fixture runner clarified which evidence supports routing regression tests and which does not speak to prompt quality.
- What did not work: the prior synthesis generalized across the survey despite the sibling explicitly retaining DEPTH, and it reported the future Evals date as already effective.
- What I would do differently: separate prompt generation evidence, router tests, and model-output evaluations into distinct claims and dates.

## Recommended Next Focus
Use this synthesis as an independent design input. Before implementation, choose one retry cap, pin the desired target-model inputs, and update the command and agent contracts together.

## SCOPE VIOLATIONS
- Skipped the workflow's pre-init spec mutation and post-synthesis spec writeback because they target specs/sk-prompt/010-sk-prompt-improvements/spec.md outside this lineage.
- Disabled resource-map emission because the non-fanout synthesis branch would write specs/sk-prompt/010-sk-prompt-improvements/resource-map.md outside this lineage.
- Skipped repository validation, continuity generation, and git staging because they are explicitly outside the authorized write surface.
- The YAML names the main loop phase phase_loop; executed it inline as the requested phase_main_loop because config.fanout_lineage_artifact_dir is bound and maxIterations is 1.
