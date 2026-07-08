# Iteration 2: Bidirectional Path-Coupling Repair

## Focus

Stress-test the Class A and Class B path-repair rules against live source files and tests after the planned move from two top-level skill folders to `system-deep-loop/runtime/`.

## Findings

1. **The Class A rule is directionally correct for runtime code that reaches into workflow content: keep the hop-count, delete the old sibling segment, and rename path literals to `system-deep-loop`.** Example: `render-command-contract.cjs` currently lives under `deep-loop-runtime/scripts/` and reaches `../../deep-loop-workflows/shared/...`; after nesting under `system-deep-loop/runtime/scripts/`, `../../shared/...` is the correct shape. [SOURCE: file:.opencode/skills/deep-loop-runtime/scripts/render-command-contract.cjs:8] [SOURCE: file:.opencode/specs/system-deep-loop/052-deep-loop-unification/002-hub-rename-and-runtime-nesting/plan.md:68]
2. **The compile-contract path repair is more than a simple string rename.** `compile-command-contracts.cjs` derives `WORKSPACE_ROOT` using four `..` segments from `deep-loop-runtime/scripts/`, but after move it needs five from `system-deep-loop/runtime/scripts/`. The child 002 plan correctly calls out this special case. [SOURCE: file:.opencode/skills/deep-loop-runtime/scripts/compile-command-contracts.cjs:8] [SOURCE: file:.opencode/specs/system-deep-loop/052-deep-loop-unification/002-hub-rename-and-runtime-nesting/plan.md:72]
3. **The Class B reverse-coupling rule is also directionally correct: workflow scripts should lose one `..` and target `runtime/`.** Current deep-research reducers import `../../../deep-loop-runtime/...`; after `deep-research/scripts/` sits under `system-deep-loop/`, `../../runtime/...` is the correct relative target. The same applies to deep-review and council script imports. [SOURCE: file:.opencode/skills/deep-loop-workflows/deep-research/scripts/reduce-state.cjs:14] [SOURCE: file:.opencode/skills/deep-loop-workflows/deep-review/scripts/reduce-state.cjs:13] [SOURCE: file:.opencode/skills/deep-loop-workflows/deep-ai-council/scripts/orchestrate-topic.cjs:14]
4. **Correction: `deep-ai-council/scripts/replay-graph-from-artifacts.cjs` is an internal executable path-coupling site and should be owned by phase 002, not deferred to broad external reference migration.** It hardcodes both usage text and runtime script discovery against `.opencode/skills/deep-loop-runtime/scripts/upsert.cjs`. If 002 moves folders and 003 is not yet complete, this internal council graph replay path breaks unless phase 002 updates it or leaves a temporary compatibility symlink. [SOURCE: file:.opencode/skills/deep-loop-workflows/deep-ai-council/scripts/replay-graph-from-artifacts.cjs:21] [SOURCE: file:.opencode/skills/deep-loop-workflows/deep-ai-council/scripts/replay-graph-from-artifacts.cjs:51]
5. **Correction: the runtime test inventory is broader than the child 002 plan's short "7 files" phrase.** A live `rg -l "deep-loop-workflows" .opencode/skills/deep-loop-runtime/tests/unit` returned 10 unit-test files, including `prompt-pack.vitest.ts`, `runtime-capabilities.vitest.ts`, `host-driven-improvement.vitest.ts`, `lifecycle-taxonomy.vitest.ts`, and `meta-loop-lane-d-packaging.vitest.ts`. Some hits are fixture strings rather than executable imports, but the migration checklist should inventory all ten and classify each as code path, fixture expectation, or historical prose. [SOURCE: command:rg -l "deep-loop-workflows" ".opencode/skills/deep-loop-runtime/tests/unit"] [SOURCE: file:.opencode/skills/deep-loop-runtime/tests/unit/runtime-capabilities-matrix-conformance.vitest.ts:25] [SOURCE: file:.opencode/skills/deep-loop-runtime/tests/unit/host-driven-improvement.vitest.ts:13]
6. **The child 002 plan should explicitly include deep-review shims in the Class B table.** It mentions research and council examples, but deep-review has the same reverse-coupling shape in `reduce-state.cjs` and `runtime-capabilities.cjs`; leaving these implicit raises review risk. [SOURCE: file:.opencode/skills/deep-loop-workflows/deep-review/scripts/reduce-state.cjs:14] [SOURCE: file:.opencode/skills/deep-loop-workflows/deep-review/scripts/runtime-capabilities.cjs:18]

## Sources Consulted

- `.opencode/skills/deep-loop-runtime/scripts/render-command-contract.cjs`
- `.opencode/skills/deep-loop-runtime/scripts/compile-command-contracts.cjs`
- `.opencode/skills/deep-loop-runtime/scripts/check-contract-drift.cjs`
- `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs`
- `.opencode/skills/deep-loop-workflows/deep-research/scripts/reduce-state.cjs`
- `.opencode/skills/deep-loop-workflows/deep-review/scripts/reduce-state.cjs`
- `.opencode/skills/deep-loop-workflows/deep-ai-council/scripts/orchestrate-topic.cjs`
- `.opencode/skills/deep-loop-workflows/deep-ai-council/scripts/replay-graph-from-artifacts.cjs`
- `rg -l "deep-loop-workflows" .opencode/skills/deep-loop-runtime/tests/unit`

## Assessment

- `newInfoRatio`: 0.85
- Novelty justification: The main rules were expected, but this pass found a concrete missing internal executable path and a broader runtime-test inventory.
- Confidence: High on path-direction math; high that `replay-graph-from-artifacts.cjs` needs earlier ownership; medium on exact file count because some grep hits are fixture/prose rather than live imports.

## Reflection

- Worked: Reading paired source files exposed the directional asymmetry and identified an unlisted internal path-coupling file.
- Failed: A simple grep overstates live repair needs because it includes fixture text and historical wording.
- Ruled out: A blind find/replace across all hits; the migration must classify executable imports, fixture expectations, and prose/history separately.

## Recommended Next Focus

Validate the `system-spec-kit` tooling-borrow repair and check whether the four planned files are complete.
