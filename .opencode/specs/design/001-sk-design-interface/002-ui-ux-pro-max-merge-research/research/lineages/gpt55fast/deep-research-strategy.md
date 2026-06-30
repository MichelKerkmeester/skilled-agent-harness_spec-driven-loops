---
title: Deep Research Strategy - gpt55fast lineage
description: Runtime strategy for the gpt-5.5-fast fan-out lineage researching ui-ux-pro-max merge recommendations for sk-design-interface.
---

# Deep Research Strategy - gpt55fast Lineage

## 1. OVERVIEW

This lineage investigates how the vendored `ui-ux-pro-max-skill-main` repository can improve `sk-design-interface` without bloating the house skill or changing implementation in this research packet.

## 2. TOPIC

ui-ux-pro-max merge into sk-design-interface

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)

- [x] All key questions answered; proceed to synthesis. (iteration 4)

<!-- /ANCHOR:key-questions -->

## 4. NON-GOALS

- Do not edit `.opencode/skills/sk-design-interface/` in this packet.
- Do not rewrite or re-derive the external repo data.
- Do not evaluate `mcp-magicpath` except where it is already a related skill edge for `sk-design-interface`.
- Do not write outside this lineage artifact directory.

## 5. STOP CONDITIONS

- Stop after five iterations or earlier if all key questions have evidence-backed answers and remaining novelty is below threshold.
- Stop immediately if research would require modifying target skill files or packet documents outside this lineage directory.
- Stop with gaps if the external repo cannot be inspected locally.

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS

- Asset-class classification is mostly answered: adopt `products.csv`, `styles.csv`, `colors.csv`, `typography.csv`, `ui-reasoning.csv`, and `charts.csv` as data references; adapt `ux-guidelines.csv`, `landing.csv`, `design.csv`, `app-interface.csv`, quick-reference taxonomy, and optional lookup/generator scripts; skip direct Phosphor icon imports, direct React performance merge, and external platform templates. (iteration 2)
- Tooling fit is partially answered: `search.py`/`core.py` and `design_system.py` are useful optional lookup/maintenance tooling, but should not become a mandatory runtime workflow or persistence path. (iteration 2)
- House structure is answered: keep `SKILL.md` lean, preserve `references/design_principles.md` as primary authority, and put adopted/adapted external content under an optional `references/design_intelligence/` subtree with a separate notice file if implemented later. (iteration 3)
- Stack ownership is answered: skip direct stack CSV merge into `sk-design-interface`; adapt only cross-cutting design-quality fragments, and leave true implementation-stack adoption to future `sk-code` surface work. (iteration 3)
- License path is answered: preserve the current Apache-2.0 Anthropic license/notice and add a separate MIT notice or license file for ui-ux-pro-max-derived content. (iteration 3)
- Negative knowledge is answered: preserve the stable do-not-merge list covering platform plumbing, SKILL.md data dumps, generator mandates, Phosphor defaults, stack-rule absorption, current `sk-code` overclaiming, and single-license collapse. (iteration 4)

<!-- /ANCHOR:answered-questions -->

<!-- MACHINE-OWNED: START -->

<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED

- Reading root metadata, source-of-truth docs, and target skill docs separated reusable data assets from packaging-only surfaces. (iteration 1)
- Sampling CSV headers and representative rows produced a concrete per-asset ADOPT/ADAPT/SKIP matrix. (iteration 2)
- Locating actual `src/ui-ux-pro-max/scripts` and `src/ui-ux-pro-max/templates` clarified that reusable tooling is separate from CLI/platform packaging copies. (iteration 2)
- Reading current target metadata kept the recommendation aligned with the lean house skill shape. (iteration 3)
- Representative stack CSV inspection showed most stack guidance is implementation-specific and should not be absorbed into interface design. (iteration 3)
- Consolidating prior findings showed no contradiction between asset adoption, optional tooling, house layout, stack boundaries, and license recommendations. (iteration 4)

<!-- /ANCHOR:what-worked -->

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED

- Exact initial glob of the expected external path returned no files until the broader packet tree was listed; continue using the verified full external repo path. (iteration 1)
- Looking for root-level `scripts/` and `templates/` failed; source-of-truth tooling lives below `src/ui-ux-pro-max/`. (iteration 2)
- Treating stack CSVs as already owned by current `sk-code` failed because current `sk-code` does not support the generic React/Next/React Native/SwiftUI/Flutter stack routes. (iteration 3)
- Running a fifth iteration without new evidence would likely repeat covered sources rather than answer an open question. (iteration 4)

<!-- /ANCHOR:what-failed -->

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)

### Installer/platform-template direct merge -- BLOCKED (iteration 1, 1 attempt)

- What was tried: Treat external CLI and platform template plumbing as a direct merge candidate.
- Why blocked: It serves external multi-assistant installation, while the house skill already has `.opencode/skills/` packaging and advisor metadata.
- Do NOT retry: Direct CLI/marketplace plumbing merge into `sk-design-interface`.

### Direct icon-library preference -- BLOCKED (iteration 2, 1 attempt)

- What was tried: Treat `icons.csv` as a mergeable icon guidance table.
- Why blocked: It encodes Phosphor-specific imports and would override each app's existing icon library or design system.
- Do NOT retry: Directly recommending Phosphor as the house default.

### Direct React performance merge -- BLOCKED (iteration 2, 1 attempt)

