# Iteration 10: Failure modes and controls

## Focus

Investigate Angle 10: over-triggering, ambiguity between a command and skill, child-session recursion, loops and prompt-budget truncation. The reducer still names Q1 as Next Focus, while the dispatched sequence places failure modes tenth; I followed Angle 10 after checking the blocked approaches. [SOURCE: specs/system-skill-advisor/routing-and-scoring/007-command-surfacing-and-workflow-enforcement/research/lineages/codex-luna/deep-research-strategy.md:123-165,293-296]

## Findings
1. The prompt-policy replay fails on undertrigger when a positive gold row is declined, but does not assert that gold-none prompts abstain; the corpus scorer separately counts false fires on none. The replay is therefore not an overtrigger guard by itself. [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/prompt-policy-gold-replay.vitest.ts:44-83] [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-routing-corpus.py:142-181]
2. Typed slash evidence holds the named command above a related dependency and suppresses false ambiguity, while the same words without slash syntax remain ambiguous. Keep ambiguity and action policy explicit: a high skill match alone does not resolve whether the command runs or asks under Gate 3. [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/scorer/typed-command-routing.vitest.ts:59-101] [SOURCE: AGENTS.md:60-68] [SOURCE: AGENTS.md:72-84]
3. The deep-research command YAML owns the loop and dispatches a one-iteration leaf; the mode contract forbids nested CLI loops and the leaf definition denies Task/sub-agent dispatch. A child that re-enters the parent workflow can multiply work or recurse, so command routing should carry execution depth and leaf boundaries with the workflow. [SOURCE: .skilled/skills/system-deep-loop/deep-research/SKILL.md:82-90] [SOURCE: .skilled/agents/deep-research.md:61-67] [SOURCE: .skilled/commands/deep/assets/deep-research-auto.yaml:771-777]
4. The lineage config sets maxIterations 10 and top-level stopPolicy max-iterations, but nested antiConvergence.stopPolicy says fail-closed; the workflow treats the iteration cap as the first terminal check. Keep one authoritative stop-policy value or test precedence, because conflicting stop fields can otherwise change whether convergence continues to the cap. [SOURCE: specs/system-skill-advisor/routing-and-scoring/007-command-surfacing-and-workflow-enforcement/research/lineages/codex-luna/deep-research-config.json:3-9] [SOURCE: specs/system-skill-advisor/routing-and-scoring/007-command-surfacing-and-workflow-enforcement/research/lineages/codex-luna/deep-research-config.json:96] [SOURCE: .skilled/commands/deep/assets/deep-research-auto.yaml:771-777]
5. The default brief cap is 80 tokens and the ambiguous branch requires a cap above 80; a command companion is omitted when it does not fit, while the directives and hygiene suffix are appended after the capped portion. Tests confirm both the companion-drop case and the fit case, so required command/action fields should not live only in an optional companion line. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/render.ts:97-100] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/render.ts:185-191] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/render.ts:517-563] [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/doctor-brief-render.vitest.ts:57-64] [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/doctor-brief-render.vitest.ts:103-112]

## Ruled Out

- Using the positive-only prompt-fire replay as the only false-trigger regression test.
- Treating command confidence as authorization to execute.
- Allowing a one-iteration child to restart the parent loop or recursively call its own executor.
- Relying on the token cap to preserve every field when the command is a truncatable companion.

## Dead Ends

- None newly established. Existing code has ambiguity, leaf and max-iteration controls, but command-specific action authority and full brief-budget behavior still need explicit coverage.

## Edge Cases

- Contradictory evidence: The config carries top-level max-iterations and nested fail-closed stop policies, while the YAML step begins with the hard iteration-cap check. Confirm which field is authoritative before treating early stop behavior as settled.
- Ambiguous input: Plain-language near-ties remain ambiguous even when a typed slash command ranks its bridge first; the chat path must preserve an ask/clarify state.
- Missing dependencies: None for source review.
- Partial success: Current source demonstrates prompt guard, ambiguity, leaf-only and token-capping mechanisms. It does not establish a command-by-command run/ask policy or prove a child cannot receive a routed command through a different host adapter.
- Strategy divergence: Next Focus remains Q1, but the dispatch orders the final Angle 10; no blocked approach was retried.

## Sources Consulted

- specs/system-skill-advisor/routing-and-scoring/007-command-surfacing-and-workflow-enforcement/research/lineages/codex-luna/deep-research-config.json:3-9,96
- specs/system-skill-advisor/routing-and-scoring/007-command-surfacing-and-workflow-enforcement/research/lineages/codex-luna/deep-research-state.jsonl
- specs/system-skill-advisor/routing-and-scoring/007-command-surfacing-and-workflow-enforcement/research/lineages/codex-luna/deep-research-strategy.md:123-165,293-296
- AGENTS.md:60-89
- .skilled/skills/system-skill-advisor/runtime/tests/prompt-policy-gold-replay.vitest.ts:44-83
- .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-routing-corpus.py:142-181
- .skilled/skills/system-skill-advisor/runtime/tests/scorer/typed-command-routing.vitest.ts:59-101
- .skilled/skills/system-skill-advisor/runtime/lib/render.ts:97-100,185-191,517-563
- .skilled/skills/system-skill-advisor/runtime/tests/doctor-brief-render.vitest.ts:57-64,103-112
- .skilled/skills/system-deep-loop/deep-research/SKILL.md:82-90
- .skilled/agents/deep-research.md:61-67
- .skilled/commands/deep/assets/deep-research-auto.yaml:771-777

## Assessment

- New information ratio: 0.80 (three new failure mechanisms, two extensions of prior ambiguity and brief-budget research).
- Questions addressed: False-trigger guard coverage, command-versus-skill ambiguity, leaf recursion, conflicting loop stops and brief-budget failure.
- Questions answered: None fully; failure controls are identified, but an all-command run/ask policy and cross-runtime verification remain open.

## Reflection

- What worked and why: Comparing test assertions with renderer implementation and loop contracts exposed the difference between an existing protective mechanism and a release gate that proves the user-visible outcome.
- What did not work and why: Existing positive replay tests and token-cap tests are split across layers, so neither proves end-to-end command selection plus safe action.
- What I would do differently: Add release evidence that covers positive and negative prompts, command/skill near-ties, child execution depth, stop-policy precedence and the complete rendered brief after truncation.

## Recommended Next Focus

Synthesis at the configured cap: merge all ten angles, record unresolved inventory/threshold/runtime questions, and append the terminal synthesis event with stopReason maxIterationsReached.
