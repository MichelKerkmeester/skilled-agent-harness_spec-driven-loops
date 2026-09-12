# Live probe: session-affinity headers on the `llmgateway` provider

**Question this answers:** `sendSessionAffinityHeaders: true` adds custom request headers to every call
on the provider. Some proxies, CDNs and WAFs reject unknown headers with 403, which would be a far worse
outcome than the advisory being silenced. Does this endpoint accept them?

**Date:** 2026-09-11 · **Endpoint:** `POST https://api.llmgateway.io/v1/chat/completions`
**Auth:** `${LLMGATEWAY_API_KEY}` (never printed)

## What Pi sends

From the installed adapter (`pi-ai/dist/api/openai-completions.js`, `createClient`):

```js
if (sessionId && compat.sendSessionAffinityHeaders) {
    if (compat.sessionAffinityFormat === "openrouter") headers["x-session-id"] = sessionId;
    else {
        if (compat.sessionAffinityFormat === "openai") headers.session_id = sessionId;
        headers["x-client-request-id"] = sessionId;
        headers["x-session-affinity"] = sessionId;
    }
}
```

`sessionAffinityFormat` auto-detects to `"openai"` for a non-OpenRouter base URL, so the probe sends
exactly the three headers Pi would send: `session_id`, `x-client-request-id`, `x-session-affinity`.

## Result

First attempt used `max_tokens: 16`, which the model spent entirely on reasoning tokens, so the body
came back **HTTP 200 with an empty content string** — an acceptance signal, but a thin one. Repeated
with a larger budget for a legible answer:

```
HTTP 200 | CONTENT: ok
USAGE: {'prompt_tokens': 37, 'completion_tokens': 72, 'prompt_cache_hit_tokens': 0, 'prompt_cache_miss_tokens': 37}
```

Full response in `scratch/live-affinity-probe.json`.

The API key hash, organization id and project id in that file were redacted after the probe ran. Every field this claim rests on, including the 200 status and the routing result, is untouched.

## Verdict

The endpoint accepts all three affinity headers and answers normally. Enabling
`providers.llmgateway.compat.sendSessionAffinityHeaders` does not break the channel.

**Not proven here:** that the gateway actually uses the headers to pin a session to one upstream, so no
cache-hit improvement is claimed from this probe. The declaration is only licensed as "accepted, not
rejected". If a 403 ever appears on this channel, the code path treats an explicit
`sendSessionAffinityHeaders: false` as a deliberate opt-out, which also stops the advisory.
