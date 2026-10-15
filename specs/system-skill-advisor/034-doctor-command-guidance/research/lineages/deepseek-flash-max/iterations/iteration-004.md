---
title: "Iteration 4: Command admission pipeline and harvester scope"
trigger_phrases: []
---
# Iteration 4: Command admission pipeline and harvester scope

## Focus

Determine exactly how a command becomes visible to the advisor: the admission gates (`command-metadata.json`, `allow-list.json`, `scoring-compatibility.json`), the id grammar, the `routingEnabled` switch, and what the two harvester implementations actually walk. This decides which feed mechanisms are supported today and which would require new support.

## Actions Taken

- Read `runtime/scripts/command-bridges/derive-command-bridges.cjs` (admission, id grammar, rendering, runtime ordering).
- Inventoried `command-metadata.json` files across `.skilled/skills/` and read `sk-doc/command-metadata.json`.
- Read the Python harvester constants and doc-trigger loader in `runtime/scripts/skill_advisor.py`.
- Read `runtime/lib/skill-graph/doc-frontmatter.ts` (harvest gate, subdir list, tier weights).
- Located the `skill_docs` table writer in `runtime/lib/skill-graph/skill-graph-db.ts`.

## Findings

1. Command admission has exactly two inputs: a per-skill `command-metadata.json` (`derive-command-bridges.cjs:71`) or a hand-maintained `allow-list.json` entry; only three skills carry metadata today (`system-deep-loop`, `sk-design`, `sk-doc`), yielding the 19 metadata entries counted in the generated summary. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs:71-99] [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/command-bridges.generated.json:1-10]

2. Metadata entries require `command` and `ownerMode` but the authored shape carries far more routing-relevant material: `description`, `argumentHint`, `userIntent.job`, `userIntent.ownedSignals`, `choreography[]` and `discriminator.whenToUse` / `preferSiblingWhen` — a ready model for a doctor command entry. [SOURCE: .skilled/skills/sk-doc/command-metadata.json:1-50]

3. Allow-list entries require `id`, `command`, `skillId`, `ownerMode` and a `reason`, and exist for commands whose owning skill has no `command-metadata.json` yet (for example the `/speckit:*` family and the retired `/memory:save` id). [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/allow-list.json:1-50]

4. Bridge ids are derived from the command string and must match `^\/[a-z][a-z0-9-]*:[a-z0-9-]+$`; duplicates are rejected by an explicit uniqueness assertion. Because `/doctor:git` owns three targets (hooks, standards, setup), a naive one-bridge-per-route design would collide on `command-doctor-git` — doctor admission needs either a single bridge per command with target phrases in its signal lists, or allow-list ids that do not follow the command-derived form. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs:56-60] [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs:117-130]

5. `routingEnabled` is driven per platform by `scoring-compatibility.json` runtime enablement; the generator only emits keywords, intent signals, description and name for an enabled runtime, and renders inactive bridges with empty signal lists. TypeScript-active count is 5, Python-active 15. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs:250-290] [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/command-bridges.generated.json:1-10]

6. The Python harvester roots at `.skilled/skills` (`SKILLS_DIR = SCRIPT_DIR/../../..`) and reads doc frontmatter only from `("references", "assets")` subdirectories of each skill directory when building its signal map. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:44] [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:991] [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:1030-1051]

7. The TypeScript harvester mirrors that scope with `HARVEST_SUBDIRS = ['references', 'assets']`, walking markdown files under those subdirs of each skill root, and is gated by `SPECKIT_ADVISOR_DOC_TRIGGERS`. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/skill-graph/doc-frontmatter.ts:170] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/skill-graph/doc-frontmatter.ts:204-217]

8. Harvested doc triggers land in the `skill_docs` table with content-hash-based upsert/delete semantics, and the derived lane consumes them with a bounded contribution (top 3 docs, 0.45 cap) so doc volume cannot dominate curated skill signals. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts:855-945] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/derived.ts:22-35]

9. Consequence for doctor routing: neither harvest path can see `.skilled/commands/doctor/**` (wrong root and wrong file type in both implementations), while the command-bridge pipeline cannot see route-level granularity unless doctor entries are authored per command with target phrases folded into their signal lists. Both supported mechanisms therefore require authored metadata, not direct consumption of `_routes.yaml`. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs:65-99] [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:991-1051]

10. Everything above is guarded: the drift guard compares committed projections against a fresh generator dump and the allow-list, and `route-validate.sh` guards the doctor manifest, so any admission change has two CI gates to satisfy. [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/command-bridges-drift-guard.vitest.ts:1-40] [SOURCE: .skilled/commands/doctor/scripts/route-validate.sh:1-30]

## Ruled Out

- Feeding `_routes.yaml` to a harvester as a documentation change: both harvesters are scoped to skill roots and markdown frontmatter; a new file type and root would need new code in both implementations plus the opt-in gate.
- A one-bridge-per-doctor-route design under the current id grammar: `/doctor:git` targets collide at `command-doctor-git` under the uniqueness assertion.

## Dead Ends

- None; every seam resolved to concrete code or data.

## Edge Cases

- Ambiguous input: none.
- Contradictory evidence: none.
- Missing dependencies: none.
- Partial success: none.

## Sources Consulted

- .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs
- .skilled/skills/sk-doc/command-metadata.json
- .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/allow-list.json
- .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py
- .skilled/skills/system-skill-advisor/runtime/lib/skill-graph/doc-frontmatter.ts
- .skilled/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts

## Assessment

- New information ratio: 0.85
- Questions addressed: command admission and harvester scope (Q4 deepening, Q5 mechanism evidence)
- Questions answered: none newly

## Reflection

- What worked and why: reading the generator's validation code surfaced hard design constraints (id grammar, uniqueness, runtime enablement) that documentation does not state.
- What did not work and why: nothing failed.
- What I would do differently: fetch `scoring-compatibility.json` runtime blocks earlier to confirm how target-level phrases would land in keywords versus intentSignals.

## Recommended Next Focus

Design analysis for Q5: compare (a) doctor command bridges admitted through metadata/allow-list against (b) extending harvester scope, weigh collision risk with skill prompts, and select the mechanism with its evidence.
