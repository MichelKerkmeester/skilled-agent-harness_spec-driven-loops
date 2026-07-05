# Iteration 8: Final convergence synthesis

## Focus

This iteration performed a convergence-focused synthesis using the accumulated iteration evidence. The selected interpretation was narrow: do not broaden source inspection unless a contradiction appears; consolidate the final ranked upgrade proposals, validation hooks, and residual limitations for `code-implement`, `code-quality`, `code-debug`, and `code-verify`.

## Findings

1. The final top proposal remains to repair, relocate, or retire/re-scope `code-verify/assets/scripts/verify_stack_folders.py` because prior evidence shows both an advertised verification contract and a stale executable assumption: `code-verify` tells users to run it for surface-router integrity, while the script still expects the old `STACK_FOLDERS` map and local surface folders. [SOURCE: research/iterations/iteration-005.md] [SOURCE: research/iterations/iteration-006.md]
2. The second proposal remains a shared cross-mode handoff schema because iterations 4-7 consistently found a coherent lifecycle but distributed payload fields. The schema should include `changedScope`, `surface`, `baseline`, `qualityEvidence`, `distWarning`, `symptom`, `reproductionCommand`, `beforeAfter`, `acceptedRisks`, and `targetVerificationCommands`. [SOURCE: research/iterations/iteration-004.md] [SOURCE: research/iterations/iteration-005.md] [SOURCE: research/iterations/iteration-007.md]
3. The third proposal remains path-vocabulary normalization because the drift is broad but not conceptually difficult: `SKILL.md`, READMEs, checklist assets, and shared lifecycle docs mix old monolithic/local labels with current sibling-packet targets. This should be treated as one documentation alignment change across the workflow packets rather than separate per-file bugs. [SOURCE: research/iterations/iteration-006.md] [SOURCE: research/iterations/iteration-007.md]
4. The fourth proposal remains parent-vs-packet precedence wording: parent `sk-code` should stay routing-only, and after mode resolution the registry/tool-surface contract for the selected packet governs allowed tools and behavior. This reduces friction without moving lifecycle process into the hub. [SOURCE: research/iterations/iteration-004.md] [SOURCE: research/iterations/iteration-005.md]
5. The fifth proposal remains boundary documentation for intentional overlap: implement consumes write-time resources, quality enforces author-side gates, debug repairs evidenced failures, verify collects non-mutating final evidence, and review produces findings-first reports. The overlap is useful when named and risky when silently collapsed. [SOURCE: research/iterations/iteration-001.md] [SOURCE: research/iterations/iteration-004.md] [SOURCE: research/iterations/iteration-007.md]

## Ruled Out

- New broad inventory pass: iterations 1-4 already covered core `SKILL.md`, assets, scripts, parent routing, and lifecycle seams; iterations 6-7 checked ancillary docs for contradictions. [SOURCE: research/iterations/iteration-004.md] [SOURCE: research/iterations/iteration-007.md]
- Re-ranking stale path cleanup above the broken verifier: path drift is broader, but the verifier has higher execution risk because it is an advertised runnable check. [SOURCE: research/iterations/iteration-006.md]
- Collapsing `code-quality`, `code-verify`, or `code-review` into one packet: the researched contracts show distinct author-side gate, non-mutating evidence, and findings-first review roles. [SOURCE: research/iterations/iteration-004.md] [SOURCE: research/iterations/iteration-007.md]

## Dead Ends

- Additional README/checklist rereads are now exhausted for ranking purposes; recent passes produced corroboration and minor refinements, not new proposal classes.
- Historical changelog archaeology explains drift origins but does not improve the current upgrade plan.

## Edge Cases

- Ambiguous input: none; this was explicitly a continuation of the same bound `/deep:research:auto` run.
- Contradictory evidence: old path labels versus current sibling-packet targets remain unresolved in source files, but the research resolved them as a concrete path-normalization proposal.
- Missing dependencies: per-iteration delta JSONL/resource-map generation was not performed because this leaf agent's write scope is limited to allowed packet-local iteration/state/synthesis artifacts; the reducer/orchestrator owns generated dashboard/registry/resource-map refresh.
- Partial success: none for this iteration. The loop reached semantic convergence for proposal ranking with no new source class or ranking change.

## Sources Consulted

- research/iterations/iteration-001.md
- research/iterations/iteration-004.md
- research/iterations/iteration-005.md
- research/iterations/iteration-006.md
- research/iterations/iteration-007.md
- research/research.md

## Assessment

- New information ratio: 0.00
- Questions addressed:
  - Which upgrade proposals have the highest leverage and clearest evidence?
  - What friction do users or agents encounter when routing, loading, applying, or verifying these skills?
  - Where do `code-implement`, `code-quality`, `code-debug`, and `code-verify` overlap or contradict each other?
- Questions answered:
  - Legal convergence is reached for ranking: the top five proposals are stable across the last three passes and no new source class changed the order.
  - Remaining uncertainty is implementation detail, not research direction: exact patch shape and validation commands should be handled after this research run, not by this leaf agent.

## Reflection

- What worked and why: Switching from source expansion to synthesis exposed stability in the proposal ordering and prevented low-yield rereads from extending the loop.
- What did not work and why: Reducer-owned strategy/dashboard files were not refreshed by this leaf iteration; that is expected by the agent boundary, but means external reducer sync is still needed for dashboards.
- What I would do differently: In a future loop, add a reducer-supported resource-map artifact earlier so the leaf does not need to report resource-map absence as a limitation.

## Recommended Next Focus

Stop research and hand the final ranked proposal set to the reducer/orchestrator for dashboard/resource-map refresh and, if approved, a separate implementation-planning workflow. Do not edit target `sk-code` skill files from the research loop.
