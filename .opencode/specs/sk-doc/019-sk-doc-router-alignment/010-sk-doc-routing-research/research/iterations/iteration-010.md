# Iteration 10: Terminal consistency and implementability audit

## Focus

Audit the complete registry and iterations 1-9 without reopening settled directions. Confirm exact command coverage for every proposed guard, reconcile owner/file/acceptance claims, resolve the SD-016/SD-020 attribution tension and the iteration-6/iteration-9 mutation-surface tension, and identify anything an implementer would otherwise have to research.

## Actions Taken

1. Read the full findings registry, reducer-owned strategy, and all nine prior iteration narratives; then re-read iterations 4, 6, 7, 8, and 9 at the disputed boundaries.
2. Rechecked the live parent-hub and skill-benchmark test surfaces, including the parent-skill checker command and the deep-improvement Vitest entrypoint.
3. Audited every guard in iteration 9 against one authoritative owner, one concrete file target, one focused command, and one aggregate regression command.
4. Reconciled cross-iteration claims by distinguishing historical diagnosis, prospective fixture attribution, the current-sk-doc executable minimum, and future-hub authoring doctrine.

## Findings

### 1. The owner/file/acceptance matrix is complete after naming three test files and six commands

The shared implementation targets are concrete:

- .opencode/skills/sk-doc/create-skill/scripts/lib/leaf-resource-contract.cjs owns normalization, composite identity, containment, canonical ordering/bytes, digests, aliases, collisions, and reachability.
- .opencode/skills/sk-doc/create-skill/scripts/generate-leaf-manifest.cjs owns only the write/check CLI around that library.
- .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/validate-playbook-topology.cjs owns fixture schema, manifest resolution, selected-map joins, and topology snapshot creation.
- Existing callers retain policy: parent-skill-check.cjs enforces hub validity; router-replay.cjs assembles the selected typed union; run-skill-benchmark.cjs protects the immutable snapshot; score-skill-benchmark.cjs and build-report.cjs separate and report invalid topology, contract errors, and genuine misses. [SOURCE: .opencode/specs/sk-doc/019-sk-doc-router-alignment/010-sk-doc-routing-research/research/iterations/iteration-009.md:15] [SOURCE: .opencode/specs/sk-doc/019-sk-doc-router-alignment/010-sk-doc-routing-research/research/iterations/iteration-009.md:24]

Three concrete test files remove the last implementer choice about test placement:

| Test layer | Concrete target | Exact focused command | Guards covered |
|---|---|---|---|
| Contract unit | .opencode/skills/sk-doc/create-skill/scripts/tests/leaf-resource-contract.test.cjs | node --test .opencode/skills/sk-doc/create-skill/scripts/tests/leaf-resource-contract.test.cjs | Typed syntax, separators, containment/symlink escape, collision rules, N-to-1 fan-out, many-to-one aliases, canonical bytes/digests, generator write/check drift |
| Parent integration | .opencode/commands/doctor/scripts/tests/parent-skill-check-leaf-manifest.test.cjs | node --test .opencode/commands/doctor/scripts/tests/parent-skill-check-leaf-manifest.test.cjs | Source validity, stale bytes, missing targets, composite collision, selected-map unknown/orphan leaves, ordered diagnostics |
| Benchmark integration and 19-row acceptance | .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/sk-doc-leaf-routing-contract.vitest.ts | npx vitest run --config .opencode/skills/system-deep-loop/deep-improvement/scripts/vitest.config.mjs .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/sk-doc-leaf-routing-contract.vitest.ts | Fixture classes, zero-dispatch invalid oracle, selected-map cap/order, topology mutation, contract-error versus miss, denominator exclusion, all 19 row groups, fresh D5=100 |

The implementation gates are:

1. node --check on every added or changed CJS implementation file.
2. node .opencode/skills/sk-doc/create-skill/scripts/generate-leaf-manifest.cjs --check .opencode/skills/sk-doc
3. PARENT_HUB_CHECK_STRICT=1 node .opencode/commands/doctor/scripts/parent-skill-check.cjs .opencode/skills/sk-doc
4. The three focused commands above.
5. npx vitest run --config .opencode/skills/system-deep-loop/deep-improvement/scripts/vitest.config.mjs --no-coverage
6. A fresh Mode-B run against all 19 sk-doc fixtures before claiming the historical 20/100 failure profile is repaired; tests prove contract behavior, while the live rerun proves model-facing behavior.

