# Iteration 5: Decisive Smoke Procedure Design — All 4 Modes (KQ1)

**Focus track:** smoke | **Status:** complete

## Focus
Design the precise, implementation-ready external smoke procedure (all 4 deep modes) that yields a clean PASS/FAIL, closing phase 005's infrastructure-blocked gap.

## Findings
- **Smoke harness contract: spawn each mode's /deep:* command from a clean non-OpenCode shell (no OPENCODE_* env, no opencode ancestor, no ~/.opencode state lock) with GPT-5.5 against a tiny packet; snapshot pre-run state-log count first.** [SOURCE: 005-gpt-verification-smoke/verification-smoke.md:56-66; cli-opencode/SKILL.md:319]
- **Per-mode PASS criteria (all required): exactly one new canonical iteration/review/seat/round record of the requested mode; expected artifact+delta paths exist; no dispatch_failure record; executor provenance names GPT/OpenAI; AND route-proof fields (mode/target_agent/agent_definition_loaded/echoed resolved_route) all match the requested mode.** [SOURCE: 005-gpt-verification-smoke/verification-smoke.md:42-65; ../001/research.md §5,§7]
- **CRITICAL augmentation over phase-005 validators: route-proof assertion must check agent_definition_loaded==true (the bounded probes returned false), because a schema-valid wrong-mode dispatch passes existence/schema checks.** [SOURCE: ../001-deep-agent-router-and-orchestration/research/research.md §5 (false-negative)]
- **Baseline control: run the same tiny packet under native/Claude in the same external shell; the GPT run must match the Claude run on every criterion for a PASS.** [SOURCE: ../001-deep-agent-router-and-orchestration/research/research.md §7]

## Sources Consulted
- 005-gpt-verification-smoke/verification-smoke.md:42-66,90-99
- ../001-deep-agent-router-and-orchestration/research/research.md §5,§7
- cli-opencode/SKILL.md:319

## Assessment
- **newInfoRatio:** 0.60
- **Novelty justification:** Promotes the 005 procedure from "blocked attempt" to a complete, route-proof-augmented, baseline-controlled specification ready for an implementation phase.
- **Confidence:** 0.90
- **Key questions considered:** KQ1
- **Questions closed this iteration:** KQ1

## Reflection
**What worked:**
- Combining the 005 procedure with the §5 false-negative augmentation yields a decisive test.

**What failed:**
- (none this iteration)

**Ruled out:**
- **Re-running the smoke from inside an OpenCode session (any layer of the guard trips)**: structurally cannot clear OPENCODE_PID; proven by phase 005 [SOURCE: 005-gpt-verification-smoke/verification-smoke.md:120]

## Recommended Next Focus
KQ2: map the operator symptoms to mechanisms now that the smoke/latent evidence is fixed.
