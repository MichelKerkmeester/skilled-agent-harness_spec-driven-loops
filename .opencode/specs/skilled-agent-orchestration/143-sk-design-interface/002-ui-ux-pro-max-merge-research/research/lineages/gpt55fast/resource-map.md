# GPT-5.5 Fast Lineage Resource Map

This map was emitted from lineage delta evidence. Packet-level `resource-map.md` was not present at init, so no coverage gate was applied.

## Lineage Artifacts

| Path | Purpose |
|---|---|
| `deep-research-config.json` | Immutable run config and lineage metadata. |
| `deep-research-state.jsonl` | Append-only config, iteration, convergence, and synthesis records. |
| `deep-research-strategy.md` | Runtime strategy, answered questions, dead ends, and next focus. |
| `deep-research-findings-registry.json` | Structured findings, resolved questions, terminal stop, and metrics. |
| `deep-research-dashboard.md` | Human-readable progress dashboard. |
| `research.md` | Final lineage synthesis. |

## Iteration Files

| Path | Focus |
|---|---|
| `iterations/iteration-001.md` | External repo inventory and license surface. |
| `iterations/iteration-002.md` | Data asset classification and script fit. |
| `iterations/iteration-003.md` | House layout, stack ownership, and attribution. |
| `iterations/iteration-004.md` | Convergence and negative knowledge. |

## Delta Files

| Path | Purpose |
|---|---|
| `deltas/iter-001.jsonl` | Iteration 1 record, findings, and ruled-out direction. |
| `deltas/iter-002.jsonl` | Iteration 2 record, findings, and ruled-out directions. |
| `deltas/iter-003.jsonl` | Iteration 3 record, findings, and ruled-out directions. |
| `deltas/iter-004.jsonl` | Iteration 4 record, convergence record, and final negative knowledge. |

## External Source Surfaces

| Path | Role In Research |
|---|---|
| `external/ui-ux-pro-max-skill-main/README.md` | Repo asset taxonomy and counts. |
| `external/ui-ux-pro-max-skill-main/CLAUDE.md` | Source-of-truth layout and sync rules. |
| `external/ui-ux-pro-max-skill-main/LICENSE` | MIT notice requirements. |
| `external/ui-ux-pro-max-skill-main/skill.json` | Packaging/distribution shape. |
| `external/ui-ux-pro-max-skill-main/src/ui-ux-pro-max/data/*.csv` | Primary design-intelligence datasets. |
| `external/ui-ux-pro-max-skill-main/src/ui-ux-pro-max/data/stacks/*.csv` | Stack-specific implementation guidance sampled for ownership boundary. |
| `external/ui-ux-pro-max-skill-main/src/ui-ux-pro-max/scripts/*.py` | Optional lookup/generator tooling assessed for adaptation. |
| `external/ui-ux-pro-max-skill-main/src/ui-ux-pro-max/templates/**` | Platform/base templates assessed for direct-merge risk. |

## Target Skill Surfaces

| Path | Role In Research |
|---|---|
| `.opencode/skills/sk-design-interface/SKILL.md` | Target runtime shape and routing authority. |
| `.opencode/skills/sk-design-interface/README.md` | Target overview, relationships, and verification notes. |
| `.opencode/skills/sk-design-interface/references/design_principles.md` | Primary design authority to preserve. |
| `.opencode/skills/sk-design-interface/LICENSE.txt` | Existing Apache-2.0 license and redistribution requirements. |
| `.opencode/skills/sk-design-interface/graph-metadata.json` | Structural skill relationship to `sk-code`. |
| `.opencode/skills/sk-code/SKILL.md` | Implementation ownership and current supported-surface boundary. |

## Coverage Summary

- External root docs: README, CLAUDE, LICENSE, skill.json.
- External data CSVs: products, styles, colors, typography, ux-guidelines, ui-reasoning, charts, landing, design, app-interface, icons, react-performance.
- External stack CSVs sampled: react, nextjs, html-tailwind, react-native, swiftui, flutter, shadcn, threejs.
- External scripts: search, core, design_system.
- External templates: base skill content, quick reference, OpenCode platform config.
- Target surfaces: runtime, README, license, graph metadata, design principles, sk-code boundary.

## Known Gaps

- Not every stack CSV was read; representative stack samples were sufficient for ownership classification.
- No target skill implementation files were modified by this lineage.
- Cross-lineage comparison is out of scope for this single-lineage synthesis.
