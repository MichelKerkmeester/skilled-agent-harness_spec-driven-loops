---
title: Protected Workflow Set
description: The workflows protected by function, why each is protected and the rules that follow, so review and scaffolding read one list.
trigger_phrases:
  - "protected workflow"
  - "protected workflow set"
  - "required status check"
  - "never switch off workflow"
importance_tier: normal
contextType: general
version: 1.0.0.0
---

# Protected Workflow Set

The workflows that are never weakened, edited or switched off on a light confirmation.

---

## 1. OVERVIEW

### Protected by Function, Not by List

A workflow is protected because of what it does, so a new workflow that does the same job joins the set. Three classes qualify.

| Class | Test | Workflows today |
|---|---|---|
| (a) Sole enforcer | It is the only thing that enforces an invariant, and no local gate backs it up | `gate-inputs.yml` |
| (b) Token-eligibility split | It splits the work that runs repository code from the work that holds a write token | `trigger-index-rebuild.yml` |
| (c) Input guard | Its failure invalidates the inputs other workflows trust | `dispatch-enforcement-guard.yml`, `naming-standard-guard.yml` |

`gate-inputs.yml` is the only enforcer of path parity between `.skilled/` and `.opencode/`. Without it a moved source tree or a one-sided path filter passes unseen.

`trigger-index-rebuild.yml` keeps the job that runs repository code at `contents: read` and gives the write token only to a job that runs `gh` and `git`. Merging the two jobs would hand the token to repository code.

`dispatch-enforcement-guard.yml` and `naming-standard-guard.yml` check the rules that other workflows and tools assume. A failure here means those assumptions no longer hold.

### The Required Check

`message-contract.yml` holds the only required status context in the branch ruleset, `Commit messages, branch names and PR description follow the templates`. The workflow also pushes on every branch as a recorded exception. See the intentional exceptions table in `references/trigger-and-filter-rules.md`.

---

## 2. THE RULES

1. **Never switch off `message-contract.yml` while its ruleset context is required.** A switched-off required workflow leaves the context pending on every pull request. The switch condition in `references/job-shape-rules.md` never applies to it while the ruleset requires the context.
2. **A protected workflow is never edited without a second named confirmation that restates its role.** The first confirmation approves the change. The second names the workflow, says in one sentence what it protects and approves again. A scaffold or a review that would weaken a protected workflow stops and asks.

---

## 3. HOW TO USE THE SET

- Before editing a workflow, search this list for its file name and for the class tests above.
- When a request reads "switch off", "skip" or "disable" a workflow, check rule 1 first.
- When two protected classes both fit, apply the stricter rule.
- When the list looks wrong for a workflow that was added or renamed, record the correction here and do not rely on memory.
