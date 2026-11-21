# Review Iteration 012

## Dispatcher

- Mode: review (deep-review LEAF, inline executor for this detached lineage)
- Session: `fanout-deepseek-1795201537192-sq1ivw`, generation 1, lineageMode `new`
- Iteration: 12 of 24
- Focus: **Frontier node F-1-006: maintainability**
- Dimension: maintainability
- Frontier node: F-1-006 (depth 1 of 3), scope `.skilled/commands/deep`, `.skilled/skills/system-deep-loop/deep-review/references`, `.skilled/skills/system-deep-loop/deep-research/references`, `.skilled/skills/system-deep-loop/runtime/feature-catalog`
- Convergence before dispatch: `CONTINUE` / `noStopCandidate`, stuck 0, consecutive failures 0.
- Sources read this iteration: `steer.md` (absent), `deep-review-config.json`, `deep-review-findings-registry.json`, `deep-review-strategy.md`, `frontier-nodes.jsonl`, both presentations, both command docs, `executor-branch-contract.vitest.ts`.

## Files Reviewed

- `.skilled/commands/deep/review.md:111`
- `.skilled/commands/deep/research.md:118`
- `.skilled/commands/deep/assets/deep-review-presentation.txt:142,226`
- `.skilled/commands/deep/assets/deep-research-presentation.txt:131,199`
- `.skilled/commands/deep/assets/compiled/deep-review.contract.markdown:284,371`
- `.skilled/commands/deep/assets/compiled/deep-research.contract.markdown:279,350`
- `.skilled/skills/system-deep-loop/runtime/tests/unit/executor-branch-contract.vitest.ts:17-25,145-149`

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **The executor help text is hand-maintained in four files and the only test that reads them checks a single rejected flag** -- `.skilled/commands/deep/assets/deep-review-presentation.txt:142` -- The `--sandbox-mode` row and the per-kind help lines are duplicated in `review.md`, `research.md`, `deep-review-presentation.txt` and `deep-research-presentation.txt`, and the two compiled contracts are generated from them. This range had to edit all four to describe the opencode workspace-write default, and the pi line still drifted (R4-P2-001). The parity test that reads the presentations and protocol files (`executor-branch-contract.vitest.ts:145-149`) asserts only that they do not carry the rejected `--pure` flag; nothing compares the sandbox row or the per-kind lines across the four copies.
   - Finding class: cross-consumer
   - Scope proof: `rg -l "cli-opencode also defaults to .workspace-write." .skilled/commands/deep .skilled/skills/system-deep-loop` returns the two presentations and the two compiled contracts; `rg -n "OPENCODE_COMMAND_DOCS" executor-branch-contract.vitest.ts` shows the list is used only by the `--pure` assertion. The command docs carry a differently worded copy of the same claim, so the four hand-maintained copies are not byte-identical and no test could compare them without a normalized source.
   - Affected surface hints: ["deep-review-presentation.txt", "deep-research-presentation.txt", "review.md", "research.md", "executor-branch-contract.vitest.ts"]
   - Case: a maintainer changes the opencode sandbox behavior and edits the two presentations, missing `review.md` and `research.md`. The compiled contracts regenerate from the presentations and look correct, the `--pure` test passes, and the command docs keep telling operators the old behavior until someone reads both.

## Traceability Checks

| Protocol | Status | Evidence | Summary |
|----------|--------|----------|---------|
| `spec_code` | partial | `.skilled/skills/system-deep-loop/runtime/tests/unit/executor-branch-contract.vitest.ts:145-149` | The docs match the code today, but the duplication has no parity guard beyond one negative flag check. |
| `checklist_evidence` | notApplicable | - | No spec checklist for a commit-range target. |
| `skill_agent` | notApplicable | - | No agent definition in the range. |
| `agent_cross_runtime` | notApplicable | - | No runtime mirror in the range. |
| `feature_catalog_code` | pending | - | Covered in iteration 9; not re-run. |
| `playbook_capability` | pending | - | Covered in iteration 6; not re-run. |

## Integration Evidence

- `.skilled/skills/system-deep-loop/runtime/tests/unit/executor-branch-contract.vitest.ts:17-25` names the presentations and both `loop-protocol.md` files as "the cli-opencode command an operator copies", so the test's author already treated them as a parity surface; the assertion at `:145-149` covers only `--pure`.
- `.skilled/commands/deep/assets/compiled/deep-review.contract.markdown:284,371` and the research counterpart carry the generated copies, so a maintainer who edits only the presentations produces a self-consistent generated pair that still disagrees with the command docs.
- `.skilled/commands/deep/review.md:111` and `.skilled/commands/deep/research.md:118` carry a differently worded copy of the same claim, which is why a byte comparison would not work and a normalized assertion is needed.

## Edge Cases

- **The four copies are not identical by design.** The command docs use a longer sentence; the presentations use a shorter row. A parity test would need to assert the shared facts (default mode, deny scope, read-only refusal), not the bytes.
- **The compiled contracts are generated, so they are not a fifth hand-maintained copy.** They inherit whatever the presentations say, which is why the drift risk is in the four sources.
- **The pi line is the proof of cost.** R4-P2-001 is exactly the drift this duplication permits, and it survived a range whose author edited all four files for the opencode change.

## Confirmed-Clean Surfaces

- **Compiled contracts are generated.** Their digests match their sources (iteration 9), so they cannot drift independently.
- **The `--pure` guard works.** No doc carries the rejected flag.
- **The presentations and command docs agree today.** The opencode paragraph and the pi line were compared in iterations 4 and 6; the only disagreement is the pi line already reported.

## Ruled Out

- **A finding for the compiled contracts.** Ruled out: they are generated and their digests match.
- **A duplicate of R4-P2-001.** Ruled out: R4-P2-001 is the pi content drift; this finding is the structural duplication that let it happen, in a different file set.
- **A finding for the `--pure` guard being too narrow on its own.** Ruled out as the same finding: the narrow guard is the evidence, not a separate defect.

## Next Focus

- Dimension: correctness
- Frontier node: F-2-007 (open, zero visits; the only unvisited node)
- Focus area: the sandbox enforcement label matrix across every executor kind and all three sandbox modes — whether `sandboxEnforcementFor` reports `preventive`, `compensating` or `none` correctly for each kind, including the kinds whose builder emits a different mode than the one requested.
- Reason: all three depth-1 nodes are answered or on their last dimension; the admitted child is the remaining frontier work and its question is the one R1-P2-001 opened.
- Rotation status: F-1-006 all four dimensions covered; F-2-007 correctness next.
- Blocked/productive carry-forward: productive (test-to-doc comparison found the unguarded duplication); no blocked approaches.
- Required evidence: `sandboxEnforcementFor`, every builder's `confines` and `compensatingControl` argument, and the conformance test's per-surface assertions.
- Recovery note: none.

Review verdict: PASS
