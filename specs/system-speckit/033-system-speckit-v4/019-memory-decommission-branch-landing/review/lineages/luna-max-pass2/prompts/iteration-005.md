---
iteration: 5
mode: review
focus: D1 Correctness — deep-loop forced-depth state integrity and write containment
---

Review the current deep-loop forced-depth validator, review workflow dispatch contract, executor recursion guard, and write-containment implementation/tests. Check exact-once iteration/state invariants, artifact-boundary behavior, and the autonomous lineage rule. Revalidate carried findings only from current source; do not run nested dispatch, repository validators or tests. Write only the iteration markdown, delta and state record under the bound lineage directory.

BANNED OPERATIONS

- Do not modify the target packet, source, tests, runtime files, git state or any path outside the bound lineage directory.
- Do not run a nested CLI, agent, task dispatch, validator, generator or git write.

ALLOWED WRITE PATHS

- The bound lineage directory only: prompts/, iterations/, deltas/, state JSONL, registry, strategy, dashboard, logs and final report.
