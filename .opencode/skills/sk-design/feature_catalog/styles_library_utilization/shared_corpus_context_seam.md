---
title: "Shared Corpus-Context Seam"
description: "Zero-hydration CORPUS_CONTEXT_PLAN v1 envelope with a closed proof handoff and structurally enforced authority order."
trigger_phrases:
  - "Shared Corpus-Context Seam"
  - "corpus context plan"
  - "zero hydration envelope"
  - "corpus authority order"
version: 1.0.0.0
---

# Shared Corpus-Context Seam (CORPUS_CONTEXT_PLAN v1)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

The shared seam carries generic capability, availability and proof planning between design intake and the selected mode. Its envelope always carries zero hydrated styles, so taste and source content stay out of the hub.

The authority order is fixed: user brief and owned system, selected-mode judgment, target evidence and deterministic checks, corpus reference evidence, then transport output. Corpus evidence is advisory-only.

---

## 2. HOW IT WORKS

The plan uses a closed capability vocabulary and one seven-field proof handoff for generation identity, source identity, provenance and use label, semantic role, transformation, fallback and proof state. Positive, no-fit, unavailable, generation-mismatch and unknown-rights are all valid evidence outcomes.

The validator rejects hydrated payloads, mode selection, severity, accessibility or performance proof, copying determinations, exact-reuse authorization and transport acceptance. Unknown fields, inherited fields and contradictory outcome combinations also fail validation.

Modes hydrate and judge evidence only after receiving a valid neutral plan. A negative outcome preserves the ordinary target-derived workflow instead of throwing or inventing a corpus result.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skills/sk-design/shared/corpus-context/corpus-context-plan.mjs` | Shared | Defines the envelope, authority order and common proof fields. |
| `.opencode/skills/sk-design/shared/corpus-context/validate-context-plan.mjs` | Shared | Enforces zero hydration, neutrality and closed outcome consistency. |
| `.opencode/skills/sk-design/shared/corpus-context/corpus-runtime.mjs` | Shared | Normalizes runtime outcomes for mode consumers. |
| `.opencode/skills/sk-design/shared/corpus-context/source-attestation.mjs` | Shared | Binds claimed influence to hydrated source evidence. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skills/sk-design/shared/corpus-context/__tests__/validate-context-plan.test.mjs` | Automated test | Covers zero hydration, authority prohibitions and contradictory states. |
| `.opencode/skills/sk-design/shared/corpus-context/__tests__/fixtures.mjs` | Automated test | Defines positive and fail-closed shared fixtures. |

---

## 4. SOURCE METADATA

- Group: Styles-Library Utilization
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `styles_library_utilization/shared_corpus_context_seam.md`

Related references:
- [retrieval_engine.md](retrieval_engine.md) - Engine that supplies generation-bound candidate evidence.
- [per_mode_consumers.md](per_mode_consumers.md) - Consumers that apply mode-owned decisions after the seam.
