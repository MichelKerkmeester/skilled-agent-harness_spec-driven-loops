---
title: "Finding: the improvement mode has no working name on the append CLI"
trigger_phrases: []
---
# Finding: the improvement mode has no working name on the append CLI

Confirmed by execution, not by reading. Both candidate names fail, each rejected
by the layer that the other name satisfies:

```
--mode improvement              -> {"ok":false,"phase":"authority","code":"AUTHORITY_DENIED",
                                    "reason":"Mode 'deep-improvement' is not in the frozen authority
                                    order: deep-research, deep-review, deep-ai-council,
                                    deep-improvement-common, ..."}
--mode deep-improvement-common  -> {"ok":false,"phase":"runtime","code":"RUNTIME_ERROR",
                                    "reason":"Unsupported mode: deep-improvement-common"}
```

`normalizeMode` maps `improvement` and `deep-improvement` to `deep-improvement`, and the adapter
switch is keyed on that same string — so the adapter resolves but the frozen authority order,
which spells the mode `deep-improvement-common`, refuses it. Spell it the way the authority order
does and the authority phase passes, but the adapter has no case for it.

Every other fleet mode uses one spelling in both layers. Exactly one of the seven is unroutable.

## Why it is not fixed here

The predecessor phase recorded this as belonging to the fleet phase. Running it shows the fix does
not fit inside this phase's scope. The name is load-bearing in four places, two of which this
phase's spec routes back to `001`:

| Site | Surface | In this phase's scope? |
|------|---------|------------------------|
| `scripts/append-mode-event.cjs:109,179,182` | the append CLI | yes |
| `lib/mode-append-gateway/append-mode-event.ts:173` | the gateway — maps the mode to `improvement-ledgers` | no, the spec routes gateway defects to `001` |
| `lib/legacy-projections/legacy-projection-manifest.ts:170,178` | the projection manifest, as `legacyWriter` | no, same clause |
| `tests/unit/append-mode-event-cli.vitest.ts:299` | an existing assertion on the current spelling | it would go red |

Renaming only the CLI would make the gateway's surface mapping miss, so the fix has to move all
four together or none. `blinded-adjudication` also defines its own `deep-improvement` constant,
which is a different subsystem and is almost certainly unrelated — but it is close enough in name
that whoever takes this should confirm rather than assume.

## What it costs while it stands

The fleet driver is unaffected today: it takes its mode names from the authority order directly and
never passes through `normalizeMode`, which the dry run confirms by listing
`deep-improvement-common` and reading its record under that exact name.

It becomes load-bearing the moment the flip exists. `deep-improvement-common` is third in the fleet
order, and its enablement step has to migrate the write protocol — which means appending through
the CLI, which is precisely the path that has no working name. The fleet run would stop there.

## Resolved

Fixed where this phase's scope said it belonged: the gateway and the append CLI, both owned by the
append-gateway phase, which is where this phase's Out of Scope clause routes gateway defects. The
mode now normalizes to the authority spelling, the adapter is keyed on it, and the gateway's surface
resolution accepts it — the third site was required, not cleanup, because without it the write would
have resolved to a surface id that does not exist rather than failing.

The blast radius named above was re-measured rather than trusted. The projection manifest did not
need to change: its `legacyWriter` is the historical writer name, not a routing key. The adjudication
subsystem's like-named constant is a decision kind in a separate registry and was confirmed
unrelated, as this finding asked.

Evidence, including the negative control that turns the new guard red: the append-gateway phase's
`scratch/unroutable-mode.md`.

The cost this finding predicted — that the fleet run would stop at the third mode the moment the flip
exists — no longer applies. A guard now walks the frozen authority order and requires every mode in
it to route, so a recurrence fails at the mode that drifted instead of at a fleet run.
