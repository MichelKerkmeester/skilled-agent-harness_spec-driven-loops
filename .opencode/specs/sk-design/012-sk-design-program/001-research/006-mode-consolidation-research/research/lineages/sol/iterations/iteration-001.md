# Iteration 1: Physical inventory and structural utilization baseline

## Focus

Establish the current physical surface and distinguish configuration reachability from stronger utilization evidence across the six registered mode packets plus the styles resource. The charter calls these seven modes/assets; this iteration uses that narrower interpretation and defers task-frequency claims because the repository contains no production invocation telemetry.

## Actions Taken

1. Counted files in every mode packet and decomposed the styles tree by top-level area and extension.
2. Read the registry, hub router, hub advisor metadata, and all five canonical command definitions.
3. Searched for live imports and process invocations of the styles retrieval facade across mode packets.
4. Compared documented adapter paths with the current physical paths.
5. Sampled repository-wide mode and command references, then separated live source/configuration evidence from specs and benchmark fixtures.

## Findings

1. The physical inventory is six registered mode packets plus one shared styles surface: `design-interface` 62 files, `design-foundations` 48, `design-motion` 39, `design-audit` 70, `design-md-generator` 115, `design-mcp-open-design` 43, and `styles` 7,812. The styles total decomposes into 7,745 library files, 41 tests, 21 library/adapter modules, two scripts, two database artifacts, and one root README. Its 1,290 bundles account for six files per style, while five manifest files complete the library count. [SOURCE: local inventory command `rg --files .opencode/skills/sk-design/<surface> | wc -l`] [SOURCE: .opencode/skills/sk-design/styles/README.md:5-21] [INFERENCE: 1,290 bundles × six documented files = 7,740; 7,745 library files therefore include five non-bundle manifest files]

2. All six packets are structurally reachable through the hub: each has a `workflowMode`, packet path, metadata routing block, equal router weight, and aliases. Five judgment modes also have dedicated `/interface:*` commands; Open Design alone has `command:null` and is reachable as a mandatory-paired transport. The router has no configured default and uses a six-entry tie-break order. This proves maintained routing surface, not observed user frequency. [SOURCE: .opencode/skills/sk-design/mode-registry.json:15-24] [SOURCE: .opencode/skills/sk-design/mode-registry.json:41-161] [SOURCE: .opencode/skills/sk-design/hub-router.json:5-93] [SOURCE: .opencode/commands/interface/design.md:7-18] [SOURCE: .opencode/commands/interface/foundations.md:7-18] [SOURCE: .opencode/commands/interface/motion.md:7-18] [SOURCE: .opencode/commands/interface/audit.md:7-18] [SOURCE: .opencode/commands/interface/design-reference.md:7-18]

3. Advisor utilization exists only at hub granularity. The advisor metadata declares one `sk-design` skill identity and carries mode phrases inside that identity; the hub explicitly says the advisor routes to `sk-design` first and the hub selects the packet. Therefore packet extraction into standalone skills would change advisor topology, while folding foundations/audit inside the hub can preserve the current advisor contract. [SOURCE: .opencode/skills/sk-design/graph-metadata.json:1-6] [SOURCE: .opencode/skills/sk-design/graph-metadata.json:53-80] [SOURCE: .opencode/skills/sk-design/graph-metadata.json:146-178] [SOURCE: .opencode/skills/sk-design/SKILL.md:52-60]

4. The styles tree is load-bearing code, not an orphaned archive. Interface, foundations, motion, and audit each import the same `runQuery`/`runHydrate` facade, and md-generator invokes that facade as a child process for its STUDY workflow. The adapter therefore has five current mode consumers; relocating it under md-generator would invert four sibling dependencies. A shared asset boundary is the evidence-backed current shape, although the final ownership decision remains open. [SOURCE: .opencode/skills/sk-design/design-interface/corpus/relational-exemplar.mjs:11-28] [SOURCE: .opencode/skills/sk-design/design-foundations/corpus/relationship-blueprint.mjs:11-28] [SOURCE: .opencode/skills/sk-design/design-motion/corpus/motion-evidence.mjs:11-24] [SOURCE: .opencode/skills/sk-design/design-audit/corpus/comparison-lane.mjs:11-28] [SOURCE: .opencode/skills/sk-design/design-md-generator/backend/scripts/study-prepare.ts:51-89]

5. The adapter preserves a compatibility boundary that a migration must keep intact: the facade exports `runQuery` and `runHydrate`, while `SK_DESIGN_STYLE_DB_MODE` or an explicit option selects `legacy`, `shadow`, or `persistent`; the default is `legacy`. The flat corpus remains the authority even for persistent hydration. That makes the facade path and response contract more load-bearing than the current parent directory name. [SOURCE: .opencode/skills/sk-design/styles/lib/engine/style-library.mjs:178-204] [SOURCE: .opencode/skills/sk-design/styles/lib/engine/persistent-adapter.mjs:97-111] [SOURCE: .opencode/skills/sk-design/styles/lib/engine/persistent-adapter.mjs:144-170] [SOURCE: .opencode/skills/sk-design/styles/README.md:10-18]

