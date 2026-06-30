# Iteration 2: Data Asset Classification And Script Fit

## Focus

Classify the external `src/ui-ux-pro-max/data` and `src/ui-ux-pro-max/scripts` surfaces as ADOPT, ADAPT, or SKIP for a future `sk-design-interface` merge recommendation.

## Actions Taken

- Read the current lineage config, state log, strategy, dashboard, registry, and iteration 1 artifacts.
- Read representative data files: `products.csv`, `styles.csv`, `colors.csv`, `typography.csv`, `ux-guidelines.csv`, `ui-reasoning.csv`, `charts.csv`, `design.csv`, `landing.csv`, `app-interface.csv`, `icons.csv`, and `react-performance.csv`.
- Located actual script and template paths under `src/ui-ux-pro-max/` after root-level `scripts/` and `templates/` were absent.
- Read source-of-truth scripts: `search.py`, `core.py`, and `design_system.py`.
- Read base and OpenCode templates to compare reusable guidance against packaging/platform boilerplate.

## Findings

- ADOPT as data reference, not inline prose: `products.csv` is a strong product-to-design recommendation map. It ties product types to style recommendations, landing patterns, dashboard styles, palette focus, and key considerations, which directly supports brief-specific design direction. [SOURCE: .opencode/specs/design/001-sk-design-interface/external/ui-ux-pro-max-skill-main/src/ui-ux-pro-max/data/products.csv:1-20]
- ADOPT as data reference: `styles.csv` is one of the highest-value assets because each style record includes best-fit contexts, contraindications, light/dark support, performance, accessibility, framework compatibility, prompt keywords, CSS keywords, checklists, and design variables. [SOURCE: .opencode/specs/design/001-sk-design-interface/external/ui-ux-pro-max-skill-main/src/ui-ux-pro-max/data/styles.csv:1-10]
- ADOPT as token data: `colors.csv` already uses semantic token columns (`Primary`, `On Primary`, `Background`, `Foreground`, `Destructive`, `Ring`) and records WCAG-driven adjustments in notes, making it more useful as a token reference than as prose. [SOURCE: .opencode/specs/design/001-sk-design-interface/external/ui-ux-pro-max-skill-main/src/ui-ux-pro-max/data/colors.csv:1-18]
- ADOPT with light cleanup: `typography.csv` gives concrete heading/body pairings, Google Fonts URLs, CSS imports, Tailwind snippets, and fit notes. It should be used as a lookup reference, with future cleanup for duplicate numbering and non-Google alternatives noted in rows such as Premium Sans and Startup Bold. [SOURCE: .opencode/specs/design/001-sk-design-interface/external/ui-ux-pro-max-skill-main/src/ui-ux-pro-max/data/typography.csv:1-21]
- ADAPT into checklist/reference: `ux-guidelines.csv` is broad and actionable, but it overlaps the existing `design_principles.md` quality floor. Its best fit is a compact UX QA checklist or searchable data reference, not a second full principles document. [SOURCE: .opencode/specs/design/001-sk-design-interface/external/ui-ux-pro-max-skill-main/src/ui-ux-pro-max/data/ux-guidelines.csv:1-24] [SOURCE: .opencode/skills/sk-design-interface/references/design_principles.md:71-87]
- ADOPT as reasoning data with guardrails: `ui-reasoning.csv` links product categories to recommended patterns, style priorities, color/typography moods, effects, decision rules, anti-patterns, and severity. It is valuable for structured recommendations, but should be presented as guidance rather than deterministic truth. [SOURCE: .opencode/specs/design/001-sk-design-interface/external/ui-ux-pro-max-skill-main/src/ui-ux-pro-max/data/ui-reasoning.csv:1-19]
- ADOPT for data-viz support: `charts.csv` adds chart type selection, thresholds, accessibility grades, a11y fallbacks, library recommendations, and interaction levels. This fills a gap in the current house reference, which focuses on general interface aesthetics and writing rather than chart design. [SOURCE: .opencode/specs/design/001-sk-design-interface/external/ui-ux-pro-max-skill-main/src/ui-ux-pro-max/data/charts.csv:1-12]
- ADAPT: `landing.csv` is useful as a pattern catalog, but the house skill should not blindly optimize for conversion metrics; the current principles require grounding design in the subject and avoiding template defaults. [SOURCE: .opencode/specs/design/001-sk-design-interface/external/ui-ux-pro-max-skill-main/src/ui-ux-pro-max/data/landing.csv:1-18] [SOURCE: .opencode/skills/sk-design-interface/references/design_principles.md:35-64]
- ADAPT selectively, do not copy wholesale: `design.csv` is a very large generated design-system corpus with full mobile-style specifications, including detailed token systems and component recipes. It can seed examples or edge-case style directions, but wholesale inclusion would bloat `sk-design-interface` and override the current brainstorm-critique workflow. [SOURCE: .opencode/specs/design/001-sk-design-interface/external/ui-ux-pro-max-skill-main/src/ui-ux-pro-max/data/design.csv:1-80] [SOURCE: .opencode/skills/sk-design-interface/references/design_principles.md:57-68]
- SKIP direct merge of icon imports: `icons.csv` is Phosphor-specific import guidance. It may be useful as vocabulary, but direct adoption would introduce a library preference where the house skill should usually preserve the app's existing icon system. [SOURCE: .opencode/specs/design/001-sk-design-interface/external/ui-ux-pro-max-skill-main/src/ui-ux-pro-max/data/icons.csv:1-28]
- SKIP direct merge of React performance rules into `sk-design-interface`: `react-performance.csv` is useful implementation guidance, but performance and React-code decisions are already owned by `sk-code`; only design-relevant reminders such as reduced motion, image/font loading, and layout stability should be cross-referenced. [SOURCE: .opencode/specs/design/001-sk-design-interface/external/ui-ux-pro-max-skill-main/src/ui-ux-pro-max/data/react-performance.csv:1-16] [SOURCE: .opencode/skills/sk-design-interface/SKILL.md:14-17]
- ADAPT mobile-native guidance: `app-interface.csv` covers iOS/Android/React Native accessibility, touch, navigation, state, feedback, safe areas, theming, and gesture-only anti-patterns. It should become a mobile/interface QA reference, not the default path for all web UI work. [SOURCE: .opencode/specs/design/001-sk-design-interface/external/ui-ux-pro-max-skill-main/src/ui-ux-pro-max/data/app-interface.csv:1-31]
- ADAPT `search.py` plus `core.py` only if the adopted data remains too large for static references. The implementation is useful because it supports domain and stack search, JSON output, domain auto-detection, BM25 ranking, regex-free tokenization, and zero external dependencies; however, adding runtime Python calls to every design task would be heavier than the current skill shape. [SOURCE: .opencode/specs/design/001-sk-design-interface/external/ui-ux-pro-max-skill-main/src/ui-ux-pro-max/scripts/search.py:56-114] [SOURCE: .opencode/specs/design/001-sk-design-interface/external/ui-ux-pro-max-skill-main/src/ui-ux-pro-max/scripts/core.py:17-72] [SOURCE: .opencode/specs/design/001-sk-design-interface/external/ui-ux-pro-max-skill-main/src/ui-ux-pro-max/scripts/core.py:103-195]
- ADAPT `design_system.py` as optional maintenance or research tooling, not as an always-required runtime. It aggregates product, style, color, landing, and typography searches, applies reasoning rules, and emits a complete recommendation object, but its persistence mode writes `design-system/MASTER.md` and page overrides outside the house skill's existing workflow. [SOURCE: .opencode/specs/design/001-sk-design-interface/external/ui-ux-pro-max-skill-main/src/ui-ux-pro-max/scripts/design_system.py:27-33] [SOURCE: .opencode/specs/design/001-sk-design-interface/external/ui-ux-pro-max-skill-main/src/ui-ux-pro-max/scripts/design_system.py:163-246] [SOURCE: .opencode/specs/design/001-sk-design-interface/external/ui-ux-pro-max-skill-main/src/ui-ux-pro-max/templates/base/skill-content.md:77-109]
- SKIP direct template merge: the external base template assumes Python installation, a required `--design-system` step, and a React Native-only stack posture; that conflicts with the house skill's lean multi-surface role and `sk-code` implementation handoff. [SOURCE: .opencode/specs/design/001-sk-design-interface/external/ui-ux-pro-max-skill-main/src/ui-ux-pro-max/templates/base/skill-content.md:5-18] [SOURCE: .opencode/specs/design/001-sk-design-interface/external/ui-ux-pro-max-skill-main/src/ui-ux-pro-max/templates/base/skill-content.md:50-64] [SOURCE: .opencode/specs/design/001-sk-design-interface/external/ui-ux-pro-max-skill-main/src/ui-ux-pro-max/templates/base/skill-content.md:134-140]
- ADAPT the quick-reference priority taxonomy, but not verbatim. It has useful priority ordering for accessibility, touch, performance, style, responsive layout, typography, animation, forms, navigation, and charts, yet it is bilingual and broader than the current house skill's concise reference style. [SOURCE: .opencode/specs/design/001-sk-design-interface/external/ui-ux-pro-max-skill-main/src/ui-ux-pro-max/templates/base/quick-reference.md:39-54]

