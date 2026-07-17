# Iteration 8: Generated-manifest reproducibility and fixture attribution

## Focus

Pressure-test the proposed generated leaf manifest at the exact boundaries left open after iteration 7: deterministic generation, authored alias ownership, orphan classification, selected-map reachability, drift triggers, and the pre-dispatch distinction between an invalid topology fixture and a genuine routing miss.

## Actions Taken

1. Re-read the canonical state, reducer-owned strategy, iteration 7, and the deep-research iteration contract; kept the settled `(workflowMode, leafResourceId)` namespace and did not repeat the saturated alias-gap investigation.
2. Traced the existing two-layer replay boundary from `loadSurfaceRouter` through `assembleResources` and the benchmark's load-dispatch-score sequence.
3. Enumerated registered sk-doc modes and their packet-local Markdown inventories, confirming that generation must fan out the shared `create-skill` packet once per public mode.
4. Joined current playbook gold to packet/shared topology, then specified deterministic manifest, drift, reachability, and fixture-attribution contracts.

## Findings

### 1. The manifest needs three inputs with different ownership

The generated `leaf-manifest.json` must not own alias declarations. Its mechanical packet inventory comes from `mode-registry.json` plus the registered packet files, while public aliases are semantic API choices that filesystem discovery cannot infer. The changelog gold `assets/changelog_template.md` resolves physically only under `shared/`, and the optimization gold has the same shape for `assets/llmstxt_templates.md`; iteration 7 also found no packet-local symlinks from which to infer those names. [SOURCE: file:.opencode/skills/sk-doc/manual_testing_playbook/agent_dispatch/markdown_agent_cli_opencode.md:9] [SOURCE: file:.opencode/skills/sk-doc/manual_testing_playbook/agent_dispatch/markdown_agent_cli_opencode.md:94] [SOURCE: file:.opencode/skills/sk-doc/manual_testing_playbook/intent_detection/optimization.md:8] [SOURCE: file:.opencode/specs/sk-doc/031-sk-doc-router-alignment/010-sk-doc-routing-research/research/iterations/iteration-007.md:29]

The ownership split should be:

- `mode-registry.json`: authored mode-to-packet identity and resource-contract version;
- an authored, machine-readable alias declaration source owned by the hub author (recommended as `leaf-aliases.json`, or an equivalently isolated block): typed public pair, physical hub-root target, and rationale/owner;
- `leaf-manifest.json`: generated output only, consuming registry, packet inventory, and alias declarations.

Putting aliases directly in the generated manifest would make regeneration erase human intent or make the generator preserve stale output as input. Putting them only in prose would prevent deterministic validation. A many-to-one physical target remains legal; duplicate public composite keys remain illegal.

### 2. Deterministic generation contract

The generator should implement the following byte-stable contract:

1. Validate the registry first, then iterate `modes[]` as public identities rather than deduplicating packet paths. Sort modes by the UTF-8/code-point order of normalized `workflowMode`.
2. For each mode, recursively enumerate regular Markdown files under only its packet's `references/` and `assets/`. Normalize separators to `/`; reject absolute paths, `.`/`..` segments, case-fold collisions, symlink escapes, and any leaf not beginning `references/` or `assets/`.
3. Emit one packet entry per `(workflowMode, leafResourceId)`. Thus `create-skill` and `create-skill-parent` each receive the same 18 packet-local leaves while remaining distinct public keys. The current registry deliberately maps both modes to `create-skill`. [SOURCE: file:.opencode/skills/sk-doc/mode-registry.json:18] [SOURCE: file:.opencode/skills/sk-doc/mode-registry.json:30] [SOURCE: file:.opencode/skills/sk-doc/create-skill/references/parent_skill/parent_skills_nested_packets.md:205]
4. Merge authored aliases after packet enumeration. Reject an alias that collides with a packet entry or another alias for the same composite key; require its physical target to exist beneath the hub root; allow multiple public pairs to share one target.
5. Sort final entries by `(workflowMode, leafResourceId, physicalPath)`. Sort every set-like nested array and object key. Do not serialize timestamps, mtimes, absolute paths, directory-enumeration order, locale-sensitive order, or host-specific separators.
6. Serialize UTF-8 JSON with two-space indentation, LF endings, and one trailing newline. Include `schemaVersion`, `resourceContractVersion`, and a SHA-256 `sourceDigest` over canonical registry projection + sorted discovered path list + canonical alias declarations. File contents are not topology inputs, so their bytes and mtimes do not belong in this digest.

The generator needs two modes: `--write` produces exactly those bytes; `--check` regenerates in memory and byte-compares with the committed artifact, reporting added, removed, and changed composite entries. `--check` must never repair drift silently.

### 3. Drift and orphan checks are separate, ordered guards

One catch-all "manifest mismatch" would hide the action needed. The guard should report these classes in order:

