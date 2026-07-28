---
title: "CU-018 -- CLEAR scoring via quality card"
description: "This scenario validates the CLEAR 5-check from the canonical prompt-quality card for `CU-018`, near-verbatim ported from cli-codex's CX-022. It focuses on confirming an under-scored prompt is escalated to a structured framework before dispatch."
version: 1.0.0.0
---

# CU-018 -- CLEAR scoring via quality card

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CU-018`.

---

## 1. OVERVIEW

This scenario validates the CLEAR 5-check workflow from the canonical prompt-quality card for `CU-018`, near-verbatim ported from `cli-codex`'s `CX-022` with only CLI-specific mechanics adapted. It focuses on confirming the documented quality-card discipline is applied before dispatch and that an under-scored prompt is upgraded to a structured framework (RCAF) before being sent to Cursor.

### Why This Matters

The canonical card at `sk-prompt/sk-prompt-models/assets/cli-prompt-quality-card.md` §4 (CLEAR 5-Check) and §3 (Task to Framework Map) are the explicit quality gate before any non-trivial dispatch, reached via the local `assets/prompt-quality-card.md` delegation. SKILL.md §4 ALWAYS rule 10 (Prompt construction & model-craft) makes loading the card mandatory. This is a shared, cli-family-generic pattern - the same discipline `cli-codex` enforces - so this scenario is ported near-verbatim rather than reinvented.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CU-018` and confirm the expected signals without contradictory evidence.

