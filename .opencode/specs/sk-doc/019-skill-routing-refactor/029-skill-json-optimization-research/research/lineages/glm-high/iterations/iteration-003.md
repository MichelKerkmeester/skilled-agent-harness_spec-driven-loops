# Iteration 3: Automation Gaps — What Still Needs Hand-Authoring

## Focus
Scope what could be generated/auto-validated but isn't: a skill-root `derived` regenerator, scaffolder completeness, S-class leaf-manifest.config derivability, and the split validation surface.

## Findings

### F3.1 — HIGH-LEVERAGE: a skill-root `derived` regenerator is feasible and absent
Most `derived` fields are corpus-derivable:
- `key_files`, `source_docs`, `entities` (name/kind/path) → derivable from leaf-manifest.json (the generated leaf list) + SKILL.md; the advisor compiler already validates these paths exist (skill_graph_compiler.py:346-394) but nothing GENERATES them.
- `trigger_phrases` → derivable from SKILL.md frontmatter keywords + skill_id + mode-registry mode names.
- `key_topics` → derivable from `domains` + mode-registry workflowMode keys.
- `created_at`/`last_updated_at`/`generated_at` → timestamps.
- `causal_summary` → the one field that needs an LLM or stays authored (prose).
- `supported_surfaces`/`peer_resource_categories` → dead (F2.1); a regenerator would simply drop them.

A regenerator analogous to spec-folder `backfill-graph-metadata.ts` (which already derives derived from spec.md/plan.md) does not exist for skill roots. `init_skill.py` scaffolds a 5-field minimal derived (lines 287-293 S, 540-554 H); the fleet's rich derived blocks are hand-enriched and hand-maintained with no freshness gate. This is the actionable counterpart to F2.4.
[SOURCE: init_skill.py:287-293,540-557; backfill-graph-metadata.ts:485-516 (spec-folder analog); skill_graph_compiler.py:346-394 validates paths but does not generate]

### F3.2 — S-class `leaf-manifest.config.json` is ~90% boilerplate, could be defaulted
The S-class config declares `workflowMode` (== skill_id), `packet` ("."), `leafRoots` (default ['references','assets'] per generate-leaf-manifest.cjs:110), `excludeIndexFiles`, `resourceContractVersion`. `workflowMode` is derivable from the skill_id; `leafRoots` has a default. The only non-derivable bits are overrides (extra leafRoots like 'feature-catalog','manual-testing-playbook', or excludeIndexFiles=false). The config could be GENERATED with defaults and only authored when overriding — instead it is a required authored file (contract §3). This adds one mandatory hand-authored file per S-class skill for mostly boilerplate.
[SOURCE: sk-git/leaf-manifest.config.json; generate-leaf-manifest.cjs:104-110; contract §3 line 66]

### F3.3 — `command-metadata.json` scaffolded empty, hand-filled, not auto-suggested
init_skill.py writes `command-metadata.json` as `[]\n` for H-class (line 603). The gate validates each entry's schema and cross-checks ownerMode↔mode-registry + command-definition-file existence (contract §3, command-metadata-schema.cjs). But nothing AUTO-SUGGESTS entries from `.opencode/commands/` owned by the hub. A scaffolder/generator could enumerate `.opencode/commands/<hub>/*.md` and emit stub entries (command, ownerMode from filename, description from doc), leaving userIntent/choreography for authoring. Currently the full burden is manual.
[SOURCE: init_skill.py:603; contract §3 "Why command-metadata.json is hub-required" lines 77-81]

