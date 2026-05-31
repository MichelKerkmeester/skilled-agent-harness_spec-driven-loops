---
title: "runtime upsert CLI idempotency and self-loop rejection"
description: "Verify runtime upsert CLI is idempotent and rejects self-loop edges."
trigger_phrases:
  - "runtime upsert cli idempotency and self-loop rejection"
  - "upsert.cjs"
  - "upsert council session twice"
  - "self-loop edge rejection"
  - "idempotent council graph upsert"
---

# runtime upsert CLI idempotency and self-loop rejection

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Verify runtime upsert CLI is idempotent and rejects self-loop edges.

Derived graph rows are replayable from ai-council/** artifacts.

Operators use this feature when the real request is: Upsert the same council session twice and check that nothing is duplicated, and confirm the tool refuses self-loop edges.

---

## 2. HOW IT WORKS

The shipped surface is anchored by `runtime upsert CLI`, `runtime status CLI`. The playbook scenario `08--council-graph-integration/001-council-graph-upsert-idempotency-and-self-loop-rejection.md` defines the operator prompt, command sequence, expected signals, evidence, and pass/fail criteria for DAC-019.

Current behavior is grounded in `.opencode/skills/deep-loop-runtime/scripts/upsert.cjs`, which the scenario identifies as runtime CLI script: idempotent upsert + self-loop rejection. Validation is anchored by `.opencode/skills/deep-loop-runtime/tests/integration/council-graph-script.vitest.ts`, covering test: "upserts prompt-safe council graph data and queries unresolved disagreements and decision support".

The user-visible contract is concrete: Verify runtime upsert CLI is idempotent and rejects self-loop edges. The catalog entry mirrors that contract so reviewers can move from feature inventory to the exact playbook scenario and source files without guessing.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `.opencode/skills/deep-loop-runtime/scripts/upsert.cjs` | Handler | runtime CLI script: idempotent upsert + self-loop rejection |
| `.opencode/skills/deep-loop-runtime/lib/council/council-graph-db.ts` | Library | Storage layer: unique constraints |
| `.opencode/skills/deep-loop-runtime/scripts/upsert.cjs` | Runtime CLI | Input validation and edge normalization |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `manual_testing_playbook/08--council-graph-integration/001-council-graph-upsert-idempotency-and-self-loop-rejection.md` | Automated test | Manual scenario contract |
| `.opencode/skills/deep-loop-runtime/tests/integration/council-graph-script.vitest.ts` | Automated test | Test: "upserts prompt-safe council graph data and queries unresolved disagreements and decision support" |

---

## 4. SOURCE METADATA
- Group: Council Graph Integration
- Feature ID: DAC-019
- Canonical catalog source: `FEATURE_CATALOG.md`
- Feature file path: `feature_catalog/08--council-graph-integration/019-council-graph-upsert-idempotency-and-self-loop-rejection.md`
- Playbook scenario: `manual_testing_playbook/08--council-graph-integration/001-council-graph-upsert-idempotency-and-self-loop-rejection.md`
Related references:
- [020-council-graph-upsert-empty-input-no-op-success.md](020-council-graph-upsert-empty-input-no-op-success.md) — runtime upsert CLI empty input no-op success
