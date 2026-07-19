---
title: "5D-011 -- Missing Candidate File Returns infra_failure"
description: "Manual validation scenario for 5D-011: Missing Candidate File Returns infra_failure."
feature_id: "5D-011"
category: "5D Scorer"
version: 1.17.0.13
---

# 5D-011 -- Missing Candidate File Returns infra_failure

This document captures the canonical manual-testing contract for `5D-011`.

---

## 1. OVERVIEW

This scenario validates that providing a nonexistent candidate file results in an infra_failure status and exit code 1.

---

## 2. SCENARIO CONTRACT

- Objective: Validate Missing Candidate File Returns infra_failure for the five-dimension score output and failure-mode scenarios.
- Real user request: `Validate that providing a nonexistent candidate file results in an infra_failure status and exit code 1.`
- Prompt: `Validate that a missing candidate file returns infra_failure and exit code 1.`
- Expected execution process: Run the candidate scorer against the documented candidate and profile inputs; capture stdout, stderr, exit code, and any generated files; then execute the verification block against the same run artifacts.
- Expected signals: Exit code is 1 (not 0); Output is valid JSON (no stack trace); `status` field equals `"infra_failure"`; `failureModes` array contains `"profile-generation-failure"`; No unhandled exception or stack trace is printed
- Desired user-visible outcome: A concise operator-facing PASS/FAIL verdict with the decisive evidence from the command output and verification checks.
- Pass/fail: Graceful error output (valid JSON) with `status: "infra_failure"`, `failureModes: ["profile-generation-failure"]`, and exit code 1. No stack trace in output.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Confirm the working directory is the repository root.
2. Resolve any placeholders in the command sequence, especially `{spec}`, to disposable test paths.
3. Run the exact command sequence and capture stdout, stderr, exit code, and generated artifacts.
4. Run the verification block against the same artifacts from the same execution.
5. Compare observed output against the expected signals and pass/fail criteria.
6. Record the scenario verdict with the decisive evidence.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 5D-011 | Missing Candidate File Returns infra_failure | Validate Missing Candidate File Returns infra_failure | `Validate that a missing candidate file returns infra_failure and exit code 1.` | node .opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/score-candidate.cjs \<br>  --candidate=nonexistent-file.md --dynamic; echo &quot;Exit: $?&quot; | Exit code is 1 (not 0); Output is valid JSON (no stack trace); `status` field equals `"infra_failure"`; `failureModes` array contains `"profile-generation-failure"`; No unhandled exception or stack trace is printed | `terminal transcript, command output, generated files, and PASS/FAIL verdict` | Graceful error output (valid JSON) with `status: "infra_failure"`, `failureModes: ["profile-generation-failure"]`, and exit code 1. No stack trace in output. | If exit code is 0: the script is not validating file existence before scoring<br>If output is not valid JSON or a stack trace appears: add try/catch around the file-read step with proper error classification and JSON error envelope<br>If exit code is 2 instead of 1: review the exit code convention (1 = infra failure, 2 = scoring failure)<br>If `failureModes` is missing or empty: check the error path in the dynamic profile generation pipeline |

### Optional Supplemental Checks

Use the verification block above as the primary supplemental check. Preserve any additional evidence in this template when reporting the verdict:

```text
Verdict: [PASS/FAIL]
Date: [YYYY-MM-DD]
Tester: [name]
Output excerpt:
[paste relevant output]
```

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root playbook, category summary, and review protocol |
| `5d-scorer/missing-candidate.md` | Canonical per-feature execution contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../SKILL.md` | Skill entry point and operator contract for deep-improvement |
| `../../scripts/agent-improvement/score-candidate.cjs` | Implementation or verification anchor referenced by this scenario |

---

## 5. SOURCE METADATA

- Group: 5D Scorer
- Playbook ID: 5D-011
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `5d-scorer/missing-candidate.md`
