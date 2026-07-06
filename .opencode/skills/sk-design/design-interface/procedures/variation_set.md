# Variation Set

| Field | Value |
|---|---|
| Purpose | Help `design-interface` produce multiple materially distinct design options instead of small cosmetic variants. |
| Owning mode | `design-interface` |
| Source reference | `generate-variations.md` |
| Trigger | Use when the request asks for options, alternatives, several directions, multiple takes, or comparison variants. |
| Output contract | A set of usually 3 to 5 named variations, each with explicit axes, rationale, risk level, and recommendation. |
| Proof gate | Each variation differs on meaningful dimensions such as layout, hierarchy, interaction, type, density, copy, or tone; the mode recommends one option rather than treating all options as equal. |
| Privacy rule | This is private variation guidance inside `design-interface`, not a public variation skill. |

## Read-Only Compatibility

`design-interface` can return variation specs, critique notes, and handoff-ready descriptions without writing implementation files.

## Procedure

1. Establish what is being varied and what context must remain stable.
2. Pick 2 to 4 axes before drafting options.
3. Order options from conventional to riskier so comparison is legible.
4. Avoid near-duplicate variants that differ only by accent color or shadows.
5. End with a direct recommendation and the next follow-up path.

## Related Cards

- `wireframe_exploration.md` for low-fidelity structural options.
- `aesthetic_direction.md` when the axis is the whole visual language.
