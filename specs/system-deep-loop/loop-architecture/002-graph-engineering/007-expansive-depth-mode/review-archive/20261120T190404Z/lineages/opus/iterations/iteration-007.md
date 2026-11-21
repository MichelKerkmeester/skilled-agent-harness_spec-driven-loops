# Iteration 007 - Frontier node F-1-004: traceability

## Dispatcher

- Lineage: opus (fan-out), iteration 7 of 24, dimension traceability, frontier node F-1-004 (depth 1 of 3)
- Stop check before dispatch: CONTINUE (noStopCandidate)
- Sources read: config, registry, strategy; steer.md absent

## Dimension

Traceability of the command surface: the core protocols `spec_code` and `checklist_evidence` against the packet's review-frontier child (`011-review-frontier-mode`), plus the feature-catalog promise for commit-range relevance against the workflow steps that would have to feed it. Packet docs are read as reference only; findings target code and command surfaces.

## Files Reviewed

- `.skilled/commands/deep/assets/deep-review.yaml:65,405,420,791-818,905,1171,1194-1195` (depth_mode binding, scope discovery)
- `.skilled/skills/system-deep-loop/runtime/feature-catalog/script-entry-points/frontier-admit-script.md:50` (relevance promise)
- `.skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs:600-623` (touched-file narrowing)
- `.skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:1503-1510,1611-1628` (stop-owed dimensions)
- `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1222-1237` (node universe)
- Reference only: `specs/.../011-review-frontier-mode/spec.md:134-157` (REQ-001..019), `decision-record.md:45-47` (Q009, Q011), `tasks.md:99-104` (T032-T037)

## Findings by Severity

### P0 Findings

None.

### P1 Findings

1. **No workflow step records the files a commit-range target touches, so the documented touched-file narrowing of frontier relevance never engages and admission keeps any scope** -- .skilled/commands/deep/assets/deep-review.yaml:815 -- The frontier-admit catalog promises that "a target that holds a revision range ... narrows it to the files the range touches, read from `reviewScopeFiles`" (`frontier-admit-script.md:50`). The only producer of `reviewScopeFiles` is `step_scope_discovery` through `step_create_config` (`deep-review.yaml:896`), and its `files` branch (`:815-818`) only expands globs and validates that files exist; it has no rule that turns `base..tip` into `git diff --name-only` output, and no script in the runtime computes it (`grep -rn "name-only"` finds only an unrelated `dispatch-iteration.cjs:745`). With no touched files on record `scopeInsideTouchedFiles` admits every scope (`frontier-admit.cjs:618`), including absolute paths, so the commit-range target the review-frontier pilot is built around (US-001, REQ-010) runs with relevance switched off unless the orchestrating model invents the list. This sharpens OPUS-F002-P2-002 (iteration 1) from an engine edge case to a workflow contract gap.
   - Finding class: cross-consumer
   - Scope proof: producers of `reviewScopeFiles`: `step_create_config` only; consumers: `frontier-admit.cjs:638` and `terminal-gates.cjs` scope gate.
   - Affected surface hints: deep-review.yaml step_scope_discovery (add a commit-range rule), frontier-admit-script.md relevance paragraph (state the empty-list fallback), review.md flag table.
   - Case: `/deep:review "base..tip -- .skilled/skills" :auto --depth-mode=expansive` with init recording the target words; a leaf proposal scoped to `/etc` or a path outside the range is admitted as an open node and funded.

```json
{"type":"claim-adjudication","findingId":"OPUS-F004-P1-001","claim":"A commit-range review target gets no touched-file list from any workflow step, so frontier relevance admits every scope although the catalog promises narrowing to the touched files.","evidenceRefs":[".skilled/commands/deep/assets/deep-review.yaml:815",".skilled/commands/deep/assets/deep-review.yaml:896",".skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs:618",".skilled/skills/system-deep-loop/runtime/feature-catalog/script-entry-points/frontier-admit-script.md:50"],"counterevidenceSought":"Searched the review YAML, presentation and runtime scripts for name-only, touchedFiles and touched files; read the scope discovery branches; checked whether fanout-run computes scope files.","alternativeExplanation":"An orchestrating model may compute the touched files on its own while expanding the files target, as this lineage did; the admit-all fallback is pinned as intended by frontier-admit-review.vitest.ts:516.","finalSeverity":"P1","confidence":0.6,"downgradeTrigger":"Downgrade to P2 if a workflow step or script is shown to record the range's touched files in reviewScopeFiles before admission runs, or if the catalog is amended to document the admit-all fallback as the contract."}
```

