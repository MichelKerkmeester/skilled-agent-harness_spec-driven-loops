---
title: "runtime query CLI hostile metadata redaction"
description: "Verify runtime query CLI redacts arbitrary metadata keys and bounds string lengths in its response."
---

# runtime query CLI hostile metadata redaction

## 1. OVERVIEW

Verify runtime query CLI redacts arbitrary metadata keys and bounds string lengths in its response.

Council artifacts are user-influenced text (seat output, deliberations, critiques).

Operators use this feature when the real request is: Query the council graph after I seed a node with weird metadata keys and oversized strings, and tell me what the query response actually exposes.

---

## 2. CURRENT REALITY

The shipped surface is anchored by `runtime upsert CLI`, `runtime query CLI`, `deep-ai-council`. The playbook scenario `08--council-graph-integration/003-council-graph-query-hostile-metadata-redaction.md` defines the operator prompt, command sequence, expected signals, evidence, and pass/fail criteria for DAC-021.

Current behavior is grounded in `.opencode/skills/deep-loop-runtime/lib/council/council-graph-query.ts`, which the scenario identifies as allowlist + length bounds (p1-003 remediation). Validation is anchored by `.opencode/skills/deep-loop-runtime/tests/integration/council-graph-script.vitest.ts`, covering test: "redacts arbitrary metadata from prompt-safe query output".

The user-visible contract is concrete: Verify runtime query CLI redacts arbitrary metadata keys and bounds string lengths in its response. The catalog entry mirrors that contract so reviewers can move from feature inventory to the exact playbook scenario and source files without guessing.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `.opencode/skills/deep-loop-runtime/lib/council/council-graph-query.ts` | Library | Allowlist + length bounds (P1-003 remediation) |
| `.opencode/skills/deep-loop-runtime/scripts/query.cjs` | Handler | runtime CLI script: prompt-safe query envelope |
| `.opencode/skills/deep-ai-council/references/graph_support.md` | Reference | Documents the allowlist contract |

### Validation And Tests

| File | Focus |
|------|-------|
| `manual_testing_playbook/08--council-graph-integration/003-council-graph-query-hostile-metadata-redaction.md` | Manual scenario contract |
| `.opencode/skills/deep-loop-runtime/tests/integration/council-graph-script.vitest.ts` | Test: "redacts arbitrary metadata from prompt-safe query output" |

---

## 4. SOURCE METADATA
- Group: Council Graph Integration
- Feature ID: DAC-021
- Canonical catalog source: `FEATURE_CATALOG.md`
- Feature file path: `feature_catalog/08--council-graph-integration/03-council-graph-query-hostile-metadata-redaction.md`
- Playbook scenario: `manual_testing_playbook/08--council-graph-integration/003-council-graph-query-hostile-metadata-redaction.md`