The existing documentation confirms parent-skill-check's invocation and the deep-improvement full-suite Vitest entrypoint. [SOURCE: .opencode/commands/doctor/scripts/README.md:98] [SOURCE: .opencode/commands/doctor/scripts/README.md:133] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/README.md:152]

### 2. Iteration 4 and iteration 8 do not contradict; they describe different time boundaries

Iteration 4 established that the retained historical report cannot cleanly attribute SD-016 and that SD-020's then-current gold names a virtual public leaf over a shared physical target. Iteration 8 defines the prospective rule that makes both cases attributable: before dispatch, a typed gold pair must resolve through an authored alias and current manifest; after dispatch, only a valid typed pair can become a routing miss. [SOURCE: .opencode/specs/sk-doc/019-sk-doc-router-alignment/010-sk-doc-routing-research/research/iterations/iteration-004.md:41] [SOURCE: .opencode/specs/sk-doc/019-sk-doc-router-alignment/010-sk-doc-routing-research/research/iterations/iteration-004.md:48] [SOURCE: .opencode/specs/sk-doc/019-sk-doc-router-alignment/010-sk-doc-routing-research/research/iterations/iteration-008.md:75]

Therefore:

- Do not retroactively relabel the historical SD-016 or SD-020 report rows.
- In the migrated corpus, SD-020 is topology-valid only when the create-changelog alias maps assets/changelog_template.md to the shared physical asset; otherwise preflight blocks it and no routing metric is emitted.
- SD-016's typed fixture plus captured topology digests makes a future zero-recall result attributable; the old report remains provenance-inconclusive.
- Iteration 9's six-row wrong-root group is a forward acceptance group, not a claim that all six historical causes were proven identical.

This preserves both the iteration-4 diagnosis and the iteration-8 fixture-gate taxonomy.

### 3. Iteration 9 supersedes iteration 6 for the executable minimum; iteration 6 still supplies the authoring-doctrine layer

Iteration 6 proposed a broad first draft: path-contract changes in hub-router.json, hub prose, both create-skill templates, and all eleven packet routers. Iteration 9 deliberately removed the parallel hub leaf map, kept the existing first-layer hub router, and bounded behavior changes to the nine packets implicated by failing rows. [SOURCE: .opencode/specs/sk-doc/019-sk-doc-router-alignment/010-sk-doc-routing-research/research/iterations/iteration-006.md:25] [SOURCE: .opencode/specs/sk-doc/019-sk-doc-router-alignment/010-sk-doc-routing-research/research/iterations/iteration-009.md:44]

The synthesis should express two ordered layers:

1. Executable current-sk-doc minimum: shared library and generator; mode-registry.json resourceContractVersion; authored leaf-aliases.json; generated leaf-manifest.json; parent checker; nine affected packet maps; topology validator; loader, replay, dispatch, runner, scorer, report changes; 19 typed fixtures; and the three tests above. Do not add a second-layer leaf map to hub-router.json. Do not touch create-benchmark or create-diff routing behavior.
2. Authoring-doctrine propagation before final closure: update create-skill/assets/skill/skill_smart_router.md, create-skill/assets/parent_skill/parent_skill_hub_router_template.json, and create-skill/references/parent_skill/parent_hub_router_schema.md so newly generated hubs distinguish hub load addresses from typed public leaf identities. These documentation/template changes prevent recurrence but are not dependencies of the current benchmark runtime.

This resolves the apparent file-set conflict without dropping Q2's template finding or expanding the runtime critical path.

### 4. The acceptance matrix is internally complete

