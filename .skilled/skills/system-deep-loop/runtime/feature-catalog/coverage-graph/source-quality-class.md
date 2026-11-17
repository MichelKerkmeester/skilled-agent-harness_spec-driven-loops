---
title: "Source quality class"
description: "Research SOURCE nodes carry a quality_class derived at the graph upsert from where the source lives, and the source-diversity signal reads that derived value."
trigger_phrases:
  - "source quality class"
  - "quality_class"
  - "source diversity quality"
  - "source node quality class"
version: 1.0.0.0
---

# Source quality class (quality_class)

## 1. OVERVIEW

The graph upsert sets `quality_class` on each research SOURCE node from where the source lives. A `quality_class` the leaf supplies is overwritten, so a leaf cannot raise source diversity by naming a class. The source-diversity signal reads the derived value.

## 2. HOW IT WORKS

### Derivation

`runtime/scripts/upsert.cjs` derives the class from the source `path`, then `name`, then `id`, and writes it on research SOURCE nodes. The derived value replaces any leaf-supplied `quality_class`.

### Closed Vocabulary

`runtime/lib/coverage-graph/coverage-graph-query.ts` exports the frozen `SOURCE_QUALITY_CLASS` vocabulary: `repo-code`, `repo-test`, `repo-spec`, `skill-doc`, `ledger-state`, `external-doc`, `external-other` and `unclassified`.

### Diversity Signal

The source-diversity signal reads the derived class from each SOURCE node, not a value the leaf wrote.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.skilled/skills/system-deep-loop/runtime/scripts/upsert.cjs` | Script | Derives and writes `quality_class` in the node loop for research SOURCE nodes. |
| `.skilled/skills/system-deep-loop/runtime/lib/coverage-graph/coverage-graph-query.ts` | Shared | Exports the closed `SOURCE_QUALITY_CLASS` vocabulary and the safe metadata keys. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.skilled/skills/system-deep-loop/runtime/tests/integration/upsert-script.vitest.ts` | Vitest | Derivation and strip cases. |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/deep-research-graph-upsert.vitest.ts` | Vitest | A leaf-supplied value does not survive the research upsert path. |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/coverage-graph-signals.vitest.ts` | Vitest | Fixtures seeded through `upsert` whose source names derive distinct classes. |
| `.skilled/skills/system-deep-loop/runtime/manual-testing-playbook/coverage-graph/source-quality-class-derivation.md` | Manual playbook | DLR-061: derived `quality_class` on research SOURCE nodes. |

---

## 4. SOURCE METADATA

- Group: Coverage graph
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `coverage-graph/source-quality-class.md`

Related references:
- [coverage-graph-signals.md](coverage-graph-signals.md) - Coverage graph signals
- [coverage-graph-query.md](coverage-graph-query.md) - Coverage graph query
