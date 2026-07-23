# Iteration 3: Routing Config and Advisor Reference Drift

## Focus

Audit the parent `routing-config-and-advisor-reference.md` against the live seven-hub routing tree and the current parent phase/workstream map. The pass checked stale packet identities, path spellings, carrier counts, workstream attribution, consumer cross-references, and resume-oriented pointers.

## Findings

### P1 — The reference gives mutually exclusive 2-of-7 and 7-of-7 answers for the surface-router rollout

The document's central routing diagram says `smart-routing.md` and the populated typed-pair contract exist only on `sk-code` and `sk-doc`; the per-artifact section, coverage matrix, and advisor summary repeat that two-hub posture. The same document also says the rollout is fleet-wide. The live tree resolves the conflict in favor of 7-of-7: every listed hub has a hub-level surface router and a populated manifest. This is load-bearing because the document calls itself definitive and uses the carrier count to explain whether hub-mode selection is authoritative or telemetry.

- Stale two-hub claims: [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/routing-config-and-advisor-reference.md:48], [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/routing-config-and-advisor-reference.md:56], [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/routing-config-and-advisor-reference.md:90], [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/routing-config-and-advisor-reference.md:136], [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/routing-config-and-advisor-reference.md:164], [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/routing-config-and-advisor-reference.md:182], [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/routing-config-and-advisor-reference.md:184], [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/routing-config-and-advisor-reference.md:185]
- Conflicting fleet-wide claims in the same file: [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/routing-config-and-advisor-reference.md:20], [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/routing-config-and-advisor-reference.md:64], [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/routing-config-and-advisor-reference.md:122], [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/routing-config-and-advisor-reference.md:199], [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/routing-config-and-advisor-reference.md:202]
- Live evidence beyond the original two hubs: [SOURCE: .opencode/skills/sk-design/shared/references/smart-routing.md:2], [SOURCE: .opencode/skills/sk-prompt/shared/references/smart-routing.md:2], [SOURCE: .opencode/skills/mcp-tooling/shared/references/smart-routing.md:2], [SOURCE: .opencode/skills/system-deep-loop/shared/references/smart-routing.md:2], [SOURCE: .opencode/skills/cli-external-orchestration/shared/references/smart-routing.md:2]
- Their populated contracts: [SOURCE: .opencode/skills/sk-design/leaf-manifest.json:154], [SOURCE: .opencode/skills/sk-prompt/leaf-manifest.json:38], [SOURCE: .opencode/skills/mcp-tooling/leaf-manifest.json:71], [SOURCE: .opencode/skills/system-deep-loop/leaf-manifest.json:630], [SOURCE: .opencode/skills/cli-external-orchestration/leaf-manifest.json:49]

### P1 — The `defaultMode` inventory is stale for four hubs

The reference says the five hubs other than `sk-code` and `sk-doc` have named defaults. In the live policy files, only `sk-prompt` retains the stated named default. `sk-design`, `mcp-tooling`, `system-deep-loop`, and `cli-external-orchestration` are now `null`, matching the defer/disambiguate posture. A maintainer following the reference would predict automatic fallback where the live routers defer.

- Stale inventory: [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/routing-config-and-advisor-reference.md:79]
- Live policies: [SOURCE: .opencode/skills/sk-design/hub-router.json:5], [SOURCE: .opencode/skills/mcp-tooling/hub-router.json:5], [SOURCE: .opencode/skills/system-deep-loop/hub-router.json:5], [SOURCE: .opencode/skills/cli-external-orchestration/hub-router.json:5]
- The one remaining named default: [SOURCE: .opencode/skills/sk-prompt/hub-router.json:5]

### P1 — `resourceContractVersion` is no longer a sk-doc-only registry opt-in

The reference says `resourceContractVersion` is registry-declared only on `sk-doc`, that `sk-code` relies on a generator fallback, and that the switch remains single-hub. All seven live mode registries declare version `1`. This makes the document's explanation of which hubs activate manifest drift/reachability guards materially wrong.

- Stale claims: [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/routing-config-and-advisor-reference.md:97], [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/routing-config-and-advisor-reference.md:122], [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/routing-config-and-advisor-reference.md:187], [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/routing-config-and-advisor-reference.md:200]
- Live declarations: [SOURCE: .opencode/skills/sk-code/mode-registry.json:4], [SOURCE: .opencode/skills/sk-doc/mode-registry.json:4], [SOURCE: .opencode/skills/sk-design/mode-registry.json:4], [SOURCE: .opencode/skills/sk-prompt/mode-registry.json:4], [SOURCE: .opencode/skills/mcp-tooling/mode-registry.json:4], [SOURCE: .opencode/skills/system-deep-loop/mode-registry.json:4], [SOURCE: .opencode/skills/cli-external-orchestration/mode-registry.json:4]

