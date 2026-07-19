---
title: "SP-014 -- Phase exit gates block advancement"
description: "This scenario validates DEPTH phase exit criteria for `SP-014`. It focuses on named gates that block advancement until met."
version: 2.3.0.5
---

# SP-014 -- Phase exit gates block advancement

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `SP-014`.

---

## 1. OVERVIEW

This scenario validates that every DEPTH phase has named exit criteria and that failed criteria block advancement. The operator improves a SQL-query prompt and asks `@prompt-improver` to show each gate as it runs.

### Why This Matters

Without exit gates, DEPTH becomes a narration layer instead of an enforcement mechanism. Blocking criteria make quality failures visible before delivery.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `SP-014` and confirm the expected signals without contradictory evidence.

- Objective: Confirm every DEPTH phase has named exit criteria and cannot advance until its gate passes or re-runs.
- Real user request: `I want to see the DEPTH process show me each phase's exit criteria as it runs — make my SQL query prompt better.`
- Prompt: `Improve my SQL query prompt; verify every DEPTH phase reports exit criteria and failed gates block or rerun before advancing.`
- Expected execution process: `@prompt-improver` logs each phase, its criterion, status, and any re-run reason before moving on.
- Expected signals: Five gate rows; statuses are `passed`, `re-ran`, or `blocked`; no phase starts after a failed predecessor without remediation.
- Desired user-visible outcome: Gate-status table followed by the enhanced SQL prompt.
- Pass/fail: PASS if all five named gates appear and failures are remediated; FAIL if gates are missing, unnamed, or ignored.

---

## 3. TEST EXECUTION

### Prompt

```
Improve my SQL query prompt; verify every DEPTH phase reports exit criteria and failed gates block or rerun before advancing.
```

### Commands

1. `sk-prompt: I want to see the DEPTH process show me each phase's exit criteria as it runs — make my SQL query prompt better.`
2. `agent: @prompt-improver raw_task="Improve a SQL query prompt and report every DEPTH phase exit gate." task_type=generation target_cli=opencode complexity_hint=7 constraints="Include gate name, status, and remediation for each phase."`
3. `bash: rg 'Phase Exit Criteria|Exit:' .opencode/skills/sk-prompt/prompt-improve/references/depth-framework.md`

### Expected

The report includes five phase gates and shows that advancement only occurs after `passed` or `re-ran then passed`.

### Evidence

Capture the gate-status table, any re-run notes, and the final enhanced SQL query prompt.

### Pass / Fail

- **Pass**: All five phases have named exit criteria and no failed gate is silently bypassed.
- **Fail**: A phase has no criterion, status is missing, or a failed criterion does not block/re-run before advancement.

### Failure Triage

1. Inspect `depth-framework.md` Phase Exit Criteria for the canonical gate names.
2. Compare the returned phase table against the D-E-P-T-H order.
3. Re-dispatch to `@prompt-improver` with `constraints="print gate table before final prompt"`.

### Optional Supplemental Checks

Inject a deliberately weak SQL prompt and verify the Test gate re-runs on low CLEAR score.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |
| `../../SKILL.md` | sk-prompt skill source: §3 enhancement pipeline and §7 `@prompt-improver` contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../references/depth-framework.md` | Mandatory DEPTH phase exit criteria |
| `../../references/patterns-evaluation.md` | CLEAR criteria used by the Test gate |

---

## 5. SOURCE METADATA

- Group: DEPTH+CLEAR Loop
- Playbook ID: SP-014
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `depth-clear-loop/phase-exit-gate-blocking.md`
