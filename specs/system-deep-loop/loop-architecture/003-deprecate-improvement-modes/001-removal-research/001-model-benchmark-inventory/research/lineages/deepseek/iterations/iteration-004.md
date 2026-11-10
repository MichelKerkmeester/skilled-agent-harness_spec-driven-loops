# Iteration 4: `system-skill-advisor` surfaces

## Focus

The advisor's model-benchmark wiring: scorer aliases and phrase boosts, the projection TS, the generated command-bridge artifacts, the Python advisor catalog and projection-sync machinery, the shadow-diff doc, and the skill-graph. Drift-guard and corpus directories were checked for relevance.

## Actions Taken

- Read the manual alias group and phrase boosts with exact line ranges, and the two projection entries (manual list + generated block).
- Swept `command-bridges/` (generated JSON + scoring compatibility + shadow diff) and `skill_advisor.py` (bridge catalog entry + projection-sync markers).
- Counted skill-graph fragments and confirmed the `routing-accuracy/` corpus and `fixtures/` carry no model-benchmark prompts.

## Findings

1. `aliases.ts` manual alias group `'deep-model-benchmark'` (aliases: `command-spec-kit-deep-model-benchmark`, `/deep:model-benchmark`, `deep-model-benchmark`, `sk-deep-model-benchmark`). **DELETE** the group [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/aliases.ts:16-21]
2. The generated deep-routing alias projection below the marker in `aliases.ts` does **not** contain the benchmark group (verified by a full-file match scan), so removing the manual group leaves `DEEP_ROUTING_PROJECTION_HASH` untouched. No regen needed here [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/aliases.ts:24-27]
3. `explicit.ts` carries the Lane B phrase-boost block: the command anchor plus nine benchmark/optimize phrase rows with disambiguation penalties targeting `system-deep-loop`. **DELETE** lines 122 and 140-157 [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts:149-157]
4. `projection.ts` holds the bridge twice: a hand-maintained entry in the pre-generated list and the generated-block entry inside `GENERATED_COMMAND_BRIDGES` (block spans the `BEGIN GENERATED COMMAND BRIDGES` fence). **DELETE** the manual entry; regenerate for the generated entry [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/projection.ts:152-165,256-270]
5. `command-bridges.generated.json` contains the full generated bridge record (`id` `command-deep-model-benchmark`, `/deep:model-benchmark`, `ownerMode` model-benchmark, `source` command-metadata.json). **DELETE via regeneration** after the command-metadata edit from iteration 1 [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/command-bridges.generated.json:341-374]
6. `scoring-compatibility.json` mirrors the same record. **DELETE via regeneration** [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/scoring-compatibility.json:122-146]
7. `skill_advisor.py` keeps a legacy bridge entry with `routing_enabled: False`. **DELETE** the entry; the projection-sync machinery (`TS_PROJECTION_START`, generated hash block) stays and is the tool that refreshes the generated artifacts [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:2510-2517]
8. `shadow-diff.md` reports the live-TS-only IDs (count 4 lists `deep-model-benchmark`) and asserts its ID shape. **EDIT** — after regeneration the count becomes 3 and the ID-shape row drops [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/shadow-diff.md:21,33]
9. `skill-graph.json` carries no model-benchmark signal for `system-deep-loop`; its single `model benchmark` fragment comes from sk-doc's harvested triggers and is resolved by the sk-doc edit + `skill_graph_compiler.py` regen (iteration 5 scope) [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/skill-graph.json:1]
10. The `routing-accuracy/` corpus and `fixtures/` directories contain zero model-benchmark prompts (verified scan), so no advisor-regression fixtures change [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/README.md]

## Ruled Out

- Regenerating the deep routing alias projection in `aliases.ts`: the generated group set does not include `deep-model-benchmark`; only the manual group needs deletion and the embedded hash stays valid.
- Treating the skill-graph `model benchmark` fragment as a deep-loop routing signal: it belongs to sk-doc's harvested trigger set.

## Dead Ends

- `routing-accuracy/` and `fixtures/` (no matches); `command-bridges/README.md` does not exist.

## Edge Cases

- Ambiguous input: none.
- Contradictory evidence: none — the manual-vs-generated duplication of the projection entry is by design and both halves are accounted for.
- Missing dependencies: none.
- Partial success: none.

## Sources Consulted

- .skilled/skills/system-skill-advisor/runtime/lib/scorer/aliases.ts
- .skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts
- .skilled/skills/system-skill-advisor/runtime/lib/scorer/projection.ts
- .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/command-bridges.generated.json
- .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/scoring-compatibility.json
- .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/shadow-diff.md
- .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py
- .skilled/skills/system-skill-advisor/runtime/scripts/skill-graph.json

## Assessment

- New information ratio: 1.0
- Questions addressed: KQ3 (advisor half)
- Questions answered: none yet (KQ3 completes after the sk-doc surfaces)

## Reflection

- What worked and why: separating the manual alias group from the generated projection block by a full-file match scan avoided a wrong regen instruction; reading both projection locations caught the manual/generated duplication.
- What did not work and why: nothing material.
- What I would do differently: nothing; the regen-after-source-edit pattern will repeat for compiled surfaces in iteration 9 and is now well-evidenced.

## Recommended Next Focus

Iteration 5: `sk-doc` surfaces — `sk-create-benchmark` (SKILL.md, references/model-benchmark, assets/model-benchmark templates, changelogs, playbook), `sk-doc` hub router/registry/manifest files, `sk-create-command/assets/command-contract.json`, and generated sk-doc benchmark reports.
