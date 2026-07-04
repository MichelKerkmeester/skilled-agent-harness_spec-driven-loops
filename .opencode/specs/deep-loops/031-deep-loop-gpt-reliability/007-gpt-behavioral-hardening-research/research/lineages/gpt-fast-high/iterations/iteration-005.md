# Iteration 5: Orchestrate Hardening V2 Minimum Edit

## Focus
KQ4 deterministic `@orchestrate` hardening.

## Findings
- `deep.md` requires resolving through `mode-registry.json`, loading the target agent definition, emitting a route header, and verifying consistency before exactly one dispatch [SOURCE: .opencode/agents/deep.md:63-79].
- `orchestrate.md` has a generic task package with `Deep Route` as one field among many, leaving the orchestrator to derive the route [SOURCE: .opencode/agents/orchestrate.md:196-225].
- `mode-registry.json` already maps `ai-council` to runtime type `council`, command `/deep:ai-council`, and agent `ai-council` [SOURCE: .opencode/skills/deep-loop-workflows/mode-registry.json:65-79].

## Sources Consulted
Deep router, orchestrator, mode registry.

## Assessment
newInfoRatio: 0.74. The minimal edit is not more prose; it is to route deep requests through the registry/deep router contract.

## Reflection
Ruled out expanding orchestrate's free-text priority table as the primary fix.

## Recommended Next Focus
Assess plugin feasibility for structural guardrails.
