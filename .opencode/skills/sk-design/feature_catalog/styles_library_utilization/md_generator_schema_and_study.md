---
title: "md-Generator Schema And STUDY"
description: "Single v3 schema authority plus a reversible, de-literalized STUDY exemplar path with leak-gated retry."
trigger_phrases:
  - "md-Generator Schema And STUDY"
  - "v3 schema authority"
  - "bounded study exemplar"
  - "retry without study"
version: 1.0.0.0
---

# md-Generator Schema And STUDY

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

The design document generator resolves formatter emission, prompt instructions and validation from one versioned `V3_SCHEMA`. An optional STUDY phase can observe the structural shape of one bounded style bundle before writing without changing locked target facts.

STUDY is reversible and never required for correctness. A draft that contains source-specific material is discarded and authored again through the ordinary no-STUDY path.

---

## 2. HOW IT WORKS

The schema defines required sections, capabilities, Quick Start groups, semantic typography roles and extension slots. Target, schema and provenance violations remain hard failures, while corpus divergence stays advisory and cannot be promoted into a target-blocking verdict.

STUDY selects up to three candidate cards, hydrates one generation-bound design and token pair and transforms it into de-literalized structural observations. Instruction-like content is stripped, the observation digest binds to locked target facts and raw source text never enters the authoring prompt.

At the draft boundary, exact-value and normalized-span signals run independently. Any leak discards the draft, removes STUDY from the production author command and validates the clean retry.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skills/sk-design/design-md-generator/backend/scripts/schema-v3.ts` | Shared | Defines the single v3 schema authority and drift sentinel. |
| `.opencode/skills/sk-design/design-md-generator/backend/scripts/formatters-v3.ts` | Handler | Emits schema-driven value sections and Quick Start groups. |
| `.opencode/skills/sk-design/design-md-generator/backend/scripts/study-prepare.ts` | Handler | Selects and hydrates one generation-bound exemplar. |
| `.opencode/skills/sk-design/design-md-generator/backend/scripts/study-exemplars.ts` | Shared | De-literalizes observations and enforces the leak gate. |
| `.opencode/skills/sk-design/design-md-generator/backend/scripts/guided-run.ts` | Handler | Discards leaking drafts and runs the no-STUDY retry. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skills/sk-design/design-md-generator/backend/tests/schema-v3.test.ts` | Automated test | Covers schema drift, required groups and hard-issue immutability. |
| `.opencode/skills/sk-design/design-md-generator/backend/tests/study-exemplars.test.ts` | Automated test | Covers injection neutralization, leak signals and production retry. |
| `.opencode/skills/sk-design/design-md-generator/backend/tests/validate.test.ts` | Automated test | Covers schema-aware hard and advisory validation. |

---

## 4. SOURCE METADATA

- Group: Styles-Library Utilization
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `styles_library_utilization/md_generator_schema_and_study.md`

Related references:
- [retrieval_engine.md](retrieval_engine.md) - Candidate selection and guarded hydration used by STUDY.
- [per_mode_consumers.md](per_mode_consumers.md) - Other mode-owned consumers of styles-library evidence.
