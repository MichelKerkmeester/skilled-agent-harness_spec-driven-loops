---
title: "Dry Feature Catalog"
description: "Dry catalog for the four new template authoring entries."
trigger_phrases:
  - "dry catalog"
last_updated: "2026-10-23"
version: 1.0.0.0
---

# Dry Feature Catalog

## 1. OVERVIEW

Dry catalog for the four new template authoring entries.

## 2. TOOLING AND SCRIPTS
### Example drift guard

#### Description

Compares every hand-written example with its template and fails when an anchor or a description drifts.

#### Current Reality

`runtime/cli/spec/check-example-drift.sh` prints `EXAMPLE_DRIFT_OK` on the tree and one failure line per drifted example.

#### Source Files

See [`tooling-and-scripts/example-drift-guard.md`](tooling-and-scripts/example-drift-guard.md) for full implementation and test file listings.

---

### Spec authoring card

#### Description

One short card that the four authoring intents load instead of the long template guide, held in sync with the router and the checklist.

#### Current Reality

`references/workflows/spec-authoring-card.md` is the default load for the `PLAN`, `IMPLEMENT`, `INTAKE` and `TEMPLATE_AUTHORING` intents, and `runtime/cli/spec/check-card-sync.sh` holds its four surfaces together.

#### Source Files

See [`tooling-and-scripts/spec-authoring-card.md`](tooling-and-scripts/spec-authoring-card.md) for full implementation and test file listings.

---

### Template section fill guidance

#### Description

Places one imperative fill instruction below every template section heading, with a good and a weak example, and holds the rendered result with a golden test.

#### Current Reality

Every content section of the four core templates and the ten addon templates carries one `<!-- FILL: ... -->` line, and the fill guidance test prints `16 passed`.

#### Source Files

See [`tooling-and-scripts/template-section-fill-guidance.md`](tooling-and-scripts/template-section-fill-guidance.md) for full implementation and test file listings.

---

### Versioned placeholder gate

#### Description

Gates unfilled value tokens by the template stamp, warning while a v2.3 packet is Draft and failing it at any other status.

#### Current Reality

`PLACEHOLDER_FILLED` warns in a v2.3 packet while its status is Draft and errors at any other status, and a packet with an older stamp keeps its old verdict.

#### Source Files

See [`tooling-and-scripts/versioned-placeholder-gate.md`](tooling-and-scripts/versioned-placeholder-gate.md) for full implementation and test file listings.

---
