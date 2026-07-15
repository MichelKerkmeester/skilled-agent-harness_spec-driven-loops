---
title: "SAFE-002 -- Hostile content is escaped"
description: "This scenario validates hostile-content escaping for `SAFE-002`. It focuses on confirming document content containing markup is escaped as inert text and never becomes live markup or fails the validator."
stage: routing
version: 1.0.0.0
---

# SAFE-002 -- Hostile content is escaped

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `SAFE-002`.

---

## 1. OVERVIEW

This scenario validates hostile-content escaping for `SAFE-002`. It focuses on confirming document content containing markup (for example `<script>`, `onerror=`) is escaped as inert text and never becomes live markup or fails the validator.

### Why This Matters

The documents users compare are untrusted input, and any of them may contain markup that looks like an attack — a `<script>` tag, an `onerror=` handler, an `<img src=x>`. If the report renders that content as live markup instead of escaped text, opening the report could execute attacker-controlled code. This scenario feeds deliberately hostile content through the engine and proves the tokens are escaped to inert characters (`&lt;script&gt;`) while the report still validates safe, so untrusted input can never turn the report into an exploit.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `SAFE-002` and confirm the expected signals without contradictory evidence.

- Objective: confirm document content containing markup is escaped as inert text, never becomes live markup, and does not fail the validator
- Real user request: `One of these files has a fake script tag in the text — make sure the report is still safe.`
- Prompt: `One of these files has a fake script tag in the text — make sure the report is still safe.`
- Expected execution process: the operator prepares two small files whose content includes hostile tokens such as `<script>alert(1)</script>` and `<img src=x onerror=...>`, compares them with `compare-pair`, then runs `validate_report.py`; the engine escapes the tokens and the validator ignores escaped content while still passing.
- Expected signals: the hostile tokens appear escaped in the report (`&lt;script&gt;`), no live `<script>` element exists in the markup, and the validator returns `PASS`.
- Desired user-visible outcome: the hostile text is shown as literal characters, never executed, and the report still validates safe.
- Pass/fail: PASS if the hostile tokens are escaped in the report body, no live script element is present, and the validator returns `PASS`; FAIL if any token renders as live markup, or the validator returns `FAIL`.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `One of these files has a fake script tag in the text — make sure the report is still safe.`

### Commands

1. `python3 scripts/create_diff.py compare-pair --before /tmp/hostile_before.md --after /tmp/hostile_after.md --report /tmp/hostile.html`
2. `python3 scripts/validate_report.py /tmp/hostile.html`

### Expected

Before step 1, create `/tmp/hostile_before.md` and `/tmp/hostile_after.md` whose text includes hostile tokens such as `<script>alert(1)</script>` and `<img src=x onerror=alert(1)>`. Step 1 compares them, writes `/tmp/hostile.html`, and exits `0`; the report shows those tokens escaped as `&lt;script&gt;...` literal text, with no live `<script>` element in the markup. Step 2 checks the report and returns `PASS` (exit `0`) because escaped content is ignored by the validator.

### Evidence

Capture the step 1 exit code and report path, a snippet of `/tmp/hostile.html` showing the hostile tokens rendered as escaped entities (`&lt;script&gt;`), confirmation that no live `<script>` element or inline handler exists in the page structure, and the step 2 validator `PASS` verdict.

### Pass / Fail

- **Pass**: the hostile tokens appear escaped (`&lt;script&gt;`, `&lt;img ... onerror=...&gt;`) in the report body, no live script element or inline handler is present in the markup, and step 2 returns `PASS`.
- **Fail**: any hostile token renders as a live element or handler in the markup, or step 2 returns `FAIL`.

### Failure Triage

1. Search `/tmp/hostile.html` for the raw string `<script`; every occurrence inside the diff content must be the escaped form `&lt;script`, not a live tag.
2. Distinguish the report's own structural markup (expected) from the compared content (must be escaped); the validator ignores escaped content, so a `FAIL` points at a real un-escaped element.
3. Confirm the input files actually contain the hostile tokens as text before re-running; an input that never carried the tokens cannot exercise the escaping path.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |
| `../../feature-catalog/comparison-engine/self-contained-report.md` | Feature-catalog source describing the implementation contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `scripts/create_diff.py` | Primary implementation anchor |
| `scripts/validate_report.py` | Validation anchor |

---

## 5. SOURCE METADATA

- Group: SAFETY
- Playbook ID: SAFE-002
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `safety/hostile-content-escaped.md`