- Objective: Verify the prompt-quality-card.md CLEAR 5-check is applied and an under-scored prompt is upgraded via the RCAF framework before dispatch.
- Real user request: `Walk me through the CLEAR check on a weak prompt, upgrade it via RCAF, and show me the result is better.`
- RCAF Prompt: `Spec folder: cli-external-orchestration/030-cli-cursor-creation/006-cursor-manual-testing-playbook (pre-approved, skip Gate 3). As a cross-AI orchestrator constructing a non-trivial dispatch, FIRST take a deliberately weak prompt ("Fix auth"), score it with the canonical card's CLEAR 5-check (Correctness, Logic, Expression, Arrangement, Reusability), THEN escalate it to a structured prompt by applying the RCAF framework from the card's Task to Framework Map. Dispatch the improved prompt against /tmp/cli-cursor-playbook-cu018/auth.ts with --model composer-2.5 --auto-review --sandbox enabled. Verify the operator records the CLEAR scores for both versions, names the framework selected, and Cursor produces a meaningfully better implementation from the improved prompt than the weak prompt would have. Return a verdict including both CLEAR score sets and the framework selected.`
- Expected execution process: Operator scores the weak prompt "Fix auth" against the 5 CLEAR axes (low on Expression, Arrangement and Reusability) -> applies RCAF (Role + Context + Action + Format) to produce a structured upgraded prompt -> records both score sets in evidence -> pre-creates a deliberately weak `auth.ts` -> dispatches the upgraded prompt -> verifies the result.
- Expected signals: Operator records CLEAR scores for the weak prompt (low on Expression and Arrangement). Operator names the chosen framework from the canonical card (RCAF). Improved prompt scores higher across all five axes. Dispatched command line uses the improved prompt and exits 0.
- Desired user-visible outcome: An auditable trail showing the prompt-quality discipline was applied before the dispatch and a working file demonstrating the upgrade actually mattered.
- Pass/fail: PASS if both CLEAR score sets are recorded, the improved prompt scores higher than the weak prompt, the framework is named, AND the dispatch exits 0 with a generated file reflecting the fix. FAIL if scores are missing, the framework is not named, or the dispatch fails.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Read the canonical card at `sk-prompt/sk-prompt-models/assets/cli-prompt-quality-card.md` §4 (CLEAR check) and §3 (Task to Framework Map), reached via the local `assets/prompt-quality-card.md` delegation.
2. Score the weak prompt "Fix auth" on Correctness, Logic, Expression, Arrangement, Reusability.
3. Pick a framework from the canonical card (RCAF for general implementation) and rewrite the prompt.
4. Re-score the improved prompt and confirm it scores higher.
5. Dispatch the improved prompt against a deliberately weak `auth.ts` seed file and inspect the result.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CU-018 | CLEAR scoring via quality card | Verify the CLEAR 5-check is applied and an under-scored prompt is upgraded before dispatch | `Spec folder: cli-external-orchestration/030-cli-cursor-creation/006-cursor-manual-testing-playbook (pre-approved, skip Gate 3). As a cross-AI orchestrator constructing a non-trivial dispatch, FIRST take a deliberately weak prompt ("Fix auth"), score it with the canonical card's CLEAR 5-check (Correctness, Logic, Expression, Arrangement, Reusability), THEN escalate it to a structured prompt by applying the RCAF framework from the card's Task to Framework Map. Dispatch the improved prompt against /tmp/cli-cursor-playbook-cu018/auth.ts with --model composer-2.5 --auto-review --sandbox enabled. Verify the operator records the CLEAR scores for both versions, names the framework selected, and Cursor produces a meaningfully better implementation from the improved prompt than the weak prompt would have. Return a verdict including both CLEAR score sets and the framework selected.` | 1. `bash: grep -A5 "CLEAR" ../../assets/prompt-quality-card.md > /tmp/cli-cursor-cu018-check.txt` -> 2. `bash: printf 'WEAK PROMPT: "Fix auth"\nCLEAR scores (1-5):\n- Correctness: 2 (no specific bug named)\n- Logic: 1 (no reasoning given)\n- Expression: 1 (vague verb, no anchors)\n- Arrangement: 1 (no order)\n- Reusability: 2 (placeholder-free but trivial)\n\nIMPROVED PROMPT (RCAF framework):\nRole: TypeScript backend engineer.\nContext: @/tmp/cli-cursor-playbook-cu018/auth.ts has a token-validation function that accepts an empty string as valid.\nAction: Add explicit null/empty checks at the start of validate(), throw AuthError for empty/null input.\nFormat: Output the modified file path on success and a one-line summary of the change.\n\nCLEAR scores (1-5):\n- Correctness: 5 (specific bug named)\n- Logic: 4 (action and verification spelled out)\n- Expression: 5 (clear verbs, file anchor, framework labels)\n- Arrangement: 5 (Role -> Context -> Action -> Format)\n- Reusability: 4 (placeholders in Context and Action are swappable)\nFRAMEWORK SELECTED: RCAF (Role + Context + Action + Format).\n' > /tmp/cli-cursor-cu018-scores.txt` -> 3. `bash: rm -rf /tmp/cli-cursor-playbook-cu018 && mkdir -p /tmp/cli-cursor-playbook-cu018 && printf 'export function validate(token: string): boolean {\n  return true; // accepts empty string as valid - bug\n}\n' > /tmp/cli-cursor-playbook-cu018/auth.ts` -> 4. `cursor-agent -p "Role: TypeScript backend engineer. Context: @/tmp/cli-cursor-playbook-cu018/auth.ts has a token-validation function that accepts an empty string as valid. Action: Add explicit null/empty checks at the start of validate(), throw AuthError for empty/null input. Format: Output the modified file path on success and a one-line summary of the change." --model composer-2.5 --auto-review --sandbox enabled --output-format text </dev/null > /tmp/cli-cursor-cu018-stdout.txt 2>&1` -> 5. `bash: cat /tmp/cli-cursor-playbook-cu018/auth.ts && grep -E "AuthError\|throw\|null\|empty\|''\|\"\"" /tmp/cli-cursor-playbook-cu018/auth.ts` | Step 1: quality-card excerpt captured; Step 2: scores file shows weak prompt low scores AND improved prompt high scores AND framework named; Step 3: temp dir + seed `auth.ts` created; Step 4: exit 0; Step 5: `auth.ts` now has explicit empty/null check, throw, AuthError | Quality-card grep, scores file with both CLEAR score sets, seed file, generated stdout, modified `auth.ts`, dispatched command line, exit code | PASS if both CLEAR score sets recorded, improved prompt scores higher, framework named, dispatch exits 0, AND the modified file has explicit empty/null validation; FAIL if any check misses or the file doesn't reflect the upgrade | (1) Re-read `assets/prompt-quality-card.md` to confirm the CLEAR axes and canonical-card delegation path; (2) re-run with `2>&1 \| tee` for stderr inline; (3) inspect modified `auth.ts` manually for the validation logic |

### Optional Supplemental Checks

- For complexity >= 7/10 prompts, escalate to `@prompt-improver` per the canonical card's Prompt-Composition Precedence. Capture the returned `ENHANCED_PROMPT` as additional evidence.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |
| `../../assets/prompt-quality-card.md` → delegates to `../../../../sk-prompt/sk-prompt-models/assets/cli-prompt-quality-card.md` (Framework Selection, Task to Framework Map, CLEAR 5-Check, Prompt-Composition Precedence) | Authoritative quality card |
| `../../SKILL.md` (§4 ALWAYS rule 10) | Mandates loading the quality card |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../../../sk-prompt/sk-prompt-models/assets/cli-prompt-quality-card.md` | CLEAR 5-Check (via local card delegation) |
| `../../assets/prompt-templates.md` | Flag reference and template variables |

---

## 5. SOURCE METADATA

- Group: Prompt Templates
- Playbook ID: CU-018
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `prompt-templates/clear-scoring-quality-card.md`
