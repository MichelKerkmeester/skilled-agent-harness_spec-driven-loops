# jev screen

Judge text before an AI agent reads it: is it trying to hijack the agent, does it have substance, is it relevant to the task.

```bash
jev screen [text] [--purpose <text>] [options]
```

## When to use

On every untrusted input an agent consumes: fetched web pages, emails, tickets, uploaded documents, third-party tool output. It costs less than reading the page.

## Options

| Option | Meaning | Default |
| --- | --- | --- |
| `[text]` | Text, `@file`, or `-`. Reads stdin when omitted and piped. | stdin |
| `-p, --purpose <text>` | What the consumer is trying to do. Enables the relevance check and the `skip` action. | |
| `--block-at <p>` | Injection probability that triggers `block` | `0.75` |
| `--review-at <p>` | Injection probability that triggers `review` | `0.25` |
| `--fail-on <list>` | Exit 2 when the recommendation is `block`, `review`, or `skip`. `none` to always exit 0. | `block` |

## Output

| Field | Meaning |
| --- | --- |
| `probabilities.injection` | The text contains instructions aimed at an AI agent |
| `probabilities.substance` | The text has real content, not an error page or boilerplate |
| `probabilities.relevance` | The text is useful for `--purpose` (null without a purpose) |
| `recommendation.action` | `pass`, `review`, `block`, or `skip` |
| `recommendation.reason` | Which threshold fired |

`block` and `review` come from the injection probability; `skip` from low substance or relevance. The recommendation is advisory: `jev` never blocks anything itself.

## Example

```bash
curl -s https://shop.example/sale | jev screen --purpose "summarize the products"
```

```text
BLOCK  injection probability 0.99 >= block threshold 0.75
injection 0.99 · substance 0.97 · relevance 0.97
```

```bash
# Only feed the page to the agent if it is safe and relevant
if printf '%s' "$page" | jev screen --purpose "$task" --fail-on block,review,skip -q; then
  printf '%s' "$page" | my-agent --context -
fi
```

Pattern: [guardrails cookbook](https://docs.typesafe.ai/cookbooks/llm_guardrails).
