# GPT-5.5 Fast Lineage Research: ui-ux-pro-max Merge Into sk-interface-design

## Executive Summary

This lineage converged after 4 of 5 allowed iterations. The recommended merge direction is to adopt the external repo's high-value design intelligence as optional references/data, not to replace or bloat `sk-interface-design`'s current lean process.

Primary recommendation: preserve `sk-interface-design` as a design-lead workflow centered on `references/design_principles.md`, then add a separate optional `references/design_intelligence/` subtree for selected `ui-ux-pro-max` assets. Do not edit the target skill in this research lineage.

## Convergence Report

- Stop reason: converged; all key questions answered and novelty below threshold.
- Iterations completed: 4 of 5.
- Questions answered: 5/5.
- newInfoRatio trend: 0.90 -> 0.68 -> 0.46 -> 0.03.
- Convergence threshold: 0.05.
- Final newInfoRatio: 0.03.
- Average newInfoRatio: 0.52.
- Convergence decision: do not run iteration 5 unless new evidence is introduced. [SOURCE: .opencode/specs/skilled-agent-orchestration/143-sk-interface-design/002-ui-ux-pro-max-merge-research/research/lineages/gpt55fast/iterations/iteration-004.md:44-50]

## Key Findings

### 1. External Repo Value

The external repo is a data-driven design-intelligence toolkit. Its strongest merge value is not the installer or generated platform packages; it is the structured data: product recommendations, styles, colors, typography, UX guidance, chart guidance, reasoning rules, and optional lookup/generator scripts. [SOURCE: .opencode/specs/skilled-agent-orchestration/143-sk-interface-design/002-ui-ux-pro-max-merge-research/research/lineages/gpt55fast/iterations/iteration-001.md:15-19]

### 2. Asset Classification

Recommended classification:

| Asset class | Classification | Merge stance |
|---|---|---|
| `products.csv` | ADOPT | Product-to-design recommendation map. |
| `styles.csv` | ADOPT | Style records with fit, contraindications, accessibility, performance, prompts, and variables. |
| `colors.csv` | ADOPT | Semantic token palettes with WCAG-aware notes. |
| `typography.csv` | ADOPT | Concrete font pairing lookup; minor cleanup later. |
| `ui-reasoning.csv` | ADOPT | Structured guidance and anti-patterns, but not deterministic truth. |
| `charts.csv` | ADOPT | Chart selection, thresholds, a11y fallbacks, and interaction guidance. |
| `ux-guidelines.csv` | ADAPT | Compact QA/checklist reference, not a second principles doc. |
| `landing.csv` | ADAPT | Pattern catalog balanced against subject-specific design. |
| `design.csv` | ADAPT | Selective examples only; no wholesale copy. |
| `app-interface.csv` | ADAPT | Mobile/interface QA reference, not default web guidance. |
| `icons.csv` | SKIP direct | Phosphor-specific; preserve each app's icon system. |
| `react-performance.csv` | SKIP direct | Implementation performance belongs outside interface-design guidance. |
| `search.py` / `core.py` | ADAPT | Optional lookup tooling only. |
| `design_system.py` | ADAPT | Optional maintenance/research generator only. |
| Base/platform templates | SKIP direct | Packaging assumptions conflict with house skill shape. |

Evidence: [SOURCE: .opencode/specs/skilled-agent-orchestration/143-sk-interface-design/002-ui-ux-pro-max-merge-research/research/lineages/gpt55fast/iterations/iteration-002.md:34-53]

### 3. Recommended House Structure

Keep `SKILL.md` small. Keep `references/design_principles.md` as the primary authority. If implemented later, add a separate optional reference/data subtree:

```text
.opencode/skills/sk-interface-design/
  SKILL.md
  README.md
  LICENSE.txt
  THIRD_PARTY_NOTICES.md
  references/
    design_principles.md
    design_intelligence/
      README.md
      asset-matrix.md
      pattern-catalog.md
      data/
        products.csv
        styles.csv
        colors.csv
        typography.csv
        ui-reasoning.csv
        charts.csv
  scripts/
    design_lookup.py
```

