---
title: "Release readiness and rollback"
description: "Fails a release closed unless every dated evidence lane passes, and supplies a provider-free original-only rollback plan that preserves canonical state."
trigger_phrases:
  - "Release readiness and rollback"
  - "communication projection release gate"
  - "evaluateReleaseReadiness"
  - "original-only rollback plan"
version: 1.0.0.0
---

# Release readiness and rollback (evaluateReleaseReadiness)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Fails a release closed unless every dated evidence lane passes, and supplies a provider-free original-only rollback plan that preserves canonical state.

The release package turns operator and automated results into a content-free evidence manifest. It also publishes a dated support matrix and a deterministic recovery sequence that can disable projection before any provider or network is available.

---

## 2. HOW IT WORKS

`evaluateReleaseReadiness` validates the release timestamp and support-matrix digest, assesses matrix freshness, requires a ready compatibility doctor, and checks a complete runtime-smoke roster. It also requires passing provider, fidelity, and privacy-canary evidence, a human-certifiable non-inferiority result, and strict validation evidence. Every input is date-bounded; missing, malformed, stale, failed, provisional, or non-human-certifiable evidence creates a typed abort and leaves the overall decision blocked.

When every lane passes, the returned manifest and decision are `release-ready` and carry only evidence references, statuses, counts, reason codes, and a content-free digest. `planRollback` validates the previous semantic version and canonical transcript SHA-256 digest, then orders four steps: disable projection, select provider-free original-only mode, restore the exact previous package, and verify the transcript digest with mutation forbidden.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `packages/cli-communication-projection/src/release/release-gate.ts` | Handler | Evaluates every dated evidence lane and returns release readiness. |
| `packages/cli-communication-projection/src/release/evidence.ts` | Shared | Defines manifest lanes, abort reasons, and readiness decisions. |
| `packages/cli-communication-projection/src/release/support-matrix.ts` | Shared | Publishes dated support rows and freshness assessments. |
| `packages/cli-communication-projection/src/release/rollback.ts` | Handler | Builds provider-free original-only rollback plans. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `packages/cli-communication-projection/test/release/release-gate.test.ts` | Unit | Covers required evidence lanes, staleness, provisional evidence, and approval. |
| `packages/cli-communication-projection/test/release/support-matrix.test.ts` | Unit | Verifies support rows, digests, and freshness decisions. |
| `packages/cli-communication-projection/test/release/rollback.test.ts` | Unit | Verifies rollback ordering, original-only mode, and immutable-state checks. |
| `packages/cli-communication-projection/test/release/rehearsal.test.ts` | Integration | Exercises the deterministic multi-runtime release rehearsal. |

---

## 4. SOURCE METADATA

- Group: Packaging And Release
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `packaging-and-release/release-readiness-and-rollback.md`

Related references:
- [compatibility-doctor.md](compatibility-doctor.md) — Content-free readiness report required by the release gate
