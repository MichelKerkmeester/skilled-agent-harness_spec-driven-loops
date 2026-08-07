# Iteration 15: Plugin vs FIX-5 Scope Boundary (KQ5)

**Focus track:** plugin | **Status:** complete

## Focus
Define what is in scope for the enforcement plugin vs phase 006/FIX-5 host hard identity, to avoid overlap and to size the plugin correctly.

## Findings
- **IN SCOPE (plugin): pre-dispatch route-proof assertion (mode/target_agent/agent_definition_loaded/echoed route resolvable in registry); warn-or-fail-closed on mismatch; advisory logging. This is prompt-time + hook-time enforcement at the contract surface.** [SOURCE: iter 14; mode-registry.json]
- **OUT OF SCOPE (FIX-5/host): creating a first-class agent/agent_slug/subagent_identity field at the dispatch primitive that the runtime resolves, rejects unknown slugs, auto-loads/enforces definitions, binds permissions/model/system prompt, and prevents contradictory prompt override. That is a dispatch-primitive change, architectural, not PR-sized (../001 §8b).** [SOURCE: ../001-deep-agent-router-and-orchestration/research/research.md §8b; 006-host-hard-identity-fix5/decision-record.md:11-14]
- **Relationship: the plugin is a cheap detection layer that makes the FIX-5 false-negative (schema-valid wrong-mode dispatch) visible at dispatch. If the plugin fires (route mismatch persists despite prompt hardening), that is strong evidence to unpark FIX-5/host identity.** [SOURCE: ../001/research.md §5; iter 5; 006/decision-record.md:20-22]
- **The plugin does NOT depend on host internals (host internals are not inspectable from this workspace, ../001 §8b F31); it works entirely at the OpenCode hook + agent/command surface. So it is implementable without unparking 006.** [SOURCE: ../001/research.md §8b F31,§9]

## Sources Consulted
- ../001-deep-agent-router-and-orchestration/research/research.md §5,§8b,§9
- 006-host-hard-identity-fix5/decision-record.md:11-14,20-22
- mode-registry.json
- iter 14

## Assessment
- **newInfoRatio:** 0.50
- **Novelty justification:** Draws a clean detection(plugin)-vs-prevention(host) boundary and shows the plugin is implementable now without host internals or unparking 006.
- **Confidence:** 0.84
- **Key questions considered:** KQ5
- **Questions closed this iteration:** KQ5

## Reflection
**What worked:**
- Detection-vs-prevention framing cleanly separates plugin from FIX-5.

**What failed:**
- (none this iteration)

**Ruled out:**
- (none this iteration)

## Recommended Next Focus
KQ6: GPT-vs-Claude behavioral benchmark design (latency + first-dispatch correctness).