6. Two documentation/configuration contradictions are migration hazards. The hub layout and references still name `styles/_engine` and `styles/_db`, while the working implementation and all five consumers use `styles/lib/engine` and `styles/lib/database`. Separately, `hub-router.json` sets `defaultMode:null`, while hub prose says generic prompts default to interface. These do not invalidate the live imports, but any build packet must choose a single canonical path and fallback rule before rewriting references. [SOURCE: .opencode/skills/sk-design/SKILL.md:208-226] [SOURCE: .opencode/skills/sk-design/SKILL.md:232-263] [SOURCE: .opencode/skills/sk-design/styles/README.md:10-18] [SOURCE: .opencode/skills/sk-design/hub-router.json:5-7] [SOURCE: .opencode/skills/sk-design/SKILL.md:232-240]

## Questions Answered

- The physical inventory and structural reachability baseline are established.
- No full charter question is closed yet: structural reachability is not task-frequency utilization.

## Questions Remaining

- Which foundations references and procedures are invoked by real interface tasks, versus only declared in routing tables?
- Which audit checks are independently invoked, versus serving as interface completion gates?
- How frequently do the five styles consumers actually query/hydrate, and which bundle artifacts are hydrated?
- Should styles ownership remain hub-shared, become a separate asset package, or be dependency-injected into surviving skills?
- Does the four-survivor topology preserve the single advisor identity or intentionally split it?
- What compatibility, rollback, and verification stages should the build packet execute?

## Ruled Out

- Raw repository-wide mention counts as utilization proof. Exact searches returned hundreds of files per packet, but the sample was dominated by specs, benchmark fixtures, archived research, and generated reports; it measures documentation footprint rather than live task use. [SOURCE: local search command `rg -l --fixed-strings <mode> .opencode`]
- Treating the styles database as md-generator-only. Four other mode packets directly import its facade. [SOURCE: .opencode/skills/sk-design/design-interface/corpus/relational-exemplar.mjs:28] [SOURCE: .opencode/skills/sk-design/design-foundations/corpus/relationship-blueprint.mjs:28] [SOURCE: .opencode/skills/sk-design/design-motion/corpus/motion-evidence.mjs:24] [SOURCE: .opencode/skills/sk-design/design-audit/corpus/comparison-lane.mjs:28]

## Dead Ends

None. Broad name counts were rejected as weak evidence, but narrowed source/import searches remained productive.

## Edge Cases

- Ambiguous input: “seven modes” is implemented as six registry modes plus the styles asset because that is the charter’s explicit decomposition.
- Contradictory evidence: the hub documents old `_engine`/`_db` paths while live code uses `lib/engine`/`lib/database`; the router machine config has no default while prose says interface is the generic fallback.
- Missing dependencies: production invocation telemetry is absent, so this iteration cannot infer frequency from structural reachability.
- Partial success: the physical and structural baseline is complete, but capability-level utilization remains open.

## Sources Consulted

- `.opencode/specs/sk-design/012-sk-design-program/001-research/006-mode-consolidation-research/spec.md:56-101`
- `.opencode/skills/sk-design/mode-registry.json:1-163`
- `.opencode/skills/sk-design/hub-router.json:1-93`
- `.opencode/skills/sk-design/SKILL.md:40-115`
- `.opencode/skills/sk-design/SKILL.md:190-275`
- `.opencode/skills/sk-design/graph-metadata.json:1-178`
- `.opencode/commands/interface/design.md:1-83`
- `.opencode/commands/interface/foundations.md:1-83`
- `.opencode/commands/interface/motion.md:1-83`
- `.opencode/commands/interface/audit.md:1-83`
- `.opencode/commands/interface/design-reference.md:1-83`
- `.opencode/skills/sk-design/styles/README.md:1-21`
- `.opencode/skills/sk-design/styles/lib/engine/style-library.mjs:178-235`
- `.opencode/skills/sk-design/styles/lib/engine/persistent-adapter.mjs:97-170`
- The five mode consumer files cited in Findings 4.

## Assessment

- New information ratio: 1.00
- Questions addressed: styles-database consumers and adapter implications; per-surface routing/command/advisor/cross-reference utilization; topology constraints.
- Questions answered: physical inventory and structural reachability baseline only; none of the six charter questions is fully closed.

## Reflection

- What worked and why: exact registry reads, command reads, and import/process-invocation searches separated executable dependency edges from historical mentions.
- What did not work and why: repository-wide name counts overstate utilization because generated and historical artifacts dominate the corpus.
- What I would do differently: quantify live resource-map coverage inside foundations and audit first, then compare their procedures against interface’s default and conditional gates rather than repeating global name searches.

## Next Focus

Trace `design-foundations` and `design-audit` at capability level: classify every procedure/reference as default-loaded, conditionally loaded, cross-called by interface/shared, command-only, test-only, or unreferenced.

## Recommended Next Focus

Build a foundations/audit capability matrix against interface and shared contracts, with exact inbound references and executable call sites. This is the narrowest next step that can decide fold-versus-delete without pretending structural presence equals utilization.
