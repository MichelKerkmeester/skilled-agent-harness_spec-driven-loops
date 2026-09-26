# jev verify

Check claims against evidence. Each claim gets a verdict, the full probability distribution, a confidence, and whether it can stand automatically or needs a person.

```bash
jev verify [claims...] --evidence <ref> [--evidence <ref>...] [options]
```

## When to use

Fact-check a PR description against its diff, a report against its sources, or an AI summary against the document it summarizes. For quote-level citation checks, locate the passage in code first and send only that.

## Options

| Option | Meaning | Default |
| --- | --- | --- |
| `[claims...]` | Claims as arguments | |
| `-c, --claims <ref>` | Claims from a file or stdin: one per line, or a JSON array of strings | |
| `-e, --evidence <ref>` | Evidence text, `@file`, or `-`. Repeat for several sources; files are labeled by filename. | required |
| `--evidence-json <ref>` | Evidence as JSON: `["text"]`, `[{"id","text"}]`, or `{"id": "text"}` | |
| `--auto-accept <p>` | Confidence at or above which a verdict is `auto` rather than `review` | `0.8` |
| `--fail-on <list>` | Exit 2 if any result is `contradicted`, `unsupported`, `review`, or `unknown`. `none` to always exit 0. | `contradicted` |

## Output

| Field | Meaning |
| --- | --- |
| `results[].verdict` | `verified`, `contradicted`, `unsupported` (evidence is silent), or `unknown` |
| `results[].confidence` | 0 to 1, how concentrated the distribution is |
| `results[].action` | `auto` or `review` |
| `results[].probabilities` | `supports`, `contradicts`, `says_nothing` |
| `results[].supporting_evidence` | The evidence id the claim rests on, when more than one source was given |
| `summary` | Counts of each verdict and of `review` |

## Example

```bash
jev verify --claims @claims.txt -e @spec.md -e @rfc.txt --fail-on contradicted,unsupported
git diff main | jev verify "This change only touches tests" --evidence -
```

```text
#  Verdict       Conf  Action  Claim                             Source
-  ------------  ----  ------  --------------------------------  -------
1  contradicted  1.00  auto    Helmets are optional for adults   spec.md
2  verified      0.96  auto    Reflective gear is mentioned      rfc.txt
3  unsupported   0.71  review  The fine is 50 dollars            -

1 verified · 1 contradicted · 1 unsupported · 1 need review (auto-accept ≥ 0.8)
```

## Tips

- One checkable statement per claim. Split compound sentences.
- `unsupported` often means the wrong source was supplied, not that the claim is false.
- Batch many claims against the same evidence with `jev batch verify -i @claims.txt -- -e @spec.md`.

Pattern: [citation check cookbook](https://docs.typesafe.ai/cookbooks/citation_check).