## Asset Classification Summary

| Asset class | Classification | Rationale |
|---|---|---|
| `products.csv` | ADOPT | Strong product-to-design mapping for brief-specific recommendations. |
| `styles.csv` | ADOPT | High-density style records with fit, contraindications, accessibility, performance, prompts, and tokens. |
| `colors.csv` | ADOPT | Semantic token palettes with WCAG-adjusted notes. |
| `typography.csv` | ADOPT | Concrete type pairings and implementation snippets; needs minor cleanup. |
| `ui-reasoning.csv` | ADOPT | Structured recommendation rules and anti-patterns, guarded as guidance. |
| `charts.csv` | ADOPT | Distinct chart-selection and accessibility guidance not covered by current principles. |
| `ux-guidelines.csv` | ADAPT | Useful QA checklist, but overlaps current quality floor. |
| `landing.csv` | ADAPT | Useful pattern catalog, but conversion-first framing must be balanced against subject-specific design. |
| `design.csv` | ADAPT | Large generated design systems; extract selectively only. |
| `app-interface.csv` | ADAPT | Mobile/native QA reference, not default web guidance. |
| `icons.csv` | SKIP direct | Phosphor-specific; preserve app icon system. |
| `react-performance.csv` | SKIP direct | Belongs primarily to `sk-code`, not interface-design guidance. |
| `search.py` / `core.py` | ADAPT | Useful optional lookup engine if data remains large; avoid mandatory runtime dependency. |
| `design_system.py` | ADAPT | Useful generator for maintenance/research; avoid mandatory persistence/runtime writes. |
| Base/platform templates | SKIP direct | Packaging and assumptions conflict with house skill shape. |
| Quick-reference template | ADAPT | Good priority taxonomy, but needs compression and house-style rewrite. |

