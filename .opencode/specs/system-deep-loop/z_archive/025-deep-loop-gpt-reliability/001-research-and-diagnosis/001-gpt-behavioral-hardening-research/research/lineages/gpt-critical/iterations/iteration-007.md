# Iteration 7: FIX-5 Decision Under Confirmed Symptoms

## Focus

Decide whether operator-confirmed symptoms should unpark FIX-5 now.

## Findings

1. The existing FIX-5 trigger is artifact-based: route-mismatched artifact, dispatch failure/missing artifact while native/Claude passes, then the agent-layer fix is insufficient. [SOURCE: 006-host-hard-identity-fix5/decision-record.md:20-34]
2. The original hard-identity spec is architectural: it would add a first-class agent identity at Task/command dispatch, bind permissions/system prompt/provenance, and reject mismatches. [SOURCE: 001-deep-agent-router-and-orchestration/research/research.md:163-171]
3. Confirmed operator symptoms justify action now, but not necessarily FIX-5 first. Phase-0 literalism and ai-council route-proof false-pass are cheaper targeted fixes that FIX-5 would not fully solve: hard identity does not remove fuzzy command self-assessment gates, and process isolation does not canonicalize route-proof values.
4. Corrected criterion: do not wait because evidence is "insufficient"; wait because the next targeted fixes are smaller and directly address confirmed mechanisms. Unpark FIX-5 if, after Phase-0 removal, route-proof canonicalization, NDP-safe orchestrate registry reuse, and plugin guard, GPT still misroutes semantically or remains disproportionately stuck/slow versus Claude in the benchmark.

## Sources Consulted

- `006-host-hard-identity-fix5/decision-record.md:20-34`
- `001-deep-agent-router-and-orchestration/research/research.md:163-171`
- `.opencode/commands/deep/research.md:39-72`
- `.opencode/commands/deep/assets/deep_ai-council_auto.yaml:117-136`

## Assessment

- newInfoRatio: 0.52
- Novelty justification: Changes the rationale for waiting from evidence insufficiency to target/blast-radius sequencing.
- Confidence: 0.80

## Reflection

- What worked: Asking which confirmed symptom each fix actually addresses.
- What failed: The prior GPT lineage made "more evidence" sound like the main reason to wait.
- Ruled out: Immediate FIX-5 solely because symptoms are confirmed.

## Recommended Next Focus

Convert findings into implementation-ready deliverables and order.
