# Iteration 003: Mode Taxonomy and Live-Tools Premise

## Focus

Resolve phase 013's registered-mode/workstream taxonomy and test whether phase 005's exact top-level live-web-search propagation capability already shipped. The inspection covers baseline `0ce43ff589`, current HEAD `e4b242c3940c26b47950534e1a149c7e037e71fd`, commits `6cd8ab14e4e7d757baf48fa67ec795ed5624514f`, `708d25acf04a240a5afbe7d43bf7b403549f4b85`, and `908efde8d8f4316d89b9929743d32e2ed1848258`, the current registries/default routing, and current `fanout-run.cjs` behavior.

## Actions Taken

1. Compared `mode-registry.json` at baseline `0ce43ff589` with current HEAD and classified public modes separately from runtime loop types, implementation workflow families, improvement variants, and phase 013's migration workstreams.
2. Inspected the three named routing commits and verified their current effects in `hub-router.json`, `mode-registry.json`, and the hub contract.
3. Traced phase 005's exact acceptance contract through current executor configuration, fan-out expansion, command construction, tests, and post-baseline fan-out history.
4. Inspected HEAD commit `e4b242c3940c26b47950534e1a149c7e037e71fd` to distinguish useful `cli-opencode` runtime enablement from the requested `cli-codex` top-level web-search propagation.

## Findings

### F-010: Phase 013's eight items are workstreams, not eight public registered modes

At baseline `0ce43ff589`, `mode-registry.json` already contained the same seven public `workflowMode` entries that current HEAD exposes: `research`, `review`, `ai-council`, `agent-improvement`, `model-benchmark`, `skill-benchmark`, and `alignment`. Current registry entries and their distinct backend fields are explicit at `.opencode/skills/system-deep-loop/mode-registry.json:30-198`. The current discriminator also states that `workflowMode` is the public key, while `runtimeLoopType` is limited to `research|review|council` and is null for improvement-host modes. [SOURCE: commit `0ce43ff589`; .opencode/skills/system-deep-loop/mode-registry.json:6-22]

Phase 013 instead calls all eight child folders "modes" while listing `004-deep-improvement-common` beside seven public mode migrations. [SOURCE: commit `537ab78671cee7ad0233c950797c42a3d4e9e2a9`; .opencode/specs/system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/spec.md:46-54] Its map makes the actual decomposition visible: three standalone loop families, one shared improvement-common workstream, three improvement variants, and alignment. [SOURCE: commit `537ab78671cee7ad0233c950797c42a3d4e9e2a9`; .opencode/specs/system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/spec.md:60-71]

The required taxonomy is therefore:

- **Seven public registered workflow modes**: the seven `workflowMode` keys in `mode-registry.json`.
- **Five implementation workflow families/packets**: deep-research, deep-review, deep-ai-council, deep-improvement, and deep-alignment; the hub describes five active workflow families. [SOURCE: commit `0ce43ff589`; .opencode/skills/system-deep-loop/SKILL.md:12-20]
- **Three improvement variants/lanes**: agent-improvement, model-benchmark, and skill-benchmark, multiplexed onto the one deep-improvement packet; only the latter two are benchmark-named variants. [SOURCE: commit `0ce43ff589`; .opencode/skills/system-deep-loop/mode-registry.json:103-174]
- **Eight phase-013 migration workstreams**: the seven public modes plus the non-public `deep-improvement-common` shared-services workstream. [SOURCE: commit `537ab78671cee7ad0233c950797c42a3d4e9e2a9`; .opencode/specs/system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/spec.md:60-71]

This is a baseline taxonomy defect, not a post-baseline mode-count change. Phase 013's decomposition remains useful, but its "eight modes" premise is false and must be rewritten as eight workstreams serving seven public modes. Verdict: **needs refinement**, not invalidated.

### F-011: The named commits changed routing semantics, not the seven-mode inventory

