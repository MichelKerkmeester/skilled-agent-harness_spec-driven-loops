# Iteration 5: verdicts per skill type, readability synthesis, phased plan

## Focus

Turn the four iterations of evidence into the three verdicts the topic asks for — separately for hubs, mode packets and standalone skills — then a readability synthesis and a phased implementation plan with order, risk and rollback.

## Actions Taken

- Re-read the Class H/S contract and the `router-reach` invariant against the iteration 1-4 findings.
- Recomputed the routing-share table from the section boundaries measured in each iteration.
- Tested each of the four candidate shapes against the enforcement surfaces named in iteration 4.
- Wrote the plan in dependency order: correctness fixes before consolidation, consolidation before prose, prose before regeneration.

## Findings

1. **Hub verdict: the advisor hybrid wins — stage-one JSON, one hub-root `ROUTER.md`, script resolvers — and both alternatives fail on named checks.** Per-mode `ROUTER.md` is unavailable: the Class H contract defines a hub by `mode-registry.json` plus `hub-router.json` and calls `ROUTER.md` a hub-root companion, `router-reach` scans only `.skilled/skills/*/ROUTER.md` and requires a hub carrying both JSON files, and no packet in either hub has a router today. JSON-only is unavailable: `router-reach` reads `ROUTER.md` as `stage_two_vocabulary` and fails a hub whose advertised phrase does not reach it, so deleting the document removes the only stage-two leaf map the check can read. The hybrid is what already runs: `graph-metadata.json` decides the hub, `hub-router.json` decides the mode, `ROUTER.md` decides the first leaf slice, and `leaf-manifest.json` plus `leaf-aliases.json` type the result. [SOURCE: .skilled/skills/sk-doc/sk-create-skill/references/shared/skill-root-metadata-contract.md:40] [SOURCE: .skilled/commands/doctor/assets/doctor-router-reach.yaml:64] [SOURCE: .skilled/skills/system-skill-advisor/SKILL.md:340]

2. **Mode-packet verdict: no per-mode `ROUTER.md`; keep a short §2 and move the machine block to an appendix, but keep the packet's task-intent map.** The packet's `INTENT_SIGNALS` answers a different question from the hub's: the hub scores executor identity (`OPENCODE`, `DEVIN`) while the packet scores task intent inside one executor (`GENERATION`, `REVIEW`, `CLOUD_HANDOFF`). That map cannot be replaced by the hub router, so the hypothesis report's "remove the per-packet loading tables" is only half right — remove the first-slice restatement that duplicates `ROUTER.md`, keep the task-intent map. A packet-root router would be a fifth copy of the leaf decision and is invisible to `router-reach` and to the hub-root contract. [SOURCE: .skilled/skills/cli-external-orchestration/cli-devin/SKILL.md:97] [SOURCE: .skilled/skills/cli-external-orchestration/ROUTER.md:93]

3. **Standalone verdict: leaf manifest and aliases only — no `ROUTER.md`, and the full Python block is optional.** Class S forbids `mode-registry.json`, `hub-router.json`, `description.json` and `command-metadata.json`; it requires `leaf-manifest.config.json`, generated `leaf-manifest.json` and generated `leaf-aliases.json`. A per-mode or hub router is therefore structurally impossible, and JSON-only is already the operative shape for leaf identity. The Python block adds no routing value where it cannot choose: `sk-vision` loads its whole corpus on every invocation and `cli-orca` ignores its own weights. Keep a short leaf list plus the generated manifest; drop or shrink the block where it has one intent or one leaf set. [SOURCE: .skilled/skills/sk-doc/sk-create-skill/references/shared/skill-root-metadata-contract.md:62] [SOURCE: .skilled/skills/sk-vision/SKILL.md:130] [SOURCE: .skilled/skills/cli-orca/SKILL.md:177]

