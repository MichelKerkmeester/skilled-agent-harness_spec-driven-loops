---
title: "Retrieval Engine"
description: "Deterministic eligibility-first retrieval, compact candidate cards and generation-guarded hydration over the committed styles corpus."
trigger_phrases:
  - "Retrieval Engine"
  - "styles library retrieval"
  - "eligible style cards"
  - "generation guarded hydration"
version: 1.0.0.0
---

# Retrieval Engine

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

The styles library has a committed retrieval engine over 1,290 bundles. It returns bounded candidate cards and hydrates a selected record only when the checked manifest, live corpus and request generation still agree.

The engine is evidence infrastructure, not a style chooser. A downstream mode owns selection and applies the fixed authority order before corpus evidence can influence a decision.

---

## 2. HOW IT WORKS

`style-library.mjs` exposes manifest build or check, query and hydrate commands. Query applies required facets, exclusions, provenance and rights eligibility before lexical ordering. The disposable in-memory full-text projection speeds ordering when available, while a bounded source scan preserves the same eligible set when the accelerator is unavailable.

Hydration binds the request to a re-derived live record, checks the generation and artifact hashes, enforces realpath containment and applies byte caps. Mismatch, stale source, restricted rights or path escape returns a closed refusal instead of stale style content.

`CORPUS_USE_PROOF v1` binds any claimed corpus influence to the checked manifest. Unprovenanced, averaged or self-attested corpus claims cannot pass the ready gate.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skills/sk-design/styles/_engine/style-library.mjs` | Script | Exposes build, query and hydrate commands. |
| `.opencode/skills/sk-design/styles/_engine/eligibility.mjs` | Shared | Decides deterministic membership before ranking. |
| `.opencode/skills/sk-design/styles/_engine/hydrate.mjs` | Shared | Enforces live-record, generation, path and byte guards. |
| `.opencode/skills/sk-design/styles/_engine/corpus-use-proof.mjs` | Shared | Validates manifest-bound corpus-use proof. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skills/sk-design/styles/_engine/__tests__/eligibility-first.test.mjs` | Automated test | Proves ranking cannot reintroduce an ineligible record. |
| `.opencode/skills/sk-design/styles/_engine/__tests__/hydrate-guard.test.mjs` | Automated test | Covers generation mismatch, poisoned records and path escape. |
| `.opencode/skills/sk-design/styles/_engine/__tests__/proof.test.mjs` | Automated test | Covers proof binding and ready-gate refusal. |

---

## 4. SOURCE METADATA

- Group: Styles-Library Utilization
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `styles-library-utilization/retrieval-engine.md`

Related references:
- [shared-corpus-context-seam.md](shared-corpus-context-seam.md) - Neutral planning envelope consumed before mode-owned retrieval.
- [per-mode-consumers.md](per-mode-consumers.md) - Mode-specific consumers of bounded retrieval evidence.
