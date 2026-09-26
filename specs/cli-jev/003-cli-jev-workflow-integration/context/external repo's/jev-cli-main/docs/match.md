# jev match

Decide whether pairs of records describe the same thing: `same`, `different`, or `unclear`.

```bash
jev match (--pairs <ref> | --left <ref> --right <ref> | --dedupe <ref>) [--kind <text>] [options]
```

## When to use

Dedupe a contact export, align your catalog with a supplier's, merge duplicate issues. One Score per pair has three levels that map to actions: leave unlinked, send to a person, merge. The decision is the most likely level, so there is no threshold to tune.

## Options

| Option | Meaning |
| --- | --- |
| `-p, --pairs <ref>` | JSON: `[["a","b"], ...]` or `[{"left": ..., "right": ...}]`. Items are strings or `{id, text}`. |
| `--left <ref> --right <ref>` | Two JSON item lists; every left item is compared with every right item |
| `-d, --dedupe <ref>` | One JSON item list; every pair within it is compared |
| `-k, --kind <text>` | What the records are, e.g. `"customer contacts"`. Sharpens the question. |
| `--fail-on <list>` | Exit 2 when any pair is `same`, `unclear`, or `different` |

Limit: 200 pairs per call, sent in groups of 50. For large sets, block first (by postcode, name prefix, category) and match within blocks.

## Output

`results[]` with `left`, `right` (ids), `left_text`, `right_text`, `decision`, `confidence`, `probabilities` (`different`, `unclear`, `same`); `summary` counts.

`unclear` is a real outcome meaning a person should look, not a weak `same`.

## Example

```bash
jev match --dedupe @contacts.json --kind "customer contacts"
```

```text
Decision   Conf  Left    Right
---------  ----  ------  ------
same       0.91  c_1042  c_2210
unclear    0.48  c_1042  c_3187
different  0.97  c_2210  c_3187

1 same · 1 unclear · 1 different
```

```bash
# Only the pairs a human should check
jev match --dedupe @contacts.json --json | jq -r '.results[] | select(.decision=="unclear") | "\(.left) ~ \(.right)"'
```

Pattern: [entity alignment cookbook](https://docs.typesafe.ai/cookbooks/entity_alignment).
