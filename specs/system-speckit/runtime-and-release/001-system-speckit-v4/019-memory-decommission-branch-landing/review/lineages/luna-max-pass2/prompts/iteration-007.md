---
iteration: 7
mode: review
focus: D1 Correctness and security — retrieval ranking, trigger-index determinism and corpus boundaries
---

Read the current retrieval normalization, shared ripgrep lane, trigger-index lookup/generator, corpus walker, legacy replay and parity tests. Check deterministic ranking, scope/candidate behavior, publication identity and symlink/file-system boundaries. Revalidate carried findings from current source. Do not run tests, validators, generators, git writes or nested dispatch; write only under the bound lineage directory.

BANNED OPERATIONS

- Do not modify target, implementation, tests, runtime files, git state or any path outside the bound lineage directory.
- Do not run a nested CLI, agent, task dispatch, validator or generator.

ALLOWED WRITE PATHS

- The bound lineage directory only: prompts/, iterations/, deltas/, state JSONL, registry, strategy, dashboard, logs and final report.
