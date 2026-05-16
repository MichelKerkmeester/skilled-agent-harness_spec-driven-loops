# Resource Map

| Surface | Files Scanned | P0 | P1 | P2 | Notes |
|---------|---------------|----|----|----|-------|
| Correctness runtime/profile/provider surfaces | 19,187 across iterations 001, 004, 007, 010 | 0 | 10 | 3 | Active embedding/profile code, provider factories, migration/runtime code, config-like metadata, and behavioral tests. |
| Traceability docs/config/catalog surfaces | 17,871 across iterations 002, 005, 008 | 0 | 10 | 3 | Public release docs, install guides, shared READMEs, config examples, feature catalog entries, and reference docs. Iteration 008 found no new active findings. |
| Maintainability fixtures/comments/lockfile surfaces | 9,555 across iterations 003, 006, 009 | 0 | 1 | 10 | Committed fixtures, manual playbooks, eval helper comments, provider docs, package lock entries, and generated artifact residue. |

Source caveat: only 10 iteration markdown files were present under `review/iterations/` even though the synthesis request names a 20-iteration run. This map counts findings only from the available iteration files.
