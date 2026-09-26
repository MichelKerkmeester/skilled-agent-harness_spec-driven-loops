# jev find

Pick the candidate that best answers a plain-language query, and say whether any candidate answers it at all. No index, no embeddings.

```bash
jev find <query> (--files <paths...> | --candidates <ref> | --lines <ref>) [options]
```

## When to use

"Which file covers X", "which note mentions Y", "which line of the terms answers Z". Use it when the query is a concept rather than an identifier you could grep. For ordering and filtering a whole result list, use [`rerank`](rerank.md) instead.

## Options

| Option | Meaning | Default |
| --- | --- | --- |
| `<query>` | What you are looking for | required |
| `-f, --files <paths...>` | Each file is a candidate; its id is the path | |
| `-c, --candidates <ref>` | JSON: `["text"]`, `[{"id","text"}]`, or `{"id": "text"}` | |
| `-l, --lines <ref>` | Each non-empty line of a file or stdin is a candidate with id `L<line number>` (1-based, counted in the source file, blank lines included) | |
| `-k, --top-k <n>` | How many ranked results to show | `5` |
| `--found <p>` | Exists probability at or above which the verdict is `answered` | `0.7` |
| `--absent <p>` | Exists probability below which the verdict is `absent`; between is `partial` | `0.35` |
| `--fail-on <list>` | Exit 2 when the exists verdict is `absent` or `partial` | `none` |

Limits: 250 candidates per call; each text is truncated at 2,000 characters.

## Output

`top[]` with `id`, `probability`, `text`; `exists` and `exists_verdict` (`answered`, `partial`, `absent`).

Ranking always produces a winner because the probabilities sum to 1. Check `exists_verdict` before trusting `top[0]`.

## Example

```bash
jev find "how do I rotate API keys" --files docs/*.md -k 2
```

```text
answered  (exists 0.99)  how do I rotate API keys

#  Prob  Id               Text
-  ----  ---------------  ------------------------------------------------------------
1  0.99  docs/auth.md     To rotate an API key: create a new key in Settings > Keys, …
2  0.01  docs/billing.md  Invoices are issued monthly and can be downloaded as PDF.
```

Pattern: [semantic find cookbook](https://docs.typesafe.ai/cookbooks/semantic_find).
