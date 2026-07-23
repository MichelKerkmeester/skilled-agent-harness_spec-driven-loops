---
title: "SLU-004: Corpus Verdict Is Rejected"
description: "Verify the neutral seam rejects a corpus-authored verdict and preserves the fixed authority order."
version: 1.0.0.0
---

# SLU-004: Corpus Verdict Is Rejected

## 1. OVERVIEW

This scenario adds a corpus-authored acceptance verdict to an otherwise valid neutral plan and confirms the closed validator rejects it.

### Why This Matters

Corpus evidence can explain or challenge a decision, but it cannot select the mode, decide acceptance or outrank target evidence.

---

## 2. SCENARIO CONTRACT

**Realistic user request**: Try to promote a corpus reference into an acceptance verdict and prove the contract refuses it.

**Exact prompt**:

```text
Add a corpus acceptance verdict to the valid neutral context plan, run the validator and report the refusal. Preserve this order: user brief and owned system, selected-mode judgment, target evidence and deterministic checks, corpus reference evidence, transport output.
```

**Expected execution process**: Clone the valid plan, add one forbidden `corpusVerdict` field, validate the plan and assert the exact unexpected-field error.

**Expected signals**: `valid:false` and `plan.corpusVerdict:unexpected`.

**Pass/fail**: PASS if the added verdict is rejected. FAIL if the plan validates or the verdict changes any mode or target decision.

---

## 3. TEST EXECUTION

### Exact Command Sequence

```bash
node --input-type=module -e "import { POSITIVE_FIXTURE } from './.opencode/skills/sk-design/shared/corpus-context/tests/fixtures.mjs'; import { validateCorpusContextPlan } from './.opencode/skills/sk-design/shared/corpus-context/validate-context-plan.mjs'; const plan = structuredClone(POSITIVE_FIXTURE.plan); plan.corpusVerdict = 'accept'; const result = validateCorpusContextPlan(plan); console.log(JSON.stringify(result)); if (result.valid || !result.errors.includes('plan.corpusVerdict:unexpected')) process.exit(1);"
```

### Evidence

Capture the JSON refusal and confirm the original authority order remains unchanged.

### Pass / Fail

- **PASS**: Exit 0, `valid:false` and the exact unexpected-field error is present.
- **FAIL**: The mutated plan validates, the authority order changes or a corpus verdict reaches a mode handoff.

### Failure Triage

1. If the verdict validates, inspect exact-key validation at the plan root.
2. If another error masks the verdict, confirm the cloned fixture was valid before mutation.
3. If authority changes, compare the plan order with `AUTHORITY_ORDER` and stop consumer execution.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root scenario index and execution policy. |
| `../../feature-catalog/styles-library-utilization/shared-corpus-context-seam.md` | Fixed authority order and corpus prohibitions. |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/skills/sk-design/shared/corpus-context/validate-context-plan.mjs` | Rejects verdict and authority fields outside the schema. |
| `.opencode/skills/sk-design/shared/corpus-context/tests/validate-context-plan.test.mjs` | Covers severity, proof, copying, reuse and transport-acceptance rejection. |

---

## 5. SOURCE METADATA

- Group: Styles-Library Utilization
- Playbook ID: SLU-004
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `styles-library-utilization/corpus-verdict-rejected.md`
