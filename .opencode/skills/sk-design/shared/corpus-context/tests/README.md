---
title: "Tests: Corpus Context Plan Validator Coverage"
description: "node:test suite for the shared neutral corpus-context plan validators, reused as the fixture source for every mode's corpus adapter tests."
---

# Tests: Corpus Context Plan Validator Coverage

---

## 1. OVERVIEW

`corpus-context/tests/` owns the `node:test` coverage for `../validate-context-plan.mjs`, the validator pair behind the neutral `CORPUS_CONTEXT_PLAN v1` seam shared by every design mode's corpus adapter. `POSITIVE_FIXTURE` from this folder is also imported directly by `design-mcp-open-design/tests/transport-grounding.test.mjs`, so this is the canonical fixture source beyond its own suite.

## 2. CONTENTS

| File | Purpose |
|------|---------|
| `validate-context-plan.test.mjs` | Asserts `validateCorpusContextFixture()`, `validateCorpusContextPlan()`, and `validateProofHandoffRecord()` across the positive, no-fit, unavailable, generation-mismatch, and unknown-rights fixtures. |
| `fixtures.mjs` | Builds `POSITIVE_FIXTURE`, `NO_FIT_FIXTURE`, `UNAVAILABLE_FIXTURE`, `GENERATION_MISMATCH_FIXTURE`, `UNKNOWN_RIGHTS_FIXTURE`, and the `SHARED_FIXTURES` array against the plan's own schema versions and authority order. |

## 3. CONSUMERS

- [`../../../design-mcp-open-design/tests/README.md`](../../../design-mcp-open-design/tests/README.md) - imports `POSITIVE_FIXTURE` directly for the transport grounding suite.

## 4. VALIDATION

Run from the repository root.

```bash
node --test .opencode/skills/sk-design/shared/corpus-context/tests/*.test.mjs
```

## 5. RELATED

- [`../README.md`](../README.md) - the corpus-context contract these tests validate.
- [`../../../SKILL.md`](../../../SKILL.md) - sk-design hub, owner of the shared base.
