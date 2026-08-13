---
title: "sk-communication: Manual Testing Playbook"
description: "Operator-facing manual validation for sk-communication routing, fidelity, privacy, presentation tiers, and fail-closed release controls."
version: 1.0.0.0
---

# sk-communication: Manual Testing Playbook

This playbook is the operator directory and release-review surface for the `sk-communication` skill and the `@portable-cli/communication-projection` package. Per-feature files contain the exact prompt, commands, signals, evidence, verdict criteria, and failure triage for each deterministic scenario.

<!-- MANUAL_PLAYBOOK_RESULT_PERSISTENCE_CONTRACT -->
A scenario run is complete only after its `PASS`, `FAIL`, or `SKIP` outcome and reason are persisted through `run-manual-playbook-scenario.cjs` into the skill's `benchmark/reports/<dated-run-label>/` directory. Generated report Markdown is renderer-owned and must not be hand-authored.

---

## 1. OVERVIEW

The operator validator derives the scenario and category census from this package tree. Coverage spans advisor activation, exact-original and privacy ordering invariants, full-projection and safe-native display behavior, and the evaluation, doctor, and release gates that fail closed.

Coverage note: automated tests remain authoritative for exhaustive unit, integration, fixture, performance, and runtime-matrix coverage. These scenarios select operator-visible invariants that can be reproduced with stable prompts and focused existing commands; they do not replace the full package gate.

### Realistic Test Model

1. Begin with the exact natural-human prompt in the selected feature file.
2. Run the listed command sequence without substituting a broader or weaker check.
3. Compare named test output or advisor output with the expected signals.
4. Capture the transcript, exit status, and concise signal summary.
5. Assign only `PASS`, `FAIL`, or `SKIP`, then persist the result with the canonical wrapper.

### Package Boundaries

- The playbook validates display-only projection; it never authorizes writing rewritten text into canonical events, transcripts, tool data, or model context.
- All scenarios are non-destructive. Test runners may create ordinary ignored build or cache output.
- A `SKIP` requires a named environment blocker such as a missing supported Node runtime, missing installed package dependencies, or an unavailable advisor runtime with no working compatibility fallback.

---

## 2. GLOBAL PRECONDITIONS

1. Start at the repository root unless a scenario explicitly changes into the projection package.
2. Use Node.js 22 or newer, npm 10 or newer, and the package dependencies already installed from its lockfile.
3. Use Python 3 for the advisor compatibility smoke in `COMM-001`.
4. Confirm the referenced scenario file, catalog file, implementation file, and test file exist before execution.
5. Preserve unrelated working-tree changes and record `git status --short` before and after the run.
6. Do not contact a live provider; all package scenarios use existing injected transports or deterministic fixtures.

---

## 3. GLOBAL EVIDENCE REQUIREMENTS

Capture the following for every scenario:

- Feature ID and per-feature file path.
- Exact prompt, copied without paraphrase.
- Command transcript with exit status.
- Named test or advisor recommendation that demonstrates the invariant.
- Expected signals and observed signals, including any contradiction.
- Final `PASS`, `FAIL`, or `SKIP` verdict with a one-sentence reason.
- Persisted benchmark report directory returned by the canonical scenario wrapper.

Evidence must remain content-free: never capture provider credentials, raw private transcript text, prompt bodies beyond the public scenario prompt, or candidate projection content from a live user session.

---

## 4. DETERMINISTIC COMMAND NOTATION

- `bash: <command>` means run the command exactly in a POSIX-compatible shell.
- `package: <command>` means run the command from `.opencode/skills/sk-communication/cli-communication-projection/`.
- `->` separates sequential steps in a single operator session.
- Quoted Vitest names are exact focused-test filters, not descriptive placeholders.
- An exit status of zero is required unless the feature file explicitly names a different observable result.
- The full package gate is `package: npm run check`; focused commands prove the individual scenario and do not waive that final gate.

---

## 5. REVIEW PROTOCOL AND RELEASE READINESS

### Scenario Acceptance Rules

A scenario is `PASS` only when its preconditions hold, the exact prompt and commands were used, every expected signal is present, evidence is complete, and no contradictory signal appears. It is `FAIL` when a command fails, an expected signal is absent, a contradictory signal appears, or evidence shows canonical-state, privacy, presentation-tier, or release-gate drift. It is `SKIP` only when a specific environment blocker prevents execution and the blocker is recorded.

### Release Review Rules

1. Every root-indexed scenario maps to exactly one per-feature file and one current catalog entry.
2. All critical-path scenarios must be `PASS`; any `FAIL` prevents release recommendation.
3. A `SKIP` does not count as passing release evidence and must be resolved before release recommendation.
4. `npm run check` must pass from the package directory after the selected manual scenarios.
5. The root document and package contract validators must exit zero from the final tree.

### Result Persistence

After assigning the verdict, run the canonical wrapper from the repository root, replacing the shell values with the actual scenario ID, feature slug, verdict, reason, stage, and evidence paths:

```bash
node .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-manual-playbook-scenario.cjs \
  --skill sk-communication \
  --scenario COMM-001 \
  --variant advisor-routes-projection-request \
  --verdict PASS \
  --reason "Advisor returned sk-communication as the passing top recommendation." \
  --stage routing
```

