---
title: "MERGE-001 -- Finding Dedup by Symbol"
description: "This scenario validates Finding Dedup by Symbol for `MERGE-001`. It focuses on unit_id computation (sha256 of path:symbol:kind), per-executor attribution union into producedBy, and agreement-eligibility marking."
---

# MERGE-001 -- Finding Dedup by Symbol

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `MERGE-001`.

---

## 1. OVERVIEW

This scenario validates Finding Dedup by Symbol for `MERGE-001`. It focuses on `unit_id = sha256(path:symbol:kind)` as the deduplication key, `producedBy` as the union of distinct seat labels, `agreement = count(distinct executors in producedBy)`, and the `agreementEligible` flag when `agreement >= config.agreementMin` (default 2).

### Why This Matters

Cross-executor agreement is meaningful only when the same logical finding from different seats merges into a single unit rather than producing N separate registry entries. The `sha256(path:symbol:kind)` key ensures that two seats reporting the same function with slightly different wording still dedup to one unit. An explicit `unit_id` field in the finding overrides the derived hash, allowing seats to pre-align on a canonical identifier.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `MERGE-001` and confirm the expected signals without contradictory evidence.

- Objective: Verify that `reduce-state.cjs` implements `unit_id = sha256(path:symbol:kind)` deduplication with `producedBy` union and agreement counting.
- Real user request: `Verify that deep-context deduplicates findings from multiple seats by file:symbol and computes agreement counts correctly.`
- Prompt: `As a manual-testing orchestrator, validate the finding deduplication contract for deep-context against the auto YAML, reduce-state.cjs, loop_protocol.md §6, and SKILL.md §3. Verify unit_id = sha256(path:symbol:kind) is the dedup key, producedBy unions distinct seat labels, and agreement >= config.agreementMin (default 2) marks a finding as agreement-eligible. Also verify node --check passes on reduce-state.cjs. Return a concise verdict.`
- Expected execution process: Run `node --check` on reduce-state.cjs; read reduce-state.cjs for `unitId`, `sha256`, `producedBy`, `DEFAULT_AGREEMENT_MIN`; read loop_protocol.md §6 for merge rules.
- Expected signals: `node --check .opencode/skills/deep-context/scripts/reduce-state.cjs` exits 0; `unitId` function uses `sha256` in reduce-state.cjs; `producedBy` and `agreement` are registry record fields; `DEFAULT_AGREEMENT_MIN = 2` constant is present.
- Desired user-visible outcome: Findings from multiple seats for the same `file:symbol` merge into one unit with an agreement count that accurately reflects how many distinct executors confirmed the finding.
- Pass/fail: PASS if node --check exits 0 and all four fields are present in reduce-state.cjs with the documented defaults; FAIL if any are missing or the syntax check fails.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request in plain user language.
2. Stay local; run syntax check and grep reduce-state.cjs.
3. Execute the deterministic steps exactly as written.
4. Compare observed output against the desired outcome.
5. Return a concise final answer.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| MERGE-001 | Finding Dedup by Symbol | Verify sha256 unit_id dedup and agreement counting in reduce-state.cjs | `Verify that deep-context deduplicates findings from multiple seats by file:symbol and computes agreement counts correctly.` | 1. `node --check .opencode/skills/deep-context/scripts/reduce-state.cjs` -> 2. `rg "sha256\|unitId\|unit_id" .opencode/skills/deep-context/scripts/reduce-state.cjs` -> 3. `rg "DEFAULT_AGREEMENT_MIN\|agreementMin" .opencode/skills/deep-context/scripts/reduce-state.cjs` -> 4. `rg "producedBy\|agreement" .opencode/skills/deep-context/scripts/reduce-state.cjs` | Step 1: exits 0; Step 2: sha256 and unitId functions found; Step 3: DEFAULT_AGREEMENT_MIN = 2 constant found; Step 4: producedBy and agreement fields found | Exit code from step 1; grep outputs from steps 2-4 | PASS if step 1 exits 0 and steps 2-4 all return matches; FAIL if node --check fails or any constant/field is absent | 1. Run `node reduce-state.cjs --help` to check for runtime import errors. 2. Confirm the path `.opencode/skills/deep-context/scripts/reduce-state.cjs` is correct. 3. Check the crypto import for the sha256 implementation. |

### Optional Supplemental Checks

Verify the explicit `unit_id` override path (trusts an explicit field over the derived hash):

```bash
rg "unit_id.*trim\|explicit.*unit_id\|trust.*unit_id" .opencode/skills/deep-context/scripts/reduce-state.cjs
```

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../feature_catalog/03--agreement-merge/finding-dedup-by-symbol.md` | Feature-catalog source describing the implementation contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/skills/deep-context/scripts/reduce-state.cjs` | Primary: `unitId`, `dedupByUnit`, `DEFAULT_AGREEMENT_MIN`, `buildRegistry` |
| `.opencode/skills/deep-context/references/protocol/loop_protocol.md` | §6: merge rules including unit_id key and producedBy union |
| `.opencode/commands/deep/assets/deep_start-context-loop_auto.yaml` | `step_merge_findings`: in-loop equivalent of the reducer dedup pass |

---

## 5. SOURCE METADATA

- Group: Agreement Merge
- Playbook ID: MERGE-001
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `03--agreement-merge/finding-dedup-by-symbol.md`
