---
title: "Per-Mode Consumers"
description: "Closed styles-library consumers for interface, audit, foundations, motion and Open Design transport."
trigger_phrases:
  - "Per-Mode Consumers"
  - "styles library consumers"
  - "mode corpus adapters"
  - "transport grounding receipt"
version: 1.0.0.0
---

# Per-Mode Consumers

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Five mode-owned consumers turn neutral corpus planning into bounded evidence without handing design authority to the corpus. Each uses a closed schema, source attestation and fail-closed negative outcomes.

All consumers preserve the same order: user brief and owned system, selected-mode judgment, target evidence and deterministic checks, corpus reference evidence, then transport output.

---

## 2. HOW IT WORKS

Interface retrieves one coherent anchor plus an optional bounded contrast or rejected default, then emits a typed decision-only handoff. Audit accepts zero to two comparison references and cannot encode severity, score, accessibility proof, copying or a fix owner.

Foundations builds a typed relationship graph whose unresolved basis stays `not-assessed` and whose transformation ledger binds every source to an edge and authority lock. Motion runs the target-owned restraint gate before retrieval, then binds any eligible temporal reference to its generation and content hashes.

Open Design transport accepts a metadata-only grounding receipt, freezes the mode-owned proposal before asynchronous work and recomputes returned divergence against artifact evidence. The transport can report alignment or unavailability, but it never accepts a design decision or mutation for the mode.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skills/sk-design/design-interface/corpus/relational-exemplar.mjs` | Handler | Produces a bounded decision-only relational handoff. |
| `.opencode/skills/sk-design/design-audit/corpus/comparison-lane.mjs` | Handler | Produces non-authoritative comparison rows. |
| `.opencode/skills/sk-design/design-foundations/corpus/relationship-blueprint.mjs` | Handler | Produces typed relationships and transformation records. |
| `.opencode/skills/sk-design/design-motion/corpus/motion-evidence.mjs` | Handler | Applies restraint-first, source-bound temporal eligibility. |
| `.opencode/skills/sk-design/design-mcp-open-design/grounding-receipt.mjs` | Handler | Validates metadata-only transport grounding receipts. |
| `.opencode/skills/sk-design/design-mcp-open-design/return-reconciliation.mjs` | Handler | Recomputes semantic outcome and divergence from returned evidence. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skills/sk-design/design-interface/corpus/__tests__/relational-exemplar.test.mjs` | Automated test | Covers authority locks, source attestation and handoff leakage. |
| `.opencode/skills/sk-design/design-audit/corpus/__tests__/comparison-lane.test.mjs` | Automated test | Covers verdict rejection and intended-anchor evidence. |
| `.opencode/skills/sk-design/design-foundations/corpus/__tests__/relationship-blueprint.test.mjs` | Automated test | Covers relationships, ledger binding and explicit-none. |
| `.opencode/skills/sk-design/design-motion/corpus/__tests__/motion-evidence.test.mjs` | Automated test | Covers restraint-first flow and source-bound eligibility. |
| `.opencode/skills/sk-design/design-mcp-open-design/__tests__/transport-grounding.test.mjs` | Automated test | Covers no-cache receipts, frozen proposals and reconciliation. |

---

## 4. SOURCE METADATA

- Group: Styles-Library Utilization
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `styles_library_utilization/per_mode_consumers.md`

Related references:
- [shared_corpus_context_seam.md](shared_corpus_context_seam.md) - Shared neutral envelope and authority contract.
- [md_generator_schema_and_study.md](md_generator_schema_and_study.md) - Separate generator consumer with schema and authoring gates.
