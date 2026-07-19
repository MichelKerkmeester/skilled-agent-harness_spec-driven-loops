---
title: "check(artifact, rules)"
description: "The third adapter method: check one artifact against its lane's standard and return re-verified, layer-tagged findings after known-deviation suppression."
trigger_phrases:
  - "check artifact rules"
  - "adapter check method"
  - "deterministic reasoning-agent layer"
  - "verify-first findings"
  - "layer tagged findings"
version: 1.0.0.1
---

# check(artifact, rules)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

The third adapter method: check one artifact against its lane's standard and return re-verified, layer-tagged findings after known-deviation suppression.

`check()` is where conformance is actually decided. It takes one artifact and the `standardSource()` output and returns findings, each carrying the severity, type, artifact identity, source tool, and — critically — the layer that produced it, so no finding claims more certainty than the mechanism behind it earns.

## 2. HOW IT WORKS

`check(artifact, rules[, options]) -> findings` runs each authority's sub-checks and concatenates their findings, then applies known-deviation suppression as the final step. Every adapter tags each finding with a `layer`: `deterministic` for findings a real script produced (a wrapped validator's blocking-error, a regex/grammar mismatch, a threshold breach) and `reasoning-agent` for findings that required judgment. This "no false determinism" rule (ADR-005/ADR-008) means an adapter never labels a judgment call as if a script proved it.

The reasoning-agent sub-checks are structurally verify-first: they never invent a finding. Functions like sk-doc's `checkRealityAlignment()`, sk-design's `checkAuditRubric()`, and sk-code's `checkPatternConformance()` translate only already-verified, caller-supplied contradictions into findings, and drop any entry missing its required cited evidence (reprobe evidence, a rubric dimension + citation, or a `path:line`). The deterministic sub-checks re-run their real tool on every call — never cached across invocations — so a finding always reflects live ground truth at check-time. Severity maps consistently: a wrapped tool's own hard-block (blocking error, ERROR-level drift, verification FAIL) becomes P0, its non-blocking warnings become P1, and softer signals (DQI-below-floor, advisory) become P2.

**Difference from deep-review:** deep-review's iteration produces findings across four fixed dimensions via a single leaf agent's judgment, adjudicated afterward. deep-alignment's `check()` is per-authority and per-artifact, blends real deterministic tooling with a bounded reasoning-agent layer under one honesty-tagged contract, and grounds every finding in the named authority's own standard rather than general-correctness dimensions.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `scripts/adapters/sk-doc.cjs` | Adapter | Two sub-checks (template-conformance deterministic, reality-alignment reasoning-agent) then suppression. |
| `scripts/adapters/sk-git.cjs` | Adapter | Single deterministic layer (commit grammar + branch naming) against live git state. |
| `scripts/adapters/sk-design.cjs` | Adapter | Structural conformance (deterministic) + audit-rubric (reasoning-agent). |
| `scripts/adapters/sk-code.cjs` | Adapter | Surface-routed deterministic tooling + a reasoning-agent dispatch layer. |
| `scripts/adapters/sk-design-live-render.cjs` | Adapter | Threshold checks + judgment findings over caller-supplied render evidence. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| Each `scripts/adapters/*.cjs` CLI `check` subcommand | Manual dry-run | Runs a real `check()` against one artifact for inspection while building. |

---

## 4. SOURCE METADATA

- Group: Adapter contract
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `adapter-contract/check.md`
- Primary sources: `scripts/adapters/sk-doc.cjs`, `scripts/adapters/sk-code.cjs`, `scripts/adapters/sk-design.cjs`
Related references:
- [discover.md](discover.md) — discover(scope)
- [standard-source.md](../../feature-catalog/adapter-contract/standard-source.md) — standardSource(authority)
- [../alignment-contract/verify-first.md](../../feature-catalog/alignment-contract/verify-first.md) — Verify-first
- [../alignment-contract/known-deviation-suppression.md](../../feature-catalog/alignment-contract/known-deviation-suppression.md) — Known-deviation suppression
