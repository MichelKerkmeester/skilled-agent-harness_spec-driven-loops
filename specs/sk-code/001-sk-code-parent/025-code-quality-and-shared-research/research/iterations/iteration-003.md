# Iteration 3: System-skill-advisor integration for code-quality

## Focus
This iteration investigated the required focus: how `code-quality` should integrate with system-skill-advisor metadata, quality-mode routing aliases, benchmark vocabulary, prompt-safe recommendation evidence, and single-parent advisor identity. The selected interpretation is routing/discoverability design for the existing `sk-code` parent hub, not adding a standalone advisor identity for `code-quality`.

## Findings
1. Parent-level `sk-code` metadata is already the correct advisor surface for `code-quality`: the graph metadata declares one `skill_id` of `sk-code`, categorizes the hub as `code-quality`, includes `code-quality`, `quality-gate`, `alignment verifier`, and `stable jsonl keys` as domains/signals, and records the advisor relationship as `system-skill-advisor` routing code work to `sk-code`. Improvements should therefore tune the parent graph metadata and derived trigger vocabulary, not introduce packet-local metadata. [SOURCE: .opencode/skills/sk-code/graph-metadata.json:3] [SOURCE: .opencode/skills/sk-code/graph-metadata.json:5] [SOURCE: .opencode/skills/sk-code/graph-metadata.json:24] [SOURCE: .opencode/skills/sk-code/graph-metadata.json:66] [SOURCE: .opencode/skills/sk-code/graph-metadata.json:71] [SOURCE: .opencode/skills/sk-code/graph-metadata.json:93] [SOURCE: .opencode/skills/sk-code/graph-metadata.json:118]
2. The single-identity routing contract is explicit in both the parent hub and registry: advisor recommendations select `sk-code`, while the hub resolves `workflowMode` through `mode-registry.json`; `quality` is a workflow packet with aliases including `quality gate`, `code quality`, `comment hygiene check`, `surface checklist`, `p0 p1 p2 author check`, `alignment verifier`, and `stable jsonl keys`. The right integration seam is to make those aliases complete and benchmarked, not make `code-quality` a separate advisor recommendation. [SOURCE: .opencode/skills/sk-code/SKILL.md:15] [SOURCE: .opencode/skills/sk-code/SKILL.md:21] [SOURCE: .opencode/skills/sk-code/SKILL.md:50] [SOURCE: .opencode/skills/sk-code/SKILL.md:145] [SOURCE: .opencode/skills/sk-code/SKILL.md:157] [SOURCE: .opencode/skills/sk-code/mode-registry.json:4] [SOURCE: .opencode/skills/sk-code/mode-registry.json:10] [SOURCE: .opencode/skills/sk-code/mode-registry.json:23] [SOURCE: .opencode/skills/sk-code/mode-registry.json:35]
3. `hub-router.json` already mirrors the quality vocabulary in router classes, but `code-quality/SKILL.md` contains additional high-value activation language (`authoring checklist`, `OpenCode checklist`, `skill authoring`, `agent authoring`, `command authoring`, `MCP server authoring`, `spec folder authoring`, `check before done`) that is not fully represented in the quality alias class. That gap is a practical improvement target: add parent/hub-router vocabulary that routes to `sk-code` then `quality`, while leaving packet-local workflow details inside `code-quality`. [SOURCE: .opencode/skills/sk-code/hub-router.json:17] [SOURCE: .opencode/skills/sk-code/hub-router.json:42] [SOURCE: .opencode/skills/sk-code/hub-router.json:45] [SOURCE: .opencode/skills/sk-code/code-quality/SKILL.md:23] [SOURCE: .opencode/skills/sk-code/code-quality/SKILL.md:31] [SOURCE: .opencode/skills/sk-code/code-quality/SKILL.md:44]
4. Advisor prompt-safety rules constrain how `code-quality` can be surfaced: advisor recommendations must not echo raw prompt text, lane attribution uses structured evidence labels, hooks render compact `Advisor: ...` briefs only when thresholds pass, and target skills own the work after recommendation. Therefore a safe output shape is “use `sk-code`” plus prompt-safe mode evidence/alias labels for `quality`, not a raw-prompt explanation or separate `code-quality` target. [SOURCE: .opencode/skills/system-skill-advisor/references/scoring/advisor_scorer.md:144] [SOURCE: .opencode/skills/system-skill-advisor/references/scoring/advisor_scorer.md:146] [SOURCE: .opencode/skills/system-skill-advisor/references/scoring/advisor_scorer.md:148] [SOURCE: .opencode/skills/system-skill-advisor/references/hooks/skill_advisor_hook.md:70] [SOURCE: .opencode/skills/system-skill-advisor/references/hooks/skill_advisor_hook.md:73] [SOURCE: .opencode/skills/system-skill-advisor/references/hooks/skill_advisor_hook.md:77] [SOURCE: .opencode/skills/system-skill-advisor/README.md:162] [SOURCE: .opencode/skills/system-skill-advisor/README.md:172]
5. Current advisor benchmark vocabulary validates `sk-code` at the skill level for implementation/review prompts, but the visible scorer corpus does not include quality-gate-specific prompts such as comment hygiene, P0/P1/P2 author checks, surface checklist, or “check before done.” The validation baseline supports `advisor_validate` scoped to `skillSlug: "sk-code"`, so the next improvement should add `expectedSkill: 'sk-code'` quality-mode cases and assert the parent hub resolves `workflowMode: quality` in a companion router check. [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/tests/scorer/fixtures/intent-prompt-corpus.ts:13] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/tests/scorer/fixtures/intent-prompt-corpus.ts:18] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/tests/scorer/fixtures/intent-prompt-corpus.ts:73] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/tests/scorer/fixtures/intent-prompt-corpus.ts:78] [SOURCE: .opencode/skills/system-skill-advisor/references/scoring/validation_baselines.md:73] [SOURCE: .opencode/skills/system-skill-advisor/references/scoring/validation_baselines.md:77] [SOURCE: .opencode/skills/system-skill-advisor/references/scoring/validation_baselines.md:99]

