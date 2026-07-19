---
title: "SLU-003: Seam Envelope Carries Zero Hydrated Styles"
description: "Verify the shared CORPUS_CONTEXT_PLAN v1 envelope validates with zero hydrated styles and no style payload."
version: 1.0.0.0
---

# SLU-003: Seam Envelope Carries Zero Hydrated Styles

## 1. OVERVIEW

This scenario validates the shared positive fixture and proves the neutral seam carries planning and proof fields while its hydration count remains exactly zero.

### Why This Matters

The hub can plan corpus evidence without selecting taste, carrying source bodies or bypassing the chosen mode.

---

## 2. SCENARIO CONTRACT

**Realistic user request**: Validate that the shared corpus-context envelope reaches a mode with no hydrated style payload.

**Exact prompt**:

```text
Validate the positive corpus-context plan and report its hydration count. Pass only if the envelope is valid, carries zero hydrated styles and leaves hydration to the selected mode.
```

**Expected execution process**: Import the canonical positive fixture, run the public plan validator and compare `hydratedStyleCount` with zero.

**Expected signals**: `hydratedStyleCount:0`, `valid:true` and an empty error list.

**Pass/fail**: PASS if all three signals match. FAIL if the plan carries a style payload, chooses a mode or reports any nonzero hydration count.

---

## 3. TEST EXECUTION

### Exact Command Sequence

```bash
node --input-type=module -e "import { POSITIVE_FIXTURE } from './.opencode/skills/sk-design/shared/corpus-context/__tests__/fixtures.mjs'; import { validateCorpusContextPlan } from './.opencode/skills/sk-design/shared/corpus-context/validate-context-plan.mjs'; const result = validateCorpusContextPlan(POSITIVE_FIXTURE.plan); console.log(JSON.stringify({ hydratedStyleCount: POSITIVE_FIXTURE.plan.hydration.hydratedStyleCount, ...result })); if (!result.valid || POSITIVE_FIXTURE.plan.hydration.hydratedStyleCount !== 0) process.exit(1);"
```

### Evidence

Capture the JSON validation result and confirm no source body, raw style or mode decision appears in the envelope.

### Pass / Fail

- **PASS**: Exit 0 with `hydratedStyleCount:0`, `valid:true` and `errors:[]`.
- **FAIL**: Nonzero hydration, an unexpected style field or any validator error.

### Failure Triage

1. If the fixture fails, compare its exact fields with `CORPUS_CONTEXT_PLAN_SCHEMA`.
2. If hydration is nonzero, inspect the plan builder before any mode consumer.
3. If an unexpected field appears, confirm the plan is a plain object and rerun validation.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root scenario index and execution policy. |
| `../../feature-catalog/styles-library-utilization/shared-corpus-context-seam.md` | Zero-hydration and authority contract. |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/skills/sk-design/shared/corpus-context/corpus-context-plan.mjs` | Defines the zero-hydration envelope. |
| `.opencode/skills/sk-design/shared/corpus-context/__tests__/validate-context-plan.test.mjs` | Proves zero hydration and payload rejection. |

---

## 5. SOURCE METADATA

- Group: Styles-Library Utilization
- Playbook ID: SLU-003
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `styles-library-utilization/zero-hydration-seam-envelope.md`
