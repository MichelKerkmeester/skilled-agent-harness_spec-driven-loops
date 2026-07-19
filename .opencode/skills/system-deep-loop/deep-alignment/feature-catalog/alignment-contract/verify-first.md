---
title: "Verify-first"
description: "Invariant 1: every finding that claims a drift from live reality is re-probed against the real validator, CLI, or registry before it is asserted."
trigger_phrases:
  - "verify-first"
  - "re-probe before asserting"
  - "no pattern-matching finding"
  - "live ground truth verification"
  - "alignment invariant 1"
version: 1.0.0.1
---

# Verify-first

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Invariant 1 of the alignment contract: every finding that claims a drift from live reality is re-probed against the real validator, CLI, or registry before it is asserted.

Pattern-matching alone is never sufficient grounds for a finding. This is the signature invariant that separates a trustworthy conformance finding from a naive linter's false positive, and the engine enforces it rather than leaving it to individual adapters to opt into.

## 2. HOW IT WORKS

The invariant expresses itself two ways across the adapters. In the deterministic sub-checks, the real tool is re-run on every `check()` call and never cached across invocations — sk-doc spawns `validate_document.py`/`extract_structure.py` live, sk-code re-runs `verify_alignment_drift.py`/the Webflow verifiers live, and sk-git re-fetches commit and branch state at check-time because `discover()` only ever returned a SHA, never a cached message. In the reasoning-agent sub-checks, the function never invents a finding: `checkRealityAlignment()` (sk-doc), `checkAuditRubric()` (sk-design), `checkPatternConformance()` (sk-code), and `checkJudgmentFindings()` (live-render) each translate only already-verified, caller-supplied contradictions into findings, and each drops any entry missing its required cited evidence — a reprobe result, a rubric dimension plus citation, or a `path:line`. No evidence in means no finding out.

The live-render adapter takes this furthest: when it cannot obtain real render evidence it returns an explicit `render-unavailable`/`unavailable`-labelled finding rather than a fabricated pass, encoding "honest gap over assumed clean" as a first-class outcome.

**Difference from deep-review:** deep-review has an adversarial self-check that re-reads P0 blocker evidence before a FAIL is finalized — a strong but review-scoped guard on high-severity findings. deep-alignment applies verify-first to *every* finding at every severity, as a contract invariant the adapters are built around, because a conformance claim ("this drifts from authority X's standard") is only worth asserting if it survives a live re-probe against that authority's own tooling.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `SKILL.md` | Skill contract | §2 states invariant 1 and the ALWAYS "re-verify a finding against live ground truth before recording it" rule. |
| `scripts/adapters/sk-git.cjs` | Adapter | `checkCommit`/`checkBranch` re-fetch live git state at check-time (the clearest verify-first re-probe). |
| `scripts/adapters/sk-doc.cjs` | Adapter | `checkRealityAlignment()` requires `reprobeEvidence` before emitting a `reality-drift` finding. |
| `scripts/adapters/sk-code.cjs` | Adapter | `checkPatternConformance()` requires cited `path:line` evidence; `buildReasoningLayerDispatch()` prepares the re-probe. |
| `scripts/adapters/sk-design-live-render.cjs` | Adapter | Returns an honest `unavailable`-labelled finding when live evidence cannot be obtained. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| Each `scripts/adapters/*.cjs` CLI `check` subcommand | Manual dry-run | Runs the live re-probe path against real artifacts, the discipline used to seed every deviation list. |

---

## 4. SOURCE METADATA

- Group: Alignment contract
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `alignment-contract/verify-first.md`
- Primary sources: `SKILL.md`, `scripts/adapters/sk-git.cjs`, `scripts/adapters/sk-doc.cjs`
Related references:
- [known-deviation-suppression.md](../../feature-catalog/alignment-contract/known-deviation-suppression.md) — Known-deviation suppression
- [read-only-default.md](../../feature-catalog/alignment-contract/read-only-default.md) — Read-only default
- [../adapter-contract/check.md](../adapter-contract/check.md) — check(artifact, rules)
