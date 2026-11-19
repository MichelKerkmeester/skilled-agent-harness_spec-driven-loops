# Iteration 3: maintainability (overengineering and sk-code-alignment rubrics)

## Dispatcher

- Iteration 3 of 3, session 2026-11-19T15:38:08.666Z, generation 2, lineageMode restart. The state log held two iteration records, so the derived number matches the dispatch.
- Dimension: maintainability, plus the operator focus rubrics overengineering and sk-code-alignment.
- Doctrine loaded: `.skilled/skills/sk-code/sk-code-review/references/review-core.md` (sections 2 and 8, including the `review.maintainability` floor rule "no repeated logic that behaves differently") and `.skilled/repo-rules/prevent-overengineering.md` section 2.
- Budget: 24 tool calls. About 17 went on analysis.

## Files Reviewed

- `.skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs`: constants, budget helpers, renderFrontierBlock, exports (lines 40-116, 360-460, 846-915, 1195-1219).
- `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs`: the review frontier projection (lines 1917-2066) and buildDimensionUniverse (1224).
- `.skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs`: the research frontier projection and budget (lines 2439-2570).
- `.skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs`: the frontier status vocabulary (753) and helper list.
- `.skilled/skills/system-deep-loop/runtime/scripts/upsert.cjs`: finding-id folding and review evidence derivation (160-310).
- `.skilled/commands/deep/assets/deep-review.yaml` and `.skilled/commands/deep/assets/deep-research.yaml`: the step_extend_completed_run inline scripts (513, 485). The two copies were diffed against each other.
- `.skilled/skills/system-deep-loop/runtime/lib/deep-review-ledger-schema/deep-review-ledger-schema.ts` and `.skilled/skills/system-deep-loop/runtime/lib/deep-research-ledger-schema/deep-research-ledger-schema.ts`: range diff. This closes the item carried forward from iteration 2.
- Every added line in all 68 scope files, scanned for comment hygiene: 14112 added lines, indexed by file and new line number.
- Tests: `upsert-script.vitest.ts` (finding-id spellings) and `workflow-restart-lifecycle.vitest.ts` (how the extend step is executed) were read in part. The rest of the test surface was sampled only.

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **Frontier node vocabulary and depth-band budget are re-implemented in each consumer and have already drifted** -- .skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1974 -- `frontier-admit.cjs` owns and exports the node status vocabulary (`NODE_STATUSES`, frontier-admit.cjs:77) and the store reader (`readNodeStore`, frontier-admit.cjs:265; exported at 1201). `fanout-run.cjs` already imports both. Despite that, the range adds three local copies of the status list: runtime/scripts/reduce-state.cjs:29, deep-research/scripts/reduce-state.cjs:2451 and fanout-merge.cjs:753. It also adds two more store readers (runtime/scripts/reduce-state.cjs:1917, deep-research/scripts/reduce-state.cjs:2439), two copies of the failed-status set (runtime/scripts/reduce-state.cjs:33, deep-research/scripts/reduce-state.cjs:2493) and two copies of the 50/35/15 band-budget algorithm (runtime/scripts/reduce-state.cjs:1974, deep-research/scripts/reduce-state.cjs:2531). The two band-budget copies carry the same comment but no longer behave the same. The research copy marks answered nodes inside the budget pass and dates each budget close with `closedAtIteration` (deep-research/scripts/reduce-state.cjs:2560). Its own registry reads that field (2717). The review copy does neither. Visit attribution also differs: research matches the focus marker only (2495), while review also matches `frontierNodeId` and active store rows (runtime/scripts/reduce-state.cjs:1945). Some of these differences follow from different leaf contracts. But no single place states which differences are intended, so the next change to the band rule, the default split or the status set needs coordinated edits in up to four files.
   Finding class: maintainability, repeated logic that behaves differently (sk-code review floor rule `review.maintainability`); overengineering rubric, parallel implementations of one owned contract.
   Scope proof: all seven copies listed above are `+` lines in `git diff 21c4b325b5a..f30fcdb42f6`, and frontier-admit.cjs, the owning module, was added in the same range.
   Affected surface hints: .skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs, .skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs, .skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs, .skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs. Collapse target: one lib module under `runtime/lib/deep-loop/` holding the status list, failed-status set, store reader and band-budget pass, with the per-loop visit counter passed in. It cannot live in frontier-admit.cjs as-is, because frontier-admit lazily requires reduce-state.cjs (frontier-admit.cjs:381), so a top-level import back would form a cycle.
   Case: adding a status such as `deferred` to `NODE_STATUSES` (frontier-admit.cjs:77). A node written with it is counted in `stats.total`, but in no status bucket of the review dashboard (runtime/scripts/reduce-state.cjs:2050), the research projection or the fan-out merge (fanout-merge.cjs:795). Separately, a fix to the band roll-down applied to one reducer leaves the other loop on the old rule, with nothing failing.

## Traceability Checks

