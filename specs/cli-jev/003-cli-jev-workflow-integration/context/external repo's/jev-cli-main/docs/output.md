# Output formats

Every command renders the same result in six formats. Pick one with `--format`, or the shortcuts `--json` and `--md`. Set a default with `JEV_FORMAT` or `jev config set format <name>`.

| Format | What you get | Use it for |
| --- | --- | --- |
| `text` (default) | A padded table or short lines, colored on a terminal | Reading at the prompt |
| `json` | The full result, pretty-printed | Scripts, `jq` |
| `jsonl` | The full result on one line | Log pipelines, appending to files |
| `md` | GitHub-flavored Markdown: a table, or a field/value table for single answers | PR comments, `$GITHUB_STEP_SUMMARY`, chat |
| `csv` | The table only, RFC 4180 quoting | Spreadsheets |
| `tsv` | The table only, tab separated | `cut`, `awk` |

`--json` and `--format json` are the same. `--md` and `--format md` are the same.

## Rules that apply to all formats

- `-q` removes the token usage footer from `text` and `md`. Other formats never include it.
- `--no-color` or `NO_COLOR=1` removes color from `text`. Other formats never include it.
- Exit codes do not depend on the format. `jev screen ... --md` still exits 2 on `block`.
- `csv` and `tsv` need something tabular. Commands whose result is a single answer (`classify` single mode, `route`, `screen`, `ask`) emit `field,value` rows instead. `compact` with nothing to decide, and `auth login`, have no table; use `--json` or `--pluck` there.
- `--dry-run` always prints JSON.

## --pluck: one value out

`--pluck <path>` prints a single value from the JSON result instead of the whole thing. Paths use dots, `[n]` for an index, and `[]` to map over an array (one line per element).

```bash
jev classify @t.txt -l bug,feature --pluck label                 # bug
jev verify a b -e @spec.md --pluck results[].verdict             # one verdict per line
jev extract @inv.txt --want amount --pluck fields.amount.normalized.value
jev route "$msg" -H refund,cancel --pluck handler --fail-on unrouted && echo routed
```

Scalars print raw, arrays print one element per line, objects print as compact JSON. Combine with `--json` to get the plucked value as pretty JSON. Exit codes are unchanged, so `--pluck` works inside `$(...)` and `if`. A path that matches nothing is an error (exit 1) so a typo cannot read as an empty value; `batch` rows are the exception and print an empty line.

## batch

`jev batch` streams one JSON record per row by default (that is its `text` and `jsonl` behavior).

| Flag | Effect |
| --- | --- |
| `--format json` | Collect all records into one JSON array at the end |
| `--format md`, `csv`, `tsv` | A summary table with `id`, `ok`, `failed`, and a one-cell `result` (label, handler, action, verdicts, extracted values, ...) |
| `--pluck <path>` | One value per row, e.g. `--pluck result.label` |

## Examples

Post a verification report into a GitHub Actions job summary:

```bash
jev verify --claims @claims.txt -e @spec.md --md --fail-on none >> "$GITHUB_STEP_SUMMARY"
```

Feed match decisions into a spreadsheet:

```bash
jev match --dedupe @contacts.json --format csv > pairs.csv
```

Use a single field in a shell condition:

```bash
if [ "$(jev screen @page.html --pluck recommendation.action)" = "pass" ]; then …; fi
```
