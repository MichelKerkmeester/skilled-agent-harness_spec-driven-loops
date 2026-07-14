---
title: "GIT-041 -- Pre-push rejects a new wrapper-lane ref"
description: "This scenario validates the wrapper-ref rejection for `GIT-041`. It focuses on prove a brand-new work/<runtime>/<slug> ref pushed to the remote is explicitly rejected with a wrapper-specific message, not just a generic naming failure."
version: 1.0.0.0
---

# GIT-041 -- Pre-push rejects a new wrapper-lane ref

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `GIT-041`.

---

## 1. OVERVIEW

This scenario validates the wrapper-ref rejection for `GIT-041`. It focuses on prove a brand-new `work/<runtime>/<slug>` ref pushed to the remote is explicitly rejected with a wrapper-specific message, not just a generic naming failure.

### Why This Matters

Launch-wrapper branches are local-only and machine-reaped by design. If one were ever pushed as a real remote branch, it would look like an orphaned feature branch to every other operator and to the reaper itself.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `GIT-041` and confirm the expected signals without contradictory evidence.

- Objective: prove a brand-new `work/<runtime>/<slug>` ref pushed to the remote is explicitly rejected with a wrapper-specific message, not just a generic naming failure.
- Real user request: `I don't want a launch-wrapper session branch ever accidentally ending up pushed as a real remote branch.`
- RCAF Prompt: `As a git safety reviewer, push a brand-new work/<runtime>/<slug> ref to the remote and verify it is rejected with a message identifying it specifically as a launch-wrapper ref, distinct from a generic malformed-name rejection.`
- Expected execution process: Feed a new-branch line (zero remote sha) named `work/opencode/x`, and confirm the hook rejects it with the dedicated wrapper message rather than the generic "does not match the owner-first naming grammar" text.
- Expected signals: exit code 1; stderr contains `BLOCKED: 'work/opencode/x' is a launch-wrapper ref (work/<runtime>/<slug>)` and the "local-only and machine-reaped" explanation.
- Desired user-visible outcome: A concise PASS, PARTIAL, FAIL, or SKIP verdict with the evidence needed for release review.
- Pass/fail: PASS if the rejection message specifically names the ref as a launch-wrapper ref rather than falling through to the generic malformed-branch message. FAIL if the ref is accepted, or if it is rejected only with the generic malformed-name message without the wrapper-specific explanation.

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
| GIT-041 | Pre-push rejects a new wrapper-lane ref | prove a brand-new `work/<runtime>/<slug>` ref pushed to the remote is explicitly rejected with a wrapper-specific message, not just a generic naming failure. | `As a git safety reviewer, push a brand-new work/<runtime>/<slug> ref to the remote and verify it is rejected with a message identifying it specifically as a launch-wrapper ref, distinct from a generic malformed-name rejection.` | 1. `bash: printf 'refs/heads/work/opencode/x %040d refs/heads/work/opencode/x %040d\n' 1 0 \| bash pre-push; echo $?` -> 2. `bash: grep -F "is a launch-wrapper ref" <stderr>` | Step 1 exits 1; step 2 confirms the wrapper-specific `BLOCKED` text is present, not just a generic naming failure. | Exit code and the exact wrapper-specific rejection text. | PASS if the rejection message specifically names the ref as a launch-wrapper ref rather than falling through to the generic malformed-branch message. FAIL if the ref is accepted, or if it is rejected only with the generic malformed-name message without the wrapper-specific explanation. | Confirm the `is_wrapper_branch` branch fires before falling through to the generic BLOCKED message in `pre-push §2`, then `pre-push.test.sh` "new wrapper ref work/opencode/x rejected" case. |

### Optional Supplemental Checks

Confirm `SPECKIT_SKIP_PREPUSH_NAMING=1` still bypasses even the wrapper-specific rejection, since the top-of-script bypass check runs before any per-line classification.

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
| `../../../../scripts/git-hooks/pre-push` | `is_wrapper_branch` dedicated rejection message for new wrapper refs |
| `../../../../scripts/git-hooks/tests/pre-push.test.sh` | Regression coverage: new wrapper ref rejected case |
| `../../scripts/worktree-naming.sh` | `is_wrapper_branch` grammar the hook sources |

---

## 5. SOURCE METADATA

- Group: Owner-First Worktree Tooling
- Playbook ID: GIT-041
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `owner-first-worktree-tooling/prepush-rejects-wrapper-ref.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.
