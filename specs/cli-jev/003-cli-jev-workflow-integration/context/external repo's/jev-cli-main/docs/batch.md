# jev batch

Run a command over many rows with a concurrency pool. One JSON record per row, in input order.

```bash
jev batch <command> --input <ref> [--output <path>] [--concurrency <n>] [--fail-fast] -- <flags for that command>
```

Batchable: `classify`, `screen`, `extract`, `ask`, `verify`, `find`, `rerank`, `route`.

## When to use

Anything over a handful of items: a backlog to label, a folder of emails to extract from, a list of claims against one spec, a set of queries against one candidate list.

## Options

| Option | Meaning | Default |
| --- | --- | --- |
| `<command>` | The command to run per row | required |
| `-i, --input <ref>` | `@file` or `-`. Plain lines (one text per line), or JSONL objects with `text` (or `state`) and an optional `id`. Extra fields pass through as `meta`. | required |
| `-o, --output <path>` | Write records to a file instead of stdout | stdout |
| `--concurrency <n>` | Parallel requests | `4` |
| `--fail-fast` | Stop scheduling new rows after the first error | off |
| `-- <flags>` | Everything after `--` goes to the sub-command, minus its text argument, which each row supplies | |

For `verify` the row is a claim and `--evidence` is shared; for `find` and `rerank` the row is a query and the candidates are shared.

## Output

One line per row: `{"index", "id", "ok", "failed", "result" | "error", "meta"}`. `failed` means the sub-command's `--fail-on` matched for that row. A summary goes to stderr.

Exit `1` if any row errored, `2` if any row matched `--fail-on`, else `0`.

## Example

```bash
jev batch classify -i @issues.jsonl -o labeled.jsonl -- -l bug,feature,question,docs --other --fail-on review
jq -r 'select(.failed) | .id' labeled.jsonl      # rows a human should look at

jev batch screen -i @pages.jsonl --concurrency 8 -- --purpose "extract pricing"
jev batch verify -i @claims.txt -- --evidence @spec.md --fail-on contradicted,unsupported
```

```bash
# Build JSONL from files
for f in inbox/*.eml; do jq -n --arg id "$f" --arg text "$(cat "$f")" '{id:$id,text:$text}'; done \
  | jev batch extract -i - -- --want sender=email:the sender --want reply_by=date:the reply deadline
```
