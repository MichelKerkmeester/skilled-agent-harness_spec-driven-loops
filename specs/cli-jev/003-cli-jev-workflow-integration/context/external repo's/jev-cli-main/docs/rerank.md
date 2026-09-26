# jev rerank

Score every candidate's relevance to a query independently, then sort. Several can be relevant, or none.

```bash
jev rerank <query> (--files <paths...> | --candidates <ref> | --lines <ref>) [options]
```

## When to use

In front of any search: take the top 30 from BM25 or a vector index, keep what Jev says is relevant. The cookbook shows top-1 accuracy rising from 5% to 18% with one judgment per pair. Where [`find`](find.md) asks "which one is best", `rerank` asks "is this one relevant" for each.

## Options

| Option | Meaning | Default |
| --- | --- | --- |
| `<query>` | What results should be relevant to | required |
| `-f/-c/-l` | Candidates, same forms as `find` | |
| `-k, --top-k <n>` | How many ranked results to return | `10` |
| `--min <p>` | Relevance at or above which a candidate is `kept` | `0.5` |
| `--criteria <text>` | What counts as relevant, e.g. `"a passage stating the rule, not commentary"` | |
| `--fail-on <list>` | Exit 2 on `empty` (nothing kept) | `none` |

## Output

`ranked[]` with `id`, `relevance`, `kept`, `text`; `kept[]` ids. Up to 250 candidates per call.

## Example

```bash
my-search "$q" --json | jev rerank "$q" -c - --min 0.6 --json | jq '.kept'
```

```text
2 of 5 shown are relevant (min 0.6)  statute of limitations for contract claims

#  Rel        Id    Text
-  ----  ----  ----  ------------------------------------------------------------
1  0.94  keep  p17   An action for breach of a written contract must be brought…
2  0.71  keep  p03   The limitations period begins when the breach occurs…
3  0.22  drop  p09   Courts have discussed equitable tolling in other contexts…
```

Pattern: [reranking cookbook](https://docs.typesafe.ai/cookbooks/rerank_typesafe).
