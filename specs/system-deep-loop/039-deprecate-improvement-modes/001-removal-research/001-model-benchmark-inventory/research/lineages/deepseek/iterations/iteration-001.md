# Iteration 1: Core hub registries, routers, and metadata

## Focus

Inventory every model-benchmark reference in the `system-deep-loop` hub root: `mode-registry.json`, `hub-router.json`, `ROUTER.md`, `SKILL.md`, `command-metadata.json`, `leaf-manifest.json`, `leaf-scopes.json`, `graph-metadata.json`, `description.json`, `ARCHITECTURE.md`. Classification vocabulary for the whole run: DELETE (exists only for this mode), EDIT (shared file, remove the mention), SHARED-WITH-AGENT-IMPROVEMENT (also used by the agent-improvement lane, must survive), KEEP-AS-HISTORY (changelog/archive).

## Actions Taken

- Master repo sweep: `rg -n -i -l -e "model[-_ ]?benchmark" --glob '!specs/**' --glob '!**/node_modules/**'` produced the working file list for all 10 iterations.
- Targeted `rg -n -C 2` over the ten hub files above; exact blocks then read with `sed -n`/`cat -n` for line-verified citations.
- Confirmed `.skilled/skills/system-deep-loop/routing-allowlist.json` does not exist at hub root (only `deep-improvement/routing-allowlist.json` does).

## Findings

1. `mode-registry.json` defines the full model-benchmark mode as its own object: `workflowMode` "model-benchmark", `runtimeLoopType` null, `backendKind` "improvement-host", `loopHostMode` "model-benchmark", `command` "/deep:model-benchmark", `agent` "deep-improvement", `artifactRoot` "improvement/", aliases and `advisorRouting.routingClass` "command-bridge". **DELETE** the block [SOURCE: .skilled/skills/system-deep-loop/mode-registry.json:129-151]
2. `hub-router.json` lists "model-benchmark" in the stage-1 `tieBreak` order, defines a `model-benchmark` intent (weight 4, classes `model-benchmark-aliases`, resource `deep-improvement/SKILL.md`), and a `model-benchmark-aliases` keyword class keyed on "/deep:model-benchmark". **DELETE** the intent + class blocks, **EDIT** the tieBreak array [SOURCE: .skilled/skills/system-deep-loop/hub-router.json:7,41-45,60-62]
3. `ROUTER.md` carries the mode in three places: the "model-benchmark leaves" intent-model prose, the `MODEL_BENCHMARK` entry in `INTENT_SIGNALS`, and the `MODEL_BENCHMARK` entry in `RESOURCE_MAP` pointing at `deep-improvement/references/model-benchmark/evaluator-contract.md` and `lane-b-mechanics.md` (both files exist). **EDIT** all three [SOURCE: .skilled/skills/system-deep-loop/ROUTER.md:46-50,76,100-103]
4. `SKILL.md` references the mode in the keywords comment, the mode table ("improvement (2 lanes)"), the Stage-2 leaf-intent paragraph, the three-tier `workflowMode` discriminator list, the UNKNOWN_FALLBACK_CHECKLIST, and the Improvement-lane summary. **EDIT** all six mention sites [SOURCE: .skilled/skills/system-deep-loop/SKILL.md:8,29,49,60,67,163]
5. `command-metadata.json` holds a dedicated `/deep:model-benchmark` command entry ("ownerMode": "model-benchmark", argument hint, owned signals, choreography loading hub SKILL.md + deep-improvement SKILL.md + `deep-model-benchmark-presentation.txt`). **DELETE** the whole entry; **EDIT** the sibling pointer at lines 176-178 inside the agent-improvement entry's `discriminator.preferSiblingWhen` [SOURCE: .skilled/skills/system-deep-loop/command-metadata.json:176-178,182-225]
6. `leaf-manifest.json` has a dedicated mode entry (leaves: `assets/model-benchmark/**`, `references/model-benchmark/**`, and the shared `references/shared/*` set; packet "deep-improvement"; workflowMode "model-benchmark"). **DELETE** the entry [SOURCE: .skilled/skills/system-deep-loop/leaf-manifest.json:58-110]
7. `leaf-scopes.json` has a dedicated entry mapping workflowMode "model-benchmark" to scopes `assets/model-benchmark`, `references/model-benchmark`, `references/shared`. **DELETE** the entry [SOURCE: .skilled/skills/system-deep-loop/leaf-scopes.json:10-17]
8. `graph-metadata.json` lists "model benchmark" under keywords and "model-benchmark" under `key_topics`. **EDIT** both arrays [SOURCE: .skilled/skills/system-deep-loop/graph-metadata.json:112,125]
9. `description.json` lists "model-benchmark" and "benchmark-harness" in its keyword array, and the description string names the two improvement lanes. **EDIT** the keyword array and reword the description [SOURCE: .skilled/skills/system-deep-loop/description.json:3,25-26]
10. `ARCHITECTURE.md` names the lanes in the packet tree comment ("Agent-improvement and model-benchmark lanes") and lists `model-benchmark-*` among per-mode ledgers. **EDIT** both sites [SOURCE: .skilled/skills/system-deep-loop/ARCHITECTURE.md:71,115]
11. The hub-root router/registry surfaces form one coherent deletion cluster: mode-registry block, hub-router intent+class, ROUTER.md signal+map, leaf-manifest entry, leaf-scopes entry, command-metadata entry. The remaining hub-root mentions are shared-file edits, never deletions [INFERENCE: based on findings 1-10]
12. Scope note: the workflow's late-INIT `spec.md` mutation and post-synthesis write-back live in the spec folder, outside this lineage's write surface; they are skipped this run and recorded under SCOPE VIOLATIONS [SOURCE: specs/system-deep-loop/039-deprecate-improvement-modes/001-removal-research/001-model-benchmark-inventory/research/lineages/deepseek/deep-research-config.json:8]