### P2 Findings

1. **The comment that justifies the node universe claims a node is never held open for a dimension the stop does not owe, which is false for a canonical subset** -- .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:1505 -- The comment above `reviewOmitsTraceability` says "a node is never held open for a dimension the stop does not owe". The stop gate owes only `config.reviewDimensions` (`:1611-1613,1627`), so a run configured with `correctness` owes correctness alone, while the node universe is `correctness, security, maintainability` (probe of `buildDimensionUniverse({reviewDimensions:["correctness"]})`). The canonical-plus-custom universe is the operator's ruling (decision-record Q011), so the behavior is intended; the comment overstates what the traceability narrowing guarantees and invites a reader to "fix" either side. Operator UX: such a run dispatches security and maintainability iterations per node that the operator excluded, documented only inside the long `--depth-mode` cell of `review.md:100`.
   - Finding class: instance-only
   - Scope proof: the sentence appears once (`convergence.cjs:1503-1506`); `reduce-state.cjs:1222-1223` carries the accurate narrower wording.
   - Affected surface hints: convergence.cjs reviewOmitsTraceability comment; review.md `--depth-mode` row.
   - Case: an operator runs `--dimensions correctness --depth-mode=expansive`, sees security iterations dispatched, and reads the comment that says that cannot happen.

## Traceability Checks

- `spec_code` (core): partial. REQ-013 passes: `depth_mode` is bound in `user_inputs` (`deep-review.yaml:65`), preflight (`:420`), config (`:905`), `step_read_state` (`:1194-1195`) and the `convergence.cjs` call (`:1259`). REQ-019 passes: budget formula in `frontier-admit.cjs:448-455` matches. REQ-014 says a node is answered once every *configured* dimension is covered; the code follows the later operator ruling Q011 (canonical four plus custom, less unconfigured traceability), so the spec wording is stale against a recorded decision rather than the code being wrong. The commit-range relevance contract (US-001/REQ-010 shape) has no producer for its input (P1 above).
- `checklist_evidence` (core): pass on the sample. `tasks.md:103-104` mark T036 and T037 done; T037's claim that the budget counts the reducer's universe is backed by `frontier-admit.cjs:460-463` (`reviewDimensionCount` calls `buildDimensionUniverse`). Twelve tasks remain unchecked in the child, consistent with its pilot rows.

## Integration Evidence

- `terminal-gates.cjs` also matches open findings against `reviewScopeFiles` (`deep-review.yaml:1412` note), so the same missing list affects the terminal scope gate on a commit-range target.

## Edge Cases

- Config deviation recorded: this lineage rewrote `reviewScopeFiles` in `deep-review-config.json` to the 232 touched files after the `run_initialized` record hashed the config. The rewrite is what `step_scope_discovery` should have produced; no script re-verifies the hashed `contentDigest` (`grep contentDigest` over verify-authority, fanout-merge, synthesis-closeout, terminal-gates and reduce-state finds only an unrelated `fanout-merge.cjs:404` helper). It is carried to the review report.
- `deep_review.graph_convergence_evaluated` rows are not appended by this lineage: synthesis hydrate and the convergence report do not read them (`deep-review.yaml:2166-2195,2456-2488`); the stop decision is taken from `convergence.cjs --stop-decision` each iteration.

## Confirmed-Clean Surfaces

- REQ-013 binding of `depth_mode` across every surface `convergence_mode` uses.
- REQ-019 budget sizing and the T037 universe count.

## Ruled Out

- REQ-014 code defect: the code follows decision-record Q011, a later operator ruling; the spec line is the stale side and specs are outside the findings target.

## Operator Focus Coverage

- Overengineering: none new; the issue is a missing producer, not an extra layer.
- Operator UX: excluded dimensions dispatched per node (P2) and relevance silently off on the flagship commit-range target (P1).
- Cross-CLI parity: the gap is in the shared YAML, so every executor inherits it.

## Next Focus

- Dimension: traceability
- Focus area: next node per registry rotation (F-1-002 or F-1-006 traceability)
- Reason: registry.frontier rotation
- Rotation status: F-1-004 has correctness, security and traceability covered
- Required evidence: file:line

Review verdict: CONDITIONAL
