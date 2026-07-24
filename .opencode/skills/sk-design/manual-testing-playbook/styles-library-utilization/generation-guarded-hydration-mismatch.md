---
title: "SLU-002: Generation-Guarded Hydration Refuses Mismatch"
description: "Verify hydration refuses a selected card when the requested generation does not match the live checked corpus."
version: 1.0.0.0
---

# SLU-002: Generation-Guarded Hydration Refuses Mismatch

## 1. OVERVIEW

This scenario queries one live candidate, changes only the requested generation and confirms hydration returns the closed `generation-mismatch` refusal.

### Why This Matters

A stale card must never hydrate against a newer corpus generation, even when its identifier still exists.

---

## 2. SCENARIO CONTRACT

**Realistic user request**: Prove a stale styles-library selection cannot hydrate after its generation binding changes.

**Exact prompt**:

```text
Select one current styles-library card, retry hydration with a mismatched generation hash and show the closed refusal. Do not read or print hydrated source content.
```

**Expected execution process**: Query one current card, replace its requested generation with a deterministic invalid digest, call the public hydration function and inspect only the refusal object.

**Expected signals**: `{"ok":false,"error":"generation-mismatch"}` with no hydrated artifacts.

**Pass/fail**: PASS if hydration returns only the mismatch refusal. FAIL if any source body, token value or hydrated artifact returns.

---

## 3. TEST EXECUTION

### Exact Command Sequence

```bash
node --input-type=module -e "import { runQuery, runHydrate } from './.opencode/skills/sk-design/styles/_engine/style-library.mjs'; const query = await runQuery({ text: 'product interface restrained motion', useFts: false, limit: 1 }); const result = await runHydrate({ id: query.cards[0].id, generationHash: 'sha256:' + '0'.repeat(64), mode: 'interface', includes: ['DESIGN.md'] }); console.log(JSON.stringify(result)); if (result.error !== 'generation-mismatch') process.exit(1);"
```

### Evidence

Capture the one-line JSON refusal and command exit status. Do not capture the preceding card's source-specific title or prose.

### Pass / Fail

- **PASS**: Exit 0 and the result is the closed `generation-mismatch` refusal.
- **FAIL**: A hydration succeeds, a source artifact appears or the failure is thrown without a closed result.

### Failure Triage

1. If the query returns no cards, verify `_retrieval-manifest.json` with `build --check`.
2. If another refusal returns, inspect generation equivalence in `hydrate.mjs` before checking artifact state.
3. If content returns, stop and treat the generation guard as broken.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root scenario index and execution policy. |
| `../../feature-catalog/styles-library-utilization/retrieval-engine.md` | Retrieval and hydration contract. |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/skills/sk-design/styles/_engine/hydrate.mjs` | Live generation and record binding. |
| `.opencode/skills/sk-design/styles/_engine/tests/hydrate-guard.test.mjs` | Mismatch and stale-record regressions. |

---

## 5. SOURCE METADATA

- Group: Styles-Library Utilization
- Playbook ID: SLU-002
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `styles-library-utilization/generation-guarded-hydration-mismatch.md`