`scripts/design_lookup.py` should be optional only if raw CSV lookup is needed. Runtime routing should never require Python search/generator execution for every design task. [SOURCE: .opencode/specs/skilled-agent-orchestration/143-sk-interface-design/002-ui-ux-pro-max-merge-research/research/lineages/gpt55fast/iterations/iteration-003.md:29-52]

### 4. Stack Ownership

Do not merge the stack CSVs wholesale into `sk-interface-design`. Most rows are implementation checklists for React, Next.js, React Native, SwiftUI, Flutter, shadcn, Tailwind, and Three.js. Adapt only cross-cutting design-quality fragments such as focus visibility, touch target size, reduced motion, semantic color tokens, chart theming, canvas labels, and layout-stability reminders. [SOURCE: .opencode/specs/skilled-agent-orchestration/143-sk-interface-design/002-ui-ux-pro-max-merge-research/research/lineages/gpt55fast/iterations/iteration-003.md:22-25]

Also do not claim current `sk-code` already owns every external stack. Current `sk-code` explicitly supports Webflow/frontend and OpenCode surfaces and rejects unsupported generic stacks unless future routes are added. [SOURCE: .opencode/specs/skilled-agent-orchestration/143-sk-interface-design/002-ui-ux-pro-max-merge-research/research/lineages/gpt55fast/iterations/iteration-003.md:23-24]

### 5. Attribution And License Path

Do not replace the existing Apache-2.0 `LICENSE.txt` or present future mixed-source content under one unqualified license. If any substantial `ui-ux-pro-max` content is copied or adapted, add a separate MIT notice/license file such as `THIRD_PARTY_NOTICES.md` or `licenses/ui-ux-pro-max-MIT.txt`, and update README/SKILL metadata to identify Apache-2.0 for the Anthropic base plus MIT for incorporated `ui-ux-pro-max` data. [SOURCE: .opencode/specs/skilled-agent-orchestration/143-sk-interface-design/002-ui-ux-pro-max-merge-research/research/lineages/gpt55fast/iterations/iteration-003.md:26-27]

## Final Negative Knowledge

- Do not merge external installer, marketplace, CLI, or platform-template plumbing.
- Do not inline large CSVs or generated design-system text into `SKILL.md`.
- Do not replace the Anthropic-derived `references/design_principles.md`.
- Do not make `search.py`, `core.py`, or `design_system.py` mandatory runtime steps.
- Do not use `design_system.py --persist` as a default house workflow.
- Do not make Phosphor the default icon system.
- Do not absorb React/Next/React Native/SwiftUI/Flutter implementation checklists into `sk-interface-design`.
- Do not imply current `sk-code` already supports those generic stack routes.
- Do not use `ui-reasoning.csv` as deterministic truth; it should guide, not override the brief and critique process.
- Do not collapse Apache-2.0 and MIT material under one unqualified license label. [SOURCE: .opencode/specs/skilled-agent-orchestration/143-sk-interface-design/002-ui-ux-pro-max-merge-research/research/lineages/gpt55fast/iterations/iteration-004.md:21-33]

## Implementation Guidance For A Future Packet

- Start with references/data, not runtime logic.
- Add adopted CSVs only if the packet accepts data-file bulk.
- Add adapted prose as concise reference docs, not as main `SKILL.md` expansion.
- Add optional lookup tooling only after data size justifies it.
- Include license/notice updates in the same implementation packet as copied MIT-derived content.
- Run target skill validation and advisor discovery after any actual skill changes.

## Residual Risks

- Exact filenames are recommendations, not a binding implementation plan.
- Cross-lineage synthesis may prefer different naming or a smaller subset.
- If implementation later copies substantial raw CSV content, license/notice handling becomes mandatory, not optional.

## References

- `iterations/iteration-001.md`
- `iterations/iteration-002.md`
- `iterations/iteration-003.md`
- `iterations/iteration-004.md`
- `deep-research-findings-registry.json`
- `deep-research-state.jsonl`
- `resource-map.md`