---

## 6. OPERATOR EXECUTION WAVES

Run scenarios in dependency order so failures are localized:

| Wave | Category | Scenario IDs | Purpose |
|---|---|---|---|
| 1 | Advisor Routing | `COMM-001` | Confirm the request reaches the owning skill. |
| 2 | Fidelity And Privacy | `COMM-002..COMM-003` | Confirm immutable fallback and privacy-before-ranking. |
| 3 | Presentation Tiers | `COMM-004..COMM-005` | Confirm atomic ownership and original visibility. |
| 4 | Release Gating | `COMM-006..COMM-008` | Confirm provisional evidence, doctor blocks, and human-certified release evidence. |

Finish each wave before beginning the next. Persist results after each scenario so a later operator can distinguish an unexecuted scenario from an executed failure.

---

## 7. ADVISOR ROUTING

### COMM-001 | Advisor routes a projection request

Verify the skill advisor selects `sk-communication` for a plain-English projection request that also names canonical-byte and privacy constraints.

Prompt: `Rewrite terse agent status output into plain English without changing canonical bytes, and use privacy-first provider routing.`

> **Feature File:** [COMM-001](advisor-routing/advisor-routes-projection-request.md)
> **Catalog:** [Privacy-first provider routing](../feature-catalog/provider-and-privacy/privacy-first-provider-routing.md)

---

## 8. FIDELITY AND PRIVACY

### COMM-002 | Exact-original fidelity fallback

Verify protected commands round-trip byte-for-byte and provider terminal failures return exact-original output before semantic evaluation.

Prompt: `Verify that a failed communication projection returns the exact original bytes and preserves protected commands, then give me a PASS or FAIL verdict with test evidence.`

> **Feature File:** [COMM-002](fidelity-and-privacy/exact-original-fidelity-fallback.md)
> **Catalog:** [Protected-span fidelity validation](../feature-catalog/fidelity-and-render/protected-span-fidelity-validation.md)

### COMM-003 | Privacy precedes provider ranking

Verify missing hosted-egress consent denies the route before the ranker runs and only privacy-approved candidates reach ranking.

Prompt: `Check that hosted egress is rejected before provider ranking when consent is absent, and return a PASS or FAIL verdict with the focused test evidence.`

> **Feature File:** [COMM-003](fidelity-and-privacy/privacy-precedes-provider-ranking.md)
> **Catalog:** [Privacy-first provider routing](../feature-catalog/provider-and-privacy/privacy-first-provider-routing.md)

---

## 9. PRESENTATION TIERS

### COMM-004 | Full projection requires atomic ownership

Verify a complete message is atomically replaced only when the client owns both the complete message and the render decision.

Prompt: `Verify that a client-owned complete message uses an atomic full projection only when it owns the render decision, then report PASS or FAIL with evidence.`

> **Feature File:** [COMM-004](presentation-tiers/full-projection-requires-atomic-ownership.md)
> **Catalog:** [Capability-aware presentation](../feature-catalog/fidelity-and-render/capability-aware-presentation.md)

### COMM-005 | Safe-native preserves original visibility

Verify append and sidecar degradations retain the original, while failed display commits return original-only.

Prompt: `Verify that safe-native append and sidecar presentation keep the original visible, including commit failures, then report PASS or FAIL with evidence.`

> **Feature File:** [COMM-005](presentation-tiers/safe-native-preserves-original-visibility.md)
> **Catalog:** [Capability-aware presentation](../feature-catalog/fidelity-and-render/capability-aware-presentation.md)

---

## 10. RELEASE GATING

### COMM-006 | Provisional evaluation cannot authorize release

Verify LLM-proxy review keeps its numeric result but remains provisional and causes the package release gate to refuse authorization.

Prompt: `Prove that an LLM-proxy evaluation remains provisional and cannot authorize a communication-projection release, then return PASS or FAIL with evidence.`

> **Feature File:** [COMM-006](release-gating/provisional-evaluation-blocks-release.md)
> **Catalog:** [Blind non-inferiority evaluation](../feature-catalog/evaluation-and-observability/blind-non-inferiority-evaluation.md)

### COMM-007 | Compatibility doctor selects original-only

Verify an incompatible runtime protocol produces a blocking doctor report and selects the original-only route.

Prompt: `Run the compatibility doctor against an incompatible protocol major and verify it selects original-only, then return PASS or FAIL with evidence.`

> **Feature File:** [COMM-007](release-gating/compatibility-doctor-selects-original-only.md)
> **Catalog:** [Compatibility doctor](../feature-catalog/packaging-and-release/compatibility-doctor.md)

### COMM-008 | Human-certified bundle gates release

Verify a release succeeds only with a complete, fresh, passing, human-certified evidence bundle.

Prompt: `Verify that only a complete, fresh, passing, human-certified evidence bundle can release the projection package, then return PASS or FAIL with evidence.`

> **Feature File:** [COMM-008](release-gating/human-certified-bundle-gates-release.md)
> **Catalog:** [Release readiness and rollback](../feature-catalog/packaging-and-release/release-readiness-and-rollback.md)