Commit `6cd8ab14e4e7d757baf48fa67ec795ed5624514f` removed the shared `hub-identity` class from every mode and narrowed model/skill benchmark lexical routing to explicit command forms. The current router retains seven signal rows with the corrected classes and keywords. [SOURCE: commit `6cd8ab14e4e7d757baf48fa67ec795ed5624514f`; .opencode/skills/system-deep-loop/hub-router.json:15-50] This changed which prompts activate a mode, not how many modes are registered.

Commit `708d25acf04a240a5afbe7d43bf7b403549f4b85` added `resourceContractVersion` and a second-layer typed leaf-routing surface. Current `mode-registry.json` carries that contract version, while the hub contract keeps leaf selection separate from mode selection. [SOURCE: commit `708d25acf04a240a5afbe7d43bf7b403549f4b85`; .opencode/skills/system-deep-loop/mode-registry.json:1-5] [SOURCE: commit `708d25acf04a240a5afbe7d43bf7b403549f4b85`; .opencode/skills/system-deep-loop/SKILL.md:38-48] This added observed leaf-resource taxonomy, not an eighth public mode.

Commit `908efde8d8f4316d89b9929743d32e2ed1848258` changed the zero-signal default from `research` to `null` and replaced the README fallback with routing guidance plus the registry. Current `hub-router.json` preserves `defaultMode: null`, the seven-entry tie break, and the two-resource fallback. [SOURCE: commit `908efde8d8f4316d89b9929743d32e2ed1848258`; .opencode/skills/system-deep-loop/hub-router.json:4-13] Phase 013 must therefore preserve explicit mode routing and must not assume that a mode-less request defaults to research, but this is routing-default drift rather than mode-count drift.

### F-012: Phase 005's exact top-level live-web-search capability has not shipped

Phase 005 requires typed `liveTools.webSearch`, an exhaustive kind-by-policy matrix, per-kind adapters returning effective configuration and an invocation fingerprint, `cli-codex` argv beginning `--search`, `exec`, and a models-by-branches-by-replicas manifest. [SOURCE: commit `e4b242c3940c26b47950534e1a149c7e037e71fd`; .opencode/specs/system-deep-loop/036-deep-loop-innovation/005-fanout-live-tools-unblock/spec.md:60-65] Its acceptance criteria make top-level ordering and fail-before-spawn behavior mandatory. [SOURCE: commit `e4b242c3940c26b47950534e1a149c7e037e71fd`; .opencode/specs/system-deep-loop/036-deep-loop-innovation/005-fanout-live-tools-unblock/spec.md:77-103]

Current executor configuration has no `liveTools` or `webSearch` field: the schema ends with governor after model/config/effort/tier/sandbox/timeout, and kind-specific support lists only those existing fields. [SOURCE: commit `e4b242c3940c26b47950534e1a149c7e037e71fd`; .opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts:35-58] Current fan-out configuration accepts only `executors[]` plus pool controls, and `expandLineages` expands `count`; there is no mutually exclusive `models[] × branches[] × replicas` compiler. [SOURCE: commit `e4b242c3940c26b47950534e1a149c7e037e71fd`; .opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts:276-290] [SOURCE: commit `e4b242c3940c26b47950534e1a149c7e037e71fd`; .opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts:362-383]

Most decisively, current `buildLineageCommand` constructs `cli-codex` argv beginning with `exec` and returns only `{ command, args, input }`. [SOURCE: commit `e4b242c3940c26b47950534e1a149c7e037e71fd`; .opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:1382-1401] The current unit test pins that exact `exec`-first shape. [SOURCE: commit `e4b242c3940c26b47950534e1a149c7e037e71fd`; .opencode/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts:706-750] The exact planned capability is absent. Verdict: phase 005 is **still valid** and remains implementation work, not an already-shipped phase.

### F-013: Newer fan-out support is partial infrastructure, not phase 005 completion

