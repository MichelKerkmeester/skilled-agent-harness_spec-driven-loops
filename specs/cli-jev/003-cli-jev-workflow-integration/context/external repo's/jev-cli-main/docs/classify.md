# jev classify

Assign labels from a set you define: one label, several labels, or a path through a hierarchy.

```bash
jev classify [text] (--labels <list> | --labels-json <ref> | --taxonomy <ref>) [--multi] [--other] [options]
```

## When to use

Label issues, route tickets, tag content, sort documents into a catalog. Prefer it over `ask --choice` when the task is "pick a bucket": it adds an `other` escape, confidence gating, multi-label, and hierarchies.

## Modes

| Mode | Flag | Returns |
| --- | --- | --- |
| Single (default) | `--labels a,b:description,c` | One `label`, `confidence`, full `probabilities`, `action` (`auto` or `review`) |
| Multi | `--multi` | One probability per label; `applied` lists those at or above `--threshold` |
| Taxonomy | `--taxonomy @tree.json` | A `path` decided one level per request, with per-level confidence |

## Options

| Option | Meaning | Default |
| --- | --- | --- |
| `[text]` | Text, `@file`, or `-` | stdin |
| `-l, --labels <list>` | Comma-separated labels, optionally `label:description`. Escape a literal comma as `\,`. | |
| `--labels-json <ref>` | `["a","b"]`, `[{"label","description"}]`, or `{"label": "description"}` | |
| `-t, --taxonomy <ref>` | Nested JSON, e.g. `{"hardware": {"laptop": null, "phone": null}, "software": ["os", "app"]}` | |
| `--multi` | One yes/no probability per label instead of picking one | off |
| `--other` | Add an `other` option so the model can say nothing fits (single and taxonomy) | off |
| `-i, --instructions <text>` | Replace the default question | |
| `--min-confidence <p>` | Below this confidence the result is `review` | `0.6` |
| `--threshold <p>` | Multi: probability at or above which a label applies | `0.5` |
| `--state-json` | Treat the input as JSON | |
| `--fail-on <list>` | Exit 2 on `review`, `other`, or `unlabeled` (multi: nothing applied) | `none` |

## Example

```bash
jev classify "Login fails after the latest update" \
  -l "bug:defect in an existing feature,feature:new capability,question" --other
```

```text
bug  conf 0.91  auto
[bug 0.93, question 0.04, feature 0.02, other 0.01]
```

## Tips

- Put your domain rules in the label descriptions, not in the label names.
- Always add `--other` unless every input is known to fit a label.
- A taxonomy costs one request per level. Leaf lists (`["os", "app"]`) are shorthand for `{"os": null, "app": null}`.

Patterns: [classification using confidence](https://docs.typesafe.ai/cookbooks/classification_using_confidence), [hierarchical classification](https://docs.typesafe.ai/cookbooks/hierarchical_classification).
