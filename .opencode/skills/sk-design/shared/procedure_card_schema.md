# Private Procedure Card Schema

Private procedure cards are internal reference material for the existing `sk-design` modes. They add repeatable process without adding public skill identities, public modes, or tool requirements beyond the owning mode's allowed surface.

## Required Fields

Every private card must use these fields in this order:

| Field | Requirement |
|---|---|
| Purpose | One sentence describing the behavior the card adds to the owning mode. |
| Owning mode | One of `design-interface`, `design-foundations`, `design-motion`, `design-audit`, `design-md-generator`, or `shared` with an explicit owning reviewer. |
| Source reference | External source filename only, or `No external source` with rationale. Do not paste source prose. |
| Trigger | Concrete request patterns or mode conditions that make the card applicable after the public hub has already selected a mode. |
| Output contract | The exact advisory artifact, matrix, handoff, or extraction result the mode must produce. |
| Proof gate | Evidence required before the mode can say the card was followed. |
| Privacy rule | Statement that the card is private implementation guidance and does not create a public OpenCode skill or mode. |

## Optional Fields

Use these only when they materially improve reviewability:

| Field | Use |
|---|---|
| Placement rationale | Required for cards under `shared/procedures/`; optional for mode-local cards. |
| Related cards | Names of cards that may be loaded before or after this one. |
| Conflict rule | How to choose between overlapping cards inside the same mode. |
| Read-only compatibility | Required for `design-interface`, `design-foundations`, `design-motion`, and `design-audit` cards. State that the mode may cite the card and return guidance or handoff content without writing files or running commands. |

## Selection Rules

1. The public `sk-design` hub chooses a current mode first through `mode-registry.json`.
2. The selected mode evaluates only its own `procedures/` folder plus shared cards whose trigger names that mode.
3. A mode-local exact trigger beats a shared card.
4. When two mode-local cards match, choose the card with the narrower output contract.
5. If no card matches, the mode follows its existing `SKILL.md` behavior and states that no private procedure card applied.
6. If a request spans multiple modes, the parent hub still decides the bundle. Cards do not change public routing.

## Source Adaptation Rules

1. Cite only the external source filename.
2. Preserve intent, not phrasing.
3. Rewrite procedure steps into OpenCode-native terms and the owning mode's tool boundary.
4. Do not include long source excerpts, starter code, command snippets, or proprietary prompt text from external files.
5. Review cards by comparing purpose, trigger, output contract, and proof gate against the source theme.

## Shared Placement Rule

Use `shared/procedures/` only when the procedure genuinely coordinates two or more modes and cannot be owned by one mode without duplicating orchestration. Every shared card must name one owning reviewer who is responsible for keeping the card aligned with the mode contracts.
