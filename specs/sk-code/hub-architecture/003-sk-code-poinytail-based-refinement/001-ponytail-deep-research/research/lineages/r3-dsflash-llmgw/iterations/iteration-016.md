# Iteration 16: The hub files against each other

## Focus

Part 3, fifth slice: the six hub-root artifacts (`SKILL.md`, `ROUTER.md`, `hub-router.json`, `mode-registry.json`, `description.json`, `graph-metadata.json`) checked against each other on version, vocabulary and load claims. This follows iteration 15's Recommended Next Focus.

## Actions Taken

1. Read `description.json` and `ROUTER.md`'s frontmatter and §11-§12 in full.
2. Recomputed the two doctor check-5k legs by hand: every registry alias against the router vocabulary classes, and every packet name against the description keywords.
3. Checked every `routerSignals` mode has a canary case, and that `graph-metadata.json` carries the Obsidian surface.
4. Compared the §11 "surface-aware loading" claim and the §5 load-level table against what `RESOURCE_MAP` actually emits for the universal tier.

## Findings

1. **`description.json`'s description text omits the Obsidian surface while its keywords include it.** The advisor descriptor's description prose covers "Webflow frontend … and OpenCode system code" and stops [SOURCE: .skilled/skills/sk-code/description.json:3], while the same file's keywords carry `sk-code-obsidian` and `obsidian plugin` [SOURCE: .skilled/skills/sk-code/description.json:1]. This is the third instance of the two-surface prose (earlier: `shared/README.md:17`, `mode-registry.json:5`), and it is the one an operator reads in advisor output. Reproducing case: `rg -c -i obsidian .skilled/skills/sk-code/description.json` finds the keywords, and reading the description string finds no Obsidian. NEW, P2.
2. **`ROUTER.md` claims the universal tier loads per route, but the machine map emits it file by file, intent by intent.** §11 says a route loads "the surface-agnostic `shared/references/universal/*` tier" [SOURCE: .skilled/skills/sk-code/ROUTER.md:604], and the load-level table marks "Universal code quality + error recovery from …/universal/" as ALWAYS on every invocation [SOURCE: .skilled/skills/sk-code/ROUTER.md:111]. The map emits `code-quality-standards` in `DEFAULT_RESOURCE` and again under `CODE_QUALITY` [SOURCE: .skilled/skills/sk-code/ROUTER.md:323] [SOURCE: .skilled/skills/sk-code/ROUTER.md:389], `code-style-guide` only under `CODE_QUALITY` [SOURCE: .skilled/skills/sk-code/ROUTER.md:390], `error-recovery` only under `DEBUGGING` [SOURCE: .skilled/skills/sk-code/ROUTER.md:406], and `multi-agent-research` only under `IMPLEMENTATION` [SOURCE: .skilled/skills/sk-code/ROUTER.md:353]. A performance-only route therefore receives one universal file, not four, and no error-recovery, despite the ALWAYS row. §12's own phrasing ("the preamble plus the universal tier") repeats the broader claim [SOURCE: .skilled/skills/sk-code/ROUTER.md:614]. Reproducing case: `rg -n "shared/references/universal/" ROUTER.md` prints the map's four gated entries while the two prose passages say the tier always loads. NEW, P2 (the machine map is the contract the benchmark parses; the prose overstates what a route receives).
3. **The check-5k legs, version parity and the advisor graph all check out.** Recomputing by hand: every alias in every `modes[]` entry is a keyword of the classes its `routerSignals` lists, every `packetSkillName` is a `description.json` keyword, and each of the five modes is the expected route of a canary case [SOURCE: .skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/fixtures/canary-cases.v1.json:58]; `SKILL.md`, `ROUTER.md`, `hub-router.json`, `mode-registry.json` and `description.json` all read 2.2.4.0 [SOURCE: .skilled/skills/sk-code/ROUTER.md:11] [SOURCE: .skilled/skills/sk-code/description.json:4]; and `graph-metadata.json` carries the Obsidian domain, intent signals and the packet SKILL as a key file [SOURCE: .skilled/skills/sk-code/graph-metadata.json:254]. ALREADY-ADOPTED, P2, no action.

## Questions Answered

- None fully. The hub leg is mapped; the universal-tier claim is resolved as an overstatement rather than a missing load.

## Questions Remaining

- `benchmark/` and the root `manual-testing-playbook/`.

## Ruled Out

- **"Run the doctor's check 5k directly."** The two legs were recomputed from the same inputs the check reads; running the doctor would add no evidence and risks repo-wide writes outside this lineage.
- **"File the 2.2.4.0 parity as drift."** All five hub artifacts agree, and the version-authority statement names exactly these files.
- **"Re-open the shared-controls list disagreement."** Filed in iteration 1 as f-iter001-003; not re-filed here.

## Dead Ends

- `hub-router.json`'s outcome texts and `mode-registry.json`'s discriminator descriptions agree on the two-axis model; no drift.
- `graph-metadata.json`'s sibling edges are advisor-level metadata; no contradiction with the hub docs.

## Edge Cases

- Ambiguous input: whether "the universal tier" in §11 means the four files or the tier as a concept. Chosen interpretation: the table's ALWAYS row and the `*` glob make it a file claim; the map disproves it.
- Contradictory evidence: none.
- Missing dependencies: none.
- Partial success: none.

## Sources Consulted

- `.skilled/skills/sk-code/SKILL.md`
- `.skilled/skills/sk-code/ROUTER.md`
- `.skilled/skills/sk-code/hub-router.json`
- `.skilled/skills/sk-code/mode-registry.json`
- `.skilled/skills/sk-code/description.json`
- `.skilled/skills/sk-code/graph-metadata.json`
- `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/fixtures/canary-cases.v1.json`
- `specs/sk-code/011-sk-code-poinytail-based-refinement/001-ponytail-deep-research/research/lineages/r3-dsflash-llmgw/steer.md`

## Assessment

- New information ratio: 0.75 (two fully new findings, one ALREADY-ADOPTED verification block).
- Questions addressed: hub-file leg.
- Questions answered: none fully.

## Reflection

- What worked and why: recomputing the doctor check's legs by hand from the same two JSON files. It converts "the phase says this check exists" into an observed, repeatable result.
- What did not work and why: the first attempt to compare load claims treated §11 and §12 as one statement; separating the machine map from the prose tiers was what made the overstatement visible.
- What I would do differently: diff every prose load claim against the machine map as a table, once, rather than claim by claim.

## Recommended Next Focus

`benchmark/` and the root `manual-testing-playbook/`: what the retired lanes still claim, and whether the root playbook matches the files it names.