- spec_code: notApplicable. Traceability is not a configured dimension, and specs and docs are excluded from the target (strategy Non-Goals).
- checklist_evidence: notApplicable. Spec folders and checklists are excluded from the target.

## Integration Evidence

- `.skilled/commands/deep/assets/deep-review.yaml:513` and `.skilled/commands/deep/assets/deep-research.yaml:485`: the step_extend_completed_run inline scripts. Both run in `.skilled/skills/system-deep-loop/runtime/tests/unit/workflow-restart-lifecycle.vitest.ts` (721, 1006).
- `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` imports from frontier-admit.cjs (`readNodeStore` at 353, `expansiveBudget` at 378). This is the existing precedent for the collapse proposed in R3-P2-001.

## Rubric Coverage

- **Overengineering** (prevent-overengineering.md): I checked each new production function list for abstractions, options, layers, files or fallbacks with no requirement behind them.
  - frontier-admit.cjs: its option surface (`target`, `seeding`, `maxIterationsSource`, `knownTexts`) each has a caller in the two YAML assets or fanout-run.
  - upsert.cjs finding-id folding: the spellings it folds are pinned by tests (upsert-script.vitest.ts:400, 530, 567).
  - extension-budget ledger fields: each field is checked by the schema.
  - Result: one parallel-implementation finding (R3-P2-001). Delete the local status lists, store readers and one band-budget copy, and collapse them into a shared lib module. No unused option or fallback layer was found.
- **sk-code-alignment**:
  - Floor: the floor rule `review.maintainability` produced R3-P2-001.
  - CJS surface rules: the new modules follow the numbered-section layout and JSDoc on exported functions (frontier-admit.cjs:40, 321, 369, 1201).
  - Comment hygiene: I indexed all 14112 added lines across the 68 scope files. I grepped comment-bearing lines, both comment-led and trailing comments, for spec paths, phase or packet numbers, and REQ/ADR/CHK/DR/task ids and finding ids. Zero violations. The only hits were upsert.cjs:170-171, which use `R1-P1-001` shapes to illustrate the finding-id grammar the folding accepts. That is a durable format description, not a label for an artifact.
  - Test-what-changed: only partly covered. See Edge Cases.

## Edge Cases

- Test-what-changed is deferred. About 38 test files (roughly 10k added lines) were sampled, not audited one by one for one-real-reason coverage, because of the 24-call budget. Synthesis should treat test-surface maintainability as unreviewed rather than clean.
- `frontier-admit.cjs:381` (`reviewDimensionCount` to `buildDimensionUniverse`) sizes the expansive review budget from the same dimension universe that R1-P1-001 names. It is another affected surface of R1-P1-001, not a new finding.
- Verdict rule: iteration 2 used the agent contract, which counts active findings, so I keep it. R1-P1-001 is still active, so the verdict is CONDITIONAL even though this iteration added only a P2.

## Confirmed-Clean Surfaces

- Review frontier answered-before-budget ordering: `buildReviewFrontier` derives `answered` at runtime/scripts/reduce-state.cjs:2026, before `applyReviewFrontierBudget` runs at 2041. So the budget never closes an answered review node as exhausted. The research copy's explicit `answeredNodeIds` pass is not needed on the review side.
- `closedAtIteration` has only one reader, the research reducer (deep-research/scripts/reduce-state.cjs:2717). Its absence from the review copy is drift, not a broken consumer.
- Ledger schemas: the per-mode `run_extended` stems and `extension-budget` validators (deep-research-ledger-schema.ts:1087, deep-review-ledger-schema.ts:951) follow the existing per-mode schema architecture, and both YAML steps derive `newMaxIterations = continuedFromRun + addedIterations` (deep-review.yaml:568, deep-research.yaml:540), as the schemas require.

## Ruled Out

- Duplicated `node -e` extend scripts in the two YAML assets: inline `node -e` steps were already the convention before the range (6 in deep-review.yaml, 5 in deep-research.yaml at 21c4b325b5a). The tests run both extracted steps (workflow-restart-lifecycle.vitest.ts:721, 1006). The differences between the copies track real config-shape differences: research nests lineage fields and has an inbox, review does not.
- upsert.cjs finding-id prefix folding as overengineering: the tests pin the `FIND-`, `finding-` and lowercase spellings (upsert-script.vitest.ts:400, 530, 567). The `node:finding:` spelling is one regex alternate.
- Comment hygiene violations: none in 14112 added lines.

## Next Focus

- Dimension: none. This was iteration 3 of 3, so the run stops at maxIterationsReached.
- Focus area: synthesis.
- Reason: all three configured dimensions are complete.
- Rotation status: correctness, security and maintainability are done.
- Carry-forward: R1-P1-001 (P1) is active. R2-P2-001 and R3-P2-001 (P2) are open. Test-what-changed was deferred.
- Required evidence: file:line from reviewScopeFiles only.

Review verdict: CONDITIONAL