### F3.4 — HIGH-LEVERAGE: graph-metadata validation is split across two surfaces, only one in CI
- The fleet gate `ci-skill-root-metadata.cjs` touches graph-metadata.json ONLY for the NESTED_IDENTITY check (`isSkillShapedGraph`, lines 131-137). It does NOT validate the `derived` schema, edge targets, or that `derived.key_files`/`source_docs` paths exist.
- Full graph-metadata schema + path-existence validation lives in the advisor's `skill_graph_compiler.py` (lines 294-396) and the TS lib `graph-metadata-parser.ts`/`graph-metadata-schema.ts`.
- The fleet gate does NOT call the advisor compiler (grep: no `skill_graph_compiler`/`advisor` reference in ci-skill-root-metadata.cjs). No `.github/` workflow references `skill_graph_compiler` either. The advisor's `package.json` scripts are build/typecheck/test (vitest) — the Python compiler is not in the npm test chain.
- Consequence: a skill can pass `ci-skill-root-metadata` (the fleet gate) yet carry a malformed `derived` block or broken key_files paths that only surface when the advisor graph is rebuilt. Two validation surfaces, not unified; the stronger one is not gated into CI.
[SOURCE: ci-skill-root-metadata.cjs:131-137; skill_graph_compiler.py:294-396; advisor package.json scripts; .github grep empty for skill_graph_compiler]

### F3.5 — Scaffolder emits all class-required files, but the rich `derived` shape has no template
init_skill.py H-class emits: SKILL.md, graph-metadata.json (minimal), description.json, mode-registry.json, hub-router.json, command-metadata.json (`[]`), leaf-manifest.config (forbidden for H — correct), plus playbook/benchmark trees. S-class emits: SKILL.md, graph-metadata.json (minimal), leaf-manifest.config.json, plus trees. So presence coverage is complete. The gap is shape: the scaffolded `derived` (5 fields) does not match the fleet's rich `derived` (10+ fields), and no template under `create-skill/assets/` documents the rich shape — the `graph-metadata.json` templates (contract §6) cover the top-level shape but the rich `derived` is learned by copying existing skills. No `--enrich-derived` generator exists.
[SOURCE: init_skill.py:270-329 (S), 515-603 (H); contract §6 templates lines 155-166]

## Sources Consulted
- init_skill.py:270-329, 490-579, 603
- generate-leaf-manifest.cjs:96-182
- ci-skill-root-metadata.cjs:1-70, 125-154
- sk-git/leaf-manifest.config.json
- skill_graph_compiler.py:294-396 (path validation)
- advisor mcp-server/package.json scripts; .github grep

## Assessment
- **newInfoRatio:** 0.80 — five automation findings; F3.1/F3.4 are high-leverage and new; F3.2/F3.3/F3.5 extend the scaffolder picture. Lower than iter 2 because the regenerator absence was already surfaced as F2.4; here it is scoped for feasibility.
- **Novelty justification:** First feasibility scoping of what a regenerator can/can't derive, and first confirmation that the fleet gate does not call the advisor compiler (the validation-split is a structural integration gap).
- **Confidence:** High on F3.4 (direct grep + read of gate); High on F3.2 (config fields + generator defaults); Medium-High on F3.1 feasibility (derivable fields inferred from schema + compiler validation, not from a prototype); Medium on F3.3 (auto-suggest is a design proposal, not a confirmed gap in existing tooling).

## Reflection
- **What worked:** Reading the generator's defaulting (generate-leaf-manifest.cjs:110) proved leaf-manifest.config is mostly boilerplate.
- **What failed:** Expected to find the advisor compiler wired into CI; it is not. The .github grep returning empty is itself the finding.
- **Ruled out:** None new.

## Recommended Next Focus
Iteration 4 — EFFECTIVENESS: does the JSON data actually drive routing well? (a) measure intent-signal coverage across the fleet (which skills have thin intent_signals vs rich); (b) trace how domains/intent_signals/derivedTriggers/derivedKeywords combine into a score (projection.ts + native-scorer); (c) assess whether the dead fields (F2.1) being present harms routing (noise) or is neutral; (d) check the compiled-route-manifest → advisor handoff and whether hub-router signals actually reach routing; (e) fleet-wide evenness of the dual signal source (F2.7).
