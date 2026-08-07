# 032 Pre-Merge Deep-Review — Resolution Note

Pre-merge deep review of the 175-node `sk-doc/020-hyphen-naming-convention` spec tree.
Fan-out: `sol-xhigh` ×10 + `terra-max` ×5 productive iterations (`luna-max` ×5 failed —
cli-codex refuses self-invocation from a Codex session). Merged verdict **CONDITIONAL**
(strongest-restriction): **P0 = 0, P1 = 9, P2 = 2**. The raw per-lineage registries,
iterations, deltas, and prompts are retained under `lineages/` and `deep-review-findings-registry.json`.

This note records how each finding was dispositioned. It is a historical record: the
registries above still describe the **pre-fix** state.

## Fixed before merge (this pass)

| Finding | Severity | Resolution |
|---------|----------|------------|
| F001 (both instances) | P1 | Parent `spec.md` phase map + all child adjacency, continuity, and decision-record references reconciled to the real **000–011 / 175-node** topology. Zero stale `16-phase` / `000-015` / old-slug references remain outside `review/`. |
| F004-cac9 | P1 | Phase 000 worktree identity de-hardcoded in `spec.md`, `plan.md`, `tasks.md`: allocate an owner-first branch via `worktree-naming.sh create sk-doc 032-hyphen-naming` instead of the literal legacy `wt/0037-*`. |
| F002-0557 | P1 | `manifest/build-phase-tree.mjs` now reproduces the committed authoritative manifest **byte-identically** (added per-parent child numbering; corrected the `006` node). Running the generator no longer clobbers the tree. |
| F003-45754 | P2 | The two competing "PHASE DOCUMENTATION MAP" sections were made consistent (first retitled to "PHASE MAP & OUTCOMES"); both now describe 000–011. |
| F006 | P2 | Generator default output path changed from a developer-private `/tmp` scratch path to the sibling `manifest/phase-tree.json`, so a bare run refreshes the authoritative manifest. |
| F005 (root) | P1 | The root `spec.md` Phase Handoff Criteria placeholders (`[Criteria TBD]`) were replaced with concrete per-gate criteria + verification. |

All touched nodes re-validated `--strict`; the whole-tree recursive gate is **0 errors across all 20 parent nodes**.

## Deferred to the migration EXECUTION phase (spec-authoring is not the migration)

These are execution-readiness gaps: they describe what the migration RUN must satisfy, not
defects in the plan text. They are tracked here for the team that executes 000–011.

| Finding | Severity | Ref | What the execution phase must add |
|---------|----------|-----|-----------------------------------|
| F002-c845 | P1 | `000-.../checklist.md` | Phase 000 references predecessor + rename-map evidence that only exists once the run starts; sequence/relax the checklist so 000 is satisfiable at kickoff. |
| F003-3e99 | P1 | `005-.../001-rename-engine/decision-record.md` | The apply step must re-validate the exact reviewed dry-run snapshot before mutating. |
| F004-ea3c | P1 | `001-.../decision-record.md` | The declared leading-hyphen CLI hazard needs a rejecting rule in the rename engine + a harness criterion. |
| F007 | P1 | `006-.../plan.md` | The frozen-map phase must define its durable consumer interface (schema/contract the later phases read). |
| F005 (residual) | P1 | per-phase `checklist.md` | Per-phase transition gates need full SOL-contract rigor at execution time, beyond the root handoff table. |
