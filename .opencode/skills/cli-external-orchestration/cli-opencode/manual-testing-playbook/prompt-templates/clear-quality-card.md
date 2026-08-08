---
title: "CO-024 -- CLEAR quality card 5-check"
description: "This scenario validates the OpenCode prompt-quality-card pointer for `CO-024`. It focuses on resolving the canonical card in sk-prompt and confirming its CLEAR 5-check, 7-framework selection table, and escalation rule to @prompt-improver at complexity >= 7/10."
version: 1.3.0.9
---

# CO-024 -- CLEAR quality card 5-check

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CO-024`.

---

## 1. OVERVIEW

This scenario validates the CLEAR quality card 5-check for `CO-024`. The OpenCode asset is a thin pointer; the canonical card at `.opencode/skills/sk-prompt/sk-prompt-models/assets/cli-prompt-quality-card.md` owns the full CLEAR 5-check (Correctness, Logic, Expression, Arrangement, Reusability), the 7-framework selection table (RCAF, COSTAR, RACE, CIDI, TIDD-EC, CRISPE, CRAFT) with complexity bands, the task-to-framework map and the escalation rule to `@prompt-improver` when complexity is `>= 7/10`.

### Why This Matters

ALWAYS rule 7 in SKILL.md mandates loading the local pointer before building any dispatch prompt. The canonical card is the lightweight always-on guidance that keeps cross-AI orchestrator prompts consistent without pulling in the full sk-prompt skill. If the pointer no longer resolves, or the canonical card is missing the CLEAR 5-check, framework table, task map or escalation rule, the orchestrator's prompt-quality safety net collapses and prompts regress to ad-hoc construction. This test validates the pointer and all required canonical elements.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CO-024` and confirm the expected signals without contradictory evidence.