## Questions Answered

- Mostly answered asset classification for the primary CSV/data classes.
- Partially answered scripts/tooling: search and generator are useful as optional tooling, but mandatory runtime use and persistence should be avoided.

## Questions Remaining

- Exact house directory layout for adopted data and adapted references.
- Attribution file shape for MIT content alongside existing Apache-2.0 attribution.
- Whether stack-specific CSVs should be adopted, adapted, or left to `sk-code`.
- Final negative-knowledge list for synthesis.

## Ruled Out

- Directly merging Phosphor icon imports as a preferred house icon system. [SOURCE: .opencode/specs/design/001-sk-design-interface/external/ui-ux-pro-max-skill-main/src/ui-ux-pro-max/data/icons.csv:1-28]
- Directly merging React/Next performance data into `sk-design-interface`. [SOURCE: .opencode/specs/design/001-sk-design-interface/external/ui-ux-pro-max-skill-main/src/ui-ux-pro-max/data/react-performance.csv:1-16]
- Making external template workflow mandatory for the house skill. [SOURCE: .opencode/specs/design/001-sk-design-interface/external/ui-ux-pro-max-skill-main/src/ui-ux-pro-max/templates/base/skill-content.md:58-64]
- Copying the giant `design.csv` corpus wholesale into `SKILL.md` or the main principles reference. [SOURCE: .opencode/specs/design/001-sk-design-interface/external/ui-ux-pro-max-skill-main/src/ui-ux-pro-max/data/design.csv:1-80]

## Sources Consulted

