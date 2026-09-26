# Guidelines for good results

**Write claims as single, checkable statements.** "The API returns JSON and supports pagination" is two claims. Split them so each gets its own verdict.

**Give the model everything it needs, and only that.** Evidence should contain the passages the claims depend on. Very long, unrelated evidence dilutes accuracy and costs more. For quote-level checks, locate the passage in code first.

**Put domain rules in descriptions.** For `classify`, `route`, and `ask --choice`, the option descriptions are where your rules go, not the label names. Always include an escape option (`--other`, `none`) unless every input is known to fit.

**Treat thresholds as starting points.** The defaults (`0.8` auto-accept, `0.75` block, `0.25` review, `0.7`/`0.35` exists, `0.6` min confidence) come from TypeSafe's published cookbooks. Run `jev` over a sample of your own data with `--json`, look at the distributions, and set thresholds that match the cost of a wrong answer. Then pin a model version with `-m jev-1.13.0` so an alias update does not silently shift results.

**Read confidence correctly.** For `choice` and `score` answers, confidence measures how concentrated the distribution is. Low confidence means the options were close, not that the model is wrong; look at `probabilities` before deciding. `noul` answers carry no separate confidence; a value near `0.5` means "as likely yes as no".

**Keep policy in your code.** `jev` reports judgments. Whether to block, retry, escalate, or ignore is your decision, expressed through `--fail-on` or by reading the JSON.

**Mind what you send.** Everything you pass goes to the configured provider. Do not include secrets or data you are not permitted to share. `--dry-run` shows the exact payload.

**Batch.** Several questions in one `ask` call, or many rows through `batch`, cost less and finish sooner than separate calls. Only input tokens are billed; the usage footer shows them.

**Prefer direct TypeSafe.** Proxies add latency and lag behind on model versions.
