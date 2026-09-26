# jev route

Pick a handler for a request and fill that handler's arguments from closed sets, in one call.

```bash
jev route [request] (--handlers <list> | --handlers-json <ref>) [options]
```

## When to use

Turn free text into a typed call: a chat message into a bot command, a support request into a queue plus fields, a voice transcript into an action. Argument questions for every handler are asked in the same request; only the chosen handler's answers come back. A `none` handler is always available so the model can decline.

## Options

| Option | Meaning | Default |
| --- | --- | --- |
| `[request]` | Text, `@file`, or `-` | stdin |
| `-H, --handlers <list>` | Handlers without arguments: `refund:money back,cancel:stop an order,support` | |
| `--handlers-json <ref>` | Handlers with arguments, see below | |
| `-i, --instructions <text>` | Replace the default routing question | |
| `--min-confidence <p>` | Below this confidence the route is `review` | `0.6` |
| `--state-json` | Parse the request as JSON | |
| `--fail-on <list>` | Exit 2 on `review` or `unrouted` (no handler fits) | `none` |

## Handlers JSON

Each value is a description string, `null`, or `{"description", "args"}`. Each arg is one of:

```json
{"type": "choice", "options": ["full", "partial"]}
{"type": "choice", "options": {"full": "entire order", "partial": "some items"}, "instructions": "optional"}
{"type": "noul",   "instructions": "Does the customer need this immediately?"}
{"type": "score",  "levels": ["calm", "annoyed", "furious"]}
```

## Output

`handler` (or `null`), `confidence`, `action` (`auto`, `review`, `none`), `probabilities` over handlers, and `args` with a typed `value` per argument (`null` when the request does not say).

## Example

```bash
jev route "cancel order 4411 and refund the whole thing, today please" --handlers-json @handlers.json
```

```text
refund  conf 0.87  auto
[refund 0.90, cancel 0.08, support 0.01, none 0.01]
  scope = full  conf 0.93
  urgent = yes  p 0.88
```

```bash
jev route "$message" --handlers-json @handlers.json --fail-on unrouted --json | jq '{handler, args}'
```

Patterns: [function calling](https://docs.typesafe.ai/cookbooks/function_calling), [intent routing](https://docs.typesafe.ai/patterns/intent-routing).