- .opencode/specs/design/001-sk-design-interface/external/ui-ux-pro-max-skill-main/src/ui-ux-pro-max/data/products.csv:1-20
- .opencode/specs/design/001-sk-design-interface/external/ui-ux-pro-max-skill-main/src/ui-ux-pro-max/data/styles.csv:1-10
- .opencode/specs/design/001-sk-design-interface/external/ui-ux-pro-max-skill-main/src/ui-ux-pro-max/data/colors.csv:1-18
- .opencode/specs/design/001-sk-design-interface/external/ui-ux-pro-max-skill-main/src/ui-ux-pro-max/data/typography.csv:1-21
- .opencode/specs/design/001-sk-design-interface/external/ui-ux-pro-max-skill-main/src/ui-ux-pro-max/data/ux-guidelines.csv:1-24
- .opencode/specs/design/001-sk-design-interface/external/ui-ux-pro-max-skill-main/src/ui-ux-pro-max/data/ui-reasoning.csv:1-19
- .opencode/specs/design/001-sk-design-interface/external/ui-ux-pro-max-skill-main/src/ui-ux-pro-max/data/charts.csv:1-12
- .opencode/specs/design/001-sk-design-interface/external/ui-ux-pro-max-skill-main/src/ui-ux-pro-max/data/landing.csv:1-18
- .opencode/specs/design/001-sk-design-interface/external/ui-ux-pro-max-skill-main/src/ui-ux-pro-max/data/design.csv:1-80
- .opencode/specs/design/001-sk-design-interface/external/ui-ux-pro-max-skill-main/src/ui-ux-pro-max/data/app-interface.csv:1-31
- .opencode/specs/design/001-sk-design-interface/external/ui-ux-pro-max-skill-main/src/ui-ux-pro-max/data/icons.csv:1-28
- .opencode/specs/design/001-sk-design-interface/external/ui-ux-pro-max-skill-main/src/ui-ux-pro-max/data/react-performance.csv:1-16
- .opencode/specs/design/001-sk-design-interface/external/ui-ux-pro-max-skill-main/src/ui-ux-pro-max/scripts/search.py:56-114
- .opencode/specs/design/001-sk-design-interface/external/ui-ux-pro-max-skill-main/src/ui-ux-pro-max/scripts/core.py:17-72
- .opencode/specs/design/001-sk-design-interface/external/ui-ux-pro-max-skill-main/src/ui-ux-pro-max/scripts/core.py:103-195
- .opencode/specs/design/001-sk-design-interface/external/ui-ux-pro-max-skill-main/src/ui-ux-pro-max/scripts/design_system.py:27-33
- .opencode/specs/design/001-sk-design-interface/external/ui-ux-pro-max-skill-main/src/ui-ux-pro-max/scripts/design_system.py:163-246
- .opencode/specs/design/001-sk-design-interface/external/ui-ux-pro-max-skill-main/src/ui-ux-pro-max/templates/base/skill-content.md:5-18
- .opencode/specs/design/001-sk-design-interface/external/ui-ux-pro-max-skill-main/src/ui-ux-pro-max/templates/base/skill-content.md:50-64
- .opencode/specs/design/001-sk-design-interface/external/ui-ux-pro-max-skill-main/src/ui-ux-pro-max/templates/base/skill-content.md:77-109
- .opencode/specs/design/001-sk-design-interface/external/ui-ux-pro-max-skill-main/src/ui-ux-pro-max/templates/base/quick-reference.md:39-54
- .opencode/specs/design/001-sk-design-interface/external/ui-ux-pro-max-skill-main/src/ui-ux-pro-max/templates/platforms/opencode.json:1-21
- .opencode/skills/sk-design-interface/references/design_principles.md:35-87
- .opencode/skills/sk-design-interface/SKILL.md:14-17

## Assessment

- newInfoRatio: 0.68
- Novelty justification: This iteration converted the repo inventory into a concrete per-asset ADOPT/ADAPT/SKIP matrix and separated reusable data/search assets from template/runtime burdens.
- Confidence: High for primary data classification; medium for final house layout until current skill metadata and stack-specific CSVs are mapped.

## Reflection

- What worked and why: Sampling headers and first rows across data classes quickly exposed which files are reusable decision data versus implementation/platform scaffolding.
- What did not work and why: Looking for root-level `scripts/` and `templates/` failed because source-of-truth scripts and templates live under `src/ui-ux-pro-max/`; this reinforces using `CLAUDE.md` architecture notes and actual globs before path assumptions.
- What I would do differently: Inspect stack-specific CSVs and the current house skill metadata next before proposing final directory layout.

## Recommended Next Focus

Map adopted/adapted assets into a concrete `sk-design-interface` house structure, inspect stack-specific guidance ownership, and define license/attribution handling.

## Dead Ends

- Do not copy `design.csv` wholesale; use it as an optional source of examples or style edge cases only.
- Do not make `--design-system --persist` part of the house skill's required runtime workflow.
- Do not prefer Phosphor icons by default; preserve each app's existing icon library or design system.
- Do not absorb broad React performance advice into this skill; leave implementation performance to `sk-code`.
