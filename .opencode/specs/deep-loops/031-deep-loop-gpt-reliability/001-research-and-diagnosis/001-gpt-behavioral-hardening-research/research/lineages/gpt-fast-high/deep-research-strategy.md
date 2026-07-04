# Deep Research Strategy: GPT Behavioral Hardening Follow-Up

## Research Topic
GPT behavioral hardening follow-up for packet 031: ai-council subagent-only, orchestrate hardening v2, sub-agent enforcement plugin, GPT-vs-Claude benchmark, and FIX-5 unpark decision.

## Known Context
- `resource-map.md` was not present in the spec folder at init; skipping coverage gate.
- Parent packet says phase 005 is blocked/inconclusive because 0/4 command-owned smokes reached leaf dispatch, and phase 006 remains parked on inconclusive evidence, not proof of sufficiency [SOURCE: .opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/spec.md:76-78].
- Phase 007 requires >=30 iterations and KQ1-KQ9 evidence-backed answers [SOURCE: .opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/007-gpt-behavioral-hardening-research/spec.md:98-113].

## Key Questions
- KQ1 decisive external smoke; KQ2 symptom mechanism; KQ3 ai-council mode; KQ4 orchestrate v2; KQ5 plugin enforcement; KQ6 benchmark; KQ7 literal-pattern; KQ8 propagation; KQ9 FIX-5 unpark.

## Answered Questions
- KQ1-KQ9 answered in `research.md` with file:line evidence.

## What Worked
- Registry-bound route analysis from `deep.md` and `mode-registry.json`.
- Existing validator and YAML route-proof fields.
- Plugin hook evidence from local plugin entrypoints.

## What Failed
- Treating nested OpenCode smokes as decisive; phase 005 shows they stop at self-invocation/general-agent gates.
- Converting council to subagent-only as a shortcut; `mode: all` preserves direct depth-0 council behavior.

## Exhausted Approaches
- Re-derive original taxonomy: out of scope and prior evidence is already caveated.
- Immediate FIX-5 implementation: too high blast radius without external smoke/benchmark evidence.

## Ruled-Out Directions
| Approach | Reason | Evidence |
|---|---|---|
| Accept phase 005 as pass | Command-owned smokes failed before leaf dispatch | `.opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/005-gpt-verification-smoke/implementation-summary.md:99-104` |
| Make ai-council subagent-only now | Direct depth-0 seat dispatch is documented behavior | `.opencode/agents/ai-council.md:53-58` |
| Plugin as hard identity | Available plugin hooks transform messages/system context, not Task dispatch identity | `.opencode/plugins/mk-code-graph.js:442-518` |

## Next Focus
Synthesis complete. Recommended next phase is external-shell smoke plus benchmark harness, followed by route-unification and optional prompt-transform enforcement plugin.

## Non-Goals
- No code implementation in this lineage.
- No writes outside the lineage artifact directory.

## Stop Conditions
- Completed exactly 30 iterations under `max-iterations`; convergence before iteration 30 was treated as telemetry only.
