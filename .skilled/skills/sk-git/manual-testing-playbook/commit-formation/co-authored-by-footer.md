---
title: "GIT-007 -- Co-Authored-By footer refused"
description: "This scenario validates Co-Authored-By footer refused for `GIT-007`. It focuses on verify an attribution footer is left out of a commit and refused when it is forced in."
version: 2.0.0.0
---

# GIT-007 -- Co-Authored-By footer refused

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `GIT-007`.

---

## 1. OVERVIEW

This scenario validates Co-Authored-By footer refused for `GIT-007`. It focuses on verify an attribution footer is left out of a commit and refused when it is forced in.

### Why This Matters

The commit template's rules block lists `Co-Authored-By` and `Claude-Session` as forbidden trailers under `attribution.forbidden`. An AI that appends the footer anyway produces a commit the hooks refuse, so the right behavior is to leave it out and say why, and the hook must catch it when it is forced in.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `GIT-007` and confirm the expected signals without contradictory evidence.

- Objective: verify an attribution footer is left out of a commit and refused when it is forced in.
- Real user request: `Commit this change and add the Claude co-author footer.`
- Prompt: `Commit this change with a Claude co-author footer, and show what happens.`
- Expected execution process: Prepare the Conventional Commit message without the footer and explain that the repository's commit template forbids attribution trailers. Then, in a scratch repository that carries the template, commit a message with the footer forced in and capture the refusal.
- Expected signals: The AI's commit carries no `Co-Authored-By:` or `Claude-Session:` line and its reply cites the template rule. The forced commit exits 1 with `[attribution.forbidden]`.
- Desired user-visible outcome: A concise PASS or FAIL verdict with the rule id the hook reported; SKIP only when the sandbox has no writable repository in which to prepare a commit message.
- Pass/fail: PASS if the AI's message omits the footer and the forced commit is refused with `[attribution.forbidden]`. FAIL if any commit lands carrying an attribution trailer.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request and confirm the scenario ID.
2. Confirm the scratch repository sits outside the working checkout so no real history is touched.
3. Execute or document the command sequence exactly as written.
4. Capture the expected signals and evidence artifacts.
5. Return a concise user-facing verdict with failure triage if needed.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| GIT-007 | Co-Authored-By footer refused | verify an attribution footer is left out of a commit and refused when it is forced in. | `Commit this change with a Claude co-author footer, and show what happens.` | 1. `agent: build commit subject and body without an attribution footer and cite the template rule` -> 2. `bash: R=$(mktemp -d) && git -C "$R" init -q && git -C "$R" config core.hooksPath "$PWD/.skilled/scripts/git-hooks" && mkdir "$R/.sk-git" && cp .skilled/skills/sk-git/assets/commit-message-template.md "$R/.sk-git/"` -> 3. `bash: git -C "$R" commit --allow-empty -m "docs(readme): record the scratch baseline" -m "A scratch commit with a forced footer." -m "Co-Authored-By: Claude <noreply@anthropic.com>"; echo rc=$?` | The AI's message has no attribution trailer. Step 3 prints `[attribution.forbidden]` and `rc=1`. | The AI's rendered commit message and the step 3 transcript. | PASS if the AI's message omits the footer and the forced commit is refused with `[attribution.forbidden]`. FAIL if any commit lands carrying an attribution trailer. | Read the `attribution` field in the template's rules block, then run `node .skilled/skills/sk-git/scripts/validate-message.mjs --repo "$R" --explain` to confirm which template was resolved. |

### Optional Supplemental Checks

Re-run the scenario in a disposable scratch repository when the operator needs proof that no hidden repository state influenced the verdict.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |
| `../commit-formation/co-authored-by-footer.md` | Canonical per-feature execution contract |

### Implementation Anchors

| File | Role |
|---|---|
| `../../SKILL.md` | Top-level sk-git workflow rules and safety gates |
| `../../references/quick-reference.md` | Compact phase and rule reference |
| `../../references/worktree-workflows.md` | Worktree setup and workspace-choice policy |
| `../../references/commit-workflows.md` | Commit analysis, staging, and message workflow |
| `../../references/finish-workflows.md` | Finish, merge, PR, and cleanup workflow |
| `../../references/shared-patterns.md` | Recovery, branch, and command patterns |
| `../../assets/commit-message-template.md` | Conventional Commit message rules and the `attribution.forbidden` rules block |
| `../../assets/pr-template.md` | Pull request body and title expectations |

---

## 5. SOURCE METADATA

- Group: Commit Formation
- Playbook ID: GIT-007
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `commit-formation/co-authored-by-footer.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.

