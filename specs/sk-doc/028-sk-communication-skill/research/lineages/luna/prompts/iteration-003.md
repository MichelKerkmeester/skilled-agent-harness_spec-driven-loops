# Iteration 3 Research Prompt

## Focus

Trace the meaning-preservation judge and evaluation quality gate from the validator exports through provider execution, render decisions, runtime adapters, and release readiness.

## Questions

1. Is `validateProjectionCandidate` called by the production provider/runtime path, or only by tests and evaluation helpers?
2. What exactly does the optional judge see, when does it run, and what are the fail-closed behavior and privacy implications?
3. Are the proxy reviewer, fidelity veto, corpus, pilot, and release gate a runtime quality gate, an offline evaluation system, or separate concerns?

## Required evidence

- Search the source import/call graph and report both positive and negative results.
- Cite exact lines for candidate execution, validator stages, judge invocation, fidelity-veto behavior, proxy-review provenance, corpus/pilot retention, runtime rendering, and release readiness.
- Distinguish the reject-only runtime judge from offline readability/meaning scoring and identify a privacy-safe wiring point.

## Boundaries

Do not modify package or skill sources. Keep the exact-original fallback and the skill's human-certification/provisional-evidence rules intact.