---

## 11. AUTOMATED TEST CROSS-REFERENCE

The complete automated suite lives under [`.opencode/skills/sk-communication/cli-communication-projection/test/`](../../../../.opencode/skills/sk-communication/cli-communication-projection/test/). Focused scenario commands use only files in that tree; final release review also runs `npm run check` from the package directory.

| Coverage Area | Automated Test Anchor | Scenario IDs |
|---|---|---|
| Advisor routing | [Advisor compatibility entry point](../../system-skill-advisor/mcp-server/scripts/skill_advisor.py) | `COMM-001` |
| Fidelity fallback | [Protected spans](../../../../.opencode/skills/sk-communication/cli-communication-projection/test/fidelity/protected-spans.test.ts), [fidelity validator](../../../../.opencode/skills/sk-communication/cli-communication-projection/test/fidelity/validator.test.ts) | `COMM-002` |
| Privacy routing | [Privacy router tests](../../../../.opencode/skills/sk-communication/cli-communication-projection/test/providers/privacy.test.ts) | `COMM-003` |
| Full projection | [Client display tests](../../../../.opencode/skills/sk-communication/cli-communication-projection/test/clients/display.test.ts) | `COMM-004` |
| Safe-native | [Client display tests](../../../../.opencode/skills/sk-communication/cli-communication-projection/test/clients/display.test.ts), [sidecar tests](../../../../.opencode/skills/sk-communication/cli-communication-projection/test/clients/sidecar.test.ts) | `COMM-005` |
| Provisional evaluation | [Proxy judge tests](../../../../.opencode/skills/sk-communication/cli-communication-projection/test/evaluation/proxy-judge.test.ts), [release gate tests](../../../../.opencode/skills/sk-communication/cli-communication-projection/test/release/release-gate.test.ts) | `COMM-006` |
| Compatibility doctor | [Doctor tests](../../../../.opencode/skills/sk-communication/cli-communication-projection/test/doctor/doctor.test.ts) | `COMM-007` |
| Release readiness | [Release gate tests](../../../../.opencode/skills/sk-communication/cli-communication-projection/test/release/release-gate.test.ts) | `COMM-008` |

---

## 12. FEATURE CATALOG CROSS-REFERENCE INDEX

| Category | Feature ID | Feature File | Catalog Entry | Critical Path |
|---|---|---|---|---|
| Advisor Routing | `COMM-001` | [Advisor routes projection request](advisor-routing/advisor-routes-projection-request.md) | [Privacy-first provider routing](../feature-catalog/provider-and-privacy/privacy-first-provider-routing.md) | Yes |
| Fidelity And Privacy | `COMM-002` | [Exact-original fidelity fallback](fidelity-and-privacy/exact-original-fidelity-fallback.md) | [Protected-span fidelity validation](../feature-catalog/fidelity-and-render/protected-span-fidelity-validation.md) | Yes |
| Fidelity And Privacy | `COMM-003` | [Privacy precedes provider ranking](fidelity-and-privacy/privacy-precedes-provider-ranking.md) | [Privacy-first provider routing](../feature-catalog/provider-and-privacy/privacy-first-provider-routing.md) | Yes |
| Presentation Tiers | `COMM-004` | [Full projection requires atomic ownership](presentation-tiers/full-projection-requires-atomic-ownership.md) | [Capability-aware presentation](../feature-catalog/fidelity-and-render/capability-aware-presentation.md) | Yes |
| Presentation Tiers | `COMM-005` | [Safe-native preserves original visibility](presentation-tiers/safe-native-preserves-original-visibility.md) | [Capability-aware presentation](../feature-catalog/fidelity-and-render/capability-aware-presentation.md) | Yes |
| Release Gating | `COMM-006` | [Provisional evaluation blocks release](release-gating/provisional-evaluation-blocks-release.md) | [Blind non-inferiority evaluation](../feature-catalog/evaluation-and-observability/blind-non-inferiority-evaluation.md) | Yes |
| Release Gating | `COMM-007` | [Compatibility doctor selects original-only](release-gating/compatibility-doctor-selects-original-only.md) | [Compatibility doctor](../feature-catalog/packaging-and-release/compatibility-doctor.md) | Yes |
| Release Gating | `COMM-008` | [Human-certified bundle gates release](release-gating/human-certified-bundle-gates-release.md) | [Release readiness and rollback](../feature-catalog/packaging-and-release/release-readiness-and-rollback.md) | Yes |

> **COMM-001 catalog mapping.** COMM-001 validates *skill-level advisor discoverability* — that a projection prompt routes to `sk-communication`. That is a property of the skill wrapper, not the `cli-communication-projection` package, so the package feature catalog (which inventories package behavior) has no exact entry for it. The linked "Privacy-first provider routing" catalog entry is the nearest package behavior the scenario prompt exercises.
>
> **Automated-only catalog features.** Five catalog features are internal or structural and are verified by the package's automated gate (`npm run check`), not a dedicated manual scenario: generation-keyed message assembly, bounded context selection, provider adapters and execution, the six-runtime adapter matrix, and content-free observability.
