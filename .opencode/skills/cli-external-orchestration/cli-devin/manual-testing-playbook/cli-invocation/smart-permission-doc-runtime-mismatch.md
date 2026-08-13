---
title: "DV-004 -- Smart permission help/runtime mismatch"
description: "Verify that the installed Devin binary rejects the smart permission value even though help text prints it."
version: 1.0.0.0
---

# DV-004 -- Smart permission help/runtime mismatch

This document captures the realistic user-testing contract, execution flow, source anchors, and validation criteria for `DV-004`.

## 1. OVERVIEW

Probe the exact documentation/runtime mismatch: `devin --help` prints `smart`, while the installed binary rejects it. This scenario must not silently normalize the result into a successful mode.

### Why This Matters

Permission-mode routing is safety-critical. Treating a help-only value as executable can make a dispatcher believe it selected a policy that the binary did not accept.

---

## 2. SCENARIO CONTRACT

- Objective: Reproduce and document the mismatch between help output and runtime validation.
- Real user request: `Does Devin really accept the smart permission mode shown in its help?`
- Prompt: `Reply with one sentence only: report the result of the permission-mode probe; do not edit files.`
- Expected execution process: Capture `devin --help`, then invoke a harmless print request with `--permission-mode smart`; compare the exit/output with valid `normal`.
- Expected signals: Help contains `smart`; the `smart` invocation is rejected by the binary; a `normal` control invocation succeeds if authenticated.
- Desired user-visible outcome: The route documents `smart` as invalid for this installed version and uses only verified values.
- Pass/fail: PASS when help advertises but runtime rejects `smart`; FAIL if the test reports `smart` as accepted without evidence; SKIP only when the binary cannot be invoked.

---

## 3. TEST EXECUTION

1. `devin --help > /tmp/cli-devin-dv004-help.txt 2>&1; echo "exit=$?" >> /tmp/cli-devin-dv004-help.txt`
2. `devin -p "Reply with one sentence only: permission probe control succeeded." --model adaptive --permission-mode smart </dev/null > /tmp/cli-devin-dv004-smart.txt 2>&1; echo "exit=$?" >> /tmp/cli-devin-dv004-smart.txt`
3. `devin -p "Reply with one sentence only: permission probe control succeeded." --model adaptive --permission-mode normal </dev/null > /tmp/cli-devin-dv004-normal.txt 2>&1; echo "exit=$?" >> /tmp/cli-devin-dv004-normal.txt`
4. Record the help line, rejection text, and control result.

| Feature ID | Exact command | Expected signal | Verdict |
|---|---|---|---|
| DV-004 | `devin -p ... --permission-mode smart` | Help mentions `smart`; runtime rejects it | PASS/FAIL/SKIP |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Valid-mode precondition and mismatch policy |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../references/cli-reference.md` | Permission-mode reference, reconciled against live facts |
| `../../SKILL.md` | Explicit-mode dispatch rule |

---

## 5. SOURCE METADATA

- Group: CLI Invocation
- Playbook ID: DV-004
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `cli-invocation/smart-permission-doc-runtime-mismatch.md`