## Ruled Out

- Searching only `model-benchmark` as an exact string: misses "model benchmark" prose and `benchmark-harness` alias; used the `model[-_ ]?benchmark` alternation instead (recovered both).
- Assuming `routing-allowlist.json` exists at hub root: it does not; only the deep-improvement packet has one (iteration 3 scope).

## Dead Ends

- None yet. The master sweep file list is now the authoritative work partition.

## Edge Cases

- Ambiguous input: none; the dispatch named the surfaces to start from.
- Contradictory evidence: none in this iteration.
- Missing dependencies: hub-root `routing-allowlist.json` absent — not required for this iteration's scope.
- Partial success: none; all ten target files were read and classified.

## Sources Consulted

- .skilled/skills/system-deep-loop/mode-registry.json
- .skilled/skills/system-deep-loop/hub-router.json
- .skilled/skills/system-deep-loop/ROUTER.md
- .skilled/skills/system-deep-loop/SKILL.md
- .skilled/skills/system-deep-loop/command-metadata.json
- .skilled/skills/system-deep-loop/leaf-manifest.json
- .skilled/skills/system-deep-loop/leaf-scopes.json
- .skilled/skills/system-deep-loop/graph-metadata.json
- .skilled/skills/system-deep-loop/description.json
- .skilled/skills/system-deep-loop/ARCHITECTURE.md

## Assessment

- New information ratio: 1.0
- Questions addressed: KQ1 (hub registries and metadata)
- Questions answered: KQ1

## Reflection

- What worked and why: the master `rg -l` sweep gave the full repository file partition before drilling in, so each later iteration has a bounded, verifiable work list; line-verified `sed` reads kept every citation exact.
- What did not work and why: nothing material; the hub-root `routing-allowlist.json` assumption was wrong and cheaply corrected.
- What I would do differently: nothing for this surface; continue drilling per-iteration partitions.

## Recommended Next Focus

Iteration 2: `.skilled/commands/deep/` command surfaces — `model-benchmark.md`, `assets/deep-model-benchmark-auto.yaml`, `assets/deep-model-benchmark-confirm.yaml`, `assets/deep-model-benchmark-presentation.txt`, the agent-improvement cross-references, and the commands README/compiled/legacy manifolds.

## SCOPE VIOLATIONS

- `{spec_folder}/spec.md` late-INIT anchoring (workflow `step_preinit_spec_branch`) and post-synthesis generated-fence write-back (`step_writeback_spec_findings`) target paths outside the lineage write surface. Skipped by design; no mutation attempted.
- `step_graph_upsert` (coverage-graph upsert) writes through `upsert.cjs` against the spec folder graph store, outside the lineage write surface. Skipped; graphEvents are omitted from records this run.
- Telemetry heartbeat steps (`step_telemetry_heartbeat_started/progress/terminal`) are skipped to keep the lineage self-contained; recorded as a deviation in the synthesis report.
