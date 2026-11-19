# Iteration 8 - F-1-005 traceability: extension, state-log fields and evidence edges against the packet

## Dispatcher

- Mode: review, detached fan-out lineage `deepseek` (session `fanout-deepseek-1795113418367-pvzn7z`, generation 1, lineageMode new).
- Frontier node: F-1-005, dimension traceability. Node scope: the two reducers, `upsert.cjs`, `convergence.cjs`, `verify-iteration.cjs`, `dispatch-iteration.cjs` and the five `runtime/lib` folders, with packet docs and catalogs as evidence.
- Operator review focus covered in this iteration: overengineering (the extension and evidence rules restated across schema, catalog and playbook), operator UX (the `--extend` catalog wording and the warning text), cross-CLI/OS parity (the projection's leaf fields on both loops).

## Files Reviewed

- `.skilled/skills/system-deep-loop/runtime/scripts/upsert.cjs`, `reduce-state.cjs`, `verify-iteration.cjs`, `dispatch-iteration.cjs` -- the requirement surfaces for this node.
- `.skilled/skills/system-deep-loop/runtime/lib/deep-review-ledger-schema`, `deep-review-reducers`, `legacy-projections` -- extension and leaf-field projections.
- `.skilled/skills/system-deep-loop/deep-review/feature-catalog/loop-lifecycle/completed-run-extension.md` and the deep-research twin -- the shipped-behavior claims for `--extend`.
- `.skilled/skills/system-deep-loop/runtime/tests/integration/upsert-script.vitest.ts` and `tests/unit/workflow-restart-lifecycle.vitest.ts` -- the cases the acceptance rows name.
- Traceability sources: `001-completed-run-extension` REQ-002/REQ-004 and AC-004/AC-005, `006-state-log-leaf-fields` REQ-001..REQ-004, `011-review-frontier-mode` REQ-018 and AC-019.

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

None.

## Traceability Checks

| Protocol | Status | Evidence |
|----------|--------|----------|
| `spec_code` | partial | `001` REQ-002/REQ-004 match `deep-review.yaml:528-611`, the ledger schema and the projection; `006` REQ-001..REQ-004 match the gateway projection and `verify-iteration.cjs:497-570`; `011` REQ-018/AC-019 match `upsert.cjs:236-300` and the six integration cases. The iteration 3 REQ-007 admission claim remains the only partial. |
| `checklist_evidence` | partial | AC-004/AC-005 are pinned by `workflow-restart-lifecycle.vitest.ts:812` and `:1057`; AC-019 by `upsert-script.vitest.ts:377-642`; AC-008 remains outstanding. |
| `feature_catalog_code` | partial | The completed-run-extension pages say the ceiling is `continuedFromRun + N` and the duration is the later of prior budget and elapsed time, which matches the code and AC-004/AC-005. The expansive-depth page's produced-evidence sentence remains the earlier R2-P1-001 doc side. |

## Integration Evidence

- `.skilled/skills/system-deep-loop/runtime/tests/unit/workflow-restart-lifecycle.vitest.ts:812` and `:1057` assert the count-plus-N ceiling and the elapsed-time duration rule for research and review.
- `.skilled/skills/system-deep-loop/runtime/tests/integration/upsert-script.vitest.ts:377-642` covers the evidence edge, the delta-sourced ref, the id fold, the reused id, the ref without a line and the trailing column.
- `.skilled/skills/system-deep-loop/runtime/tests/unit/stop-decision-yaml-contract.vitest.ts:455-461` asserts the review graph step passes `--state-log`, `--delta-dir` and `--iteration`.
- `.skilled/skills/system-deep-loop/deep-review/feature-catalog/loop-lifecycle/completed-run-extension.md:17-37` matches the code's `continuedFromRun + addedIterations` schema check and the `extended` projection.

## Edge Cases

- The AC-019 row cites a commit and a full-suite count rather than a local run; I verified the cases exist by name and read the code they exercise, but I did not execute the suite in this detached lineage (the workflow forbids writing the graph DB outside the lineage).
- The extension catalog says the flag "adds N iterations" and later defines the ceiling as count-plus-N; both statements are true for the flag's meaning, so the shorter phrasing is not a contradiction.
- The `feature_catalog_code` result stays partial because the earlier catalog sentence is still in the shipped page; a per-iteration pass cannot clear it.

## Confirmed-Clean Surfaces

- Every extension requirement has a named test that exists and asserts the same arithmetic the code performs.
- Every evidence-edge requirement has an integration case, including the reused-id and no-line cases.
- The review and research catalogs agree on the extension semantics and the projection fields.
- The YAML contract case proves the graph step passes the three new flags the upsert requires.

## Ruled Out

- Re-reporting the extension arithmetic as a defect: the catalog, tests and code agree on count-plus-N.
- Re-reporting the evidence-edge code as untested: six integration cases cover the stated shapes.
- A projection-parity finding between research and review: both project `extended` rows with lineage mode, `continuedFromRun` and the budget, and the review row carries the leaf fields this lineage's state log shows.

## Next Focus

- Dimension: traceability on F-1-007 (pivot and continuity against the packet).
- Reason: F-1-005 is traceable; F-1-007 is the last node without traceability, and its requirements carry the retry and quality-class rules the catalogs cite.
- Required evidence: `012` REQ-001..REQ-009, `010` REQ-005/REQ-008 and `007` REQ-001..REQ-007 against the pivot, continuity and graph code and their catalog/playbook pages.
- Rotation status: correctness and security covered on all nodes; traceability covered on F-1-003 and F-1-005.

Review verdict: CONDITIONAL
