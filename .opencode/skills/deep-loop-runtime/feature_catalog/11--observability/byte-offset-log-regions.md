---
title: "Byte-offset log regions"
description: "Stamps seekable byte-region metadata on iteration records and surfaces those offsets in the deep-research dashboard."
trigger_phrases:
  - "byte-offset log regions"
  - "byte-offset-log-regions"
  - "byte-offset log regions deep-loop-runtime"
  - "observability byte-offset log regions"
version: 1.4.0.15
---

# Byte-offset log regions

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Stamps seekable byte-region metadata on iteration records and surfaces those offsets in the deep-research dashboard.

This feature belongs to the observability group and is catalogued as F036 in the `deep-loop-runtime` inventory.

---

## 2. HOW IT WORKS

`post-dispatch-validate.ts` records `logOffset`, `logSize`, and `logPath` after transcript writes; the YAML schema declares the optional fields; `reduce-state.cjs` displays the region values for dashboard lookup.

The implementation is source-backed and covered by runtime-owned tests under `.opencode/skills/deep-loop-runtime/tests/`. Treat this as shipped behavior, not a roadmap claim.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `lib/deep-loop/post-dispatch-validate.ts` | Runtime | byte-offset log regions. |
| `.opencode/commands/deep/assets/deep_research_auto.yaml` | Integration | byte-offset log regions. |
| `.opencode/skills/deep-loop-workflows/deep-research/scripts/reduce-state.cjs` | Integration | byte-offset log regions. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `tests/unit/post-dispatch-validate.vitest.ts` | Test | Primary regression coverage for Byte-offset log regions. |
| `tests/unit/deep-research-reduce-state.vitest.ts` | Test | Primary regression coverage for Byte-offset log regions. |
| `.opencode/skills/deep-loop-workflows/deep-research/scripts/reduce-state-sparkline.test.cjs` | Test | Primary regression coverage for Byte-offset log regions. |

---

## 4. SOURCE METADATA

- Group: Observability
- Canonical catalog source: `feature_catalog.md`
- Feature ID: F036
- Feature file path: `11--observability/byte-offset-log-regions.md`
- Source phase: `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/002-implementation/002-deep-loop-runtime/009-byte-offset-log-regions`
- Primary sources: `lib/deep-loop/post-dispatch-validate.ts`, `.opencode/commands/deep/assets/deep_research_auto.yaml`, `.opencode/skills/deep-loop-workflows/deep-research/scripts/reduce-state.cjs`, `tests/unit/post-dispatch-validate.vitest.ts`, `tests/unit/deep-research-reduce-state.vitest.ts`, `.opencode/skills/deep-loop-workflows/deep-research/scripts/reduce-state-sparkline.test.cjs`
Related references:
- [observability](../11--observability/) — Observability category
