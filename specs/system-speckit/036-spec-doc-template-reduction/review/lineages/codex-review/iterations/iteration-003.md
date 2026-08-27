# Review Iteration 003 — Phase plan path traceability

## Route

Resolved route: mode=review target_agent=deep-review

## Files reviewed

- `007-lazy-addon-docs/spec.md:91-94`
- `007-lazy-addon-docs/plan.md:28,105-126`
- `007-lazy-addon-docs/tasks.md:39-68`
- `008-plan-and-contract-optimization/spec.md:70-105`
- `008-plan-and-contract-optimization/plan.md:28,54-59`
- `008-plan-and-contract-optimization/tasks.md:40-66`
- `.opencode/skills/system-spec-kit/templates/{core,addons,packet-types}/`

## Finding

### F004 — P1 — Phase 007/008 execution documents target the removed manifest tree

The phase 007 and 008 specs, plans, and task rows repeatedly name `templates/manifest/*`, including the registry and core plan template. The current tree has no `manifest/` directory: those sources are now under `templates/core/` and `templates/addons/`, with the registry at the template root. The documents are therefore not executable against the shipped tree and cannot provide reliable spec-to-file traceability without a migration or explicit historical-path annotation.

Disposition: active. Finding class: `stale-execution-path`. Scope proof: full path sweep of both phase document sets plus actual template inventory.

## Claim adjudication

Claim F004: accepted P1. Counterevidence sought: shared resolver and root manifest. Alternative explanation: the paths could be historical, but task rows use imperative create/modify language and do not label them historical. Validator fingerprint: `role-tree-reference-sweep-v1`.

## Search coverage

`reviewDepthSchemaVersion: 2`; `graphCoverageMode: graphless_fallback`. Search ledger rows: `phase-007 path references -> finding:F004`; `phase-008 path references -> finding:F004`; `actual role tree -> finding:F004`.

Review verdict: CONDITIONAL
