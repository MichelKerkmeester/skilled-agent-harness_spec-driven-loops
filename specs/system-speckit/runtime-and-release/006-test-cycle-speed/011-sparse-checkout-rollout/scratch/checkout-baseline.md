---
title: "Checkout Baseline"
description: "The pre-change actions/checkout step duration of each workflow this phase edits, read from its latest successful run."
---

# Checkout Baseline

Read on 2026-11-12 from each workflow's latest successful run with
`gh run list --workflow <file> --limit 15 --json databaseId,conclusion` and
`gh run view <id> --json jobs`, taking the checkout step's `completedAt` minus `startedAt`.
Where a workflow has more than one job, the slowest job's figure is the row.

| Workflow | Checkout |
|----------|----------|
| prompt-card-sync.yml | 57 s |
| repo-rules-corpus.yml | 59 s |
| runtime-no-spec-import.yml | 74 s |
| chart-corpus.yml | 57 s |
| diagram-corpus.yml | 59 s |
| pi-extension-tests.yml | 55 s |
| sk-code-script-tests.yml | 55 s |

Source runs, with every job's checkout step figure in job order:

```text
prompt-card-sync.yml        run 42796769724  57
repo-rules-corpus.yml       run 43182582872  59
runtime-no-spec-import.yml  run 43187728888  74
chart-corpus.yml            run 42986319009  57
diagram-corpus.yml          run 42986318839  59
pi-extension-tests.yml      run 43198726958  55, 26, 24
sk-code-script-tests.yml    run 43182582828  55
```
