# Iteration 001

## Focus

Independently reproduce phase 003's two renamed runtime-reference paths and zero-match `behavior_benchmark/` glob, then resolve the packet-033 renumber dependency with commit and path evidence over the actual `0ce43ff589..HEAD` range.

## Actions Taken

1. Read the phase-003 plan/spec references and tested the named underscored benchmark glob against the current tree.
2. Inspected commit `cc77a1e550a8dcd45c3b287ac604138987aea94e` with rename detection and checked the current kebab-case destinations.
3. Inspected `0ce43ff589..HEAD` history for packet 033 and its archived successor, including commit `7f3216fc502420cb8aade4bbb639f9efe78b1ada`.
4. Read the archived framework packet and the current shared benchmark contract to distinguish historical packet provenance from executable authority.
5. Checked phase 016's actual dependency language to determine whether it directly names packet 033 or consumes phase 003's protected baseline.

## Findings

### F-001: Both phase-003 runtime-reference seed paths are stale

Phase 003 still starts its census from `runtime/references/state_format.md` and `integration_points.md`. [SOURCE: .opencode/specs/system-deep-loop/036-deep-loop-innovation/003-baseline-taxonomy-and-state-census/plan.md:81-82] Commit `cc77a1e550a8dcd45c3b287ac604138987aea94e` renamed those files to `state-format.md` and `integration-points.md` with R097 and R085 similarity respectively. [COMMAND OUTPUT: `git show --format=fuller --find-renames --name-status cc77a1e550a`] The destinations exist and describe the runtime state and consumer surfaces. [SOURCE: .opencode/skills/system-deep-loop/runtime/references/state-format.md:15-29] [SOURCE: .opencode/skills/system-deep-loop/runtime/references/integration-points.md:14-29]

This is first-order path drift. Phase 003's census premise remains valid, but its plan needs refinement to use:

- `.opencode/skills/system-deep-loop/runtime/references/state-format.md`
- `.opencode/skills/system-deep-loop/runtime/references/integration-points.md`

### F-002: The required `behavior_benchmark/` positive control independently reproduces

Phase 003 names `.opencode/skills/system-deep-loop/*/behavior_benchmark/` in both its specification and plan. [SOURCE: .opencode/specs/system-deep-loop/036-deep-loop-innovation/003-baseline-taxonomy-and-state-census/spec.md:93] [SOURCE: .opencode/specs/system-deep-loop/036-deep-loop-innovation/003-baseline-taxonomy-and-state-census/plan.md:153] A current-tree glob for `**/behavior_benchmark/**` returned no files. [COMMAND OUTPUT: Glob `.opencode/skills/system-deep-loop/**/behavior_benchmark/**` -> `No files found`] Commit `cc77a1e550a8dcd45c3b287ac604138987aea94e` renamed each package directory and benchmark index from underscore to kebab case, including deep-research RSB paths. [COMMAND OUTPUT: `git show --find-renames --name-status cc77a1e550a`, entries 1983-1989, 2094-2122, 2353-2359, 2532-2541, 2676-2685]

The replacement glob `.opencode/skills/system-deep-loop/*/behavior-benchmark/` resolves active packages, and the shared runner/framework resolves under `.opencode/skills/system-deep-loop/shared/behavior-benchmark/`. The framework identifies the five active packages. [SOURCE: .opencode/skills/system-deep-loop/shared/behavior-benchmark/framework.md:18-27] This is first-order glob drift, not evidence that the behavior-baseline premise disappeared.

### F-003: Packet 033 survives as archived packet 027, but the old identifier/path is stale

Commit `7f3216fc502420cb8aade4bbb639f9efe78b1ada`, which is in `0ce43ff589..HEAD`, moved `.opencode/specs/system-deep-loop/033-deep-loop-behavior-benchmarks/` to `.opencode/specs/system-deep-loop/z_archive/027-deep-loop-behavior-benchmarks/`. Rename detection reports R098-R100 for representative framework, scenario, result, and scorecard files. [COMMAND OUTPUT: `git show --find-renames --name-status 7f3216fc502420cb8aade4bbb639f9efe78b1ada -- .opencode/specs/system-deep-loop`, lines 5893-5992] The archived root still records all five completed phases and their benchmark packages/results. [SOURCE: .opencode/specs/system-deep-loop/z_archive/027-deep-loop-behavior-benchmarks/spec.md:71-77]

Therefore the dependency survives semantically and evidentially, but references to "packet 033" and its former path are stale. The exact historical provenance location is `.opencode/specs/system-deep-loop/z_archive/027-deep-loop-behavior-benchmarks/`.

