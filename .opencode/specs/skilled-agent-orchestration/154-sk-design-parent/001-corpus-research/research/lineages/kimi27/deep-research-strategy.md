# Deep Research Strategy — kimi27 lineage

## Research Topic

Determine how to restructure the existing `sk-design-interface` skill into a parent skill named `sk-design` that contains multiple focused design sub-skills, grounded in the external design-skills corpus at `../external/` (41 standalone design-skill docs, the `designer-skills-main` 9-collection/97-skill model, and `apple-bento-grid-main`).

Produce three things:
1. The optimal sub-skill taxonomy of 4 to 7 children, each with its scope, boundaries, and the specific corpus sources that feed it.
2. Evidence for the parent structural model, comparing a single hub with nested mode packets against an umbrella router over a sibling family, including coupling and shared-runtime signals.
3. Per-child onboarding and backward-compatibility implications, including how to fold in the existing `sk-design-interface` and `sk-design-md-generator` skills.

## Known Context

- Existing internal skills:
  - `sk-design-interface` (v1.5.0.0): vendored Anthropic `frontend-design`; owns distinctive UI direction, palette/type/layout/motion choices, anti-default critique, two-pass process, quality floor, real-world reference grounding (Mobbin/Refero).
  - `sk-design-md-generator` (v1.0.0.0): extraction/format-fidelity engine; live URL → v3 Style Reference `DESIGN.md`; three-phase pipeline (extract/write/validate); separate from design-judgment.
- External corpus:
  - `designer-skills-main`: 9 plugins / 97 skills covering design-research, design-systems, ux-strategy, ui-design, interaction-design, prototyping-testing, design-ops, designer-toolkit, visual-critique.
  - 41 standalone markdown design-skill docs covering taste, style, layout, color, motion, critique, accessibility, presentation, etc.
  - `apple-bento-grid-main`: narrow, output-oriented skill for Apple-style bento grids.
- Structural precedents:
  - `deep-loop-workflows` uses a single hub (`SKILL.md`) + `mode-registry.json` + one `graph-metadata.json`, with verbatim mode packets nested underneath (no per-packet graph metadata).
  - `sk-code` is a single broad skill with internal surface routing; not a parent of independent siblings.
- `resource-map.md` not present at spec folder; skipping coverage gate.

## Key Questions

1. Which 4-7 child skills best cover the corpus while keeping each child sharply bounded?
2. Which corpus sources feed each child, and where do boundaries prevent overlap?
3. Does the parent use a hub-with-nested-packets model or an umbrella-router-over-siblings model, and what evidence supports the choice?
4. How do the existing `sk-design-interface` and `sk-design-md-generator` skills map into children without losing their current trigger coverage?
5. What is the minimal onboarding/back-compat path for each child?

## Answered Questions

*None yet.*

## Non-Goals

- No actual skill scaffolding or file moves in this phase.
- No implementation of the parent skill beyond research recommendations.
- No web research outside the local corpus.

## Stop Conditions

- All five key questions answered with corpus citations.
- 7 iterations reached (maxIterations).
- Convergence threshold holds for consecutive low-yield iterations.

## What Worked

- Reading the CHANGELOG plus one skill per plugin quickly exposed the 9-plugin/97-skill discipline boundaries.
- The standalone style skills cleanly separate into *direction* (archetype selection, dials, anti-default) and *foundations* (tokens, color, type, grid).
- Motion is a distinct implementation child; `sk-design-interface` already sets motion intent at the direction layer but lacks implementation/audit depth.
- Critique/audit/accessibility/polish/clarify form a single evaluation child; copy clarity fits there rather than as a separate writing child.
- The hub-with-nested-packets model is the preferred parent structure, supported by `deep-loop-workflows` precedent and the existing `sk-design-*` family metadata.
- `sk-design-interface` folds into `sk-design-direction`; `sk-design-md-generator` folds into `sk-design-system`; presentation sources justify a sixth child.
- Final taxonomy: 6 children (`direction`, `foundations`, `motion`, `critique`, `system`, `presentation`) with clear corpus-source assignments and boundary rules.

## What Failed

- None.

## Exhausted Approaches

- None.

## Ruled-Out Directions

- `output-skill.md` is not a `sk-design` child; it is a generic full-output enforcement utility.
- Splitting motion into multiple top-level children is unnecessary; a single `sk-design-motion` child with references is cleaner.
- A separate `sk-design-writing` child is unnecessary; `clarify`/`ux-writing` fit under `sk-design-critique`.
- The umbrella-router-over-siblings model is not preferred; the hub model preserves family identity and advisor discoverability.
- `sk-design-md-generator` is not folded into `sk-design-foundations`; it becomes its own `sk-design-system` child.
- A 5-child taxonomy without a presentation child was rejected; output-format skills are distinct enough to warrant their own packet.

## Next Focus

Proceed to phase_synthesis and produce `research.md`.
