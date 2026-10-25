# P2 verification ledger D

The two registry entries under `specs/` that ledger C's scope filter matched but its table left out, re-checked by the conductor on 2026-10-25 against the same tree.

| findingId | short title | verdict | evidence (file:line plus the command and its output) | live or historical | minimal fix in one line | files the fix touches |
|---|---|---|---|---|---|---|
| R7-P2-001--6734d8c96b94 | One acceptance row's command needs a variable the row never defines | REPRODUCES | `005-weak-model-authoring-card/acceptance-criteria.md:61` (AC-008) runs `jq '.runs \| length' $PHASE/scratch/card-bench/baseline.json`. `grep -o '\$[A-Z_][A-Z_0-9]*'` over that file finds `$PHASE` once and no line that defines it. The definition lives only in `005-weak-model-authoring-card/tasks.md:33`. | historical (closed phase) | Add a dated note under the criteria table that `$PHASE` is the phase folder, as `tasks.md:33` defines it | `005-weak-model-authoring-card/acceptance-criteria.md` |
| R1-P2-002--45ad103dfe73 | Parent Branch metadata reads main while every phase ran on the worktree branch | REPRODUCES | Parent `spec.md:52` reads `` **Branch** \| `main` ``. The packet's phases were built on `worktrees/217-weak-model-spec-authoring`, which merged to `main` on 2026-10-25, and phase 010's `spec.md:39` names that branch. | live parent | Name the worktree branch in the Branch row and say it merged to `main` on 2026-10-25 | parent `spec.md` |
