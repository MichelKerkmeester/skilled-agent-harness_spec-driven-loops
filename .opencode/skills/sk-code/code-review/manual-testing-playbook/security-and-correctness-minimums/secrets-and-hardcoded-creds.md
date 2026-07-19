---
title: "CR-006 -- Secrets and hardcoded credentials"
description: "This scenario validates Secrets and hardcoded credentials for `CR-006`. It focuses on Confirm committed secrets and sensitive logs are treated as security blockers."
version: 1.5.0.4
---

# CR-006 -- Secrets and hardcoded credentials

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `CR-006`.

---

## 1. OVERVIEW

This scenario validates Secrets and hardcoded credentials for `CR-006`. It focuses on Confirm committed secrets and sensitive logs are treated as security blockers.

### Why This Matters

Hardcoded API keys, tokens, and passwords are easy to miss yet have catastrophic blast radius once committed - rotation and history rewrite are expensive remediations. CR-006 catches reviewers who skip secret scanning when the diff 'doesn't look security-related' - any diff can leak a credential, and the reviewer must explicitly clear or flag every suspicious string per security-checklist.md section 4.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CR-006` and confirm the expected signals without contradictory evidence.

- Objective: Confirm committed secrets and sensitive logs are treated as security blockers.
- Real user request: `Review target may contain credentials or sensitive logging.`
- Prompt: `Scan the staged diff for hardcoded credentials, private keys, passwords, tokens, and sensitive logs without echoing real secrets.`
- Expected execution process: Run the deterministic command sequence, capture the transcript, compare the output against review references, and record a PASS, PARTIAL, FAIL, or SKIP verdict with rationale.
- Expected signals: Step 1: staged diff captured; Step 2: secret patterns searched; Step 3: report classifies exposure and remediation
- Desired user-visible outcome: a severity-ranked secrets review that a real maintainer can act on without asking for missing scope or evidence.
- Pass/fail: PASS if hardcoded credentials are P0/P1 per assets/security-checklist.md section 4 and no inline secret appears in evidence; FAIL if real secrets are repeated in output

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request in plain review-scope language.
2. Confirm the review target, changed-file list, and risk lens before invoking the reviewer.
3. Execute the deterministic steps exactly as written.
4. Compare the observed report against the cited review reference files.
5. Return a concise final verdict that names missing evidence when the scenario fails.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CR-006 | Secrets and hardcoded credentials | Confirm committed secrets and sensitive logs are treated as security blockers. | `Scan the staged diff for hardcoded credentials, private keys, passwords, tokens, and sensitive logs without echoing real secrets.` | bash: git diff --staged -> bash: rg -n -i -e "api[_-]?key" -e "secret" -e "token" -e "password" -e "BEGIN .* PRIVATE KEY" -e "console\.log" path/to/changed/files -> agent: @review secrets scan | Step 1: staged diff captured; Step 2: secret patterns searched; Step 3: report classifies exposure and remediation | Diff transcript, rg output, final report | PASS if hardcoded credentials are P0/P1 per assets/security-checklist.md section 4 and no inline secret appears in evidence; FAIL if real secrets are repeated in output | 1. Redact evidence; 2. Confirm whether token is test fixture; 3. Recommend rotation if exposure is real |

### Optional Supplemental Checks

If the primary run passes, repeat the scenario against a second tiny fixture or narrowed file list to confirm the behavior is not tied to one diff shape. Keep supplemental evidence separate from the primary verdict.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `../manual-testing-playbook.md` | Root directory page and scenario summary |
| `../../README.md` | Skill overview and current operator-facing description |

### Implementation Anchors

| File | Role |
|---|---|
| `../../assets/security-checklist.md` | Security, authz, secrets, injection, abuse, and reliability checks |
| `../../references/review-core.md` | Mandatory P0/P1 evidence and baseline minimums |
| `../../SKILL.md` | Baseline plus sk-code surface-evidence contract |

---

## 5. SOURCE METADATA

- Group: Security And Correctness Minimums
- Playbook ID: CR-006
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `security-and-correctness-minimums/secrets-and-hardcoded-creds.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.
