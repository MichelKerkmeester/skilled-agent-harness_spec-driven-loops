# Iteration 4: Phase 005 Inconclusive Cause: Self-Invocation Guard (KQ1)

**Focus track:** smoke | **Status:** complete

## Focus
Characterize the cli-opencode self-invocation guard that blocked all 4 command-owned smokes, to specify what the decisive external environment must satisfy.

## Findings
- **cli-opencode refuses to dispatch from inside an OpenCode run via a 3-layer detector: Layer 1 env-var lookup for any OPENCODE_*; Layer 2 process-ancestry probe for an opencode parent; Layer 3 ~/.opencode/state/<id>/lock probe. Trip on ANY positive -> refuse unless explicit parallel-session keywords.** [SOURCE: cli-opencode/SKILL.md:66,87,319]
- **Phase 005 review-mode command-owned attempt failed with "cli-opencode self-invocation refused from inside OpenCode run; signal OPENCODE_PID=63869" — i.e., Layer 1 tripped.** [SOURCE: 005-gpt-verification-smoke/verification-smoke.md:120]
- **The bounded no-tools GPT probes (which bypass the guard) all preserved the requested route echo (mode/target_agent/execution) but returned agent_definition_loaded:false — so route ECHO is proven, but real leaf-load is NOT.** [SOURCE: 005-gpt-verification-smoke/verification-smoke.md:90-99]
- **Decisive external smoke requirement: a clean process tree with no OPENCODE_* env vars, no opencode ancestor, and no state lock — i.e., a genuine non-OpenCode shell or fresh worktree harness.** [SOURCE: 005-gpt-verification-smoke/verification-smoke.md:56-57; cli-opencode/SKILL.md:319]

## Sources Consulted
- cli-opencode/SKILL.md:16,66,87,319
- 005-gpt-verification-smoke/verification-smoke.md:56-57,90-99,120

## Assessment
- **newInfoRatio:** 0.70
- **Novelty justification:** First precise mapping of the 3-layer guard to the 005 failure; converts "blocked upstream" into a testable environment spec.
- **Confidence:** 0.92
- **Key questions considered:** KQ1, KQ9
- **Questions closed this iteration:** (none closed this iteration)

## Reflection
**What worked:**
- Reading the cli-opencode guard directly explains every 005 failure row.

**What failed:**
- (none this iteration)

**Ruled out:**
- (none this iteration)

## Recommended Next Focus
KQ1: design the exact decisive smoke procedure for all 4 modes with route-proof assertions.