### F-004: Phases 003 and 016 should consume active benchmark surfaces, not execute from the archive

The archived framework established one shared runner/framework and per-mode packages. [SOURCE: .opencode/specs/system-deep-loop/z_archive/027-deep-loop-behavior-benchmarks/001-framework-and-harness/spec.md:56-75] Its implementation records the runner contract, while current executable authority has moved with the skill parent to `.opencode/skills/system-deep-loop/shared/behavior-benchmark/`. [SOURCE: .opencode/specs/system-deep-loop/z_archive/027-deep-loop-behavior-benchmarks/001-framework-and-harness/plan.md:62-81] [SOURCE: .opencode/skills/system-deep-loop/shared/behavior-benchmark/framework.md:18-27]

Phase 003 should baseline the active packages at `.opencode/skills/system-deep-loop/*/behavior-benchmark/` through `.opencode/skills/system-deep-loop/shared/behavior-benchmark/behavior-bench-run.cjs`, citing archived packet 027 only for provenance and prior result corpora. Phase 016 does not directly name packet 033; it consumes phase 003's protected baseline through phase 008's parity harness. [SOURCE: .opencode/specs/system-deep-loop/036-deep-loop-innovation/016-whole-system-gate/spec.md:88-92] [SOURCE: .opencode/specs/system-deep-loop/036-deep-loop-innovation/016-whole-system-gate/spec.md:151-164]

## Questions Answered

- Phase 003's two runtime-reference positive controls are confirmed stale due to commit `cc77a1e550a8dcd45c3b287ac604138987aea94e`; both have direct kebab-case replacements.
- Phase 003's `behavior_benchmark/` glob independently returns zero matches; `behavior-benchmark/` is the live replacement.
- The packet-033 dependency survives its post-baseline renumber at commit `7f3216fc502420cb8aade4bbb639f9efe78b1ada`, but packet-number/path references require refinement to archived packet 027 plus the active shared/package surfaces.
- Phase 003's provisional verdict for this focus is `needs refinement`, not `invalidated`.

## Questions Remaining

- Which additional paths, globs, symbols, and dependencies in phases 004-017 no longer resolve?
- Which phase premises changed because mode counts, routing defaults, taxonomy, or capabilities changed or shipped?
- What is the explicit final verdict for every phase 004-017?
- Which phase can serve as a genuinely clean negative control?

## Ruled Out/Dead Ends

- Ruled out: treating `z_archive/027-deep-loop-behavior-benchmarks` as a deleted dependency. The packet and result corpus remain present after a high-similarity rename.
- Ruled out: rebasing phase 016 directly onto an archived runner. Phase 016 consumes the phase-003 protected baseline; the active runner/framework lives under the current skill parent.
- Dead end: broad filename glob `**/*033*` mostly found iteration-number artifacts and did not identify packet lineage; commit-scoped rename inspection resolved the dependency.

## Sources Consulted

- `.opencode/specs/system-deep-loop/036-deep-loop-innovation/003-baseline-taxonomy-and-state-census/{spec.md,plan.md}`
- `.opencode/specs/system-deep-loop/036-deep-loop-innovation/016-whole-system-gate/{spec.md,plan.md,checklist.md,tasks.md}`
- `.opencode/skills/system-deep-loop/runtime/references/{state-format.md,integration-points.md}`
- `.opencode/skills/system-deep-loop/shared/behavior-benchmark/framework.md`
- `.opencode/specs/system-deep-loop/z_archive/027-deep-loop-behavior-benchmarks/spec.md`
- `.opencode/specs/system-deep-loop/z_archive/027-deep-loop-behavior-benchmarks/001-framework-and-harness/{spec.md,plan.md,decision-record.md}`
- Git range `0ce43ff589..739b85ac57907bad2defb941d91098222ec4e6fd`, especially `cc77a1e550a8dcd45c3b287ac604138987aea94e` and `7f3216fc502420cb8aade4bbb639f9efe78b1ada`

## Assessment

New information ratio: `0.90`. The iteration independently confirmed all three required positive controls, separated first-order naming drift from premise validity, and resolved the packet-033 dependency into historical and executable locations. Phase 003 is not implementation-ready as written, but its intended baseline/census remains valid after path refinement.

## Reflection

Commit-scoped rename evidence was decisive and prevented a false "dependency deleted" conclusion. Current-tree globbing alone established breakage but could not distinguish deliberate migration from loss; pairing it with rename similarity and current contract reads supplied that distinction.

## Recommended Next Focus

Resolve phase 013's registered-mode-count premise against commits `6cd8ab14e4e`, `708d25acf04`, and `908efde8d8f`, then trace any resulting taxonomy drift into phases 004-015.
