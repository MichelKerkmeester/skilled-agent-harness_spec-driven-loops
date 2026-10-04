# Deep Research Iteration 2 of 2

## Focus
Design a low-cost persistent local `/doctor:update` fixture from the engine’s actual unit classification, base recording, apply and rollback behavior; verify what the selected historical release tags contain; resolve the worktree naming choice; and enumerate exact doctor playbook scenarios that benefit from reuse.

## Questions answered this pass
- How can a long-lived local `/doctor:update` environment exercise customized, conflict, removed, and local-only units across record-base/check/align/apply/rollback, including release-tag and worktree constraints?
- Which other doctor-command playbooks should reuse that environment, which exact scenario files need changes, and what new scenarios should be added?

## Research actions
Read updater source and action YAML contracts; inspect historical tag trees read-only; inspect sk-git worktree naming and sk-code packet/registry structure; enumerate the five relevant doctor-commands playbooks. Cite every conclusion to source line ranges or explicit read-only Git command evidence.

## Scope
Do not create a worktree, check out a tag, execute updater actions, stage/commit files, run tests, or mutate playbooks. All artifacts remain in this lineage.