- What was tried: Treat `react-performance.csv` as interface-design guidance.
- Why blocked: It is primarily implementation guidance owned by `sk-code`.
- Do NOT retry: Absorbing React/Next performance tables into `sk-design-interface` beyond design-relevant cross-references.

### Mandatory external design-system runtime -- BLOCKED (iteration 2, 1 attempt)

- What was tried: Consider making the external `--design-system --persist` flow required.
- Why blocked: It writes project design-system docs and adds runtime/persistence behavior that conflicts with the lean house skill.
- Do NOT retry: Mandatory runtime persistence as part of the design skill.

### Wholesale stack CSV merge -- BLOCKED (iteration 3, 1 attempt)

- What was tried: Treat external stack CSVs as mergeable `sk-design-interface` references.
- Why blocked: Most rows are framework implementation checklists rather than aesthetic-direction guidance.
- Do NOT retry: Moving stack CSVs wholesale into `sk-design-interface`.

### Single-license replacement -- BLOCKED (iteration 3, 1 attempt)

- What was tried: Consider treating the merged skill under one unqualified license label.
- Why blocked: The current target carries Apache-2.0 Anthropic attribution and external MIT material requires preserving a separate copyright/permission notice.
- Do NOT retry: Replacing Apache-2.0 or MIT notices with a single generic statement.

### Iteration 5 without new evidence -- BLOCKED (iteration 4, 1 attempt)

- What was tried: Consider continuing to the configured max iteration.
- Why blocked: All key questions are answered and novelty fell below the 0.05 threshold.
- Do NOT retry: A fifth pass for this lineage unless new source material is introduced.

<!-- /ANCHOR:exhausted-approaches -->

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS

- Directly merging installer and platform-template plumbing; it adds maintenance burden without improving the target skill's design guidance. (iteration 1, evidence: .opencode/specs/design/001-sk-design-interface/external/ui-ux-pro-max-skill-main/skill.json:20-40)
- Directly merging Phosphor icon imports; preserve the app's existing icon system instead. (iteration 2, evidence: .opencode/specs/design/001-sk-design-interface/external/ui-ux-pro-max-skill-main/src/ui-ux-pro-max/data/icons.csv:1-28)
- Directly merging React/Next performance rules; keep implementation performance primarily under `sk-code`. (iteration 2, evidence: .opencode/specs/design/001-sk-design-interface/external/ui-ux-pro-max-skill-main/src/ui-ux-pro-max/data/react-performance.csv:1-16)
- Copying the giant generated `design.csv` corpus wholesale into `SKILL.md` or the main principles reference. (iteration 2, evidence: .opencode/specs/design/001-sk-design-interface/external/ui-ux-pro-max-skill-main/src/ui-ux-pro-max/data/design.csv:1-80)
- Making external `--design-system --persist` mandatory; it writes separate project docs and conflicts with the house skill's lean reference workflow. (iteration 2, evidence: .opencode/specs/design/001-sk-design-interface/external/ui-ux-pro-max-skill-main/src/ui-ux-pro-max/templates/base/skill-content.md:77-109)
- Moving stack CSVs wholesale into `sk-design-interface`; most content belongs to implementation-stack guidance or future `sk-code` expansion. (iteration 3, evidence: .opencode/specs/design/001-sk-design-interface/external/ui-ux-pro-max-skill-main/src/ui-ux-pro-max/data/stacks/react.csv:1-54)
- Treating current `sk-code` as already covering all external stack CSVs. (iteration 3, evidence: .opencode/skills/sk-code/SKILL.md:240-245)
- Replacing existing Apache-2.0 notices or external MIT notices with one unqualified license statement. (iteration 3, evidence: .opencode/skills/sk-design-interface/LICENSE.txt:90-122)
- Continuing to iteration 5 without new evidence; iteration 4 reached 0.03 novelty with 5/5 questions answered. (iteration 4, evidence: .opencode/specs/design/001-sk-design-interface/002-ui-ux-pro-max-merge-research/research/lineages/gpt55fast/iterations/iteration-004.md:45-51)

<!-- /ANCHOR:ruled-out-directions -->

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS

Synthesize this lineage into `research.md` and emit a lineage `resource-map.md`.

<!-- /ANCHOR:next-focus -->

<!-- MACHINE-OWNED: END -->

## 12. KNOWN CONTEXT

- Packet spec states the external repo is MIT-licensed and includes styles, palettes, type pairings, product reasoning, UX guidelines, stack guides, BM25 search, and a design-system generator. [SOURCE: .opencode/specs/design/001-sk-design-interface/002-ui-ux-pro-max-merge-research/spec.md:55-61]
- Packet scope requires per-asset ADOPT/ADAPT/SKIP classification, house-structure mapping, licensing path, cross-lineage comparison, and negative knowledge. [SOURCE: .opencode/specs/design/001-sk-design-interface/002-ui-ux-pro-max-merge-research/spec.md:71-95]
- `sk-design-interface` is currently a lean router plus one full principles reference, with `sk-code` implementation handoff and Apache-2.0 Anthropic attribution. [SOURCE: .opencode/skills/sk-design-interface/SKILL.md:14-17]
- Memory context returned no prior packet-specific research results; this lineage starts from local source evidence.
- resource-map.md not present; skipping coverage gate.

## 13. RESEARCH BOUNDARIES

- Max iterations: 5
- Convergence threshold: 0.05
- Per-iteration budget: 12 tool calls, 10 minutes
- Progressive synthesis: true
- Current generation: 1
- Started: 2026-06-13T16:23:40Z
