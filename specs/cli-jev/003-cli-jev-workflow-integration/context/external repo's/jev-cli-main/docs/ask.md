# jev ask

The general form: any state, any questions, one typed answer each. Every other command is a specialization of this.

```bash
jev ask [state] (--noul ... | --choice ... | --score ... | --questions <ref>) [options]
```

## When to use

When none of the purpose-built commands fits, or when you want several different questions answered about one input in a single request. Questions run in parallel over the same state, so asking five costs about the latency of one.

## Question types

| Flag | Answer | Shorthand |
| --- | --- | --- |
| `--noul` | Probability of "yes", 0 to 1 | `id=Question text?` |
| `--choice` | One option, a probability per option, a confidence | `id=Question text?\|optionA,optionB:description,optionC` |
| `--score` | A position on an ordered scale, a probability per level, a confidence | `id=Question text?\|low level,middle level,high level` |

Shorthand rules: `=` separates the id from the question, the first `|` separates the question from its options, options are comma separated. Write `\|` or `\,` for a literal pipe or comma. Ids use letters, digits, `_`, `-`, `.`.

## Options

| Option | Meaning |
| --- | --- |
| `[state]` | Text, `@file`, or `-`. Reads stdin when omitted and piped. |
| `--state-json` | Treat the state as JSON so you can send objects or arrays |
| `-Q, --questions <ref>` | A JSON questions map in the [TypeSafe API shape](https://docs.typesafe.ai/api), instead of shorthands |

## Example

```bash
jev ask @ticket.txt \
  --noul urgent="Does this convey urgency?" \
  --choice team="Which team?|billing:refunds and invoices,technical:bugs and outages,sales" \
  --score frustration="How frustrated is the customer?|calm,frustrated,very angry"
```

```text
urgent: 0.92
team: billing  conf 0.82  [billing 0.85, technical 0.08, sales 0.07]
frustration: 1.60  conf 0.71  [0 0.10, 1 0.20, 2 0.70]
```

## Tips

- One narrow judgment per question. Include an escape option (`other`, `none`) when nothing may fit.
- Describe options when the labels alone are ambiguous; put domain rules in the descriptions.
- A `noul` near 0.5 means "as likely yes as no", not medium intensity.

Docs: [primitives](https://docs.typesafe.ai/primitives), [speculative fan-out](https://docs.typesafe.ai/patterns/fan-out).
