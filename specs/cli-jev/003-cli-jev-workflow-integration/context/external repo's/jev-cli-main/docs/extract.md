# jev extract

Pull values out of text without letting the model invent them. Regexes find every candidate span in code, Jev picks the one that matches the field's meaning, code normalizes the verbatim value.

```bash
jev extract [text] --want <field> [--want <field>...] [--context <text>] [options]
```

## When to use

Invoices, emails, forms, logs: anything where you need specific values and cannot afford a hallucinated one. If no regex matches, the field is `none` and no API call is made.

## Fields

| Form | Example | Meaning |
| --- | --- | --- |
| builtin | `--want email,phone,date` | `email`, `phone`, `url`, `amount`, `date`, `percent`, `number` |
| custom regex | `--want invoice=/INV-\d+/` | Your pattern, named |
| custom regex with meaning | `--want po=/PO\s?\d{6}/:the purchase order number` | The description drives the question |
| aliased builtin | `--want "sender=email:the sender's address"` (quote descriptions with spaces) | Same pattern, different meaning, so two emails can be told apart |

## Options

| Option | Meaning | Default |
| --- | --- | --- |
| `[text]` | Text, `@file`, or `-` | stdin |
| `-w, --want <field>` | A field, repeatable; comma-separate builtins | required |
| `-c, --context <text>` | What the document is, e.g. `"supplier invoice"` | |
| `--min-confidence <p>` | Below this confidence the value is `review` | `0.6` |
| `--fail-on <list>` | Exit 2 when any field is `review` or `missing` | `none` |

## Output

Per field: `value` (verbatim), `normalized`, `confidence`, `action` (`auto`, `review`, `none`), `candidates` (how many spans matched).

| Builtin | Normalized form |
| --- | --- |
| `email` | lowercased |
| `phone` | digits only, leading `+` kept |
| `url` | trailing punctuation stripped |
| `amount` | `{"value": 1250, "currency": "USD"}` |
| `date` | `YYYY-MM-DD` |
| `percent`, `number` | number |

## Example

```bash
jev extract @invoice.txt --want amount,date --want invoice=/INV-\d+/ --context "supplier invoice"
```

```text
Field    Value          Normalized                        Conf  Action  Cands
-------  -------------  --------------------------------  ----  ------  -----
amount   $1,250.00      {"value":1250,"currency":"USD"}   0.97  auto    3
date     Sept 30, 2026  2026-09-30                        0.94  auto    2
invoice  INV-2231                                         1.00  auto    1
```

Patterns: [pre-parsed value extraction](https://docs.typesafe.ai/cookbooks/pre_parsed_value_extraction_cookbook), [date extraction](https://docs.typesafe.ai/cookbooks/date_extraction_cookbook).
