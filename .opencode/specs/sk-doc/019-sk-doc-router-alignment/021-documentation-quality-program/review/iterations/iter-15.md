# Iteration 15: spec folder — phases 005-008

> dimension: spec-conformance | model: gpt-5.6-sol effort=high tier=fast | sandbox: read-only
> status: 0 | timedOut: false

- **[P1] Phase 007 overstates authored README coverage as 131 instead of 124**

  `.opencode/specs/sk-doc/019-sk-doc-router-alignment/021-documentation-quality-program/007-code-readmes-deep-loop/implementation-summary.md:113`

  Evidence: The summary says “All 131 missing code READMEs … are now authored.” `git diff-tree` confirms the three phase commits added 33, 38, and 53 READMEs respectively: 124 total. Phase 006 intentionally excluded seven of the 131 candidates.

  Fix: State: “All 124 in-scope README targets were authored; seven of the original 131 candidates were intentionally excluded.”

- **[P1] All four checklist verification summaries miscount their priority items**

  `.opencode/specs/sk-doc/019-sk-doc-router-alignment/021-documentation-quality-program/005-code-readmes-infra-and-sk/checklist.md:116`  
  `.opencode/specs/sk-doc/019-sk-doc-router-alignment/021-documentation-quality-program/006-code-readmes-design-prompt-speckit/checklist.md:116`  
  `.opencode/specs/sk-doc/019-sk-doc-router-alignment/021-documentation-quality-program/007-code-readmes-deep-loop/checklist.md:116`  
  `.opencode/specs/sk-doc/019-sk-doc-router-alignment/021-documentation-quality-program/008-existing-readme-cleanup/checklist.md:116`

  Evidence: Counting the actual `CHK-*` entries gives:

  - 005: 10 P1 / 3 P2, reported as 9 / 4.
  - 006: 10 P1 / 3 P2, reported as 9 / 4.
  - 007: 11 P1 / 2 P2, reported as 10 / 3.
  - 008: 12 P1 / 1 P2, reported as 11 / 1.

  Fix: Regenerate or manually correct each verification-summary table from the checklist entries.

- **[P1] Phase 008 marks 100 files as repaired although only 64 required edits**

  `.opencode/specs/sk-doc/019-sk-doc-router-alignment/021-documentation-quality-program/008-existing-readme-cleanup/tasks.md:52`  
  `.opencode/specs/sk-doc/019-sk-doc-router-alignment/021-documentation-quality-program/008-existing-readme-cleanup/implementation-summary.md:52`

  Evidence: Tasks T003–T008 describe six completed “repair” batches totaling 100 files. The implementation summary simultaneously says only 64 READMEs were repaired, which matches commit `a4b492c644` exactly: 64 modified READMEs and one deletion. The remaining 36 outcomes are not explained.

  Fix: Describe the 100 files as candidates reviewed, then record that 64 required edits and 36 were verified no-ops/false positives. Otherwise, identify the uncompleted repairs.

- **[P1] Phase 008 uses incompatible broken-reference baselines**

  `.opencode/specs/sk-doc/019-sk-doc-router-alignment/021-documentation-quality-program/008-existing-readme-cleanup/checklist.md:42`

  Evidence: CHK-001 calls the input “171 raw broken refs,” while the same checklist at lines 53 and 66—and the spec and implementation summary—claim a 177→119 phase result. Commit `9015dbfadd`, immediately before the phase-008 implementation commit, repaired audit findings in five newly authored READMEs, making a staged 177→171→119 interpretation plausible but undocumented.

  Fix: Record the stages explicitly: 177 before post-authoring reconciliation, 171 entering phase 008, and 119 after phase 008. Attribute each delta to its commit.
