---
title: "ID-019 -- Interface no-card fallback"
description: "This scenario validates the exact no-procedure fallback line for interface when no private card matches."
contextType: reference
version: 1.0.0.0
id: ID-019
expected_intent: PROCEDURE_CARD_FALLBACK
expected_resources:
  - SKILL.md
  - references/design-process/brief-to-dials.md
  - assets/interface-preflight-card.md
---

# ID-019 -- Interface no-card fallback

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `ID-019`.

**Exact prompt**

```text
interface: answer this narrow visual-order question using the baseline workflow. State whether any private procedure card applies before answering.
```

---

## 1. OVERVIEW

This scenario validates the exact fallback line `Procedure applied: none - baseline interface workflow` from `SKILL.md` when no interface procedure-card trigger matches.

### Why This Matters

The fallback prevents over-loading every card for narrow advice while still requiring register, dials, two-pass process, and pre-flight discipline.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm interface states the exact no-card fallback and continues with baseline workflow rather than inventing or loading cards.
- Real user request: `Answer a narrow visual-order question without turning it into a full direction, wireframe, variation set, prototype, deck, or polish pass.`
- Prompt: `interface: answer this narrow visual-order question using the baseline workflow. State whether any private procedure card applies before answering.`
- Expected execution process: Load `SKILL.md`; confirm no request-shape row matches; state `Procedure applied: none - baseline interface workflow`; proceed with register, dials, two-pass process, and pre-flight constraints as needed.
- Expected signals: Exact fallback line appears before design advice; no procedure card is selected; no cards are bulk-loaded.
- Desired user-visible outcome: A concise answer with baseline proof, not a card-driven workflow.
- Pass/fail: PASS if exact fallback appears and no card is selected; FAIL if a card is invented, omitted fallback, or all cards are loaded.

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| ID-019 | Interface no-card fallback | Verify exact fallback line for non-card interface advice | `interface: answer this narrow visual-order question using the baseline workflow. State whether any private procedure card applies before answering.` | grep fallback line in `SKILL.md` -> agent: answer exact prompt -> inspect first proof line | Step 1: fallback line found. Step 2: response states exact fallback. Step 3: advice remains read-only and baseline | Transcript, response proof line, loaded-resource list | PASS if exact fallback appears and no procedure card is loaded; FAIL if a private card is invented or all cards are loaded | 1. Re-read `SKILL.md` fallback line; 2. Remove trigger words that imply a card; 3. Confirm baseline workflow still includes register/dials proof |

---

## 4. SOURCE FILES

| File | Role |
|---|---|
| `../manual-testing-playbook.md` | Root directory page and scenario summary |
| `../../SKILL.md` | Exact no-card fallback and baseline interface workflow |
| `../../references/design-process/brief-to-dials.md` | Baseline dial calibration |
| `../../assets/interface-preflight-card.md` | Baseline delivery gate |

---

## 5. SOURCE METADATA

- Group: Procedure Card Contract
- Playbook ID: ID-019
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `procedure-card-contract/no-card-fallback.md`
