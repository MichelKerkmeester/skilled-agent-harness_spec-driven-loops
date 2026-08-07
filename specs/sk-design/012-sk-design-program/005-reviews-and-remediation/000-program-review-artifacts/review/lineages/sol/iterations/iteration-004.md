# Review Iteration 004 — Maintainability

## Dispatcher

- Resolved route: `mode=review target_agent=deep-review`
- Session: `fanout-sol-1784457701676-6nfth8`; generation 1; lineage mode `new`
- Budget profile: `scan`
- Focus: DB/operator maintenance ownership, generation retention, vector-job operability, migration/cutover ergonomics, shared command authority, current-state documentation, and test-fixture realism.

## Files Reviewed

- `.opencode/skills/sk-design/styles/_db/README.md:1-73`
- `.opencode/skills/sk-design/styles/_db/indexer.mjs:1004-1181`
- `.opencode/skills/sk-design/styles/_db/vectors.mjs:128-346`
- `.opencode/skills/sk-design/styles/_engine/persistent-adapter.mjs:98-358`
- `.opencode/skills/sk-design/styles/_engine/style-library.mjs:200-259`
- `.opencode/skills/sk-design/styles/_db/__tests__/fixtures.mjs:18-39`
- `.opencode/skills/sk-design/styles/_db/__tests__/indexer.test.mjs:45-234`
- `.opencode/skills/sk-design/shared/creation-contract.md:14-206`
- `.opencode/commands/interface/design.md:1-86`
- `.opencode/specs/sk-design/012-style-database-and-interface-commands/003-style-database/{spec.md:64-164,plan.md:65-116,tasks.md:40-73,implementation-summary.md:47-100}`

## Findings - New

### P0 Findings

None.

### P1 Findings

1. **Persistent DB maintenance has no owned operator surface or bounded generation-retention path** -- `.opencode/skills/sk-design/styles/_db/indexer.mjs:1047-1125` -- Every full build publishes a uniquely named immutable SQLite generation, but cleanup removes only temporary/building files. Rollback, vector rebuild, and queue drain are exported library functions; exact consumer search found no non-test caller, while the production CLI exposes only legacy-manifest `build` plus `query|hydrate`. The README documents callable functions but no status, build/cutover, rollback, vector-repair, or retention workflow. Repeated maintenance therefore requires bespoke imports, offers no auditable recovery entrypoint, and accumulates generation files without a stated keep/prune invariant. This is distinct from the existing stranded-vector-job finding: that defect concerns automatic crash recovery; this finding concerns ownership and bounded operation of all maintenance surfaces. [SOURCE: `.opencode/skills/sk-design/styles/_db/indexer.mjs:1047-1125`] [SOURCE: `.opencode/skills/sk-design/styles/_db/indexer.mjs:1128-1174`] [SOURCE: `.opencode/skills/sk-design/styles/_db/vectors.mjs:289-346`] [SOURCE: `.opencode/skills/sk-design/styles/_engine/style-library.mjs:220-245`] [SOURCE: `.opencode/skills/sk-design/styles/_db/README.md:23-46`]

   Finding class: cross-consumer

   Scope proof: Exact search across `styles/**` found `buildStyleDatabase`, `rollbackStyleDatabase`, and `rebuildVectorProjection` consumed only by their defining modules and `_db/__tests__`; the only generation-file deletion removes temporary/building paths, and the production CLI dispatch has no persistent build, status, rollback, vector-repair, or prune command.

   Affected surface hints: persistent DB operator CLI, immutable generation retention, rollback selection, vector repair/drain, cutover runbook

```json
{"type":"maintenance-operability","claim":"Persistent DB publication and repair are library-only surfaces, and repeated full builds retain uniquely named generation files without a bounded retention or prune path.","evidenceRefs":[".opencode/skills/sk-design/styles/_db/indexer.mjs:1047-1125",".opencode/skills/sk-design/styles/_db/indexer.mjs:1128-1174",".opencode/skills/sk-design/styles/_db/vectors.mjs:289-346",".opencode/skills/sk-design/styles/_engine/style-library.mjs:220-245",".opencode/skills/sk-design/styles/_db/README.md:23-46"],"counterevidenceSought":"Searched all styles modules and tests for production consumers, status/cutover/rollback/vector-repair commands, and generation pruning or retention policy; found only internal indexer drains and test callers. Reviewed the README, phase plan, and implementation summary for an external operator owner or runbook; none is named.","alternativeExplanation":"The exports are intentionally callable APIs and a deployment can write a small one-off Node script; the default legacy adapter also limits immediate exposure. That does not provide a stable, test-covered maintenance owner or prevent unbounded generation-file growth once builds are operated.","finalSeverity":"P1","confidence":0.92,"downgradeTrigger":"Provide one documented and test-covered operator surface for status/build/cutover/rollback/vector repair, plus an explicit retention invariant and safe pruning implementation that preserves the current and required rollback generations."}
```

