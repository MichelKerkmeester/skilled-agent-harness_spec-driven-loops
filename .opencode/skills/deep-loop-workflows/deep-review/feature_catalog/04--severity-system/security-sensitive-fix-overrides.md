---
title: "Security-sensitive fix overrides"
description: "Spec-only contract describing tighter convergence thresholds and closed-gate replay requirements for review reruns after security-sensitive fixes. Not yet runtime-enforced."
trigger_phrases:
  - "security-sensitive fix overrides"
  - "closed-gate replay"
  - "security rerun tighter thresholds"
  - "requiredFixCompletenessGate"
  - "fix completeness replay"
version: 1.11.0.5
---

# Security-sensitive fix overrides

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Describes the tighter stop contract a review should apply when re-reviewing a fix that touched a security-sensitive surface, so a rerun cannot stop without replaying the previously closed gates.

This entry documents a target contract rather than shipped behavior. It exists so operators know what manual rigor to apply today and so the next implementation pass has a single authoritative spec to build against.

## 2. HOW IT WORKS

This is a SPEC-ONLY contract. As of the current release, the runtime does NOT auto-detect security sensitivity and does NOT apply these overrides. `requiredClosedFindingReplay` and `requiredFixCompletenessGate` exist in no config, YAML, or reducer surface (verified by grep). Operators running a security-sensitive review must manually tighten thresholds via `--convergence` and `--max-iterations` and manually maintain the closed-gate replay table.

The target contract applies to reruns after fixes involving security, path disclosure, auth/authz, sandboxing, env precedence, public schemas, persistence, or user-visible error payloads. Its overrides relative to the general defaults are: `minStabilizationPasses` 1 to 2, `requiredClosedFindingReplay` false to true (for prior P0/P1 and any prior security or path P2), and `requiredFixCompletenessGate` false to true. When implemented, STOP would not be legal until the review report contains a closed-gate replay table marking each prior active or remediated P0/P1 as PASS, FAIL, or carried-forward with file:line or command evidence.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `references/convergence/convergence.md` | Protocol | Security-Sensitive Fix Overrides section, marked SPEC ONLY, with the override matrix and replay requirement. |
| `feature_catalog/04--severity-system/quality-gates.md` | Catalog | `fixCompletenessReplayGate` is the legal-stop gate that would enforce this contract once shipped. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `manual_testing_playbook/04--convergence-and-recovery/review-quality-guards-block-premature-stop.md` | Manual scenario | Covers the quality-guard layer the override contract would tighten. |

---

## 4. SOURCE METADATA

- Group: Severity system
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `04--severity-system/security-sensitive-fix-overrides.md`
- Primary sources: `references/convergence/convergence.md`
- Status: SPEC ONLY (not yet runtime-enforced)
Related references:
- [convergence-signals.md](convergence-signals.md) — Semantic convergence signals
