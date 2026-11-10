# Iteration 7: Surface Checklist Routing and Ownership

## Focus

Angle 7 investigates how the quality mode chooses surface-specific checklists and whether a surface packet can own its checklist. The open question also asks where repository-level quality settings could live without a hub fork. [SOURCE: specs/sk-code/014-code-modes-research/001-quality-mode-research/research/deep-research-strategy.md:41] `How should a surface packet or a user-authored workflow or surface mode plug into sk-code-quality`

## Actions Taken

1. Read the run config, state log, strategy and prior iteration records before examining target sources.
2. Inspected the quality mode's target-path checklist map, CI and SKILLED surface resource maps, the mode registry and the parent router's surface-aware loading rules.
3. Used local files only. No network source, checker or test was used.

## Findings

1. **OBSERVED:** The quality workflow first resolves the surface and phase, then selects an authoring checklist from the target path. Its machine-readable call sequence uses the target path to select the path-keyed checklist. [SOURCE: .skilled/skills/sk-code/sk-code-quality/SKILL.md:77] `select target-path authoring checklist` [SOURCE: .skilled/skills/sk-code/sk-code-quality/SKILL.md:167] `get_routing_key() from target path` The explicit map names .skilled/skills/, .skilled/agents/, .skilled/commands/, MCP server sources, .opencode/specs/ and OpenCode language/config files. [SOURCE: .skilled/skills/sk-code/sk-code-quality/SKILL.md:112] `Target-Path Checklist Map` [SOURCE: .skilled/skills/sk-code/sk-code-quality/SKILL.md:116] `.skilled/skills/` [SOURCE: .skilled/skills/sk-code/sk-code-quality/SKILL.md:121] `OpenCode language/config files`

2. **DERIVED:** Surface packets can own their intent-to-resource map and checklist assets. The SKILLED surface includes universal and language checklists in CODE_QUALITY. [SOURCE: .skilled/skills/sk-code/sk-code-skilled/SKILL.md:95] `"CODE_QUALITY": [` [SOURCE: .skilled/skills/sk-code/sk-code-skilled/SKILL.md:96] `assets/checklists/universal-checklist.md` The CI surface maps CI_WORKFLOW to workflow rule references. [SOURCE: .skilled/skills/sk-code/sk-code-ci/SKILL.md:64] `RESOURCE_MAP = {` [SOURCE: .skilled/skills/sk-code/sk-code-ci/SKILL.md:66] `references/ci-workflow-standards.md` The parent router loads the detected surface's slice and defers assets/checklists to on-demand. [SOURCE: .skilled/skills/sk-code/ROUTER.md:389] `only the **detected surface's** slice` [SOURCE: .skilled/skills/sk-code/ROUTER.md:391] `checklists, recipes, templates` The registry describes surface packets as read-only evidence bundles. [SOURCE: .skilled/skills/sk-code/mode-registry.json:18] `Declares the SURFACE axis`

3. **INFERRED:** The inspected contracts expose no repository-local checklist configuration key. The quality workflow names a fixed target-path map, while the registry's surface declaration covers packet identity and bundling. [SOURCE: .skilled/skills/sk-code/sk-code-quality/SKILL.md:112] `Target-Path Checklist Map` [SOURCE: .skilled/skills/sk-code/mode-registry.json:18] `Declares the SURFACE axis` A repository-owned surface packet is a plausible home for local policy under its assets/checklists/ directory, with a resource-map entry that the quality workflow can consume. Automatic selection needs an explicit lookup contract. A user-authored surface fixture passed through both routing stages would confirm the proposed extension.

## Questions Answered

How should a surface packet or a user-authored workflow or surface mode plug into sk-code-quality, and where could a repository keep its own quality configuration without forking the hub?

**DERIVED:** A surface can declare checklist resources in its own packet, and the hub can bundle that packet as evidence. The quality workflow currently selects by its explicit target-path map. A repository can keep local policy in a repository-owned surface packet, with a quality lookup contract required for automatic selection. [SOURCE: .skilled/skills/sk-code/sk-code-quality/SKILL.md:167] `get_routing_key() from target path` [SOURCE: .skilled/skills/sk-code/sk-code-skilled/SKILL.md:95] `"CODE_QUALITY": [` [SOURCE: .skilled/skills/sk-code/mode-registry.json:18] `Declares the SURFACE axis`

## Questions Remaining

- Which behaviors may no recommendation relax, and how would a later change to sk-code-quality be proven through both routing stages?

## Next Focus

Inspect the non-relaxable quality behaviors and how to prove a quality change through both hub routing stages. The strategy names this as the remaining key question. [SOURCE: specs/sk-code/014-code-modes-research/001-quality-mode-research/research/deep-research-strategy.md:42] `Which behaviors may no recommendation relax`

## Ruled Out

- No network research was attempted because the strategy's non-goals prohibit it.
- No implementation or checklist authoring was attempted because this is a research iteration.

## Dead Ends

None identified.

## Edge Cases

- Ambiguous input: none; the dispatch supplies the Angle 7 focus and packet path.
- Contradictory evidence: none found in the inspected contracts.
- Missing dependencies: none.
- Partial success: the repo-local configuration location remains an inferred extension point, not a current supported setting.

## Sources Consulted

- [SOURCE: .skilled/skills/sk-code/sk-code-quality/SKILL.md:77] `select target-path authoring checklist`
- [SOURCE: .skilled/skills/sk-code/sk-code-quality/SKILL.md:167] `get_routing_key() from target path`
- [SOURCE: .skilled/skills/sk-code/sk-code-skilled/SKILL.md:95] `"CODE_QUALITY": [`
- [SOURCE: .skilled/skills/sk-code/sk-code-ci/SKILL.md:64] `RESOURCE_MAP = {`
- [SOURCE: .skilled/skills/sk-code/ROUTER.md:391] `checklists, recipes, templates`
- [SOURCE: .skilled/skills/sk-code/mode-registry.json:18] `Declares the SURFACE axis`
- [SOURCE: specs/sk-code/014-code-modes-research/001-quality-mode-research/research/deep-research-strategy.md:41] `How should a surface packet or a user-authored workflow or surface mode plug into sk-code-quality`

## Assessment

- New information ratio: 0.60. The three findings extend earlier routing and portability evidence; a 0.10 synthesis bonus applies because they give surface-owned checklists and target-path selection a shared ownership model.
- Questions addressed: the surface checklist ownership and repo-local configuration question.
- Questions answered: How should a surface packet or a user-authored workflow or surface mode plug into sk-code-quality, and where could a repository keep its own quality configuration without forking the hub?

## Reflection

The target-path map and surface resource maps are separate contracts, which explains how a checklist can exist in a surface packet without automatic selection by the quality workflow. The inspected contracts do not establish repository-local discovery. A user-authored surface fixture and router replay would answer that next.

## Recommended Next Focus

Answer the remaining no-relaxation and two-stage proof question by tracing the quality invariants and the route replay checks that enforce them.