All 19 rows remain accounted for exactly once: six forward wrong-root acceptances, six missing-leaf acceptances, five over-bundle acceptances, and two clean-row regression fences. Cross-cutting rows add invalid-oracle exclusion, deterministic generation, immutable topology, and a fresh structural D5=100. The counts sum to 19, and D5 stays an unchanged structural owner rather than gaining copied manifest semantics. [SOURCE: .opencode/specs/sk-doc/019-sk-doc-router-alignment/010-sk-doc-routing-research/research/iterations/iteration-009.md:73]

Every proposed fix reaches an acceptance:

| Fix | Acceptance |
|---|---|
| Typed composite identity and legacy dual-read/single-write | Six wrong-root rows emit canonical pairs; ambiguous/undeclared observations become routing_contract_error |
| Manifest and aliases | Six missing-leaf rows resolve selected, existing pairs; missing alias/target blocks before dispatch |
| Selected-map ownership and cap | Five over-bundle rows emit exactly the stable selected-map union with zero unexpected pairs |
| Preflight and immutable digests | Synthetic invalid/stale rows dispatch zero times; topology mutation aborts without a score |
| Scorer/report taxonomy | Invalid rows are excluded; contract errors and routing misses are disjoint and separately counted |
| Migration safety | SD-008 and SD-012 preserve their first-failing-stage and score envelopes |
| Structural regression | Fresh D5 is exactly 100 and the gate remains open |
| Reproducibility | Registry/filesystem permutations produce identical manifest bytes and digest |

### 5. No implementer research remains; four choices must be treated as frozen contract names

To avoid reopening implementation questions, synthesis should freeze these names from the later iterations: resourceContractVersion, leaf-aliases.json, leaf-manifest.json, and validate-playbook-topology.cjs. Their spelling is not architecturally load-bearing, but leaving them open would force unnecessary research. The manifest generator consumes registry projection, sorted packet inventories, and authored aliases; callers import the shared library rather than reimplementing normalization. [SOURCE: .opencode/specs/sk-doc/019-sk-doc-router-alignment/010-sk-doc-routing-research/research/iterations/iteration-008.md:20] [SOURCE: .opencode/specs/sk-doc/019-sk-doc-router-alignment/010-sk-doc-routing-research/research/iterations/iteration-009.md:15]

One operator action remains after implementation, not research: run the 19-scenario live benchmark and record the fresh report/config/topology digests. A green deterministic suite alone cannot prove that the model-facing Mode-B result improved.

## Questions Answered

- Exact command coverage now exists for every guard and for the aggregate regression surface.
- The owner/file/acceptance matrix is complete once the three concrete test targets are fixed.
- SD-016/SD-020 historical uncertainty is preserved while the prospective fixture gate makes future runs attributable.
- Iteration 9's executable minimum supersedes iteration 6's broad runtime proposal; template/schema propagation remains a separate required doctrine layer.
- The shared normalization recommendation names concrete library, generator, and topology-validator targets.
- No implementation question requires new research.

## Questions Remaining

None. The only remaining activity is workflow-owned synthesis, followed by a separately authorized implementation packet and a fresh live 19-scenario verification run.

## Assessment

- New information ratio: 0.24.
- Novelty justification: this pass adds exact executable verification commands and resolves the historical-attribution and mutation-surface tensions without changing the settled typed-pair design.
- Status: complete for terminal audit.
- Confidence: high for owner, file, command, and acceptance coverage; medium-high for the prospective test filenames because they are frozen here as implementation contract names rather than discovered existing files.

## Validation

The three iteration artifacts were schema-checked after writing: required headings are present, the state log's final record is the canonical iteration-10 record, the delta begins with the same parsed iteration object, all JSONL lines parse, graph event vocabularies and endpoints are valid, and no trailing whitespace was introduced.

## SCOPE VIOLATIONS

- Production code, router metadata, templates, packet routers, benchmark fixtures, tests, reports, and reducer-owned files are outside this iteration's write fence. No such file was modified.
- The stale spec-kit distribution warning and previously reported packet strict-validation failures are outside the three allowed paths; this research pass did not rebuild or repair them.

## Next Focus

Workflow-owned synthesis: carry forward the two-layer file plan, exact command matrix, prospective attribution rules, and 19-row acceptance matrix. Do not reopen namespace, alias-gap, bundle-cap, or manifest-ownership decisions.

