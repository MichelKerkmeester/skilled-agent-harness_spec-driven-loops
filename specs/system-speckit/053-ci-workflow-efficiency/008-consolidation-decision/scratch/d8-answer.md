D8=no

Date: 2026-10-25
Answer: no. The eight always-run FRESHNESS workflows stay separate, and no workflow file changes.
Authority: the operator's delegation of 2026-10-25, verbatim: "Approve plan implement all autonomously till all is perfected tested and verified decisions can wait untill end or you make best judgement and verifiy at end".
Status: this is the session's judgment under that delegation, pending the operator's verification at the end of the session. It is not an operator-typed answer. A "no" runs no gated task, so nothing it gates has to be undone if the operator overturns it; a later yes reopens T015 to T020.
Numbers behind it, all from `scratch/consolidation-cost.json` and `scratch/consolidation-baseline.md`:
- The eight bill 944.8 runner-min/day today (`bounds.freshness.currentPerDay`), 24 billed minutes per push across 12 jobs.
- A merge would save 17 billed minutes per push: 636.1 runner-min/day rate-aware, 749.7 by the plan's formula. The research projected 1,241..1,606 for all nine at the 001 volume.
- It would collapse 12 check contexts into one, serialize 382.5 s of work against a 190 s worst single job, and delete two workflows that are protected by function (`gate-inputs.yml`, `dispatch-enforcement-guard.yml`). Neither is a required status check; the only required context is message-contract's, which is outside the set.
- `command-tree-parity.yml` reads `SKILLED_CI_TESTS` in the tree, so the plan's eight would cross a switch group.