4. **Readability synthesis: routing occupies about a third of each file on average, and the two largest roots put roughly 60% of the file before the first instruction.** Measured §2 share of file length: `mcp-tooling` 11%, `cli-external-orchestration` 20%, `cli-classifier` 23%, `sk-vision` 25%, `sk-git` 29%, `mcp-code-mode` 33%, `cli-orca` 38%, `sk-prompt` 41%, `system-skill-advisor` 59%, `system-spec-kit` 60% (mean 34%). The longest single lines are 2,195 characters (`sk-git/SKILL.md:307`), 1,988 (`system-spec-kit/SKILL.md:95`), 1,397 (`cli-devin/SKILL.md:333`), 1,249 (`system-skill-advisor/SKILL.md:84`), 972 (`mcp-code-mode/SKILL.md:62`), 840 (`cli-classifier/SKILL.md:114`), 779 (`cli-external-orchestration/SKILL.md:76`) and 673 (`cli-orca/SKILL.md:226`). Terms arrive before definitions — "Class S", "typed leaf", "fallback-only", "orderedBundle" — and two docs still describe retired enforcement: "the deterministic router-replay and benchmarks parse" while `benchmark/README.md:20` records the harness removed. [SOURCE: .skilled/skills/sk-git/SKILL.md:307] [SOURCE: .skilled/skills/system-spec-kit/SKILL.md:95] [SOURCE: .skilled/skills/cli-external-orchestration/SKILL.md:76] [SOURCE: .skilled/skills/cli-external-orchestration/benchmark/README.md:20]

5. **Phase 1 — fix correctness without changing shape (low risk, revert one file per item).** (a) `system-skill-advisor`: hyphenate `feature_catalog`/`manual_testing_playbook`, add `hooks/` to `RESOURCE_BASES`, add the hook leaf to the manifest or remove the `HOOK` intent, and make `typed_leaves` read the manifest. (b) `cli-jev`: make `DEFAULT_RESOURCES` agree with the hub router's `DEFAULT_RESOURCE = []`, or state the baseline in both. (c) `mcp-tooling`: add the four missing obsidian intents to `ROUTER.md` or drop the four stage-one classes that lead nowhere. (d) `shared-smart-router.md`: six providers → seven, add `hermes` to the provider slug list. (e) `cli-external-orchestration`: delete the benchmark claim or mark the lane retired. (f) `mcp-tooling`: align `ROUTER.md` version 1.8.2.0 with the hub's 1.8.6.0 or document the exemption the CLI hub documents. Each item is a one-file revert; the only regeneration risk is spec-kit's manifest after (d). [SOURCE: .skilled/skills/system-skill-advisor/SKILL.md:107] [SOURCE: .skilled/skills/cli-classifier/cli-jev/SKILL.md:115] [SOURCE: .skilled/skills/mcp-tooling/ROUTER.md:97] [SOURCE: .skilled/skills/system-spec-kit/references/cli/shared-smart-router.md:139]

6. **Phase 2 — consolidate vocabulary behind one authored list (high risk, generator-level rollback).** Choose `hub-router.json` `vocabularyClasses` as the single authored executor vocabulary, generate `mode-registry.json` aliases and `ROUTER.md` `INTENT_SIGNALS` from it, and keep `graph-metadata.json` `intent_signals` as the authored stage-one list that must be a superset of every advertised `ROUTER.md` phrase. Risk: the compiled route hashes the hub `SKILL.md` and must be re-minted; `router-reach` fails on any phrase the graph loses; the alias-subset check fails if generation order is wrong. Rollback: keep the generated files in git and revert the generator commit; the compiled manifest is re-mintable from the previous `SKILL.md`. Do this after Phase 1 because the drift counts are the test fixture. [SOURCE: .skilled/skills/cli-external-orchestration/hub-router.json:104] [SOURCE: .skilled/skills/cli-external-orchestration/mode-registry.json:37] [SOURCE: .skilled/commands/doctor/assets/doctor-router-reach.yaml:23]

7. **Phase 3-5 — prose, then regeneration, then the gate (medium risk, file-level rollback).** Phase 3 restructures each mode packet: §2 becomes 8-12 lines that say the hub picks the mode, the packet map picks the task leaves, and the three marker words in one line; the Python block moves to a final `## MACHINE ROUTER` appendix. Phase 4 is the readability pass: split lines over roughly 30 words, define "Class S", "typed leaf", "fallback-only" once per hub, remove project history from instructions, and leave pinned lines alone. Phase 5 regenerates every derived surface and runs the gate: `leaf-manifest --check` for both classes, `sync-skills-hermes.cjs --check` (the only text-copy mirror), `sync-prompts.cjs`/`sync-prompts-hermes.cjs` for command edits, the compiled-route re-mint, then `parent-skill-check`, `verify-router-sync`, `router-reach`, `package_skill --strict` and the drift guards. Rollback is per-phase: a prose change is a file revert plus one mirror regeneration; a consolidation change is a generator revert plus a compiled-route re-mint. [SOURCE: .skilled/skills/cli-external-orchestration/SKILL.md:76] [SOURCE: .hermes/SYNC.md:24] [SOURCE: .cursor/SYNC.md:114]