Post-baseline commit `e4b242c3940c26b47950534e1a149c7e037e71fd` removed `--pure` from `cli-opencode` fan-out launches and reinjected child-session/spec-gate environment controls. Current code shows the enabled `cli-opencode` launch and its sandbox-sensitive bypass behavior. [SOURCE: commit `e4b242c3940c26b47950534e1a149c7e037e71fd`; .opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:1444-1479] This does improve live workflow/tool availability for `cli-opencode` lineages, but it does not propagate a caller-selected web-search policy, alter `cli-codex` to `--search exec`, add capability preflight, produce invocation fingerprints, or compile the new manifest form. It is supporting infrastructure only; treating it as phase 005 completion is ruled out.

## Questions Answered

- Phase 013 has seven public registered modes, five implementation workflow families, three improvement variants, and eight migration workstreams. Its eighth workstream is shared improvement infrastructure, not an eighth public mode.
- The public mode count was already seven at baseline `0ce43ff589`; the "eight modes" wording is a baseline taxonomy defect rather than post-baseline count drift.
- Commits `6cd8ab14e4e`, `708d25acf04`, and `908efde8d8f` changed activation, typed leaf-resource routing, and zero-signal default behavior respectively; none changed the registered-mode count.
- Phase 005's exact top-level web-search propagation capability has not shipped. HEAD's `cli-opencode` fan-out enablement is partial support, not the requested `cli-codex --search exec` contract.

## Questions Remaining

- What is the explicit evidence-backed verdict for every phase 003-010 after combining first-order and second-order findings?
- What is the explicit evidence-backed verdict for every phase 011-017, carrying phase 004 as the clean negative control?
- Which remaining phases besides 005 and 013 have second-order premise drift from shipped capabilities, routing semantics, or authority changes?

## Ruled Out/Dead Ends

- Ruled out counting `deep-improvement-common` as a public registered mode; it has no `workflowMode` registry entry and exists to serve three registered improvement lanes.
- Ruled out treating runtime loop types (`research`, `review`, `council`) as the public mode inventory; they are a separate convergence discriminator.
- Ruled out inferring a mode-count change from the typed leaf-routing work in `708d25acf04`; it adds resource-address telemetry without adding a mode.
- Ruled out treating `e4b242c3940c26b47950534e1a149c7e037e71fd` as phase 005 completion; it changes only the `cli-opencode` launch environment while the `cli-codex` adapter remains `exec`-first.

## Sources Consulted

- Baseline `0ce43ff589` and current HEAD `e4b242c3940c26b47950534e1a149c7e037e71fd`
- Commits `6cd8ab14e4e7d757baf48fa67ec795ed5624514f`, `708d25acf04a240a5afbe7d43bf7b403549f4b85`, `908efde8d8f4316d89b9929743d32e2ed1848258`, and `e4b242c3940c26b47950534e1a149c7e037e71fd`
- `.opencode/skills/system-deep-loop/{mode-registry.json,hub-router.json,SKILL.md}`
- `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts`
- `.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs`
- `.opencode/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts`
- Phase 005 and phase 013 specifications

## Assessment

`newInfoRatio: 0.64`. This iteration resolves the mode-count ambiguity without collapsing four distinct taxonomies, identifies the post-baseline routing changes that matter to migration assumptions, and establishes from current schema, argv, and tests that phase 005 remains unimplemented. It adds two explicit phase verdicts: phase 005 `still valid`; phase 013 `needs refinement`.

## Reflection

The registry-at-baseline comparison prevented route-surface changes from being misreported as mode-count drift. Reading the command builder and its pinned test together was decisive for phase 005: broader fan-out capability and live plugin access do not satisfy a specific top-level `--search exec` propagation contract.

## Recommended Next Focus

Build the explicit phase-by-phase verdict matrix for 003-017 from iterations 1-3, then target only the unresolved second-order premises needed to support each verdict.
