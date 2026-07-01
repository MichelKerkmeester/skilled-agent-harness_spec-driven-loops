# Iteration 14: Sub-Agent-Enforcement Plugin Feasibility (KQ5)

**Focus track:** plugin | **Status:** complete

## Focus
Assess feasibility of a genuine OpenCode plugin (hook-based) that structurally forces correct sub-agent selection at dispatch time rather than relying on prompt discipline.

## Findings
- **The host exposes a hook surface: skill-advisor hook-injected context is a live pattern (AGENTS.md Gate 2; deep.md:30 treats hook-injected recommendations as routing hints). A dispatch-time hook could inspect the resolved route and block/warn on mismatch.** [SOURCE: AGENTS.md GATE 2; deep.md:30; orchestrate.md:36]
- **A pre-dispatch enforcement plugin could assert: for any Task dispatch claiming a deep mode, require a Deep Route header whose mode/target_agent/execution are resolvable in mode-registry.json and whose agent_definition_loaded is verifiable — i.e., enforce the route-proof fields (from iter 5) at dispatch, not just at validation.** [SOURCE: mode-registry.json; iter 5 route-proof; deep.md:69-75]
- **Candidate home: system-skill-advisor already owns routing metadata and the drift-guard that keeps its maps == registry projection (mode-registry.json:16). Co-locating enforcement there reuses the same source of truth and avoids a new skill.** [SOURCE: mode-registry.json:10-16; AGENTS.md system-skill-advisor]
- **Feasibility verdict: FEASIBLE as a hook that runs the route-proof assertion pre-dispatch and fails-closed (or warns) on mismatch. It is advisory-complementary: it cannot create hard identity (that needs FIX-5/host, ../001 §8b) but it can structurally catch the schema-valid-wrong-mode false-negative at dispatch time.** [SOURCE: ../001/research.md §5,§8b; iter 5]

## Sources Consulted
- AGENTS.md GATE 2
- deep.md:30,69-75
- mode-registry.json:10-16
- ../001-deep-agent-router-and-orchestration/research/research.md §5,§8b
- orchestrate.md:36

## Assessment
- **newInfoRatio:** 0.60
- **Novelty justification:** Locates the enforcement plugin in system-skill-advisor reusing the registry + drift-guard, and bounds it: catches the false-negative at dispatch but cannot create hard identity.
- **Confidence:** 0.83
- **Key questions considered:** KQ5
- **Questions closed this iteration:** (none closed this iteration)

## Reflection
**What worked:**
- Reusing system-skill-advisor + mode-registry as the enforcement source of truth avoids a new skill.

**What failed:**
- (none this iteration)

**Ruled out:**
- (none this iteration)

## Recommended Next Focus
KQ5: scope the plugin vs phase 006/FIX-5 (host hard identity) boundary.
