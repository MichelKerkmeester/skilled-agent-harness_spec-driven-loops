---
title: "Checkout After"
description: "The actions/checkout step duration of each workflow this phase edited, read from the pull request runs on the branch."
---

# Checkout After

Read on 2026-11-12 from the three pull request runs on `worktrees/350-test-ci-wait-cuts`
(head commits `dac1e8b1`, `fb351e48` and `48de2f42`) with `gh run view <id> --json jobs`,
taking the checkout step's `completedAt` minus `startedAt`. The row is the slowest figure
across the three runs and across the jobs of a workflow.

| Workflow | Checkout |
|----------|----------|
| prompt-card-sync.yml | 3 s |
| runtime-no-spec-import.yml | 2 s |
| chart-corpus.yml | 3 s |
| diagram-corpus.yml | 6 s |
| pi-extension-tests.yml | 2 s |

`repo-rules-corpus.yml` and `sk-code-script-tests.yml` have no row. Their sparse checkout
was reverted before the push, so they still take a full checkout and the comparison
command in the task list reports them as not lower.

The chart workflow needed two more sparse paths before it passed on a runner:
`sk-design/shared/` and `sk-design/sk-design-diagram/scripts/`. One chart test runs a
script from each.

Source runs for the last head commit:

```text
prompt-card-sync.yml        run 43232523537  3
runtime-no-spec-import.yml  run 43232523841  2
chart-corpus.yml            run 43232523626  3
diagram-corpus.yml          run 43232523539  3
pi-extension-tests.yml      run 43232523828  2, 2, 2
```
