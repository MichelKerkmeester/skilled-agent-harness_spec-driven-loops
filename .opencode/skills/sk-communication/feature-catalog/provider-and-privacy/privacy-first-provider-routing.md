---
title: "Privacy-first provider routing"
description: "Filters providers by declared privacy policy, egress consent, and fresh evidence before any eligible provider is ranked or contacted."
trigger_phrases:
  - "Privacy-first provider routing"
  - "privacy route selection"
  - "selectPrivacyRoute"
  - "local versus hosted provider"
version: 1.0.0.0
---

# Privacy-first provider routing (selectPrivacyRoute)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Filters providers by declared privacy policy, egress consent, and fresh evidence before any eligible provider is ranked or contacted.

Routing is a metadata-only decision boundary with no transport access. The result names one approved primary and an explicit sequence of eligible attempts, or denies the route with reason-coded evaluations and no provider attempt.

---

## 2. HOW IT WORKS

The router validates every provider record and candidate identifier before checking the operator's allowed privacy classes. Hosted records additionally require egress consent, current terms evidence, and any policy-mandated facts; hosted zero-data-retention records must carry fresh, non-contradictory retention and training-use facts.

Only providers that pass privacy evaluation reach the ranker. Default ranking uses priority and a stable provider-id tie break, but ranking does not create fallback. The selected primary contributes fallbacks only through its declared explicit list, and `preservePrivacyClass` blocks a listed fallback that crosses privacy classes. Missing records, unknown facts, stale evidence, invalid custom ranking, or an empty eligible set returns a denied route.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `packages/cli-communication-projection/src/privacy/router.ts` | Handler | Applies consent and evidence checks before provider ranking. |
| `packages/cli-communication-projection/src/privacy/types.ts` | Shared | Defines approved, denied, policy, and evaluation contracts. |
| `packages/cli-communication-projection/src/providers/registry.ts` | Shared | Validates and indexes provider records used by the router. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `packages/cli-communication-projection/test/providers/privacy.test.ts` | Unit | Covers privacy classes, consent, evidence freshness, and fallbacks. |
| `packages/cli-communication-projection/test/providers/registry.test.ts` | Unit | Verifies registry validation and capability evidence handling. |
| `packages/cli-communication-projection/test/fixtures/provider-cases.json` | Fixture | Supplies provider and privacy routing cases. |

---

## 4. SOURCE METADATA

- Group: Provider And Privacy
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `provider-and-privacy/privacy-first-provider-routing.md`

Related references:
- [provider-adapters-and-execution.md](provider-adapters-and-execution.md) — Execution of the approved provider attempt sequence