| Guard code | Condition | Result |
|---|---|---|
| `manifest_source_invalid` | Registry, alias declarations, path namespace, or symlink containment is invalid | Block generation and benchmark dispatch. |
| `manifest_stale` | In-memory generated bytes differ from committed manifest | Block; print entry-level diff and regeneration command. |
| `manifest_target_missing` | A committed/generated entry resolves to no current physical file | Block as topology drift. |
| `manifest_composite_collision` | Two sources claim one `(workflowMode, leafResourceId)` | Block as ambiguous public identity. |
| `selection_unknown_leaf` | An authored selected map/default references a pair absent from the manifest | Block as router-topology drift. |
| `selection_orphan_leaf` | A manifest pair is unreachable from every selected map, default, or explicit full-inventory map | Block by default; permit only a named authored exclusion with owner and reason. |

The last check must be bidirectional. `selected maps ⊆ manifest` prevents dead router references; `manifest ⊆ selected maps ∪ defaults ∪ full-inventory ∪ exclusions` prevents generated inventory from being mistaken for routed reachability. Directory placeholders fail because they are not manifest leaves. The proposed full-inventory intent remains legal, but it must enumerate the exact manifest pairs it exposes and is selected only by an explicit prompt; discovery itself never expands the runtime bundle. This preserves the selected-map-union cap established in iteration 6. [SOURCE: file:.opencode/specs/sk-doc/031-sk-doc-router-alignment/010-sk-doc-routing-research/research/iterations/iteration-006.md:52] [SOURCE: file:.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:427]

Generation-time validation alone is insufficient because later packet, registry, alias, router-map, or fixture edits can stale the committed projection. Run `--check` in the parent-hub validation/CI gate and again at benchmark pre-dispatch. A path-filtered pre-commit hook is acceptable for speed, but CI should run it unconditionally for every resource-bearing hub; the inventory is small enough that correctness wins over trigger cleverness. Explicit generation remains the only write path.

### 4. Selected-map reachability must carry mode ownership

The retained second-layer replay parses `INTENT_SIGNALS`, `RESOURCE_MAP`, and `DEFAULT_RESOURCE`, unions the selected entries, and currently checks existence against a bag of hub/shared/packet roots. It does not retain which registered mode owns a leaf, so identical packet-local names can resolve against the wrong packet and legacy uppercase fixture intents such as `CHANGELOG` cannot be joined to a public workflow mode without another declaration. [SOURCE: file:.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:396] [SOURCE: file:.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:418] [SOURCE: file:.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:435] [SOURCE: file:.opencode/skills/sk-doc/manual_testing_playbook/agent_dispatch/markdown_agent_cli_opencode.md:7]

Each second-layer intent therefore needs an explicit owning `workflowMode` (or the maps must be nested under workflow mode). Validation resolves every map value as the typed pair `(ownerWorkflowMode, leafResourceId)`. For an ordered two-mode bundle, the allowed output is the stable union of the two selected typed maps; deduplication is by composite pair, never by leaf string or physical target. The router output must preserve selected-map order first and lexical leaf order second so replay and live output remain reproducible.

### 5. The pre-dispatch gate must validate the oracle before measuring the router

The current loader extracts `expected_resources` as unchecked strings, and `runPlaybook` dispatches each loaded scenario before `scoreScenario`; D5 runs earlier but has no fixture-to-leaf join. [SOURCE: file:.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/load-playbook-scenarios.cjs:295] [SOURCE: file:.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/load-playbook-scenarios.cjs:321] [SOURCE: file:.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs:137] [SOURCE: file:.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs:141] [SOURCE: file:.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs:162]

The gate should classify failures before any dispatch:

| Phase | Classification | Example | Scoring treatment |
|---|---|---|---|
| Fixture parse | `fixture_schema_error` | Missing workflow-mode/leaf identity or conflicting typed and legacy forms | Corpus invalid; no dispatch, no score. |
| Manifest resolution | `fixture_topology_error` | Unknown/ambiguous pair, missing alias declaration, missing physical target, stale manifest digest | Corpus invalid; no dispatch, no score. |
| Selected-map join | `fixture_selection_error` | Gold pair exists in manifest but is not reachable from the fixture's declared second-layer intent/map | Corpus/router contract drift; no dispatch, no score. |
| Post-dispatch normalization | `routing_contract_error` | Observed output is ambiguous, undeclared, or outside the selected-map union | Score as router failure with a distinct contract flag. |
| Expected-vs-observed set join | `routing_miss` | Valid expected pair is absent from otherwise valid observed pairs | Score recall/precision normally. |

This taxonomy keeps `SD-020` attributable. If `(create-changelog, assets/changelog_template.md)` has a declared alias to the real shared asset, the fixture is topology-valid and an absent observation is a routing miss. Without that declaration, the oracle is invalid and the run must stop before dispatch; assigning zero recall would falsely blame routing. [SOURCE: file:.opencode/specs/sk-doc/031-sk-doc-router-alignment/010-sk-doc-routing-research/research/iterations/iteration-004.md:41] [SOURCE: file:.opencode/specs/sk-doc/031-sk-doc-router-alignment/010-sk-doc-routing-research/research/iterations/iteration-005.md:48]

