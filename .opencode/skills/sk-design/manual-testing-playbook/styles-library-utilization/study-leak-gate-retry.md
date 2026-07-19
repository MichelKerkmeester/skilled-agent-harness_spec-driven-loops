---
title: "SLU-005: STUDY Leak Gate And No-STUDY Retry"
description: "Verify independent source-leak signals discard a draft and the production author command retries without STUDY."
version: 1.0.0.0
---

# SLU-005: STUDY Leak Gate And No-STUDY Retry

## 1. OVERVIEW

This scenario runs the focused generator regressions for the two-signal leak gate and the real production retry that removes STUDY from the author command.

### Why This Matters

The optional exemplar can improve structural prose, but it must never become load-bearing or leak source-specific values into the generated document.

---

## 2. SCENARIO CONTRACT

**Realistic user request**: Prove a leaking STUDY draft is discarded and re-authored through the ordinary path without the exemplar.

**Exact prompt**:

```text
Run the focused STUDY regressions for exact-value and normalized-span leaks plus the production no-STUDY retry. Pass only if both leak signals trip independently and the clean retry omits the STUDY context.
```

**Expected execution process**: Run the two named tests in the generator backend, inspect both passing assertions and confirm the retry command excludes `--study-context`.

**Expected signals**: Two focused tests pass, the leaking draft is discarded and the replacement draft validates without STUDY.

**Pass/fail**: PASS if both tests pass and the retry uses the no-STUDY prompt. FAIL if a leaking draft survives, the retry remains a mock or source literals reach the persisted handoff.

---

## 3. TEST EXECUTION

### Exact Command Sequence

```bash
cd .opencode/skills/sk-design/design-md-generator/backend
npx vitest run tests/study-exemplars.test.ts -t "trips independently on exact source values and normalized source spans|runs the production author command with the no-STUDY prompt and validates its draft"
```

### Evidence

Capture the Vitest summary, the two selected test names and the zero-failure exit status. Do not copy fixture literals into the evidence summary.

### Pass / Fail

- **PASS**: Exit 0 and both selected tests pass.
- **FAIL**: Either test fails, the author command retains `--study-context` on retry or a source-specific value reaches persisted output.

### Failure Triage

1. If the leak test fails, inspect exact-value and normalized-span extraction separately.
2. If the retry test fails, inspect the second author invocation in `guided-run.ts` and confirm STUDY is removed.
3. If persisted output contains a source literal, stop delivery and inspect the handoff and sidecar boundary.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root scenario index and execution policy. |
| `../../feature-catalog/styles-library-utilization/md-generator-schema-and-study.md` | Generator schema, STUDY and retry contract. |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/skills/sk-design/design-md-generator/backend/scripts/study-exemplars.ts` | De-literalization and two-signal leak gate. |
| `.opencode/skills/sk-design/design-md-generator/backend/scripts/guided-run.ts` | Draft discard and production no-STUDY retry. |
| `.opencode/skills/sk-design/design-md-generator/backend/tests/study-exemplars.test.ts` | Focused leak and retry regressions. |

---

## 5. SOURCE METADATA

- Group: Styles-Library Utilization
- Playbook ID: SLU-005
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `styles-library-utilization/study-leak-gate-retry.md`