- Objective: Confirm `assets/prompt-quality-card.md` resolves the canonical card, which documents the CLEAR 5-check, the 7-framework selection table, the task-to-framework map and the escalation rule for complexity `>= 7/10`.
- Real user request: `Open the cli-opencode prompt quality card and confirm it has the CLEAR 5-check, the framework selection table with all 7 frameworks, the task-to-framework map, and the escalation rule for complexity >= 7. I want to know what the orchestrator should do before constructing a prompt.`
- RCAF Prompt: `As an external-AI conductor about to construct a non-trivial OpenCode dispatch prompt, load the local prompt-quality-card pointer and resolve .opencode/skills/sk-prompt/sk-prompt-models/assets/cli-prompt-quality-card.md. Verify the canonical card explicitly documents (a) the CLEAR 5-check (Correctness, Logic, Expression, Arrangement, Reusability), (b) the framework selection table with all 7 frameworks (RCAF, COSTAR, RACE, CIDI, TIDD-EC, CRISPE, CRAFT) and complexity bands, (c) the task-to-framework map, and (d) the escalation rule for complexity >= 7/10 to @prompt-improver. Return a concise pass/fail verdict naming each missing element (or confirming all four are present).`
- Expected execution process: External-AI orchestrator reads the local pointer, resolves `.opencode/skills/sk-prompt/sk-prompt-models/assets/cli-prompt-quality-card.md`, scans the canonical card for the CLEAR 5-check enumeration, the 7-framework table, the task map and the escalation rule, then attests each is present.
- Expected signals: All 5 CLEAR criteria explicitly listed. Framework selection table includes all 7 frameworks with complexity bands. Task-to-framework map present (task -> framework rows). Escalation rule for complexity `>= 7/10` to `@prompt-improver` is explicitly documented. Failure-pattern checklist present.
- Desired user-visible outcome: Verdict naming each found element and confirming the escalation threshold is exactly 7.
- Pass/fail: PASS if all 5 CLEAR criteria present AND all 7 frameworks listed AND task map present AND escalation rule with threshold 7 present. FAIL if any element missing or threshold differs from 7.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request in plain user language.
2. Grep for each CLEAR criterion explicitly.
3. Grep for each of the 7 frameworks in the selection table.
4. Grep for the task-to-framework map.
5. Grep for the escalation rule with threshold `>= 7`.
6. Return a verdict naming each item found.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CO-024 | CLEAR quality card 5-check | Confirm the local pointer resolves the canonical card, which documents the CLEAR 5-check, 7-framework table, task map, and escalation rule | `As an external-AI conductor about to construct a non-trivial OpenCode dispatch prompt, load the local prompt-quality-card pointer and resolve .opencode/skills/sk-prompt/sk-prompt-models/assets/cli-prompt-quality-card.md. Verify the canonical card explicitly documents (a) the CLEAR 5-check (Correctness, Logic, Expression, Arrangement, Reusability), (b) the framework selection table with all 7 frameworks (RCAF, COSTAR, RACE, CIDI, TIDD-EC, CRISPE, CRAFT) and complexity bands, (c) the task-to-framework map, and (d) the escalation rule for complexity >= 7/10 to @prompt-improver. Return a concise pass/fail verdict naming each missing element (or confirming all four are present).` | 1. `bash: sed -n '1,40p' .opencode/skills/cli-external-orchestration/cli-opencode/assets/prompt-quality-card.md && rg -n 'cli-prompt-quality-card' .opencode/skills/cli-external-orchestration/cli-opencode/assets/prompt-quality-card.md` -> 2. `bash: sed -n '66,76p' .opencode/skills/sk-prompt/sk-prompt-models/assets/cli-prompt-quality-card.md` -> 3. `bash: rg -n 'RCAF|COSTAR|RACE|CIDI|TIDD-EC|CRISPE|CRAFT' .opencode/skills/sk-prompt/sk-prompt-models/assets/cli-prompt-quality-card.md` -> 4. `bash: rg -n 'CLI TASK TO FRAMEWORK MAP|task type|Default framework' .opencode/skills/sk-prompt/sk-prompt-models/assets/cli-prompt-quality-card.md` -> 5. `bash: rg -n '>= 7/10|Complexity is' .opencode/skills/sk-prompt/sk-prompt-models/assets/cli-prompt-quality-card.md` -> 6. `bash: rg -n '@prompt-improver' .opencode/skills/sk-prompt/sk-prompt-models/assets/cli-prompt-quality-card.md` -> 7. `bash: rg -n 'COMMON CLI PROMPT FAILURE PATTERNS|Missing output format' .opencode/skills/sk-prompt/sk-prompt-models/assets/cli-prompt-quality-card.md` | Step 1: local pointer exists and names canonical path; Step 2: all five CLEAR rows present; Step 3: all seven framework rows present; Step 4: task map present; Step 5-6: escalation threshold and `@prompt-improver` present; Step 7: failure-pattern section present | Terminal output showing the local pointer and canonical lines | PASS if pointer resolves AND canonical card contains all required elements; FAIL if the pointer is broken or any canonical element is missing | 1. If the pointer is broken, restore the relative link to the canonical card; 2. If a canonical element is missing, cross-check the `sk-prompt` source and repair the canonical card; 3. If the escalation threshold differs from 7, align the scenario with the canonical card before rerunning |

### Optional Supplemental Checks

For end-to-end validation, draft a non-trivial OpenCode dispatch prompt (e.g., a multi-agent orchestration plan), manually score it against the CLEAR 5-check and confirm the failure-pattern checklist would have caught any obvious deficiencies. This is a cognitive exercise and does not need to dispatch `opencode run` itself.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |
| `../../assets/prompt-quality-card.md` | Thin OpenCode pointer under inspection |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../SKILL.md` | ALWAYS rule 7 (always load prompt-quality-card.md before any dispatch) |
| `../../assets/prompt-quality-card.md` | Thin pointer to the canonical card |
| `../../../sk-prompt/sk-prompt-models/assets/cli-prompt-quality-card.md` | §2 framework table, §3 task map, §4 CLEAR 5-check, §5 escalation rule, §6 failure patterns |

---

## 5. SOURCE METADATA

- Group: Prompt Templates
- Playbook ID: CO-024
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `prompt-templates/clear-quality-card.md`