## Questions Answered

1. Per-skill routing mechanisms, restatements and drift: answered across iterations 1-4, with measured alias drift for both hubs and a four-list inventory for each skill.
2. Enforcement surfaces and change impact: answered — `graph-metadata.json` is the only stage-one reader, `router-reach` couples it to `ROUTER.md`, the leaf manifest and aliases are the leaf authority, Hermes is the only text-copy mirror, and Cursor's packet list is ungenerated.
3. Shape verdict: answered separately — hubs keep one `ROUTER.md` in the advisor hybrid; mode packets keep no router and a short §2 plus appendix; standalone skills use the generated leaf manifest and aliases only.
4. Readability: answered with the share table, the longest-line list and quoted passages.
5. Phased plan: answered in findings 5-7 with order, risk and rollback.

## Questions Remaining

None. The five strategy questions are answered; what remains is implementation, which is out of scope for this read-only lineage.

## Ruled Out

- A per-mode `ROUTER.md` for any class. Class S forbids the hub files; Class H's router is hub-root only; no packet carries one.
- Pure JSON-only routing for hubs. `router-reach` reads `ROUTER.md` as stage-two vocabulary.
- Deleting the packet task-intent maps. They answer a different question from the hub's executor map.
- Treating the hypothesis report as confirmed wholesale. Its hub and standalone conclusions hold; its "remove the per-packet loading tables" needs the correction in finding 2.

## Dead Ends

- Trying to express stage-two leaf choice in today's JSON without a script. The compiled router emits packets, not leaves (prior report), and no leaf resolver exists for hub routes.

## Edge Cases

- Ambiguous input: the verdict for hubs rests on two hubs (CLI and MCP) plus the contract; `sk-code`, `sk-doc`, `sk-design` and `system-deep-loop` are the sibling lineage's, and their evidence here is the prior advisor report, marked as prior rather than re-verified.
- Contradictory evidence: the prior report says to remove per-packet loading tables; the packet maps are a distinct decision, so the recommendation is narrowed, not adopted.
- Missing dependencies: none.
- Partial success: none.

## Sources Consulted

- Iterations 1-4 of this lineage (`iterations/iteration-001.md` … `iteration-004.md`)
- `.skilled/skills/sk-doc/sk-create-skill/references/shared/skill-root-metadata-contract.md`
- `.skilled/commands/doctor/assets/doctor-router-reach.yaml`
- `.skilled/skills/system-skill-advisor/SKILL.md`
- `.skilled/skills/system-spec-kit/SKILL.md`, `references/cli/shared-smart-router.md`
- `.skilled/skills/cli-external-orchestration/*`, `.skilled/skills/mcp-tooling/*`, standalone skill roots
- `specs/sk-doc/072-skill-routing-and-clarity/001-deep-research/scratch/sk-code-advisor-report.md` (prior evidence, not re-verified)

## Assessment

- New information ratio: 0.55
- Questions addressed: all five
- Questions answered: all five

## Reflection

- What worked and why: testing each candidate shape against a named check turned a preference into a verdict with a failure mode.
- What did not work and why: the first draft of the mode-packet verdict repeated the prior report's "remove the tables"; separating executor intent from task intent showed the two maps are not the same decision.
- What I would do differently: run the share table in iteration 1 so every later iteration could place its skill against the fleet average.

## SCOPE VIOLATIONS

- **One out-of-lineage write, caused by the reducer's fixed resource-map path.** Running the workflow's `step_emit_resource_map` equivalent, `reduce-state.cjs … --artifact-dir <lineage> --emit-resource-map --fanout-resource-map-only`, ignored `--artifact-dir` for the output and wrote `specs/sk-doc/072-skill-routing-and-clarity/001-deep-research/research/resource-map.md` at the packet root, outside this lineage. The file did not exist in the containment baseline. It was not deleted, because deleting it would be a second out-of-scope write and the artifact aggregates both lineages' deltas for the parent run. A lineage-local `resource-map.md` was generated from this lineage's own finding sources instead, so `research.md` references a file inside the write surface. The reducer's output path is the defect to fix: it should honour `--artifact-dir` when `--fanout-resource-map-only` is set.

## Recommended Next Focus

None for this lineage. Synthesis follows; implementation is a separate follow-up step owned by the sibling lineage and the operator.
