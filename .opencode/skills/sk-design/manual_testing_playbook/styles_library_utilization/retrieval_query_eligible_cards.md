---
title: "SLU-001: Retrieval Query Returns Eligible Cards"
description: "Verify a styles-library query filters eligibility before ranking and returns bounded candidate cards."
version: 1.0.0.0
---

# SLU-001: Retrieval Query Returns Eligible Cards

## 1. OVERVIEW

This scenario verifies the real retrieval CLI returns compact cards only from the eligible set. The operator checks the result shape without treating any returned source as a design verdict.

### Why This Matters

Ranking can order eligible evidence, but it must never restore a record rejected by deterministic membership rules.

---

## 2. SCENARIO CONTRACT

**Realistic user request**: Query the local styles library for a bounded set of references and prove the returned cards passed eligibility first.

**Exact prompt**:

```text
Run a local styles-library query for a restrained product interface with motion context. Return the engine result and verify that every card comes from the eligible set. Do not turn a card into a design verdict.
```

**Expected execution process**:

1. Run the checked retrieval CLI from the repository root.
2. Inspect `ok`, `eligibility`, `rankingMode` and `cards`.
3. Confirm the card count is bounded and no card bypasses eligibility.

**Expected signals**: `ok:true`, a numeric eligible count, a numeric rejected count and one or more cards with generation and content hashes.

**Pass/fail**: PASS if the query succeeds and all returned cards are members of the eligible set. FAIL if ranking returns an ineligible card, the result omits generation binding or the operator presents a card as authoritative taste.

---

## 3. TEST EXECUTION

### Exact Command Sequence

```bash
node .opencode/skills/sk-design/styles/_engine/style-library.mjs query --request '{"text":"product interface restrained motion compact controls","useFts":false,"limit":2}'
```

### Evidence

Capture the complete JSON result and record `eligibility.eligibleCount`, `eligibility.rejectedCount`, `rankingMode`, card count and the presence of `generationHash` plus `contentHash` on every card. Source-specific card content is evidence only and must not be copied into the verdict.

### Pass / Fail

- **PASS**: Exit 0, `ok:true`, one or two cards and every card is eligible and generation-bound.
- **FAIL**: Nonzero exit, missing card hashes, more than two cards or evidence that a rejected record was carded.

### Failure Triage

1. If the manifest is missing or stale, run the non-writing `build --check` command and inspect its diff.
2. If no card returns, remove accidental required facets from the request and retry the exact command.
3. If a rejected record appears, inspect `eligibility.mjs` before the ranking path.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root scenario index and execution policy. |
| `../../feature_catalog/styles_library_utilization/retrieval_engine.md` | Current retrieval-engine contract and source anchors. |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/skills/sk-design/styles/_engine/style-library.mjs` | Query command and bounded card result. |
| `.opencode/skills/sk-design/styles/_engine/__tests__/eligibility-first.test.mjs` | Regression proof for eligibility-before-ranking. |

---

## 5. SOURCE METADATA

- Group: Styles-Library Utilization
- Playbook ID: SLU-001
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `styles_library_utilization/retrieval_query_eligible_cards.md`
