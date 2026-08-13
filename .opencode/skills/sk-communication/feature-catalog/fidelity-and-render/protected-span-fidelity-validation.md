---
title: "Protected-span fidelity validation"
description: "Protects literal Markdown and machine-sensitive spans during rewriting, then accepts a candidate only when restoration and semantic checks preserve the source contract."
trigger_phrases:
  - "Protected-span fidelity validation"
  - "protected Markdown spans"
  - "validateProjectionCandidate"
  - "exact-original fidelity fallback"
version: 1.0.0.0
---

# Protected-span fidelity validation (validateProjectionCandidate)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Protects literal Markdown and machine-sensitive spans during rewriting, then accepts a candidate only when restoration and semantic checks preserve the source contract.

The caller protects a complete source document before provider execution and validates the returned candidate against that immutable protection record. Accepted output is restored plain text with content hashes; rejected output contains no projection text and carries the exact original.

---

## 2. HOW IT WORKS

Protection replaces fenced and inline code, links, paths, identifiers, command fragments, and other literal-sensitive spans with deterministic tokens while retaining exact bytes and source digests. Restoration requires the expected token set, order, and counts; a provider cannot silently delete, duplicate, reorder, or alter a protected value.

Candidate validation first requires a successful, complete provider terminal state and an unchanged source digest. It then enforces output bounds, restores protected spans, and applies deterministic dialect and semantic checks for adequate content, polarity, requirement strength, priority, and unsupported factual additions. When configured as required, a reject-only semantic judge may veto but cannot rescue a deterministic failure; cancellation, timeout, judge failure, or any other failed check returns the exact original.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `packages/cli-communication-projection/src/fidelity/protected-spans.ts` | Handler | Protects and exactly restores literal-sensitive source spans. |
| `packages/cli-communication-projection/src/fidelity/validator.ts` | Handler | Applies completeness, digest, restoration, semantic, and judge checks. |
| `packages/cli-communication-projection/src/fidelity/semantics.ts` | Shared | Detects semantic changes that invalidate a rewrite. |
| `packages/cli-communication-projection/src/fidelity/dialect.ts` | Shared | Measures dialect and content-retention properties. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `packages/cli-communication-projection/test/fidelity/protected-spans.test.ts` | Unit | Covers tokenization, restoration, and protected-span tampering. |
| `packages/cli-communication-projection/test/fidelity/validator.test.ts` | Unit | Covers deterministic and semantic acceptance and fallback rules. |
| `packages/cli-communication-projection/test/fidelity/performance.test.ts` | Benchmark | Exercises fidelity processing under bounded input sizes. |

---

## 4. SOURCE METADATA

- Group: Fidelity And Render
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `fidelity-and-render/protected-span-fidelity-validation.md`

Related references:
- [capability-aware-presentation.md](capability-aware-presentation.md) — Display decisions made after fidelity acceptance