The validator must snapshot `fixtureSourceHash`, `registryDigest`, `routerDigest`, `aliasDigest`, and `manifestDigest`. The scorer must receive those exact digests and abort with `topology_changed_during_run` if current values differ. Reports count fixture/topology failures separately from routed rows and must never include them in recall, precision, waste, or aggregate denominators.

### 6. Implementable guard specification

The minimum implementation sequence for this hardening is:

1. Add the authored alias-declaration input and deterministic generator with `--write`/`--check`.
2. Extend the parent-hub check to run manifest source validation, byte drift, target/collision, then bidirectional selected-map reachability.
3. Make the second-layer map declare workflow-mode ownership and return typed pairs in deterministic selected-map order.
4. Add pre-dispatch fixture validation and immutable topology digests; block invalid corpus rows before `dispatchScenario`.
5. Preserve post-dispatch contract errors separately from genuine expected-set misses, then add both classes to reports/tests.

Required fixtures: registry-order permutation produces identical bytes; filesystem enumeration permutation produces identical bytes; N-to-1 mode fan-out; duplicate leaf names across modes; legal many-to-one aliases; alias collision; missing alias target; added/deleted packet leaf drift; selected-map unknown leaf; unselected manifest orphan; explicit full-inventory coverage; `SD-020` with and without its alias; valid topology plus missing observation; topology mutation between validation and scoring.

## Questions Answered

- Manifest generation is reproducible only when registry modes, discovered paths, aliases, and output bytes have explicit canonical ordering and no volatile fields.
- Alias declarations are authored inputs owned by the hub, not preserved fields inside the generated output.
- Orphan validation is bidirectional and distinguishes stale topology, dead selected-map references, and unselected public leaves.
- The pre-dispatch gate separates invalid fixture topology from routing misses by validating and hashing the oracle before dispatch, then scoring only canonical observed-vs-expected pairs.
- Drift checks belong both in the commit/CI validation path and benchmark pre-dispatch; generation-time-only validation is not sufficient.

## Questions Remaining

No key question was reopened. Iterations 9-10 should perform final implementability review: minimize the mutation surface, verify every proposed guard has one authoritative implementation rather than copied logic, and produce the final acceptance matrix.

## Sources Consulted

- `sk-doc/mode-registry.json`, `hub-router.json`, packet resource trees, and current playbook fixtures.
- `router-replay.cjs`, `load-playbook-scenarios.cjs`, and `run-skill-benchmark.cjs` at their load, assembly, dispatch, and scoring boundaries.
- Iterations 4-7 and the parent-hub schema/naming doctrine.

## Assessment

- New information ratio: **0.58**.
- Novelty justification: this pass resolves generated-versus-authored ownership, defines byte-level reproducibility, adds a bidirectional orphan model, and gives fixture/topology/routing failures disjoint scoring semantics.
- Status: **complete** for iteration 8 hardening.
- Confidence: high for ordering, ownership, reachability, and pre-dispatch attribution; medium-high for the recommended alias filename because the filename is an implementation choice, while separate authored ownership is load-bearing.

## Validation

- Iteration artifact validation passed: the narrative is non-empty with every required heading; the state log contains exactly one final `type: iteration` record for iteration 8; the delta's first record is byte-equivalent after parsing; all 28 delta lines parse; and all 16 graph events use valid vocabularies with no dangling endpoints.
- `git diff --check` passed for the three allowed artifacts.
- The broader packet strict validator failed with three packet-structure errors: two required Level-1 files are missing, level consistency fails, and section-count validation fails. Those packet docs are outside this iteration's allowed write paths, so the iteration did not repair them. [SOURCE: command:`bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/sk-doc/031-sk-doc-router-alignment/010-sk-doc-routing-research --strict`]

## Reflection

What worked: joining fixture gold to typed topology exposed that existence against an unordered bag of roots cannot establish mode ownership. What failed: treating uppercase legacy `expected_intent` values as registry aliases; current fixtures use second-layer intent names, so the new map must declare their owning workflow mode.

Ruled out: generated output as alias source-of-truth; locale/filesystem-order serialization; generation-time-only drift protection; reverse lookup from physical path; scoring topology-invalid gold as zero recall; treating every manifest entry as runtime-selected without an authored map.

## SCOPE VIOLATIONS

- The alias source, generator, committed manifest, router-map ownership, parent guard, benchmark validator, runner, scorer, reports, and fixtures are all researched files outside this iteration's write fence. They remain findings only; none were implemented.
- Reducer-owned strategy, registry, dashboard, and synthesis files were not modified.
- The strict packet validator identified missing/inconsistent packet documentation outside the three-path write fence. Repair was not attempted.

## Next Focus

Perform a final implementability review of the complete fix list: consolidate shared normalization/generation logic, map each guard to one owner and one test layer, identify the smallest safe file set, and produce an acceptance matrix that preserves the two clean benchmark rows and current D5 baseline.