### P2 Findings

None.

## Active Finding Baseline

- Carried active findings remain exactly eight P1 and one P2: `SOL-I001-P1-001`, `SOL-I003-CORR-P1-001`, `SOL-I002-P1-001`, `SOL-I003-CORR-P1-002`, `SOL-I003-P1-001`, `SOL-I003-P1-002`, `SOL-I003-P1-003`, `SOL-I003-P1-004`, and `SOL-I001-P2-001`.
- This iteration adds `SOL-I004-P1-001`; cumulative active totals are P0=0, P1=9, P2=1. Resolved `SUMMARY-*` and superseded correction IDs were not reintroduced.

## Traceability Checks

- `spec_code` (core): **fail, carried** — prior evidence-backed correctness/security/traceability findings remain active; maintainability review did not re-run the exhausted protocol.
- `checklist_evidence` (core): **fail, carried** — false checked evidence in phases 001-003 remains active; maintainability review did not duplicate those findings.
- Maintainability-specific current-state check: **partial** — README and implementation summary clearly identify flat files and `legacy` as the current supported default, but they do not identify an owned persistent maintenance/cutover surface or generation-retention policy.

## Integration Evidence

- `.opencode/skills/sk-design/styles/_engine/style-library.mjs:220-245` is the exact production CLI boundary; it exposes legacy-manifest `build` and backend-selectable query/hydrate, but not persistent publication or maintenance.
- `.opencode/skills/sk-design/shared/creation-contract.md:14-52,130-206` is the exact shared lifecycle authority used by `.opencode/commands/interface/design.md:9-15,37-53`; the command stays thin and does not duplicate taste or lifecycle tables.
- `.opencode/skills/sk-design/styles/_db/README.md:60-73` and `.opencode/specs/sk-design/012-style-database-and-interface-commands/003-style-database/implementation-summary.md:73-99` consistently name `legacy` as the supported default and persistent operation as explicit opt-in.

## Edge Cases

- The safe `legacy` default contains immediate operational risk, so the maintenance finding is P1 rather than P0.
- Retaining at least one prior immutable generation is required for rollback; the defect is absence of a bounded keep/prune invariant, not retention itself.
- The two-style shared fixture and ≤20-style timing fixture are intentionally fast unit/regression fixtures. Their inability to prove corpus-scale SLO is already represented by `SOL-I003-P1-003` and was not duplicated.
- Structural-impact analysis remained unavailable; exact producer/consumer searches and direct reads supplied the bounded evidence.
- Existing unrelated dirty/untracked workspace paths were observed before writes and were not modified.

## Confirmed-Clean Surfaces

- Shared interface lifecycle, typed context/proof, mutation boundary, and failure semantics are centralized in `shared/creation-contract.md`; canonical wrappers reference rather than copy that authority.
- Canonical command assets remain explicitly named in the thin router, reducing workflow/presentation drift.
- README, adapter, skill documentation, changelog, and phase handoff agree that flat files remain authoritative and `legacy` is the current default.
- Staging/building files and SQLite sidecars are cleaned on failure, and rollback validates a retained sibling generation before atomically repointing readers.

## Ruled Out

- **Duplicated lifecycle/taste authority across canonical interface wrappers** — ruled out by the shared contract plus thin command router; wrappers reference the central lifecycle and own only mode-specific discrimination/assets.
- **Ambiguous currently supported DB mode** — ruled out because README, adapter implementation, skill documentation, changelog, and phase handoff all identify `legacy` as default and persistent as explicit opt-in.
- **A new fixture-realism finding** — ruled out as duplicate; the only release-relevant fixture gap is already active as `SOL-I003-P1-003`.

## Next Focus

- Dimension: stabilization
- Focus area: replay the nine active P1s and one P2 against current source hashes, with emphasis on whether the new operator-lifecycle finding changes any existing fix boundary
- Reason: all four dimensions are now covered; one stabilization pass is required before legal convergence
- Rotation status: correctness, security, traceability, and maintainability completed; stabilization remains
- Blocked/productive carry-forward: direct reads and exact producer/consumer searches remain productive; do not retry registration drift, hidden full-corpus fixtures, omitted GLM lineage, command lifecycle duplication, or supported-mode ambiguity
- Required evidence: current source rereads for active P1/P2 anchors, deduplication against the reducer registry, and one bounded counterevidence search per changed claim

Review verdict: CONDITIONAL