### P2 — Consumer traceability is stale and the RELATED paths are not repo-resolvable as written

The reference promises named `file:line` grounding, but several of its cited ranges no longer contain the named functions. Examples: `projectHubRouter` is now at line 127 rather than `112-146`; `buildRegistryIndex` is at 176 rather than `158-167`; `buildResourceContract` is at 235 rather than `217-244`; `loadSurfaceRouter` is at 545 rather than `524-540`; `routeSkillResources` is at 643 rather than `611-671`; `loadManifestModeLeaves` and `deriveTypedGoldFromBodyGold` are now at 620 and 636 rather than 437 and 453; and `validateManifestResolution` is at 248 rather than `187-201`. The RELATED section compounds this by omitting the `.opencode/skills/` prefix from every skill-tree path, so none of those literal paths resolves from the repository root or from this parent packet.

- Stale evidence ranges: [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/routing-config-and-advisor-reference.md:87], [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/routing-config-and-advisor-reference.md:107], [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/routing-config-and-advisor-reference.md:118], [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/routing-config-and-advisor-reference.md:119], [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/routing-config-and-advisor-reference.md:120], [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/routing-config-and-advisor-reference.md:135]
- Current definitions: [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:127], [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:176], [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:235], [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:545], [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:643], [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/load-playbook-scenarios.cjs:620], [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/load-playbook-scenarios.cjs:636], [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/validate-playbook-topology.cjs:248]
- Non-resolving shorthand in RELATED: [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/routing-config-and-advisor-reference.md:234], [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/routing-config-and-advisor-reference.md:235], [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/routing-config-and-advisor-reference.md:236]

### P2 — The only parent-packet handoff is too vague and loses the Group D boundary

The final RELATED item points to unspecified "child packets under this parent" for per-skill routing research. The current parent map defines that source set precisely as Group D, children `015`–`019`. Omitting those identities makes the handoff non-navigable and can send a resuming maintainer through all twenty-one children, including the unrelated nested programs in Groups E and F.

- Vague handoff: [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/routing-config-and-advisor-reference.md:237]
- Authoritative Group D boundary: [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/spec.md:67], [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/spec.md:110], [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/spec.md:114], [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/context-index.md:52]
- Parent resume rule separating nested programs: [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/spec.md:122]

## Sources Consulted

- Parent reference: `routing-config-and-advisor-reference.md`
- Parent authority surfaces: `spec.md`, `context-index.md`
- All seven hub `hub-router.json`, `mode-registry.json`, `leaf-manifest.json`, and hub-level `shared/references/smart-routing.md` files
- Current benchmark consumers: `router-replay.cjs`, `load-playbook-scenarios.cjs`, `validate-playbook-topology.cjs`
- Existing lineage config, strategy, state log, iteration prompt, and prior canonical delta

## Assessment

- `newInfoRatio`: `0.85`
- Novelty justification: this pass found three independent live-contract inventory errors plus two traceability/handoff defects not recorded in prior lineage state; only the general risk class of parent drift was already known.
- Confidence: high for carrier counts, defaults, version declarations, and current symbol locations because each was checked directly on disk; medium-high for severity of the path shorthand because the prose may assume `.opencode/skills/` as an implicit base, but it never states that base.

## Reflection

What worked:

- Comparing every hub symmetrically exposed migration edits that were applied only to the document's later summary.
- Checking named consumer definitions turned vague "broken reference" suspicion into exact stale line evidence.
- Using the current parent workstream map made the imprecise final handoff measurable.

What failed or was ruled out:

- No obsolete parent name or surgical child rename appears in this reference; searches for the former parent identities and all eight renamed child slugs returned no hits.
- The live mode counts in line 108 and the manifest mode counts in line 122 match the current registries/manifests; those counts are not findings.
- The seven-hub list itself is complete and matches the current hub directories.
- A read-only advisor CLI status probe could not validate the worktree-specific build caveat because the warm daemon socket was unavailable; no finding relies on that caveat.

## Recommended Next Focus

Audit `routing-before-after.md` for the same partial-migration pattern: especially two-hub versus fleet-wide carrier claims, default-mode policy, and links back to the exact Group D source packets.