## Ruled Out
- Adding `code-quality/graph-metadata.json` or making `code-quality` a standalone advisor target; the parent hub requires exactly one graph metadata file and the registry says advisor routing selects the single `sk-code` identity before hub mode resolution. [SOURCE: .opencode/skills/sk-code/SKILL.md:145] [SOURCE: .opencode/skills/sk-code/SKILL.md:157] [SOURCE: .opencode/skills/sk-code/mode-registry.json:10]
- Surfacing raw prompt snippets as recommendation evidence; prompt-safety rules require lane labels/evidence tokens rather than prompt-derived evidence snippets. [SOURCE: .opencode/skills/system-skill-advisor/references/scoring/advisor_scorer.md:146] [SOURCE: .opencode/skills/system-skill-advisor/references/hooks/skill_advisor_hook.md:77]

## Dead Ends
- `research/deltas/iter-003.jsonl` was not written because this leaf agent's allowed-write contract permits iteration markdown, one append-only state JSONL record, optional explicitly allowed idea observations, and progressive `research.md`; it does not include `research/deltas/*` as an allowed direct write target. [INFERENCE: based on the active deep-research allowed-write contract and the user's conditional “if permitted” instruction]

## Edge Cases
- Ambiguous input: The reducer-owned `NEXT FOCUS` still points at the original baseline, while the user's explicit required focus and iteration 2 recommendation point to system-skill-advisor integration. I followed the explicit dispatch focus and treated the stale strategy focus as reducer lag.
- Contradictory evidence: None found.
- Missing dependencies: Delta writing was conditionally requested but is outside this leaf write contract; no delta file was created.
- Partial success: The required iteration artifact, JSONL append, and progressive synthesis update are in scope and completed; the optional delta artifact is intentionally omitted.

## Sources Consulted
- `.opencode/skills/sk-code/graph-metadata.json:1`
- `.opencode/skills/sk-code/mode-registry.json:1`
- `.opencode/skills/sk-code/hub-router.json:1`
- `.opencode/skills/sk-code/SKILL.md:15`
- `.opencode/skills/sk-code/SKILL.md:140`
- `.opencode/skills/sk-code/code-quality/SKILL.md:15`
- `.opencode/skills/system-skill-advisor/references/scoring/advisor_scorer.md:80`
- `.opencode/skills/system-skill-advisor/references/hooks/skill_advisor_hook.md:70`
- `.opencode/skills/system-skill-advisor/references/scoring/validation_baselines.md:70`
- `.opencode/skills/system-skill-advisor/mcp_server/tests/scorer/fixtures/intent-prompt-corpus.ts:1`
- `.opencode/skills/system-skill-advisor/mcp_server/tests/scorer/fixtures/harder-intent-prompt-corpus.ts:1`
- `.opencode/skills/system-skill-advisor/README.md:160`

## Assessment
- New information ratio: 0.90
- Questions addressed: q4 system-skill-advisor metadata, routing vocabulary, benchmarks, prompt-safe recommendations, and single parent advisor identity.
- Questions answered: `code-quality` should be discoverable through parent-level `sk-code` metadata and prompt-safe `quality` mode evidence; benchmark work should validate `expectedSkill: sk-code` plus hub-level `workflowMode: quality`, not introduce a separate advisor target.

## Reflection
- What worked and why: Reading parent metadata, hub routing, scorer prompt-safety references, and benchmark fixtures together exposed the clean two-stage route: advisor recommends `sk-code`; the hub resolves `quality` and bundles surface evidence.
- What did not work and why: Looking for mode-specific advisor benchmarks in the visible scorer corpus found only skill-level `sk-code` implementation/review examples; this indicates a fixture coverage gap rather than a reason to violate the single-identity contract.
- What I would do differently: In the next iteration, inspect deep-loop, hook, and behavior-benchmark integration using the same ownership-boundary lens, especially where `code-quality` evidence feeds review/research loops without becoming a loop controller.

## Recommended Next Focus
Investigate deep-loop research/review, hook, behavior-benchmark, and general software-quality integration: how `code-quality` evidence should feed iterative review/research and runtime hook surfaces without becoming a deep-loop agent or duplicating verification ownership.
