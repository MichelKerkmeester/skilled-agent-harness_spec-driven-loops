# Reasoning effort and developer-role compat

The checked-in route patch `.dsh/patches/route-llmgateway-deepseek.patch.yml` sets `reasoningEffort: max` (line 24), declares `reasoningEfforts` for the model (line 16) and sets `compat.supportsDeveloperRole: false` (line 12). The OK run in `route-llmgateway.*` therefore ran at `max`.

- `UNSUPPORTED_REASONING_EFFORT`: absent. `route-llmgateway.stderr.txt` is empty (0 bytes), and the stream carries a `thinking` event before the `text` event.
- Developer-role compat: the route completes with `supportsDeveloperRole: false`. The `true` setting was not probed, because the closed-roster rule admits only the checked-in patches, so a variant patch cannot be dispatched. The recorded need is: keep `false`, which is proven to work; whether the gateway also accepts a developer role is UNKNOWN.
