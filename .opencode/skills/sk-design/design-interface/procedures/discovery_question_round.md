# Discovery Question Round

| Field | Value |
|---|---|
| Purpose | Help `design-interface` decide whether to ask a bundled question round before starting ambiguous design work. |
| Owning mode | `design-interface` |
| Source reference | `discovery-questions.md` |
| Trigger | Use after hub routing selects interface and the request lacks design context, audience, fidelity, variation count, novelty level, tweak needs, or focus axis. |
| Output contract | A compact question set grouped by design impact, with already-provided facts excluded and minor choices marked as mode-owned decisions. |
| Proof gate | The response shows the missing facts that would change design direction, caps the question set to only material items, and records which minor decisions the mode will make without asking. |
| Privacy rule | This is a private interface procedure card, not a public question-mode skill. |

## Read-Only Compatibility

The card requires only reading the prompt and any supplied artifacts. `design-interface` may return questions or proceed with stated assumptions; it must not require writing files, running commands, or invoking a separate tool to use this card.

## Procedure

1. Read the provided brief and attached references before asking anything.
2. Ask only when the answer changes route, register, fidelity, scope, or acceptance criteria.
3. Bundle questions into one round rather than asking serially.
4. Prefer structured choices when possible, but keep freeform escape hatches for brand, reference, or constraint details.
5. After answers arrive, recap only the choices that alter the design plan.

## Conflict Rule

If `aesthetic_direction.md` also matches, run this card first only when existing context is insufficient to choose or confirm a direction.
