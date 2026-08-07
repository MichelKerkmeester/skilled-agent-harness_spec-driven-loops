# Context Index — Router-Unification Program

The current topology is authoritative on disk: `015-router-unification-program/` has nineteen direct children. The former unified-refactor grouping was dissolved after the committed move; its implementation children are now direct children of this parent. Child `019-routing-coverage-activation-verification/` retains its own internal children and numbering.

## Current flat topology

| Child | Focus |
|-------|-------|
| `001-3-tier-consistency-standard` | Fleet-wide three-tier routing standard and freshness gates |
| `002-default-mode-implementation` | Shipped parent-hub defaultMode policy |
| `003-contract-schemas` | Versioned contract family, canonical bytes, and hashing |
| `004-compiler-n1-shadow` | N=1 shadow compiler and parity proof |
| `005-decision-evaluator` | Closed decision algebra and typed route-gold projection |
| `006-execution-verify-commit` | Destination-local execution and proof lifecycle |
| `007-recovery-ladder` | Shared-budget clarify and handoff recovery |
| `008-calibration` | Held-out corpus and calibrated controller |
| `009-parent-hub-rollout` | Per-hub canary rollout |
| `010-learning-overlay` | Offline correction overlay |
| `011-fleet-cleanup` | Legacy dual-read retirement |
| `012-non-hub-rollout` | Standalone non-hub rollout |
| `013-live-activation` | Fenced live activation |
| `014-runtime-engine` | Stable promoted runtime resolver and engine |
| `015-cutover-hardening` | Runtime cutover hardening and status probes |
| `016-default-on-decision` | Default-on policy and rollback decision |
| `017-create-skill-alignment` | Compiled-ready create-skill onboarding |
| `018-benchmark-alignment` | Compiled-serving benchmark lane |
| `019-routing-coverage-activation-verification` | Coverage build-out, activation, parity, and end-to-end verification |

## Old → new mapping for the dissolved grouping

| Former child under `003-unified-refactor-implementation` | Current direct child |
|---|---|
| `000-contract-schemas` | `003-contract-schemas` |
| `001-compiler-n1-shadow` | `004-compiler-n1-shadow` |
| `002-decision-evaluator` | `005-decision-evaluator` |
| `003-execution-verify-commit` | `006-execution-verify-commit` |
| `004-recovery-ladder` | `007-recovery-ladder` |
| `005-calibration` | `008-calibration` |
| `006-parent-hub-rollout` | `009-parent-hub-rollout` |
| `007-learning-overlay` | `010-learning-overlay` |
| `008-fleet-cleanup` | `011-fleet-cleanup` |
| `009-non-hub-rollout` | `012-non-hub-rollout` |
| `010-live-activation` | `013-live-activation` |
| `011-runtime-engine` | `014-runtime-engine` |
| `012-cutover-hardening` | `015-cutover-hardening` |
| `012-default-on-decision` | `016-default-on-decision` |
| `013-create-skill-alignment` | `017-create-skill-alignment` |
| `014-benchmark-alignment` | `018-benchmark-alignment` |
| `015-routing-coverage-activation-verification` | `019-routing-coverage-activation-verification` |

The two former `012` children are now distinct `015` and `016` siblings. The former grouping folder itself has no current directory; its unified-router summary and shared migration-gate model are folded into this parent's `spec.md`.

## Research and structural pointers

- Unified-router design evidence: `../001-research/010-unified-refactor-research/`
- Extracted sk-code routing research: `../001-research/011-sk-code-routing-research/`
- Root packet: `../spec.md`
- Child `019` internal topology: unchanged; its own research and implementation children remain below that child.
