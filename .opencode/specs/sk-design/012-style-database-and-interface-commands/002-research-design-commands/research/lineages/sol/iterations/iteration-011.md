# Iteration 11: `/interface:audit` Creation Template

## Focus
Turn audit routing into a complete diagnose-prioritize-remediate-verify workflow while preserving evidence authority.

## Findings
1. **Brief intake:** target/build state, user journeys and viewports, known constraints, baseline evidence, applicable axes (accessibility, responsive, performance, theming, anti-slop), severity policy, mutation boundary, and proof environment. If no runnable surface exists, declare a static-review evidence ceiling. [SOURCE: .opencode/skills/sk-design/design-audit/SKILL.md:34-42]
2. **Exemplar grounding:** references are comparative controls, not desired aesthetics. Select an owned standard or comparable shipped interaction for a named criterion; record criterion, observed delta, transferability, and environmental differences. Never mark a mismatch as a defect merely because an exemplar differs.
3. **Scaffolded flow:** `Context Manifest -> scope/baseline -> audit mode -> axis references + tooling route -> evidence capture -> finding severity/confidence -> root-cause cluster -> remediation brief -> approval/mutation boundary -> sk-code implementation -> same-scenario re-test -> before/after evidence -> residual-risk verdict`. [SOURCE: .opencode/skills/sk-design/design-audit/SKILL.md:49-75]
4. **Creative build boundary:** audit may create a prioritized remediation design, acceptance criteria, and accepted handoff; it must not silently mutate or invent a new visual direction. Findings remain hypotheses until reproduced against an observable symptom. No baseline means no `improved` claim.
5. **Visible output:** `Audit Scope`, `Baseline`, `Evidence Ledger`, `Findings by Severity`, `Root-Cause/Remediation Plan`, `Accepted Fix Handoff`, `Re-test Delta`, and `Residual Risks/Verdict`. Each finding identifies observation, impact, evidence, confidence, and confirmation method.

## Prompt Template
```text
Audit and harden {target}. Resolve {journeys, viewports, constraints, baseline, axes, severityPolicy, mutationBoundary, proofEnvironment}. State the static or runtime evidence ceiling. Use owned standards and criterion-fit comparators only as controls, never as taste mandates. Load sk-design mode audit, minimum axis references, and the appropriate measurement transport. Capture reproducible evidence, classify severity/confidence, cluster root causes, and create a bounded remediation brief with acceptance criteria. Do not mutate until the boundary permits an accepted sk-code handoff. Re-run the same scenarios after implementation and report the baseline delta; without a baseline, report current evidence only. Return the eight output blocks and an evidence-qualified verdict.
```

## Ruled Out
- Audit as subjective redesign.
- `Improved` or `verified` without matched before/after evidence.

## Assessment
- New information ratio: 0.53
- Novelty justification: Adds baseline control, evidence ceiling, remediation handoff, matched re-test, and qualified verdict.

## Recommended Next Focus
Specialize design-reference extraction as provenance-preserving evidence creation rather than generic visual design.
