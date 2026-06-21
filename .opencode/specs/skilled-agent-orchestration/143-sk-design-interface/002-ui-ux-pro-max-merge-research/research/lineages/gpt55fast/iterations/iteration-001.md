# Iteration 1: External Repo Inventory And License Surface

## Focus

Inventory the vendored `ui-ux-pro-max-skill-main` repo structure, declared asset classes, installer shape, and licensing so later iterations can classify merge fit.

## Actions Taken

- Read the packet spec for scope, success criteria, and source paths.
- Read the external repo `README.md`, `skill.json`, `LICENSE`, `CLAUDE.md`, source-of-truth doc, and base templates.
- Read the current `sk-design-interface` `SKILL.md`, `README.md`, `graph-metadata.json`, and principles reference.

## Findings

- The external repo is materially a data-driven design-intelligence toolkit, not just prose guidance: its README advertises 67 UI styles, 161 color palettes, 57 font pairings, 25 chart types, 15 tech stacks, 99 UX guidelines, and 161 reasoning rules. [SOURCE: .opencode/specs/skilled-agent-orchestration/143-sk-design-interface/external/ui-ux-pro-max-skill-main/README.md:151-159]
- The strongest merge candidates are the reusable data and reasoning assets, because the source-of-truth architecture explicitly separates `src/ui-ux-pro-max/data/`, `scripts/`, and `templates/`; generated platform folders and CLI assets are downstream packaging surfaces. [SOURCE: .opencode/specs/skilled-agent-orchestration/143-sk-design-interface/external/ui-ux-pro-max-skill-main/CLAUDE.md:30-60]
- The external package metadata confirms MIT licensing, broad platform targeting, and an installer-oriented distribution model, none of which directly matches the lean house skill shape. [SOURCE: .opencode/specs/skilled-agent-orchestration/143-sk-design-interface/external/ui-ux-pro-max-skill-main/skill.json:1-40]
- The MIT license permits copying, modifying, merging, publishing, sublicensing, and selling, but requires preserving the copyright and permission notice in substantial copies. [SOURCE: .opencode/specs/skilled-agent-orchestration/143-sk-design-interface/external/ui-ux-pro-max-skill-main/LICENSE:1-13]
- `sk-design-interface` is intentionally lean: the runtime `SKILL.md` routes design tasks to one full `references/design_principles.md` file and hands implementation to `sk-code`. A direct dump of the external skill content into `SKILL.md` would conflict with that structure. [SOURCE: .opencode/skills/sk-design-interface/SKILL.md:14-17]

## Questions Answered

- Partially answered asset classification: data and reasoning assets are high-potential; CLI/marketplace plumbing is low-fit for direct merge.
- Partially answered licensing: MIT content can be merged if notice/attribution is preserved.

## Questions Remaining

- Which specific CSV/data classes should be ADOPT, ADAPT, or SKIP?
- Should BM25 search and design-system generation remain runtime tooling, maintenance tooling, or be excluded?
- What exact house directory layout should carry adopted assets?

## Ruled Out

- Directly merging external installer/platform plumbing into `sk-design-interface`; the external repo is built to install across many AI assistants, while the house skill already has a native `.opencode/skills/` packaging model. [SOURCE: .opencode/specs/skilled-agent-orchestration/143-sk-design-interface/external/ui-ux-pro-max-skill-main/README.md:254-293]

## Sources Consulted

- .opencode/specs/skilled-agent-orchestration/143-sk-design-interface/002-ui-ux-pro-max-merge-research/spec.md:55-95
- .opencode/specs/skilled-agent-orchestration/143-sk-design-interface/external/ui-ux-pro-max-skill-main/README.md:151-159
- .opencode/specs/skilled-agent-orchestration/143-sk-design-interface/external/ui-ux-pro-max-skill-main/CLAUDE.md:30-60
- .opencode/specs/skilled-agent-orchestration/143-sk-design-interface/external/ui-ux-pro-max-skill-main/skill.json:1-40
- .opencode/specs/skilled-agent-orchestration/143-sk-design-interface/external/ui-ux-pro-max-skill-main/LICENSE:1-13
- .opencode/skills/sk-design-interface/SKILL.md:14-17

## Assessment

- newInfoRatio: 0.90
- Novelty justification: First evidence pass established the repo's asset taxonomy, source-of-truth layout, installer split, target skill constraints, and license boundary.
- Confidence: High for repo structure and license; medium for final classification until CSV/script contents are inspected.

## Reflection

- What worked and why: Reading the root metadata plus source-of-truth docs separated reusable assets from packaging-only surfaces.
- What did not work and why: The initial exact glob for the external path returned no files until the broader packet tree was listed; future iterations should use the verified full path.
- What I would do differently: Inspect representative CSVs and scripts next before making final ADOPT/ADAPT/SKIP calls.

## Recommended Next Focus

Inspect CSV data classes for content quality, overlap with existing design principles, and fit as references/data under `sk-design-interface`.

## Dead Ends

- Installer/platform-template merge: skip direct adoption because house skill packaging already exists and platform bootstrap code would add maintenance burden without improving design guidance. [SOURCE: .opencode/specs/skilled-agent-orchestration/143-sk-design-interface/external/ui-ux-pro-max-skill-main/skill.json:20-40]
