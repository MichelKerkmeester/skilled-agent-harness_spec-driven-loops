---
title: "DAC-017 -- OUT_OF_SCOPE_WRITE rejection"
description: "This scenario validates out-of-scope write rejection for `DAC-017`. It focuses on path guards and agent-body scoped-write rules."
---

# DAC-017 -- OUT_OF_SCOPE_WRITE rejection

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DAC-017`.

---

## 1. OVERVIEW

This scenario validates out-of-scope write rejection for `DAC-017`. It focuses on rejecting writes outside `ai-council/**` before filesystem touch.

### Why This Matters

The council is planning-only. Its writer library must enforce path boundaries so council persistence cannot mutate code, spec docs, or unrelated files.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `DAC-017` and confirm the expected signals without contradictory evidence.

- Objective: Verify writes outside `ai-council/**` are rejected with `OUT_OF_SCOPE_WRITE` before filesystem touch.
- Real user request: Confirm council writes cannot escape the ai-council folder.
- Prompt: `As a scoped-write boundary validator, attempt to write outside ai-council/**. Verify the write is rejected with OUT_OF_SCOPE_WRITE before filesystem touch. Return rejection evidence.`
- Expected execution process: Inspect the agent body §16 rule and `lib/persist-artifacts.js` path guards, then grep for `OUT_OF_SCOPE_WRITE` and `ai-council`.
- Expected signals: Path guard present in library and agent body declares the rule.
- Desired user-visible outcome: The user sees rejection evidence for out-of-scope write attempts.
- Pass/fail: PASS if path guard is present in the library and agent body declares the rule; FAIL if either source is missing.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Read `.opencode/agents/ai-council.md` §16.
2. Inspect `.opencode/skills/deep-ai-council/scripts/lib/persist-artifacts.js` path guard logic.
3. Run the grep commands and record evidence.

### Prompt

`As a scoped-write boundary validator, attempt to write outside ai-council/**. Verify the write is rejected with OUT_OF_SCOPE_WRITE before filesystem touch. Return rejection evidence.`

### Commands

1. `bash: rg -n "OUT_OF_SCOPE_WRITE|ai-council" .opencode/skills/deep-ai-council/scripts/lib/persist-artifacts.js | head -20`
2. `bash: rg -n "OUT_OF_SCOPE_WRITE" .opencode/agents/ai-council.md`

### Expected

Path guard is present in the writer library and the agent body declares the `OUT_OF_SCOPE_WRITE` rule.

### Evidence

Capture grep output showing path guard references and the agent-body rule.

### Pass / Fail

- **Pass**: Path guard present in lib and agent body declares the rule.
- **Fail**: Library guard or agent-body declaration is missing.

### Failure Triage

Restore scoped-write guard logic before running any destructive boundary test. Do not attempt a real escape write until static guard evidence exists.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| DAC-017 | OUT_OF_SCOPE_WRITE rejection | Verify scoped-write path guard | `As a scoped-write boundary validator, attempt to write outside ai-council/**. Verify the write is rejected with OUT_OF_SCOPE_WRITE before filesystem touch. Return rejection evidence.` | `bash: rg -n "OUT_OF_SCOPE_WRITE\|ai-council" .opencode/skills/deep-ai-council/scripts/lib/persist-artifacts.js | head -20` -> `bash: rg -n "OUT_OF_SCOPE_WRITE" .opencode/agents/ai-council.md` | Guard and declaration present | Grep output | PASS if lib and agent both include guard evidence | Restore path guard before dynamic testing |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `../manual_testing_playbook.md` | Root directory page and scenario summary |
| `feature_catalog/` | No feature catalog exists yet |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/skills/deep-ai-council/scripts/lib/persist-artifacts.js` | Path guard implementation |
| `.opencode/agents/ai-council.md` | Scoped-write authority declaration |

---

## 5. SOURCE METADATA

- Group: WRITER LIBRARY CONTRACT
- Playbook ID: DAC-017
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `07--writer-library-contract/004-out-of-scope-write-rejection.md`
