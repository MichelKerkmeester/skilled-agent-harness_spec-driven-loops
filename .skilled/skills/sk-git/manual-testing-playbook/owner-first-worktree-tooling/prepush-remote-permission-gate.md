---
title: "GIT-043 -- Pre-push remote-permission gate on creation and update"
description: "This scenario validates the remote-permission gate for `GIT-043`. It focuses on prove that publishing a branch to origin is an explicit decision: a creation is refused unless the branch is named in the approval, an update needs a blanket approval, and the release lane and allowlist are the only standing exemptions."
version: 1.0.0.0
---

# GIT-043 -- Pre-push remote-permission gate on creation and update

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `GIT-043`.

---

## 1. OVERVIEW

This scenario validates the remote-permission gate for `GIT-043`. It focuses on prove that publishing a branch to origin is an explicit decision rather than a default, and that the two approval forms are not interchangeable.

### Why This Matters

A push reaches other machines and the live-branch autosync, so it is the first genuinely irreversible step in the local workflow. The gate that used to sit beside this one checked branch names against a grammar and was removed, because it never refused a push this gate would have allowed. That leaves one gate carrying the whole decision, and its two approval forms differ in a way an operator will meet on their first blocked push: a blanket approval authorises an update to a branch that already exists, and creating a branch on origin requires naming that branch.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `GIT-043` and confirm the expected signals without contradictory evidence.

- Objective: prove a creation is refused by default, that a blanket approval still cannot create, that naming the branch approves exactly that creation, and that `main`, the `skilled/v*` release lane and the allowlist file pass with no environment variable at all.
- Real user request: `I pushed a new branch and git refused it. What does it want from me, and why did setting the allow flag not help?`
- RCAF Prompt: `As a git safety reviewer, evaluate the pre-push remote-permission gate. Drive a creation and an update for a non-allowlisted branch, then the release lane, and report which approval form each one needs and why a blanket approval cannot create.`
- Expected execution process: Feed the hook creation-shaped and update-shaped ref lines on stdin for a branch outside the allowlist, once with no approval, once with `SPECKIT_ALLOW_REMOTE_PUSH=1` and once naming the branch, then repeat for `skilled/v9.9.9.9` with no environment at all.
- Expected signals: the unapproved creation exits 1 with `BLOCKED [gate:remote-create]` and the sentence that a bare `SPECKIT_ALLOW_REMOTE_PUSH=1` authorises updates and never creation; the same creation under a bare approval still exits 1; naming the branch exits 0; the unapproved update exits 1 with `BLOCKED [gate:remote-permission]` and a bare approval clears it; the release lane exits 0 with no environment variable.
- Desired user-visible outcome: A concise PASS or FAIL verdict with the evidence needed for release review; SKIP only when the `pre-push` hook is absent from the checkout.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request and confirm the scenario ID.
2. Confirm the repository is on the intended branch and the working tree is safe for the scenario.
3. Execute or document the command sequence exactly as written.
4. Capture the expected signals and evidence artifacts.
5. Return a concise user-facing verdict with failure triage if needed.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| GIT-043 | Pre-push remote-permission gate on creation and update | prove creation and update need different approval forms and that only the release lane and the allowlist are exempt | See RCAF Prompt above | `bash .opencode/scripts/git-hooks/tests/pre-push.test.sh` for the full matrix, or feed one ref line directly: `printf 'refs/heads/demo/0001-x <sha> refs/heads/demo/0001-x 0000000000000000000000000000000000000000\n' \| bash .opencode/scripts/git-hooks/pre-push origin https://example.invalid/repo.git` | `BLOCKED [gate:remote-create]` on the unapproved creation, exit 0 once the branch is named in `SPECKIT_ALLOW_REMOTE_PUSH` | Hook stderr and exit codes for each of the five ref lines | PASS when every exit code and message matches the contract above | A creation that succeeds unapproved means the gate is not reached: check that the hook is installed at `.git/hooks/pre-push` and that no bypass variable is exported in the shell |

### Optional Supplemental Checks

Add a pattern to `.opencode/skills/sk-git/scripts/remote-branch-allowlist.txt` and confirm an update to a branch matching it passes with no environment variable, then confirm a branch outside the pattern still blocks. This is the standing approval path an operator reaches for when one branch is pushed repeatedly.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |

No `feature-catalog/` package exists for sk-git; see `manual-testing-playbook.md` §14 for the direct-anchor exception.

### Implementation Anchors

| File | Role |
|---|---|
| `.opencode/scripts/git-hooks/pre-push` | The hook carrying the mass-deletion, remote-create and remote-permission gates |
| `.opencode/skills/sk-git/scripts/remote-branch-allowlist.txt` | The standing approval list the gate reads |
| `.opencode/scripts/git-hooks/tests/pre-push.test.sh` | The automated matrix this scenario mirrors |

---

## 5. SOURCE METADATA

| Field | Value |
|---|---|
| Feature ID | GIT-043 |
| Category | Numbered Worktree Tooling |
| Automated coverage | Yes |
